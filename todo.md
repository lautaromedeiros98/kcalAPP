# Backlog de Producto - KcalAPP MVP

Este documento desglosa el trabajo pendiente en Épicas, Historias de Usuario y Subtareas técnicas, basado en el código actual (`js/app.js`, `js/state.js`, etc.).

## 🟢 Épica 1: Consolidación del Núcleo de Nutrición (Prioridad Alta)
**Objetivo**: Pulir la experiencia de usuario del Tracker actual antes de agregar complejidad. Resolver deudas técnicas de edición y validación.

### Historia 1.1: Edición Robusta de Alimentos
> Como usuario, quiero corregir un alimento mal ingresado sin tener que borrarlo y crearlo de nuevo.
- [x] **Subtarea (JS)**: Revisar `handleSubmit` en `app.js`. Asegurar que cuando `state.editingId` existe, se llame a `updateItem` y NO se genere un nuevo ID.
- [x] **Subtarea (UI)**: Agregar botón "Cancelar" visible solo durante la edición (junto a "Guardar") para limpiar el formulario sin guardar cambios.
- [x] **Subtarea (UX)**: Hacer scroll automático hacia el formulario cuando el usuario hace clic en "Editar" en la tabla (`window.scrollTo`).

### Historia 1.2: Validaciones y Feedback (Toast)
> Como usuario, quiero confirmación visual de mis acciones y prevención de errores obvios.
- [x] **Subtarea (CSS)**: Crear estilos para notificaciones "Toast" en `css/components.css` (clase `.toast` con animación de entrada/salida).
- [x] **Subtarea (JS)**: Crear módulo `js/ui/toast.js` con función `showToast(message, type)`.
- [x] **Subtarea (JS)**: Implementar validación en `app.js`: impedir que los gramos de macros (P+C+G * 4 o 9) superen las calorías totales por un margen absurdo.

## 🟡 Épica 2: Estadísticas y Visualización (El valor agregado)
**Objetivo**: Ofrecer una visión de progreso semanal, no solo diaria.

### Historia 2.1: Estructura de Datos Temporal
> Como sistema, necesito distinguir entre lo que comí hoy, ayer y lo que planeo comer mañana.
- [x] **Subtarea (State)**: Refactorizar `state.js`. Actualmente `items` es una lista plana. Necesitamos funciones selectoras: `getItemsByDate(date)`.
- [x] **Subtarea (App)**: Modificar la carga inicial en `app.js` para que la Tabla solo renderice los items de "Hoy" (`new Date().toDateString()`).

### Historia 2.2: Panel de Estadísticas Semanales
> Como usuario, quiero ver mi adherencia a la dieta en los últimos 7 días.
- [x] **Subtarea (HTML)**: Crear sección `view-stats` en `index.html` con un contenedor `<canvas id="weeklyChart">`.
- [x] **Subtarea (JS)**: Integrar **Chart.js** (vía CDN) o implementar una gráfica de barras CSS pura si queremos mantener "Zero Dependencies".
- [x] **Subtarea (Logic)**: Crear `js/stats.js` que agrege las calorías de `state.items` agrupadas por los últimos 7 días.

## 🔵 Épica 3: Cimientos de Planificación y Entreno (Preparación)
**Objetivo**: Preparar el terreno para las Fases 2 y 3 sin romper lo actual.

### Historia 3.1: Navegación Escalable (Sticky Bottom Nav)
> Como usuario, quiero moverme entre Tracker, Stats, Planificación y Ajustes fácilmente.
- [x] **Subtarea (UI)**: Convertir la `<nav class="app-nav">` actual en una barra de navegación inferior fija para móvil (Sticky Bottom Nav).
- [x] **Subtarea (JS)**: Refactorizar la lógica `switchView` en `ui/render.js` para que sea genérica y maneje clases `.active` dinámicamente.

### Historia 3.2: Modelo de Datos de Entrenamiento
> Como desarrollador, quiero definir cómo se guardarán las rutinas antes de escribir la UI.
- [x] **Subtarea (Docs)**: Definir JSON Schema final en `spec.md` para: `Routine`, `WorkoutSession`, `ExerciseLog`.
- [x] **Subtarea (Archi)**: Crear estructura de carpetas `js/training/` y archivos placeholder.

## 🔴 Bugs y Deuda Técnica (Tech Debt)
- [ ] **Bug**: Revisar suma de decimales en `utils.js`. `0.1 + 0.2 !== 0.3`. Usar `Math.round((a + b) * 100) / 100`.
- [ ] **Bug**: Al recargar la página, si estamos en vista "Ajustes", a veces vuelve a Tracker pero el botón activo sigue en Ajustes. Sincronizar estado inicial en `init()`.