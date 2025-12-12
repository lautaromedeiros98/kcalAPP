/**
 * @module State
 * @description Gestión del estado global de la aplicación.
 * actúa como la "Fuente de la Verdad" en memoria, manteniendo
 * la lista de items, metas y configuraciones actuales.
 */
import { loadItems, loadTarget, loadSettings } from './storage.js';

export let state = {
    items: loadItems(),
    dailyTarget: loadTarget(),
    editingId: null,
    settings: loadSettings(),
};

/**
 * Actualiza parcialmente un item en el array de estado.
 * Mantiene la inmutabilidad de los otros items devolviendo un nuevo array.
 * @param {string} id - ID del item a modificar.
 * @param {Object} payload - Objeto con las propiedades a sobrescribir.
 */
export function updateItemInState(id, payload) {
    state.items = state.items.map((item) => {
        if (item.id === id) {
            return { ...item, ...payload };
        }
        return item;
    });
}

/**
 * Agrega un nuevo registro al inicio de la lista (LIFO para vista).
 * @param {Object} item - El objeto completo del alimento.
 */
export function addItemToState(item) {
    state.items = [item, ...state.items];
}

/**
 * Elimina un registro del estado filtrando por ID.
 * @param {string} id - ID del item a eliminar.
 */
export function removeItemFromState(id) {
    state.items = state.items.filter((item) => item.id !== id);
}

/**
 * Borra todos los registros actuales (vacía el array).
 * @deprecated Se debe usar removeItemsByDate para borrar solo los del día.
 * Mantenido por compatibilidad temporal.
 */
export function resetStateItems() {
    state.items = [];
}

/**
 * Elimina los registros de una fecha específica.
 * @param {string} dateString - Fecha a limpiar (toDateString).
 */
export function resetDailyItems(dateString) {
    state.items = state.items.filter(item => {
        const itemDate = new Date(item.createdAt).toDateString();
        return itemDate !== dateString;
    });
}

/**
 * Busca y devuelve un item específico por su ID.
 * @param {string} id - ID a buscar.
 * @returns {Object|undefined} El item encontrado o undefined.
 */
export function findItem(id) {
    return state.items.find((item) => item.id === id);
}

/**
 * Devuelve los items filtrados por una fecha específica.
 * @param {Date} dateObj - Objeto Date con la fecha deseada.
 * @returns {Array} Array de items que coinciden con esa fecha (día, mes, año).
 */
export function getItemsByDate(dateObj) {
    const targetDate = dateObj.toDateString();
    return state.items.filter(item => {
        const itemDate = new Date(item.createdAt).toDateString();
        return itemDate === targetDate;
    });
}

/**
 * Helper para obtener los items de HOY.
 */
export function getTodayItems() {
    return getItemsByDate(new Date());
}
