# Simulador de Generador de Recetas

## Descripción

El Simulador de Generador de Recetas es una aplicación web interactiva que permite a los usuarios crear recetas personalizadas de manera dinámica. El simulador combina ingredientes principales seleccionados por el usuario con métodos de cocción y sabores generados aleatoriamente para crear nombres únicos de recetas.

Esta aplicación está diseñada como un proyecto base que crecerá en el futuro, con una estructura limpia y escalable que facilite futuras expansiones.

## Cómo Ejecutar el Proyecto

1. Descarga o clona todos los archivos del proyecto en una carpeta local
2. Abre el archivo `index.html` en cualquier navegador web moderno
3. El simulador se iniciará automáticamente y te guiará a través del proceso con cuadros de diálogo
4. Sigue las instrucciones que aparecen en pantalla para generar tu receta personalizada

## Estructura Actual del Proyecto

### Archivos Principales

- **index.html**: Estructura HTML5 básica con descripción del simulador y enlace al archivo JavaScript
- **main.js**: Lógica principal del simulador con todas las funciones de generación de recetas
- **README.md**: Documentación del proyecto

### Componentes de JavaScript

#### Arrays de Datos:
- `ingredientesPrincipales`: Lista de 8 ingredientes principales disponibles
- `metodosCoccion`: Lista de 6 métodos de cocción diferentes
- `sabores`: Lista de 8 estilos de sabor variados

#### Funciones Principales:
- `generarReceta()`: Maneja la selección del usuario y genera el nombre de la receta
- `mostrarReceta()`: Presenta la receta final al usuario de forma clara
- `iniciarSimulador()`: Función principal que inicia la aplicación

## Evolución Futura del Proyecto

### Expansiones Planificadas:

1. **Integración con DOM**: 
   - Interfaz gráfica más rica con formularios web
   - Visualización de recetas en la página sin depender de cuadros de diálogo
   - Botones interactivos y elementos visuales

2. **Objetos y Clases**:
   - Implementación de clases `Receta`, `Ingrediente` y `Usuario`
   - Sistema de objetos más complejo para manejar datos de recetas
   - Métodos avanzados para la generación y personalización

3. **Almacenamiento Local**:
   - Guardar recetas favoritas del usuario
   - Historial de recetas generadas
   - Preferencias personalizadas

4. **Funcionalidades Avanzadas**:
   - Sistema de filtros por tipo de dieta (vegetariana, sin gluten, etc.)
   - Tiempos de cocción y dificultad estimados
   - Ingredientes adicionales y cantidades sugeridas
   - Sistema de calificaciones y comentarios

5. **APIs y Servicios Externos**:
   - Integración con APIs de recetas reales
   - Información nutricional automática
   - Imágenes de ingredientes y platos finales

## Notas Técnicas

- El proyecto utiliza JavaScript vanilla sin frameworks externos
- Compatible con todos los navegadores modernos
- Código bien comentado y estructurado para facilitar el mantenimiento
- Preparado para futuras implementaciones de programación orientada a objetos
- Diseño escalable que permite agregar nuevas funcionalidades sin reestructurar el código base

## Contribuciones

Este proyecto está diseñado para crecer y evolucionar. Las futuras contribuciones pueden incluir mejoras en la interfaz de usuario, nuevas funcionalidades de generación de recetas, y integración con tecnologías web modernas.
