// MANEJO DE LIBRERÍA Y CARRITO
class LibreriaManager {
  static libros = [];

  static async inicializarLibros() {
    // Limpiar datos corruptos con URLs de placeholder
    const librosGuardados = localStorage.getItem('libros');
    if (librosGuardados) {
      try {
        const libros = JSON.parse(librosGuardados);
        // Verificar si hay URLs de placeholder corruptas
        const hasPlaceholders = libros.some(libro =>
          libro.imagen && libro.imagen.includes('via.placeholder.com')
        );

        if (!hasPlaceholders) {
          this.libros = libros;
          return;
        }
      } catch (error) {
        // Si hay error al parsear, limpiar y continuar
      }
    }

    // Limpiar localStorage corrupto
    localStorage.removeItem('libros');

    // Datos actualizados de libros con información real
    this.libros = [
      {
        id: 1,
        titulo: "Cocina más con vegetales. Recetas, conservas, fermentos y más",
        autor: "Sonia Ortiz Salinas & Celia Marín Chiunti",
        precio: 24.94,
        monedaOriginal: "MXN",
        rating: 4.7,
        categoria: "Cocina Saludable",
        fechaPublicacion: "2023-01-15",
        descripcion: "Descubre el mundo de las verduras con recetas innovadoras, técnicas de conservación y fermentos caseros. Un guía completa para cocina basada en vegetales.",
        imagen: "../src/images/libros/cocina-mas-vegetales.jpg",
        isbn: "978-607-15-1234-5",
        paginas: 352,
        editorial: "Editorial Larousse México",
        idioma: "Español",
        destacado: true,
        stock: 12
      },
      {
        id: 2,
        titulo: "Cocina Tradicional Argentina",
        autor: "Dolores Irigoyen",
        precio: 6.25,
        precioOriginal: 28000,
        monedaOriginal: "ARS",
        rating: 4.9,
        categoria: "Cocina Argentina",
        fechaPublicacion: "2023-05-20",
        descripcion: "Descubre los secretos de la cocina tradicional argentina. Recetas auténticas de todas las regiones del país, desde asados criollos hasta dulces típicos.",
        imagen: "../src/images/libros/cocina-tradicional.jpg",
        isbn: "978-987-45-6789-0",
        paginas: 320,
        editorial: "Editorial Albatros Argentina",
        idioma: "Español",
        destacado: true,
        stock: 18
      },
      {
        id: 3,
        titulo: "Cocina comida real. Más de 100 recetas para realfooders",
        autor: "Carlos Ríos & David Guibert",
        precio: 19.40,
        precioOriginal: 17.95,
        monedaOriginal: "EUR",
        rating: 4.9,
        categoria: "Cocina Saludable",
        fechaPublicacion: "2022-11-10",
        descripcion: "El definitivo guide para adoptar el estilo de vida realfooder. Más de 100 recetas deliciosas y fáciles para comer comida real todos los días.",
        imagen: "../src/images/libros/cocina-comida-real.jpg",
        isbn: "978-84-08-25456-7",
        paginas: 320,
        editorial: "Editorial Paidós España",
        idioma: "Español",
        destacado: true,
        stock: 25
      },
      {
        id: 4,
        titulo: "Cocinar sin gluten",
        autor: "Editions Larousse",
        precio: 22.14,
        precioOriginal: 20.50,
        monedaOriginal: "EUR",
        rating: 4.6,
        categoria: "Repostería",
        fechaPublicacion: "2023-02-28",
        descripcion: "Técnicas profesionales y recetas caseras para cocinar deliciosamente sin gluten. Incluye panes, postres y platos principales.",
        imagen: "../src/images/libros/cocinar-sin-gluten.jpg",
        isbn: "978-84-10124-13-4",
        paginas: 256,
        editorial: "Larousse Gastronomie",
        idioma: "Español",
        destacado: false,
        stock: 15
      },
      {
        id: 5,
        titulo: "Recetas argentinas de mi cocina. Libro bilingüe Español-Inglés",
        autor: "Gastón Riveira",
        precio: 13.31,
        precioOriginal: 59900,
        monedaOriginal: "ARS",
        rating: 4.7,
        categoria: "Cocina Argentina",
        fechaPublicacion: "2023-03-30",
        descripcion: "Las mejores recetas argentinas presentadas en formato bilingüe. Desde empanadas hasta dulce de leche, la tradición gastronómica de Argentina.",
        imagen: "../src/images/libros/cocina-arg.jpg",
        isbn: "978-987-6378642",
        paginas: 298,
        editorial: "Gastronomía Argentina SA",
        idioma: "Español-Inglés",
        destacado: false,
        stock: 20
      },
      {
        id: 6,
        titulo: "Gran libro de cocina de Alain Ducasse. Bistros, brasseries y restaurantes tradicionales",
        autor: "Alain Ducasse",
        precio: 162.00,
        precioOriginal: 150,
        monedaOriginal: "EUR",
        rating: 5.0,
        categoria: "Cocina Francesa",
        fechaPublicacion: "2022-09-15",
        descripcion: "La obra maestra del chef más prestigioso del mundo. Técnicas y recetas de los mejores bistros y restaurantes tradicionales franceses.",
        imagen: "../src/images/libros/cocina-gran-libro.jpg",
        isbn: "978-2-84-123456-2",
        paginas: 688,
        editorial: "Alain Ducasse Edition",
        idioma: "Español",
        destacado: true,
        stock: 8
      },
      {
        id: 7,
        titulo: "200 recetas de cocina española",
        autor: "Alfonso López Alonso",
        precio: 32.35,
        precioOriginal: 29.95,
        monedaOriginal: "EUR",
        rating: 4.5,
        categoria: "Cocina Española",
        fechaPublicacion: "2023-04-10",
        descripcion: "Un recorrido completo por la gastronomía española. Desde la paella valenciana hasta las tapas andaluzas, 200 recetas imperdibles.",
        imagen: "../src/images/libros/cocina-espanola.jpg",
        isbn: "978-84-9875-4321-8",
        paginas: 412,
        editorial: "Gastronomía Ibérica",
        idioma: "Español",
        destacado: false,
        stock: 22
      },
      {
        id: 8,
        titulo: "Cocinología: La ciencia de los alimentos",
        autor: "Hervé This & Pierre Gagnaire",
        precio: 28.50,
        precioOriginal: 26.90,
        monedaOriginal: "EUR",
        rating: 4.7,
        categoria: "Cocina Científica",
        fechaPublicacion: "2023-06-01",
        descripcion: "Explora los principios científicos detrás de las técnicas culinarias. Un viaje fascinante por la química y física de los alimentos que revolucionará tu forma de cocinar.",
        imagen: "../src/images/libros/cocina-cocinologia-ciencia.jpg",
        isbn: "978-2-08-123456-9",
        paginas: 424,
        editorial: "Flammarion",
        idioma: "Español",
        destacado: true,
        stock: 12
      },
      {
        id: 9,
        titulo: "Pastelería Argentina Contemporánea",
        autor: "Osvaldo Gross",
        precio: 28.50,
        precioOriginal: 26000,
        monedaOriginal: "ARS",
        rating: 4.7,
        categoria: "Repostería",
        fechaPublicacion: "2023-08-15",
        descripcion: "El arte de la pastelería argentina moderna. Técnicas tradicionales fusionadas con tendencias contemporáneas para crear postres únicos y deliciosos.",
        imagen: "../src/images/libros/cocina-pasteleria-arg.jpg",
        isbn: "978-987-87-1234-5",
        paginas: 384,
        editorial: "Editorial Grijalbo",
        idioma: "Español",
        destacado: true,
        stock: 8
      }
    ];

    // Guardar en localStorage
    this.guardarLibros();
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

    const libros = this.filtrarLibros(terminoBusqueda, categoria, sortMethod);

    // Actualizar contador
    const contador = document.getElementById('booksCount');
    if (contador) {
      contador.textContent = `${libros.length} libro${libros.length !== 1 ? 's' : ''} encontrado${libros.length !== 1 ? 's' : ''}`;
    }

    if (libros.length === 0) {
      container.style.display = 'none';
      emptyDiv.style.display = 'block';
    } else {
      container.style.display = 'grid';
      emptyDiv.style.display = 'none';
      container.innerHTML = libros.map(libro => this.crearTarjetaLibro(libro)).join('');
    }
  }

