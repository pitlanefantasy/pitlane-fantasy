from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.fabricante import Fabricante
from app.models.equipo_real import EquipoReal
from app.schemas.fabricante import FabricanteResponse
from app.schemas.equipo_real import EquipoRealResponse

router = APIRouter(tags=["fabricantes"])

@router.get("/fabricantes/", response_model=List[FabricanteResponse])
def listar_fabricantes(db: Session = Depends(get_db)):
    return db.query(Fabricante).order_by(Fabricante.precio.desc()).all()

@router.get("/equipos-reales/", response_model=List[EquipoRealResponse])
def listar_equipos_reales(db: Session = Depends(get_db)):
    return db.query(EquipoReal).order_by(EquipoReal.precio.desc()).all()
