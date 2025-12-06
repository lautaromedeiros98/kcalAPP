/**
 * @module Storage
 * @description Capa de abstracción para la persistencia de datos (LocalStorage).
 * Maneja la lectura y escritura de datos, aislando a la app de la implementación específica de almacenamiento.
 */
export const STORAGE_KEYS = {
    items: 'kcalapp-items',
    target: 'kcalapp-target',
    settings: 'kcalapp-settings',
};

/**
 * Recupera la lista de alimentos guardada.
 * Si falla el parseo o no existen datos, devuelve un array vacío.
 * @returns {Array} Array de alimentos.
 */
export function loadItems() {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.items);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.warn('Error cargando items', error);
        return [];
    }
}

/**
 * Guarda la lista completa de alimentos en LocalStorage.
 * @param {Array} items - Array de objetos de alimentos.
 */
export function saveItems(items) {
    localStorage.setItem(STORAGE_KEYS.items, JSON.stringify(items));
}

/**
 * Carga la meta calórica.
 * @returns {number} Meta en kcal (default: 2000).
 */
export function loadTarget() {
    const stored = localStorage.getItem(STORAGE_KEYS.target);
    return stored ? Number(stored) : 2000;
}

/**
 * Guarda la nueva meta calórica.
 * @param {number} value - Valor entero de la meta.
 */
export function saveTarget(value) {
    localStorage.setItem(STORAGE_KEYS.target, value);
}

export function loadSettings() {
    const stored = localStorage.getItem(STORAGE_KEYS.settings);
    return stored ? JSON.parse(stored) : null;
}

export function saveSettings(value) {
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(value));
}