  static limitarTitulo(titulo, maxCaracteres = 40) {
    if (titulo.length <= maxCaracteres) return titulo;
    return titulo.substring(0, maxCaracteres - 3) + '...';
  }

  static crearTarjetaLibro(libro) {
    const estrellas = this.generarEstrellas(libro.rating);
    const precioFormateado = libro.precio.toFixed(2);
    const tituloLimitado = this.limitarTitulo(libro.titulo, 40);

    return `
      <div class="book-card" data-id="${libro.id}">
        <div class="book-image">
          <img src="${libro.imagen}" alt="${libro.titulo}" onerror="this.style.display='none'; this.parentElement.innerHTML+='<div style=\\'width:100%;height:400px;background:#f3f4f6;display:flex;align-items:center;justify-content:center;color:#6b7280;font-size:14px;text-align:center;padding:20px;\\'><div>📚<br>Portada no disponible<br><small>${libro.titulo}</small></div></div>';">
          ${libro.destacado ? '<span class="featured-badge">Destacado</span>' : ''}
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
          </div>
          <div class="book-actions">
            <button class="btn-primary add-to-cart" data-id="${libro.id}">
              Agregar al carrito
            </button>
            <button class="btn-secondary view-details" data-id="${libro.id}">
              Ver detalles
            </button>
          </div>
        </div>
      </div>
    `;
  }

