from pydantic import BaseModel
from datetime import date
from typing import Optional
from app.schemas.circuito import CircuitoResponse


class CarreraBase(BaseModel):
    nombre: str
    circuito: str
    pais: str
    fecha: date
    temporada: int
    completada: bool = False


class CarreraCreate(CarreraBase):
    pass


class CarreraResponse(CarreraBase):
    id: int
    circuito_detalle: Optional[CircuitoResponse] = None

    class Config:
        from_attributes = True
