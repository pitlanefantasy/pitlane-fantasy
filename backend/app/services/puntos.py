# Tabla de puntos por posición en carrera
PUNTOS_CARRERA = {
    1: 25, 2: 20, 3: 16, 4: 13, 5: 11,
    6: 10, 7: 9,  8: 8,  9: 7,  10: 6,
    11: 5, 12: 4, 13: 3, 14: 2, 15: 1
}

# Tabla de puntos por posición en sprint (solo MotoGP)
PUNTOS_SPRINT = {
    1: 12, 2: 9, 3: 7, 4: 6, 5: 5,
    6: 4,  7: 3, 8: 2, 9: 1
}

# Puntos por predicción de pole
PUNTOS_POLE = {
    "exacta": 15,   # aciertas el piloto exacto
    "fila1": 7,     # tu piloto sale en top 2
    "fila2": 3,     # tu piloto sale en top 4
    "fallo": 0
}

def calcular_puntos_carrera(posicion: int, abandono: bool, vuelta_rapida: bool) -> float:
    """Calcula puntos de carrera para un piloto"""
    if abandono:
        return -5.0
    puntos = PUNTOS_CARRERA.get(posicion, 0)
    if vuelta_rapida and posicion and posicion <= 15:
        puntos += 3
    return float(puntos)

def calcular_puntos_sprint(posicion: int) -> float:
    """Calcula puntos de sprint para un piloto"""
    if not posicion:
        return 0.0
    return float(PUNTOS_SPRINT.get(posicion, 0))

def calcular_puntos_pole(posicion_qualy: int, piloto_predicho_id: int, piloto_real_id: int) -> float:
    """Calcula puntos de predicción de pole"""
    if piloto_predicho_id != piloto_real_id:
        if posicion_qualy and posicion_qualy <= 2:
            return float(PUNTOS_POLE["fila1"])
        elif posicion_qualy and posicion_qualy <= 4:
            return float(PUNTOS_POLE["fila2"])
        return float(PUNTOS_POLE["fallo"])
    return float(PUNTOS_POLE["exacta"])

