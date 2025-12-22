# Labcontrol8 - Dev Notes

Frontend Angular con patron modular por feature y una capa core para servicios y guards. La interfaz usa Bootstrap con grid de 12 columnas.

## Servicios y estructura
Los servicios HTTP viven en `src/app/core/services/` y son consumidos por componentes y guards. La comunicacion con los microservicios backend se realiza mediante APIs REST.

## Runtime API configuration
- `src/assets/env.js` define `window.__env`.
- `docker-entrypoint.sh` reemplaza placeholders en `env.js` al iniciar el contenedor.
- En desarrollo, si `window.__env` no existe, la app usa `src/environments/environment.ts`.

Placeholders usados:
- `__API_BASE_URL__`
- `__API_USUARIOS__`
- `__API_LABORATORIOS__`
- `__API_RESULTADOS__`

## Como usar
- Local (dev):
  ```bash
  npm start
  # o
  ng serve
  ```
- Docker Compose:
  ```bash
  docker compose up --build
  ```

## Docker cloud
- `docker-compose.yml` esta pensado para Windows local.
- `docker-compose.cloud.yml` usa variables `.env` para rutas y credenciales.

## Oracle wallet
Los microservicios Spring Boot requieren el wallet de Oracle Cloud (`TNS_ADMIN`). El directorio del wallet se monta en cada servicio segun lo configurado en `docker-compose.cloud.yml`.
