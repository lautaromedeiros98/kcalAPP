/**
 * @module App
 * @description Punto de entrada principal de la aplicación.
 * Orquesta la inicialización, maneja eventos del DOM y coordina
 * la comunicación entre el Estado, la Persistencia y la Vista.
 */
import { DOM } from './dom.js';
import { state, addItemToState, updateItemInState, removeItemFromState, resetStateItems, findItem } from './state.js';
import { saveItems, saveTarget, saveSettings } from './storage.js';
import { render, updateMacroTargets, switchView } from './ui/render.js';
import { formatNumber, calculateBMR } from './utils.js';

/**
 * Inicialización de la aplicación.
 * Carga la configuración guardada, inicializa los inputs con valores existentes,
 * renderiza el estado inicial y asigna todos los event listeners.
 */
function init() {
    if (state.settings) {
        DOM.inputs.settingsGender.value = state.settings.gender;
        DOM.inputs.settingsAge.value = state.settings.age;
        DOM.inputs.settingsWeight.value = state.settings.weight;
        DOM.inputs.settingsHeight.value = state.settings.height;
        DOM.inputs.settingsActivity.value = state.settings.activity;
        if (state.settings.goal) DOM.inputs.settingsGoal.value = state.settings.goal;

        const macros = state.settings.macros || { p: 30, c: 40, f: 30 };
        DOM.inputs.macroP.value = macros.p;
        DOM.inputs.macroC.value = macros.c;
        DOM.inputs.macroF.value = macros.f;
        updateMacroTargets(state.dailyTarget, macros);
    }

    render();

    DOM.form.addEventListener('submit', handleSubmit);
    DOM.settingsForm.addEventListener('submit', handleSettingsSubmit);
    DOM.macroForm.addEventListener('submit', handleMacroSubmit);
    DOM.display.listBody.addEventListener('click', handleListClick);
    DOM.buttons.reset.addEventListener('click', handleResetDay);

    DOM.nav.tracker.addEventListener('click', () => switchView('tracker'));
    DOM.nav.settings.addEventListener('click', () => switchView('settings'));

    // Set initial view state from implicit default
    switchView('tracker');
}

/**
 * Maneja el envío del formulario principal (añadir alimento).
 * Extrae datos, valida, actualiza el estado (añadir/editar) y refresca la UI.
 * @param {Event} event - El evento submit del formulario.
 */
function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(DOM.form);
    const rawData = {
        name: formData.get('foodName').trim(),
        servings: parseFloat(formData.get('foodServings')),
        calories: parseFloat(formData.get('foodCalories')),
        category: formData.get('foodCategory'),
        protein: parseFloat(formData.get('foodProtein')) || 0,
        carbs: parseFloat(formData.get('foodCarbs')) || 0,
        fat: parseFloat(formData.get('foodFat')) || 0,
    };

    if (!rawData.name || isNaN(rawData.servings) || isNaN(rawData.calories)) {
        return;
    }

    const itemPayload = {
        ...rawData,
        totalCalories: rawData.calories * rawData.servings,
    };

    if (state.editingId) {
        updateItem(state.editingId, itemPayload);
    } else {
        addItem(itemPayload);
    }

    stopEditing();
    saveItems(state.items);
    render();
}

/**
 * Crea un nuevo objeto de alimento con ID único y lo añade al estado.
 * @param {Object} payload - Datos del alimento (nombre, calorías, macros, etc).
 */
function addItem(payload) {
    const newItem = {
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        ...payload,
    };
    addItemToState(newItem);
}

/**
 * Actualiza un alimento existente por su ID.
 * @param {string} id - UUID del alimento.
 * @param {Object} payload - Nuevos datos a actualizar.
 */
function updateItem(id, payload) {
    updateItemInState(id, payload);
}

/**
 * Inicia el modo edición para un registro específico.
 * - Busca el item en el estado.
 * - Rellena el formulario con sus datos.
 * - Cambia el texto del botón de acción.
 * @param {string} id - UUID del alimento a editar.
 */
