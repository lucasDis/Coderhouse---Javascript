// MANEJO DE LIBRERÍA Y CARRITO
class LibreriaManager {
  static libros = [];

  static async inicializarLibros() {
    // Datos de ejemplo de libros
    this.libros = [
      {
        id: 1,
        titulo: "La Cocina Italiana Auténtica",
        autor: "Mario Romano",
        precio: 29.99,
        rating: 4.8,
        categoria: "Cocina Italiana",
        fechaPublicacion: "2023-03-15",
        descripcion: "Descubre los secretos de la cocina tradicional italiana con más de 200 recetas paso a paso.",
        imagen: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300",
        isbn: "978-84-123456-7-8",
        paginas: 320,
        editorial: "Gastronomía Internacional",
        idioma: "Español",
        destacado: true,
        stock: 15
      },
      {
        id: 2,
        titulo: "Sabores de México",
        autor: "Elena Rodriguez",
        precio: 24.99,
        rating: 4.6,
        categoria: "Cocina Mexicana",
        fechaPublicacion: "2022-11-20",
        descripcion: "Desde tacos hasta moles, explora la rica diversidad de la cocina mexicana contemporánea.",
        imagen: "https://images.unsplash.com/photo-1534080565258-75cf9c5e0661?w=300",
        isbn: "978-84-234567-8-9",
        paginas: 280,
        editorial: "Sabores Latinoamericanos",
        idioma: "Español",
        destacado: true,
        stock: 8
      },
      {
        id: 3,
        titulo: "Arte Asiático en la Cocina",
        autor: "Wei Chen",
        precio: 34.99,
        rating: 4.9,
        categoria: "Cocina Asiática",
        fechaPublicacion: "2023-06-10",
        descripcion: "Domina las técnicas culinarias de China, Japón, Tailandia y más países asiáticos.",
        imagen: "https://images.unsplash.com/photo-1565299624946-b28f40a0a383?w=300",
        isbn: "978-84-345678-9-0",
        paginas: 450,
        editorial: "Cocina Oriental",
        idioma: "Español",
        destacado: false,
        stock: 12
      },
      {
        id: 4,
        titulo: "Repostería Creativa",
        autor: "María González",
        precio: 27.99,
        rating: 4.7,
        categoria: "Repostería",
        fechaPublicacion: "2023-01-08",
        descripcion: "Desde pasteles clásicos hasta creaciones modernas, aprende el arte de la repostería profesional.",
        imagen: "https://images.unsplash.com/photo-1549931319-a545dcf0bc9b?w=300",
        isbn: "978-84-456789-0-1",
        paginas: 380,
        editorial: "Dulce Arte",
        idioma: "Español",
        destacado: false,
        stock: 20
      },
      {
        id: 5,
        titulo: "Cocina Saludable para Todos",
        autor: "Dr. Carlos Martínez",
        precio: 22.99,
        rating: 4.5,
        categoria: "Cocina Saludable",
        fechaPublicacion: "2022-09-14",
        descripcion: "Recetas nutritivas y deliciosas que cuidan tu salud sin sacrificar el sabor.",
        imagen: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300",
        isbn: "978-84-567890-1-2",
        paginas: 290,
        editorial: "Bienestar y Nutrición",
        idioma: "Español",
        destacado: true,
        stock: 25
      },
      {
        id: 6,
        titulo: "Vegano Delicioso",
        autor: "Laura Verde",
        precio: 26.99,
        rating: 4.4,
        categoria: "Cocina Vegana",
        fechaPublicacion: "2023-04-22",
        descripcion: "Plantas basadas para todos los gustos: recetas veganas que sorprenderán a paladares exigentes.",
        imagen: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300",
        isbn: "978-84-678901-2-3",
        paginas: 340,
        editorial: "Planta Vida",
        idioma: "Español",
        destacado: false,
        stock: 18
      },
      {
        id: 7,
        titulo: "Secretos de la Cocina Francesa",
        autor: "Pierre Dubois",
        precio: 39.99,
        rating: 4.9,
        categoria: "Cocina Internacional",
        fechaPublicacion: "2023-02-28",
        descripcion: "Técnicas maestras de la haute cuisine francesa adaptadas para el hogar.",
        imagen: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300",
        isbn: "978-84-789012-3-4",
        paginas: 520,
        editorial: "Cocina Europea",
        idioma: "Español",
        destacado: true,
        stock: 6
      },
      {
        id: 8,
        titulo: "Pasteles y Panes Caseros",
        autor: "Ana Panadera",
        precio: 21.99,
        rating: 4.6,
        categoria: "Repostería",
        fechaPublicacion: "2022-12-05",
        descripcion: "El aroma del pan fresco en casa: técnicas fáciles para panadería principiante.",
        imagen: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300",
        isbn: "978-84-890123-4-5",
        paginas: 260,
        editorial: "Horno y Hogar",
        idioma: "Español",
        destacado: false,
        stock: 30
      }
    ];

    // Guardar en localStorage
    this.guardarLibros();
  }

  static guardarLibros() {
    localStorage.setItem('libros', JSON.stringify(this.libros));
  }

