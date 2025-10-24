// ==========================================
// INICIALIZACIÓN DE LA PÁGINA DE LIBROS
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  // Limpia la caché corrupta de libros
  const librosGuardados = localStorage.getItem('libros');
  if (librosGuardados) {
    try {
      const libros = JSON.parse(librosGuardados);
      const hasPlaceholders = libros.some(libro =>
        libro.imagen && (
          libro.imagen.includes('via.placeholder.com') ||
          libro.imagen.includes('FFFFFF?text=') ||
          libro.imagen.includes('2C3E50?text=')
        )
      );

      if (hasPlaceholders) {
        // Elimina la caché corrupta de libros si existen placeholders
        localStorage.removeItem('libros');
      }
    } catch (error) {
      // Si hay error al parsear, elimina la caché
      localStorage.removeItem('libros');
    }
  }

  // Inicializa la librería si está disponible
  if (typeof LibreriaManager !== 'undefined') {
    console.log('🔍 DEPURACIÓN - Inicializando LibreriaManager...');
    LibreriaManager.inicializarLibros();
    LibreriaManager.cargarLibros();

    // Actualiza el contador del carrito
    LibreriaManager.actualizarContadorCarrito();
    console.log('🔍 DEPURACIÓN - LibreriaManager inicializado completamente');
  }

  // Inicializa el sistema de descuentos si está disponible
  if (typeof DiscountBannerManager !== 'undefined') {
    DiscountBannerManager.inicializarDescuentos();
  }

  // Configura el event listener para el icono del carrito
  const cartIcon = document.getElementById('cartIcon');
  if (cartIcon) {
    cartIcon.addEventListener('click', () => {
      window.location.href = 'carrito.html';
    });
  }
});