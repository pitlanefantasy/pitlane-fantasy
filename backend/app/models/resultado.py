from sqlalchemy import Column, Integer, Boolean, Numeric, ForeignKey
from app.core.database import Base

class Resultado(Base):
    __tablename__ = "resultados"

    id               = Column(Integer, primary_key=True, index=True)
    carrera_id       = Column(Integer, ForeignKey("carreras.id"), nullable=False)
    piloto_id        = Column(Integer, ForeignKey("pilotos.id"), nullable=False)

    # Posiciones
    posicion_carrera = Column(Integer, nullable=True)
    posicion_sprint  = Column(Integer, nullable=True)
    posicion_qualy   = Column(Integer, nullable=True)

    # Bonificaciones
    vuelta_rapida    = Column(Boolean, default=False)
    abandono         = Column(Boolean, default=False)
    hizo_pole        = Column(Boolean, default=False)

    # Puntos calculados automáticamente
    puntos_carrera   = Column(Numeric(6, 2), default=0)
    puntos_sprint    = Column(Numeric(6, 2), default=0)
    puntos_total     = Column(Numeric(6, 2), default=0)
