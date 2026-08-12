import os
import secrets
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

REMITENTE = "noreply@pitplayfantasy.com"
URL_BASE = "https://pitplayfantasy.com"


def generar_token() -> str:
    """Genera un token único y seguro para el enlace de verificación."""
    return secrets.token_urlsafe(32)


def enviar_email_verificacion(destinatario: str, nombre: str, token: str):
    """Envía el correo de verificación con el enlace único."""
    enlace = f"{URL_BASE}/verificar/{token}"

    mensaje = Mail(
        from_email=REMITENTE,
        to_emails=destinatario,
        subject="Confirma tu cuenta en PitPlay Fantasy",
        html_content=f"""
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h1 style="color: #E4472B;">¡Hola, {nombre}!</h1>
          <p>Gracias por registrarte en PitPlay Fantasy. Confirma tu cuenta para poder jugar:</p>
          <a href="{enlace}" style="display:inline-block; background:#E4472B; color:white; padding:12px 24px; text-decoration:none; border-radius:4px; font-weight:bold;">
            Confirmar mi cuenta
          </a>
          <p style="color:#6B7280; font-size:12px; margin-top:24px;">
            Si no te registraste en PitPlay Fantasy, ignora este correo.
          </p>
        </div>
        """
    )

    sg = SendGridAPIClient(os.getenv("SENDGRID_API_KEY"))
    respuesta = sg.send(mensaje)
    return respuesta.status_code
