from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.sql import func
from app.core.database import Base

class Liga(Base):
    __tablename__ = "ligas"

    id         = Column(Integer, primary_key=True, index=True)
    nombre     = Column(String(100), nullable=False)
    codigo     = Column(String(15), unique=True, nullable=False)
    creador_id = Column(Integer, ForeignKey("usuarios.id"), nullable=True)
    temporada  = Column(Integer, nullable=False)
    publica    = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())

class LigaUsuario(Base):
    __tablename__ = "liga_usuarios"
    __table_args__ = (UniqueConstraint("liga_id", "usuario_id", name="liga_usuarios_liga_id_usuario_id_key"),)

    id         = Column(Integer, primary_key=True, index=True)
    liga_id    = Column(Integer, ForeignKey("ligas.id"), nullable=False)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    joined_at  = Column(DateTime, server_default=func.now())
