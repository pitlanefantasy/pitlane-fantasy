from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_usuario_actual
from app.models.equipo import Equipo
from app.models.carrera import Carrera
from app.models.piloto import Piloto
from app.models.fabricante import Fabricante
from app.models.equipo_real import EquipoReal
from app.schemas.equipo import EquipoCreate, EquipoResponse
from typing import List, Optional

router = APIRouter(prefix="/equipos", tags=["equipos"])

MAX_CAMBIOS_POR_CARRERA = 5
PRESUPUESTO = 75.0

SLOTS_PILOTOS = [
    'motogp_oro1_id', 'motogp_oro2_id', 'motogp_plata1_id', 'motogp_plata2_id',
    'moto2_oro1_id', 'moto2_oro2_id', 'moto2_plata1_id', 'moto2_plata2_id',
    'moto3_oro1_id', 'moto3_oro2_id', 'moto3_plata1_id', 'moto3_plata2_id',
]
SLOTS_COMPARABLES = SLOTS_PILOTOS + ['fabricante_id', 'equipo_real_id']


def validar_equipo(equipo: EquipoCreate):
    pilotos = [getattr(equipo, s) for s in SLOTS_PILOTOS]
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
            detail="El boost MotoGP debe ser uno de tus 4 pilotos MotoGP")
    if equipo.capitan_moto2_id and equipo.capitan_moto2_id not in moto2:
        raise HTTPException(status_code=400,
            detail="El boost Moto2 debe ser uno de tus 4 pilotos Moto2")
    if equipo.capitan_moto3_id and equipo.capitan_moto3_id not in moto3:
        raise HTTPException(status_code=400,
            detail="El boost Moto3 debe ser uno de tus 4 pilotos Moto3")


def validar_usos_boost(equipo: EquipoCreate, db: Session, excluir_equipo_id: int = None):
    """Cuenta cuántas carreras de la temporada ya usaron el boost en cada
    categoría. Al actualizar un equipo existente, se excluye su propia fila
    del conteo — mantener el mismo boost que ya tenías no debe penalizarte."""
    boosts = {
        'motogp': equipo.capitan_motogp_id,
        'moto2':  equipo.capitan_moto2_id,
        'moto3':  equipo.capitan_moto3_id,
    }
    for cat, boost_id in boosts.items():
        if not boost_id:
            continue
        campo = f'capitan_{cat}_id'
        query = db.query(Equipo).join(Carrera).filter(
            Equipo.usuario_id == equipo.usuario_id,
            getattr(Equipo, campo) != None,
            Carrera.temporada == equipo.temporada
        )
        if excluir_equipo_id:
            query = query.filter(Equipo.id != excluir_equipo_id)
        usos = query.count()
        if usos >= 3:
            raise HTTPException(status_code=400,
                detail=f"Ya has usado el boost 3 veces en {cat.upper()} esta temporada")


def validar_presupuesto(equipo: EquipoCreate, db: Session):
    total = 0.0
    for pid in [getattr(equipo, s) for s in SLOTS_PILOTOS]:
        piloto = db.query(Piloto).filter(Piloto.id == pid).first()
        if piloto:
            total += float(piloto.precio)
    if equipo.fabricante_id:
        fab = db.query(Fabricante).filter(Fabricante.id == equipo.fabricante_id).first()
        if fab:
            total += float(fab.precio)
    if equipo.equipo_real_id:
        eq_real = db.query(EquipoReal).filter(EquipoReal.id == equipo.equipo_real_id).first()
        if eq_real:
            total += float(eq_real.precio)
    if total > PRESUPUESTO:
        raise HTTPException(status_code=400,
            detail=f"Presupuesto superado — total: {total}M / máximo: {PRESUPUESTO}M")


def obtener_equipo_anterior(usuario_id: int, temporada: int, carrera_id: int, db: Session):
    """Devuelve el equipo de la carrera más reciente ANTES de carrera_id,
    en la misma temporada, o None si esta es la primera carrera jugada.
    Esta es siempre la referencia para contar cambios — nunca el propio
    borrador que se esté editando ahora mismo."""
    carrera_actual = db.query(Carrera).filter(Carrera.id == carrera_id).first()
    if not carrera_actual:
        raise HTTPException(status_code=404, detail="Carrera no encontrada")

    return (
        db.query(Equipo)
        .join(Carrera, Equipo.carrera_id == Carrera.id)
        .filter(
            Equipo.usuario_id == usuario_id,
            Equipo.temporada == temporada,
            Carrera.fecha < carrera_actual.fecha,
        )
        .order_by(Carrera.fecha.desc())
        .first()
    )


def validar_cambios(equipo: EquipoCreate, anterior: Equipo):
    if anterior is None:
        return
    cambios = sum(
        1 for slot in SLOTS_COMPARABLES
        if getattr(equipo, slot) != getattr(anterior, slot)
    )
    if cambios > MAX_CAMBIOS_POR_CARRERA:
        raise HTTPException(status_code=400,
            detail=f"Has cambiado {cambios} pilotos/fabricante/equipo — el máximo por carrera es {MAX_CAMBIOS_POR_CARRERA}")


