from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.sql import func
from app.core.database import Base

class Usuario(Base):
    __tablename__ = "usuarios"
    id                             = Column(Integer, primary_key=True, index=True)
    email                          = Column(String(255), unique=True, nullable=False)
    nombre                         = Column(String(100), nullable=False)
    password_hash                  = Column(String(255), nullable=False)
    es_admin                       = Column(Boolean, default=False, nullable=False)
    email_verificado               = Column(Boolean, default=False, nullable=False)
    token_verificacion             = Column(String(64), nullable=True)
    intentos_login_sin_verificar   = Column(Integer, default=0, nullable=False)
    token_reset_password           = Column(String(64), nullable=True)
    token_reset_expira             = Column(DateTime, nullable=True)
    intentos_login_fallidos        = Column(Integer, default=0, nullable=False)
    bloqueado_hasta                = Column(DateTime, nullable=True)
    created_at                     = Column(DateTime, server_default=func.now())
