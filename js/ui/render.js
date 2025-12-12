/**
 * @module UI/Render
 * @description Módulo responsable de actualizar el DOM.
 * Contiene funciones para renderizar listas, tablas y resúmenes 
 * basados en el estado actual de la aplicación.
 */
import { DOM } from '../dom.js';
import { state, getTodayItems } from '../state.js';
import { formatNumber } from '../utils.js';

import { renderWeeklyChart } from './stats.js';

/**
 * Actualiza toda la interfaz de usuario.
 * Llama a las funciones específicas de renderizado para listas y resúmenes.
 */
export function render() {
    renderList();
    renderSummary();
}


/**
 * Renderiza la tabla de alimentos consumidos.
 * - Limpia la tabla actual.
 * - Si no hay datos, muestra un mensaje de "lista vacía".
 * - Si hay datos, genera filas usando un DocumentFragment para mejor rendimiento.
 */
export function renderList() {
    const itemsToRender = getTodayItems();
    DOM.display.listBody.innerHTML = '';

    if (!itemsToRender.length) {
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

    const fragment = document.createDocumentFragment();
    itemsToRender.forEach((item) => {
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

/**
 * Calcula y renderiza el resumen de calorías y macros.
 * - Suma todas las calorías de los items.
 * - Calcula porcentajes para la barra de progreso.
 * - Actualiza los contadores en el "Hero" y panel de resumen.
 */
export function renderSummary() {
    const todayItems = getTodayItems();
    const total = todayItems.reduce((sum, item) => sum + item.totalCalories, 0);
    const remaining = Math.max(state.dailyTarget - total, 0);
    const percentage = Math.min((total / state.dailyTarget) * 100, 100);

    const macros = todayItems.reduce((acc, item) => ({
        p: acc.p + (item.protein * item.servings),
        c: acc.c + (item.carbs * item.servings),
        f: acc.f + (item.fat * item.servings),
    }), { p: 0, c: 0, f: 0 });

    DOM.display.hero.total.textContent = `${formatNumber(total)} kcal`;
    DOM.display.hero.target.textContent = `${state.dailyTarget} kcal`;
    DOM.display.hero.progress.style.width = `${percentage}%`;

    // Obtener objetivos de macros si existen
    const macroTargets = state.settings && state.settings.macros ? {
        p: Math.round((state.dailyTarget * (state.settings.macros.p / 100)) / 4),
        c: Math.round((state.dailyTarget * (state.settings.macros.c / 100)) / 4),
        f: Math.round((state.dailyTarget * (state.settings.macros.f / 100)) / 9)
    } : { p: 0, c: 0, f: 0 };

    // Calcular porcentajes de cumplimiento
    const getPercent = (current, target) => target > 0 ? Math.round((current / target) * 100) : 0;

    // Helper para formatear la salida: "0g / 150g (0%)"
    const formatMacroStats = (current, target) => {
        const percent = getPercent(current, target);
        // Limitamos visualmente al 100% para que no se salga de la barra
        const visualPercent = Math.min(percent, 100);
        return { text: `${formatNumber(current)}g / ${target}g (${percent}%)`, percent: visualPercent };
    };

    const pStats = formatMacroStats(macros.p, macroTargets.p);
    const cStats = formatMacroStats(macros.c, macroTargets.c);
    const fStats = formatMacroStats(macros.f, macroTargets.f);

    DOM.display.hero.protein.textContent = pStats.text;
    DOM.display.hero.progressProtein.style.width = `${pStats.percent}%`;

    DOM.display.hero.carbs.textContent = cStats.text;
    DOM.display.hero.progressCarb.style.width = `${cStats.percent}%`;

    DOM.display.hero.fat.textContent = fStats.text;
    DOM.display.hero.progressFat.style.width = `${fStats.percent}%`;

    DOM.display.summary.total.textContent = `${formatNumber(total)} kcal`;
    DOM.display.summary.remaining.textContent = `${formatNumber(remaining)} kcal`;
}

/**
 * Actualiza las etiquetas de objetivos de macros (g) basado en la meta calórica.
 * Formula: (Calorías * Porcentaje) / kcal_por_gramo
 * @param {number} calories - Meta calórica diaria.
 * @param {Object} macros - Objeto con porcentajes {p, c, f}.
 */
export function updateMacroTargets(calories, macros) {
    const gProtein = Math.round((calories * (macros.p / 100)) / 4);
    const gCarbs = Math.round((calories * (macros.c / 100)) / 4);
    const gFat = Math.round((calories * (macros.f / 100)) / 9);

    DOM.inputs.targetP.textContent = `${gProtein}g`;
    DOM.inputs.targetC.textContent = `${gCarbs}g`;
    DOM.inputs.targetF.textContent = `${gFat}g`;
}

/**
 * Cambia la vista activa de la aplicación (Tracker <-> Ajustes).
 * Gestiona clases CSS para mostrar/ocultar secciones y resaltar la navegación.
 * @param {string} viewName - Nombre de la vista ('tracker' o 'settings').
 */
export function switchView(viewName) {
    // 1. Manejo de botones de navegación (clase .active)
    Object.keys(DOM.nav).forEach(key => {
        const btn = DOM.nav[key];
        if (btn) {
            btn.classList.toggle('active', key === viewName);
        }
    });

    // 2. Manejo de visibilidad de vistas (clase .hidden)
    Object.keys(DOM.views).forEach(key => {
        const view = DOM.views[key];
        if (view) {
            if (key === viewName) {
                view.classList.remove('hidden');
            } else {
                view.classList.add('hidden');
            }
        }
    });

    // 3. Acciones específicas por vista (Hooks)
    if (viewName === 'stats') {
        renderWeeklyChart();
    }
}
