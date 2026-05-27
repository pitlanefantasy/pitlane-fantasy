from sqlalchemy import Column, Integer, String, Date, Boolean
from app.core.database import Base

class Carrera(Base):
    __tablename__ = "carreras"

    id         = Column(Integer, primary_key=True, index=True)
    nombre     = Column(String(100), nullable=False)
    circuito   = Column(String(100), nullable=False)
    pais       = Column(String(50), nullable=False)
    fecha      = Column(Date, nullable=False)
    temporada  = Column(Integer, nullable=False)
    completada = Column(Boolean, default=False)
