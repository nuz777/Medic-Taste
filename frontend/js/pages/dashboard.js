import { get } from '../services/api.js';
import { getUser } from '../services/authService.js';
import { escapeHtml } from '../utils/escapeHtml.js';

const CALORIE_TARGET = 2000;
const MACRO_TARGETS = { protein: 77, carbs: 136, fat: 40 };

const MEAL_ICONS = {
  desayuno: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>',
  almuerzo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path></svg>',
  cena: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>',
};

const MEAL_CLASSES = { desayuno: 'breakfast', almuerzo: 'lunch', cena: 'dinner' };
const MEAL_LABELS = { desayuno: 'Desayuno', almuerzo: 'Almuerzo', cena: 'Cena' };

export async function renderDashboard(container) {
  const user = getUser();
  const firstName = user?.name?.split(' ')[0] || 'Usuario';

  container.innerHTML = `
    <div class="dash-header">
      <div class="dash-avatar" id="dashAvatar">
        <svg viewBox="0 0 44 44" width="44" height="44">
          <circle cx="22" cy="22" r="22" fill="var(--primary-light)"/>
          <text x="22" y="22" text-anchor="middle" dominant-baseline="central" fill="var(--primary)" font-size="16" font-weight="700" font-family="Inter, sans-serif">${escapeHtml((firstName[0] || 'U').toUpperCase())}</text>
        </svg>
      </div>
      <div class="dash-bell">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
      </div>
    </div>

    <div class="dash-greeting">
      <h1>Hola, ${escapeHtml(firstName)}!</h1>
      <p>Completa tu nutrición diaria</p>
    </div>

    <div class="dash-meals" id="dashMeals"></div>

    <div class="dash-focus">
      <div class="dash-focus-header">
        <span>Registro de comidas</span>
      </div>
      <div class="dash-focus-header" style="margin-top:0.25rem">
        <span>Restante <strong id="dashRemaining">--</strong></span>
        <span>Objetivo <strong id="dashTarget">${CALORIE_TARGET}</strong></span>
      </div>
    </div>

    <div class="dash-ring-wrap">
      <div class="dash-ring">
        <svg viewBox="0 0 200 200">
          <circle class="dash-ring-bg" cx="100" cy="100" r="85"></circle>
          <circle class="dash-ring-progress" id="dashRingProgress" cx="100" cy="100" r="85"></circle>
        </svg>
        <div class="dash-ring-center">
          <span class="dash-ring-value" id="dashCalValue">--</span>
          <span class="dash-ring-label">Consumido</span>
        </div>
      </div>
    </div>

    <div class="dash-macros" id="dashMacros">
      <div class="dash-macro protein">
        <div class="dash-macro-ring">
          <svg viewBox="0 0 72 72">
            <circle class="dash-macro-ring-bg" cx="36" cy="36" r="30"></circle>
            <circle class="dash-macro-ring-progress" data-macro="protein" cx="36" cy="36" r="30"></circle>
          </svg>
        </div>
        <span class="dash-macro-label">Proteína</span>
        <span class="dash-macro-values" id="dashProteinVal">0/${MACRO_TARGETS.protein}g</span>
      </div>
      <div class="dash-macro carbs">
        <div class="dash-macro-ring">
          <svg viewBox="0 0 72 72">
            <circle class="dash-macro-ring-bg" cx="36" cy="36" r="30"></circle>
            <circle class="dash-macro-ring-progress" data-macro="carbs" cx="36" cy="36" r="30"></circle>
          </svg>
        </div>
        <span class="dash-macro-label">Carbohidratos</span>
        <span class="dash-macro-values" id="dashCarbsVal">0/${MACRO_TARGETS.carbs}g</span>
      </div>
      <div class="dash-macro fat">
        <div class="dash-macro-ring">
          <svg viewBox="0 0 72 72">
            <circle class="dash-macro-ring-bg" cx="36" cy="36" r="30"></circle>
            <circle class="dash-macro-ring-progress" data-macro="fat" cx="36" cy="36" r="30"></circle>
          </svg>
        </div>
        <span class="dash-macro-label">Grasas</span>
        <span class="dash-macro-values" id="dashFatVal">0/${MACRO_TARGETS.fat}g</span>
      </div>
    </div>

    <div class="dash-insights">
      <div class="dash-insights-title">Resumen</div>
      <div class="dash-progress-bar">
        <div class="dash-progress-fill" id="dashInsightFill" style="width:0%"></div>
      </div>
      <div class="dash-progress-labels">
        <span id="dashInsightLabel">Logro del objetivo</span>
        <span id="dashInsightPct">0%</span>
      </div>
    </div>
  `;



  loadMealCards();
  loadNutrition();
}

