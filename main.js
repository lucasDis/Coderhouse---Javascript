// Arrays con los ingredientes, metodos de coccion y sabores disponibles
const ingredientesPrincipales = [
  "Pollo",
  "Carne de Res",
  "Pescado",
  "Cerdo",
  "Camarones",
  "Vegetales Mixtos",
  "Pasta",
  "Arroz",
];

const metodosCoccion = [
  "al Horno",
  "a la Parrilla",
  "Salteado",
  "Guisado",
  "al Vapor",
  "Frito",
];

const sabores = [
  "Mediterraneo",
  "Asiatico",
  "Mexicano",
  "Italiano",
  "Casero",
  "Gourmet",
  "Picante",
  "Dulce",
];

// Funcion para generar la receta basada en la seleccion del usuario
function generarReceta() {
  // Mostrar las opciones de ingredientes principales al usuario
  let mensaje = "Elige un ingrediente principal:\n\n";

  // Usar ciclo for para mostrar todas las opciones
  for (let i = 0; i < ingredientesPrincipales.length; i++) {
    mensaje += `${i + 1}. ${ingredientesPrincipales[i]}\n`;
  }

  // Pedir al usuario que elija una opcion
  let eleccion = prompt(mensaje + "\nEscribe el numero de tu eleccion:");

  // Convertir la eleccion a numero y validar
  let indiceEleccion = parseInt(eleccion) - 1;

  // Condicional if/else para validar la eleccion y generar el nombre de la receta
  if (indiceEleccion >= 0 && indiceEleccion < ingredientesPrincipales.length) {
    // Generar elementos aleatorios para hacer la receta mas interesante
    let ingredienteElegido = ingredientesPrincipales[indiceEleccion];
    let metodoAleatorio =
      metodosCoccion[Math.floor(Math.random() * metodosCoccion.length)];
    let saborAleatorio = sabores[Math.floor(Math.random() * sabores.length)];

    // Crear el nombre dinamico de la receta
    let nombreReceta = `Receta de ${ingredienteElegido} ${metodoAleatorio} Estilo ${saborAleatorio}`;

    // Llamar a la funcion para mostrar la receta
    mostrarReceta(nombreReceta);
  } else {
    // Mostrar mensaje de error si la opcion no es valida
    alert("Error: Por favor, elige un numero valido de la lista.");

    // Preguntar si quiere intentar de nuevo
    let intentarDeNuevo = confirm("¿Quieres intentar de nuevo?");
    if (intentarDeNuevo) {
      generarReceta();
    }
  }
}

// Funcion para mostrar la receta generada
function mostrarReceta(nombreReceta) {
  // Crear un mensaje completo con la receta
  let mensajeReceta =
    `!Tu receta ha sido generada!` +
    `=¡ ${nombreReceta}\n\n` +
    `¡Disfruta cocinando tu nueva receta!`;

  // Mostrar la receta usando alert
  alert(mensajeReceta);

  // Preguntar si quiere generar otra receta
  let generarOtra = confirm("¿Quieres generar otra receta?");
  if (generarOtra) {
    iniciarSimulador();
  } else {
    alert("¡Gracias por usar el Simulador de Generador de Recetas!");
  }
}

// Funcion principal que inicia el simulador
function iniciarSimulador() {
  alert(
    "¡Bienvenido al Simulador de Generador de Recetas!\n\n" +
      "Te ayudara a crear recetas unicas basadas en tus preferencias."
  );

  generarReceta();
}

// Iniciar el programa
let simuladorActivo = false;

document.getElementById("toggleSimulador").addEventListener("click", () => {
    if (!simuladorActivo) {
        simuladorActivo = true;
        iniciarSimulador();
    } else {
        simuladorActivo = false;
        alert("El simulador ha sido detenido.");
    }
});
