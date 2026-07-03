from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.piloto import Piloto
from app.schemas.piloto import PilotoCreate, PilotoResponse
from typing import List

router = APIRouter(prefix="/pilotos", tags=["pilotos"])

@router.get("/", response_model=List[PilotoResponse])
def listar_pilotos(db: Session = Depends(get_db)):
    return db.query(Piloto).filter(Piloto.activo == True).all()

@router.get("/rookies/{categoria}", response_model=List[PilotoResponse])
def rookies_por_categoria(categoria: str, db: Session = Depends(get_db)):
    pilotos = db.query(Piloto).filter(
        Piloto.categoria == categoria,
        Piloto.rookie == True,
        Piloto.activo == True
    ).all()
    if not pilotos:
        raise HTTPException(status_code=404, detail=f"No hay rookies en {categoria}")
    return pilotos

@router.get("/categoria/{categoria}", response_model=List[PilotoResponse])
def pilotos_por_categoria(categoria: str, db: Session = Depends(get_db)):
    pilotos = db.query(Piloto).filter(
        Piloto.categoria == categoria,
        Piloto.activo == True
    ).all()
    if not pilotos:
        raise HTTPException(status_code=404, detail=f"No hay pilotos en {categoria}")
    return pilotos

@router.post("/", response_model=PilotoResponse)
def crear_piloto(piloto: PilotoCreate, db: Session = Depends(get_db)):
    nuevo = Piloto(**piloto.model_dump())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo