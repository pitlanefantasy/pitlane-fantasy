from sqlalchemy import Column, Integer, String, Date, Boolean
from sqlalchemy import ForeignKey
from app.core.database import Base
from sqlalchemy.orm import relationship

class Carrera(Base):
    __tablename__ = "carreras"

    id         = Column(Integer, primary_key=True, index=True)
    nombre     = Column(String(100), nullable=False)
    circuito   = Column(String(100), nullable=False)
    circuito_id = Column(Integer, ForeignKey("circuitos.id"), nullable=True)
    pais       = Column(String(50), nullable=False)
    fecha      = Column(Date, nullable=False)
    temporada  = Column(Integer, nullable=False)
    completada = Column(Boolean, default=False)
    circuito_detalle = relationship("Circuito")
