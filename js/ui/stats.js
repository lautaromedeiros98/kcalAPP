/**
 * @module UI/Stats
 * @description Módulo para generar gráficos y estadísticas.
 * Utiliza divs y CSS puros para crear gráficos de barras sin dependencias externas.
 */

import { state, getItemsByDate } from '../state.js';
import { DOM } from '../dom.js';
import { formatNumber } from '../utils.js';

/**
 * Obtiene los datos de los últimos 7 días.
 * @returns {Array} Array de objetos { date, calories, label }.
 */
function getWeeklyData() {
    const data = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);

        const items = getItemsByDate(d);
        const totalCalories = items.reduce((sum, item) => sum + item.totalCalories, 0);

        // Label format: "Lun 12"
        const dayName = d.toLocaleDateString('es-ES', { weekday: 'short' });
        const dayNumber = d.getDate();

        data.push({
            date: d.toDateString(),
            calories: totalCalories,
            label: `${dayName} ${dayNumber}`,
            isToday: i === 0
        });
    }
    return data;
}

/**
 * Renderiza el gráfico de barras semanal en el contenedor.
 */
export function renderWeeklyChart() {
    const container = document.getElementById('statsChartContainer'); // Direct ref por simplicity o agregar a DOM.js
    if (!container) return;

    const data = getWeeklyData();
    const maxVal = Math.max(...data.map(d => d.calories), state.dailyTarget * 1.2); // Escala basada en el max o target

    container.innerHTML = '';

    data.forEach(day => {
        // Calcular altura porcentaje
        const heightPct = Math.min((day.calories / maxVal) * 100, 100);

        // Color: Verde si cumple meta (+/- 10%), Naranja si se pasa un poco, Rojo si se pasa mucho
        let color = '#3b82f6'; // Azul default (bajo)
        const target = state.dailyTarget;

        if (day.calories > target * 1.1) color = '#ef4444'; // Rojo (exceso)
        else if (day.calories >= target * 0.9) color = '#22c55e'; // Verde (meta)

        // Barra
        const barWrapper = document.createElement('div');
        barWrapper.style.cssText = 'display: flex; flex-direction: column; align-items: center; width: 12%; height: 100%; justify-content: flex-end;';

        const valueLabel = document.createElement('span');
        valueLabel.textContent = formatNumber(day.calories);
        valueLabel.style.cssText = 'font-size: 0.75rem; color: #667085; margin-bottom: 4px;';

        const bar = document.createElement('div');
        bar.style.cssText = `width: 100%; background: ${color}; border-radius: 6px 6px 0 0; transition: height 0.5s ease;`;
        bar.style.height = `${heightPct}%`;

        if (day.isToday) {
            bar.style.opacity = '1';
            bar.style.boxShadow = '0 0 8px rgba(0,0,0,0.2)';
        } else {
            bar.style.opacity = '0.7';
        }

        const dateLabel = document.createElement('span');
        dateLabel.textContent = day.label;
        dateLabel.style.cssText = 'font-size: 0.7rem; color: #667085; margin-top: 6px; text-transform: capitalize;';

        barWrapper.appendChild(valueLabel);
        barWrapper.appendChild(bar);
        barWrapper.appendChild(dateLabel);

        container.appendChild(barWrapper);
    });
}
