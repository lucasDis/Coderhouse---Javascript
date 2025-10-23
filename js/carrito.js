  // ==========================================
  // MANEJO ESPECÍFICO DE LA PÁGINA DE CARRITO
  // ==========================================
class CarritoPageManager {
  // Configura los precios y descuentos del sistema
  static descuento = 0;        // Descuento aplicado al carrito
  static costoEnvio = 3.99;    // Costo base de envío
  static ivaRate = 0.21;       // Tasa de IVA (21%)

  // ==========================================
  // INICIALIZACIÓN Y CONFIGURACIÓN
  // ==========================================

  static inicializar() {
    // Inicializa la página del carrito cargando datos y configurando eventos
    this.cargarCarrito();
    this.actualizarResumen();
    this.configurarEventListeners();
  }

  // ==========================================
  // CARGA Y VISUALIZACIÓN DEL CARRITO
  // ==========================================

  static cargarCarrito() {
    // Carga y muestra los items del carrito o el estado vacío
    const container = document.getElementById('carritoItems');
    const emptyCart = document.getElementById('emptyCart');
    const carritoResumen = document.getElementById('carritoResumen');
    const carrito = LibreriaManager.obtenerCarrito();

    if (carrito.length === 0) {
      // Muestra el carrito vacío si no hay items
      container.innerHTML = '';
      container.appendChild(emptyCart);
      emptyCart.style.display = 'block';
      carritoResumen.style.display = 'block';
      return;
    }

    // Oculta el carrito vacío y muestra los items existentes
    emptyCart.style.display = 'none';
    carritoResumen.style.display = 'block';

    // Limpia el contenedor excepto el elemento empty-cart
    const tempEmptyCart = emptyCart;
    container.innerHTML = '';

    carrito.forEach(item => {
      container.appendChild(this.crearItemCarrito(item));
    });
  }

  static crearItemCarrito(item) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'carrito-item';
    itemDiv.dataset.id = item.id;

    itemDiv.innerHTML = `
      <div class="item-imagen">
        <img src="${item.imagen}" alt="${item.titulo}" onerror="this.style.display='none'; this.parentElement.innerHTML+='<div style=\\'width:100px;height:140px;background:#f3f4f6;display:flex;align-items:center;justify-content:center;color:#6b7280;font-size:12px;text-align:center;\\'>📚</div>';">
      </div>
      <div class="item-info">
        <h4>${item.titulo}</h4>
        <p class="item-autor">por ${item.autor}</p>
        <p class="item-precio">$${item.precio.toFixed(2)}</p>
      </div>
      <div class="item-cantidad">
        <div class="cantidad-controls">
          <button class="btn-cantidad btn-minus" data-id="${item.id}">−</button>
          <input type="number" class="cantidad-input" value="${item.cantidad}" min="1" max="${item.stock || 99}" data-id="${item.id}">
          <button class="btn-cantidad btn-plus" data-id="${item.id}">+</button>
        </div>
      </div>
      <div class="item-subtotal">
        <span class="subtotal-valor">$${(item.precio * item.cantidad).toFixed(2)}</span>
      </div>
      <div class="item-eliminar">
        <button class="btn-eliminar" data-id="${item.id}" title="Eliminar del carrito">
          🗑️
        </button>
      </div>
    `;

    // Event listeners para este item
    const btnMinus = itemDiv.querySelector('.btn-minus');           //Aumentar item
    const btnPlus = itemDiv.querySelector('.btn-plus');             //Disminuir item
    const cantidadInput = itemDiv.querySelector('.cantidad-input'); //Numero de items
    const btnEliminar = itemDiv.querySelector('.btn-eliminar');     //Eliminar item

    btnMinus.addEventListener('click', () => {
      const nuevaCantidad = parseInt(cantidadInput.value) - 1;
      if (nuevaCantidad >= 1) {
        this.actualizarCantidad(item.id, nuevaCantidad);
      }
    });

    btnPlus.addEventListener('click', () => {
      const stockDisponible = item.stock || 99;
      const nuevaCantidad = parseInt(cantidadInput.value) + 1;
      if (nuevaCantidad <= stockDisponible) {
        this.actualizarCantidad(item.id, nuevaCantidad);
      }
    });

    cantidadInput.addEventListener('change', () => {
      const stockDisponible = item.stock || 99;
      let nuevaCantidad = parseInt(cantidadInput.value);
      if (isNaN(nuevaCantidad) || nuevaCantidad < 1) nuevaCantidad = 1;
      if (nuevaCantidad > stockDisponible) nuevaCantidad = stockDisponible;
      this.actualizarCantidad(item.id, nuevaCantidad);
    });