  static generarEstrellas(rating) {
    const estrellas = '★'.repeat(Math.floor(rating));
    const mediasEstrellas = rating % 1 >= 0.5 ? '☆' : '';
    const estrellasVacias = '☆'.repeat(5 - Math.ceil(rating));
    return `<span class="rating-stars">${estrellas}${mediasEstrellas}${estrellasVacias}</span><span class="rating-number">(${rating})</span>`;
  }

  static filtrarLibros(terminoBusqueda = '', categoria = '', sortBy = 'featured') {
    let librosFiltrados = [...this.libros];

    // Filtrar por búsqueda
    if (terminoBusqueda) {
      const busquedaLower = terminoBusqueda.toLowerCase();
      librosFiltrados = librosFiltrados.filter(libro =>
        libro.titulo.toLowerCase().includes(busquedaLower) ||
        libro.autor.toLowerCase().includes(busquedaLower) ||
        libro.categoria.toLowerCase().includes(busquedaLower) ||
        libro.descripcion.toLowerCase().includes(busquedaLower)
      );
    }

    // Filtrar por categoría
    if (categoria) {
      librosFiltrados = librosFiltrados.filter(libro => libro.categoria === categoria);
    }

    // Ordenar
    switch (sortBy) {
      case 'price-low':
        librosFiltrados.sort((a, b) => a.precio - b.precio);
        break;
      case 'price-high':
        librosFiltrados.sort((a, b) => b.precio - a.precio);
        break;
      case 'rating':
        librosFiltrados.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        librosFiltrados.sort((a, b) => a.titulo.localeCompare(b.titulo));
        break;
      case 'date-new':
        librosFiltrados.sort((a, b) => new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion));
        break;
      case 'date-old':
        librosFiltrados.sort((a, b) => new Date(a.fechaPublicacion) - new Date(b.fechaPublicacion));
        break;
      case 'featured':
      default:
        librosFiltrados.sort((a, b) => {
          if (a.destacado && !b.destacado) return -1;
          if (!a.destacado && b.destacado) return 1;
          return 0;
        });
        break;
    }

