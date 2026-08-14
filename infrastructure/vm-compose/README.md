# Configuración de la VM de producción (pitlane-vm)

Esta carpeta documenta cómo está montada la VM `pitlane-vm` (Compute Engine,
`europe-west1-b`), que sustituyó al cluster GKE el 14 de agosto de 2026.

## Qué hay aquí
- `docker-compose.yml` — los 4 servicios: postgres, api, frontend, edge (Nginx).
- `nginx/edge.conf` — reparte tráfico por dominio hacia api/frontend.
- `.env.example` — plantilla de las variables necesarias, sin valores reales.

## Qué NO está aquí, a propósito
- `.env` real (contraseñas y claves) — vive solo en la VM, nunca en Git.
- `certs/tls.crt` y `certs/tls.key` — el certificado de origen de Cloudflare,
  vive solo en la VM. Si hace falta recrearlo, sacarlo del secreto de
  Kubernetes con `kubectl get secret pitlane-tls-origin` (mientras el cluster
  viejo siga existiendo) o generar uno nuevo en Cloudflare.

## Cómo desplegar un cambio de código
1. En pitlanes-server: build + push de la imagen nueva a
   `ghcr.io/pitlanefantasy/...` (ver bitácora para el flujo completo).
2. Conectar a la VM: `gcloud compute ssh pitlane-vm --zone=europe-west1-b --tunnel-through-iap`
3. En la VM, dentro de `~/pitlane-app/`: actualizar la versión en
   `docker-compose.yml`, luego `docker compose pull` + `docker compose up -d`.

## Cómo restaurar esta configuración en una VM nueva desde cero
1. Copiar `docker-compose.yml` y `nginx/edge.conf` a `~/pitlane-app/` en la VM.
2. Crear `.env` a partir de `.env.example`, con los valores reales.
3. Copiar los certificados a `~/pitlane-app/certs/`.
4. `docker compose up -d`.
