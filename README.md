<a name="readme-top"></a>

<div align="center">

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]

<h1>Ingrediente Cero</h1>
<p>Generador Inteligente de Recetas Deliciosas</p>

[![Demo en vivo][demo-shield]][demo-url]
· [Reportar error][issues-url] · [Sugerir algo][issues-url]

</div>

<details>
<summary>Tabla de contenidos</summary>

- [Sobre el Proyecto](#sobre-el-proyecto)
- [Características principales](#características-principales)
  - [Capturas de pantalla](#capturas-de-pantalla)
- [Para empezar](#para-empezar)
  - [Requisitos previos](#requisitos-previos)
  - [Instalación](#instalación)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [🛠️ Stack](#️-stack)

</details>

## Sobre el Proyecto

**Ingrediente Cero** es una aplicación web interactiva que permite a los usuarios generar recetas personalizadas de manera dinámica e inteligente. Combina ingredientes seleccionados por el usuario con métodos de cocción y sabores para crear nombres únicos de recetas completas con instrucciones detalladas.

El proyecto ha evolucionado desde un simple simulador a una aplicación web completa con arquitectura modular, interfaz de usuario moderna y funcionalidades avanzadas como almacenamiento local y historial de recetas.

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

## Características principales

- **Generación de Recetas**: Crea recetas instantáneas o personalizadas con ingredientes seleccionados
- **Base de Datos Extensa**: Acceso a múltiples ingredientes, métodos de cocción y estilos de sabor
- **Recetas Completas**: Genera recetas con utensilios, ingredientes detallados y pasos de preparación
- **Interfaz Moderna**: Diseño responsivo con Flowbite y CSS personalizado
- **Almacenamiento Local**: Guarda tus recetas favoritas y accede al historial
- **Navegación Intuitiva**: Sistema de páginas para generación e historial de recetas

### Capturas de pantalla

![Captura de pantalla principal](./src/images/CP-principal.jpg)
![Captura de pantalla generador](./src/images/CP-generador.jpg)

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

## Para empezar

### Requisitos previos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor local opcional (para desarrollo)

### Instalación

1. Clona el repositorio

   ```sh
   git clone https://github.com/lucasDis/Coderhouse---Javascript.git
   ```

2. Navega al directorio del proyecto

   ```sh
   cd Coderhouse---Javascript
   ```

3. Abre el archivo `index.html` en tu navegador web

   ```sh
   # Opción 1: Doble clic en el archivo index.html
   # Opción 2: Usa un servidor local
   python -m http.server 8000
   # Luego abre http://localhost:8000 en tu navegador
   ```

4. ¡Listo! Comienza a generar recetas deliciosas

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

## Estructura del Proyecto

```
Coderhouse---Javascript/
├── index.html                    # Página principal con landing page
├── README.md                     # Documentación del proyecto
├── css/
│   └── styles.css               # Estilos CSS personalizados
├── js/
│   ├── data.js                  # Base de datos de ingredientes y recetas
│   ├── generator.js             # Lógica principal de generación de recetas
│   ├── history.js               # Gestión de historial de recetas
│   ├── storage.js               # Manejo de almacenamiento local
│   └── ui.js                    # Gestión de interfaz de usuario
├── pages/
│   ├── generar-receta.html      # Página de generación de recetas
│   └── historial.html           # Página de historial de recetas
└── src/
    └── images/
        ├── CP-principal.jpg     # Captura de pantalla principal
        └── CP-generador.jpg     # Captura de pantalla generador de recetas
```

### Módulos Principales

#### **data.js**
- Base de datos extensa de ingredientes (carnes, mariscos, vegetales, frutas, etc.)
- Métodos de cocción disponibles
- Estilos de sabor internacionales
- Recetas completas predefinidas con instrucciones detalladas

#### **generator.js**
- Clase `SimuladorRecetas` con métodos principales
- Generación de recetas rápidas aleatorias
- Generación de recetas personalizadas con selección de ingredientes
- Búsqueda de recetas completas en la base de datos
- Control de flujo y estado de la aplicación

#### **storage.js**
- Sistema de almacenamiento local con localStorage
- Guardado y recuperación de recetas favoritas
- Gestión de historial de recetas generadas
- Persistencia de datos entre sesiones

#### **ui.js**
- Gestión completa de la interfaz de usuario
- Renderizado dinámico de ingredientes
- Manejo de paneles y modales
- Sistema de mensajes y notificaciones
- Actualización de estado de botones y elementos interactivos

#### **history.js**
- Gestión del historial de recetas
- Visualización de recetas guardadas
- Funcionalidades de filtrado y búsqueda
- Eliminación y gestión de recetas almacenadas

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

## 🛠️ Stack

- [![HTML5][html5-badge]][html5-url] - Lenguaje de marcado estándar para la web
- [![JavaScript][javascript-badge]][javascript-url] - Lenguaje de programación para la web
- [![CSS3][css3-badge]][css3-url] - Lenguaje de estilos para la web
- [![Flowbite][flowbite-badge]][flowbite-url] - Biblioteca de componentes UI basada en Tailwind CSS
- [![Google Fonts][fonts-badge]][fonts-url] - Tipografías web de Google

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

<!-- Badges and URLs -->
[contributors-shield]: https://img.shields.io/github/contributors/lucasDis/Coderhouse---Javascript.svg?style=for-the-badge
[contributors-url]: https://github.com/lucasDis/Coderhouse---Javascript/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/lucasDis/Coderhouse---Javascript.svg?style=for-the-badge
[forks-url]: https://github.com/lucasDis/Coderhouse---Javascript/network/members
[stars-shield]: https://img.shields.io/github/stars/lucasDis/Coderhouse---Javascript.svg?style=for-the-badge
[stars-url]: https://github.com/lucasDis/Coderhouse---Javascript/stargazers
[issues-shield]: https://img.shields.io/github/issues/lucasDis/Coderhouse---Javascript.svg?style=for-the-badge
[issues-url]: https://github.com/lucasDis/Coderhouse---Javascript/issues
[demo-shield]: https://img.shields.io/badge/Demo-en%20vivo-brightgreen?style=for-the-badge
[demo-url]: https://lucasdis.github.io/Coderhouse---Javascript/

<!-- Stack Badges -->
[html5-badge]: https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white
[html5-url]: https://developer.mozilla.org/en-US/docs/Glossary/HTML5
[javascript-badge]: https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black
[javascript-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript
[css3-badge]: https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white
[css3-url]: https://developer.mozilla.org/en-US/docs/Web/CSS
[flowbite-badge]: https://img.shields.io/badge/Flowbite-38BDF8?style=for-the-badge&logo=flowbite&logoColor=white
[flowbite-url]: https://flowbite.com/
[fonts-badge]: https://img.shields.io/badge/Google%20Fonts-4285F4?style=for-the-badge&logo=google&logoColor=white
[fonts-url]: https://fonts.google.com/
