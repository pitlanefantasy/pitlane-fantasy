from sqlalchemy import Column, Integer, String, Numeric
from app.core.database import Base

class Fabricante(Base):
    __tablename__ = "fabricantes"
    id      = Column(Integer, primary_key=True, index=True)
    nombre  = Column(String(50), unique=True, nullable=False)
    precio  = Column(Numeric(4, 1), nullable=False)
