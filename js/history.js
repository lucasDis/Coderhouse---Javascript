// FUNCIONES PARA HISTORIAL
function cargarHistorial() {
  UIManager.cargarHistorial();
  actualizarEstadoBotones();
}

// Función para actualizar el estado de los botones exportar y limpiar historial
function actualizarEstadoBotones() {
  const btnExportar = document.getElementById("btnExportar");
  const btnLimpiarHistorial = document.getElementById("btnLimpiarHistorial");
  if (!btnExportar || !btnLimpiarHistorial) return;

  const recetas = StorageManager.obtenerRecetas();
  if (recetas.length === 0) {
    // Deshabilitar botones cuando no hay recetas
    btnExportar.classList.add("btn-export-disabled");
    btnExportar.disabled = true;
    btnExportar.title = "No hay recetas para exportar";

    btnLimpiarHistorial.classList.add("btn-export-disabled");
    btnLimpiarHistorial.disabled = true;
    btnLimpiarHistorial.title = "No hay recetas para limpiar";
  } else {
    // Habilitar botones cuando hay recetas
    btnExportar.classList.remove("btn-export-disabled");
    btnExportar.disabled = false;
    btnExportar.title = "";

    btnLimpiarHistorial.classList.remove("btn-export-disabled");
    btnLimpiarHistorial.disabled = false;
    btnLimpiarHistorial.title = "";
  }
}


function limpiarHistorial() {
  const modal = document.getElementById("recipeModal");
  const modalTitle = document.getElementById("modalRecipeTitle");
  const modalContent = document.getElementById("modalRecipeContent");

  modalTitle.textContent = "Confirmar Eliminación";
  modalContent.innerHTML = `
    <p>¿Estás seguro de que quieres limpiar todo el historial de recetas?</p>
    <p style="color: var(--primary-red); font-weight: 500;">Esta acción no se puede deshacer.</p>
    <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
      <button class="btn-primary" id="btnConfirmarLimpiar" style="background-color: var(--primary-red);">Sí, Eliminar</button>
      <button class="btn-secondary" id="btnCancelarLimpiar">Cancelar</button>
    </div>
  `;

  modal.style.display = "flex";

  setTimeout(() => {
    const btnConfirmarLimpiar = document.getElementById("btnConfirmarLimpiar");
    const btnCancelarLimpiar = document.getElementById("btnCancelarLimpiar");

    if (btnConfirmarLimpiar) {
      btnConfirmarLimpiar.addEventListener("click", confirmarLimpiarHistorial);
    }

    if (btnCancelarLimpiar) {
      btnCancelarLimpiar.addEventListener("click", cerrarModal);
    }
  }, 100);
}

function confirmarLimpiarHistorial() {
  StorageManager.limpiarHistorial();
  UIManager.mostrarMensaje("Historial limpiado exitosamente", "success");
  cerrarModal();

  setTimeout(() => {
    cargarHistorial();
  }, 1000);
}

function cerrarModal() {
  document.getElementById("recipeModal").style.display = "none";
}

// EVENT LISTENERS PARA HISTORIAL
document.addEventListener("DOMContentLoaded", async () => {
  // Cargar datos iniciales
  await cargarDatosIniciales();

  // Botones principales
  const btnNuevaReceta = document.getElementById("btnNuevaReceta");
  const btnLimpiarHistorial = document.getElementById("btnLimpiarHistorial");
  const btnCerrarModal = document.getElementById("btnCerrarModal");
  const btnCerrarModalFooter = document.getElementById("btnCerrarModalFooter");
  const sortBy = document.getElementById("sortBy");
  const filterStyle = document.getElementById("filterStyle");
  const filterSearch = document.getElementById("filterSearch");
  const filterFavorites = document.getElementById("filterFavorites");
  const btnExportar = document.getElementById("btnExportar");
    const btnEstadisticas = document.getElementById("btnEstadisticas");

  
  if (btnNuevaReceta) {
    btnNuevaReceta.addEventListener("click", () => {
      window.location.href = "generar-receta.html";
    });
  }

  if (btnLimpiarHistorial) {
    btnLimpiarHistorial.addEventListener("click", limpiarHistorial);
  }

  if (btnCerrarModal) {
    btnCerrarModal.addEventListener("click", cerrarModal);
  }

  if (btnCerrarModalFooter) {
    btnCerrarModalFooter.addEventListener("click", cerrarModal);
  }

  if (sortBy) {
    sortBy.addEventListener("change", cargarHistorial);
  }

  if (filterStyle) {
    filterStyle.addEventListener("change", cargarHistorial);
  }

  if (filterSearch) {
    filterSearch.addEventListener("input", cargarHistorial);
  }

  if (filterFavorites) {
    filterFavorites.addEventListener("change", cargarHistorial);
  }

  if (btnExportar) {
    btnExportar.addEventListener("click", () => UIManager.exportarRecetas());
  }

  
  if (btnEstadisticas) {
    btnEstadisticas.addEventListener("click", () =>
      UIManager.mostrarEstadisticas()
    );
  }

  
  // Cerrar modal al hacer clic fuera de él
  window.addEventListener("click", (event) => {
    const modal = document.getElementById("recipeModal");
    if (event.target === modal) {
      cerrarModal();
    }
  });

  // Cargar historial inicial
  cargarHistorial();
});
