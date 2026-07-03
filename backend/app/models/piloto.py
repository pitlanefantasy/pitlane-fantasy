from sqlalchemy import Column, Integer, String, Numeric, Boolean
from app.core.database import Base

class Piloto(Base):
    __tablename__ = "pilotos"

    id           = Column(Integer, primary_key=True, index=True)
    nombre       = Column(String(100), nullable=False)
    numero       = Column(Integer, nullable=False)
    categoria    = Column(String(10), nullable=False)
    equipo       = Column(String(100), nullable=False)
    nacionalidad = Column(String(50))
    precio       = Column(Numeric(5, 2), nullable=False)
    activo       = Column(Boolean, default=True)
    rookie       = Column(Boolean, default=False)