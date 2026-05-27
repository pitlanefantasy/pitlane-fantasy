from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id            = Column(Integer, primary_key=True, index=True)
    email         = Column(String(255), unique=True, nullable=False)
    nombre        = Column(String(100), nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at    = Column(DateTime, server_default=func.now())
