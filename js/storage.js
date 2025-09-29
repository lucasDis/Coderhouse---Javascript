// MANEJO DE LOCALSTORAGE
class StorageManager {
  static guardarReceta(receta) {
    let recetas = this.obtenerRecetas();
    receta.id = Date.now();
    receta.fecha = new Date().toLocaleString();
    recetas.push(receta);
    localStorage.setItem('recetas', JSON.stringify(recetas));
  }

  static obtenerRecetas() {
    let recetas = localStorage.getItem('recetas');
    return recetas ? JSON.parse(recetas) : [];
  }

  static limpiarHistorial() {
    localStorage.removeItem('recetas');
  }

  static obtenerRecetasRecientes(limite = 6) {
    const recetas = this.obtenerRecetas();
    return recetas.slice(-limite).reverse();
  }
}
