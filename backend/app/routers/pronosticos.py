from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date
from app.core.database import get_db
from app.core.security import get_admin_actual, get_usuario_actual
from app.models.pronostico import Pronostico
from app.models.carrera import Carrera
from app.schemas.pronostico import PronosticoCreate, PronosticoResponse
from app.services.pronosticos import calcular_puntos_pronostico

router = APIRouter(prefix="/pronosticos", tags=["pronosticos"])


# POST /pronosticos/ → crear pronósticos de temporada
@router.post("/", response_model=PronosticoResponse)
def crear_pronostico(pronostico: PronosticoCreate, db: Session = Depends(get_db), usuario_actual: dict = Depends(get_usuario_actual)):
    if pronostico.usuario_id != usuario_actual.get("id") and not usuario_actual.get("es_admin"):
        raise HTTPException(status_code=403, detail="No puedes crear pronósticos para otro usuario")
    existente = db.query(Pronostico).filter(
        Pronostico.usuario_id == pronostico.usuario_id,
        Pronostico.temporada == pronostico.temporada
    ).first()
    if existente:
        raise HTTPException(status_code=400, detail="Ya tienes pronósticos para esta temporada")

    primera_carrera = db.query(Carrera).filter(
        Carrera.temporada == pronostico.temporada
    ).order_by(Carrera.fecha).first()

    if primera_carrera and date.today() >= primera_carrera.fecha:
        raise HTTPException(
            status_code=400,
            detail=f"El plazo para pronósticos cerró el {primera_carrera.fecha.strftime('%d/%m/%Y')}, al empezar la temporada"
        )

    nuevo = Pronostico(**pronostico.model_dump())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


# GET /pronosticos/{usuario_id}/{temporada} → ver pronósticos de un usuario
@router.get("/{usuario_id}/{temporada}", response_model=PronosticoResponse)
def obtener_pronostico(usuario_id: int, temporada: int, db: Session = Depends(get_db), usuario_actual: dict = Depends(get_usuario_actual)):
    if usuario_id != usuario_actual.get("id") and not usuario_actual.get("es_admin"):
        raise HTTPException(status_code=403, detail="No puedes ver los pronósticos de otro usuario")
    pronostico = db.query(Pronostico).filter(
        Pronostico.usuario_id == usuario_id,
        Pronostico.temporada == temporada
    ).first()
    if not pronostico:
        raise HTTPException(status_code=404, detail="Pronósticos no encontrados")
    return pronostico


# POST /pronosticos/calcular/{temporada} → recalcula los puntos de TODOS los pronósticos de esa temporada
@router.post("/calcular/{temporada}")
def calcular_pronosticos_temporada(temporada: int, db: Session = Depends(get_db), admin: dict = Depends(get_admin_actual)):
    pronosticos = db.query(Pronostico).filter(Pronostico.temporada == temporada).all()
    if not pronosticos:
        raise HTTPException(status_code=404, detail="No hay pronósticos para esta temporada")

    resultados = []
    for p in pronosticos:
        puntos = calcular_puntos_pronostico(p, db)
        resultados.append({"usuario_id": p.usuario_id, "puntos_pronosticos": puntos})

    db.commit()
    return {"mensaje": f"Recalculados {len(pronosticos)} pronósticos", "resultados": resultados}
