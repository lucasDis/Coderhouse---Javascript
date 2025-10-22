// FUNCIONES PARA HISTORIAL
function cargarHistorial() {
  UIManager.cargarHistorial();
  actualizarEstadoBotones();
}

// Función para actualizar el estado de los botones exportar y limpiar historial
function actualizarEstadoBotones() {
  const btnExportar = document.getElementById("btnExportar");
  const btnLimpiarHistorial = document.getElementById("btnLimpiarHistorial");
  const btnEstadisticas = document.getElementById("btnEstadisticas");

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

    // También deshabilitar estadísticas
    if (btnEstadisticas) {
      btnEstadisticas.classList.add("btn-export-disabled");
      btnEstadisticas.disabled = true;
      btnEstadisticas.title = "No hay recetas para ver estadísticas";
    }
  } else {
    // Habilitar botones cuando hay recetas
    btnExportar.classList.remove("btn-export-disabled");
    btnExportar.disabled = false;
    btnExportar.title = "";

    btnLimpiarHistorial.classList.remove("btn-export-disabled");
    btnLimpiarHistorial.disabled = false;
    btnLimpiarHistorial.title = "";

    // También habilitar estadísticas
    if (btnEstadisticas) {
      btnEstadisticas.classList.remove("btn-export-disabled");
      btnEstadisticas.disabled = false;
      btnEstadisticas.title = "";
    }
  }
}


function limpiarHistorial() {
  Swal.fire({
    title: 'Confirmar Eliminación',
    html: `
      <p>¿Estás seguro de que quieres limpiar todo el historial de recetas?</p>
      <p style="color: var(--primary-red); font-weight: 500;">Esta acción no se puede deshacer.</p>
    `,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, Eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#F44336',
    cancelButtonColor: '#6b7280',
    customClass: {
      popup: 'historial-confirm-popup'
    }
  }).then((result) => {
    if (result.isConfirmed) {
      StorageManager.limpiarHistorial();
      cargarHistorial();
      UIManager.mostrarMensaje("Historial limpiado correctamente", "success");
    }
  });
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
    btnCerrarModal.addEventListener("click", () => {
      const modal = document.getElementById("recipeModal");
      if (modal) {
        modal.style.display = "none";
      }
    });
  }

  if (btnCerrarModalFooter) {
    btnCerrarModalFooter.addEventListener("click", () => {
      const modal = document.getElementById("recipeModal");
      if (modal) {
        modal.style.display = "none";
      }
    });
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
