from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.pronostico import Pronostico
from app.schemas.pronostico import PronosticoCreate, PronosticoResponse

router = APIRouter(prefix="/pronosticos", tags=["pronosticos"])

# POST /pronosticos/ → crear pronósticos de temporada
@router.post("/", response_model=PronosticoResponse)
def crear_pronostico(pronostico: PronosticoCreate, db: Session = Depends(get_db)):
    # Verificar que no tiene ya pronósticos para esa temporada
    existente = db.query(Pronostico).filter(
        Pronostico.usuario_id == pronostico.usuario_id,
        Pronostico.temporada == pronostico.temporada
    ).first()
    if existente:
        raise HTTPException(status_code=400, detail="Ya tienes pronósticos para esta temporada")

    nuevo = Pronostico(**pronostico.model_dump())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

# GET /pronosticos/{usuario_id}/{temporada} → ver pronósticos de un usuario
@router.get("/{usuario_id}/{temporada}", response_model=PronosticoResponse)
def obtener_pronostico(usuario_id: int, temporada: int, db: Session = Depends(get_db)):
    pronostico = db.query(Pronostico).filter(
        Pronostico.usuario_id == usuario_id,
        Pronostico.temporada == temporada
    ).first()
    if not pronostico:
        raise HTTPException(status_code=404, detail="Pronósticos no encontrados")
    return pronostico
