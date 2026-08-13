from pydantic import BaseModel
from typing import Optional

class CircuitoResponse(BaseModel):
    id: int
    nombre: str
    pais: str
    ubicacion: Optional[str] = None
    slug: str
    curvas_izquierda: Optional[int] = None
    curvas_derecha: Optional[int] = None
    velocidad_max_kmh: Optional[int] = None
    ultimo_ganador_motogp: Optional[str] = None
    ultimo_ganador_moto2: Optional[str] = None
    ultimo_ganador_moto3: Optional[str] = None
    historia: Optional[str] = None
    imagen_url: Optional[str] = None

    class Config:
        from_attributes = True
