#!/bin/sh
set -e

# Configura la URL de la API desde la variable de entorno
if [ -n "$API_BASE_URL" ]; then
  if [ -f /usr/share/nginx/html/assets/env.js ]; then
    echo "[entrypoint] Configurando API_BASE_URL"
    sed -i "s|__API_BASE_URL__|$API_BASE_URL|g" /usr/share/nginx/html/assets/env.js || true
  else
    echo "[entrypoint] Advertencia: archivo env.js no encontrado"
  fi
else
  echo "[entrypoint] API_BASE_URL no configurada, usando valor por defecto"
fi

# Ejecutar nginx
exec "$@"
