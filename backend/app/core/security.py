from datetime import datetime, timedelta
from jose import JWTError, jwt
from dotenv import load_dotenv
import hashlib
import os

load_dotenv()

SECRET_KEY = "pitlane-fantasy-secret-key-2026"
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