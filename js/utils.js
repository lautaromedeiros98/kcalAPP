export function formatNumber(value) {
    return new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: Number.isInteger(value) ? 0 : 1,
        maximumFractionDigits: 1,
    }).format(value);
}

export function calculateBMR(weight, height, age, gender) {
    // Fórmula Mifflin-St Jeor
    // Hombres: (10 × peso) + (6.25 × altura) - (5 × edad) + 5
    // Mujeres: (10 × peso) + (6.25 × altura) - (5 × edad) - 161
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    bmr += (gender === 'male') ? 5 : -161;
    return bmr;
}
