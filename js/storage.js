export const STORAGE_KEYS = {
    items: 'kcalapp-items',
    target: 'kcalapp-target',
    settings: 'kcalapp-settings',
};

export function loadItems() {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.items);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.warn('Error cargando items', error);
        return [];
    }
}

export function saveItems(items) {
    localStorage.setItem(STORAGE_KEYS.items, JSON.stringify(items));
}

export function loadTarget() {
    const stored = localStorage.getItem(STORAGE_KEYS.target);
    return stored ? Number(stored) : 2000;
}

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