    return librosFiltrados;
  }

  static obtenerLibroPorId(id) {
    return this.libros.find(libro => libro.id === parseInt(id));
  }

  static agregarAlCarrito(libroId) {
    const libro = this.obtenerLibroPorId(libroId);
    if (!libro) return;

    const carrito = this.obtenerCarrito();
    const itemExistente = carrito.find(item => item.id === libroId);

    if (itemExistente) {
      itemExistente.cantidad += 1;
    } else {
      carrito.push({
        ...libro,
        cantidad: 1
      });
    }

    this.guardarCarrito(carrito);
    this.actualizarContadorCarrito();

    // Disparar evento personalizado para notificar cambios en el carrito
    window.dispatchEvent(new CustomEvent('carritoActualizado', {
      detail: { carrito, libroId, accion: 'agregar' }
    }));

    // Mostrar notificación
    this.mostrarNotificacion(`${libro.titulo} agregado al carrito`);
  }

  static obtenerCarrito() {
    const carritoGuardado = localStorage.getItem('carrito');
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  }

  static guardarCarrito(carrito) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }

  static actualizarContadorCarrito() {
    const carrito = this.obtenerCarrito();
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);

    // Actualizar todos los contadores del carrito en la página actual
    const contadores = document.querySelectorAll('.cart-count');
    contadores.forEach(contador => {
      contador.textContent = totalItems;
      // Agregar animación visual
      contador.style.transform = 'scale(1.2)';
      setTimeout(() => {
        contador.style.transform = 'scale(1)';
      }, 200);
    });

    // Actualizar el contador específico si existe en el index
    const indexCounter = document.getElementById('cartCount');
    if (indexCounter) {
      indexCounter.textContent = totalItems;
      indexCounter.style.transform = 'scale(1.2)';
      setTimeout(() => {
        indexCounter.style.transform = 'scale(1)';
      }, 200);
    }
  }

  static mostrarNotificacion(mensaje) {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = 'notification';
    notificacion.textContent = mensaje;
    notificacion.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: var(--primary-green);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-heavy);
      z-index: 1000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
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
        document.body.removeChild(notificacion);
      }, 300);
    }, 3000);
  }

  static mostrarDetallesLibro(libroId) {
    const libro = this.obtenerLibroPorId(libroId);
    if (!libro) return;

    const modal = document.getElementById('bookModal');
    const modalContent = document.getElementById('modalBookContent');

    modalContent.innerHTML = `
      <div class="flex flex-col lg:flex-row gap-8 p-8 max-w-7xl mx-auto">
        <!-- Imagen del libro -->
        <div class="lg:w-1/3 flex-shrink-0">
          <div class="relative">
            <img src="${libro.imagen}" alt="${libro.titulo}"
                 class="w-full h-96 lg:h-[500px] object-cover rounded-lg shadow-lg"
                 onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=\\'w-full h-96 lg:h-[500px] bg-gray-100 rounded-lg shadow-lg flex items-center justify-center text-gray-500 text-center p-8\\'><div class=\\'text-6xl mb-4\\'>📚</div><div class=\\'text-lg font-medium\\'>Portada no disponible</div><div class=\\'text-sm mt-2\\'>${libro.titulo}</div></div>';">
            ${libro.destacado ? '<span class="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">Destacado</span>' : ''}
          </div>
        </div>

        <!-- Contenido del libro -->
        <div class="lg:w-2/3 flex flex-col justify-between">
          <!-- Header -->
          <div class="mb-6">
            <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 leading-tight">${libro.titulo}</h2>
            <p class="text-lg text-gray-600 mb-4">por ${libro.autor}</p>
            <div class="flex items-center gap-2">
              ${this.generarEstrellas(libro.rating)}
              <span class="text-gray-500">(${libro.rating})</span>
            </div>
          </div>

          <!-- Metadatos -->
          <div class="bg-gray-50 rounded-lg p-6 mb-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div class="flex flex-col">
                <span class="text-sm text-gray-500 font-medium">Categoría</span>
                <span class="text-gray-900 font-semibold">${libro.categoria}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm text-gray-500 font-medium">Editorial</span>
                <span class="text-gray-900 font-semibold">${libro.editorial}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm text-gray-500 font-medium">ISBN</span>
                <span class="text-gray-900 font-semibold">${libro.isbn}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm text-gray-500 font-medium">Páginas</span>
                <span class="text-gray-900 font-semibold">${libro.paginas}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm text-gray-500 font-medium">Idioma</span>
                <span class="text-gray-900 font-semibold">${libro.idioma}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm text-gray-500 font-medium">Publicado</span>
                <span class="text-gray-900 font-semibold">${new Date(libro.fechaPublicacion).toLocaleDateString('es-ES', {year: 'numeric', month: 'long', day: 'numeric'})}</span>
              </div>
            </div>
          </div>

          <!-- Descripción -->
          <div class="mb-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Descripción</h3>
            <p class="text-gray-600 leading-relaxed">${libro.descripcion}</p>
          </div>

          <!-- Footer con precio y acciones -->
          <div class="border-t pt-6">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <!-- Precio -->
              <div class="flex flex-col items-start sm:items-end">
                ${libro.precioOriginal ? `
                  <span class="text-gray-400 line-through text-sm">${libro.monedaOriginal} ${libro.precioOriginal.toLocaleString()}</span>
                ` : ''}
                <span class="text-3xl font-bold text-green-600">$${libro.precio.toFixed(2)}</span>
              </div>

              <!-- Acciones -->
              <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button class="add-to-cart-modal bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition duration-200 shadow-lg hover:shadow-xl transform hover:scale-105" data-id="${libro.id}">
                  Agregar al carrito
                </button>
                <button class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-lg font-semibold transition duration-200" onclick="document.getElementById('bookModal').style.display='none'">
                  Cerrar
                </button>
              </div>
            </div>

            ${libro.stock <= 5 ? `
              <div class="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p class="text-yellow-800 font-medium flex items-center gap-2">
                  ⚠️ ¡Últimas ${libro.stock} unidades disponibles!
                </p>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;

    modal.style.display = 'block';
  }

  static inicializarEventListeners() {
    // Event listeners para los filtros
    const filterSearch = document.getElementById('filterSearch');
    const filterCategory = document.getElementById('filterCategory');
    const sortBy = document.getElementById('sortBy');

    if (filterSearch) {
      filterSearch.addEventListener('input', () => this.cargarLibros());
    }

    if (filterCategory) {
      filterCategory.addEventListener('change', () => this.cargarLibros());
    }

    if (sortBy) {
      sortBy.addEventListener('change', () => this.cargarLibros());
    }

    // Event listeners para botones de agregar al carrito y ver detalles
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('add-to-cart')) {
        const libroId = parseInt(e.target.dataset.id);
        this.agregarAlCarrito(libroId);
      }

      if (e.target.classList.contains('view-details')) {
        const libroId = parseInt(e.target.dataset.id);
        this.mostrarDetallesLibro(libroId);
      }

      if (e.target.classList.contains('add-to-cart-modal')) {
        const libroId = parseInt(e.target.dataset.id);
        this.agregarAlCarrito(libroId);
        document.getElementById('bookModal').style.display = 'none';
      }
    });

    // Cerrar modal
    const cerrarModal = document.getElementById('btnCerrarModalLibro');
    if (cerrarModal) {
      cerrarModal.addEventListener('click', () => {
        document.getElementById('bookModal').style.display = 'none';
      });
    }

    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', (e) => {
      const modal = document.getElementById('bookModal');
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  }

  // Métodos adicionales para gestión del carrito
  static actualizarCantidad(itemId, nuevaCantidad) {
    let carrito = this.obtenerCarrito();
    const item = carrito.find(item => item.id === itemId);

    if (item) {
      item.cantidad = nuevaCantidad;
      this.guardarCarrito(carrito);
      this.actualizarContadorCarrito();

      // Disparar evento de actualización
      window.dispatchEvent(new CustomEvent('carritoActualizado', {
        detail: { carrito, itemId, accion: 'actualizar' }
      }));
    }
  }

  static eliminarProducto(itemId) {
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

    // Disparar evento de actualización
    window.dispatchEvent(new CustomEvent('carritoActualizado', {
      detail: { carrito: [], accion: 'vaciar' }
    }));
  }
}

// Exportar la clase para uso global
window.LibreriaManager = LibreriaManager;