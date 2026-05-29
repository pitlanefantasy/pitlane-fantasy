from sqlalchemy import Column, Integer, Numeric, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base

class Pronostico(Base):
    __tablename__ = "pronosticos"

    id          = Column(Integer, primary_key=True, index=True)
    usuario_id  = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    temporada   = Column(Integer, nullable=False)

    # Top 3 por categoría
    campeon_motogp_id  = Column(Integer, ForeignKey("pilotos.id"), nullable=True)
    segundo_motogp_id  = Column(Integer, ForeignKey("pilotos.id"), nullable=True)
    tercero_motogp_id  = Column(Integer, ForeignKey("pilotos.id"), nullable=True)
    campeon_moto2_id   = Column(Integer, ForeignKey("pilotos.id"), nullable=True)
    segundo_moto2_id   = Column(Integer, ForeignKey("pilotos.id"), nullable=True)
    tercero_moto2_id   = Column(Integer, ForeignKey("pilotos.id"), nullable=True)
    campeon_moto3_id   = Column(Integer, ForeignKey("pilotos.id"), nullable=True)
    segundo_moto3_id   = Column(Integer, ForeignKey("pilotos.id"), nullable=True)
    tercero_moto3_id   = Column(Integer, ForeignKey("pilotos.id"), nullable=True)

    # Más poles por categoría
    poleman_motogp_id  = Column(Integer, ForeignKey("pilotos.id"), nullable=True)
    poleman_moto2_id   = Column(Integer, ForeignKey("pilotos.id"), nullable=True)
    poleman_moto3_id   = Column(Integer, ForeignKey("pilotos.id"), nullable=True)

    # Más victorias por categoría
    victorias_motogp_id = Column(Integer, ForeignKey("pilotos.id"), nullable=True)
    victorias_moto2_id  = Column(Integer, ForeignKey("pilotos.id"), nullable=True)
    victorias_moto3_id  = Column(Integer, ForeignKey("pilotos.id"), nullable=True)

    # Mejor rookie por categoría
    rookie_motogp_id   = Column(Integer, ForeignKey("pilotos.id"), nullable=True)
    rookie_moto2_id    = Column(Integer, ForeignKey("pilotos.id"), nullable=True)
    rookie_moto3_id    = Column(Integer, ForeignKey("pilotos.id"), nullable=True)

    # Más caídas por categoría
    caidas_motogp_id   = Column(Integer, ForeignKey("pilotos.id"), nullable=True)
    caidas_moto2_id    = Column(Integer, ForeignKey("pilotos.id"), nullable=True)
    caidas_moto3_id    = Column(Integer, ForeignKey("pilotos.id"), nullable=True)

    # Puntos obtenidos al final de temporada
    puntos_pronosticos = Column(Numeric(8, 2), default=0)
    created_at         = Column(DateTime, server_default=func.now())
