/**
 * ============================================================================
 * CONFIGURACIÓN Y CONSTANTES
 * ============================================================================
 */
const STORAGE_KEYS = {
  items: 'kcalapp-items',
  target: 'kcalapp-target',
};

/**
 * ============================================================================
 * ELEMENTOS DEL DOM (SELECTORES)
 * ============================================================================
 */
const DOM = {
  form: document.getElementById('foodForm'),
  bmrForm: document.getElementById('bmrForm'), // Nuevo formulario de ajustes
  macroForm: document.getElementById('macroForm'), // Formulario de macros
  inputs: {
    name: document.getElementById('foodName'),
    servings: document.getElementById('foodServings'),
    calories: document.getElementById('foodCalories'),
    category: document.getElementById('foodCategory'),
    protein: document.getElementById('foodProtein'),
    carbs: document.getElementById('foodCarbs'),
    fat: document.getElementById('foodFat'),
    // target: document.getElementById('dailyTarget'), // Eliminado
    // Inputs de Ajustes
    bmrGender: document.getElementById('bmrGender'),
    bmrAge: document.getElementById('bmrAge'),
    bmrWeight: document.getElementById('bmrWeight'),
    bmrHeight: document.getElementById('bmrHeight'),
    bmrActivity: document.getElementById('bmrActivity'),
    bmrGoal: document.getElementById('bmrGoal'),
    bmrResult: document.getElementById('bmrResult'),
    // Inputs de Macros
    macroP: document.getElementById('macroProteinPct'),
    macroC: document.getElementById('macroCarbsPct'),
    macroF: document.getElementById('macroFatPct'),
    targetP: document.getElementById('targetProtein'),
    targetC: document.getElementById('targetCarbs'),
    targetF: document.getElementById('targetFat'),
  },
  buttons: {
    reset: document.getElementById('resetButton'),
    add: document.getElementById('addButton'),
  },
  nav: {
    tracker: document.getElementById('navTracker'),
    settings: document.getElementById('navSettings'),
  },
  views: {
    tracker: document.getElementById('view-tracker'),
    settings: document.getElementById('view-settings'),
  },
  display: {
    listBody: document.getElementById('foodList'),
    rowTemplate: document.getElementById('rowTemplate'),
    hero: {
      total: document.getElementById('heroTotal'),
      target: document.getElementById('heroTarget'),
      progress: document.getElementById('heroProgress'),
      protein: document.getElementById('heroProtein'),
      carbs: document.getElementById('heroCarbs'),
      fat: document.getElementById('heroFat'),
    },
    summary: {
      total: document.getElementById('summaryTotal'),
      remaining: document.getElementById('summaryRemaining'),
    },
  },
};

/**
 * ============================================================================
 * ESTADO DE LA APLICACIÓN
 * ============================================================================
 */
let state = {
  items: loadItems(),      // Lista de alimentos
  dailyTarget: loadTarget(), // Meta de calorías
  editingId: null,         // ID del item en edición (null = modo añadir)
  settings: loadSettings(), // Configuración de usuario (Peso, Altura, etc.)
};

/**
 * ============================================================================
 * INICIALIZACIÓN
 * ============================================================================
 */
function init() {
  // Cargar valores iniciales de ajustes si existen
  if (state.settings) {
    DOM.inputs.bmrGender.value = state.settings.gender;
    DOM.inputs.bmrAge.value = state.settings.age;
    DOM.inputs.bmrWeight.value = state.settings.weight;
    DOM.inputs.bmrHeight.value = state.settings.height;
    DOM.inputs.bmrActivity.value = state.settings.activity;
    if (state.settings.goal) DOM.inputs.bmrGoal.value = state.settings.goal;

    // Cargar macros si existen, o valores por defecto
    const macros = state.settings.macros || { p: 30, c: 40, f: 30 };
    DOM.inputs.macroP.value = macros.p;
    DOM.inputs.macroC.value = macros.c;
    DOM.inputs.macroF.value = macros.f;
    updateMacroTargets(state.dailyTarget, macros);
  }

  // Renderizar estado inicial
  render();

  // Configurar Listeners Globales
  DOM.form.addEventListener('submit', handleSubmit);
  DOM.bmrForm.addEventListener('submit', handleBMRCalculation); // Listener para ajustes
  DOM.macroForm.addEventListener('submit', handleMacroSubmit);
  DOM.display.listBody.addEventListener('click', handleListClick);
  DOM.buttons.reset.addEventListener('click', handleResetDay);

  // Navegación
  DOM.nav.tracker.addEventListener('click', () => switchView('tracker'));
  DOM.nav.settings.addEventListener('click', () => switchView('settings'));
}

