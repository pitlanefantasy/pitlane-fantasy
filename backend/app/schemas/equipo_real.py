from pydantic import BaseModel

class EquipoRealResponse(BaseModel):
    id: int
    nombre: str
    precio: float

    class Config:
        from_attributes = True
