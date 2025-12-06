# 🥗 KcalAPP - Documentación del Proyecto

Bienvenido a la documentación técnica de **KcalAPP**. Esta aplicación es un contador de calorías y macros diseñado con una arquitectura modular en **Vanilla JavaScript**, **CSS3** nativo y **HTML5**.

Esta documentación detalla la estructura de archivos y la función específica de cada componente para facilitar el mantenimiento y la escalabilidad futura.

---

## 📂 Estructura del Proyecto

### 1. Raíz (`/`)
- **`index.html`**:
  - **Función**: Es el "esqueleto" que carga la estructura semántica de la página.
  - **Detalle**: No contiene lógica ni estilos inline. Actúa como contenedor para que el CSS pinte la interfaz y el JS inyecte los datos. Importa `css/main.css` y `js/app.js`.

### 2. Estilos (`/css`)
La capa visual está desacoplada en módulos para facilitar cambios en el diseño sin afectar la estructura.

- **`main.css`**: 
  - Archivo controlador. No contiene estilos propios, solo importa `@import` a los demás módulos en el orden correcto.
- **`base.css`**:
  - Define variables globales (`:root` con colores, fuentes), el reset básico (`box-sizing`) y estilos generales del `body`.
- **`layout.css`**:
  - Maneja la estructura macro: Cuadrículas (`.grid`), el contenedor principal (`.app-shell`), la navegación (`.app-nav`) y la responsividad general.
- **`components.css`**:
  - Estila elementos específicos: Botones, Formularios, Tarjetas (Cards), Tablas y Barras de progreso.

### 3. Lógica (`/js`)
La lógica de negocio sigue una arquitectura unidireccional modular (ES Modules).

#### 🧠 Núcleo
- **`app.js` (Controlador)**:
  - Punto de entrada (`init`).
  - Orquesta la inicialización.
  - Maneja los eventos del usuario (`submit`, `click`) y delega acciones al Estado o la UI.
- **`state.js` (Estado)**:
  - "Fuente de la verdad".
  - Almacena los datos en memoria (`items`, `dailyTarget`, `settings`).
  - Provee funciones para modificar estos datos (`addItemToState`, `updateItemInState`).

#### 🛠 Herramientas
- **`dom.js` (Referencias)**:
  - Diccionario centralizado de selectores `document.getElementById`. Evita tener selectores dispersos por todo el código.
- **`storage.js` (Persistencia)**:
  - Capa de abstracción para `localStorage`.
  - Contiene las claves (`keys`) y funciones `load`/`save`.
- **`utils.js` (Utilidades)**:
  - Funciones puras y agnósticas (matemáticas, formateo de números, cálculos de fórmulas).

#### 🎨 Interfaz (`/js/ui`)
- **`render.js` (Vista)**:
  - Contiene las funciones que manipulan el DOM para reflejar el estado actual.
  - `renderList()`: Dibuja la tabla.
  - `renderSummary()`: Actualiza contadores y gráficas.

---

## 🔄 Flujo de Datos (Ejemplo)

Cuando un usuario agrega una comida:
1. **`index.html`**: El usuario llena el form y da click en "Añadir".
2. **`js/app.js`**: Detecta el evento `submit`. Valida los datos.
3. **`js/state.js`**: Recibe los datos limpios y actualiza el array `items`.
4. **`js/storage.js`**: Guarda el nuevo estado en el navegador.
5. **`js/ui/render.js`**: Borra la lista anterior y dibuja la nueva lista con el item agregado.

---

## 🚀 Guía para Desarrolladores

- **Para cambiar colores**: Edita las variables en `css/base.css`.
- **Para cambiar el cálculo de calorías**: Edita la fórmula en `js/utils.js`.
- **Para agregar una nueva sección visual**: 
  1. Crea el HTML en `index.html`.
  2. Agrega estilos en `css/components.css` o `layout.css`.
  3. Agrega referencias en `js/dom.js`.
  4. Agrega lógica en a `js/app.js` o `js/ui/render.js`.