init();

/**
 * ============================================================================
 * NAVEGACIÓN
 * ============================================================================
 */
function switchView(viewName) {
  // Actualizar clases de botones
  DOM.nav.tracker.classList.toggle('active', viewName === 'tracker');
  DOM.nav.settings.classList.toggle('active', viewName === 'settings');

  // Mostrar/Ocultar vistas
  if (viewName === 'tracker') {
    DOM.views.tracker.classList.remove('hidden');
    DOM.views.settings.classList.add('hidden');
  } else {
    DOM.views.tracker.classList.add('hidden');
    DOM.views.settings.classList.remove('hidden');
  }
}

/**
 * ============================================================================
 * GRUPO 1: AÑADIR Y GUARDAR (Lógica del Formulario)
 * Funciones encargadas de procesar nuevos registros o actualizaciones.
 * ============================================================================
 */

/**
 * Maneja el envío del formulario. Decide si añade o actualiza.
 */
function handleSubmit(event) {
  event.preventDefault();

  // 1. Extraer datos del formulario
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

  // 2. Validar
  if (!rawData.name || isNaN(rawData.servings) || isNaN(rawData.calories)) {
    return; // Validación simple, podría mostrar error visual
  }

  // 3. Procesar datos (Cálculos)
  const itemPayload = {
    ...rawData,
    totalCalories: rawData.calories * rawData.servings,
  };

  // 4. Decidir acción según el estado
  if (state.editingId) {
    updateItem(state.editingId, itemPayload);
  } else {
    addItem(itemPayload);
  }

  // 5. Finalizar
  stopEditing(); // Limpia el formulario y resetea estado
  saveItems(state.items);
  render();
}

/**
 * Añade un nuevo item a la lista.
 */
function addItem(payload) {
  const newItem = {
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    ...payload,
  };
  // Añadimos al principio del array para que salga arriba en la tabla
  state.items = [newItem, ...state.items];
}

/**
 * Actualiza un item existente.
 */
function updateItem(id, payload) {
  state.items = state.items.map((item) => {
    if (item.id === id) {
      return { ...item, ...payload }; // Mantiene ID y createdAt originales
    }
    return item;
  });
}

/**
 * ============================================================================
 * GRUPO 2: MODO EDICIÓN (Interacción UI)
 * Funciones para preparar la interfaz cuando se quiere editar algo.
 * ============================================================================
 */

/**
 * Activa el modo edición para un item específico.
 * Rellena el formulario y cambia el botón a "Guardar".
 */
function startEditing(id) {
  const item = findItem(id);
  if (!item) return;

  state.editingId = id;

  // Rellenar inputs
  DOM.inputs.name.value = item.name;
  DOM.inputs.servings.value = item.servings;
  DOM.inputs.calories.value = item.calories;
  DOM.inputs.category.value = item.category;
  DOM.inputs.protein.value = item.protein || '';
  DOM.inputs.carbs.value = item.carbs || '';
  DOM.inputs.fat.value = item.fat || '';

  // Cambiar UI
  DOM.buttons.add.textContent = 'Guardar';
  DOM.inputs.name.focus();
}

/**
 * Desactiva el modo edición.
 * Limpia el formulario y restaura el botón a "Añadir".
 */
