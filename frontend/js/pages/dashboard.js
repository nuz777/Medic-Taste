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
    <div class="dash-hero">
      <div class="dash-hero-content">
        <div class="dash-greeting">
          <h1>Hola, ${escapeHtml(firstName)}!</h1>
      
        </div>
        <div class="dash-bell" id="dashBell">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
        </div>
      </div>
      <img src="assets/images/banner.png" alt="Medic-Taste" class="dash-hero-bg">
    </div>

    <div class="dash-meals" id="dashMeals"></div>

    <div class="dash-focus">
      <div class="dash-focus-header">
        <span>Registro de comidas</span>
      </div>
      <div class="dash-focus-header" style="margin-top:0.25rem">
        <span>Restante <strong id="dashRemaining">--</strong></span>
        <span>Objetivo <strong id="dashTarget">${CALORIE_TARGET} CL</strong></span>
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
  setupBell();
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
    const key = `tf_eaten_${todayStr}`;
    const eaten = JSON.parse(localStorage.getItem(key) || '[]');

    const consumed = eaten.reduce((sum, m) => sum + (m.calories || 0), 0);
    const protein = eaten.reduce((sum, m) => sum + (m.protein || 0), 0);
    const carbs = eaten.reduce((sum, m) => sum + (m.carbs || 0), 0);
    const fat = eaten.reduce((sum, m) => sum + (m.fat || 0), 0);

    const calEl = document.getElementById('dashCalValue');
    const isComplete = consumed >= CALORIE_TARGET;
    calEl.textContent = isComplete ? '¡Completado!' : Math.round(consumed);
    calEl.classList.toggle('completed', isComplete);
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
    document.getElementById('dashCalValue').textContent = '0';
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

const NOTIFICATIONS = [
  { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>', title: 'Planifica tu semana', desc: 'Organiza tus comidas en el planificador.', route: 'planner' },
  { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>', title: 'Explora nuevas recetas', desc: 'Descubre platillos saludables.', route: 'recipes' },
  { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>', title: 'Revisa tu progreso', desc: 'Mira cómo vas con tus macros.', route: 'plans' },
  { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>', title: 'Lista de compras', desc: 'No olvides los ingredientes.', route: 'shopping' },
  { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>', title: 'Tus favoritos', desc: 'Recetas guardadas que te esperan.', route: 'favorites' },
  { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>', title: 'Actualiza tu perfil', desc: 'Mantén tus datos al día.', route: 'profile' },
];

function setupBell() {
  const bell = document.getElementById('dashBell');
  if (!bell) return;

  let panel = null;

  bell.addEventListener('click', (e) => {
    e.stopPropagation();

    if (panel) {
      panel.remove();
      panel = null;
      return;
    }

    panel = document.createElement('div');
    panel.className = 'dash-notif-panel';

    panel.innerHTML = `
      <div class="dash-notif-header">Notificaciones</div>
      ${NOTIFICATIONS.map(n => `
        <a class="dash-notif-item" data-route="${n.route}">
          <span class="dash-notif-icon">${n.icon}</span>
          <div class="dash-notif-text">
            <div class="dash-notif-title">${n.title}</div>
            <div class="dash-notif-desc">${n.desc}</div>
          </div>
        </a>
      `).join('')}
    `;

    panel.querySelectorAll('.dash-notif-item').forEach(item => {
      item.addEventListener('click', () => {
        window.location.hash = item.dataset.route;

        panel.remove();
        panel = null;
      });
    });

    document.body.appendChild(panel);

    const rect = bell.getBoundingClientRect();
    const panelWidth = 300;
    const vw = window.innerWidth;
    let left = rect.right - panelWidth;
    if (left < 8) left = Math.max(8, vw - panelWidth - 8);

    panel.style.left = `${left}px`;
    panel.style.top = `${rect.bottom + 8}px`;

    const close = (ev) => {
      if (!panel) return;

      if (panel.contains(ev.target) || bell.contains(ev.target)) return;

      panel.remove();
      panel = null;
      document.removeEventListener('click', close);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };

    const updatePosition = () => {
      if (!panel) return;

      const r = bell.getBoundingClientRect();
      let left = r.right - panelWidth;
      if (left < 8) left = Math.max(8, window.innerWidth - panelWidth - 8);

      panel.style.left = `${left}px`;
      panel.style.top = `${r.bottom + 8}px`;
    };

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    setTimeout(() => document.addEventListener('click', close), 0);
  });
}