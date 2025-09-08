// DATOS BASE
const ingredientes = [
  "Pollo", "Carne de Res", "Pescado", "Cerdo", 
  "Camarones", "Vegetales", "Pasta", "Arroz"
];

const metodos = [
  "al Horno", "a la Parrilla", "Salteado", 
  "Guisado", "al Vapor", "Frito"
];

const sabores = [
  "Mediterráneo", "Asiático", "Mexicano", "Italiano", 
  "Casero", "Gourmet", "Picante", "Dulce"
];

// GENERAR RECETA SIMPLE
function generarReceta() {
  let mensaje = "Elige un ingrediente:\n\n";
  
  for (let i = 0; i < ingredientes.length; i++) {
    mensaje += `${i + 1}. ${ingredientes[i]}\n`;
  }
  
  let eleccion = prompt(mensaje + "\nEscribe el número:");
  
  if (eleccion === null || eleccion.trim() === "") {
    alert("Debes seleccionar un ingrediente!");
    generarReceta();
    return;
  }
  
  let numero = parseInt(eleccion) - 1;
  
  if (numero >= 0 && numero < ingredientes.length) {
    let ingrediente = ingredientes[numero];
    let metodo = metodos[Math.floor(Math.random() * metodos.length)];
    let sabor = sabores[Math.floor(Math.random() * sabores.length)];
    let receta = `${ingrediente} ${metodo} Estilo ${sabor}`;
    
    mostrarReceta(receta);
  } else {
    alert("Número inválido. Intenta de nuevo.");
    generarReceta();
  }
}

// MOSTRAR RESULTADO
function mostrarReceta(receta) {
  console.log("Receta generada:", receta);
  alert("¡Tu receta!\n\n" + receta + "\n\n¡A cocinar!");
  
  if (confirm("¿Otra receta?")) {
    generarReceta();
  }
}

// SELECCIONAR VARIOS INGREDIENTES
function seleccionarVarios() {
  let seleccionados = [];
  let continuar = true;
  
  while (continuar && seleccionados.length < 3) {
    let mensaje = "Seleccionados: " + seleccionados.join(", ") + "\n\n";
    
    for (let i = 0; i < ingredientes.length; i++) {
      mensaje += `${i + 1}. ${ingredientes[i]}\n`;
    }
    
    let eleccion = prompt(mensaje + "\nNúmero (0 para terminar):");
    
    if (eleccion === "0") {
      if (seleccionados.length === 0) {
        alert("Debes agregar al menos un ingrediente!");
        continue;
      }
      continuar = false;
    } else if (eleccion === null || eleccion.trim() === "") {
      if (seleccionados.length === 0) {
        alert("Debes agregar al menos un ingrediente!");
        continue;
      }
      continuar = false;
    } else {
      let numero = parseInt(eleccion) - 1;
      if (numero >= 0 && numero < ingredientes.length) {
        let ingrediente = ingredientes[numero];
        if (!seleccionados.includes(ingrediente)) {
          seleccionados.push(ingrediente);
          alert(ingrediente + " agregado!");
        } else {
          alert("Ya lo seleccionaste!");
        }
      }
    }
  }
  
  if (seleccionados.length > 0) {
    alert("Ingredientes: " + seleccionados.join(", "));
  }
}

// CONTROL PRINCIPAL
let activo = false;

document.getElementById("toggleSimulador").addEventListener("click", () => {
  if (!activo) {
    activo = true;
    let opcion = prompt("¿Qué quieres?\n1. Receta rápida\n2. Seleccionar varios");
    
    if (opcion === null || opcion.trim() === "") {
      activo = false;
      return;
    }
    
    if (opcion === "1") {
      generarReceta();
    } else if (opcion === "2") {
      seleccionarVarios();
    } else {
      alert("Opción inválida");
    }
    
    activo = false;
  }
});