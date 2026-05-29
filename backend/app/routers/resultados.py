from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.resultado import Resultado
from app.schemas.resultado import ResultadoCreate, ResultadoResponse
from app.services.puntos import calcular_puntos_carrera, calcular_puntos_sprint
from typing import List

router = APIRouter(prefix="/resultados", tags=["resultados"])

# POST /resultados/ → introducir resultado de un piloto en una carrera
@router.post("/", response_model=ResultadoResponse)
def crear_resultado(resultado: ResultadoCreate, db: Session = Depends(get_db)):
    # Verificar que no existe ya
    existente = db.query(Resultado).filter(
        Resultado.carrera_id == resultado.carrera_id,
        Resultado.piloto_id == resultado.piloto_id
    ).first()
    if existente:
        raise HTTPException(status_code=400, detail="Ya existe resultado para este piloto en esta carrera")

    # Calcular puntos automáticamente
    puntos_carrera = calcular_puntos_carrera(
        resultado.posicion_carrera,
        resultado.abandono,
        resultado.vuelta_rapida
    )
    puntos_sprint = calcular_puntos_sprint(resultado.posicion_sprint)
    puntos_total = puntos_carrera + puntos_sprint

    nuevo = Resultado(
        **resultado.model_dump(),
        puntos_carrera=puntos_carrera,
        puntos_sprint=puntos_sprint,
        puntos_total=puntos_total
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

# GET /resultados/{carrera_id} → resultados de una carrera
@router.get("/{carrera_id}", response_model=List[ResultadoResponse])
def resultados_carrera(carrera_id: int, db: Session = Depends(get_db)):
    resultados = db.query(Resultado).filter(
        Resultado.carrera_id == carrera_id
    ).all()
    if not resultados:
        raise HTTPException(status_code=404, detail="No hay resultados para esta carrera")
    return resultados

# GET /resultados/{carrera_id}/{piloto_id} → resultado de un piloto en una carrera
@router.get("/{carrera_id}/{piloto_id}", response_model=ResultadoResponse)
def resultado_piloto(carrera_id: int, piloto_id: int, db: Session = Depends(get_db)):
    resultado = db.query(Resultado).filter(
        Resultado.carrera_id == carrera_id,
        Resultado.piloto_id == piloto_id
    ).first()
    if not resultado:
        raise HTTPException(status_code=404, detail="Resultado no encontrado")
    return resultado