function loadMealCards() {
  const el = document.getElementById('dashMeals');
  try {
    const weekPlan = JSON.parse(localStorage.getItem('tf_week_plan') || '{}');
    const todayStr = new Date().toISOString().split('T')[0];
    const todayMeals = weekPlan[todayStr] || [];

    if (todayMeals.length > 0) {
      renderMealCards(el, todayMeals);
    } else {
      loadMealCardsFromAPI(el, todayStr);
    }
  } catch (e) {
    console.error('[Dashboard] loadMealCards error:', e);
    loadMealCardsFromAPI(el, new Date().toISOString().split('T')[0]);
  }
}

async function loadMealCardsFromAPI(el, todayStr) {
  try {
    const meals = await get(`/planner/day/${todayStr}`);
    if (meals.length > 0) {
      renderMealCards(el, meals);
    } else {
      renderEmptyMealCards(el);
    }
  } catch (e) {
    console.error('[Dashboard] loadMealCardsFromAPI error:', e);
    renderEmptyMealCards(el);
  }
}

function renderMealCards(el, meals) {
  const typeMeals = { desayuno: null, almuerzo: null, cena: null };
  meals.forEach(m => {
    if (m.meal_type in typeMeals && !typeMeals[m.meal_type]) {
      typeMeals[m.meal_type] = m;
    }
  });

  el.innerHTML = Object.entries(typeMeals).map(([type, meal]) => {
    const cls = MEAL_CLASSES[type];
    const label = MEAL_LABELS[type];
    const name = meal ? escapeHtml(meal.recipe_name || meal.name || '') : 'Sin planificar';
    return `
      <div class="dash-meal-card ${cls}">
        <div class="dash-meal-icon">${MEAL_ICONS[type] || ''}</div>
        <div class="dash-meal-info">
          <div class="dash-meal-label">${label}</div>
          <div class="dash-meal-kcal">${name}</div>
        </div>
      </div>`;
  }).join('');
}

function renderEmptyMealCards(el) {
  el.innerHTML = ['desayuno', 'almuerzo', 'cena'].map(type => `
    <div class="dash-meal-card ${MEAL_CLASSES[type]}">
      <div class="dash-meal-icon">${MEAL_ICONS[type] || ''}</div>
      <div class="dash-meal-info">
        <div class="dash-meal-label">${MEAL_LABELS[type]}</div>
        <div class="dash-meal-kcal">Sin planificar</div>
      </div>
    </div>`).join('');
}

async function loadNutrition() {
  const todayStr = new Date().toISOString().split('T')[0];
  try {
    const data = await get(`/nutrition/day/${todayStr}`);
    const consumed = data.total_calories || 0;
    const protein = data.total_protein || 0;
    const carbs = data.total_carbs || 0;
    const fat = data.total_fat || 0;

    document.getElementById('dashCalValue').textContent = Math.round(consumed);
    document.getElementById('dashRemaining').textContent = Math.max(0, Math.round(CALORIE_TARGET - consumed));

    setRingProgress('dashRingProgress', consumed, CALORIE_TARGET);
    setMacroRing('protein', protein, MACRO_TARGETS.protein);
    setMacroRing('carbs', carbs, MACRO_TARGETS.carbs);
    setMacroRing('fat', fat, MACRO_TARGETS.fat);

    document.getElementById('dashProteinVal').textContent = `${Math.round(protein)}/${MACRO_TARGETS.protein}g`;
    document.getElementById('dashCarbsVal').textContent = `${Math.round(carbs)}/${MACRO_TARGETS.carbs}g`;
    document.getElementById('dashFatVal').textContent = `${Math.round(fat)}/${MACRO_TARGETS.fat}g`;

    const pct = Math.min(100, Math.round((consumed / CALORIE_TARGET) * 100));
    document.getElementById('dashInsightFill').style.width = pct + '%';
    document.getElementById('dashInsightPct').textContent = pct + '%';
    document.getElementById('dashInsightLabel').textContent = `Logro del objetivo ${new Date().toLocaleDateString('es-CO', { month: 'short', day: 'numeric' })} - Ahora`;
  } catch {
    document.getElementById('dashCalValue').textContent = '--';
  }
}

function setRingProgress(id, value, target) {
  const circle = document.getElementById(id);
  if (!circle) return;
  const r = parseFloat(circle.getAttribute('r'));
  const circumference = 2 * Math.PI * r;
  circle.style.strokeDasharray = circumference;
  const pct = Math.min(1, value / target);
  circle.style.strokeDashoffset = circumference * (1 - pct);
}

function setMacroRing(macro, value, target) {
  const circle = document.querySelector(`[data-macro="${macro}"]`);
  if (!circle) return;
  const r = parseFloat(circle.getAttribute('r'));
  const circumference = 2 * Math.PI * r;
  circle.style.strokeDasharray = circumference;
  const pct = Math.min(1, value / target);
  circle.style.strokeDashoffset = circumference * (1 - pct);
}
