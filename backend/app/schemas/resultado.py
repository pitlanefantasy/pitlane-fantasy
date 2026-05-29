from pydantic import BaseModel
from typing import Optional

class ResultadoCreate(BaseModel):
    carrera_id: int
    piloto_id: int
    posicion_carrera: Optional[int] = None
    posicion_sprint: Optional[int] = None
    posicion_qualy: Optional[int] = None
    vuelta_rapida: bool = False
    abandono: bool = False
    hizo_pole: bool = False

class ResultadoResponse(ResultadoCreate):
    id: int
    puntos_carrera: float = 0
    puntos_sprint: float = 0
    puntos_total: float = 0

    class Config:
        from_attributes = True
