#!/bin/sh
set -e

ENV_JS_PATH="/usr/share/nginx/html/assets/env.js"

if [ -f "$ENV_JS_PATH" ]; then
  if [ -n "$API_BASE_URL" ]; then
    echo "[entrypoint] Configurando API_BASE_URL"
    sed -i "s|__API_BASE_URL__|$API_BASE_URL|g" "$ENV_JS_PATH" || true
  fi

  if [ -n "$API_USUARIOS" ]; then
    echo "[entrypoint] Configurando API_USUARIOS"
    sed -i "s|__API_USUARIOS__|$API_USUARIOS|g" "$ENV_JS_PATH" || true
  fi

  if [ -n "$API_LABORATORIOS" ]; then
    echo "[entrypoint] Configurando API_LABORATORIOS"
    sed -i "s|__API_LABORATORIOS__|$API_LABORATORIOS|g" "$ENV_JS_PATH" || true
  fi

  if [ -n "$API_RESULTADOS" ]; then
    echo "[entrypoint] Configurando API_RESULTADOS"
    sed -i "s|__API_RESULTADOS__|$API_RESULTADOS|g" "$ENV_JS_PATH" || true
  fi
else
  echo "[entrypoint] Advertencia: archivo env.js no encontrado"
fi

# Ejecutar nginx
exec "$@"