function stopEditing() {
  state.editingId = null;
  DOM.form.reset();
  DOM.inputs.servings.value = 1;
  DOM.buttons.add.textContent = 'Añadir';
}

/**
 * ============================================================================
 * GRUPO 3: ELIMINAR Y REINICIAR
 * Funciones destructivas para borrar datos.
 * ============================================================================
 */

/**
 * Elimina un item individual por su ID.
 */
function deleteItem(id) {
  state.items = state.items.filter((item) => item.id !== id);

  // Si borramos el item que estábamos editando, salimos del modo edición
  if (state.editingId === id) {
    stopEditing();
  }

  saveItems(state.items);
  render();
}

/**
 * Borra TODOS los items del día.
 */
function handleResetDay() {
  if (!state.items.length) return;

  const confirmReset = window.confirm('¿Deseas eliminar todos los registros del día?');
  if (!confirmReset) return;

  state.items = [];
  stopEditing(); // Asegura que se limpie cualquier edición pendiente
  saveItems(state.items);
  render();
}

/**
 * ============================================================================
 * GRUPO 4: EVENTOS Y CONTROLADORES
 * Dispatchers que conectan la interacción del usuario con la lógica.
 * ============================================================================
 */

/**
 * Router de eventos para la tabla (Delegación de eventos).
 * Detecta si se clickeó "Editar" o "Eliminar".
 */
function handleListClick(event) {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  const row = button.closest('tr');
  const id = row?.dataset?.id;
  if (!id) return;

  const action = button.dataset.action;

  if (action === 'remove') {
    deleteItem(id);
  } else if (action === 'edit') {
    startEditing(id);
  }
}

/**
 * Calcula la meta calórica usando Mifflin-St Jeor
 */
function handleBMRCalculation(event) {
  event.preventDefault();
  const formData = new FormData(DOM.bmrForm);

  const gender = formData.get('gender');
  const age = parseFloat(formData.get('age'));
  const weight = parseFloat(formData.get('weight'));
  const height = parseFloat(formData.get('height'));
  const activity = parseFloat(formData.get('activity'));
  const goal = parseFloat(formData.get('goal')) || 1.0;

  if (isNaN(age) || isNaN(weight) || isNaN(height)) return;

  // Fórmula Mifflin-St Jeor
  // Hombres: (10 × peso) + (6.25 × altura) - (5 × edad) + 5
  // Mujeres: (10 × peso) + (6.25 × altura) - (5 × edad) - 161
  let bmr = (10 * weight) + (6.25 * height) - (5 * age);
  bmr += (gender === 'male') ? 5 : -161;

  // TDEE (Gasto Energético Total Diario)
  let tdee = Math.round(bmr * activity);

  // Ajuste por Objetivo
  tdee = Math.round(tdee * goal);

  // Actualizar Estado
  state.dailyTarget = tdee;
  state.settings = { gender, age, weight, height, activity, goal };

  // Guardar y Actualizar UI
  saveTarget(tdee);
  saveSettings(state.settings);

  DOM.inputs.bmrResult.textContent = `${formatNumber(tdee)} kcal`;
  renderSummary();

  alert(`¡Meta actualizada a ${tdee} kcal según tus datos!`);

  // Actualizar macros también si ya están configurados
  if (state.settings.macros) {
    updateMacroTargets(tdee, state.settings.macros);
  }
}

/**
 * Maneja la configuración de macros
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

  // Guardar en settings
  state.settings = { ...state.settings, macros };
  saveSettings(state.settings);

  // Actualizar UI
  updateMacroTargets(state.dailyTarget, macros);
  alert('Distribución de macros guardada.');
}

function updateMacroTargets(calories, macros) {
  // Proteína y Carbs: 4 kcal/g, Grasa: 9 kcal/g
  const gProtein = Math.round((calories * (macros.p / 100)) / 4);
  const gCarbs = Math.round((calories * (macros.c / 100)) / 4);
  const gFat = Math.round((calories * (macros.f / 100)) / 9);

  DOM.inputs.targetP.textContent = `${gProtein}g`;
  DOM.inputs.targetC.textContent = `${gCarbs}g`;
  DOM.inputs.targetF.textContent = `${gFat}g`;
}

/**
 * ============================================================================
 * GRUPO 5: RENDERIZADO (VISTA)
 * Funciones que actualizan el HTML basado en el estado actual.
 * ============================================================================
 */

