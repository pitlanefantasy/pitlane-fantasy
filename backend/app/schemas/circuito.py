from pydantic import BaseModel
from typing import Optional


class CircuitoResponse(BaseModel):
    id: int
    nombre: str
    pais: str
    slug: str
    curvas_izquierda: Optional[int] = None
    curvas_derecha: Optional[int] = None
    velocidad_max_kmh: Optional[int] = None

    class Config:
        from_attributes = True
