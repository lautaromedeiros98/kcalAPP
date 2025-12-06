import { loadItems, loadTarget, loadSettings } from './storage.js';

export let state = {
    items: loadItems(),
    dailyTarget: loadTarget(),
    editingId: null,
    settings: loadSettings(),
};

export function updateItemInState(id, payload) {
    state.items = state.items.map((item) => {
        if (item.id === id) {
            return { ...item, ...payload };
        }
        return item;
    });
}

export function addItemToState(item) {
    state.items = [item, ...state.items];
}

export function removeItemFromState(id) {
    state.items = state.items.filter((item) => item.id !== id);
}

export function resetStateItems() {
    state.items = [];
}

export function findItem(id) {
    return state.items.find((item) => item.id === id);
}
