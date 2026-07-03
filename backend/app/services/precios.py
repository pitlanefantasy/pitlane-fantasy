from sqlalchemy.orm import Session
from app.models.piloto import Piloto
from app.models.resultado import Resultado

# Variaciones de precio en %
VARIACION = {
    'top3':      0.15,   # +15%
    'top10':     0.08,   # +8%
    'top15':     0.00,   # sin cambio
    'fuera':    -0.05,   # -5%
    'abandono': -0.10,   # -10%
}

PRECIO_MIN = 5.0
PRECIO_MAX = 50.0

def actualizar_precios(carrera_id: int, db: Session):
    resultados = db.query(Resultado).filter(
        Resultado.carrera_id == carrera_id
    ).all()

    for r in resultados:
        piloto = db.query(Piloto).filter(Piloto.id == r.piloto_id).first()
        if not piloto:
            continue

        if r.abandono:
            variacion = VARIACION['abandono']
        elif r.posicion_carrera and r.posicion_carrera <= 3:
            variacion = VARIACION['top3']
        elif r.posicion_carrera and r.posicion_carrera <= 10:
            variacion = VARIACION['top10']
        elif r.posicion_carrera and r.posicion_carrera <= 15:
            variacion = VARIACION['top15']
        else:
            variacion = VARIACION['fuera']

        nuevo_precio = float(piloto.precio) * (1 + variacion)
        nuevo_precio = max(PRECIO_MIN, min(PRECIO_MAX, nuevo_precio))
        piloto.precio = round(nuevo_precio, 2)

    db.commit()
