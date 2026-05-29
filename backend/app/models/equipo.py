from sqlalchemy import Column, Integer, Boolean, Numeric, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base

class Equipo(Base):
    __tablename__ = "equipos"

    id               = Column(Integer, primary_key=True, index=True)
    usuario_id       = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    carrera_id       = Column(Integer, ForeignKey("carreras.id"), nullable=False)
    temporada        = Column(Integer, nullable=False)

    # MotoGP
    motogp_oro1_id   = Column(Integer, ForeignKey("pilotos.id"), nullable=False)
    motogp_oro2_id   = Column(Integer, ForeignKey("pilotos.id"), nullable=False)
    motogp_plata1_id = Column(Integer, ForeignKey("pilotos.id"), nullable=False)
    motogp_plata2_id = Column(Integer, ForeignKey("pilotos.id"), nullable=False)
    equipo_nombre    = Column(Integer, nullable=True)
    constructor_nombre = Column(Integer, nullable=True)

    # Moto2
    moto2_oro1_id    = Column(Integer, ForeignKey("pilotos.id"), nullable=False)
    moto2_oro2_id    = Column(Integer, ForeignKey("pilotos.id"), nullable=False)
    moto2_plata1_id  = Column(Integer, ForeignKey("pilotos.id"), nullable=False)
    moto2_plata2_id  = Column(Integer, ForeignKey("pilotos.id"), nullable=False)

    # Moto3
    moto3_oro1_id    = Column(Integer, ForeignKey("pilotos.id"), nullable=False)
    moto3_oro2_id    = Column(Integer, ForeignKey("pilotos.id"), nullable=False)
    moto3_plata1_id  = Column(Integer, ForeignKey("pilotos.id"), nullable=False)
    moto3_plata2_id  = Column(Integer, ForeignKey("pilotos.id"), nullable=False)

    # Capitán
    capitan_id       = Column(Integer, ForeignKey("pilotos.id"), nullable=False)
    comodin_usado    = Column(Boolean, default=False)

    # Predicción pole por GP
    pole_motogp_id   = Column(Integer, ForeignKey("pilotos.id"), nullable=True)
    pole_moto2_id    = Column(Integer, ForeignKey("pilotos.id"), nullable=True)
    pole_moto3_id    = Column(Integer, ForeignKey("pilotos.id"), nullable=True)

    # Puntos
    puntos_sprint    = Column(Numeric(8, 2), default=0)
    puntos_carrera   = Column(Numeric(8, 2), default=0)
    puntos_pole      = Column(Numeric(8, 2), default=0)
    puntos_total     = Column(Numeric(8, 2), default=0)

    created_at       = Column(DateTime, server_default=func.now())
