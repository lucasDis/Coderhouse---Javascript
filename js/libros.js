// MANEJO DE LIBRERÍA Y CARRITO
class LibreriaManager {
  static libros = [];
  // Genera un stock aleatorio para cada libro
  static generarStockAleatorio(categoria) {
    // Define rangos de stock según el tipo de libro
    const rangosStock = {
      'Cocina Saludable': [8, 25],
      'Cocina Argentina': [10, 30],
      'Cocina tradicional española': [12, 20],
      'Repostería': [5, 15],
      'Cocina Francesa': [3, 10],
      'Cocina Española': [15, 35],
      'Cocina Científica': [6, 18]
    };
    const [min, max] = rangosStock[categoria] || [5, 15];
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  static async inicializarLibros() {
    // Verifica si ya existen libros con stock en localStorage
    const librosGuardados = localStorage.getItem('libros');
    if (librosGuardados) {
      try {
        let libros = JSON.parse(librosGuardados);
        // Verifica que los libros tengan stock asignado
        if (libros.length > 0 && libros[0].stock !== undefined) {
          // CORRECCIÓN AUTOMÁTICA: Verificar y corregir rutas viejas
          let necesitaCorreccion = libros.some(libro =>
            libro.imagen && libro.imagen.includes('../src/images/')
          );
          if (necesitaCorreccion) {
                        let rutasCorregidas = 0;
            libros.forEach((libro) => {
              if (libro.imagen && libro.imagen.includes('../src/images/')) {
                libro.imagen = libro.imagen.replace('../src/images/', '../assets/images/');
                rutasCorregidas++;
              }
            });
            if (rutasCorregidas > 0) {
              // Guardar libros con rutas corregidas
              localStorage.setItem('libros', JSON.stringify(libros));
                          }
          }
          // Asignar libros corregidos a la variable de clase
          this.libros = libros;
        }
      } catch (error) {
                // Si hay error al parsear, continúa con la inicialización normal
      }
    }
    // Si no hay libros guardados o no tienen stock, cargar desde JSON
    await this.cargarLibrosDesdeJSON();
    // Configurar el icono del carrito
    this.configurarIconoCarrito();
    // Actualizar contador del carrito
    this.actualizarContadorCarrito();
  }
  static configurarIconoCarrito() {
    // Configura el event listener para el icono del carrito
    const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) {
      cartIcon.addEventListener('click', () => {
        window.location.href = 'carrito.html';
      });
    }
  }
  static async cargarLibrosDesdeJSON() {
    try {
      // Cargar libros desde el archivo JSON
      const response = await fetch("../data/libros.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      let libros = await response.json();
      // Asignar stock aleatorio a cada libro
      libros = libros.map(libro => ({
        ...libro,
        stock: this.generarStockAleatorio(libro.categoria)
      }));
      this.libros = libros;
      // Guardar en localStorage
      this.guardarLibros();
    } catch (error) {
            // En caso de error, inicializar con array vacío
      this.libros = [];
    }
  }
  static guardarLibros() {
    localStorage.setItem('libros', JSON.stringify(this.libros));
  }
  static cargarLibros() {
    const container = document.getElementById('booksGrid');
    const emptyDiv = document.getElementById('emptyBooks');
    // Verificar que los elementos existan antes de acceder a ellos
    const filterSearch = document.getElementById('filterSearch');
    const filterCategory = document.getElementById('filterCategory');
    const sortBy = document.getElementById('sortBy');
    const terminoBusqueda = filterSearch ? filterSearch.value.toLowerCase() : '';
    const categoria = filterCategory ? filterCategory.value : '';
    const sortMethod = sortBy ? sortBy.value : 'featured';
    // Filtrar y ordenar libros
    let librosFiltrados = [...this.libros];
    // Aplicar filtros
    if (terminoBusqueda) {
      librosFiltrados = librosFiltrados.filter(libro =>
        libro.titulo.toLowerCase().includes(terminoBusqueda) ||
        libro.autor.toLowerCase().includes(terminoBusqueda) ||
        libro.descripcion.toLowerCase().includes(terminoBusqueda)
      );
    }
    if (categoria) {
      librosFiltrados = librosFiltrados.filter(libro => libro.categoria === categoria);
    }
    // Ordenar libros
    switch (sortMethod) {
      case 'price-low':
        librosFiltrados.sort((a, b) => a.precio - b.precio);
        break;
      case 'price-high':
        librosFiltrados.sort((a, b) => b.precio - a.precio);
        break;
      case 'title':
        librosFiltrados.sort((a, b) => a.titulo.localeCompare(b.titulo));
        break;
      case 'rating':
        librosFiltrados.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        // Los destacados primero, luego los demás
        librosFiltrados.sort((a, b) => {
          if (a.destacado && !b.destacado) return -1;
          if (!a.destacado && b.destacado) return 1;
          return 0;
        });
    }
    if (librosFiltrados.length === 0) {
      container.innerHTML = '';
      if (emptyDiv) {
        emptyDiv.style.display = 'block';
      }
      return;
    }
    if (emptyDiv) {
      emptyDiv.style.display = 'none';
    }
    container.innerHTML = librosFiltrados.map(libro => this.crearTarjetaLibro(libro)).join('');
  }
  static crearTarjetaLibro(libro) {
    const estrellas = this.generarEstrellas(libro.rating);
    const precioFormateado = libro.precio.toFixed(2);
    const tituloLimitado = this.limitarTitulo(libro.titulo, 40);
    // Calcula el stock disponible considerando el carrito actual
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    const cantidadEnCarrito = carrito
      .filter(item => item.id == libro.id)
      .reduce((total, item) => total + item.cantidad, 0);
    const stockDisponible = libro.stock - cantidadEnCarrito;
    const botonDeshabilitado = stockDisponible <= 0;
    return `
      <div class="book-card" data-libro-id="${libro.id}">
        <div class="book-image">
          <img src="${libro.imagen}" alt="${libro.titulo}" onerror="this.onerror=null; this.style.display='none'; this.nextElementSibling.style.display='flex';">
          <div class="book-image-error" style="display:none; width:100%;height:400px;background:#f3f4f6;display:flex;align-items:center;justify-content:center;color:#6b7280;font-size:14px;text-align:center;padding:20px;">
            <div>📚<br>Portada no disponible<br><small>${libro.titulo}</small></div>
          </div>
                  </div>
        <div class="book-info">
          <h3 class="book-title">${tituloLimitado}</h3>
          <p class="book-author">${libro.autor}</p>
          <div class="book-meta">
            <span class="book-category">${libro.categoria}</span>
            <span class="book-pages">${libro.paginas} páginas</span>
          </div>
          <div class="book-rating">${estrellas}</div>
          <div class="book-price-container">
            <span class="book-price">USD ${precioFormateado}</span>
            <span class="stock-info" style="color: ${stockDisponible <= 2 ? '#e74c3c' : '#2ecc71'}; font-size: 12px; font-weight: bold;">
              Stock: ${stockDisponible} unidades
            </span>
          </div>
          <div class="book-actions">
            <button class="btn-book-details" onclick="LibreriaManager.mostrarDetallesLibro(${libro.id})">
              Ver más
            </button>
            <button class="btn-add-cart ${botonDeshabilitado ? 'disabled' : ''}"
                    onclick="LibreriaManager.agregarAlCarrito(${libro.id})"
                    ${botonDeshabilitado ? 'disabled' : ''}>
              Añadir
            </button>
          </div>
        </div>
      </div>
    `;
  }
  static generarEstrellas(rating) {
    const estrellas = [];
    const ratingCompleto = Math.round(rating);
    for (let i = 0; i < 5; i++) {
      if (i < ratingCompleto) {
        estrellas.push('<span class="star">★</span>');
      } else {
        estrellas.push('<span class="star empty">☆</span>');
      }
    }
    return `
      <div class="book-rating">
        ${estrellas.join('')}
        <span class="rating-number">(${rating})</span>
      </div>
    `;
  }
  static limitarTitulo(titulo, maxCaracteres = 40) {
    return titulo.length > maxCaracteres
      ? titulo.substring(0, maxCaracteres) + '...'
      : titulo;
  }
  static agregarAlCarrito(libroId) {
    const libro = this.libros.find(l => l.id === libroId);
    if (!libro) {
      this.mostrarNotificacion('Libro no encontrado', 'error');
      return;
    }
    // Obtener carrito actual
    let carrito = this.obtenerCarrito();
    // Verificar stock disponible
    const cantidadActualEnCarrito = this.obtenerCantidadEnCarrito(libroId);
    const cantidadTotal = cantidadActualEnCarrito + 1;
    if (cantidadTotal > libro.stock) {
      this.mostrarNotificacion('Libro sin stock disponible', 'error');
      return;
    }
    // Verificar si el libro ya está en el carrito
    const itemExistente = carrito.find(item => item.id === libroId);
    if (itemExistente) {
      // Si existe, incrementar cantidad
      itemExistente.cantidad += 1;
    } else {
      // Si no existe, agregar nuevo item
      carrito.push({
        ...libro,
        cantidad: 1
      });
    }
    // Guardar carrito actualizado
    this.guardarCarrito(carrito);
    this.actualizarContadorCarrito();
    // Actualizar la disponibilidad de libros en la interfaz
    this.actualizarDisponibilidadLibros();
    // Mostrar notificación
    UIManager.mostrarMensaje(`${libro.titulo} agregado al carrito`, 'success');
    // Disparar evento de actualización del carrito
    window.dispatchEvent(new CustomEvent('carritoActualizado', {
      detail: { carrito, libroId, accion: 'agregar' }
    }));
  }
  static actualizarDisponibilidadLibros() {
    const carrito = this.obtenerCarrito();
    const librosCards = document.querySelectorAll('.book-card');
    librosCards.forEach(card => {
      const libroId = parseInt(card.dataset.libroId);
      const libro = this.libros.find(l => l.id === libroId);
      if (libro) {
        const cantidadEnCarrito = carrito
          .filter(item => item.id === libroId)
          .reduce((total, item) => total + item.cantidad, 0);
        const stockDisponible = libro.stock - cantidadEnCarrito;
        const botonAddCart = card.querySelector('.btn-add-cart');
        const stockInfo = card.querySelector('.stock-info');
        if (botonAddCart) {
          if (stockDisponible <= 0) {
            botonAddCart.classList.add('disabled');
            botonAddCart.disabled = true;
            botonAddCart.textContent = '🚫 Agotado';
          } else {
            botonAddCart.classList.remove('disabled');
            botonAddCart.disabled = false;
            botonAddCart.textContent = 'Añadir';
          }
        }
        if (stockInfo) {
          stockInfo.textContent = `Stock: ${stockDisponible} unidades`;
          stockInfo.style.color = stockDisponible <= 2 ? '#e74c3c' : '#2ecc71';
        }
      }
    });
  }
  static obtenerCarrito() {
    const carritoGuardado = localStorage.getItem('carrito');
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  }
  static guardarCarrito(carrito) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }
  static actualizarCantidad(itemId, nuevaCantidad) {
    let carrito = this.obtenerCarrito();
    const item = carrito.find(item => item.id === itemId);
    if (item) {
      item.cantidad = nuevaCantidad;
      this.guardarCarrito(carrito);
      this.actualizarContadorCarrito();
          } else {
          }
  }
  static obtenerCantidadEnCarrito(libroId) {
    const carrito = this.obtenerCarrito();
    return carrito
      .filter(item => item.id === libroId)
      .reduce((total, item) => total + item.cantidad, 0);
  }
  static actualizarContadorCarrito() {
    const carrito = this.obtenerCarrito();
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    // Actualizar todos los contadores del carrito en la página actual
    const contadores = document.querySelectorAll('.cart-count');
    contadores.forEach(contador => {
      contador.textContent = totalItems;
    });
    // Actualizar el badge del carrito si existe
    const cartBadge = document.querySelector('.cart-badge');
    if (cartBadge) {
      if (totalItems > 0) {
        cartBadge.textContent = totalItems;
        cartBadge.style.display = 'inline-flex';
      } else {
        cartBadge.style.display = 'none';
      }
    }
  }
  static mostrarDetallesLibro(libroId) {
    const libro = this.libros.find(l => l.id === libroId);
    if (!libro) return;
    const modal = document.getElementById('bookDetailModal');
    if (!modal) return;
    const modalContent = modal.querySelector('.modal-book-details');
    modalContent.innerHTML = `
      <div class="modal-book-info">
        <div class="modal-book-image">
          <img src="${libro.imagen}" alt="${libro.titulo}" onerror="this.onerror=null; this.src='https://via.placeholder.com/400x600?text=Portada+no+disponible';">
                  </div>
        <div class="modal-book-content">
          <h2 class="modal-book-title">${libro.titulo}</h2>
          <p class="modal-book-author">Por ${libro.autor}</p>
          <div class="modal-book-meta">
            <span class="modal-book-category">${libro.categoria}</span>
            <span class="modal-book-pages">${libro.paginas} páginas</span>
            <span class="modal-book-language">${libro.idioma}</span>
          </div>
          <div class="modal-book-rating">
            ${this.generarEstrellas(libro.rating)}
          </div>
          <div class="modal-book-description">
            <h3>Descripción</h3>
            <p>${libro.descripcion}</p>
          </div>
          <div class="modal-book-details">
            <h3>Detalles</h3>
            <ul>
              <li><strong>ISBN:</strong> ${libro.isbn}</li>
              <li><strong>Editorial:</strong> ${libro.editorial}</li>
              <li><strong>Fecha de publicación:</strong> ${new Date(libro.fechaPublicacion).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</li>
              <li><strong>Stock disponible:</strong> ${libro.stock} unidades</li>
            </ul>
          </div>
          <div class="modal-book-actions">
            <button class="btn-add-cart-modal" onclick="LibreriaManager.agregarAlCarrito(${libro.id}); LibreriaManager.cerrarModalLibro();">
              Añadir al carrito
            </button>
            <span class="price-current-modal">USD ${libro.precio.toFixed(2)}</span>
          </div>
        </div>
      </div>
    `;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    // Agregar event listener para cerrar modal haciendo click fuera
    const modalOverlay = modal.querySelector('.modal-content');
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.cerrarModalLibro();
      }
    });
    // Prevenir que el click dentro del contenido cierre el modal
    modalOverlay.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
  static cerrarModalLibro() {
    const modal = document.getElementById('bookDetailModal');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  }
  static eliminarDelCarrito(itemId) {
    let carrito = this.obtenerCarrito();
    carrito = carrito.filter(item => item.id !== itemId);
    this.guardarCarrito(carrito);
    this.actualizarContadorCarrito();
    // Disparar evento de actualización
    window.dispatchEvent(new CustomEvent('carritoActualizado', {
      detail: { carrito, itemId, accion: 'eliminar' }
    }));
  }
  static calcularTotal() {
    const carrito = this.obtenerCarrito();
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  }
  static obtenerTotalItems() {
    const carrito = this.obtenerCarrito();
    return carrito.reduce((total, item) => total + item.cantidad, 0);
  }
  static vaciarCarrito() {
    localStorage.removeItem('carrito');
    this.actualizarContadorCarrito();
  }
}
// DESCUENTOS Y PROMOCIONES
class DiscountBannerManager {
  static codigosDescuento = [
    { codigo: "LEER10", descuento: 10, usos: 3 },
    { codigo: "LIBROS20", descuento: 20, usos: 1 },
    { codigo: "COCINA15", descuento: 15, usos: 2 },
    { codigo: "ESTUDIANTE", descuento: 25, usos: 1 },
    { codigo: "NAVIDAD", descuento: 30, usos: 0 }
  ];
  static codigoActual = null;
  static mostrarBannerDescuento() {
    if (this.codigoActual && this.codigoActual.usos > 0) {
      const banner = document.getElementById('discountBanner');
      if (banner) {
        banner.innerHTML = `
          <div class="discount-content">
            <span class="discount-icon">🎁</span>
            <div class="discount-text">
              <strong>¡Oferta especial!</strong> Usa el código
              <code class="discount-code" id="discountCode">${this.codigoActual.codigo}</code>
              para obtener ${this.codigoActual.descuento}% de descuento.
            </div>
            <span class="discount-remaining">
              ${this.codigoActual.usos} usos disponibles
            </span>
          </div>
        `;
        banner.style.display = 'block';
        // Configurar evento para copiar código
        const codigoElement = document.getElementById('discountCode');
        if (codigoElement) {
          codigoElement.style.cursor = 'pointer';
          codigoElement.addEventListener('click', () => this.copiarCodigo());
        }
      }
    }
  }
  static copiarCodigo() {
    if (this.codigoActual) {
      navigator.clipboard.writeText(this.codigoActual.codigo).then(() => {
        UIManager.mostrarMensaje(`¡Código ${this.codigoActual.codigo} copiado!`, 'success');
      }).catch(() => {
        UIManager.mostrarMensaje('Error al copiar el código', 'error');
      });
    }
  }
  static mostrarNotificacion(mensaje, tipo = 'success') {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = 'notification';
    notificacion.textContent = mensaje;
    // Define colores oscuros para mejor visibilidad
    const colores = {
      success: 'var(--color-primario)',
      error: 'var(--color-danger)',
      warning: 'var(--color-naranja)'
    };
    notificacion.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${colores[tipo] || colores.success};
      padding: 1rem 1.5rem;
      border-radius: var(--border-radius-medium);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
      z-index: 100;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      font-weight: 600;
      font-size: 1rem;
      min-width: 250px;
      text-align: center;
    `;
    document.body.appendChild(notificacion);
    // Animar entrada
    setTimeout(() => {
      notificacion.style.transform = 'translateX(0)';
    }, 100);
    // Remover después de 3 segundos
    setTimeout(() => {
      notificacion.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notificacion.parentNode) {
          notificacion.parentNode.removeChild(notificacion);
        }
      }, 300);
    }, 3000);
  }
  static inicializarDescuentos() {
    // Filtrar solo códigos con usos disponibles
    const codigosDisponibles = this.codigosDescuento.filter(codigo => codigo.usos > 0);
    if (codigosDisponibles.length === 0) {
            this.codigoActual = null;
      this.mostrarBannerDescuento();
      return;
    }
    // Seleccionar un código aleatorio solo de los disponibles
    const indiceAleatorio = Math.floor(Math.random() * codigosDisponibles.length);
    this.codigoActual = codigosDisponibles[indiceAleatorio];
    this.mostrarBannerDescuento();
  }
  static mostrarBannerDescuento() {
    if (this.codigoActual && this.codigoActual.usos > 0) {
      const banner = document.getElementById('discountBanner');
      // Listar todos los elementos con ID que contengan "discount"
      const discountElements = document.querySelectorAll('[id*="discount"]');
      if (banner) {
        banner.innerHTML = `
          <div class="discount-content">
            <span class="discount-icon">🎁</span>
            <div class="discount-text">
              <strong>¡Oferta especial!</strong> Usa el código
              <code class="discount-code" id="discountCode">${this.codigoActual.codigo}</code>
              para obtener ${this.codigoActual.descuento}% de descuento.
            </div>
            <span class="discount-remaining">
              ${this.codigoActual.usos} usos disponibles
            </span>
          </div>
        `;
        banner.style.display = 'block';
        // Configurar evento para copiar código
        const codigoElement = document.getElementById('discountCode');
        if (codigoElement) {
          codigoElement.style.cursor = 'pointer';
          codigoElement.addEventListener('click', () => this.copiarCodigo());
        }
      }
    } else {
      const banner = document.getElementById('discountBanner');
      if (banner) {
        banner.style.display = 'none';
      }
    }
  }
}
// Exportar las clases para uso global
window.LibreriaManager = LibreriaManager;
window.DiscountBannerManager = DiscountBannerManager;