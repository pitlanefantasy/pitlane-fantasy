from sqlalchemy import Column, Integer, String
from app.core.database import Base


class Circuito(Base):
    __tablename__ = "circuitos"

    id                = Column(Integer, primary_key=True, index=True)
    nombre            = Column(String(100), nullable=False)
    pais              = Column(String(50), nullable=False)
    slug              = Column(String(100), unique=True, nullable=False)
    curvas_izquierda  = Column(Integer, nullable=True)
    curvas_derecha    = Column(Integer, nullable=True)
    velocidad_max_kmh = Column(Integer, nullable=True)
