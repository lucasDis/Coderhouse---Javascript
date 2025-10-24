// MANEJO DE LOCALSTORAGE
class StorageManager {
  static guardarReceta(receta) {
    // Guarda una nueva receta en el almacenamiento local
    let recetas = this.obtenerRecetas();

    // Asigna ID y fecha a la receta
    receta.id = Date.now();
    receta.fecha = new Date().toLocaleString();
    recetas.push(receta);

    try {
      // Guarda las recetas en localStorage
      localStorage.setItem("recetas", JSON.stringify(recetas));
    } catch (error) {
      // Maneja errores al guardar la receta
          }
  }

  // ==========================================
  // OBTENCIÓN Y LIMPIEZA DE RECETAS
  // ==========================================

  static obtenerRecetas() {
    // Obtiene todas las recetas del almacenamiento local
    let recetas = localStorage.getItem("recetas");
    return recetas ? JSON.parse(recetas) : [];
  }

  static limpiarHistorial() {
    // Elimina todas las recetas del almacenamiento local
    localStorage.removeItem("recetas");
  }

  static obtenerRecetasRecientes(limite = 6) {
    // Obtiene las recetas más recientes (últimas N recetas)
    const recetas = this.obtenerRecetas();
    return recetas.slice(-limite).reverse();
  }

  // ==========================================
  // SISTEMA DE FAVORITOS
  // ==========================================
  static toggleFavorito(recetaId) {
    // Alterna una receta entre favorita y no favorita
    let favoritos = this.obtenerFavoritos();
    const index = favoritos.indexOf(recetaId);

    if (index > -1) {
      // Quita de favoritos si ya existe
      favoritos.splice(index, 1);
    } else {
      // Agrega a favoritos si no existe
      favoritos.push(recetaId);
    }

    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    return index === -1; // Retorna true si se agregó, false si se quitó
  }

  static obtenerFavoritos() {
    // Obtiene la lista de IDs de recetas favoritas
    let favoritos = localStorage.getItem("favoritos");
    return favoritos ? JSON.parse(favoritos) : [];
  }

  static esFavorito(recetaId) {
    // Verifica si una receta está marcada como favorita
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

    // Crear contenido en formato TXT
    let txtContent = "HISTORIAL DE RECETAS\n";
    txtContent += "==================\n\n";
    txtContent += `Fecha de exportación: ${new Date().toLocaleString('es-ES')}\n\n`;

    txtContent += `Total de recetas: ${recetas.length}\n`;
    txtContent += `Recetas favoritas: ${favoritos.length}\n\n`;
    txtContent += "----------------------------------------\n\n";

    if (recetas.length > 0) {
      txtContent += "RECETAS GUARDADAS:\n\n";

      recetas.forEach((receta, index) => {
        txtContent += `${index + 1}. ${receta.titulo}\n`;
        txtContent += `   Estilo: ${receta.estilo}\n`;
        txtContent += `   Fecha: ${new Date(receta.fecha).toLocaleString('es-ES')}\n`;
        txtContent += `   Ingredientes: ${receta.ingredientes}\n`;
        txtContent += `   Preparación: ${receta.preparacion}\n`;

        // Verificar si es favorita
        const esFavorita = favoritos.some(fav => fav.id === receta.id);
        if (esFavorita) {
          txtContent += "   ⭐ FAVORITA\n";
        }

        txtContent += "\n";
        txtContent += "----------------------------------------\n\n";
      });
    } else {
      txtContent += "No hay recetas guardadas en el historial.\n\n";
    }

    const dataBlob = new Blob([txtContent], { type: "text/plain;charset=utf-8" });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `recetas-historial-${Date.now()}.txt`;
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
}

// Exportar la clase para uso global
window.StorageManager = StorageManager;
