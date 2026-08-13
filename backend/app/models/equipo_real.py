from sqlalchemy import Column, Integer, String, Numeric
from app.core.database import Base

class EquipoReal(Base):
    __tablename__ = "equipos_reales"
    id      = Column(Integer, primary_key=True, index=True)
    nombre  = Column(String(100), unique=True, nullable=False)
    precio  = Column(Numeric(4, 1), nullable=False)
