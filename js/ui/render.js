import { DOM } from '../dom.js';
import { state } from '../state.js';
import { formatNumber } from '../utils.js';

export function render() {
    renderList();
    renderSummary();
}

export function renderList() {
    DOM.display.listBody.innerHTML = '';

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

export function renderSummary() {
    const total = state.items.reduce((sum, item) => sum + item.totalCalories, 0);
    const remaining = Math.max(state.dailyTarget - total, 0);
    const percentage = Math.min((total / state.dailyTarget) * 100, 100);

    const macros = state.items.reduce((acc, item) => ({
        p: acc.p + (item.protein * item.servings),
        c: acc.c + (item.carbs * item.servings),
        f: acc.f + (item.fat * item.servings),
    }), { p: 0, c: 0, f: 0 });

    DOM.display.hero.total.textContent = `${formatNumber(total)} kcal`;
    DOM.display.hero.target.textContent = `${state.dailyTarget} kcal`;
    DOM.display.hero.progress.style.width = `${percentage}%`;

    DOM.display.hero.protein.textContent = `${formatNumber(macros.p)}g`;
    DOM.display.hero.carbs.textContent = `${formatNumber(macros.c)}g`;
    DOM.display.hero.fat.textContent = `${formatNumber(macros.f)}g`;

    DOM.display.summary.total.textContent = `${formatNumber(total)} kcal`;
    DOM.display.summary.remaining.textContent = `${formatNumber(remaining)} kcal`;
}

export function updateMacroTargets(calories, macros) {
    const gProtein = Math.round((calories * (macros.p / 100)) / 4);
    const gCarbs = Math.round((calories * (macros.c / 100)) / 4);
    const gFat = Math.round((calories * (macros.f / 100)) / 9);

    DOM.inputs.targetP.textContent = `${gProtein}g`;
    DOM.inputs.targetC.textContent = `${gCarbs}g`;
    DOM.inputs.targetF.textContent = `${gFat}g`;
}

export function switchView(viewName) {
    DOM.nav.tracker.classList.toggle('active', viewName === 'tracker');
    DOM.nav.settings.classList.toggle('active', viewName === 'settings');

    if (viewName === 'tracker') {
        DOM.views.tracker.classList.remove('hidden');
        DOM.views.settings.classList.add('hidden');
    } else {
        DOM.views.tracker.classList.add('hidden');
        DOM.views.settings.classList.remove('hidden');
    }
}
