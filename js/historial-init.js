// ==========================================
// INICIALIZACIÓN DE LA PÁGINA DE HISTORIAL
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  // Actualiza el contador del carrito
  const carritoCount = document.getElementById('cartCount');
  if (carritoCount) {
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    carritoCount.textContent = totalItems;
  }

  // Configura el event listener para el icono del carrito
  const cartIcon = document.getElementById('cartIcon');
  if (cartIcon) {
    cartIcon.addEventListener('click', () => {
      window.location.href = 'carrito.html';
    });
  }
});