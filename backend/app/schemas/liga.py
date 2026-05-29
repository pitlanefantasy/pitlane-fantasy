from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class LigaCreate(BaseModel):
    nombre: str
    creador_id: Optional[int] = None
    temporada: int
    publica: bool = False

class LigaResponse(LigaCreate):
    id: int
    codigo: str
    created_at: datetime

    class Config:
        from_attributes = True

class LigaUsuarioResponse(BaseModel):
    id: int
    liga_id: int
    usuario_id: int
    joined_at: datetime

    class Config:
        from_attributes = True