  static obtenerLibros() {
    const librosGuardados = localStorage.getItem('libros');
    if (librosGuardados) {
      this.libros = JSON.parse(librosGuardados);
    } else {
      this.inicializarLibros();
    }
    return this.libros;
  }

  static obtenerLibroPorId(id) {
    return this.libros.find(libro => libro.id === parseInt(id));
  }

  static filtrarLibros(terminoBusqueda = '', categoria = '', sortBy = 'featured') {
    let librosFiltrados = [...this.libros];

    // Filtrar por búsqueda
    if (terminoBusqueda) {
      const busquedaLower = terminoBusqueda.toLowerCase();
      librosFiltrados = librosFiltrados.filter(libro =>
        libro.titulo.toLowerCase().includes(busquedaLower) ||
        libro.autor.toLowerCase().includes(busquedaLower)
      );
    }

    // Filtrar por categoría
    if (categoria) {
      librosFiltrados = librosFiltrados.filter(libro => libro.categoria === categoria);
    }

    // Ordenar
    librosFiltrados.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.precio - b.precio;
        case 'price-high':
          return b.precio - a.precio;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.titulo.localeCompare(b.titulo);
        case 'date-new':
          return new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion);
        case 'date-old':
          return new Date(a.fechaPublicacion) - new Date(b.fechaPublicacion);
        case 'featured':
        default:
          // Priorizar destacados, luego por rating
          if (a.destacado && !b.destacado) return -1;
          if (!a.destacado && b.destacado) return 1;
          return b.rating - a.rating;
      }
    });

    return librosFiltrados;
  }

  static crearTarjetaLibro(libro) {
    const card = document.createElement('div');
    card.className = 'book-card';

    card.innerHTML = `
      <div class="book-image">
        <img src="${libro.imagen}" alt="${libro.titulo}" onerror="this.src='https://via.placeholder.com/300x400/cccccc/666666?text=Libro'">
        ${libro.destacado ? '<div class="book-badge">Destacado</div>' : ''}
      </div>
      <div class="book-info">
        <h3 class="book-title">${libro.titulo}</h3>
        <p class="book-author">por ${libro.autor}</p>
        <div class="book-meta">
          <span class="book-category">${libro.categoria}</span>
          <span class="book-rating">${this.crearEstrellas(libro.rating)}</span>
        </div>
        <div class="book-footer">
          <span class="book-price">€${libro.precio.toFixed(2)}</span>
          <button class="btn-primary btn-add-cart" data-libro-id="${libro.id}">
            🛒 Añadir
          </button>
        </div>
      </div>
    `;

    // Event listeners
    card.querySelector('.book-image img').addEventListener('click', () => {
      this.verDetallesLibro(libro);
    });

    card.querySelector('.book-title').addEventListener('click', () => {
      this.verDetallesLibro(libro);
    });

    card.querySelector('.btn-add-cart').addEventListener('click', () => {
      this.agregarAlCarrito(libro.id);
    });

    return card;
  }

  static crearEstrellas(rating) {
    let estrellas = '';
    const estrellasLlenas = Math.floor(rating);
    const tieneMedia = rating % 1 >= 0.5;

    for (let i = 0; i < estrellasLlenas; i++) {
      estrellas += '⭐';
    }
    if (tieneMedia && estrellasLlenas < 5) {
      estrellas += '✨';
    }
    for (let i = estrellas.length; i < 5; i++) {
      estrellas += '☆';
    }

    return `<span class="rating-stars">${estrellas}</span><span class="rating-number">(${rating})</span>`;
  }

  static cargarLibros() {
    const container = document.getElementById('booksGrid');
    const emptyDiv = document.getElementById('emptyBooks');
    const terminoBusqueda = document.getElementById('filterSearch').value.toLowerCase();
    const categoria = document.getElementById('filterCategory').value;
    const sortBy = document.getElementById('sortBy').value;

    const libros = this.filtrarLibros(terminoBusqueda, categoria, sortBy);

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
      container.innerHTML = '';

      libros.forEach(libro => {
        container.appendChild(this.crearTarjetaLibro(libro));
      });
    }
  }

  static verDetallesLibro(libro) {
    const modal = document.getElementById('bookModal');
    const modalTitle = document.getElementById('modalBookTitle');
    const modalContent = document.getElementById('modalBookContent');

    modalTitle.textContent = libro.titulo;

    modalContent.innerHTML = `
      <div class="book-detail">
        <div class="book-detail-image">
          <img src="${libro.imagen}" alt="${libro.titulo}" onerror="this.src='https://via.placeholder.com/300x400/cccccc/666666?text=Libro'">
        </div>
        <div class="book-detail-info">
          <div class="book-detail-header">
            <h3>${libro.titulo}</h3>
            <div class="book-detail-meta">
              <span class="book-category">${libro.categoria}</span>
              ${this.crearEstrellas(libro.rating)}
            </div>
          </div>

          <div class="book-detail-description">
            <p>${libro.descripcion}</p>
          </div>

          <div class="book-detail-specs">
            <div class="spec-item">
              <strong>Autor:</strong> ${libro.autor}
            </div>
            <div class="spec-item">
              <strong>Editorial:</strong> ${libro.editorial}
            </div>
            <div class="spec-item">
              <strong>ISBN:</strong> ${libro.isbn}
            </div>
            <div class="spec-item">
              <strong>Páginas:</strong> ${libro.paginas}
            </div>
            <div class="spec-item">
              <strong>Idioma:</strong> ${libro.idioma}
            </div>
            <div class="spec-item">
              <strong>Fecha Publicación:</strong> ${new Date(libro.fechaPublicacion).toLocaleDateString('es-ES')}
            </div>
            <div class="spec-item">
              <strong>Stock:</strong> ${libro.stock} unidades disponibles
            </div>
          </div>

          <div class="book-detail-actions">
            <div class="book-detail-price">
              <span class="price-label">Precio:</span>
              <span class="price-value">€${libro.precio.toFixed(2)}</span>
            </div>
            <div class="book-detail-buttons">
              <button class="btn-secondary" onclick="LibreriaManager.verCarrito()">
                Ver Carrito 🛒
              </button>
              <button class="btn-primary" onclick="LibreriaManager.agregarAlCarrito(${libro.id})">
                Añadir al Carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    modal.style.display = 'flex';
  }

  static agregarAlCarrito(libroId) {
    const libro = this.obtenerLibroPorId(libroId);
    if (!libro) return;

    CarritoManager.agregarProducto(libro);
    UIManager.mostrarMensaje(`"${libro.titulo}" añadido al carrito`, 'success');
    this.actualizarContadorCarrito();
  }

  static actualizarContadorCarrito() {
    const carritoCount = document.getElementById('cartCount');
    if (carritoCount) {
      const carrito = CarritoManager.obtenerCarrito();
      const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
      carritoCount.textContent = totalItems;
    }
  }

  static verCarrito() {
    window.location.href = 'carrito.html';
  }

  static cerrarModal() {
    document.getElementById('bookModal').style.display = 'none';
  }
}

// MANEJO DE CARRITO DE COMPRAS
class CarritoManager {
  static agregarProducto(libro, cantidad = 1) {
    let carrito = this.obtenerCarrito();
    const itemExistente = carrito.find(item => item.id === libro.id);

    if (itemExistente) {
      itemExistente.cantidad += cantidad;
    } else {
      carrito.push({
        id: libro.id,
        titulo: libro.titulo,
        autor: libro.autor,
        precio: libro.precio,
        imagen: libro.imagen,
        cantidad: cantidad
      });
    }

    this.guardarCarrito(carrito);
  }

  static eliminarProducto(libroId) {
    let carrito = this.obtenerCarrito();
    carrito = carrito.filter(item => item.id !== libroId);
    this.guardarCarrito(carrito);
  }

  static actualizarCantidad(libroId, nuevaCantidad) {
    if (nuevaCantidad <= 0) {
      this.eliminarProducto(libroId);
      return;
    }

    let carrito = this.obtenerCarrito();
    const item = carrito.find(item => item.id === libroId);

    if (item) {
      item.cantidad = nuevaCantidad;
      this.guardarCarrito(carrito);
    }
  }

  static obtenerCarrito() {
    const carritoGuardado = localStorage.getItem('carrito');
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  }

  static guardarCarrito(carrito) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }

  static calcularTotal() {
    const carrito = this.obtenerCarrito();
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  }

  static vaciarCarrito() {
    localStorage.removeItem('carrito');
  }

  static obtenerTotalItems() {
    const carrito = this.obtenerCarrito();
    return carrito.reduce((total, item) => total + item.cantidad, 0);
  }
}

// EVENT LISTENERS
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar libros
  LibreriaManager.obtenerLibros();
  LibreriaManager.cargarLibros();
  LibreriaManager.actualizarContadorCarrito();

  // Event listeners para filtros
  const filterSearch = document.getElementById('filterSearch');
  const filterCategory = document.getElementById('filterCategory');
  const sortBy = document.getElementById('sortBy');

  if (filterSearch) {
    filterSearch.addEventListener('input', () => LibreriaManager.cargarLibros());
  }

  if (filterCategory) {
    filterCategory.addEventListener('change', () => LibreriaManager.cargarLibros());
  }

  if (sortBy) {
    sortBy.addEventListener('change', () => LibreriaManager.cargarLibros());
  }

  // Event listeners para modal
  const btnCerrarModalLibro = document.getElementById('btnCerrarModalLibro');
  if (btnCerrarModalLibro) {
    btnCerrarModalLibro.addEventListener('click', () => LibreriaManager.cerrarModal());
  }

  // Event listener para icono del carrito
  const cartIcon = document.getElementById('cartIcon');
  if (cartIcon) {
    cartIcon.addEventListener('click', () => LibreriaManager.verCarrito());
  }

  // Cerrar modal al hacer clic fuera
  window.addEventListener('click', (event) => {
    const modal = document.getElementById('bookModal');
    if (event.target === modal) {
      LibreriaManager.cerrarModal();
    }
  });
});