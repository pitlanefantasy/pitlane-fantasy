from pydantic import BaseModel, EmailStr
from datetime import datetime

# Datos para crear un usuario (lo que llega de la web)
class UsuarioCreate(BaseModel):
    email: str
    nombre: str
    password: str

# Datos que devuelve la API (lo que ve el usuario)
class UsuarioResponse(BaseModel):
    id: int
    email: str
    nombre: str
    created_at: datetime

    class Config:
        from_attributes = True
