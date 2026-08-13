from sqlalchemy import Column, Integer, String, Text
from app.core.database import Base

class Circuito(Base):
    __tablename__ = "circuitos"
    id                    = Column(Integer, primary_key=True, index=True)
    nombre                = Column(String(100), nullable=False)
    pais                  = Column(String(50), nullable=False)
    ubicacion             = Column(String(150), nullable=True)
    slug                  = Column(String(100), unique=True, nullable=False)
    curvas_izquierda      = Column(Integer, nullable=True)
    curvas_derecha        = Column(Integer, nullable=True)
    velocidad_max_kmh     = Column(Integer, nullable=True)
    ultimo_ganador_motogp = Column(String(100), nullable=True)
    ultimo_ganador_moto2  = Column(String(100), nullable=True)
    ultimo_ganador_moto3  = Column(String(100), nullable=True)
    historia               = Column(Text, nullable=True)
