from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.carrera import Carrera
from app.schemas.carrera import CarreraCreate, CarreraResponse
from typing import List

router = APIRouter(prefix="/carreras", tags=["carreras"])

# GET /carreras/ → todas las carreras
@router.get("/", response_model=List[CarreraResponse])
def listar_carreras(db: Session = Depends(get_db)):
    return db.query(Carrera).order_by(Carrera.fecha).all()

# GET /carreras/proxima → próxima carrera
@router.get("/proxima", response_model=CarreraResponse)
def proxima_carrera(db: Session = Depends(get_db)):
    from datetime import date
    carrera = db.query(Carrera).filter(
        Carrera.completada == False,
        Carrera.fecha >= date.today()
    ).order_by(Carrera.fecha).first()
    if not carrera:
        raise HTTPException(status_code=404, detail="No hay carreras pendientes")
    return carrera

# GET /carreras/{id} → carrera por ID
@router.get("/{carrera_id}", response_model=CarreraResponse)
def obtener_carrera(carrera_id: int, db: Session = Depends(get_db)):
    carrera = db.query(Carrera).filter(Carrera.id == carrera_id).first()
    if not carrera:
        raise HTTPException(status_code=404, detail="Carrera no encontrada")
    return carrera

# POST /carreras/ → crear carrera
@router.post("/", response_model=CarreraResponse)
def crear_carrera(carrera: CarreraCreate, db: Session = Depends(get_db)):
    nueva = Carrera(**carrera.model_dump())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva
