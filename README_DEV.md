# LabControl8 — Notas de desarrollo

Este frontend está desarrollado en Angular siguiendo un patrón modular por feature y una capa core para servicios y guards. El diseño separa presentación y lógica de acceso a datos, y la interfaz es responsive gracias a Bootstrap y grid de 12 columnas.

El trabajo colaborativo se gestiona mediante GIT, con ramas cortas, revisiones por pull request y control de versiones. El repositorio mantiene la rama principal estable y documenta los cambios con mensajes claros y convenciones estándar.

## Servicios y estructura

Los servicios HTTP oficiales están en `src/app/core/services/` y son consumidos por componentes y guards. La comunicación con los microservicios backend se realiza mediante APIs REST, cumpliendo con los requisitos de integración y seguridad.

## Runtime API configuration

Se agregó `src/assets/env.js` y se incluye en `src/index.html`. En contenedor Docker se puede inyectar la URL de la API mediante la variable de entorno `API_BASE_URL`. El `Dockerfile` copia un `docker-entrypoint.sh` que reemplaza el placeholder `__API_BASE_URL__` en `assets/env.js` al iniciar el contenedor. En desarrollo (`ng serve`) si no existe `window.__env.API_BASE_URL`, la aplicación hace fallback a `src/environments/environment.ts`.

## Cómo usar

- Levantar localmente (dev):
   ```bash
   npm start
   # o
   ng serve
   ```
- Levantar con Docker Compose (desde la carpeta que contiene `docker-compose.yml`):
   ```bash
   docker compose up --build
   ```

## Configuración de la base de datos

Los microservicios Spring Boot requieren el wallet de Oracle Cloud (`TNS_ADMIN`). El directorio del wallet debe estar montado en cada servicio según lo configurado en `docker-compose.yml`.

## Cómo probar los endpoints con Postman

1. Importa la colección desde `postman/DSY2205_labcontrol8.postman_collection.json`.
2. Prueba los endpoints de ejemplo:
    - Usuarios: `GET http://localhost:8080/api/usuarios`
    - Laboratorios: `GET http://localhost:8081/api/laboratorios`
    - Reservas: `GET http://localhost:8083/api/reservas`

Puedes agregar más requests según los endpoints de tu backend.
