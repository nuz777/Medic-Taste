import { post } from './api.js';
import { CONFIG } from '../config.js';

const WEEK_STATE_KEY = 'tf_week_state';
const HISTORY_KEY = 'tf_questionnaire_history';
const PREFS_KEY = 'tf_preferences';

function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function toISODate(d) {
  return d.toISOString().split('T')[0];
}

function loadState() {
  try { return JSON.parse(localStorage.getItem(WEEK_STATE_KEY)); } catch { return null; }
}

function saveState(state) {
  localStorage.setItem(WEEK_STATE_KEY, JSON.stringify(state));
}

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; } catch { return []; }
}

function saveHistory(history) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function loadPrefs() {
  try { return JSON.parse(localStorage.getItem(PREFS_KEY)) || {}; } catch { return {}; }
}

function loadWeekPlan() {
  try { return JSON.parse(localStorage.getItem('tf_week_plan')); } catch { return null; }
}

function savePrefs(prefs) {
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

function getWeekNumber(date) {
  const d = new Date(date);
  const startOfYear = new Date(d.getFullYear(), 0, 1);
  const diff = d - startOfYear;
  const oneWeek = 604800000;
  return Math.ceil((((diff / oneWeek) + startOfYear.getDay() + 1) / 7));
}

function generateAdaptiveQuestions(history, currentPrefs) {
  const weekNum = history.length + 1;
  const prev = history[history.length - 1];

  if (weekNum === 1) {
    return [
      {
        id: 'experience',
        title: '¿Cómo fue tu experiencia con el plan de la semana pasada?',
        type: 'radio',
        options: [
          { value: 'excellent', label: 'Excelente, seguí todas las comidas' },
          { value: 'good', label: 'Bien, pero salté algunas comidas' },
          { value: 'okay', label: 'Regular, me costó seguirlo' },
          { value: 'bad', label: 'Mal, no lo seguí' },
        ],
      },
      {
        id: 'changes',
        title: '¿Notaste algún cambio esta semana?',
        type: 'radio',
        options: [
          { value: 'energy', label: 'Sí, me siento con más energía' },
          { value: 'weight', label: 'Sí, noté cambios en mi peso' },
          { value: 'digestion', label: 'Sí, mejoró mi digestión' },
          { value: 'none', label: 'No noté cambios significativos' },
          { value: 'worse', label: 'Me sentí con menos energía' },
        ],
      },
      {
        id: 'adjust_goal',
        title: '¿Quieres ajustar tu objetivo para esta semana?',
        type: 'radio',
        options: [
          { value: 'keep', label: 'Seguir con el mismo objetivo' },
          { value: 'lose', label: 'Cambiar a perder peso' },
          { value: 'maintain', label: 'Cambiar a mantener peso' },
          { value: 'gain', label: 'Cambiar a ganar músculo' },
          { value: 'energy', label: 'Cambiar a más energía' },
        ],
      },
    ];
  }

  const questions = [
    {
      id: 'experience',
      title: prev
        ? `La semana pasada mencionaste que tu experiencia fue "${prev.answers.experience || 'buena'}". ¿Cómo fue esta semana?`
        : '¿Cómo fue tu experiencia con el plan esta semana?',
      type: 'radio',
      options: [
        { value: 'excellent', label: 'Excelente, mucho mejor' },
        { value: 'good', label: 'Bien, consistente' },
        { value: 'okay', label: 'Regular, pude mejorar' },
        { value: 'bad', label: 'Mal, no funcionó para mí' },
      ],
    },
  ];

  if (prev) {
    const lastGoal = prev.answers.adjust_goal || currentPrefs.goal || 'maintain';
    questions.push({
      id: 'progress',
      title: `La semana pasada tu objetivo era "${lastGoal}". ¿Cómo sientes tu progreso?`,
      type: 'radio',
      options: [
        { value: 'a_lot', label: 'Mucho progreso, voy muy bien' },
        { value: 'some', label: 'Algún progreso, lento pero seguro' },
        { value: 'stuck', label: 'Estancado, no veo cambios' },
        { value: 'unsure', label: 'No estoy seguro' },
      ],
    });
  } else {
    questions.push({
      id: 'progress',
      title: '¿Cómo sientes tu progreso hasta ahora?',
      type: 'radio',
      options: [
        { value: 'a_lot', label: 'Mucho progreso' },
        { value: 'some', label: 'Algún progreso' },
        { value: 'stuck', label: 'Estancado' },
        { value: 'unsure', label: 'No estoy seguro' },
      ],
    });
  }

  questions.push({
    id: 'preference_tweak',
    title: '¿Hay algo que quieras ajustar para esta semana?',
    type: 'radio',
    options: [
      { value: 'more_protein', label: 'Más recetas con proteína' },
      { value: 'more_veggie', label: 'Más recetas vegetarianas' },
      { value: 'quicker', label: 'Recetas más rápidas de preparar' },
      { value: 'variety', label: 'Más variedad, cambiar las recetas' },
      { value: 'same', label: 'Está bien como está' },
    ],
  });

  return questions;
}

function showWeeklyModal(questions) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'weekly-modal-overlay';

    overlay.innerHTML = `
      <div class="weekly-modal">
        <div class="weekly-modal-header">
          <span class="weekly-modal-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Nueva semana
          </span>
          <h2>¡Nueva semana!</h2>
          <p class="weekly-modal-sub">Tu plan de la semana pasada ha terminado. Cuéntanos cómo te fue para preparar tu nueva semana.</p>
        </div>
        <div class="weekly-modal-body" id="weeklyModalBody"></div>
        <div class="weekly-modal-footer">
          <button class="btn btn-primary" id="weeklyModalSubmit">Generar mi nueva semana</button>
        </div>
      </div>`;

    document.body.appendChild(overlay);

    let currentStep = 0;
    const answers = {};

    function renderStep(index) {
      const body = document.getElementById('weeklyModalBody');
      const q = questions[index];
      if (!q) return;

      body.innerHTML = `
        <div class="weekly-question">
          <div class="weekly-question-progress">Pregunta ${index + 1} de ${questions.length}</div>
          <h3 class="weekly-question-title">${q.title}</h3>
          <div class="weekly-options">
            ${q.options.map((opt, i) => `
              <div class="weekly-option" data-value="${opt.value}" style="animation:fadeIn 0.3s ease ${i * 0.06}s both">
                <span class="weekly-option-check">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
                <span class="weekly-option-label">${opt.label}</span>
              </div>
            `).join('')}
          </div>
        </div>`;

      body.querySelectorAll('.weekly-option').forEach(opt => {
        opt.addEventListener('click', () => {
          body.querySelectorAll('.weekly-option').forEach(o => o.classList.remove('selected'));
          opt.classList.add('selected');
          answers[q.id] = opt.dataset.value;
        });
      });

      const btn = document.getElementById('weeklyModalSubmit');
      btn.textContent = index < questions.length - 1 ? 'Siguiente' : 'Generar mi nueva semana';
    }

    renderStep(0);

    document.getElementById('weeklyModalSubmit').addEventListener('click', () => {
      const q = questions[currentStep];
      if (!answers[q.id]) return;

      if (currentStep < questions.length - 1) {
        currentStep++;
        renderStep(currentStep);
      } else {
        overlay.remove();
        resolve(answers);
      }
    });
  });
}

