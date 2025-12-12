/**
 * @module UI/Toast
 * @description Módulo simple para mostrar notificaciones flotantes (Toasts).
 * Soporta tipos: success, error, info, warning.
 */

// Referencia al contenedor (lazy init)
let toastContainer = null;

function getContainer() {
    if (toastContainer) return toastContainer;

    toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    return toastContainer;
}

/**
 * Muestra una notificación Toast en pantalla.
 * @param {string} message - El texto a mostrar.
 * @param {string} type - Tipo de alerta: 'success', 'error', 'warning', 'info'. Default: 'info'.
 * @param {number} duration - Duración en ms antes de desaparecer. Default: 3000ms.
 */
export function showToast(message, type = 'info', duration = 3000) {
    const container = getContainer();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    // Icono basado en el tipo
    let icon = '';
    switch (type) {
        case 'success': icon = '✅'; break;
        case 'error': icon = '❌'; break;
        case 'warning': icon = '⚠️'; break;
        default: icon = 'ℹ️';
    }

    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span class="toast-message">${message}</span>
    `;

    container.appendChild(toast);

    // Auto-remove
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s forwards';
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }, duration);
}
