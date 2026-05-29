from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PronosticoCreate(BaseModel):
    usuario_id: int
    temporada: int

    # Top 3 por categoría
    campeon_motogp_id: Optional[int] = None
    segundo_motogp_id: Optional[int] = None
    tercero_motogp_id: Optional[int] = None
    campeon_moto2_id: Optional[int] = None
    segundo_moto2_id: Optional[int] = None
    tercero_moto2_id: Optional[int] = None
    campeon_moto3_id: Optional[int] = None
    segundo_moto3_id: Optional[int] = None
    tercero_moto3_id: Optional[int] = None

    # Más poles
    poleman_motogp_id: Optional[int] = None
    poleman_moto2_id: Optional[int] = None
    poleman_moto3_id: Optional[int] = None

    # Más victorias
    victorias_motogp_id: Optional[int] = None
    victorias_moto2_id: Optional[int] = None
    victorias_moto3_id: Optional[int] = None

    # Mejor rookie
    rookie_motogp_id: Optional[int] = None
    rookie_moto2_id: Optional[int] = None
    rookie_moto3_id: Optional[int] = None

    # Más caídas
    caidas_motogp_id: Optional[int] = None
    caidas_moto2_id: Optional[int] = None
    caidas_moto3_id: Optional[int] = None

class PronosticoResponse(PronosticoCreate):
    id: int
    puntos_pronosticos: float = 0
    created_at: datetime

    class Config:
        from_attributes = True
