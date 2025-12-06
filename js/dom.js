/**
 * @module DOM
 * @description Diccionario centralizado de referencias a elementos del DOM.
 * Evita la dispersión de 'document.getElementById' por toda la aplicación,
 * facilitando el mantenimiento si cambian los IDs en el HTML.
 */
export const DOM = {
    form: document.getElementById('foodForm'),
    settingsForm: document.getElementById('settingsForm'),
    macroForm: document.getElementById('macroForm'),
    inputs: {
        name: document.getElementById('foodName'),
        servings: document.getElementById('foodServings'),
        calories: document.getElementById('foodCalories'),
        category: document.getElementById('foodCategory'),
        protein: document.getElementById('foodProtein'),
        carbs: document.getElementById('foodCarbs'),
        fat: document.getElementById('foodFat'),
        // Settings
        settingsGender: document.getElementById('settingsGender'),
        settingsAge: document.getElementById('settingsAge'),
        settingsWeight: document.getElementById('settingsWeight'),
        settingsHeight: document.getElementById('settingsHeight'),
        settingsActivity: document.getElementById('settingsActivity'),
        settingsGoal: document.getElementById('settingsGoal'),
        settingsResult: document.getElementById('settingsResult'),
        // Macros
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
            progressProtein: document.getElementById('heroProgressProtein'),
            carbs: document.getElementById('heroCarbs'),
            progressCarb: document.getElementById('heroProgressCarb'),
            fat: document.getElementById('heroFat'),
            progressFat: document.getElementById('heroProgressFat'),
        },
        summary: {
            total: document.getElementById('summaryTotal'),
            remaining: document.getElementById('summaryRemaining'),
        },
    },
};
