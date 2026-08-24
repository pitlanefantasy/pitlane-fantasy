from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verificar_password, hashear_password, crear_token, get_usuario_actual
from app.models.usuario import Usuario
from app.models.liga import Liga, LigaUsuario
from app.schemas.usuario import UsuarioCreate, UsuarioResponse
from app.services.email import generar_token, enviar_email_verificacion, enviar_email_reset_password
from app.core.validaciones import validar_password_fuerte
from pydantic import BaseModel, field_validator

router = APIRouter(prefix="/usuarios", tags=["usuarios"])

TEMPORADA_ACTUAL = 2026  # cambiar a mano cuando empiece la temporada 2027
INTENTOS_LIBRES = 4       # los primeros 4 fallos no bloquean nada
MAX_BLOQUEO_SEGUNDOS = 900  # techo de 15 minutos


class SolicitudReset(BaseModel):
    email: str


class ConfirmarReset(BaseModel):
    token: str
    password_nueva: str

    @field_validator("password_nueva")
    @classmethod
    def validar_password(cls, v):
        return validar_password_fuerte(v)


def calcular_bloqueo_segundos(intentos_fallidos: int) -> int:
    """Bloqueo escalonado: 0 hasta el intento 4, luego 1s, 2s, 4s, 8s... hasta un techo de 15 min."""
    if intentos_fallidos <= INTENTOS_LIBRES:
        return 0
    exponente = intentos_fallidos - INTENTOS_LIBRES - 1
    return min(2 ** exponente, MAX_BLOQUEO_SEGUNDOS)


def formatear_tiempo(segundos: int) -> str:
    if segundos < 60:
        return f"{segundos} segundo(s)"
    minutos = segundos // 60
    return f"{minutos} minuto(s)"


# POST /usuarios/ → registrar usuario
@router.post("/", response_model=UsuarioResponse)
def crear_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    db_usuario = db.query(Usuario).filter(Usuario.email == usuario.email).first()
    if db_usuario:
        raise HTTPException(status_code=400, detail="El email ya está registrado")

    token = generar_token()
    nuevo_usuario = Usuario(
        email=usuario.email,
        nombre=usuario.nombre,
        password_hash=hashear_password(usuario.password),
        token_verificacion=token,
    )
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)

    liga_global = db.query(Liga).filter(
        Liga.es_global == True,
        Liga.temporada == TEMPORADA_ACTUAL
    ).first()
    if liga_global:
        db.add(LigaUsuario(liga_id=liga_global.id, usuario_id=nuevo_usuario.id))
        db.commit()

    try:
        enviar_email_verificacion(nuevo_usuario.email, nuevo_usuario.nombre, token)
    except Exception:
        pass

    return nuevo_usuario


# GET /usuarios/{id} → obtener usuario
@router.get("/{usuario_id}", response_model=UsuarioResponse)
def obtener_usuario(
    usuario_id: int,
    db: Session = Depends(get_db),
    usuario_actual: dict = Depends(get_usuario_actual),
):
    if usuario_id != usuario_actual.get("id") and not usuario_actual.get("es_admin"):
        raise HTTPException(status_code=403, detail="No tienes permiso para ver este usuario")
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario


# GET /usuarios/verificar/{token} → confirma el email al pulsar el enlace del correo
@router.get("/verificar/{token}")
def verificar_email(token: str, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.token_verificacion == token).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Enlace de verificación no válido")
    if usuario.email_verificado:
        return {"mensaje": "Este email ya estaba verificado"}
    usuario.email_verificado = True
    db.add(usuario)
    db.commit()
    return {"mensaje": "Email verificado correctamente"}


# POST /usuarios/reenviar-verificacion → por si el correo se pierde
@router.post("/reenviar-verificacion")
def reenviar_verificacion(email: str, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.email == email).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="No existe ninguna cuenta con ese email")
    if usuario.email_verificado:
        raise HTTPException(status_code=400, detail="Este email ya está verificado")

    nuevo_token = generar_token()
    usuario.token_verificacion = nuevo_token
    db.add(usuario)
    db.commit()

    enviar_email_verificacion(usuario.email, usuario.nombre, nuevo_token)
    return {"mensaje": "Correo de verificación reenviado"}


# POST /usuarios/olvide-password → solicita el enlace de restablecimiento
@router.post("/olvide-password")
def olvide_password(datos: SolicitudReset, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.email == datos.email).first()
    if usuario:
        token = generar_token()
        usuario.token_reset_password = token
        usuario.token_reset_expira = datetime.utcnow() + timedelta(hours=1)
        db.add(usuario)
        db.commit()
        try:
            enviar_email_reset_password(usuario.email, usuario.nombre, token)
        except Exception:
            pass
    return {"mensaje": "Si ese email existe, te hemos enviado un enlace para restablecer tu contraseña"}


# POST /usuarios/restablecer-password → confirma el enlace y guarda la contraseña nueva
@router.post("/restablecer-password")
def restablecer_password(datos: ConfirmarReset, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.token_reset_password == datos.token).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Enlace no válido")
    if not usuario.token_reset_expira or datetime.utcnow() > usuario.token_reset_expira:
        raise HTTPException(status_code=400, detail="Este enlace ha caducado. Pide uno nuevo.")

    usuario.password_hash = hashear_password(datos.password_nueva)
    usuario.token_reset_password = None
    usuario.token_reset_expira = None
    usuario.intentos_login_fallidos = 0
    usuario.bloqueado_hasta = None
    db.add(usuario)
    db.commit()
    return {"mensaje": "Contraseña restablecida correctamente"}


# POST /usuarios/login → iniciar sesión
@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.email == form_data.username).first()
    if not usuario:
        raise HTTPException(status_code=401, detail="Email o contraseña incorrectos")

    if usuario.bloqueado_hasta and datetime.utcnow() < usuario.bloqueado_hasta:
        segundos_restantes = int((usuario.bloqueado_hasta - datetime.utcnow()).total_seconds()) + 1
        raise HTTPException(
            status_code=403,
            detail=f"Demasiados intentos fallidos. Inténtalo de nuevo en {formatear_tiempo(segundos_restantes)}, o restablece tu contraseña."
        )

    if not verificar_password(form_data.password, usuario.password_hash):
        usuario.intentos_login_fallidos += 1
        segundos_bloqueo = calcular_bloqueo_segundos(usuario.intentos_login_fallidos)
        if segundos_bloqueo > 0:
            usuario.bloqueado_hasta = datetime.utcnow() + timedelta(seconds=segundos_bloqueo)
        db.add(usuario)
        db.commit()
        raise HTTPException(status_code=401, detail="Email o contraseña incorrectos")

    if usuario.intentos_login_fallidos > 0:
        usuario.intentos_login_fallidos = 0
        usuario.bloqueado_hasta = None
        db.add(usuario)
        db.commit()

    aviso = None
    if not usuario.email_verificado:
        aviso = "Tu email no está verificado todavía. Confírmalo desde el correo que te enviamos, o pide que te lo reenviemos."

    token = crear_token({
        "sub": usuario.email,
        "id": usuario.id,
        "nombre": usuario.nombre,
        "es_admin": usuario.es_admin,
        "email_verificado": usuario.email_verificado,
    })
    return {"access_token": token, "token_type": "bearer", "aviso": aviso}
