# Documentación Funcional del Módulo JavaScript (KcalAPP)

Esta documentación describe la arquitectura, módulos y flujos de datos de la lógica de negocio de la aplicación.

## 1. Arquitectura General
La aplicación utiliza una arquitectura modular basada en **ES Modules**.
El flujo de datos sigue principalmente este ciclo:
`Interacción Usuario -> Controlador (App) -> Estado (State) -> Persistencia (Storage) -> Interfaz (UI)`

---

## 2. Descripción de Archivos y Módulos

### 🟢 `js/app.js` (Punto de Entrada)
Es el "cerebro" de la aplicación. No maneja datos directamente ni manipula el DOM manualmente, sino que coordina a los otros módulos.
- **`init()`**: Función de arranque. Carga configuraciones iniciales y configura todos los *Event Listeners*.
- **Manejadores de Eventos**:
  - `handleSubmit`: Procesa el formulario de añadir alimentos.
  - `handleSettingsSubmit`: Calcula el BMR y TDEE basado en los inputs del usuario.
  - `handleMacroSubmit`: Configura la distribución de porcentajes de macros.

### 🟠 `js/state.js` (Estado Global)
Gestiona los datos en memoria. Es la "Fuente de la Verdad".
- **Objeto `state`**:
  ```javascript
  {
    items: [],        // Array de objetos de alimentos registrados
    dailyTarget: 2000,// Meta numérica de calorías
    editingId: null,  // ID del alimento que se está editando (null si no hay edición)
    settings: {}      // Objeto con peso, altura, edad, etc.
  }
  ```
- **Funciones de Accion**: `addItemToState`, `updateItemInState`, `removeItemFromState`. Úsalas siempre para modificar datos.

### 🔵 `js/dom.js` (Referencias DOM)
Un diccionario centralizado de todos los elementos HTML.
- Si necesitas un nuevo botón o input, agrégalo primero aquí.
- **Estructura**: `DOM.inputs`, `DOM.buttons`, `DOM.display`, etc.

### 🟣 `js/ui/render.js` (Renderizado)
Encargado de actualizar la pantalla.
- **`render()`**: Llama a todas las sub-funciones de renderizado.
- **`renderList()`**: Borra y reconstruye la tabla de alimentos basada en `state.items`.
- **`renderSummary()`**: Actualiza los números del Hero y las barras de progreso.

### 🟤 `js/storage.js` (Persistencia)
Capa de abstracción para `localStorage`.
- Si en el futuro quieres cambiar a una Base de Datos real, solo deberías modificar este archivo.
- **Claves usadas**: `kcalapp-items`, `kcalapp-target`, `kcalapp-settings`.

### ⚪ `js/utils.js` (Utilidades)
Funciones puras (matemáticas o de formato) que no dependen del estado de la app.
- `calculateBMR(...)`: Implementación de la fórmula Mifflin-St Jeor.
- `formatNumber(...)`: Formatea números a locale 'es-ES'.

---

## 3. Flujos Comunes (How-To)

### ¿Cómo el sistema procesa un nuevo alimento?
1. El usuario hace click en "Añadir" (`submit` event).
2. **`app.js` -> `handleSubmit`**: Valida los datos del formulario.
3. **`app.js`**: Crea un objeto `newItem` con ID único.
4. **`state.js` -> `addItemToState`**: Agrega el objeto al array en memoria.
5. **`storage.js` -> `saveItems`**: Guarda el nuevo array en LocalStorage.
6. **`ui/render.js` -> `render`**: Actualiza la tabla y los contadores en pantalla.

### ¿Cómo extender la aplicación?
**Ejemplo: Agregar un campo de "Fibra" a los alimentos.**
1. **HTML**: Agregar el input en `index.html`.
2. **DOM**: Agregar la referencia en `js/dom.js` (`inputs.fiber`).
3. **App**: En `handleSubmit`, leer el valor de `DOM.inputs.fiber`.
4. **UI**: En `renderList` (`js/ui/render.js`), agregar una columna `<td>` para mostrar la fibra.
