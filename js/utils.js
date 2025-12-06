/**
 * @module Utils
 * @description Colección de funciones utilitarias puras.
 * Incluye helpers para formateo de números y cálculos matemáticos (BMR)
 * que no dependen del estado de la aplicación.
 */
/**
 * Formatea un número al estándar local (es-ES).
 * Elimina decimales si es entero, o muestra hasta 1 decimal.
 * @param {number} value - Valor numérico a formatear.
 * @returns {string} Cadena formateada (ej: "1.200,5").
 */
export function formatNumber(value) {
    return new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: Number.isInteger(value) ? 0 : 1,
        maximumFractionDigits: 1,
    }).format(value);
}

/**
 * Calcula la Tasa Metabólica Basal (BMR) usando la fórmula Mifflin-St Jeor.
 * @param {number} weight - Peso en kg.
 * @param {number} height - Altura en cm.
 * @param {number} age - Edad en años.
 * @param {string} gender - 'male' o 'female'.
 * @returns {number} BMR calculado en kcal/día.
 */
export function calculateBMR(weight, height, age, gender) {
    // Fórmula Mifflin-St Jeor
    // Hombres: (10 × peso) + (6.25 × altura) - (5 × edad) + 5
    // Mujeres: (10 × peso) + (6.25 × altura) - (5 × edad) - 161
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    bmr += (gender === 'male') ? 5 : -161;
    return bmr;
}
