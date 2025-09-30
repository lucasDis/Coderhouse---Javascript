// ==========================================
// MÉTODOS PRINCIPALES DE GENERACIÓN DE RECETAS
// ==========================================
class SimuladorRecetas {
  
  static generarRecetaRapida() {
    const ingrediente = ingredientes[Math.floor(Math.random() * ingredientes.length)];
    const metodo = metodos[Math.floor(Math.random() * metodos.length)];
    const sabor = sabores[Math.floor(Math.random() * sabores.length)];
    
    const recetaCompleta = this.buscarRecetaCompleta(ingrediente, metodo, sabor);
    
    if (recetaCompleta) {
      return {
        nombre: recetaCompleta.nombre,
        ingrediente: ingrediente,
        tipo: metodo,
        sabor: sabor,
        utensilios: recetaCompleta.utensilios,
        ingredientes: recetaCompleta.ingredientes,
        pasos: recetaCompleta.pasos
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
        `Sirve caliente, decorado con hierbas frescas o un chorrito de limón si lo deseas.`
      ]
    };
  }

  static generarRecetaMultiple() {
    if (estado.seleccionados.length === 0) {
      UIManager.mostrarMensaje('Debes seleccionar al menos un ingrediente para crear una receta', 'error');
      return null;
    }

    const ingredientePrincipal = estado.seleccionados[Math.floor(Math.random() * estado.seleccionados.length)];
    const metodo = metodos[Math.floor(Math.random() * metodos.length)];
    const sabor = sabores[Math.floor(Math.random() * sabores.length)];
    
    const recetaCompleta = this.buscarRecetaCompleta(ingredientePrincipal, metodo, sabor);
    
    let nombre = '';
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
        const otrosIngredientes = estado.seleccionados.filter(ing => ing !== ingredientePrincipal);
        nombre = `${ingredientePrincipal} ${metodo} con ${otrosIngredientes.slice(0, 2).join(' y ')} Estilo ${sabor}`;
      }
      
