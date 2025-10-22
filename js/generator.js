// Esperar a que los datos estén cargados
let datosListos = false;

// ==========================================
// MÉTODOS PRINCIPALES DE GENERACIÓN DE RECETAS
// ==========================================
class SimuladorRecetas {
  static generarRecetaRapida() {
    const ingrediente =
      ingredientes[Math.floor(Math.random() * ingredientes.length)];
    const metodo = metodos[Math.floor(Math.random() * metodos.length)];
    const sabor = sabores[Math.floor(Math.random() * sabores.length)];

    const recetaCompleta = this.buscarRecetaCompleta(
      ingrediente,
      metodo,
      sabor
    );

    if (recetaCompleta) {
      return {
        nombre: recetaCompleta.nombre,
        ingrediente: ingrediente,
        tipo: metodo,
        sabor: sabor,
        utensilios: recetaCompleta.utensilios,
        ingredientes: recetaCompleta.ingredientes,
        pasos: recetaCompleta.pasos,
      };
    }

    return {
      nombre: `${ingrediente} ${metodo} Estilo ${sabor}`,
      ingrediente: ingrediente,
      tipo: metodo,
      sabor: sabor,
      utensilios: ["Sartén", "Cuchillo", "Tabla de cortar"],
      ingredientes: [ingrediente, "Sal", "Pimienta", "Aceite de oliva"],
      pasos: [
        `Prepara el ${ingrediente} lavándolo y cortándolo en trozos apropiados.`,
        `Calienta una sartén a fuego medio y añade una cucharada de aceite de oliva.`,
        `Añade el ${ingrediente} a la sartén caliente y cocina durante 3-4 minutos por cada lado hasta que esté dorado.`,
        `Sazona con sal y pimienta al gusto. Añade cualquier hierba o especia adicional que prefieras.`,
        `Continúa cocinando hasta que el ${ingrediente} esté completamente cocido y tierno.`,
        `Retira del fuego y déjalo reposar un par de minutos antes de servir.`,
        `Sirve caliente, decorado con hierbas frescas o un chorrito de limón si lo deseas.`,
      ],
    };
  }

  static generarRecetaMultiple() {
    if (estado.seleccionados.length === 0) {
      UIManager.mostrarMensaje(
        "Debes seleccionar al menos un ingrediente para crear una receta",
        "error"
      );
      return null;
    }

    const ingredientePrincipal =
      estado.seleccionados[
        Math.floor(Math.random() * estado.seleccionados.length)
      ];
    const metodo = metodos[Math.floor(Math.random() * metodos.length)];
    const sabor = sabores[Math.floor(Math.random() * sabores.length)];

    const recetaCompleta = this.buscarRecetaCompleta(
      ingredientePrincipal,
      metodo,
      sabor
    );

    let nombre = "";
    let utensilios = [];
    let ingredientes = [];
    let pasos = [];

    if (recetaCompleta) {
      nombre = recetaCompleta.nombre;
      utensilios = recetaCompleta.utensilios;
      ingredientes = recetaCompleta.ingredientes;
      pasos = recetaCompleta.pasos;
    } else {
      if (estado.seleccionados.length === 1) {
        nombre = `${ingredientePrincipal} ${metodo} Estilo ${sabor}`;
      } else {
        const otrosIngredientes = estado.seleccionados.filter(
          (ing) => ing !== ingredientePrincipal
        );
        nombre = `${ingredientePrincipal} ${metodo} con ${otrosIngredientes
          .slice(0, 2)
          .join(" y ")} Estilo ${sabor}`;
      }

      utensilios = ["Sartén grande", "Cuchillo", "Tabla de cortar", "Espátula"];
      ingredientes = [
        ...estado.seleccionados.slice(0, 4),
        "Sal",
        "Pimienta",
        "Aceite de oliva",
        "Ajo",
      ];
      pasos = [
        `Comienza preparando todos tus ingredientes. Lava y pica el ${ingredientePrincipal} en trozos del tamaño de un bocado.`,
        `Calienta una sartén grande a fuego medio y añade una generosa cantidad de aceite de oliva.`,
        `Añade el ${ingredientePrincipal} a la sartén y cocina durante unos 5 minutos, removiendo ocasionalmente.`,
        `Añade los ingredientes seleccionados restantes uno por uno, permitiendo que cada uno se cocine durante un minuto antes de añadir el siguiente.`,
        `Sazona todo con sal, pimienta y ajo picado. Remueve bien para combinar todos los sabores.`,
        `Continúa cocinando ${metodo.toLowerCase()} hasta que todos los ingredientes estén tiernos y bien combinados.`,
        `Retira del fuego y sirve inmediatamente mientras está caliente. Decora con hierbas frescas si están disponibles.`,
      ];
    }

    return {
      nombre: nombre,
      ingrediente: ingredientePrincipal,
      tipo: metodo,
      sabor: sabor,
      ingredientesExtra: estado.seleccionados.filter(
        (ing) => ing !== ingredientePrincipal
      ),
      utensilios: utensilios,
      ingredientes: ingredientes,
      pasos: pasos,
    };
  }

