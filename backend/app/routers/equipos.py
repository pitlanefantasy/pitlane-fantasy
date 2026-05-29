from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.equipo import Equipo
from app.schemas.equipo import EquipoCreate, EquipoResponse
from typing import List

router = APIRouter(prefix="/equipos", tags=["equipos"])

# POST /equipos/ → crear equipo para un GP
@router.post("/", response_model=EquipoResponse)
def crear_equipo(equipo: EquipoCreate, db: Session = Depends(get_db)):
    # Verificar que no tiene ya equipo para esa carrera
    existente = db.query(Equipo).filter(
        Equipo.usuario_id == equipo.usuario_id,
        Equipo.carrera_id == equipo.carrera_id
    ).first()
    if existente:
        raise HTTPException(status_code=400, detail="Ya tienes equipo para esta carrera")

    nuevo = Equipo(**equipo.model_dump())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

# GET /equipos/{usuario_id}/{carrera_id} → ver equipo de un usuario para un GP
@router.get("/{usuario_id}/{carrera_id}", response_model=EquipoResponse)
def obtener_equipo(usuario_id: int, carrera_id: int, db: Session = Depends(get_db)):
    equipo = db.query(Equipo).filter(
        Equipo.usuario_id == usuario_id,
        Equipo.carrera_id == carrera_id
    ).first()
    if not equipo:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")
    return equipo

# GET /equipos/usuario/{usuario_id} → todos los equipos de un usuario
@router.get("/usuario/{usuario_id}", response_model=List[EquipoResponse])
def equipos_usuario(usuario_id: int, db: Session = Depends(get_db)):
    return db.query(Equipo).filter(Equipo.usuario_id == usuario_id).all()
