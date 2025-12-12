Este archivo define qué vamos a construir. He añadido módulos específicos para la planificación y las sugerencias, separándolas de la futura IA para poder implementarlas antes con reglas simples.
# KcalAPP - Especificación del Proyecto

## 1. Visión del Producto
**KcalAPP** aspira a ser un ecosistema integral para el **bienestar físico y personal**. Más que un simple contador de calorías, es un asistente inteligente que centraliza alimentación, entrenamiento, descanso e hidratación [1]. Su objetivo es utilizar datos y, eventualmente, Inteligencia Artificial para potenciar la mejora diaria del usuario mediante sugerencias y planificación [1].

## 2. Alcance Funcional
El proyecto se divide en módulos escalonables:

### 2.1 Módulo de Nutrición (Fase Actual)
*   **Tracking Diario**: Registro de calorías y macronutrientes [2].
*   **Base de Datos**: Gestión local de alimentos e historial de comidas [2].
*   **Objetivos**: Configuración de déficit, mantenimiento o superávit [2].

### 2.2 Módulo de Planificación y Gestión (NUEVO - Fase 1.5)
*   **Meal Prep**: Capacidad de planificar comidas para días futuros (Semana vista).
*   **Lista de Compras**: Generación de ingredientes basada en la planificación semanal.
*   **Calendario**: Vista mensual para organizar días de entrenamiento y descanso.

### 2.3 Módulo de Entrenamiento (Fase 2)
*   **Rutinas**: Creación y gestión de planes de entrenamiento [2].
*   **Sesiones**: Registro de series, repeticiones, pesos y RPE [2].
*   **Librería**: Catálogo de ejercicios fundamentales [3].

### 2.4 Módulo de Avances y Estadísticas (Fase 3)
*   **Panel de Estadísticas**: Gráficas de adherencia a la dieta y distribución de macros [4].
*   **Biometría**: Seguimiento de peso corporal, % de grasa y medidas corporales [2].
*   **Bienestar**: Contadores rápidos de hidratación y calidad de sueño [2].

### 2.5 Módulo "Smart Coach" y Sugerencias (Fase 4)
*   **Sugerencias Reactivas (Reglas)**: Avisos inmediatos (ej. "Te falta proteína hoy") [5].
*   **Sugerencias Predictivas (IA)**: Análisis de tendencias mediante LLM para optimizar el plan [5].
*   **Gamificación**: Rachas y logros por cumplimiento [6].

## 3. Estrategia Tecnológica

### 3.1 Etapa Inicial (Web MVP)
*   **Stack**: HTML5, CSS3, Vanilla JavaScript [5].
*   **Persistencia**: LocalStorage (Validación rápida sin servidor) [5].

### 3.2 Etapa Intermedia (Web App Escalable)
*   **Frontend**: Migración a Framework reactivo (React/Vue) [7].
*   **Backend**: Base de datos en la nube (Supabase/Firebase) para Login y persistencia de "Avances" [7].

### 3.3 Etapa Final (Mobile Nativo)
*   **Móvil**: React Native o Capacitor para Android/iOS [7].
*   **Integración**: Notificaciones y widgets nativos [7].

## 5. Definición de Datos (Schemas)

#### 5.1 Training Model (Fase 2)
Para el módulo de entrenamiento, utilizaremos la siguiente estructura de datos relacional (simulada en JSON):

**Exercise (Catálogo)**
```json
{
  "id": "ex_001",
  "name": "Squat (Sentadilla)",
  "muscleGroup": "legs", // legs, push, pull, core
  "type": "compound" // compound, isolation
}
```

**Routine (Plan de Entreno)**
```json
{
  "id": "rt_001",
  "name": "Pierna Hipertrofia",
  "exercises": [
    { "exerciseId": "ex_001", "targetSets": 4, "targetReps": "8-12" }
  ]
}
```

**WorkoutSession (Registro Real)**
```json
{
  "id": "ws_uuid",
  "date": "2023-11-01T10:00:00Z",
  "routineId": "rt_001", // Opcional (si viene de una rutina)
  "logs": [
    {
      "exerciseId": "ex_001",
      "sets": [
        { "reps": 10, "weight": 100, "rpe": 8 },
        { "reps": 10, "weight": 100, "rpe": 9 }
      ]
    }
  ]
}
```