  // ==========================================
  // MÉTODOS AUXILIARES Y DE BÚSQUEDA
  // ==========================================

  static buscarRecetaCompleta(ingrediente, metodo, sabor) {
    if (recetasCompletas[ingrediente]) {
      const recetasPosibles = recetasCompletas[ingrediente];

      let recetaExacta = recetasPosibles.find(
        (r) =>
          r.tipo.toLowerCase().includes(metodo.toLowerCase()) ||
          r.sabor.toLowerCase().includes(sabor.toLowerCase())
      );

      if (!recetaExacta) {
        recetaExacta = recetasPosibles[0];
      }

      return recetaExacta;
    }

    return null;
  }

  // ==========================================
  // MÉTODOS DE CONTROL DE FLUJO Y ESTADO
  // ==========================================

  static iniciarRecetaRapida() {
    // Limpiar receta anterior y estado
    this.limpiarRecetaAnterior();
    this.reiniciar();

    estado.modoActual = "rapida";
    const receta = this.generarRecetaRapida();
    estado.recetaActual = receta;
    UIManager.mostrarReceta(receta);
  }

  static iniciarSeleccionMultiple() {
    // Limpiar receta anterior y estado
    this.limpiarRecetaAnterior();
    this.reiniciar();

    estado.modoActual = "multiple";
    estado.seleccionados = [];

    document.getElementById("ingredientsPanel").style.display = "block";

    setTimeout(() => {
      UIManager.renderizarIngredientes();
      UIManager.actualizarEstadoBotones();
      this.inicializarBuscadorIngredientes();
      this.actualizarContadorSeleccion();
    }, 100);

    setTimeout(() => {
      UIManager.mostrarMensaje(
        "¡Comienza a seleccionar tus ingredientes! Puedes seleccionar hasta 5 ingredientes.",
        "info"
      );
    }, 500);
  }

  static finalizarSeleccion() {
    if (estado.seleccionados.length === 0) {
      UIManager.mostrarMensaje(
        "Debes seleccionar al menos un ingrediente para crear una receta",
        "error"
      );
      return;
    }

    UIManager.mostrarMensaje("Generando tu receta personalizada...", "info");

    setTimeout(() => {
      const receta = this.generarRecetaMultiple();
      if (receta) {
        estado.recetaActual = receta;
        UIManager.mostrarReceta(receta);

        setTimeout(() => {
          UIManager.mostrarMensaje("¡Receta generada exitosamente!", "success");
        }, 500);
      }
    }, 1000);
  }

  static guardarRecetaActual() {
    if (estado.recetaActual) {
      // Asegurar que la receta tenga todos los campos necesarios
      const recetaFormateada = {
        ...estado.recetaActual,
        // Asegurar campos básicos
        nombre: estado.recetaActual.nombre || 'Receta sin nombre',
        ingrediente: estado.recetaActual.ingrediente || 'Ingrediente desconocido',
        sabor: estado.recetaActual.sabor || 'Sabor no especificado',
        tipo: estado.recetaActual.tipo || 'Método no especificado'
      };

      StorageManager.guardarReceta(recetaFormateada);

      // Verificar que se guardó correctamente
      const recetas = StorageManager.obtenerRecetas();
      console.log('Recetas guardadas:', recetas.length, recetas); // Debug

      this.mostrarModalExito(estado.recetaActual);
    } else {
      UIManager.mostrarMensaje('No hay receta para guardar', 'error');
    }
  }

  // ==========================================
  // MODAL DE ÉXITO
  // ==========================================