async function fetchRecipesForPlan(diet, cookTime) {
  const maxTime = cookTime === 'quick' ? 20 : cookTime === 'moderate' ? 40 : 200;

  const params = new URLSearchParams();
  if (diet && diet !== 'omnivore') params.set('diet', diet);
  params.set('limit', '50');

  let recipes = [];
  try {
    const res = await fetch(`${CONFIG.API_URL}/recipes?${params}`);
    const data = await res.json();
    if (Array.isArray(data)) recipes = data;
  } catch {}

  if (!recipes.length && diet && diet !== 'omnivore') {
    try {
      const res = await fetch(`${CONFIG.API_URL}/recipes?limit=50`);
      const data = await res.json();
      if (Array.isArray(data)) recipes = data;
    } catch {}
  }

  if (!recipes.length) {
    recipes = [
      { id: 1, name: 'Pollo con arroz', prep_time_minutes: 35 },
      { id: 2, name: 'Ensalada César', prep_time_minutes: 20 },
      { id: 3, name: 'Pasta al pesto', prep_time_minutes: 25 },
      { id: 4, name: 'Tortilla de patatas', prep_time_minutes: 30 },
      { id: 5, name: 'Batido de plátano', prep_time_minutes: 5 },
      { id: 6, name: 'Ensalada de aguacate', prep_time_minutes: 10 },
      { id: 7, name: 'Lentejas guisadas', prep_time_minutes: 45 },
      { id: 8, name: 'Tostada de aguacate', prep_time_minutes: 10 },
    ];
  }

  return recipes.filter(r => {
    if (maxTime < 200 && r.prep_time_minutes && r.prep_time_minutes > maxTime) return false;
    return true;
  });
}

