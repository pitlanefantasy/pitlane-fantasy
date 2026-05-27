from fastapi import FastAPI
from dotenv import load_dotenv
from app.routers import usuarios
import os

# Carga las variables del archivo .env
load_dotenv()

# Crea la aplicación FastAPI
app = FastAPI(
    title=os.getenv("APP_NAME"),
    version=os.getenv("VERSION"),
    description="API del juego fantasy de MotoGP, Moto2 y Moto3"
)

# Registra los routers
app.include_router(usuarios.router)

# Endpoint raíz
@app.get("/")
def root():
    return {
        "mensaje": "Bienvenido a PitLane Fantasy API",
        "version": os.getenv("VERSION"),
        "estado": "funcionando"
    }

# Endpoint de salud
@app.get("/health")
def health():
    return {"estado": "ok"}