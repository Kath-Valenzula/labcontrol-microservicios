(function (window) {
  window.__env = window.__env || {};
  // Valores configurables en tiempo de ejecución por Docker.
  // Si no se reemplazan, el ConfigService ignora placeholders "__...__" y hace fallback a environment.ts.
  window.__env.API_BASE_URL = '__API_BASE_URL__';
  window.__env.API_USUARIOS = '__API_USUARIOS__';
  window.__env.API_LABORATORIOS = '__API_LABORATORIOS__';
  window.__env.API_RESULTADOS = '__API_RESULTADOS__';
})(window);
