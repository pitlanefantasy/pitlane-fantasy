from pydantic import BaseModel

class FabricanteResponse(BaseModel):
    id: int
    nombre: str
    precio: float

    class Config:
        from_attributes = True
