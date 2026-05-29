from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class EquipoCreate(BaseModel):
    usuario_id: int
    carrera_id: int
    temporada: int

    # MotoGP
    motogp_oro1_id: int
    motogp_oro2_id: int
    motogp_plata1_id: int
    motogp_plata2_id: int
    equipo_nombre: Optional[int] = None
    constructor_nombre: Optional[int] = None

    # Moto2
    moto2_oro1_id: int
    moto2_oro2_id: int
    moto2_plata1_id: int
    moto2_plata2_id: int

    # Moto3
    moto3_oro1_id: int
    moto3_oro2_id: int
    moto3_plata1_id: int
    moto3_plata2_id: int

    # Capitán y mecánicas
    capitan_id: int
    comodin_usado: bool = False

    # Predicción pole
    pole_motogp_id: Optional[int] = None
    pole_moto2_id: Optional[int] = None
    pole_moto3_id: Optional[int] = None

class EquipoResponse(EquipoCreate):
    id: int
    puntos_sprint: float = 0
    puntos_carrera: float = 0
    puntos_pole: float = 0
    puntos_total: float = 0
    created_at: datetime

    class Config:
        from_attributes = True
