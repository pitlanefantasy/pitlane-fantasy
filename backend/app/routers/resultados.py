from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_admin_actual
from app.models.resultado import Resultado
from app.models.piloto import Piloto
from app.models.carrera import Carrera
from app.schemas.resultado import ResultadoCreate, ResultadoResponse
from app.services.puntos import calcular_puntos_carrera, calcular_puntos_sprint
from app.services.precios import actualizar_precios
from typing import List

router = APIRouter(prefix="/resultados", tags=["resultados"])


@router.post("/", response_model=ResultadoResponse)
def crear_resultado(
    resultado: ResultadoCreate,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_admin_actual),
):
    existente = db.query(Resultado).filter(
        Resultado.carrera_id == resultado.carrera_id,
        Resultado.piloto_id == resultado.piloto_id
    ).first()
    if existente:
        raise HTTPException(status_code=400, detail="Ya existe resultado para este piloto en esta carrera")
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


@router.get("/publico/temporada/{temporada}")
def resultados_temporada_publico(temporada: int, db: Session = Depends(get_db)):
    """Calendario completo de la temporada para la vista pública de
    Resultados: cada carrera, con sus resultados si ya los hay (lista
    vacía si aún no se ha disputado o no se ha cargado el resultado)."""
    carreras = db.query(Carrera).filter(Carrera.temporada == temporada).order_by(Carrera.fecha).all()

    salida = []
    for carrera in carreras:
        resultados = (
            db.query(Resultado, Piloto)
            .join(Piloto, Resultado.piloto_id == Piloto.id)
            .filter(Resultado.carrera_id == carrera.id)
            .order_by(Resultado.posicion_carrera.asc().nullslast())
            .all()
        )
        salida.append({
            "carrera_id": carrera.id,
            "nombre": carrera.nombre,
            "circuito": carrera.circuito,
            "pais": carrera.pais,
            "fecha": carrera.fecha,
            "tiene_resultado": len(resultados) > 0,
            "resultados": [
                {
                    "piloto_id": piloto.id,
                    "piloto_nombre": piloto.nombre,
                    "categoria": piloto.categoria,
                    "posicion_carrera": resultado.posicion_carrera,
                    "posicion_sprint": resultado.posicion_sprint,
                    "abandono": resultado.abandono,
                    "vuelta_rapida": resultado.vuelta_rapida,
                    "hizo_pole": resultado.hizo_pole,
                    "puntos_total": float(resultado.puntos_total or 0),
                }
                for resultado, piloto in resultados
            ],
        })
    return salida


@router.get("/{carrera_id}", response_model=List[ResultadoResponse])
def resultados_carrera(carrera_id: int, db: Session = Depends(get_db)):
    return db.query(Resultado).filter(Resultado.carrera_id == carrera_id).all()


@router.get("/{carrera_id}/{piloto_id}", response_model=ResultadoResponse)
def resultado_piloto(carrera_id: int, piloto_id: int, db: Session = Depends(get_db)):
    resultado = db.query(Resultado).filter(
        Resultado.carrera_id == carrera_id,
        Resultado.piloto_id == piloto_id
    ).first()
    if not resultado:
        raise HTTPException(status_code=404, detail="Resultado no encontrado")
    return resultado


@router.post("/{carrera_id}/calcular-precios")
def calcular_precios(
    carrera_id: int,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_admin_actual),
):
    actualizar_precios(carrera_id, db)
    return {"mensaje": f"Precios actualizados tras carrera {carrera_id}"}


@router.post("/{carrera_id}/calcular-equipos")
def calcular_puntos_equipos(
    carrera_id: int,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_admin_actual),
):
    from app.models.equipo import Equipo

    resultados = db.query(Resultado).filter(
        Resultado.carrera_id == carrera_id
    ).all()
    resultados_dict = {r.piloto_id: r for r in resultados}

    equipos = db.query(Equipo).filter(Equipo.carrera_id == carrera_id).all()

    for equipo in equipos:
        total = 0.0
        pilotos_oro = [
            equipo.motogp_oro1_id, equipo.motogp_oro2_id,
            equipo.moto2_oro1_id, equipo.moto2_oro2_id,
            equipo.moto3_oro1_id, equipo.moto3_oro2_id,
        ]
        pilotos_plata = [
            equipo.motogp_plata1_id, equipo.motogp_plata2_id,
            equipo.moto2_plata1_id, equipo.moto2_plata2_id,
            equipo.moto3_plata1_id, equipo.moto3_plata2_id,
        ]
        boosts = [
            equipo.capitan_motogp_id,
            equipo.capitan_moto2_id,
            equipo.capitan_moto3_id,
        ]

        for piloto_id in pilotos_oro:
            if piloto_id and piloto_id in resultados_dict:
                pts = float(resultados_dict[piloto_id].puntos_total or 0)
                if piloto_id in boosts:
                    pts *= 2
                total += pts

        for piloto_id in pilotos_plata:
            if piloto_id and piloto_id in resultados_dict:
                pts = float(resultados_dict[piloto_id].puntos_total or 0) * 0.5
                if piloto_id in boosts:
                    pts *= 2
                total += pts

        equipo.puntos_total = total
        db.add(equipo)

    db.commit()
    return {"mensaje": f"Puntos calculados para {len(equipos)} equipos", "carrera_id": carrera_id}
