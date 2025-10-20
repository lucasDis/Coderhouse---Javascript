# 🚀 Guía de Despliegue y Control de Caché

## 📋 Problema Resuelto
Antes: La aplicación se quedaba en versiones antiguas al recargar.
Ahora: Sistema automático de detección de versiones con cache busting.

## 🔄 Sistema de Versionamiento Implementado

### 1. **Detección Automática de Cambios**
- Archivo: `js/version.js`
- Versión actual: `2.1.0`
- Compara versiones automáticamente
- Fuerza recarga si detecta cambios

### 2. **Cache Busting con Parámetros**
- Todos los archivos JS/CSS tienen `?v=2.1.0`
- Navegador trata cada versión como archivo nuevo
- No depende de caché del navegador

### 3. **Limpieza Automática de Caché**
- Limpia localStorage conflictivo
- Limpia sessionStorage completamente
- Fuerza recarga completa

## 🛠️ Para Hacer Cambios en el Futuro

### **Desarrollo Local:**
1. **Actualizar versión** en `js/version.js`:
   ```javascript
   window.APP_VERSION = '2.1.1'; // Incrementar
   window.APP_BUILD_DATE = '2024-01-20'; // Actualizar fecha
   ```

2. **Actualizar parámetros** en todos los archivos:
   ```html
   <!-- Reemplazar ?v=2.1.0 por ?v=2.1.1 -->
   <script src="./js/archivo.js?v=2.1.1"></script>
   <link rel="stylesheet" href="./css/styles.css?v=2.1.1">
   ```

3. **Forzar recarga manual** (opcional):
   ```javascript
   // En consola del navegador
   window.forceReload();
   ```

### **Para Producción:**

#### **Paso 1: Actualizar Versión**
```bash
# Actualizar js/version.js
APP_VERSION='2.1.1'
APP_BUILD_DATE=$(date +%Y-%m-%d)
```

#### **Paso 2: Actualizar Parámetros**
- Buscar y reemplazar `?v=2.1.0` → `?v=2.1.1`
- Actualizar en todos los archivos HTML

#### **Paso 3: Subir a Servidor**
```bash
# Subir archivos actualizados
# El servidor limpiará automáticamente cachés viejas
```

## 📁 Estructura de Control de Caché

```
js/
├── version.js          # Sistema de control de versiones
├── data.js?v=2.1.0     # Datos con cache busting
├── storage.js?v=2.1.0   # Sistema de almacenamiento
├── ui.js?v=2.1.0        # Interfaz de usuario
├── libros.js?v=2.1.0    # Gestión de librería
├── carrito.js?v=2.1.0   # Carrito de compras
└── generator.js?v=2.1.0 # Generador de recetas

css/
└── styles.css?v=2.1.0   # Estilos con cache busting

pages/
├── index.html            # Página principal
├── libros.html           # Catálogo de libros
├── carrito.html          # Carrito de compras
└── generar-receta.html   # Generador de recetas
```

## 🛡️ Configuración del Servidor

### **Apache (.htaccess) - INCLUIDO**
- Headers anti-caché para JS/CSS/HTML
- Headers pro-caché para imágenes
- Compresión gzip activada
- Seguridad headers

### **Nginx (server block)**
```nginx
location ~* \.(js|css)$ {
    add_header Cache-Control "no-cache, no-store, must-revalidate";
    add_header Pragma "no-cache";
    add_header Expires "0";
}

location ~* \.(jpg|jpeg|png|gif|ico)$ {
    expires 1y;
    add_header Cache-Control "public";
}
```

### **Node.js (Express)**
```javascript
app.use(express.static('public', {
    setHeaders: (res, path, stat) => {
        if (path.endsWith('.js') || path.endsWith('.css')) {
            res.set({
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            });
        }
    }
}));
```

## 🔍 Verificación del Sistema

### **1. Consola del Navegador**
```javascript
// Verificar versión actual
console.log(window.APP_VERSION); // Debe mostrar "2.1.0"

// Verificar si hay actualización pendiente
localStorage.getItem('app_version'); // Debe coincidir

// Forzar recarga completa
window.forceReload();
```

### **2. Network Tab (DevTools)**
- Abrir DevTools → Network
- Recargar página (Ctrl+Shift+R)
- Verificar que los archivos JS/CSS carguen con `?v=2.1.0`
- No deben mostrar "(from disk cache)"

### **3. Storage Tab (DevTools)**
- Abrir DevTools → Application → Storage
- Verificar `app_version` en LocalStorage
- Debe coincidir con la versión actual

## ⚠️ Problemas Comunes y Soluciones

### **"Aún veo la versión antigua"**
1. **Forzar recarga completa**: `Ctrl+Shift+R` (Windows/Linux) o `Cmd+Shift+R` (Mac)
2. **Limpiar caché manualmente**: F12 → Application → Storage → Clear site data
3. **Usar ventana incógnito**: Para prueba limpia
4. **Ejecutar**: `window.forceReload()` en consola

### **"Los scripts no cargan"**
1. **Verificar rutas**: Los `?v=2.1.0` están en todos los archivos
2. **Revisar consola**: Buscar errores 404
3. **Verificar servidor**: Los archivos existen físicamente

### **"Error de versión"**
1. **Sincronizar versiones**: Todos los archivos deben tener la misma versión
2. **Limpiar localStorage**: `localStorage.clear()`
3. **Recargar página**: `window.location.reload(true)`

## 🚀 Despliegue Automatizado (Opcional)

### **Script para Actualización**
```bash
#!/bin/bash
# update-version.sh

NEW_VERSION="2.1.1"
NEW_DATE=$(date +%Y-%m-%d)

# Actualizar version.js
sed -i "s/window.APP_VERSION = '[^']*'/window.APP_VERSION = '$NEW_VERSION'/" js/version.js
sed -i "s/window.APP_BUILD_DATE = '[^']*'/window.APP_BUILD_DATE = '$NEW_DATE'/" js/version.js

# Actualizar todos los archivos HTML
find . -name "*.html" -exec sed -i "s/\?v=[0-9\.]*/?v=$NEW_VERSION/g" {} +

echo "✅ Versión actualizada a $NEW_VERSION"
echo "📅 Fecha: $NEW_DATE"
```

### **GitHub Actions (para producción)**
```yaml
name: Update Version
on:
  push:
    branches: [main]

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Update version
        run: |
          NEW_VERSION=$(date +%Y.%m.%d)
          sed -i "s/window.APP_VERSION = '[^']*'/window.APP_VERSION = '$NEW_VERSION'/" js/version.js
          find . -name "*.html" -exec sed -i "s/\?v=[0-9\.]*/?v=$NEW_VERSION/g" {} +
      - name: Deploy
        run: echo "Deploy to production server"
```

## ✅ Verificación Final

1. **[ ]** Abrir `index.html` en navegador
2. **[ ]** Verificar consola: "Versión 2.1.0 cargada correctamente"
3. **[ ]** Probar todas las páginas
4. **[ ]** Actualizar versión a 2.1.1
5. **[ ]] Recargar página: debe detectar automáticamente
6. **[ ]** Verificar recarga forzada

## 🎯 Resultado Final

- ✅ **No más caché persistente**
- ✅ **Actualizaciones inmediatas**
- ✅ **Control de versiones automático**
- ✅ **Sistema robusto para producción**
- ✅ **Facil mantenimiento futuro**

**¡El problema de caché está completamente resuelto!** 🎉