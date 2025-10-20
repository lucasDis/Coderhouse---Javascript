// MANEJO DE UI Y MENSAJES
class UIManager {
  static mostrarPanel(panelId) {
    this.ocultarTodosLosPaneles();
    document.getElementById(panelId).style.display = "block";
  }

  static ocultarTodosLosPaneles() {
    const paneles = document.querySelectorAll(
      ".panel, .ingredients-panel, .recipe-result"
    );
    paneles.forEach((panel) => {
      if (panel.id !== "ingredientsPanel" && panel.id !== "recipeResult") {
        panel.style.display = "none";
      }
    });
  }

  static mostrarMensaje(texto, tipo = "info") {
    // Sistema de notificaciones con SweetAlert2
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    });

    const iconMap = {
      success: 'success',
      error: 'error',
      warning: 'warning',
      info: 'info'
    };

    Toast.fire({
      icon: iconMap[tipo] || 'info',
      title: texto
    });
  }

  static mostrarAlerta(titulo, mensaje, tipo = 'info', callback = null) {
    Swal.fire({
      title: titulo,
      text: mensaje,
      icon: tipo,
      confirmButtonText: 'Entendido',
      confirmButtonColor: tipo === 'success' ? '#10b981' : tipo === 'error' ? '#ef4444' : tipo === 'warning' ? '#f59e0b' : '#3b82f6',
      background: '#ffffff'
    }).then((result) => {
      if (callback) callback(result.isConfirmed);
    });
  }

  static mostrarConfirmacion(titulo, mensaje, onConfirmar, onCancelar = null) {
    Swal.fire({
      title: titulo,
      text: mensaje,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      background: '#ffffff'
    }).then((result) => {
      if (result.isConfirmed) {
        if (onConfirmar) onConfirmar();
      } else if (result.dismiss === Swal.DismissReason.cancel && onCancelar) {
        onCancelar();
      }
    });
  }

  static renderizarIngredientes() {
    const contenedor = document.getElementById("ingredientsList");
    contenedor.innerHTML = "";

    ingredientes.forEach((ingrediente, index) => {
      const item = document.createElement("div");
      item.className = "ingredient-item";
      item.textContent = ingrediente;
      item.dataset.index = index;
      item.title = `Haz clic para ${
        estado.seleccionados.includes(ingrediente)
          ? "deseleccionar"
          : "seleccionar"
      } ${ingrediente}`;

      if (estado.seleccionados.includes(ingrediente)) {
        item.classList.add("selected");
      }

      item.addEventListener("click", () =>
        this.toggleIngrediente(ingrediente, item)
      );
      contenedor.appendChild(item);
    });

    this.actualizarListaSeleccionados();
  }

  static toggleIngrediente(ingrediente, elemento) {
    const index = estado.seleccionados.indexOf(ingrediente);

    if (index > -1) {
      estado.seleccionados.splice(index, 1);
      elemento.classList.remove("selected");
      elemento.title = `Haz clic para seleccionar ${ingrediente}`;
      this.mostrarMensaje(`${ingrediente} eliminado de la selección`, "info");
    } else {
      if (estado.seleccionados.length < 5) {
        estado.seleccionados.push(ingrediente);
        elemento.classList.add("selected");
        elemento.title = `Haz clic para deseleccionar ${ingrediente}`;
        this.mostrarMensaje(
          `${ingrediente} agregado a la selección`,
          "success"
        );

        elemento.style.transform = "scale(1.05)";
        setTimeout(() => {
          elemento.style.transform = "scale(1)";
        }, 200);
      } else {
        this.mostrarMensaje(
          "Máximo 5 ingredientes permitidos. Deselecciona un ingrediente primero.",
          "error"
        );
        elemento.style.animation = "shake 0.5s";
        setTimeout(() => {
          elemento.style.animation = "";
        }, 500);
        return;
      }
    }

    this.actualizarListaSeleccionados();
    this.actualizarEstadoBotones();
  }

  static actualizarListaSeleccionados() {
    const lista = document.getElementById("selectedList");

    if (estado.seleccionados.length === 0) {
      lista.innerHTML =
        '<p class="no-selection">No has seleccionado ningún ingrediente aún</p>';
    } else {
      lista.innerHTML = "";
      estado.seleccionados.forEach((ingrediente, index) => {
        const item = document.createElement("div");
        item.className = "selected-item";
        item.innerHTML = `
          ${ingrediente}
          <div class="selected-item-actions">
            <span class="selection-counter">${index + 1}</span>
            <button class="btn-remove-selected" data-ingredient="${ingrediente}" title="Eliminar ${ingrediente}">
              ✕
            </button>
          </div>
        `;
        item.style.animation = `fadeIn 0.3s ease-in-out ${index * 0.1}s both`;
        lista.appendChild(item);

        // Agregar event listener para el botón de eliminar
        const btnRemove = item.querySelector('.btn-remove-selected');
        btnRemove.addEventListener('click', () => {
          this.eliminarIngredienteSeleccionado(ingrediente);
        });
      });
    }

    this.actualizarEstadoBotones();
  }

  static eliminarIngredienteSeleccionado(ingrediente) {
    const index = estado.seleccionados.indexOf(ingrediente);
    if (index > -1) {
      estado.seleccionados.splice(index, 1);

      // Actualizar UI
      this.renderizarIngredientes();
      this.actualizarListaSeleccionados();
      this.actualizarEstadoBotones();

      // Actualizar contador si existe
      if (typeof SimuladorRecetas !== 'undefined' && SimuladorRecetas.actualizarContadorSeleccion) {
        SimuladorRecetas.actualizarContadorSeleccion();
      }

      this.mostrarMensaje(`${ingrediente} eliminado de la selección`, "info");
    }
  }

  static actualizarEstadoBotones() {
    const btnTerminar = document.getElementById("finishSelection");

    if (estado.seleccionados.length === 0) {
      btnTerminar.disabled = true;
      btnTerminar.textContent = "Selecciona al menos un ingrediente";
    } else {
      btnTerminar.disabled = false;
      btnTerminar.textContent = "Terminar Selección";
    }

    if (estado.seleccionados.length === 5) {
      btnTerminar.style.backgroundColor = "var(--primary-red)";
    } else {
      btnTerminar.style.backgroundColor = "";
    }
  }

  static mostrarReceta(receta) {
    document.getElementById("recipeTitle").textContent = receta.nombre;
    document.getElementById("recipeStyle").textContent = receta.sabor;
    document.getElementById("recipeMethod").textContent = receta.tipo;

    // Mostrar utensilios
    if (receta.utensilios && receta.utensilios.length > 0) {
      document.getElementById("utensilsSection").style.display = "block";
      document.getElementById("utensilsList").innerHTML = receta.utensilios
        .map((utensilio) => `<li>${utensilio}</li>`)
        .join("");
    } else {
      document.getElementById("utensilsSection").style.display = "none";
    }

    // Mostrar ingredientes
    if (receta.ingredientes && receta.ingredientes.length > 0) {
      document.getElementById("ingredientsSection").style.display = "block";
      document.getElementById("ingredientsRecipeList").innerHTML =
        receta.ingredientes
          .map((ingrediente) => `<li>${ingrediente}</li>`)
          .join("");
    } else {
      document.getElementById("ingredientsSection").style.display = "none";
    }

    // Mostrar pasos
    if (receta.pasos && receta.pasos.length > 0) {
      document.getElementById("stepsSection").style.display = "block";
      document.getElementById("stepsContent").innerHTML = receta.pasos
        .map((paso) => `<p>${paso}</p>`)
        .join("");
    } else {
      document.getElementById("stepsSection").style.display = "none";
    }

    document.getElementById("ingredientsPanel").style.display = "none";
    document.getElementById("recipeResult").style.display = "block";
  }

  static crearTarjetaReceta(receta) {
    const card = document.createElement("div");
    card.className = "recipe-card";

    const iconos = {
      Pollo: "🍗",
      "Carne de Res": "🥩",
      Pescado: "🐟",
      Pasta: "🍝",
      Arroz: "🍚",
    };

    const icono = iconos[receta.ingrediente] || "🍽️";
    const esFavorito = StorageManager.esFavorito(receta.id);
    const calificacion = StorageManager.obtenerCalificacion(receta.id);

    card.innerHTML = `
      <div class="recipe-image">${icono}</div>
      <div class="recipe-info">
        <div class="recipe-header-card">
          <h3>${receta.nombre}</h3>
          <div class="recipe-actions">
            <button class="btn-favorito ${
              esFavorito ? "active" : ""
            }" data-recipe-id="${receta.id}" title="Agregar a favoritos">
              ${esFavorito ? "★" : "☆"}
            </button>
            <button class="btn-eliminar-receta" data-recipe-id="${receta.id}" data-recipe-name="${receta.nombre}" title="Eliminar receta">
              🗑️
            </button>
          </div>
        </div>
        <div class="recipe-meta">
          <span>🎯 ${receta.sabor}</span>
          <span>🔥 ${receta.tipo}</span>
        </div>
        ${this.crearEstrellas(receta.id, calificacion)}
      </div>
    `;

    // Click en la tarjeta para ver detalles
    card.querySelector(".recipe-image").onclick = () =>
      this.verDetallesReceta(receta);
    card.querySelector("h3").onclick = () => this.verDetallesReceta(receta);

    // Click en favorito
    const btnFav = card.querySelector(".btn-favorito");
    btnFav.onclick = (e) => {
      e.stopPropagation();
      const agregado = StorageManager.toggleFavorito(receta.id);
      btnFav.classList.toggle("active");
      btnFav.textContent = agregado ? "★" : "☆";
      this.mostrarMensaje(
        agregado ? "Agregado a favoritos" : "Eliminado de favoritos",
        "success"
      );
    };

    // Click en eliminar
    const btnEliminar = card.querySelector(".btn-eliminar-receta");
    btnEliminar.onclick = (e) => {
      e.stopPropagation();
      this.eliminarRecetaIndividual(receta.id, receta.nombre);
    };

    // Click en estrellas
    const stars = card.querySelectorAll(".star");
    stars.forEach((star) => {
      star.onclick = (e) => {
        e.stopPropagation();
        const value = parseInt(star.dataset.value);
        StorageManager.guardarCalificacion(receta.id, value);
        this.actualizarEstrellas(receta.id, value);
        this.mostrarMensaje(
          `Calificación: ${value} estrella${value > 1 ? "s" : ""}`,
          "success"
        );
      };
    });

    return card;
  }

  static crearEstrellas(recetaId, calificacionActual = 0) {
    let html = '<div class="rating-stars" data-recipe-id="' + recetaId + '">';

    for (let i = 1; i <= 5; i++) {
      const filled = i <= calificacionActual ? "filled" : "";
      html += `<span class="star ${filled}" data-value="${i}">★</span>`;
    }

    html += "</div>";
    return html;
  }

  static actualizarEstrellas(recetaId, estrellas) {
    const ratingContainer = document.querySelector(
      `.rating-stars[data-recipe-id="${recetaId}"]`
    );
    if (ratingContainer) {
      const stars = ratingContainer.querySelectorAll(".star");
      stars.forEach((star, index) => {
        if (index < estrellas) {
          star.classList.add("filled");
        } else {
          star.classList.remove("filled");
        }
      });
    }
  }

  static verDetallesReceta(receta) {
    const esFavorito = StorageManager.esFavorito(receta.id);
    const calificacion = StorageManager.obtenerCalificacion(receta.id);

    document.getElementById("modalRecipeTitle").innerHTML = `
      ${receta.nombre}
      <button class="btn-favorito-modal ${
        esFavorito ? "active" : ""
      }" data-recipe-id="${receta.id}">
        ${esFavorito ? "★ Favorito" : "☆ Agregar a Favoritos"}
      </button>
    `;

    let contenido = `
      <div class="recipe-info">
        <p><strong>Estilo:</strong> ${receta.sabor}</p>
        <p><strong>Método:</strong> ${receta.tipo}</p>
        <p><strong>Creada:</strong> ${receta.fecha}</p>
        <div class="recipe-rating-modal">
          <strong>Tu calificación:</strong>
          ${this.crearEstrellas(receta.id, calificacion)}
        </div>
      </div>
    `;

    if (receta.utensilios && receta.utensilios.length > 0) {
      contenido += `
        <div class="recipe-section">
          <h4>🍽️ Utensilios Necesarios:</h4>
          <ul>
            ${receta.utensilios
              .map((utensilio) => `<li>${utensilio}</li>`)
              .join("")}
          </ul>
        </div>
      `;
    }

    if (receta.ingredientes && receta.ingredientes.length > 0) {
      contenido += `
        <div class="recipe-section">
          <h4>🥘 Ingredientes:</h4>
          <ul>
            ${receta.ingredientes
              .map((ingrediente) => `<li>${ingrediente}</li>`)
              .join("")}
          </ul>
        </div>
      `;
    }

    if (receta.pasos && receta.pasos.length > 0) {
      contenido += `
        <div class="recipe-section">
          <h4>📝 Pasos de Preparación:</h4>
          <div class="steps-content">
            ${receta.pasos
              .map(
                (paso, index) =>
                  `<p><strong>Paso ${index + 1}:</strong> ${paso}</p>`
              )
              .join("")}
          </div>
        </div>
      `;
    }

    document.getElementById("modalRecipeContent").innerHTML = contenido;
    document.getElementById("recipeModal").style.display = "flex";

    // Event listeners para el modal
    setTimeout(() => {
      // Favorito en modal
      const btnFavModal = document.querySelector(".btn-favorito-modal");
      if (btnFavModal) {
        btnFavModal.onclick = () => {
          const agregado = StorageManager.toggleFavorito(receta.id);
          btnFavModal.classList.toggle("active");
          btnFavModal.textContent = agregado
            ? "★ Favorito"
            : "☆ Agregar a Favoritos";
          this.mostrarMensaje(
            agregado ? "Agregado a favoritos" : "Eliminado de favoritos",
            "success"
          );

          // Actualizar la vista si estamos en historial
          if (window.location.href.includes("historial.html")) {
            setTimeout(() => cargarHistorial(), 500);
          }
        };
      }

      // Estrellas en modal
      const stars = document.querySelectorAll("#modalRecipeContent .star");
      stars.forEach((star) => {
        star.onclick = () => {
          const value = parseInt(star.dataset.value);
          StorageManager.guardarCalificacion(receta.id, value);
          this.actualizarEstrellas(receta.id, value);
          this.mostrarMensaje(
            `Calificación: ${value} estrella${value > 1 ? "s" : ""}`,
            "success"
          );
        };
      });
    }, 100);

    if (receta.ingredientes && receta.ingredientes.length > 0) {
      contenido += `
        <div class="recipe-section">
          <h4>🥘 Ingredientes:</h4>
          <ul>
            ${receta.ingredientes
              .map((ingrediente) => `<li>${ingrediente}</li>`)
              .join("")}
          </ul>
        </div>
      `;
    }

    if (receta.pasos && receta.pasos.length > 0) {
      contenido += `
        <div class="recipe-section">
          <h4>📝 Pasos de Preparación:</h4>
          <div class="steps-content">
            ${receta.pasos.map((paso) => `<p>${paso}</p>`).join("")}
          </div>
        </div>
      `;
    }

    document.getElementById("modalRecipeContent").innerHTML = contenido;
    document.getElementById("recipeModal").style.display = "flex";
  }

  static cargarRecetasRecientes() {
    const contenedor = document.getElementById("recentRecipes");
    const recetas = StorageManager.obtenerRecetasRecientes();

    if (recetas.length === 0) {
      contenedor.innerHTML =
        '<p style="text-align: center; color: var(--text-light);">No hay recetas recientes</p>';
    } else {
      contenedor.innerHTML = "";
      recetas.forEach((receta) => {
        contenedor.appendChild(this.crearTarjetaReceta(receta));
      });
    }
  }

  static cargarHistorial() {
    const contenedor = document.getElementById("historyGrid");
    const vacio = document.getElementById("emptyHistory");
    const sortBy = document.getElementById("sortBy").value;
    const filterStyle = document.getElementById("filterStyle").value;
    const filterSearch = document.getElementById("filterSearch")
      ? document.getElementById("filterSearch").value.toLowerCase()
      : "";
    const filterFavorites = document.getElementById("filterFavorites")
      ? document.getElementById("filterFavorites").checked
      : false;

    let recetas = StorageManager.obtenerRecetas();

    // Filtrar por búsqueda
    if (filterSearch) {
      recetas = recetas.filter(
        (receta) =>
          receta.nombre.toLowerCase().includes(filterSearch) ||
          receta.ingrediente.toLowerCase().includes(filterSearch)
      );
    }

    // Filtrar por estilo
    if (filterStyle) {
      recetas = recetas.filter((receta) => receta.sabor === filterStyle);
    }

    // Filtrar por favoritos
    if (filterFavorites) {
      const favoritos = StorageManager.obtenerFavoritos();
      recetas = recetas.filter((receta) => favoritos.includes(receta.id));
    }

    // Ordenar
    recetas.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.nombre.localeCompare(b.nombre);
        case "style":
          return a.sabor.localeCompare(b.sabor);
        case "rating":
          const ratingA = StorageManager.obtenerCalificacion(a.id) || 0;
          const ratingB = StorageManager.obtenerCalificacion(b.id) || 0;
          return ratingB - ratingA;
        case "date":
        default:
          return b.id - a.id;
      }
    });

    // Actualizar contador
    const contador = document.getElementById("recipeCount");
    if (contador) {
      contador.textContent = `${recetas.length} receta${
        recetas.length !== 1 ? "s" : ""
      } encontrada${recetas.length !== 1 ? "s" : ""}`;
    }

    if (recetas.length === 0) {
      contenedor.style.display = "none";
      vacio.style.display = "block";
    } else {
      contenedor.style.display = "grid";
      vacio.style.display = "none";
      contenedor.innerHTML = "";
      recetas.forEach((receta) => {
        contenedor.appendChild(this.crearTarjetaReceta(receta));
      });
    }
  }

  static mostrarEstadisticas() {
    const stats = StorageManager.obtenerEstadisticas();

    const modal = document.getElementById("recipeModal");
    const modalTitle = document.getElementById("modalRecipeTitle");
    const modalContent = document.getElementById("modalRecipeContent");

    modalTitle.textContent = "📊 Estadísticas de Recetas";
    modalContent.innerHTML = `
      <div class="stats-container">
        <div class="stat-card">
          <div class="stat-icon">📚</div>
          <div class="stat-value">${stats.total}</div>
          <div class="stat-label">Recetas Totales</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">🥘</div>
          <div class="stat-value">${stats.ingredienteMasUsado}</div>
          <div class="stat-label">Ingrediente Más Usado</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">🔥</div>
          <div class="stat-value">${stats.metodoFavorito}</div>
          <div class="stat-label">Método Favorito</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">🎯</div>
          <div class="stat-value">${stats.estiloPreferido}</div>
          <div class="stat-label">Estilo Preferido</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">⭐</div>
          <div class="stat-value">${stats.promedioCalificacion}</div>
          <div class="stat-label">Calificación Promedio</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">❤️</div>
          <div class="stat-value">${
            StorageManager.obtenerFavoritos().length
          }</div>
          <div class="stat-label">Recetas Favoritas</div>
        </div>
      </div>
    `;

    modal.style.display = "flex";
  }

  static async exportarRecetas() {
    try {
      StorageManager.exportarRecetas();
      this.mostrarMensaje("Recetas exportadas exitosamente", "success");
    } catch (error) {
      this.mostrarMensaje("Error al exportar recetas", "error");
    }
  }

  static eliminarRecetaIndividual(recetaId, nombreReceta) {
    this.mostrarConfirmacion(
      'Confirmar Eliminación',
      `¿Estás seguro de que quieres eliminar la receta "${nombreReceta}"?\n\nEsta acción no se puede deshacer.`,
      () => this.confirmarEliminarRecetaIndividual(recetaId)
    );
  }

  static confirmarEliminarRecetaIndividual(recetaId) {
    const eliminada = StorageManager.eliminarReceta(recetaId);

    if (eliminada) {
      this.mostrarMensaje("Receta eliminada exitosamente", "success");
      this.cerrarModal();

      // Recargar historial si estamos en esa página
      if (window.location.href.includes("historial.html")) {
        setTimeout(() => cargarHistorial(), 500);
      }

      // Actualizar estado de los botones
      setTimeout(() => {
        if (typeof actualizarEstadoBotones === 'function') {
          actualizarEstadoBotones();
        }
      }, 600);
    } else {
      this.mostrarMensaje("Error al eliminar la receta", "error");
    }
  }

  static cerrarModal() {
    document.getElementById("recipeModal").style.display = "none";
  }
}

// ESTADO GLOBAL
const estado = {
  seleccionados: [],
  recetaActual: null,
  modoActual: null,
};
