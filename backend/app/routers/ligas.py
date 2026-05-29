from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.liga import Liga, LigaUsuario
from app.models.equipo import Equipo
from app.models.usuario import Usuario
from app.schemas.liga import LigaCreate, LigaResponse
import random, string

router = APIRouter(prefix="/ligas", tags=["ligas"])

def generar_codigo():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))

@router.post("/", response_model=LigaResponse)
def crear_liga(liga: LigaCreate, db: Session = Depends(get_db)):
    nueva = Liga(**liga.model_dump(), codigo=generar_codigo())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva

@router.post("/{codigo}/unirse")
def unirse_liga(codigo: str, usuario_id: int, db: Session = Depends(get_db)):
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

@router.get("/{liga_id}/ranking")
def ranking_liga(liga_id: int, db: Session = Depends(get_db)):
    miembros = db.query(LigaUsuario).filter(LigaUsuario.liga_id == liga_id).all()
    ranking = []
    for m in miembros:
        equipos = db.query(Equipo).filter(Equipo.usuario_id == m.usuario_id).all()
        total = sum(float(e.puntos_total or 0) for e in equipos)
        usuario = db.query(Usuario).filter(Usuario.id == m.usuario_id).first()
        ranking.append({"usuario": usuario.nombre, "puntos": total})
    return sorted(ranking, key=lambda x: x["puntos"], reverse=True)

@router.get("/", response_model=list[LigaResponse])
def ligas_publicas(db: Session = Depends(get_db)):
    return db.query(Liga).filter(Liga.publica == True).all()
