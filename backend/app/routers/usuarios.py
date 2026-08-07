from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verificar_password, hashear_password, crear_token
from app.models.usuario import Usuario
from app.models.liga import Liga, LigaUsuario
from app.schemas.usuario import UsuarioCreate, UsuarioResponse

router = APIRouter(prefix="/usuarios", tags=["usuarios"])

TEMPORADA_ACTUAL = 2026  # cambiar a mano cuando empiece la temporada 2027


# POST /usuarios/ → registrar usuario
@router.post("/", response_model=UsuarioResponse)
def crear_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    db_usuario = db.query(Usuario).filter(Usuario.email == usuario.email).first()
    if db_usuario:
        raise HTTPException(status_code=400, detail="El email ya está registrado")
    nuevo_usuario = Usuario(
        email=usuario.email,
        nombre=usuario.nombre,
        password_hash=hashear_password(usuario.password)
    )
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)

    # Inscripción automática a la liga global de la temporada actual
    liga_global = db.query(Liga).filter(
        Liga.es_global == True,
        Liga.temporada == TEMPORADA_ACTUAL
    ).first()
    if liga_global:
        db.add(LigaUsuario(liga_id=liga_global.id, usuario_id=nuevo_usuario.id))
        db.commit()

    return nuevo_usuario


# GET /usuarios/{id} → obtener usuario
@router.get("/{usuario_id}", response_model=UsuarioResponse)
def obtener_usuario(usuario_id: int, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario


# POST /usuarios/login → iniciar sesión
@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.email == form_data.username).first()
    if not usuario:
        raise HTTPException(status_code=401, detail="Email o contraseña incorrectos")
    if not verificar_password(form_data.password, usuario.password_hash):
        raise HTTPException(status_code=401, detail="Email o contraseña incorrectos")
    token = crear_token({"sub": usuario.email, "id": usuario.id, "nombre": usuario.nombre, "es_admin": usuario.es_admin})
    return {"access_token": token, "token_type": "bearer"}
