# Documentación Técnica y Estado del Proyecto

Este documento ofrece una visión general de la arquitectura, el flujo de datos y el estado actual de **KcalAPP**.

---

## 1. Arquitectura del Sistema
La aplicación sigue una arquitectura **MVC (Modelo-Vista-Controlador)** adaptada al frontend con Vanilla JS Modular.

### 🧠 Núcleo (Lógica y Estado)
*   **`js/app.js` (Controlador Principal)**:
    *   **Función**: Orquestador central.
    *   **Responsabilidad**: Inicializa la app (`init`), maneja eventos del DOM (`submit`, `click`), coordina validaciones y decide cuándo actualizar el estado o la vista.
*   **`js/state.js` (Modelo State)**:
    *   **Función**: Fuente de la Verdad (Single Source of Truth).
    *   **Responsabilidad**: Mantiene los datos en memoria (`items`, `dailyTarget`).
    *   **Novedad**: Implementa lógica temporal (`getItemsByDate`, `getTodayItems`) para filtrar el historial.
*   **`js/storage.js` (Persistencia)**:
    *   **Función**: Capa de abstracción de Datos.
    *   **Responsabilidad**: Guarda y carga JSON desde `localStorage`.

### 🎨 Interfaz (Vista y UI)
*   **`js/ui/render.js` (Renderizado)**:
    *   **Función**: Pintor del DOM.
    *   **Responsabilidad**: Transforma datos en HTML. Dibuja la tabla de comidas y actualiza las barras de progreso del Hero.
    *   **Novedad**: Gestión de navegación (`switchView`) escalable y dinámica.
*   **`js/ui/stats.js` (Módulo Gráfico)**:
    *   **Función**: Visualización de Datos.
    *   **Stack**: CSS Grid/Flexbox puro (Zero Dependencies).
    *   **Responsabilidad**: Genera el gráfico de barras del historial semanal con indicadores de color (semáforo) según cumplimiento de metas.
*   **`js/ui/toast.js` (Feedback)**:
    *   **Función**: Sistema de Notificaciones.
    *   **Responsabilidad**: Muestra alertas flotantes no intrusivas (`success`, `warning`, `info`) para mejorar la UX.

### 📚 Utilidades y Referencias
*   **`js/dom.js`**: Diccionario centralizado de selectores ID. Desacopla el JS de cambios en el HTML.
*   **`js/utils.js`**: Funciones puras (formato de números, cálculo BMR).

### 💅 Estilos (CSS Modular)
*   **`layout.css`**: Define la estructura y el nuevo **Sticky Bottom Nav** para móviles.
*   **`components.css`**: Estilos de UI (Cards, Inputs, Botones y Toasts).
*   **`base.css`**: Variables globales y reset.

---

## 2. Diagrama de Flujo de Datos
**Ejemplo: Usuario Añade un Alimento**

1.  **Input**: Usuario llena formulario -> Click "Añadir".
2.  **`app.js`**:
    *   Captura evento `submit`.
    *   **Validación**: Verifica campos vacíos y coherencia de Macros vs Calorías (Warning via Toast).
3.  **`state.js`**: Recibe objeto, añade `id` y `timestamp`, lo guarda en array `items`.
4.  **`storage.js`**: Persiste el nuevo estado en navegador.
5.  **`render.js`**:
    *   Solicita `getTodayItems()` (filtra solo hoy).
    *   Re-renderiza tabla y contadores.
6.  **`toast.js`**: Feedback visual "Guardado con éxito".

---

## 3. Estado Actual del Proyecto (Status Report)

### ✅ Completado (Done)
*   **Core Tracker**: Registro, edición (con botón cancelar) y eliminación de alimentos.
*   **Gestión del Tiempo**: El tracker se reinicia visualmente cada día, pero guarda el historial.
*   **Experiencia de Usuario (UI/UX)**:
    *   Navegación móvil nativa (Barra inferior).
    *   Feedback inmediato con Toasts.
    *   Validaciones de entrada.
*   **Estadísticas**: Vista dedicada con gráfico semanal funcional.
*   **Arquitectura**: Refactorización del renderizado para soportar múltiples vistas fácilmente.
*   **Preparación Futura**: Definición de Schemas JSON para el módulo de Entrenamiento.

### 🚧 En Progreso (In Progress)
*   **Módulo de Entrenamiento**:
    *   Estructura de carpetas creada (`js/training`).
    *   Schemas definidos.
    *   *Falta*: Implementar UI de Rutinas y lógica de registro.

### 📅 Pendiente (Next Steps)
1.  **Planificación (Fase 1.5)**: Implementar "Meal Prep" para días futuros.
2.  **Entrenamiento (Fase 2)**: Construir el tracker de ejercicios.
3.  **Cloud (Fase 3)**: Migrar de LocalStorage a Base de Datos real.

---

**Versión**: 0.2.0 (Alpha - Feature Rich)
**Fecha**: 12/12/2025
**Tecnología**: 100% Vanilla JS (Sin Frameworks, Sin Build Tools).
