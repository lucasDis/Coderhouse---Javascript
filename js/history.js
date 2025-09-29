// FUNCIONES PARA HISTORIAL
function cargarHistorial() {
  UIManager.cargarHistorial();
}

function limpiarHistorial() {
  if (confirm('¿Estás seguro de que quieres limpiar todo el historial?')) {
    StorageManager.limpiarHistorial();
    UIManager.mostrarMensaje('Historial limpiado exitosamente', 'success');
    
    setTimeout(() => {
      cargarHistorial();
    }, 1000);
  }
}

function cerrarModal() {
  document.getElementById('recipeModal').style.display = 'none';
}

// Cerrar modal al hacer clic fuera de él
window.onclick = function(event) {
  const modal = document.getElementById('recipeModal');
  if (event.target === modal) {
    cerrarModal();
  }
}

// Inicializar la página cuando se carga
document.addEventListener('DOMContentLoaded', () => {
  cargarHistorial();
});
