// MANEJO ESPECÍFICO DE LA PÁGINA DE CARRITO
class CarritoPageManager {
  static descuento = 0;
  static costoEnvio = 3.99;
  static ivaRate = 0.21;

  static inicializar() {
    this.cargarCarrito();
    this.actualizarResumen();
    this.configurarEventListeners();
  }

  static cargarCarrito() {
    const container = document.getElementById('carritoItems');
    const emptyCart = document.getElementById('emptyCart');
    const carrito = LibreriaManager.obtenerCarrito();

    if (carrito.length === 0) {
      container.style.display = 'none';
      emptyCart.style.display = 'block';
      return;
    }

    container.style.display = 'block';
    emptyCart.style.display = 'none';
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
          <input type="number" class="cantidad-input" value="${item.cantidad}" min="1" max="10" data-id="${item.id}">
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
    const btnMinus = itemDiv.querySelector('.btn-minus');
    const btnPlus = itemDiv.querySelector('.btn-plus');
    const cantidadInput = itemDiv.querySelector('.cantidad-input');
    const btnEliminar = itemDiv.querySelector('.btn-eliminar');

    btnMinus.addEventListener('click', () => {
      const nuevaCantidad = parseInt(cantidadInput.value) - 1;
      if (nuevaCantidad >= 1) {
        this.actualizarCantidad(item.id, nuevaCantidad);
      }
    });

    btnPlus.addEventListener('click', () => {
      const nuevaCantidad = parseInt(cantidadInput.value) + 1;
      if (nuevaCantidad <= 10) {
        this.actualizarCantidad(item.id, nuevaCantidad);
      }
    });

    cantidadInput.addEventListener('change', () => {
      let nuevaCantidad = parseInt(cantidadInput.value);
      if (isNaN(nuevaCantidad) || nuevaCantidad < 1) nuevaCantidad = 1;
      if (nuevaCantidad > 10) nuevaCantidad = 10;
      this.actualizarCantidad(item.id, nuevaCantidad);
    });

    btnEliminar.addEventListener('click', () => {
      this.eliminarItem(item.id);
    });

    return itemDiv;
  }

  static actualizarCantidad(itemId, nuevaCantidad) {
    LibreriaManager.actualizarCantidad(itemId, nuevaCantidad);
    this.cargarCarrito();
    this.actualizarResumen();
  }

  static eliminarItem(itemId) {
    UIManager.mostrarConfirmacion(
      'Eliminar Producto',
      '¿Estás seguro de que quieres eliminar este libro del carrito?',
      () => {
        LibreriaManager.eliminarProducto(itemId);
        this.cargarCarrito();
        this.actualizarResumen();
        this.actualizarContadorCarrito();
        UIManager.mostrarMensaje('Producto eliminado del carrito', 'success');
      }
    );
  }

  static actualizarResumen() {
    const carrito = LibreriaManager.obtenerCarrito();
    const subtotal = LibreriaManager.calcularTotal();
    const envio = subtotal > 30 ? 0 : this.costoEnvio;
    const subtotalConDescuento = subtotal - this.descuento;
    const iva = (subtotalConDescuento + envio) * this.ivaRate;
    const total = subtotalConDescuento + envio + iva;

    // Actualizar valores en el DOM
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('envio').textContent = envio === 0 ? 'GRATIS' : `$${envio.toFixed(2)}`;
    document.getElementById('iva').textContent = `$${iva.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;

    // Actualizar texto de envío
    const envioElement = document.getElementById('envio');
    if (envio === 0) {
      envioElement.style.color = 'var(--primary-green)';
      envioElement.style.fontWeight = 'bold';
    } else {
      envioElement.style.color = '';
      envioElement.style.fontWeight = '';
    }
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

    // Códigos de descuento válidos (ejemplo)
    const codigosValidos = {
      'LEER10': 0.10,    // 10% de descuento
      'LIBROS20': 0.20,  // 20% de descuento
      'VERANO15': 0.15   // 15% de descuento
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
      title: 'Finalizar Compra',
      html: `
        <div class="payment-form">
          <div class="form-group">
            <label>Nombre completo:</label>
            <input type="text" id="nombreCompleto" class="swal2-input" placeholder="Juan Pérez">
          </div>

          <div class="form-group">
            <label>Email:</label>
            <input type="email" id="email" class="swal2-input" placeholder="correo@ejemplo.com">
          </div>

          <div class="form-group">
            <label>Tarjeta de crédito:</label>
            <input type="text" id="tarjeta" class="swal2-input" placeholder="1234 5678 9012 3456" maxlength="19">
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>MM/AA:</label>
              <input type="text" id="fecha" class="swal2-input" placeholder="12/25" maxlength="5">
            </div>
            <div class="form-group">
              <label>CVV:</label>
              <input type="text" id="cvv" class="swal2-input" placeholder="123" maxlength="3">
            </div>
          </div>

          <div class="form-group">
            <label>Dirección de envío:</label>
            <input type="text" id="direccion" class="swal2-input" placeholder="Calle Principal 123, Ciudad">
          </div>

          <div class="total-display">
            <strong>Total a pagar: ${total}</strong>
          </div>
        </div>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Pagar Ahora',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      preConfirm: () => {
        const nombre = document.getElementById('nombreCompleto').value;
        const email = document.getElementById('email').value;
        const tarjeta = document.getElementById('tarjeta').value;
        const fecha = document.getElementById('fecha').value;
        const cvv = document.getElementById('cvv').value;
        const direccion = document.getElementById('direccion').value;

        // Validación básica
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

      // Mostrar confirmación mejorada
      Swal.fire({
        title: '¡Compra Exitosa!',
        html: `
          <div style="text-align: center; padding: 20px;">
            <div style="font-size: 4rem; margin-bottom: 1rem;">📦</div>
            <h3 style="color: #1f2937; margin-bottom: 1rem;">¡Pedido Confirmado!</h3>
            <p style="color: #6b7280; margin-bottom: 1.5rem;">
              Hemos enviado un correo de confirmación a<br>
              <strong style="color: #4CAF50;">${datosCliente.email}</strong>
            </p>
            <div style="background: #f3f4f6; padding: 1.5rem; border-radius: 0.5rem; margin: 1.5rem 0;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; text-align: left;">
                <div>
                  <div style="font-size: 0.85rem; color: #6b7280; margin-bottom: 0.25rem;">Número de Pedido</div>
                  <div style="font-weight: 600; color: #1f2937; font-size: 1.1rem;">${numeroPedido}</div>
                </div>
                <div>
                  <div style="font-size: 0.85rem; color: #6b7280; margin-bottom: 0.25rem;">Seguimiento</div>
                  <div style="font-weight: 600; color: #4CAF50; font-size: 0.9rem;">${numeroSeguimiento}</div>
                </div>
              </div>
              <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e5e7eb;">
                <div style="font-size: 0.85rem; color: #6b7280; margin-bottom: 0.25rem;">Dirección de Entrega</div>
                <div style="color: #1f2937; font-weight: 500;">${datosCliente.direccion}</div>
              </div>
            </div>
            <p style="color: #6b7280; font-size: 0.9rem;">
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
        width: '600px'
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

// Escuchar eventos de actualización del carrito desde otras páginas
window.addEventListener('carritoActualizado', (event) => {
  CarritoPageManager.cargarCarrito();
  CarritoPageManager.actualizarResumen();
  CarritoPageManager.actualizarContadorCarrito();
});