function render() {
  renderList();
  renderSummary();
}

function renderList() {
  DOM.display.listBody.innerHTML = '';

  // Caso: Lista vacía
  if (!state.items.length) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 6;
    cell.textContent = 'Aún no registras ningún alimento.';
    cell.style.textAlign = 'center';
    cell.style.color = '#667085';
    row.appendChild(cell);
    DOM.display.listBody.appendChild(row);
    return;
  }

  // Caso: Renderizar items
  const fragment = document.createDocumentFragment();
  state.items.forEach((item) => {
    const clone = DOM.display.rowTemplate.content.cloneNode(true);
    const row = clone.querySelector('tr');

    row.dataset.id = item.id;
    clone.querySelector('.food-name').textContent = item.name;
    clone.querySelector('.food-meta').textContent = `${item.category} • ${formatNumber(item.servings)} porciones`;
    clone.querySelector('.food-protein').textContent = `${formatNumber(item.protein * item.servings)}g`;
    clone.querySelector('.food-carbs').textContent = `${formatNumber(item.carbs * item.servings)}g`;
    clone.querySelector('.food-fat').textContent = `${formatNumber(item.fat * item.servings)}g`;
    clone.querySelector('.food-total').textContent = `${formatNumber(item.totalCalories)} kcal`;

    fragment.appendChild(clone);
  });
  DOM.display.listBody.appendChild(fragment);
}

function renderSummary() {
  // Cálculos Totales
  const total = state.items.reduce((sum, item) => sum + item.totalCalories, 0);
  const remaining = Math.max(state.dailyTarget - total, 0);
  const percentage = Math.min((total / state.dailyTarget) * 100, 100);

  const macros = state.items.reduce((acc, item) => ({
    p: acc.p + (item.protein * item.servings),
    c: acc.c + (item.carbs * item.servings),
    f: acc.f + (item.fat * item.servings),
  }), { p: 0, c: 0, f: 0 });

  // Actualizar DOM
  DOM.display.hero.total.textContent = `${formatNumber(total)} kcal`;
  DOM.display.hero.target.textContent = `${state.dailyTarget} kcal`;
  DOM.display.hero.progress.style.width = `${percentage}%`;

  DOM.display.hero.protein.textContent = `${formatNumber(macros.p)}g`;
  DOM.display.hero.carbs.textContent = `${formatNumber(macros.c)}g`;
  DOM.display.hero.fat.textContent = `${formatNumber(macros.f)}g`;

  DOM.display.summary.total.textContent = `${formatNumber(total)} kcal`;
  DOM.display.summary.remaining.textContent = `${formatNumber(remaining)} kcal`;
}

/**
 * ============================================================================
 * UTILIDADES Y PERSISTENCIA
 * ============================================================================
 */

function findItem(id) {
  return state.items.find((item) => item.id === id);
}

function formatNumber(value) {
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 1,
    maximumFractionDigits: 1,
  }).format(value);
}

// --- LocalStorage ---

function loadItems() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.items);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn('Error cargando items', error);
    return [];
  }
}

function saveItems(items) {
  localStorage.setItem(STORAGE_KEYS.items, JSON.stringify(items));
}

function loadTarget() {
  const stored = localStorage.getItem(STORAGE_KEYS.target);
  return stored ? Number(stored) : 2000;
}

function saveTarget(value) {
  localStorage.setItem(STORAGE_KEYS.target, value);
}

function loadSettings() {
  const stored = localStorage.getItem('kcalapp-settings');
  return stored ? JSON.parse(stored) : null;
}

function saveSettings(value) {
  localStorage.setItem('kcalapp-settings', JSON.stringify(value));
}
