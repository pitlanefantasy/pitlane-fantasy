from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.equipo import Equipo
from app.models.carrera import Carrera
from app.schemas.equipo import EquipoCreate, EquipoResponse
from typing import List

router = APIRouter(prefix="/equipos", tags=["equipos"])

def validar_equipo(equipo: EquipoCreate):
    pilotos = [
        equipo.motogp_oro1_id, equipo.motogp_oro2_id,
        equipo.motogp_plata1_id, equipo.motogp_plata2_id,
        equipo.moto2_oro1_id, equipo.moto2_oro2_id,
        equipo.moto2_plata1_id, equipo.moto2_plata2_id,
        equipo.moto3_oro1_id, equipo.moto3_oro2_id,
        equipo.moto3_plata1_id, equipo.moto3_plata2_id,
    ]
    pilotos = [p for p in pilotos if p is not None]
    if len(pilotos) != len(set(pilotos)):
        raise HTTPException(status_code=400,
            detail="No puedes tener el mismo piloto dos veces en el equipo")
    motogp = [equipo.motogp_oro1_id, equipo.motogp_oro2_id,
              equipo.motogp_plata1_id, equipo.motogp_plata2_id]
    moto2  = [equipo.moto2_oro1_id, equipo.moto2_oro2_id,
              equipo.moto2_plata1_id, equipo.moto2_plata2_id]
    moto3  = [equipo.moto3_oro1_id, equipo.moto3_oro2_id,
              equipo.moto3_plata1_id, equipo.moto3_plata2_id]
    if equipo.capitan_motogp_id and equipo.capitan_motogp_id not in motogp:
        raise HTTPException(status_code=400,
            detail="El capitán MotoGP debe ser uno de tus 4 pilotos MotoGP")
    if equipo.capitan_moto2_id and equipo.capitan_moto2_id not in moto2:
        raise HTTPException(status_code=400,
            detail="El capitán Moto2 debe ser uno de tus 4 pilotos Moto2")
    if equipo.capitan_moto3_id and equipo.capitan_moto3_id not in moto3:
        raise HTTPException(status_code=400,
            detail="El capitán Moto3 debe ser uno de tus 4 pilotos Moto3")

def validar_usos_capitan(equipo: EquipoCreate, db: Session):
    capitanes = {
        'motogp': equipo.capitan_motogp_id,
        'moto2':  equipo.capitan_moto2_id,
        'moto3':  equipo.capitan_moto3_id,
    }
    for cat, capitan_id in capitanes.items():
        if not capitan_id:
            continue
        campo = f'capitan_{cat}_id'
        usos = db.query(Equipo).join(Carrera).filter(
            Equipo.usuario_id == equipo.usuario_id,
            getattr(Equipo, campo) == capitan_id,
            Carrera.temporada == equipo.temporada
        ).count()
        if usos >= 3:
            raise HTTPException(status_code=400,
                detail=f"Ya has usado este capitán 3 veces en {cat.upper()} esta temporada")

@router.post("/", response_model=EquipoResponse)
def crear_equipo(equipo: EquipoCreate, db: Session = Depends(get_db)):
    existente = db.query(Equipo).filter(
        Equipo.usuario_id == equipo.usuario_id,
        Equipo.carrera_id == equipo.carrera_id
    ).first()
    if existente:
        raise HTTPException(status_code=400, detail="Ya tienes equipo para esta carrera")
    validar_equipo(equipo)
    validar_usos_capitan(equipo, db)
    nuevo = Equipo(**equipo.model_dump())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

@router.get("/{usuario_id}/{carrera_id}", response_model=EquipoResponse)
def obtener_equipo(usuario_id: int, carrera_id: int, db: Session = Depends(get_db)):
    equipo = db.query(Equipo).filter(
        Equipo.usuario_id == usuario_id,
        Equipo.carrera_id == carrera_id
    ).first()
    if not equipo:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")
    return equipo

@router.get("/usuario/{usuario_id}", response_model=List[EquipoResponse])
def equipos_usuario(usuario_id: int, db: Session = Depends(get_db)):
    return db.query(Equipo).filter(Equipo.usuario_id == usuario_id).all()