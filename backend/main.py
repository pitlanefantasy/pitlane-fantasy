from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.routers import usuarios, pilotos, carreras, equipos, pronosticos, resultados, ligas
import os

load_dotenv()

app = FastAPI(
    title=os.getenv("APP_NAME"),
    version=os.getenv("VERSION"),
    description="API del juego fantasy de MotoGP, Moto2 y Moto3"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://192.168.0.139:3000",
        "http://localhost:3000",
        "https://pitplayfantasy.com",
        "http://pitplayfantasy.com",
        "https://www.pitplayfantasy.com",
        "http://www.pitplayfantasy.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(usuarios.router)
app.include_router(pilotos.router)
app.include_router(carreras.router)
app.include_router(equipos.router)
app.include_router(pronosticos.router)
app.include_router(resultados.router)
app.include_router(ligas.router)

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