    btnEliminar.addEventListener('click', () => {
      this.eliminarItem(item.id);
    });

    return itemDiv;
  }

  static actualizarCantidad(itemId, nuevaCantidad) {
    LibreriaManager.actualizarCantidad(itemId, nuevaCantidad);

    // Actualizar directamente el input del DOM para respuesta inmediata
    const cantidadInput = document.querySelector(`.cantidad-input[data-id="${itemId}"]`);
    if (cantidadInput) {
      cantidadInput.value = nuevaCantidad;
    }

    // Actualizar el subtotal del item
    const carrito = LibreriaManager.obtenerCarrito();
    const item = carrito.find(item => item.id === itemId);
    if (item) {
      const subtotalElement = document.querySelector(`.carrito-item[data-id="${itemId}"] .subtotal-valor`);
      if (subtotalElement) {
        subtotalElement.textContent = `$${(item.precio * item.cantidad).toFixed(2)}`;
      }
    }

    // Actualizar el resumen y contador
    this.actualizarResumen();
    this.actualizarContadorCarrito();
  }

  static eliminarItem(itemId) {
    UIManager.mostrarConfirmacion(
      'Eliminar Producto',
      '¿Estás seguro de que quieres eliminar este libro del carrito?',
      () => {
        LibreriaManager.eliminarProducto(itemId);
        UIManager.mostrarMensaje('Producto eliminado del carrito', 'success');
        // Recargar la página
        setTimeout(() => {
          location.reload();
        }, 100);
      }
    );
  }

  static actualizarResumen() {
    const carrito = LibreriaManager.obtenerCarrito();
    const subtotal = LibreriaManager.calcularTotal();
    // Si el carrito está vacío, no hay costo de envío
    const envio = carrito.length === 0 ? 0 : (subtotal >= 100 ? 0 : this.costoEnvio);
    const subtotalConDescuento = subtotal - this.descuento;
    const iva = (subtotalConDescuento + envio) * this.ivaRate;
    const total = subtotalConDescuento + envio + iva;

    // Actualiza los valores en el DOM con verificación
    const subtotalElement = document.getElementById('subtotal');
    const envioElement = document.getElementById('envio');
    const ivaElement = document.getElementById('iva');
    const totalElement = document.getElementById('total');

    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (envioElement) {
      envioElement.textContent = envio === 0 ? 'GRATIS' : `$${envio.toFixed(2)}`;
      // Actualizar texto de envío
      if (envio === 0) {
        envioElement.style.color = 'var(--primary-green)';
        envioElement.style.fontWeight = 'bold';
      } else {
        envioElement.style.color = '';
        envioElement.style.fontWeight = '';
      }
    }
    if (ivaElement) ivaElement.textContent = `$${iva.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
  }

  static actualizarContadorCarrito() {
    const carritoCount = document.getElementById('cartCount');
    if (carritoCount) {
      const totalItems = LibreriaManager.obtenerTotalItems();
      carritoCount.textContent = totalItems;
    }
  }

  static aplicarCodigoDescuento() {
    const inputCodigo = document.getElementById('codigoDescuento');
    const codigo = inputCodigo.value.trim().toUpperCase();

    if (!codigo) {
      UIManager.mostrarMensaje('Por favor, ingresa un código de descuento', 'warning');
      return;
    }

    // Códigos de descuento válidos (sincronizados con el banner)
    const codigosValidos = {
      'LEER10': 0.10,      // 10% de descuento
      'LIBROS20': 0.20,    // 20% de descuento en libros
      'VERANO15': 0.15,    // 15% de descuento de verano
      'COCINA10': 0.10,    // 10% de descuento en cocina
      'CHEF15': 0.15,      // 15% de descuento para chefs
      'GOURMET20': 0.20,   // 20% de descuento gourmet
      'SABOR12': 0.12,     // 12% de descuento especial
      'RECETA18': 0.18,    // 18% de descuento en recetas
      'PLATANO8': 0.08,    // 8% de descuento divertido
      'ESPECIAS5': 0.05    // 5% de descuento en especias
    };

    if (codigosValidos[codigo]) {
      const subtotal = LibreriaManager.calcularTotal();
      this.descuento = subtotal * codigosValidos[codigo];

      UIManager.mostrarMensaje(`¡Código aplicado! Ahorraste $${this.descuento.toFixed(2)}`, 'success');
      this.actualizarResumen();

      // Deshabilitar input y botón
      inputCodigo.disabled = true;
      document.getElementById('btnAplicarCodigo').disabled = true;
    } else {
      UIManager.mostrarMensaje('Código de descuento no válido', 'error');
    }
  }

  static procesarCompra() {
    const carrito = LibreriaManager.obtenerCarrito();

    if (carrito.length === 0) {
      UIManager.mostrarMensaje('Tu carrito está vacío', 'warning');
      return;
    }

    // Mostrar modal de procesamiento de compra
    UIManager.mostrarConfirmacion(
      'Confirmar Compra',
      '¿Estás seguro de que quieres proceder con la compra?',
      () => {
        this.simularProcesoPago();
      }
    );
  }

  static simularProcesoPago() {
    // Mostrar loading
    UIManager.mostrarMensaje('Procesando tu compra...', 'info');

    // Simular proceso de pago (2 segundos)
    setTimeout(() => {
      // Mostrar formulario de pago
      this.mostrarFormularioPago();
    }, 2000);
  }

  static mostrarFormularioPago() {
    const total = document.getElementById('total').textContent;

    Swal.fire({
      title: '<div style="font-size: 1.5rem; font-weight: 700; color: #1f2937;">💳 Finalizar Compra</div>',
      html: `
        <div class="checkout-modal-form" style="font-family: system-ui, -apple-system, sans-serif; padding: 0;">
          <!-- Desktop/Tablet Layout: 2 columnas -->
          <div class="checkout-grid-desktop" style="display: none; grid-template-columns: 1fr 1fr; gap: 2rem;">
            <!-- Columna Izquierda: Datos Personales -->
            <div style="display: flex; flex-direction: column; gap: 1.5rem;">
              <div>
                <label style="display: block; margin-bottom: 0.6rem; font-weight: 600; color: #374151; font-size: 0.95rem;">👤 Nombre Completo</label>
                <input type="text" id="nombreCompleto" class="swal2-input" placeholder="Juan Pérez"
                       style="padding: 0.75rem 1rem; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 0.95rem; transition: all 0.3s ease;"
                       onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'"
                       onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow='none'">
              </div>

              <div>
                <label style="display: block; margin-bottom: 0.6rem; font-weight: 600; color: #374151; font-size: 0.95rem;">📧 Email</label>
                <input type="email" id="email" class="swal2-input" placeholder="correo@ejemplo.com"
                       style="padding: 0.75rem 1rem; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 0.95rem; transition: all 0.3s ease;"
                       onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'"
                       onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow='none'">
              </div>

              <div>
                <label style="display: block; margin-bottom: 0.6rem; font-weight: 600; color: #374151; font-size: 0.95rem;">🏠 Dirección de Envío</label>
                <textarea id="direccion" class="swal2-textarea" placeholder="Calle Principal 123, Ciudad, País" rows="3"
                         style="padding: 0.75rem 1rem; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 0.95rem; transition: all 0.3s ease; resize: vertical; font-family: system-ui, -apple-system, sans-serif; min-height: 5rem;"
                         onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'"
                         onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow='none'"></textarea>
              </div>
            </div>

            <!-- Columna Derecha: Información de Tarjeta -->
            <div style="display: flex; flex-direction: column; gap: 1.5rem;">
              <!-- Total Section -->
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.5rem; border-radius: 12px; text-align: center;">
                <div style="color: rgba(255, 255, 255, 0.9); font-size: 0.85rem; margin-bottom: 0.5rem;">Total a Pagar</div>
                <div style="color: white; font-size: 1.8rem; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">${total}</div>
              </div>

              <!-- Tarjeta -->
              <div>
                <label style="display: block; margin-bottom: 0.6rem; font-weight: 600; color: #374151; font-size: 0.95rem;">💳 Tarjeta de Crédito</label>
                <input type="text" id="tarjeta" class="swal2-input" placeholder="1234 5678 9012 3456" maxlength="19"
                       style="padding: 0.75rem 1rem; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 0.95rem; transition: all 0.3s ease;"
                       onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'"
                       onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow='none'">
              </div>

              <!-- Vencimiento y CVV -->
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                <div>
                  <label style="display: block; margin-bottom: 0.6rem; font-weight: 600; color: #374151; font-size: 0.95rem;">📅 Vencimiento</label>
                  <input type="text" id="fecha" class="swal2-input" placeholder="MM/AA" maxlength="5"
                         style="padding: 0.75rem 1rem; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 0.95rem; transition: all 0.3s ease;"
                         onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'"
                         onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow='none'">
                </div>
                <div>
                  <label style="display: block; margin-bottom: 0.6rem; font-weight: 600; color: #374151; font-size: 0.95rem;">🔒 CVV</label>
                  <input type="text" id="cvv" class="swal2-input" placeholder="123" maxlength="3"
                         style="padding: 0.75rem 1rem; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 0.95rem; transition: all 0.3s ease;"
                         onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'"
                         onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow='none'">
                </div>
              </div>

              <!-- Security Badge -->
              <div style="text-align: center; padding: 1rem; background: linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%); border-radius: 8px; border: 1px solid #3b82f6; margin-top: 1rem;">
                <span style="color: #1e40af; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-size: 0.9rem;">
                  🔒 <span>Pago Seguro con Encriptación SSL</span>
                </span>
              </div>
            </div>
          </div>

          <!-- Mobile Layout: Single Column con gradiente -->
          <div class="checkout-grid-mobile" style="display: flex; flex-direction: column; gap: 1.2rem;">
            <!-- Fondo con gradiente para móviles -->
            <div class="mobile-gradient-bg" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.5rem; border-radius: 12px; text-align: center;">
              <div style="color: rgba(255, 255, 255, 0.9); font-size: 1rem; margin-bottom: 0.5rem;">Total a Pagar</div>
              <div style="color: white; font-size: 2rem; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">${total}</div>
            </div>

            <!-- Nombre -->
            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #374151; font-size: 0.9rem;">👤 Nombre Completo</label>
              <input type="text" id="nombreCompleto" class="swal2-input" placeholder="Juan Pérez"
                     style="padding: 0.75rem 1rem; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 0.95rem; transition: all 0.3s ease;"
                     onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'"
                     onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow='none'">
            </div>

            <!-- Email -->
            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #374151; font-size: 0.9rem;">📧 Email</label>
              <input type="email" id="email" class="swal2-input" placeholder="correo@ejemplo.com"
                     style="padding: 0.75rem 1rem; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 0.95rem; transition: all 0.3s ease;"
                     onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'"
                     onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow='none'">
            </div>

            <!-- Dirección -->
            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #374151; font-size: 0.9rem;">🏠 Dirección de Envío</label>
              <textarea id="direccion" class="swal2-textarea" placeholder="Calle Principal 123, Ciudad, País" rows="3"
                       style="padding: 0.75rem 1rem; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 0.95rem; transition: all 0.3s ease; resize: vertical; font-family: system-ui, -apple-system, sans-serif; min-height: 5rem;"
                       onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'"
                       onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow='none'"></textarea>
            </div>

            <!-- Tarjeta -->
            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #374151; font-size: 0.9rem;">💳 Tarjeta de Crédito</label>
              <input type="text" id="tarjeta" class="swal2-input" placeholder="1234 5678 9012 3456" maxlength="19"
                     style="padding: 0.75rem 1rem; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 0.95rem; transition: all 0.3s ease;"
                     onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'"
                     onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow='none'">
            </div>

            <!-- Vencimiento y CVV (mobile) -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem;">
              <div>
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #374151; font-size: 0.9rem;">📅 Vencimiento</label>
                <input type="text" id="fecha" class="swal2-input" placeholder="MM/AA" maxlength="5"
                       style="padding: 0.75rem 1rem; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 0.95rem; transition: all 0.3s ease;"
                       onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'"
                       onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow='none'">
              </div>
              <div>
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #374151; font-size: 0.9rem;">🔒 CVV</label>
                <input type="text" id="cvv" class="swal2-input" placeholder="123" maxlength="3"
                       style="padding: 0.75rem 1rem; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 0.95rem; transition: all 0.3s ease;"
                       onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'"
                       onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow='none'">
              </div>
            </div>

            <!-- Security Badge (mobile) -->
            <div style="text-align: center; padding: 1rem; background: linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%); border-radius: 8px; border: 1px solid #3b82f6; margin-top: 1.2rem;">
              <span style="color: #1e40af; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-size: 0.9rem;">
                🔒 <span>Pago Seguro con Encriptación SSL</span>
              </span>
            </div>
          </div>
        </div>
      `,
      icon: false,
      showCancelButton: true,
      confirmButtonText: '✨ Confirmar Pago',
      cancelButtonText: '❌ Cancelar',
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      buttonsStyling: true,
      confirmButtonClass: 'swal2-confirm swal2-styled',
      cancelButtonClass: 'swal2-cancel swal2-styled',
      customClass: {
        popup: 'checkout-modal-popup',
        container: 'checkout-modal-container',
        content: 'checkout-modal-content'
      },
      width: '95%',
      maxWidth: '600px',
      onOpen: () => {
        // Detectar tamaño de pantalla y mostrar layout apropiado
        const isMobile = window.innerWidth <= 768;
        const desktopGrid = document.querySelector('.checkout-grid-desktop');
        const mobileGrid = document.querySelector('.checkout-grid-mobile');

        if (isMobile) {
          desktopGrid.style.display = 'none';
          mobileGrid.style.display = 'flex';
        } else {
          desktopGrid.style.display = 'grid';
          mobileGrid.style.display = 'none';
        }
      },
      preConfirm: () => {
        const nombre = document.getElementById('nombreCompleto').value;
        const email = document.getElementById('email').value;
        const tarjeta = document.getElementById('tarjeta').value;
        const fecha = document.getElementById('fecha').value;
        const cvv = document.getElementById('cvv').value;
        const direccion = document.getElementById('direccion').value;

        // Valida los datos de entrada básicos
        if (!nombre || !email || !tarjeta || !fecha || !cvv || !direccion) {
          Swal.showValidationMessage('Por favor, completa todos los campos');
          return false;
        }

        return { nombre, email, tarjeta, fecha, cvv, direccion };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.finalizarCompra(result.value);
      }
    });

    // Formatear número de tarjeta
    document.getElementById('tarjeta')?.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\s/g, '');
      let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
      e.target.value = formattedValue;
    });

    // Formatear fecha MM/AA
    document.getElementById('fecha')?.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
      e.target.value = value;
    });
  }

  static finalizarCompra(datosCliente) {
    // Generar número de seguimiento realista
    const numeroSeguimiento = 'TRK' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 100);
    const numeroPedido = '#' + Date.now().toString().slice(-6);

    // Simular procesamiento del pago
    UIManager.mostrarMensaje('Procesando pago...', 'info');

    setTimeout(() => {
      // Vaciar carrito
      LibreriaManager.vaciarCarrito();

      // Actualizar contador del carrito después de vaciar
      this.actualizarContadorCarrito();

      // Muestra una confirmación mejorada y responsive
      Swal.fire({
        title: '¡Compra Exitosa!',
        html: `
          <div class="success-modal">
            <div class="success-icon">📦</div>
            <h3 class="success-title">¡Pedido Confirmado!</h3>
            <p class="success-email">
              Hemos enviado un correo de confirmación a<br>
              <strong class="email-highlight">${datosCliente.email}</strong>
            </p>
            <div class="order-details">
              <div class="order-row">
                <div class="order-item">
                  <div class="order-label">Número de Pedido</div>
                  <div class="order-value">${numeroPedido}</div>
                </div>
                <div class="order-item">
                  <div class="order-label">Seguimiento</div>
                  <div class="order-value tracking">${numeroSeguimiento}</div>
                </div>
              </div>
              <div class="shipping-info">
                <div class="order-label">Dirección de Entrega</div>
                <div class="order-value address">${datosCliente.direccion}</div>
              </div>
            </div>
            <p class="delivery-time">
              Tiempo estimado de entrega: <strong>3-5 días hábiles</strong>
            </p>
          </div>
        `,
        icon: false,
        confirmButtonText: 'Ir a Libros',
        confirmButtonColor: '#4CAF50',
        showCancelButton: true,
        cancelButtonText: 'Seguir Comprando',
        cancelButtonColor: '#FF9800',
        width: '90%',
        maxWidth: '500px',
        customClass: {
          container: 'success-modal-container'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = 'libros.html';
        } else {
          window.location.href = 'libros.html';
        }
      });
    }, 2000);
  }

  static configurarEventListeners() {
    // Botón aplicar código de descuento
    const btnAplicarCodigo = document.getElementById('btnAplicarCodigo');
    if (btnAplicarCodigo) {
      btnAplicarCodigo.addEventListener('click', () => this.aplicarCodigoDescuento());
    }

    // Input de código de descuento (presionar Enter)
    const codigoInput = document.getElementById('codigoDescuento');
    if (codigoInput) {
      codigoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.aplicarCodigoDescuento();
        }
      });
    }

    // Botón procesar compra
    const btnProcesarCompra = document.getElementById('btnProcesarCompra');
    if (btnProcesarCompra) {
      btnProcesarCompra.addEventListener('click', () => this.procesarCompra());
    }

    // Icono del carrito
    const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) {
      cartIcon.addEventListener('click', () => {
        window.location.href = 'carrito.html';
      });
    }
}
}

// EVENT LISTENERS
document.addEventListener('DOMContentLoaded', () => {
  CarritoPageManager.inicializar();
  CarritoPageManager.actualizarContadorCarrito();
});

// Escucha los eventos de actualización del carrito desde otras páginas
window.addEventListener('carritoActualizado', (event) => {
  CarritoPageManager.cargarCarrito();
  CarritoPageManager.actualizarResumen();
  CarritoPageManager.actualizarContadorCarrito();
});