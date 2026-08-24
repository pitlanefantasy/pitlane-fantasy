from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_usuario_actual
from app.models.liga import Liga, LigaUsuario
from app.models.equipo import Equipo
from app.models.pronostico import Pronostico
from app.models.usuario import Usuario
from app.schemas.liga import LigaCreate, LigaResponse
import random, string

router = APIRouter(prefix="/ligas", tags=["ligas"])


def generar_codigo():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))


def puntos_totales_usuario(usuario_id: int, temporada: int, db: Session) -> float:
    equipos = db.query(Equipo).filter(
        Equipo.usuario_id == usuario_id,
        Equipo.temporada == temporada
    ).all()
    total = sum(float(e.puntos_total or 0) for e in equipos)

    pronostico = db.query(Pronostico).filter(
        Pronostico.usuario_id == usuario_id,
        Pronostico.temporada == temporada
    ).first()
    if pronostico:
        total += float(pronostico.puntos_pronosticos or 0)

    return total


@router.post("/", response_model=LigaResponse)
def crear_liga(liga: LigaCreate, db: Session = Depends(get_db), usuario_actual: dict = Depends(get_usuario_actual)):
    datos_liga = liga.model_dump()
    datos_liga["creador_id"] = usuario_actual.get("id")
    nueva = Liga(**datos_liga, codigo=generar_codigo())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)

    # El creador se une automáticamente a su propia liga
    if nueva.creador_id:
        db.add(LigaUsuario(liga_id=nueva.id, usuario_id=nueva.creador_id))
        db.commit()

    return nueva


@router.post("/{codigo}/unirse")
def unirse_liga(codigo: str, usuario_id: int, db: Session = Depends(get_db), usuario_actual: dict = Depends(get_usuario_actual)):
    if usuario_id != usuario_actual.get("id") and not usuario_actual.get("es_admin"):
        raise HTTPException(status_code=403, detail="No puedes unir a otro usuario a una liga")
    liga = db.query(Liga).filter(Liga.codigo == codigo).first()
    if not liga:
        raise HTTPException(status_code=404, detail="Liga no encontrada")
    existente = db.query(LigaUsuario).filter(
        LigaUsuario.liga_id == liga.id,
        LigaUsuario.usuario_id == usuario_id
    ).first()
    if existente:
        raise HTTPException(status_code=400, detail="Ya eres miembro de esta liga")
    miembro = LigaUsuario(liga_id=liga.id, usuario_id=usuario_id)
    db.add(miembro)
    db.commit()
    return {"mensaje": f"Te has unido a {liga.nombre}", "codigo": codigo}


@router.get("/mis-ligas", response_model=list[LigaResponse])
def mis_ligas(db: Session = Depends(get_db), usuario_actual: dict = Depends(get_usuario_actual)):
    """Ligas (públicas o privadas) de las que el usuario del token es miembro."""
    liga_ids = db.query(LigaUsuario.liga_id).filter(
        LigaUsuario.usuario_id == usuario_actual.get("id")
    ).distinct()
    return db.query(Liga).filter(Liga.id.in_(liga_ids)).all()


@router.get("/{liga_id}", response_model=LigaResponse)
def obtener_liga(liga_id: int, db: Session = Depends(get_db)):
    liga = db.query(Liga).filter(Liga.id == liga_id).first()
    if not liga:
        raise HTTPException(status_code=404, detail="Liga no encontrada")
    return liga


@router.get("/{liga_id}/ranking")
def ranking_liga(liga_id: int, db: Session = Depends(get_db)):
    liga = db.query(Liga).filter(Liga.id == liga_id).first()
    if not liga:
        raise HTTPException(status_code=404, detail="Liga no encontrada")

    miembros = db.query(LigaUsuario).filter(LigaUsuario.liga_id == liga_id).all()
    ranking = []
    for m in miembros:
        usuario = db.query(Usuario).filter(Usuario.id == m.usuario_id).first()
        total = puntos_totales_usuario(m.usuario_id, liga.temporada, db)
        ranking.append({"usuario": usuario.nombre, "puntos": total})

    return sorted(ranking, key=lambda x: x["puntos"], reverse=True)


@router.get("/global/{temporada}/ranking")
def ranking_global(temporada: int, db: Session = Depends(get_db)):
    ids_con_equipo = db.query(Equipo.usuario_id).filter(Equipo.temporada == temporada).distinct()
    ids_con_pronostico = db.query(Pronostico.usuario_id).filter(Pronostico.temporada == temporada).distinct()
    usuario_ids = {row[0] for row in ids_con_equipo} | {row[0] for row in ids_con_pronostico}

    ranking = []
    for uid in usuario_ids:
        usuario = db.query(Usuario).filter(Usuario.id == uid).first()
        if not usuario:
            continue
        total = puntos_totales_usuario(uid, temporada, db)
        ranking.append({"usuario": usuario.nombre, "puntos": total})

    return sorted(ranking, key=lambda x: x["puntos"], reverse=True)


@router.get("/", response_model=list[LigaResponse])
def ligas_publicas(db: Session = Depends(get_db)):
    return db.query(Liga).filter(Liga.publica == True).all()
