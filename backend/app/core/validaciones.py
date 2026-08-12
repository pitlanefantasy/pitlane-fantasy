MIN_LONGITUD_PASSWORD = 8

CONTRASEÑAS_PROHIBIDAS = {
    "password", "contraseña", "contrasena", "12345678", "123456789", "1234567890",
    "qwertyui", "qwerty123", "letmein", "admin123", "welcome1", "iloveyou",
    "sunshine", "football", "princess", "dragon123", "monkey123", "master123",
    "superman", "trustno1", "motogp123", "pitplay123", "cambiame",
    "lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo",
    "enero", "febrero", "marzo", "abril", "mayo", "junio", "julio",
    "agosto", "septiembre", "octubre", "noviembre", "diciembre",
}


def validar_password_fuerte(password: str) -> str:
    if len(password) < MIN_LONGITUD_PASSWORD:
        raise ValueError(f"La contraseña debe tener al menos {MIN_LONGITUD_PASSWORD} caracteres")

    if password.lower() in CONTRASEÑAS_PROHIBIDAS:
        raise ValueError("Esa contraseña es demasiado común, elige otra")

    if len(set(password.lower())) == 1:
        raise ValueError("La contraseña no puede ser el mismo carácter repetido")

    minusculas = "abcdefghijklmnopqrstuvwxyz"
    digitos = "0123456789"
    pw_lower = password.lower()
    if pw_lower in minusculas or pw_lower in minusculas[::-1] or pw_lower in digitos or pw_lower in digitos[::-1]:
        raise ValueError("La contraseña es demasiado predecible (secuencia simple)")

    return password
