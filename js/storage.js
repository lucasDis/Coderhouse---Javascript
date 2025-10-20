// MANEJO DE LOCALSTORAGE
class StorageManager {
  static guardarReceta(receta) {
    let recetas = this.obtenerRecetas();
    receta.id = Date.now();
    receta.fecha = new Date().toLocaleString();
    recetas.push(receta);
    localStorage.setItem("recetas", JSON.stringify(recetas));
  }

  static obtenerRecetas() {
    let recetas = localStorage.getItem("recetas");
    return recetas ? JSON.parse(recetas) : [];
  }

  static limpiarHistorial() {
    localStorage.removeItem("recetas");
  }

  static obtenerRecetasRecientes(limite = 6) {
    const recetas = this.obtenerRecetas();
    return recetas.slice(-limite).reverse();
  }

  // ==========================================
  // SISTEMA DE FAVORITOS
  // ==========================================
  static toggleFavorito(recetaId) {
    let favoritos = this.obtenerFavoritos();
    const index = favoritos.indexOf(recetaId);

    if (index > -1) {
      favoritos.splice(index, 1);
    } else {
      favoritos.push(recetaId);
    }

    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    return index === -1; // Retorna true si se agregó, false si se quitó
  }

  static obtenerFavoritos() {
    let favoritos = localStorage.getItem("favoritos");
    return favoritos ? JSON.parse(favoritos) : [];
  }

  static esFavorito(recetaId) {
    return this.obtenerFavoritos().includes(recetaId);
  }

  // ==========================================
  // SISTEMA DE CALIFICACIÓN
  // ==========================================
  static guardarCalificacion(recetaId, estrellas) {
    let recetas = this.obtenerRecetas();
    const receta = recetas.find((r) => r.id === recetaId);

    if (receta) {
      receta.calificacion = estrellas;
      localStorage.setItem("recetas", JSON.stringify(recetas));
    }
  }

  static obtenerCalificacion(recetaId) {
    let recetas = this.obtenerRecetas();
    const receta = recetas.find((r) => r.id === recetaId);
    return receta ? receta.calificacion || 0 : 0;
  }

  // ==========================================
  // ESTADÍSTICAS
  // ==========================================
  static obtenerEstadisticas() {
    const recetas = this.obtenerRecetas();

    if (recetas.length === 0) {
      return {
        total: 0,
        ingredienteMasUsado: "N/A",
        metodoFavorito: "N/A",
        estiloPreferido: "N/A",
        promedioCalificacion: 0,
      };
    }

    // Contar ingredientes
    const ingredientesCount = {};
    recetas.forEach((r) => {
      const ing = r.ingrediente;
      ingredientesCount[ing] = (ingredientesCount[ing] || 0) + 1;
    });
    const ingredienteMasUsado = Object.keys(ingredientesCount).reduce((a, b) =>
      ingredientesCount[a] > ingredientesCount[b] ? a : b
    );

    // Contar métodos
    const metodosCount = {};
    recetas.forEach((r) => {
      const met = r.tipo;
      metodosCount[met] = (metodosCount[met] || 0) + 1;
    });
    const metodoFavorito = Object.keys(metodosCount).reduce((a, b) =>
      metodosCount[a] > metodosCount[b] ? a : b
    );

    // Contar estilos
    const estilosCount = {};
    recetas.forEach((r) => {
      const est = r.sabor;
      estilosCount[est] = (estilosCount[est] || 0) + 1;
    });
    const estiloPreferido = Object.keys(estilosCount).reduce((a, b) =>
      estilosCount[a] > estilosCount[b] ? a : b
    );

    // Calcular promedio de calificaciones
    const calificaciones = recetas
      .filter((r) => r.calificacion)
      .map((r) => r.calificacion);
    const promedioCalificacion =
      calificaciones.length > 0
        ? (
            calificaciones.reduce((a, b) => a + b, 0) / calificaciones.length
          ).toFixed(1)
        : 0;

    return {
      total: recetas.length,
      ingredienteMasUsado,
      metodoFavorito,
      estiloPreferido,
      promedioCalificacion,
    };
  }

  // ==========================================
  // EXPORT / IMPORT
  // ==========================================
  static exportarRecetas() {
    const recetas = this.obtenerRecetas();
    const favoritos = this.obtenerFavoritos();

    const data = {
      recetas,
      favoritos,
      exportDate: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `recetas-backup-${Date.now()}.json`;
    link.click();

    URL.revokeObjectURL(url);
  }

  // ==========================================
  // ELIMINACIÓN INDIVIDUAL DE RECETAS
  // ==========================================
  static eliminarReceta(recetaId) {
    let recetas = this.obtenerRecetas();
    const indice = recetas.findIndex(r => r.id === recetaId);

    if (indice > -1) {
      // Eliminar la receta del array
      recetas.splice(indice, 1);
      localStorage.setItem("recetas", JSON.stringify(recetas));

      // Eliminar de favoritos si estaba allí
      let favoritos = this.obtenerFavoritos();
      const favIndex = favoritos.indexOf(recetaId);
      if (favIndex > -1) {
        favoritos.splice(favIndex, 1);
        localStorage.setItem("favoritos", JSON.stringify(favoritos));
      }

      return true;
    }

    return false;
  }