function startEditing(id) {
    const item = findItem(id);
    if (!item) return;

    state.editingId = id;

    DOM.inputs.name.value = item.name;
    DOM.inputs.servings.value = item.servings;
    DOM.inputs.calories.value = item.calories;
    DOM.inputs.category.value = item.category;
    DOM.inputs.protein.value = item.protein || '';
    DOM.inputs.carbs.value = item.carbs || '';
    DOM.inputs.fat.value = item.fat || '';

    DOM.buttons.add.textContent = 'Guardar';
    DOM.inputs.name.focus();
}

/**
 * Finaliza el modo edición y resetea el formulario.
 * Devuelve la aplicación al estado de "Añadir nuevo".
 */
function stopEditing() {
    state.editingId = null;
    DOM.form.reset();
    DOM.inputs.servings.value = 1;
    DOM.buttons.add.textContent = 'Añadir';
}

/**
 * Elimina un registro del estado y actualiza la persistencia.
 * @param {string} id - UUID del alimento a eliminar.
 */
function deleteItem(id) {
    removeItemFromState(id);
    if (state.editingId === id) {
        stopEditing();
    }
    saveItems(state.items);
    render();
}

/**
 * Reinicia todos los registros del día actual tras confirmación del usuario.
 */
function handleResetDay() {
    if (!state.items.length) return;
    const confirmReset = window.confirm('¿Deseas eliminar todos los registros del día?');
    if (!confirmReset) return;

    resetStateItems();
    stopEditing();
    saveItems(state.items);
    render();
}

/**
 * Manejador delegado para clics en la lista de alimentos.
 * Detecta si el clic fue en un botón de "Editar" o "Eliminar" y despacha la acción correspondiente.
 * @param {Event} event - Evento click en el cuerpo de la tabla.
 */
function handleListClick(event) {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const row = button.closest('tr');
    const id = row?.dataset?.id;
    if (!id) return;
    const action = button.dataset.action;
    if (action === 'remove') deleteItem(id);
    else if (action === 'edit') startEditing(id);
}

/**
 * Procesa el formulario de configuración de objetivos y BMR.
 * Calcula el BMR (Mifflin-St Jeor) y TDEE basado en los inputs del usuario.
 * @param {Event} event - Evento submit del formulario de ajustes.
 */
function handleSettingsSubmit(event) {
    event.preventDefault();
    const formData = new FormData(DOM.settingsForm);
    const gender = formData.get('gender');
    const age = parseFloat(formData.get('age'));
    const weight = parseFloat(formData.get('weight'));
    const height = parseFloat(formData.get('height'));
    const activity = parseFloat(formData.get('activity'));
    const goal = parseFloat(formData.get('goal')) || 1.0;

    if (isNaN(age) || isNaN(weight) || isNaN(height)) return;

    let bmr = calculateBMR(weight, height, age, gender);
    let tdee = Math.round(bmr * activity);
    tdee = Math.round(tdee * goal);

    // Update state directly. Since 'state' is an object reference, we can mutate its properties.
    state.dailyTarget = tdee;
    // We keep macros if they exist
    state.settings = {
        gender,
        age,
        weight,
        height,
        activity,
        goal,
        macros: state.settings ? state.settings.macros : null
    };

    saveTarget(tdee);
    saveSettings(state.settings);

    DOM.inputs.settingsResult.textContent = `${formatNumber(tdee)} kcal`;
    renderSummary();

    alert(`¡Meta actualizada a ${tdee} kcal según tus datos!`);

    if (state.settings.macros) {
        updateMacroTargets(tdee, state.settings.macros);
    }
}

/**
 * Guarda la distribución porcentual de macronutrientes.
 * Valida que los porcentajes sumen 100%.
 * @param {Event} event - Evento submit del formulario de macros.
 */
function handleMacroSubmit(event) {
    event.preventDefault();
    const formData = new FormData(DOM.macroForm);
    const p = parseFloat(formData.get('protein'));
    const c = parseFloat(formData.get('carbs'));
    const f = parseFloat(formData.get('fat'));

    if ((p + c + f) !== 100) {
        alert('Los porcentajes deben sumar exactamente 100%');
        return;
    }

    const macros = { p, c, f };
    // Merge with existing settings
    state.settings = { ...(state.settings || {}), macros };
    saveSettings(state.settings);

    updateMacroTargets(state.dailyTarget, macros);
    alert('Distribución de macros guardada.');
}

init();
