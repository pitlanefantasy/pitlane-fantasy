from sqlalchemy.orm import Session
from app.models.resultado import Resultado
from app.models.carrera import Carrera
from app.models.piloto import Piloto
from app.models.pronostico import Pronostico

PUNTOS = {
    "campeon": 25,
    "poleman": 20,
    "victorias": 15,
    "segundo": 10,
    "tercero": 10,
    "rookie": 10,
}


def calcular_resultados_reales(categoria: str, temporada: int, db: Session) -> dict:
    """
    A partir de los resultados de carrera ya cargados, calcula quién es de
    verdad el campeón/2º/3º (por puntos acumulados), el poleman, el piloto
    con más victorias y el mejor rookie de una categoría/temporada.
    """
    pilotos_categoria = db.query(Piloto).filter(Piloto.categoria == categoria).all()
    info_piloto = {p.id: p for p in pilotos_categoria}

    resultados = (
        db.query(Resultado)
        .join(Carrera, Resultado.carrera_id == Carrera.id)
        .filter(Carrera.temporada == temporada)
        .filter(Resultado.piloto_id.in_(info_piloto.keys()))
        .all()
    )

    puntos_por_piloto = {}
    poles_por_piloto = {}
    victorias_por_piloto = {}

    for r in resultados:
        pid = r.piloto_id
        puntos_por_piloto[pid] = puntos_por_piloto.get(pid, 0) + float(r.puntos_total or 0)
        if r.hizo_pole:
            poles_por_piloto[pid] = poles_por_piloto.get(pid, 0) + 1
        if r.posicion_carrera == 1:
            victorias_por_piloto[pid] = victorias_por_piloto.get(pid, 0) + 1

    def top(diccionario, n):
        return [pid for pid, _ in sorted(diccionario.items(), key=lambda x: x[1], reverse=True)[:n]]

    podio = top(puntos_por_piloto, 3)
    poleman = top(poles_por_piloto, 1)
    victorias = top(victorias_por_piloto, 1)
    rookies_puntos = {pid: pts for pid, pts in puntos_por_piloto.items() if info_piloto[pid].rookie}
    rookie = top(rookies_puntos, 1)

    return {
        "campeon": podio[0] if len(podio) > 0 else None,
        "segundo": podio[1] if len(podio) > 1 else None,
        "tercero": podio[2] if len(podio) > 2 else None,
        "poleman": poleman[0] if poleman else None,
        "victorias": victorias[0] if victorias else None,
        "rookie": rookie[0] if rookie else None,
    }


def calcular_puntos_pronostico(pronostico: Pronostico, db: Session) -> float:
    """Compara un pronóstico contra los resultados reales y devuelve los puntos ganados."""
    total = 0.0
    categorias = {"MotoGP": "motogp", "Moto2": "moto2", "Moto3": "moto3"}

    for categoria_real, prefijo in categorias.items():
        real = calcular_resultados_reales(categoria_real, pronostico.temporada, db)

        if real["campeon"] is not None and getattr(pronostico, f"campeon_{prefijo}_id") == real["campeon"]:
            total += PUNTOS["campeon"]
        if real["segundo"] is not None and getattr(pronostico, f"segundo_{prefijo}_id") == real["segundo"]:
            total += PUNTOS["segundo"]
        if real["tercero"] is not None and getattr(pronostico, f"tercero_{prefijo}_id") == real["tercero"]:
            total += PUNTOS["tercero"]
        if real["poleman"] is not None and getattr(pronostico, f"poleman_{prefijo}_id") == real["poleman"]:
            total += PUNTOS["poleman"]
        if real["victorias"] is not None and getattr(pronostico, f"victorias_{prefijo}_id") == real["victorias"]:
            total += PUNTOS["victorias"]
        if real["rookie"] is not None and getattr(pronostico, f"rookie_{prefijo}_id") == real["rookie"]:
            total += PUNTOS["rookie"]

    pronostico.puntos_pronosticos = total
    db.add(pronostico)
    return total
