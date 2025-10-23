// ==========================================
// INICIALIZACIÓN DE LA PÁGINA DE CARRITO
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  // Inicializa la página del carrito si está disponible
  if (typeof CarritoPageManager !== 'undefined') {
    CarritoPageManager.inicializar();
  }

  // Actualiza el contador del carrito
  if (typeof LibreriaManager !== 'undefined') {
    LibreriaManager.actualizarContadorCarrito();
  }

  // Escucha los eventos de actualización del carrito
  window.addEventListener('carritoActualizado', (event) => {
    if (typeof CarritoPageManager !== 'undefined') {
      CarritoPageManager.cargarCarrito();
      CarritoPageManager.actualizarResumen();
    }
    if (typeof LibreriaManager !== 'undefined') {
      LibreriaManager.actualizarContadorCarrito();
    }
  });

  // Configura el event listener para el icono del carrito
  const cartIcon = document.getElementById('cartIcon');
  if (cartIcon) {
    cartIcon.addEventListener('click', () => {
      window.location.href = 'carrito.html';
    });
  }
});