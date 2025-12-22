# Labcontrol8

Frontend Angular para la gestion de laboratorios y resultados. La app usa un patron modular por feature y una capa core para servicios y guards. El diseno separa responsabilidades con componentes desacoplados y servicios inyectables. La interfaz es responsive con Bootstrap y grid de 12 columnas.

La app implementa guards de roles, servicios HTTP centralizados y modelos tipados. La comunicacion con los microservicios backend se realiza mediante APIs REST.

## Estructura base
- `src/app/features`: vistas y formularios por modulo.
- `src/app/core/services`: servicios HTTP y estado.
- `src/app/models`: interfaces y tipos.

## Git (trabajo personal)
- Rama principal `main` con commits frecuentes.
- Historial de cambios en el repositorio del frontend.

## Comandos Angular
- `ng serve`: dev server en `http://localhost:4200/`.
- `ng build`: genera artefactos en `dist/`.
- `ng test`: pruebas unitarias (Karma).

## Postman (opcional)
1. Importa la coleccion desde `postman/DSY2205_labcontrol8.postman_collection.json`.
2. Endpoints de ejemplo:
   - Usuarios: `GET http://localhost:8080/api/usuarios`
   - Laboratorios: `GET http://localhost:8081/api/laboratorios`
   - Reservas: `GET http://localhost:8083/api/reservas`
