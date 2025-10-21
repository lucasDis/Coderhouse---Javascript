// DATOS GLOBALES - SE CARGARÁN DESDE JSON
let ingredientes = [];
let metodos = [];
let sabores = [];
let recetasCompletas = {};

// FUNCIÓN PARA CARGAR DATOS DESDE JSON
async function cargarDatosIniciales() {
  try {
    // Cargar ingredientes
    const respIngredientes = await fetch("../data/ingredientes.json");
    ingredientes = await respIngredientes.json();

    // Cargar métodos
    const respMetodos = await fetch("../data/metodos.json");
    metodos = await respMetodos.json();

    // Cargar sabores
    const respSabores = await fetch("../data/sabores.json");
    sabores = await respSabores.json();

    // Cargar recetas completas
    const respRecetas = await fetch("../data/recetas-completas.json");
    recetasCompletas = await respRecetas.json();

    return true;
  } catch (error) {
    // Mostrar mensaje al usuario
    if (typeof UIManager !== "undefined") {
      UIManager.mostrarMensaje(
        "Error al cargar los datos. Por favor, recarga la página.",
        "error"
      );
    }
    return false;
  }
}