function generateWeekPlan(recipes, mealsCount, weekStart) {
  const shuffled = [...(recipes.length ? recipes : [{ id: 1, name: 'Pollo con arroz', prep_time_minutes: 35 }])].sort(() => Math.random() - 0.5);

  const mealTypes = ['desayuno', 'almuerzo', 'cena'];
  if (mealsCount >= 4) mealTypes.push('snack');
  if (mealsCount >= 5) mealTypes.push('snack');

  const weekPlan = {};
  let recipeIndex = 0;

  for (let d = 0; d < 7; d++) {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + d);
    const dateStr = toISODate(date);
    const dayMeals = [];

    for (const mealType of [...new Set(mealTypes)]) {
      const recipe = shuffled[recipeIndex % shuffled.length];
      recipeIndex++;
      dayMeals.push({
        recipe_id: recipe.id,
        recipe_name: recipe.name,
        meal_type: mealType,
        plan_date: dateStr,
      });
    }
    weekPlan[dateStr] = dayMeals;
  }

  return weekPlan;
}

async function saveWeekPlan(weekPlan, weekStart, weekEnd) {
  localStorage.setItem('tf_week_plan', JSON.stringify(weekPlan));

  try {
    await post('/planner/clear-week', { start: weekStart, end: weekEnd });
  } catch {}

  const allMeals = Object.entries(weekPlan).flatMap(([dateStr, meals]) =>
    meals.map(meal => ({
      recipe_id: meal.recipe_id,
      plan_date: dateStr,
      meal_type: meal.meal_type,
    }))
  );

  await Promise.allSettled(allMeals.map(m => post('/planner', m)));
}

export async function checkWeeklyCycle() {
  let state = loadState();
  const now = new Date();
  const today = toISODate(now);

  if (!state) {
    const existingPlan = loadWeekPlan();
    if (existingPlan) {
      const weekStart = getMonday(now);
      const weekEndDate = new Date(weekStart);
      weekEndDate.setDate(weekStart.getDate() + 6);
      state = {
        weekNumber: 1,
        weekStart: toISODate(weekStart),
        weekEnd: toISODate(weekEndDate),
        generatedAt: new Date().toISOString(),
      };
      saveState(state);
    }
  }

  if (state) {
    const weekEnd = new Date(state.weekEnd + 'T23:59:59');
    if (now <= weekEnd) return;
  }

  const history = loadHistory();
  const currentPrefs = loadPrefs();
  const weekStart = getMonday(now);
  const weekStartStr = toISODate(weekStart);
  const weekEndDate = new Date(weekStart);
  weekEndDate.setDate(weekStart.getDate() + 6);
  const weekEndStr = toISODate(weekEndDate);

  const questions = generateAdaptiveQuestions(history, currentPrefs);
  const answers = await showWeeklyModal(questions);

  const updatedPrefs = { ...currentPrefs };
  if (answers.adjust_goal && answers.adjust_goal !== 'keep') {
    updatedPrefs.goal = answers.adjust_goal;
  }
  if (answers.preference_tweak === 'quicker') updatedPrefs.cookTime = 'quick';
  if (answers.preference_tweak === 'more_protein') updatedPrefs.diet = 'omnivore';
  if (answers.preference_tweak === 'more_veggie') updatedPrefs.diet = 'vegetarian';
  savePrefs(updatedPrefs);

  const diet = updatedPrefs.diet || '';
  const cookTime = updatedPrefs.cookTime || 'moderate';
  const mealsCount = parseInt(updatedPrefs.meals || '4', 10);

  const recipes = await fetchRecipesForPlan(diet, cookTime);
  const weekPlan = generateWeekPlan(recipes, mealsCount, weekStart);

  await saveWeekPlan(weekPlan, weekStartStr, weekEndStr);

  for (let d = 0; d < 7; d++) {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + d);
    localStorage.removeItem(`tf_eaten_${toISODate(date)}`);
  }

  history.push({
    weekNumber: history.length + 1,
    answers: { ...answers, ...updatedPrefs },
    date: today,
  });
  saveHistory(history);

  saveState({
    weekNumber: history.length,
    weekStart: weekStartStr,
    weekEnd: weekEndStr,
    generatedAt: new Date().toISOString(),
  });
}
