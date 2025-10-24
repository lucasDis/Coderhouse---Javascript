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
    // Verificar que las dependencias estén disponibles
    if (typeof LibreriaManager === 'undefined') {
      console.error('❌ ERROR: LibreriaManager no está definido. Inicialización cancelada.');
      return;
    }

    
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
    const carritoHeaderActions = document.getElementById('carritoHeaderActions');

    // Verificar que LibreriaManager esté disponible
    if (typeof LibreriaManager === 'undefined') {
      console.error('❌ ERROR: LibreriaManager no está definido. Verificar orden de carga de scripts.');
      return;
    }

    const carrito = LibreriaManager.obtenerCarrito();

    
    if (carrito.length === 0) {
      // Muestra el carrito vacío si no hay items
      container.innerHTML = `
        <div class="empty-cart" id="emptyCart" style="display: block;">
          <div class="empty-icon">🛒</div>
          <h3>Tu carrito está vacío</h3>
          <p>Aún no has añadido libros a tu carrito</p>
          <a href="libros.html" class="btn-primary">Explorar Libros</a>
        </div>
      `;
      carritoResumen.style.display = 'block';

      // Resetear el estado del descuento cuando el carrito está vacío
      this.descuento = 0;
      const inputCodigo = document.getElementById('codigoDescuento');
      const btnAplicarCodigo = document.getElementById('btnAplicarCodigo');
      if (inputCodigo) {
        inputCodigo.value = '';
        inputCodigo.disabled = false;
      }
      if (btnAplicarCodigo) {
        btnAplicarCodigo.disabled = false;
      }
      this.actualizarResumen();

      return;
    }

    // Oculta el carrito vacío y muestra los items existentes
    carritoResumen.style.display = 'block';

    // Construir el HTML completo del carrito
    let carritoHTML = `
      <div class="carrito-header-actions" id="carritoHeaderActions" style="display: block;">
        <button class="btn-danger btn-vaciar-carrito" id="btnVaciarCarrito">
          🗑️ Vaciar Carrito
        </button>
      </div>
    `;

    // Agregar los items del carrito
    carrito.forEach(item => {
      carritoHTML += this.crearItemCarritoHTML(item);
    });

    container.innerHTML = carritoHTML;

    // Actualizar estados de botones minus
    this.actualizarEstadosBotonesMinus();

    // Actualizar contador del carrito después de cargar
    if (typeof LibreriaManager !== 'undefined') {
      LibreriaManager.actualizarContadorCarrito();
    }
  }

  static actualizarEstadosBotonesMinus() {
    // Actualizar estado de todos los botones minus después de cargar el carrito
    const cantidadInputs = document.querySelectorAll('.cantidad-input');
    cantidadInputs.forEach(input => {
      const itemId = parseInt(input.dataset.id);
      const btnMinus = document.querySelector(`.carrito-item[data-id="${itemId}"] .btn-minus`);
      if (btnMinus) {
        this.actualizarEstadoBtnMinus(btnMinus, input);
      }
    });
  }

  static crearItemCarritoHTML(item) {
    return `
      <div class="carrito-item" data-id="${item.id}">
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
      </div>
    `;
  }

  static crearItemCarrito(item) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'carrito-item';
    itemDiv.dataset.id = item.id;

    itemDiv.innerHTML = this.crearItemCarritoHTML(item);

    // Los event listeners se manejan mediante delegación en configurarEventListeners()
    // Solo configuramos el estado inicial del botón minus
    const btnMinus = itemDiv.querySelector('.btn-minus');
    const cantidadInput = itemDiv.querySelector('.cantidad-input');
    this.actualizarEstadoBtnMinus(btnMinus, cantidadInput);

    return itemDiv;
  }

  static actualizarCantidad(itemId, nuevaCantidad) {
    LibreriaManager.actualizarCantidad(itemId, nuevaCantidad);

    // Actualizar directamente el input del DOM para respuesta inmediata
    const cantidadInput = document.querySelector(`.cantidad-input[data-id="${itemId}"]`);
    if (cantidadInput) {
      cantidadInput.value = nuevaCantidad;

      // Actualizar estado del botón minus
      const btnMinus = document.querySelector(`.carrito-item[data-id="${itemId}"] .btn-minus`);
      if (btnMinus) {
        this.actualizarEstadoBtnMinus(btnMinus, cantidadInput);
      }
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
    if (typeof LibreriaManager !== 'undefined') {
      LibreriaManager.actualizarContadorCarrito();
    }
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
    const resumenDescuentoElement = document.getElementById('resumenDescuento');
    const descuentoAplicadoElement = document.getElementById('descuentoAplicado');

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

    // Mostrar u ocultar descuento aplicado
    if (this.descuento > 0 && resumenDescuentoElement && descuentoAplicadoElement) {
      resumenDescuentoElement.style.display = 'flex';
      const porcentajeDescuento = ((this.descuento / subtotal) * 100).toFixed(0);
      descuentoAplicadoElement.textContent = `-$${this.descuento.toFixed(2)} (${porcentajeDescuento}%)`;
    } else if (resumenDescuentoElement) {
      resumenDescuentoElement.style.display = 'none';
    }
  }

  
  static actualizarEstadoBtnMinus(btnMinus, cantidadInput) {
    const cantidad = parseInt(cantidadInput.value);

    if (cantidad <= 1) {
      btnMinus.disabled = true;
      btnMinus.classList.add('disabled');
      btnMinus.style.opacity = '0.5';
      btnMinus.style.cursor = 'not-allowed';
    } else {
      btnMinus.disabled = false;
      btnMinus.classList.remove('disabled');
      btnMinus.style.opacity = '1';
      btnMinus.style.cursor = 'pointer';
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
        <!-- Total a Pagar (arriba del formulario) -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.5rem; border-radius: 12px; text-align: center; margin: 0 0 1.5rem 0; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
          <div style="color: rgba(255, 255, 255, 0.9); font-size: 0.9rem; margin-bottom: 0.5rem;">Total a Pagar</div>
          <div style="color: white; font-size: 2rem; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">${total}</div>
        </div>

        <!-- Contenedor del formulario -->
        <div class="checkout-modal-form" style="font-family: system-ui, -apple-system, sans-serif; padding: 0 0.5rem; text-align: center; max-width: 100%; box-sizing: border-box;">
          <!-- Layout: Responsive - 2 columnas desktop, 1 columna móvil -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; max-width: 100%; box-sizing: border-box;">
            <!-- Desktop: Columna Izquierda | Mobile: Primera mitad -->
            <div style="text-align: left; max-width: 100%;">
              <div style="margin-bottom: 1.2rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #374151; font-size: 0.9rem;">👤 Nombre Completo</label>
                <input type="text" id="nombreCompleto" class="swal2-input" placeholder="Juan Pérez"
                       style="border: 2px solid #e5e7eb; border-radius: 8px; font-size: 0.95rem; transition: all 0.3s ease; width: calc(100% - 15px); max-width: calc(100% - 15px); box-sizing: border-box;">
              </div>

              <div style="margin-bottom: 1.2rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #374151; font-size: 0.9rem;">📧 Email</label>
                <input type="text" id="email" class="swal2-input" placeholder="correo@ejemplo.com"
                       style="border: 2px solid #e5e7eb; border-radius: 8px; font-size: 0.95rem; transition: all 0.3s ease; width: calc(100% - 15px); max-width: calc(100% - 15px); box-sizing: border-box;">
              </div>

              <div style="margin-bottom: 1.2rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #374151; font-size: 0.9rem;">🏠 Dirección de Envío</label>
                <input type="text" id="direccion" class="swal2-input" placeholder="Calle Principal 123, Ciudad, País"
                       style="border: 2px solid #e5e7eb; border-radius: 8px; font-size: 0.95rem; transition: all 0.3s ease; width: calc(100% - 15px); max-width: calc(100% - 15px); box-sizing: border-box;">
              </div>
            </div>

            <!-- Desktop: Columna Derecha | Mobile: Segunda mitad -->
            <div style="text-align: left; max-width: 100%;">
              <div style="margin-bottom: 1.2rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #374151; font-size: 0.9rem;">💳 Tarjeta de Crédito</label>
                <input type="text" id="tarjeta" class="swal2-input" placeholder="1234 5678 9012 3456" maxlength="19"
                       style="border: 2px solid #e5e7eb; border-radius: 8px; font-size: 0.95rem; transition: all 0.3s ease; width: calc(100% - 15px); max-width: calc(100% - 15px); box-sizing: border-box;">
              </div>

              <div style="margin-bottom: 1.2rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #374151; font-size: 0.9rem;">📅 Vencimiento</label>
                <input type="text" id="fecha" class="swal2-input" placeholder="MM/AA" maxlength="5"
                       style="border: 2px solid #e5e7eb; border-radius: 8px; font-size: 0.95rem; transition: all 0.3s ease; width: calc(100% - 15px); max-width: calc(100% - 15px); box-sizing: border-box;">
              </div>

              <div style="margin-bottom: 1.2rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #374151; font-size: 0.9rem;">🔒 CVV</label>
                <input type="text" id="cvv" class="swal2-input" placeholder="123" maxlength="3"
                       style="border: 2px solid #e5e7eb; border-radius: 8px; font-size: 0.95rem; transition: all 0.3s ease; width: calc(100% - 15px); max-width: calc(100% - 15px); box-sizing: border-box;">
              </div>
            </div>
          </div>

          <!-- CSS Media Query para responsive en móviles -->
          <style>
            @media (max-width: 768px) {
              .checkout-modal-form > div:first-child {
                grid-template-columns: 1fr !important;
                gap: 1rem !important;
              }

              .checkout-modal-form .swal2-input {
                width: calc(100% - 30px) !important;
                max-width: calc(100% - 30px) !important;
              }
            }
          </style>
        </div>

        <!-- Pago Seguro (debajo del formulario) -->
        <div style="text-align: center; padding: 0.8rem 1rem; background: linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%); border-radius: 8px; border: 1px solid #3b82f6; margin: 1.2rem 0 0 0; box-sizing: border-box;">
          <span style="color: #1e40af; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-size: 0.85rem;">
            🔒 <span>Pago Seguro con Encriptación SSL</span>
          </span>
        </div>
      `,
      icon: false,
      showCancelButton: true,
      confirmButtonText: 'Confirmar Pago',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      buttonsStyling: true,
      customClass: {
        popup: 'checkout-modal-popup',
        container: 'checkout-modal-container',
        content: 'checkout-modal-content'
      },
      width: '95%',
      didOpen: () => {
        // Formatear número de tarjeta automáticamente
        const tarjetaInput = document.getElementById('tarjeta');
        if (tarjetaInput) {
          tarjetaInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, ''); // Solo números
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
          });
        }

        // Formatear fecha MM/AA automáticamente
        const fechaInput = document.getElementById('fecha');
        if (fechaInput) {
          fechaInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, ''); // Solo números
            if (value.length >= 2) {
              value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
          });
        }
      },
      preConfirm: () => {
        const nombre = document.getElementById('nombreCompleto').value;
        const email = document.getElementById('email').value;
        const tarjeta = document.getElementById('tarjeta').value;
        const fecha = document.getElementById('fecha').value;
        const cvv = document.getElementById('cvv').value;
        const direccion = document.getElementById('direccion').value;

        // Validar solo que los campos no estén vacíos
        if (!nombre || !email || !tarjeta || !fecha || !cvv || !direccion) {
          Swal.showValidationMessage('Por favor, completa todos los campos');
          return false;
        }

        return { nombre, email, tarjeta, fecha, cvv, direccion };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.procesarCompraConSpinner(result.value);
      }
    });
  }

  static procesarCompraConSpinner(datosCliente) {
    // Mostrar spinner de carga
    Swal.fire({
      title: 'Procesando tu compra...',
      html: `
        <div class="spinner-container">
          <div class="spinner"></div>
          <p style="margin-top: 1rem; color: #666;">Validando información de pago...</p>
        </div>
      `,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // Simular procesamiento con diferentes etapas
    setTimeout(() => {
      Swal.update({
        title: 'Procesando tu compra...',
        html: `
          <div class="spinner-container">
            <div class="spinner"></div>
            <p style="margin-top: 1rem; color: #666;">Verificando tarjeta...</p>
          </div>
        `
      });
    }, 1000);

    setTimeout(() => {
      Swal.update({
        title: 'Procesando tu compra...',
        html: `
          <div class="spinner-container">
            <div class="spinner"></div>
            <p style="margin-top: 1rem; color: #666;">Generando orden de compra...</p>
          </div>
        `
      });
    }, 2000);

    setTimeout(() => {
      // Cerrar spinner y mostrar confirmación
      Swal.close();
      this.finalizarCompra(datosCliente);
    }, 3000);
  }

  static finalizarCompra(datosCliente) {
    // Generar número de seguimiento realista
    const numeroSeguimiento = 'TRK' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 100);
    const numeroPedido = '#' + Date.now().toString().slice(-6);

    // Vaciar carrito
    LibreriaManager.vaciarCarrito();

    // Actualizar contador del carrito después de vaciar
    if (typeof LibreriaManager !== 'undefined') {
      LibreriaManager.actualizarContadorCarrito();
    }

    // Muestra una confirmación mejorada y responsive mobile-first
    Swal.fire({
      title: '¡Compra Exitosa!',
      html: `
        <div class="success-modal" style="max-width: 400px; margin: 0 auto; text-align: center; padding: 1rem;">
          <div class="success-icon" style="font-size: 3rem; margin-bottom: 1rem;">📦</div>
          <h3 class="success-title" style="font-size: 1.5rem; font-weight: 700; color: #1f2937; margin-bottom: 1rem;">¡Pedido Confirmado!</h3>
          <p class="success-email" style="font-size: 0.9rem; color: #6b7280; margin-bottom: 1.5rem; line-height: 1.4;">
            Hemos enviado un correo de confirmación a<br>
            <strong class="email-highlight" style="color: #059669;">${datosCliente.email}</strong>
          </p>
          <div class="order-details" style="background: #f9fafb; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border: 1px solid #e5e7eb;">
            <div class="order-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
              <div class="order-item" style="text-align: left;">
                <div class="order-label" style="font-size: 0.8rem; color: #6b7280; margin-bottom: 0.25rem;">Número de Pedido</div>
                <div class="order-value" style="font-size: 1rem; font-weight: 600; color: #1f2937;">${numeroPedido}</div>
              </div>
              <div class="order-item" style="text-align: left;">
                <div class="order-label" style="font-size: 0.8rem; color: #6b7280; margin-bottom: 0.25rem;">Seguimiento</div>
                <div class="order-value tracking" style="font-size: 0.85rem; font-weight: 600; color: #059669; word-break: break-all;">${numeroSeguimiento}</div>
              </div>
            </div>
            <div class="shipping-info" style="text-align: left;">
              <div class="order-label" style="font-size: 0.8rem; color: #6b7280; margin-bottom: 0.25rem;">Dirección de Entrega</div>
              <div class="order-value address" style="font-size: 0.9rem; color: #374151; line-height: 1.3;">${datosCliente.direccion}</div>
            </div>
          </div>
          <p class="delivery-time" style="font-size: 0.85rem; color: #6b7280; margin: 0;">
            Tiempo estimado de entrega: <strong style="color: #059669;">3-5 días hábiles</strong>
          </p>
        </div>
      `,
      icon: false,
      confirmButtonText: 'Ir a Libros',
      confirmButtonColor: '#4CAF50',
      showCancelButton: true,
      cancelButtonText: 'Seguir Comprando',
      cancelButtonColor: '#FF9800',
      width: 'auto',
      maxWidth: '450px',
      customClass: {
        container: 'success-modal-container',
        popup: 'success-modal-popup'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = 'libros.html';
      } else {
        window.location.href = 'libros.html';
      }
    });
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

    // Botón vaciar carrito
    const btnVaciarCarrito = document.getElementById('btnVaciarCarrito');
    if (btnVaciarCarrito) {
      btnVaciarCarrito.addEventListener('click', () => this.vaciarCarrito());
    }

    // DELEGACIÓN DE EVENTOS para items del carrito
    const carritoItems = document.getElementById('carritoItems');
        if (carritoItems) {
            // Botones de cantidad (+/-)
      carritoItems.addEventListener('click', (e) => {
                if (e.target.classList.contains('btn-plus')) {
          const itemId = parseInt(e.target.dataset.id);
          const item = this.obtenerItemCarrito(itemId);
          const stockDisponible = item.stock || 99;
          const cantidadInput = e.target.parentElement.querySelector('.cantidad-input');
          const nuevaCantidad = parseInt(cantidadInput.value) + 1;
          if (nuevaCantidad <= stockDisponible) {
            this.actualizarCantidad(itemId, nuevaCantidad);
          }
        } else if (e.target.classList.contains('btn-minus')) {
          const itemId = parseInt(e.target.dataset.id);
          const cantidadInput = e.target.parentElement.querySelector('.cantidad-input');
          const nuevaCantidad = parseInt(cantidadInput.value) - 1;
          if (nuevaCantidad >= 1) {
            this.actualizarCantidad(itemId, nuevaCantidad);
          }
        } else if (e.target.classList.contains('btn-eliminar')) {
          const itemId = parseInt(e.target.dataset.id);
          this.confirmarEliminarItem(itemId);
        }
      });

      // Input de cantidad (change)
      carritoItems.addEventListener('change', (e) => {
        if (e.target.classList.contains('cantidad-input')) {
          const itemId = parseInt(e.target.dataset.id);
          const item = this.obtenerItemCarrito(itemId);
          const stockDisponible = item.stock || 99;
          let nuevaCantidad = parseInt(e.target.value);
          if (isNaN(nuevaCantidad) || nuevaCantidad < 1) nuevaCantidad = 1;
          if (nuevaCantidad > stockDisponible) nuevaCantidad = stockDisponible;
          this.actualizarCantidad(itemId, nuevaCantidad);
        }
      });
    }
  }

  static vaciarCarrito() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Quieres eliminar todos los productos del carrito?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#F44336',
      cancelButtonColor: '#13678A',
      confirmButtonText: 'Sí, vaciar carrito',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Vaciar el carrito
        LibreriaManager.vaciarCarrito();

        // Actualizar la interfaz
        this.cargarCarrito();
        this.actualizarResumen();
        if (typeof LibreriaManager !== 'undefined') {
          LibreriaManager.actualizarContadorCarrito();
        }

        // Mostrar mensaje de éxito
        Swal.fire(
          '¡Carrito vaciado!',
          'Todos los productos han sido eliminados del carrito.',
          'success'
        );
      }
    });
  }

  static obtenerItemCarrito(itemId) {
    const carrito = LibreriaManager.obtenerCarrito();
    return carrito.find(item => item.id === itemId);
  }

  static confirmarEliminarItem(itemId) {
    Swal.fire({
      title: '¿Eliminar producto?',
      text: "¿Estás seguro de que quieres eliminar este producto del carrito?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--color-danger)',
      cancelButtonColor: 'var(--color-gris-medio)',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarItem(itemId);
      }
    });
  }

  static eliminarItem(itemId) {
    let carrito = LibreriaManager.obtenerCarrito();
    carrito = carrito.filter(item => item.id !== itemId);
    LibreriaManager.guardarCarrito(carrito);
    LibreriaManager.actualizarContadorCarrito();

    // Recargar el carrito
    this.cargarCarrito();
    this.actualizarResumen();
  }
}