  static mostrarModalExito(receta) {
    const iconos = {
      "pollo": "🍗",
      "carne": "🥩",
      "pescado": "🐟",
      "verduras": "🥬",
      "pasta": "🍝",
      "arroz": "🍚",
      "huevo": "🥚",
      "queso": "🧀",
      "tomate": "🍅",
      "cebolla": "🧅",
      "ajo": "🧄",
      "patata": "🥔",
      "zanahoria": "🥕",
      "lechuga": "🥬"
    };

    // Encontrar el icono del ingrediente principal
    let icono = "🍽️";
    for (const [ingrediente, icon] of Object.entries(iconos)) {
      if (receta.nombre.toLowerCase().includes(ingrediente) ||
          receta.ingrediente.toLowerCase().includes(ingrediente)) {
        icono = icon;
        break;
      }
    }

    // Modal de éxito con SweetAlert2
    Swal.fire({
      title: '¡Receta Guardada con Éxito!',
      html: `
        <div style="text-align: center;">
          <div style="font-size: 4rem; margin-bottom: 1rem;">${icono}</div>
          <h3 style="margin: 0 0 1rem 0; color: #1f2937;">${receta.nombre}</h3>
          <div style="background: #f9fafb; padding: 1.5rem; border-radius: 0.5rem; margin: 1rem 0;">
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; text-align: center;">
              <div>
                <div style="font-size: 1.5rem;">🎯</div>
                <div style="font-size: 0.85rem; color: #6b7280; margin-top: 0.25rem;">Estilo</div>
                <div style="font-weight: 600; color: #1f2937;">${receta.sabor}</div>
              </div>
              <div>
                <div style="font-size: 1.5rem;">🔥</div>
                <div style="font-size: 0.85rem; color: #6b7280; margin-top: 0.25rem;">Método</div>
                <div style="font-weight: 600; color: #1f2937;">${receta.tipo}</div>
              </div>
              <div>
                <div style="font-size: 1.5rem;">⭐</div>
                <div style="font-size: 0.85rem; color: #6b7280; margin-top: 0.25rem;">Calificación</div>
                <div style="font-weight: 600; color: #1f2937;">Sin calificar</div>
              </div>
            </div>
          </div>
          <p style="color: #6b7280; margin: 0;">Tu receta ha sido agregada a tu historial</p>
        </div>
      `,
      icon: 'success',
      iconColor: '#10b981',
      confirmButtonText: 'Ver en Historial',
      confirmButtonColor: '#4CAF50',
      showCancelButton: true,
      cancelButtonText: 'Crear Otra Receta',
      cancelButtonColor: '#FF9800',
      showDenyButton: true,
      denyButtonText: 'Cerrar',
      denyButtonColor: '#F44336',
      customClass: {
        confirmButton: 'swal2-confirm-button',
        cancelButton: 'swal2-cancel-button',
        denyButton: 'swal2-deny-button'
      },
      background: '#ffffff',
      width: '600px'
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "historial.html";
      } else if (result.isDismissed && result.dismiss === Swal.DismissReason.cancel) {
        this.reiniciar();
      }
      // Si es deny (Cerrar), simplemente se cierra el modal
    });
  }

  
  // ==========================================
  // BUSCADOR DE INGREDIENTES
  // ==========================================

  static inicializarBuscadorIngredientes() {
    const searchInput = document.getElementById("ingredientSearchInput");
    const suggestionsContainer = document.getElementById("searchSuggestions");

    if (!searchInput || !suggestionsContainer) return;

    // Variables para controlar las sugerencias
    let timeoutDebounce;
    let currentFocus = -1;

    // Event listener para el input
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.trim().toLowerCase();
      currentFocus = -1;

      // Limpiar timeout anterior
      clearTimeout(timeoutDebounce);

      // Debounce para evitar muchas búsquedas
      timeoutDebounce = setTimeout(() => {
        if (query.length > 0) {
          this.mostrarSugerencias(query, suggestionsContainer);
        } else {
          this.ocultarSugerencias(suggestionsContainer);
        }
      }, 300);
    });

    // Event listener para el teclado (navegación con flechas)
    searchInput.addEventListener("keydown", (e) => {
      const items = suggestionsContainer.getElementsByClassName("suggestion-item");

      if (e.key === "ArrowDown") {
        e.preventDefault();
        currentFocus++;
        this.highlightSuggestion(items, currentFocus);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        currentFocus--;
        this.highlightSuggestion(items, currentFocus);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (currentFocus > -1 && items[currentFocus]) {
          items[currentFocus].click();
        }
      } else if (e.key === "Escape") {
        this.ocultarSugerencias(suggestionsContainer);
        searchInput.blur();
      }
    });

    // Cerrar sugerencias al hacer clic fuera
    document.addEventListener("click", (e) => {
      if (e.target !== searchInput && !suggestionsContainer.contains(e.target)) {
        this.ocultarSugerencias(suggestionsContainer);
      }
    });
  }

  static mostrarSugerencias(query, container) {
    // Filtrar ingredientes que coincidan con la búsqueda
    const sugerencias = ingredientes.filter(ingrediente =>
      ingrediente.toLowerCase().includes(query)
    ).slice(0, 8); // Limitar a 8 sugerencias

    if (sugerencias.length === 0) {
      this.ocultarSugerencias(container);
      return;
    }

    // Crear HTML para las sugerencias
    const html = sugerencias.map(ingrediente => {
      const resaltado = this.resaltarTexto(ingrediente, query);
      const esSeleccionado = estado.seleccionados.includes(ingrediente);
      return `
        <div class="suggestion-item ${esSeleccionado ? 'highlighted' : ''}"
             data-ingredient="${ingrediente}"
             onclick="SimuladorRecetas.seleccionarDesdeBuscador('${ingrediente}')">
          ${resaltado} ${esSeleccionado ? '(✓)' : ''}
        </div>
      `;
    }).join('');

    container.innerHTML = html;
    container.style.display = 'block';
  }

  static resaltarTexto(texto, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return texto.replace(regex, '<strong>$1</strong>');
  }

  static highlightSuggestion(items, index) {
    if (!items || items.length === 0) return;

    // Quitar highlight de todos
    Array.from(items).forEach(item => item.classList.remove('active'));

    if (index >= items.length) index = 0;
    if (index < 0) index = items.length - 1;

    if (items[index]) {
      items[index].classList.add('active');
      // Hacer scroll si es necesario
      items[index].scrollIntoView({ block: 'nearest' });
    }
  }

  static ocultarSugerencias(container) {
    container.style.display = 'none';
    container.innerHTML = '';
  }

  static seleccionarDesdeBuscador(ingrediente) {
    const searchInput = document.getElementById("ingredientSearchInput");
    const suggestionsContainer = document.getElementById("searchSuggestions");

    // Seleccionar/deseleccionar el ingrediente
    this.toggleIngrediente(ingrediente);

    // Limpiar buscador
    searchInput.value = '';
    this.ocultarSugerencias(suggestionsContainer);

    // Dar focus al buscador para seguir buscando
    searchInput.focus();
  }

  static toggleIngrediente(ingrediente) {
    const index = estado.seleccionados.indexOf(ingrediente);

    if (index > -1) {
      // Deseleccionar
      estado.seleccionados.splice(index, 1);
    } else {
      // Seleccionar si no hemos alcanzado el límite
      if (estado.seleccionados.length < 5) {
        estado.seleccionados.push(ingrediente);
      } else {
        UIManager.mostrarMensaje("Ya has alcanzado el límite de 5 ingredientes", "warning");
        return;
      }
    }

    // Actualizar UI
    UIManager.renderizarIngredientes();
    UIManager.actualizarListaSeleccionados();
    UIManager.actualizarEstadoBotones();
    this.actualizarContadorSeleccion();
  }

  // ==========================================
  // CONTADOR DE SELECCIÓN
  // ==========================================

  static actualizarContadorSeleccion() {
    const countElement = document.getElementById("selectionCount");
    const limitElement = document.querySelector(".selection-limit");

    if (!countElement || !limitElement) return;

    const count = estado.seleccionados.length;
    countElement.textContent = count;

    // Actualizar estilos según el contador
    limitElement.classList.remove("warning", "max-reached");

    if (count >= 5) {
      limitElement.classList.add("max-reached");
    } else if (count >= 3) {
      limitElement.classList.add("warning");
    }
  }

  static limpiarRecetaAnterior() {
    // Limpiar visualmente la receta anterior si existe
    const recipeResult = document.getElementById("recipeResult");
    if (recipeResult) {
      recipeResult.style.display = "none";
    }

    // Limpiar el panel de ingredientes si está visible
    const ingredientsPanel = document.getElementById("ingredientsPanel");
    if (ingredientsPanel) {
      ingredientsPanel.style.display = "none";
    }
  }

  static reiniciar() {
    estado.seleccionados = [];
    estado.recetaActual = null;
    estado.modoActual = null;
    UIManager.ocultarTodosLosPaneles();

    // Limpiar buscador si existe
    const searchInput = document.getElementById("ingredientSearchInput");
    if (searchInput) {
      searchInput.value = '';
    }

    const suggestionsContainer = document.getElementById("searchSuggestions");
    if (suggestionsContainer) {
      this.ocultarSugerencias(suggestionsContainer);
    }
  }
}

