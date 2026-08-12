from pydantic import BaseModel, EmailStr, field_validator
from datetime import datetime
from app.core.validaciones import validar_password_fuerte

# Datos para crear un usuario (lo que llega de la web)
class UsuarioCreate(BaseModel):
    email: EmailStr
    nombre: str
    password: str

    @field_validator("password")
    @classmethod
    def validar_password(cls, v):
        return validar_password_fuerte(v)

# Datos que devuelve la API (lo que ve el usuario)
class UsuarioResponse(BaseModel):
    id: int
    email: str
    nombre: str
    es_admin: bool
    created_at: datetime

    class Config:
        from_attributes = True
