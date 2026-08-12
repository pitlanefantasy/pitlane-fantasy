import os
import secrets
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

REMITENTE = "noreply@pitplayfantasy.com"
URL_BASE = "https://pitplayfantasy.com"


def generar_token() -> str:
    """Genera un token único y seguro para enlaces de un solo uso."""
    return secrets.token_urlsafe(32)


def _enviar(destinatario: str, asunto: str, html: str):
    mensaje = Mail(
        from_email=REMITENTE,
        to_emails=destinatario,
        subject=asunto,
        html_content=html,
    )
    sg = SendGridAPIClient(os.getenv("SENDGRID_API_KEY"))
    respuesta = sg.send(mensaje)
    return respuesta.status_code


def enviar_email_verificacion(destinatario: str, nombre: str, token: str):
    """Envía el correo de verificación con el enlace único."""
    enlace = f"{URL_BASE}/verificar/{token}"
    html = f"""
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
    return _enviar(destinatario, "Confirma tu cuenta en PitPlay Fantasy", html)


def enviar_email_reset_password(destinatario: str, nombre: str, token: str):
    """Envía el correo para restablecer la contraseña, con enlace válido 1 hora."""
    enlace = f"{URL_BASE}/restablecer/{token}"
    html = f"""
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h1 style="color: #E4472B;">¡Hola, {nombre}!</h1>
      <p>Hemos recibido una solicitud para restablecer tu contraseña en PitPlay Fantasy.</p>
      <a href="{enlace}" style="display:inline-block; background:#E4472B; color:white; padding:12px 24px; text-decoration:none; border-radius:4px; font-weight:bold;">
        Restablecer mi contraseña
      </a>
      <p style="color:#6B7280; font-size:12px; margin-top:24px;">
        Este enlace caduca en 1 hora. Si no has sido tú, ignora este correo — tu contraseña no cambiará.
      </p>
    </div>
    """
    return _enviar(destinatario, "Restablece tu contraseña en PitPlay Fantasy", html)