@router.post("/", response_model=EquipoResponse)
def crear_equipo(equipo: EquipoCreate, db: Session = Depends(get_db), usuario_actual: dict = Depends(get_usuario_actual)):
    if equipo.usuario_id != usuario_actual.get("id") and not usuario_actual.get("es_admin"):
        raise HTTPException(status_code=403, detail="No puedes crear equipo para otro usuario")
    existente = db.query(Equipo).filter(
        Equipo.usuario_id == equipo.usuario_id,
        Equipo.carrera_id == equipo.carrera_id
    ).first()
    if existente:
        raise HTTPException(status_code=400, detail="Ya tienes equipo para esta carrera, usa actualizar")

    validar_equipo(equipo)
    validar_usos_boost(equipo, db)
    validar_presupuesto(equipo, db)

    anterior = obtener_equipo_anterior(equipo.usuario_id, equipo.temporada, equipo.carrera_id, db)
    validar_cambios(equipo, anterior)

    nuevo = Equipo(**equipo.model_dump())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


@router.put("/{usuario_id}/{carrera_id}", response_model=EquipoResponse)
def actualizar_equipo(usuario_id: int, carrera_id: int, equipo: EquipoCreate, db: Session = Depends(get_db), usuario_actual: dict = Depends(get_usuario_actual)):
    """Actualiza el equipo ya guardado para esta carrera concreta — para
    seguir afinando tu elección antes de que empiece, sin que cuente como
    un cambio adicional (los cambios se miden contra la carrera anterior,
    no contra tu propio borrador de esta misma carrera)."""
    if usuario_id != usuario_actual.get("id") and not usuario_actual.get("es_admin"):
        raise HTTPException(status_code=403, detail="No puedes modificar el equipo de otro usuario")
    existente = db.query(Equipo).filter(
        Equipo.usuario_id == usuario_id,
        Equipo.carrera_id == carrera_id
    ).first()
    if not existente:
        raise HTTPException(status_code=404, detail="No tienes equipo guardado para esta carrera todavía")

    validar_equipo(equipo)
    validar_usos_boost(equipo, db, excluir_equipo_id=existente.id)
    validar_presupuesto(equipo, db)

    anterior = obtener_equipo_anterior(usuario_id, equipo.temporada, carrera_id, db)
    validar_cambios(equipo, anterior)

    for campo, valor in equipo.model_dump().items():
        setattr(existente, campo, valor)
    db.commit()
    db.refresh(existente)
    return existente


@router.get("/formulario/{usuario_id}/{carrera_id}")
def formulario_equipo(usuario_id: int, carrera_id: int, db: Session = Depends(get_db), usuario_actual: dict = Depends(get_usuario_actual)):
    """Todo lo que necesita el formulario de 'Mi equipo' de un vistazo:
    - guardado: el equipo que ya tienes para ESTA carrera, si lo hay
      (para precargar el formulario y saber si hay que crear o actualizar).
    - anterior: el equipo de la carrera anterior, si lo hay (para comparar
      y contar cambios — siempre esta referencia, nunca 'guardado')."""
    if usuario_id != usuario_actual.get("id") and not usuario_actual.get("es_admin"):
        raise HTTPException(status_code=403, detail="No puedes ver el equipo de otro usuario")
    carrera = db.query(Carrera).filter(Carrera.id == carrera_id).first()
    if not carrera:
        raise HTTPException(status_code=404, detail="Carrera no encontrada")

    guardado = db.query(Equipo).filter(
        Equipo.usuario_id == usuario_id,
        Equipo.carrera_id == carrera_id
    ).first()

    anterior = obtener_equipo_anterior(usuario_id, carrera.temporada, carrera_id, db)

    return {
        "guardado": EquipoResponse.model_validate(guardado) if guardado else None,
        "anterior": EquipoResponse.model_validate(anterior) if anterior else None,
    }


@router.get("/boosts/{usuario_id}/{temporada}")
def usos_boost(usuario_id: int, temporada: int, db: Session = Depends(get_db), usuario_actual: dict = Depends(get_usuario_actual)):
    if usuario_id != usuario_actual.get("id") and not usuario_actual.get("es_admin"):
        raise HTTPException(status_code=403, detail="No puedes ver los boosts de otro usuario")
    result = {}
    for cat in ['motogp', 'moto2', 'moto3']:
        campo = f'capitan_{cat}_id'
        usos = db.query(Equipo).join(Carrera).filter(
            Equipo.usuario_id == usuario_id,
            getattr(Equipo, campo) != None,
            Carrera.temporada == temporada
        ).count()
        result[cat.upper()] = {'usados': usos, 'restantes': 3 - usos}
    return result


@router.get("/usuario/{usuario_id}", response_model=List[EquipoResponse])
def equipos_usuario(usuario_id: int, db: Session = Depends(get_db), usuario_actual: dict = Depends(get_usuario_actual)):
    if usuario_id != usuario_actual.get("id") and not usuario_actual.get("es_admin"):
        raise HTTPException(status_code=403, detail="No puedes ver los equipos de otro usuario")
    return db.query(Equipo).filter(Equipo.usuario_id == usuario_id).all()


@router.get("/{usuario_id}/{carrera_id}", response_model=EquipoResponse)
def obtener_equipo(usuario_id: int, carrera_id: int, db: Session = Depends(get_db), usuario_actual: dict = Depends(get_usuario_actual)):
    if usuario_id != usuario_actual.get("id") and not usuario_actual.get("es_admin"):
        raise HTTPException(status_code=403, detail="No puedes ver el equipo de otro usuario")
    equipo = db.query(Equipo).filter(
        Equipo.usuario_id == usuario_id,
        Equipo.carrera_id == carrera_id
    ).first()
    if not equipo:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")
    return equipo
