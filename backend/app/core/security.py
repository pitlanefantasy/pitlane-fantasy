from datetime import datetime, timedelta
from jose import JWTError, jwt
from dotenv import load_dotenv
import hashlib
import os

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY no está definida en las variables de entorno")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24


def verificar_password(password: str, password_hash: str) -> bool:
    """Verifica si una contraseña coincide con su hash"""
    return hashlib.sha256(password.encode()).hexdigest() == password_hash


def hashear_password(password: str) -> str:
    """Convierte una contraseña en hash SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()


def crear_token(data: dict) -> str:
    """Genera un JWT token"""
    datos = data.copy()
    expira = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    datos.update({"exp": expira})
    return jwt.encode(datos, SECRET_KEY, algorithm=ALGORITHM)


def verificar_token(token: str) -> dict:
    """Verifica un JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None


from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="usuarios/login")


def get_usuario_actual(token: str = Depends(oauth2_scheme)) -> dict:
    """Exige un token válido. Devuelve el payload (sub, id, nombre, es_admin)."""
    payload = verificar_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Token inválido o caducado")
    return payload


def get_admin_actual(usuario: dict = Depends(get_usuario_actual)) -> dict:
    """Exige que el usuario del token sea administrador."""
    if not usuario.get("es_admin"):
        raise HTTPException(status_code=403, detail="Requiere permisos de administrador")
    return usuario
