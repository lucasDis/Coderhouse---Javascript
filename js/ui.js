// MANEJO DE UI Y MENSAJES
class UIManager {
  static mostrarPanel(panelId) {
    this.ocultarTodosLosPaneles();
    document.getElementById(panelId).style.display = 'block';
  }

  static ocultarTodosLosPaneles() {
    const paneles = document.querySelectorAll('.panel, .ingredients-panel, .recipe-result');
    paneles.forEach(panel => {
      if (panel.id !== 'ingredientsPanel' && panel.id !== 'recipeResult') {
        panel.style.display = 'none';
      }
    });
  }

  static mostrarMensaje(texto, tipo = 'info') {
    // Crear un toast temporal en lugar de alert
    const toast = document.createElement('div');
    toast.className = `toast toast-${tipo}`;
    toast.textContent = texto;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  static renderizarIngredientes() {
    const contenedor = document.getElementById('ingredientsList');
    contenedor.innerHTML = '';
    
    ingredientes.forEach((ingrediente, index) => {
      const item = document.createElement('div');
      item.className = 'ingredient-item';
      item.textContent = ingrediente;
      item.dataset.index = index;
      item.title = `Haz clic para ${estado.seleccionados.includes(ingrediente) ? 'deseleccionar' : 'seleccionar'} ${ingrediente}`;
      
      if (estado.seleccionados.includes(ingrediente)) {
        item.classList.add('selected');
      }
      
      item.addEventListener('click', () => this.toggleIngrediente(ingrediente, item));
      contenedor.appendChild(item);
    });
    
    this.actualizarListaSeleccionados();
  }

  static toggleIngrediente(ingrediente, elemento) {
    const index = estado.seleccionados.indexOf(ingrediente);
    
    if (index > -1) {
      estado.seleccionados.splice(index, 1);
      elemento.classList.remove('selected');
      elemento.title = `Haz clic para seleccionar ${ingrediente}`;
      this.mostrarMensaje(`${ingrediente} eliminado de la selección`, 'info');
    } else {
      if (estado.seleccionados.length < 5) {
        estado.seleccionados.push(ingrediente);
        elemento.classList.add('selected');
        elemento.title = `Haz clic para deseleccionar ${ingrediente}`;
        this.mostrarMensaje(`${ingrediente} agregado a la selección`, 'success');
        
        elemento.style.transform = 'scale(1.05)';
        setTimeout(() => {
          elemento.style.transform = 'scale(1)';
        }, 200);
      } else {
        this.mostrarMensaje('Máximo 5 ingredientes permitidos. Deselecciona un ingrediente primero.', 'error');
        elemento.style.animation = 'shake 0.5s';
        setTimeout(() => {
          elemento.style.animation = '';
        }, 500);
        return;
      }
    }
    
    this.actualizarListaSeleccionados();
    this.actualizarEstadoBotones();
  }

  static actualizarListaSeleccionados() {
    const lista = document.getElementById('selectedList');
    
    if (estado.seleccionados.length === 0) {
      lista.innerHTML = '<p class="no-selection">No has seleccionado ningún ingrediente aún</p>';
    } else {
      lista.innerHTML = '';
      estado.seleccionados.forEach((ingrediente, index) => {
        const item = document.createElement('div');
        item.className = 'selected-item';
        item.innerHTML = `
          ${ingrediente}
          <span class="selection-counter">${index + 1}</span>
        `;
        item.style.animation = `fadeIn 0.3s ease-in-out ${index * 0.1}s both`;
        lista.appendChild(item);
      });
    }
    
    this.actualizarEstadoBotones();
  }

  static actualizarEstadoBotones() {
    const btnTerminar = document.getElementById('finishSelection');
    
    if (estado.seleccionados.length === 0) {
      btnTerminar.disabled = true;
      btnTerminar.textContent = 'Selecciona al menos un ingrediente';
    } else {
      btnTerminar.disabled = false;
      btnTerminar.textContent = 'Terminar Selección';
    }
    
    if (estado.seleccionados.length === 5) {
      btnTerminar.textContent = '¡Máximo alcanzado! Terminar Selección';
      btnTerminar.style.backgroundColor = 'var(--primary-red)';
    } else {
      btnTerminar.style.backgroundColor = '';
    }
  }

  static mostrarReceta(receta) {
    document.getElementById('recipeTitle').textContent = receta.nombre;
    document.getElementById('recipeStyle').textContent = receta.sabor;
    document.getElementById('recipeMethod').textContent = receta.tipo;
    
    // Mostrar utensilios
    if (receta.utensilios && receta.utensilios.length > 0) {
      document.getElementById('utensilsSection').style.display = 'block';
      document.getElementById('utensilsList').innerHTML = 
        receta.utensilios.map(utensilio => `<li>${utensilio}</li>`).join('');
    } else {
      document.getElementById('utensilsSection').style.display = 'none';
    }
    
    // Mostrar ingredientes
    if (receta.ingredientes && receta.ingredientes.length > 0) {
      document.getElementById('ingredientsSection').style.display = 'block';
      document.getElementById('ingredientsRecipeList').innerHTML = 
        receta.ingredientes.map(ingrediente => `<li>${ingrediente}</li>`).join('');
    } else {
      document.getElementById('ingredientsSection').style.display = 'none';
    }
    
    // Mostrar pasos
    if (receta.pasos && receta.pasos.length > 0) {
      document.getElementById('stepsSection').style.display = 'block';
      document.getElementById('stepsContent').innerHTML = 
        receta.pasos.map(paso => `<p>${paso}</p>`).join('');
    } else {
      document.getElementById('stepsSection').style.display = 'none';
    }
    
    document.getElementById('ingredientsPanel').style.display = 'none';
    document.getElementById('recipeResult').style.display = 'block';
  }

  static crearTarjetaReceta(receta) {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.onclick = () => this.verDetallesReceta(receta);
    
    const iconos = {
      'Pollo': '🍗', 'Carne de Res': '🥩', 'Pescado': '🐟', 'Pasta': '🍝', 'Arroz': '🍚'
    };
    
    const icono = iconos[receta.ingrediente] || '🍽️';
    
    card.innerHTML = `
      <div class="recipe-image">${icono}</div>
      <div class="recipe-info">
        <h3>${receta.nombre}</h3>
        <div class="recipe-meta">
          <span>🎯 ${receta.sabor}</span>
          <span>🔥 ${receta.tipo}</span>
        </div>
      </div>
    `;
    
    return card;
  }

  static verDetallesReceta(receta) {
    document.getElementById('modalRecipeTitle').textContent = receta.nombre;
    
    let contenido = `
      <div class="recipe-info">
        <p><strong>Estilo:</strong> ${receta.sabor}</p>
        <p><strong>Método:</strong> ${receta.tipo}</p>
        <p><strong>Creada:</strong> ${receta.fecha}</p>
      </div>
    `;
    
    if (receta.utensilios && receta.utensilios.length > 0) {
      contenido += `
        <div class="recipe-section">
          <h4>🍽️ Utensilios Necesarios:</h4>
          <ul>
            ${receta.utensilios.map(utensilio => `<li>${utensilio}</li>`).join('')}
          </ul>
        </div>
      `;
    }
    
    if (receta.ingredientes && receta.ingredientes.length > 0) {
      contenido += `
        <div class="recipe-section">
          <h4>🥘 Ingredientes:</h4>
          <ul>
            ${receta.ingredientes.map(ingrediente => `<li>${ingrediente}</li>`).join('')}
          </ul>
        </div>
      `;
    }
    
    if (receta.pasos && receta.pasos.length > 0) {
      contenido += `
        <div class="recipe-section">
          <h4>📝 Pasos de Preparación:</h4>
          <div class="steps-content">
            ${receta.pasos.map(paso => `<p>${paso}</p>`).join('')}
          </div>
        </div>
      `;
    }
    
    document.getElementById('modalRecipeContent').innerHTML = contenido;
    document.getElementById('recipeModal').style.display = 'flex';
  }

  static cargarRecetasRecientes() {
    const contenedor = document.getElementById('recentRecipes');
    const recetas = StorageManager.obtenerRecetasRecientes();
    
    if (recetas.length === 0) {
      contenedor.innerHTML = '<p style="text-align: center; color: var(--text-light);">No hay recetas recientes</p>';
    } else {
      contenedor.innerHTML = '';
      recetas.forEach(receta => {
        contenedor.appendChild(this.crearTarjetaReceta(receta));
      });
    }
  }

  static cargarHistorial() {
    const contenedor = document.getElementById('historyGrid');
    const vacio = document.getElementById('emptyHistory');
    const sortBy = document.getElementById('sortBy').value;
    const filterStyle = document.getElementById('filterStyle').value;
    
    let recetas = StorageManager.obtenerRecetas();
    
    // Filtrar por estilo
    if (filterStyle) {
      recetas = recetas.filter(receta => receta.sabor === filterStyle);
    }
    
    // Ordenar
    recetas.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.nombre.localeCompare(b.nombre);
        case 'style':
          return a.sabor.localeCompare(b.sabor);
        case 'date':
        default:
          return b.id - a.id;
      }
    });
    
    if (recetas.length === 0) {
      contenedor.style.display = 'none';
      vacio.style.display = 'block';
    } else {
      contenedor.style.display = 'grid';
      vacio.style.display = 'none';
      contenedor.innerHTML = '';
      recetas.forEach(receta => {
        contenedor.appendChild(this.crearTarjetaReceta(receta));
      });
    }
  }
}

// ESTADO GLOBAL
const estado = {
  seleccionados: [],
  recetaActual: null,
  modoActual: null
};