      utensilios = ["Sartén grande", "Cuchillo", "Tabla de cortar", "Espátula"];
      ingredientes = [...estado.seleccionados.slice(0, 4), "Sal", "Pimienta", "Aceite de oliva", "Ajo"];
      pasos = [
        `Comienza preparando todos tus ingredientes. Lava y pica el ${ingredientePrincipal} en trozos del tamaño de un bocado.`,
        `Calienta una sartén grande a fuego medio y añade una generosa cantidad de aceite de oliva.`,
        `Añade el ${ingredientePrincipal} a la sartén y cocina durante unos 5 minutos, removiendo ocasionalmente.`,
        `Añade los ingredientes seleccionados restantes uno por uno, permitiendo que cada uno se cocine durante un minuto antes de añadir el siguiente.`,
        `Sazona todo con sal, pimienta y ajo picado. Remueve bien para combinar todos los sabores.`,
        `Continúa cocinando ${metodo.toLowerCase()} hasta que todos los ingredientes estén tiernos y bien combinados.`,
        `Retira del fuego y sirve inmediatamente mientras está caliente. Decora con hierbas frescas si están disponibles.`
      ];
    }
    
    return {
      nombre: nombre,
      ingrediente: ingredientePrincipal,
      tipo: metodo,
      sabor: sabor,
      ingredientesExtra: estado.seleccionados.filter(ing => ing !== ingredientePrincipal),
      utensilios: utensilios,
      ingredientes: ingredientes,
      pasos: pasos
    };
  }

  // ==========================================
  // MÉTODOS AUXILIARES Y DE BÚSQUEDA
  // ==========================================
  
  static buscarRecetaCompleta(ingrediente, metodo, sabor) {
    if (recetasCompletas[ingrediente]) {
      const recetasPosibles = recetasCompletas[ingrediente];
      
      let recetaExacta = recetasPosibles.find(r => 
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
    estado.modoActual = 'rapida';
    const receta = this.generarRecetaRapida();
    estado.recetaActual = receta;
    UIManager.mostrarReceta(receta);
  }

  static iniciarSeleccionMultiple() {
    estado.modoActual = 'multiple';
    estado.seleccionados = [];
    
    document.getElementById('ingredientsPanel').style.display = 'block';
    
    setTimeout(() => {
      UIManager.renderizarIngredientes();
      UIManager.actualizarEstadoBotones();
    }, 100);
    
    setTimeout(() => {
      UIManager.mostrarMensaje('¡Comienza a seleccionar tus ingredientes!', 'info');
    }, 500);
  }

  static finalizarSeleccion() {
    if (estado.seleccionados.length === 0) {
      UIManager.mostrarMensaje('Debes seleccionar al menos un ingrediente para crear una receta', 'error');
      return;
    }

    UIManager.mostrarMensaje('Generando tu receta personalizada...', 'info');
    
    setTimeout(() => {
      const receta = this.generarRecetaMultiple();
      if (receta) {
        estado.recetaActual = receta;
        UIManager.mostrarReceta(receta);
        
        setTimeout(() => {
          UIManager.mostrarMensaje('¡Receta generada exitosamente!', 'success');
        }, 500);
      }
    }, 1000);
  }

  static guardarRecetaActual() {
    if (estado.recetaActual) {
      StorageManager.guardarReceta(estado.recetaActual);
      UIManager.mostrarMensaje('Receta guardada exitosamente', 'success');
      
      setTimeout(() => {
      }, 2000);
    }
  }

  static reiniciar() {
    estado.seleccionados = [];
    estado.recetaActual = null;
    estado.modoActual = null;
    UIManager.ocultarTodosLosPaneles();
  }
}

// ==========================================
// EVENT LISTENERS PARA GENERAR RECETA
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
  // Botones principales
  const btnGenerarRapida = document.getElementById('btnGenerarRapida');
  const btnSeleccionarIngredientes = document.getElementById('btnSeleccionarIngredientes');
  const btnCancelarSeleccion = document.getElementById('btnCancelarSeleccion');
  const finishSelection = document.getElementById('finishSelection');
  const btnGuardarReceta = document.getElementById('btnGuardarReceta');
  const btnGenerarOtra = document.getElementById('btnGenerarOtra');
  const btnVolverInicio = document.getElementById('btnVolverInicio');

  if (btnGenerarRapida) {
    btnGenerarRapida.addEventListener('click', () => SimuladorRecetas.iniciarRecetaRapida());
  }

  if (btnSeleccionarIngredientes) {
    btnSeleccionarIngredientes.addEventListener('click', () => SimuladorRecetas.iniciarSeleccionMultiple());
  }

  if (btnCancelarSeleccion) {
    btnCancelarSeleccion.addEventListener('click', () => SimuladorRecetas.reiniciar());
  }

  if (finishSelection) {
    finishSelection.addEventListener('click', () => SimuladorRecetas.finalizarSeleccion());
  }

  if (btnGuardarReceta) {
    btnGuardarReceta.addEventListener('click', () => SimuladorRecetas.guardarRecetaActual());
  }

  if (btnGenerarOtra) {
    btnGenerarOtra.addEventListener('click', () => {
      if (estado.modoActual === 'rapida') {
        SimuladorRecetas.iniciarRecetaRapida();
        // Scroll automático hacia el título
        setTimeout(() => {
          const recipeResult = document.getElementById('recipeResult');
          if (recipeResult) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const elementPosition = recipeResult.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 100);
      } else if (estado.modoActual === 'multiple') {
        estado.seleccionados = [];
        UIManager.renderizarIngredientes();
        UIManager.actualizarListaSeleccionados();
        document.getElementById('recipeResult').style.display = 'none';
        document.getElementById('ingredientsPanel').style.display = 'block';
        setTimeout(() => {
          const ingredientsPanel = document.getElementById('ingredientsPanel');
          if (ingredientsPanel) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const elementPosition = ingredientsPanel.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 100);
      }
    });
  }

  if (btnVolverInicio) {
    btnVolverInicio.addEventListener('click', () => {
      SimuladorRecetas.reiniciar();
      window.location.href = '../index.html';
    });
  }
});
