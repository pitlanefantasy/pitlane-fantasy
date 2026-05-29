from fastapi import FastAPI
from dotenv import load_dotenv
from app.routers import usuarios, pilotos, carreras, equipos, pronosticos
import os

load_dotenv()

app = FastAPI(
    title=os.getenv("APP_NAME"),
    version=os.getenv("VERSION"),
    description="API del juego fantasy de MotoGP, Moto2 y Moto3"
)

# Registra los routers
app.include_router(usuarios.router)
app.include_router(pilotos.router)
app.include_router(carreras.router)
app.include_router(equipos.router)
app.include_router(pronosticos.router)

@app.get("/")
def root():
    return {
        "mensaje": "Bienvenido a PitLane Fantasy API",
        "version": os.getenv("VERSION"),
        "estado": "funcionando"
    }

@app.get("/health", operation_id="health_check")
def health():
    return {"estado": "ok"}