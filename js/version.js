// VERSIÓN DE LA APLICACIÓN - CONTROL DE CACHÉ SIMPLE
window.APP_VERSION = '2.1.1';

// Sistema simple para evitar caché persistente
(function() {
  const VERSION_KEY = 'app_version';
  const savedVersion = localStorage.getItem(VERSION_KEY);

  // Si es diferente versión o no hay versión guardada
  if (savedVersion !== window.APP_VERSION) {
    console.log(`Nueva versión: ${savedVersion} → ${window.APP_VERSION}`);

    // Guardar nueva versión
    localStorage.setItem(VERSION_KEY, window.APP_VERSION);

    // Forzar recarga
    window.location.reload(true);
  }
})();

// Función para limpiar caché manualmente
window.clearCache = function() {
  localStorage.clear();
  sessionStorage.clear();
  window.location.reload(true);
};