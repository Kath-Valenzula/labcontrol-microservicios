# Labcontrol8

## Arquitectura y patrones (frontend)
- **Modular por feature y capa core**: dominios UI en `src/app/features` (auth, laboratorios, resultados, perfil); servicios singleton y guards en `src/app/core`; modelos tipados en `src/app/models`. Separa presentacion de acceso a datos.
- **Layout como shell**: `src/app/layout/main-layout/main-layout.component.*` aloja la estructura comun (navbar/aside) y enruta el resto.
- **Servicios inyectables**: componentes consumen `AuthService`, `LaboratoriosService`, `ResultadosService`, `ConfigService` (`src/app/core/services`) en lugar de instanciar dependencias.
- **Observer con RxJS**: `AuthService` expone `currentUser$` (BehaviorSubject) y los servicios retornan `Observable` para llamadas HTTP (`*.service.ts`).
- **Guards como capa de politicas**: `src/app/core/guards/auth.guard.ts` y `role.guard.ts` validan sesion y roles antes de cargar vistas.
- **Rutas centralizadas**: `src/app/app.routes.ts` define paths, children y protecciones en un solo lugar.

### Como extender sin romper el diseno
1. Crea componentes en `src/app/features/<dominio>`.
2. Implementa un servicio en `src/app/core/services` que exponga `Observable`.
3. Define el modelo en `src/app/models`.
4. Declara la ruta en `src/app/app.routes.ts` y aplica guard si corresponde.

## Estrategia Git (frontend)
- **Trunk ligero**: `main` siempre estable; trabajo diario en ramas cortas.
- **Convencion**: `feature/<tema>`, `fix/<bug>`, `chore/<tarea>`. Commits pequenos y descriptivos (`feat: crear formulario de resultados`).
- **Flujo sugerido**:
  ```bash
  git switch main
  git pull --rebase
  git switch -c feature/nuevo-formulario
  # cambios y pruebas
  git status
  git add src/... docs/...
  git commit -m "feat: crear formulario de resultados"
  git fetch origin
  git rebase origin/main
  git push -u origin feature/nuevo-formulario
  ```
  Integra por PR hacia `main`; preferir `--ff-only` para mantener historial limpio:
  ```bash
  git switch main
  git pull --rebase
  git merge --ff-only origin/feature/nuevo-formulario
  git push origin main
  git push origin --delete feature/nuevo-formulario
  ```
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
