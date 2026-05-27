from pydantic import BaseModel

class PilotoBase(BaseModel):
    nombre: str
    numero: int
    categoria: str
    equipo: str
    nacionalidad: str | None = None
    precio: float
    activo: bool = True

class PilotoCreate(PilotoBase):
    pass

class PilotoResponse(PilotoBase):
    id: int

    class Config:
        from_attributes = True
