# Labcontrol8

Aplicación frontend desarrollada en Angular, estructurada bajo un patrón modular por feature y una capa core para servicios y guards. El diseño sigue el enfoque de separación de responsabilidades, con componentes desacoplados y servicios inyectables. La navegación y la protección de rutas se gestionan centralizadamente, y la interfaz es responsive gracias al uso de Bootstrap y grid de 12 columnas.

El trabajo colaborativo se gestiona mediante GIT, utilizando ramas cortas y revisiones por pull request. El repositorio mantiene la rama principal siempre estable y documenta los cambios con mensajes claros y convenciones estándar. El flujo de trabajo permite integración continua y control de versiones eficiente.

El proyecto implementa guards para roles y autenticación, servicios HTTP centralizados y modelos tipados. La comunicación con los microservicios backend se realiza mediante APIs REST, cumpliendo con los requisitos de integración y seguridad.

Para extender la aplicación, se recomienda crear nuevos componentes en `src/app/features`, servicios en `src/app/core/services` y modelos en `src/app/models`, siguiendo la estructura y convenciones existentes.

---

## Comandos básicos Angular
- `ng serve`: servidor de desarrollo en `http://localhost:4200/`, recarga automática.
- `ng build`: genera artefactos en `dist/`.
- `ng test`: pruebas unitarias (Karma).
- `ng e2e`: pruebas end-to-end (requiere paquete e2e instalado).

## Estrategia Git
- Rama principal (`main`) siempre estable.
- Ramas de trabajo para features, fixes y tareas.
- Pull requests para revisión y merge.
- Etiquetado de releases y manejo de hotfixes desde `main`.

## Probar endpoints con Postman
1. Importa la colección desde `postman/DSY2205_labcontrol8.postman_collection.json`.
2. Endpoints de ejemplo:
  - Usuarios: `GET http://localhost:8080/api/usuarios`
  - Laboratorios: `GET http://localhost:8081/api/laboratorios`
  - Reservas: `GET http://localhost:8083/api/reservas`
Puedes agregar más requests según los endpoints del backend.
- **Equipo pequeno**: rebase diario sobre `main`, al menos una revision por PR, ramas vivas max 3-5 dias, etiquetar releases (`git tag v1.2.0 && git push origin v1.2.0`); hotfixes via `fix/<bug>` rebasadas desde `main`.

## Probar endpoints con Postman
1. Importa la coleccion desde `postman/DSY2205_labcontrol8.postman_collection.json`.
2. Endpoints de ejemplo:
   - Usuarios: `GET http://localhost:8080/api/usuarios`
   - Laboratorios: `GET http://localhost:8081/api/laboratorios`
   - Reservas: `GET http://localhost:8083/api/reservas`
Puedes agregar mas requests segun los endpoints del backend.

## Comandos basicos Angular
- `ng serve`: dev server en `http://localhost:4200/`, recarga automatica.
- `ng build`: genera artefactos en `dist/`.
- `ng test`: unit tests (Karma).
- `ng e2e`: end-to-end (requiere paquete e2e instalado).