// ==========================================
// EVENT LISTENERS PARA GENERAR RECETA
// ==========================================

document.addEventListener("DOMContentLoaded", async function () {
  // Cargar datos antes de cualquier acción
  datosListos = await cargarDatosIniciales();

  if (!datosListos) {
    UIManager.mostrarMensaje(
      "Error al cargar los datos. Por favor, recarga la página.",
      "error"
    );
    return;
  }

  // Botones principales
  const btnGenerarRapida = document.getElementById("btnGenerarRapida");
  const btnSeleccionarIngredientes = document.getElementById(
    "btnSeleccionarIngredientes"
  );
  const btnCancelarSeleccion = document.getElementById("btnCancelarSeleccion");
  const finishSelection = document.getElementById("finishSelection");
  const btnGuardarReceta = document.getElementById("btnGuardarReceta");
  const btnGenerarOtra = document.getElementById("btnGenerarOtra");
  const btnVolverInicio = document.getElementById("btnVolverInicio");

  if (btnGenerarRapida) {
    btnGenerarRapida.addEventListener("click", () => {
      if (!datosListos) {
        UIManager.mostrarMensaje("Los datos aún se están cargando...", "info");
        return;
      }
      SimuladorRecetas.iniciarRecetaRapida();
    });
  }

  if (btnSeleccionarIngredientes) {
    btnSeleccionarIngredientes.addEventListener("click", () => {
      if (!datosListos) {
        UIManager.mostrarMensaje("Los datos aún se están cargando...", "info");
        return;
      }
      SimuladorRecetas.iniciarSeleccionMultiple();
    });
  }

  if (btnCancelarSeleccion) {
    btnCancelarSeleccion.addEventListener("click", () =>
      SimuladorRecetas.reiniciar()
    );
  }

  if (finishSelection) {
    finishSelection.addEventListener("click", () =>
      SimuladorRecetas.finalizarSeleccion()
    );
  }

  if (btnGuardarReceta) {
    btnGuardarReceta.addEventListener("click", () =>
      SimuladorRecetas.guardarRecetaActual()
    );
  }

  if (btnGenerarOtra) {
    btnGenerarOtra.addEventListener("click", () => {
      if (estado.modoActual === "rapida") {
        SimuladorRecetas.iniciarRecetaRapida();
        setTimeout(() => {
          const recipeResult = document.getElementById("recipeResult");
          if (recipeResult) {
            const headerHeight = document.querySelector(".header").offsetHeight;
            const elementPosition = recipeResult.getBoundingClientRect().top;
            const offsetPosition =
              elementPosition + window.pageYOffset - headerHeight - 20;

            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });
          }
        }, 100);
      } else if (estado.modoActual === "multiple") {
        // Limpiar completamente y empezar de cero
        this.limpiarRecetaAnterior();
        this.reiniciar();

        // Reiniciar modo de selección
        estado.modoActual = "multiple";
        estado.seleccionados = [];

        // Mostrar panel de ingredientes
        document.getElementById("ingredientsPanel").style.display = "block";

        setTimeout(() => {
          UIManager.renderizarIngredientes();
          UIManager.actualizarListaSeleccionados();
          UIManager.actualizarEstadoBotones();
          this.inicializarBuscadorIngredientes();
          this.actualizarContadorSeleccion();
        }, 100);
        setTimeout(() => {
          const ingredientsPanel = document.getElementById("ingredientsPanel");
          if (ingredientsPanel) {
            const headerHeight = document.querySelector(".header").offsetHeight;
            const elementPosition =
              ingredientsPanel.getBoundingClientRect().top;
            const offsetPosition =
              elementPosition + window.pageYOffset - headerHeight - 20;

            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });
          }
        }, 100);
      }
    });
  }

  if (btnVolverInicio) {
    btnVolverInicio.addEventListener("click", () => {
      SimuladorRecetas.reiniciar();
      window.location.href = "../index.html";
    });
  }
});
