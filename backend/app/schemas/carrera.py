from pydantic import BaseModel
from datetime import date

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

    class Config:
        from_attributes = True
