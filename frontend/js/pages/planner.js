import { get, post, del } from '../services/api.js';
import { logUsage } from '../services/usage.js';
import { escapeHtml } from '../utils/escapeHtml.js';
import { getDailyCalorieGoal } from '../utils/calorieGoal.js';
import { showRecipeDetail } from './recipes.js';

const MEAL_TYPES = ['desayuno', 'almuerzo', 'cena', 'snack'];

const MEAL_META = {
  desayuno: { label: 'Desayuno', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>' },
  almuerzo: { label: 'Almuerzo', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/></svg>' },
  cena: { label: 'Cena', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>' },
  snack: { label: 'Snack', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/></svg>' },
};

const DAY_LABELS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

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

function todayStr() {
  return toISODate(new Date());
}

export function renderPlanner(container) {
  const today = new Date();
  let selectedDate = todayStr();
  let currentMonday = getMonday(today);
  let dayMeals = [];
  let loading = false;

  container.innerHTML = `
    <div class="planner-header">
      <h1>Planificador</h1>
      <div class="planner-actions">
        <button class="planner-btn" id="plannerRegen">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
          Regenerar
        </button>
        <button class="planner-btn planner-btn-primary" id="plannerSave">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          Guardar
        </button>
      </div>
    </div>

    <div class="planner-days" id="plannerDays"></div>
    <div class="planner-cards" id="plannerCards"></div>
  `;

  buildDayPills();
  loadDayMeals();

  document.getElementById('plannerRegen').addEventListener('click', regenerateMeals);
  document.getElementById('plannerSave').addEventListener('click', savePlan);

  function buildDayPills() {
    const el = document.getElementById('plannerDays');

    const pills = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(currentMonday);
      d.setDate(currentMonday.getDate() + i);
      const ds = toISODate(d);
      const isToday = ds === todayStr();
      const isActive = ds === selectedDate;

      return `
        <div class="planner-pill ${isToday ? 'today' : ''} ${isActive ? 'active' : ''}" data-date="${ds}">
          <span class="planner-pill-day">${DAY_LABELS[d.getDay()]}</span>
          <span class="planner-pill-num">${d.getDate()}</span>
        </div>`;
    }).join('');

    el.innerHTML = pills;

    el.querySelectorAll('.planner-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        selectedDate = pill.dataset.date;
        buildDayPills();
        loadDayMeals();
      });
    });
  }

  async function loadDayMeals() {
    const cardsEl = document.getElementById('plannerCards');
    cardsEl.innerHTML = `<div class="planner-loading">Cargando comidas...</div>`;

    try {
      const data = await get(`/planner/day/${selectedDate}`);
      dayMeals = Array.isArray(data) ? data : [];
    } catch {
      dayMeals = [];
    }

    renderMealCards();
  }

  function renderMealCards() {
    const cardsEl = document.getElementById('plannerCards');
    const isToday = selectedDate === todayStr();

    if (!dayMeals.length) {
      cardsEl.innerHTML = `
        <div class="planner-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          <p>No hay comidas planificadas para este día.</p>
          <div class="planner-empty-actions">
            <button class="planner-btn planner-btn-primary" id="plannerEmptyAdd">Agregar comida</button>
            <button class="planner-btn" id="plannerEmptyAuto">Sugerir automáticamente</button>
          </div>
        </div>`;
      document.getElementById('plannerEmptyAdd')?.addEventListener('click', openAddModal);
      document.getElementById('plannerEmptyAuto')?.addEventListener('click', fillSuggestedMeals);
      return;
    }

    const grouped = {};
    MEAL_TYPES.forEach(t => { grouped[t] = []; });
    dayMeals.forEach((m, idx) => {
      if (grouped[m.meal_type]) grouped[m.meal_type].push({ ...m, _idx: idx });
    });

    let html = '';
    for (const type of MEAL_TYPES) {
      const meta = MEAL_META[type];
      const meals = grouped[type];

      meals.forEach(m => {
        const thumbHTML = m.photo_url
          ? `<img src="${m.photo_url}" alt="${m.recipe_name}" class="planner-card-thumb-img"/>`
          : `<div class="planner-card-thumb-placeholder">${meta.icon}</div>`;

        html += `
          <div class="planner-card" data-idx="${m._idx}" data-id="${m.id || ''}" data-recipe-id="${m.recipe_id}">
            <div class="planner-card-icon ${type}">${meta.icon}</div>
            <div class="planner-card-thumb">${thumbHTML}</div>
            <div class="planner-card-info">
              <div class="planner-card-name">${escapeHtml(m.recipe_name)}</div>
              <div class="planner-card-meta">${meta.label}${m.prep_time_minutes ? ' · ' + m.prep_time_minutes + ' min' : ''}</div>
            </div>
            <div class="planner-card-actions" style="display:flex;align-items:center;gap:6px">
              ${isToday ? `<button class="planner-card-eaten" data-idx="${m._idx}" title="Marcar como comido">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Comido
              </button>` : `<span class="planner-card-day-label">${meta.label}</span>`}
            </div>
          </div>`;
      });
    }

    html += `
      <button class="planner-card-add" id="plannerAddBtn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Agregar comida
      </button>`;

    cardsEl.innerHTML = html;

    cardsEl.querySelectorAll('.planner-card-eaten').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.dataset.idx);
        markAsEaten(idx);
      });
    });

    cardsEl.querySelectorAll('.planner-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const recipeId = parseInt(card.dataset.recipeId);
        if (recipeId) showRecipeDetail(recipeId);
      });
    });

    document.getElementById('plannerAddBtn')?.addEventListener('click', openAddModal);
  }

  async function markAsEaten(idx) {
    const meal = dayMeals[idx];
    if (!meal) return;

    try {
      const nutrition = await get(`/nutrition/recipe/${meal.recipe_id}`);
      const servings = meal.servings || 1;
      const mealCalories = Math.round((nutrition.total_calories || 0) / servings);

      const key = `tf_eaten_${selectedDate}`;
      const stored = JSON.parse(localStorage.getItem(key) || '[]');
      const currentConsumed = stored.reduce((s, m) => s + (m.calories || 0), 0);
      const calorieGoal = getDailyCalorieGoal();
      const reachedGoal = currentConsumed + mealCalories >= calorieGoal;

      if (reachedGoal) {
        showGoalMessage(meal.recipe_name, calorieGoal);
      } else {
        showEatenFeedback(meal.recipe_name);
      }

      stored.push({
        recipe_id: meal.recipe_id,
        name: meal.recipe_name,
        meal_type: meal.meal_type,
        calories: mealCalories,
        protein: Math.round((nutrition.total_protein || 0) / servings),
        carbs: Math.round((nutrition.total_carbs || 0) / servings),
        fat: Math.round((nutrition.total_fat || 0) / servings),
      });
      localStorage.setItem(key, JSON.stringify(stored));
    } catch {}

    if (meal.id) {
      try { await del(`/planner/${meal.id}`); } catch {}
    }

    dayMeals.splice(idx, 1);
    renderMealCards();
    logUsage('plan_item_eaten');
  }

  function showEatenFeedback(name) {
    const existing = document.querySelector('.planner-eaten-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.className = 'planner-eaten-modal';
    modal.innerHTML = `
      <div class="planner-eaten-card">
        <div class="planner-eaten-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h3>¡Muy bien!</h3>
        <p>Has marcado <strong>${escapeHtml(name)}</strong> como comida hecha.</p>
      </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.remove(), 1800);
  }

  function showGoalMessage(name, calorieGoal) {
    const existing = document.querySelector('.planner-goal-msg');
    if (existing) existing.remove();

    const msg = document.createElement('div');
    msg.className = 'planner-goal-msg';
    msg.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <span>¡Has alcanzado tu objetivo de ${calorieGoal} calorías! <strong>${escapeHtml(name)}</strong> será para mañana.</span>
    `;
    document.getElementById('plannerCards').prepend(msg);
    setTimeout(() => msg.remove(), 4000);
  }

  function openAddModal() {
    const modal = document.createElement('div');
    modal.className = 'planner-modal-overlay';
    modal.innerHTML = `
      <div class="planner-modal">
        <h3>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Agregar comida
        </h3>
        <select id="modalMealType">
          ${MEAL_TYPES.map(t => `<option value="${t}">${MEAL_META[t].label}</option>`).join('')}
        </select>
        <input type="text" id="modalSearch" placeholder="Buscar receta..." />
        <div class="planner-modal-results" id="modalResults"></div>
        <div class="planner-modal-actions">
          <button class="planner-btn planner-btn-primary" id="modalAddBtn">Agregar</button>
          <button class="planner-btn" id="modalCancelBtn">Cancelar</button>
        </div>
      </div>`;

    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    document.getElementById('modalCancelBtn').addEventListener('click', () => modal.remove());

    const resultsEl = document.getElementById('modalResults');
    const searchInput = document.getElementById('modalSearch');
    let selectedRecipe = null;

    async function searchRecipes(query) {
      try {
        const params = new URLSearchParams();
        if (query.trim()) params.set('search', query.trim());
        params.set('limit', '20');
        const recipes = await get(`/recipes?${params}`);
        resultsEl.innerHTML = recipes.map(r => `
          <div class="planner-modal-recipe" data-id="${r.id}" data-name="${r.name}">
            <div class="planner-modal-recipe-icon">${MEAL_META.almuerzo.icon}</div>
            <div class="planner-modal-recipe-info">
              <strong>${escapeHtml(r.name)}</strong>
              <small>${r.prep_time_minutes || '—'} min</small>
            </div>
          </div>
        `).join('');

        resultsEl.querySelectorAll('.planner-modal-recipe').forEach(el => {
          el.addEventListener('click', () => {
            resultsEl.querySelectorAll('.planner-modal-recipe').forEach(e => e.classList.remove('selected'));
            el.classList.add('selected');
            selectedRecipe = { id: parseInt(el.dataset.id), name: el.dataset.name };
          });
        });
      } catch {
        resultsEl.innerHTML = '<div class="planner-modal-empty">Error al cargar recetas</div>';
      }
    }

    let localSearchTimer;
    searchInput.addEventListener('input', () => {
      clearTimeout(localSearchTimer);
      localSearchTimer = setTimeout(() => searchRecipes(searchInput.value), 300);
    });

    searchRecipes('');

    document.getElementById('modalAddBtn').addEventListener('click', async () => {
      if (!selectedRecipe) { alert('Selecciona una receta'); return; }
      const type = document.getElementById('modalMealType').value;

      try {
        await post('/planner', {
          recipe_id: selectedRecipe.id,
          plan_date: selectedDate,
          meal_type: type,
        });
        logUsage('plan_item_added');
      } catch {}

      modal.remove();
      loadDayMeals();
    });
  }

  async function fillSuggestedMeals() {
    try {
      const recipes = await get('/recipes?limit=20');
      if (!recipes.length) {
        showEmptyStateMessage('No hay recetas disponibles por ahora.');
        return;
      }

      const suggested = [
        recipes.find(r => r.name?.toLowerCase().includes('ensalada')) || recipes[0],
        recipes.find(r => r.name?.toLowerCase().includes('pollo')) || recipes[1] || recipes[0],
        recipes.find(r => r.name?.toLowerCase().includes('arroz')) || recipes[2] || recipes[0],
        recipes.find(r => r.name?.toLowerCase().includes('smoothie')) || recipes[3] || recipes[0],
      ].filter(Boolean);

      const slotTypes = ['desayuno', 'almuerzo', 'cena', 'snack'];
      await Promise.all(slotTypes.map((type, i) => {
        const recipe = suggested[i];
        if (!recipe) return Promise.resolve();
        return post('/planner', {
          recipe_id: recipe.id,
          plan_date: selectedDate,
          meal_type: type,
        });
      }));

      logUsage('plan_auto_filled');
      await loadDayMeals();
      showEmptyStateMessage('¡Ya quedó el día sugerido!');
    } catch {
      showEmptyStateMessage('No se pudieron agregar las sugerencias.');
    }
  }

  function showEmptyStateMessage(message) {
    const cardsEl = document.getElementById('plannerCards');
    if (!cardsEl) return;
    cardsEl.innerHTML = `
      <div class="planner-empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
        <p>${escapeHtml(message)}</p>
        <div class="planner-empty-actions">
          <button class="planner-btn planner-btn-primary" id="plannerEmptyAdd">Agregar comida</button>
          <button class="planner-btn" id="plannerEmptyAuto">Sugerir automáticamente</button>
        </div>
      </div>`;
    document.getElementById('plannerEmptyAdd')?.addEventListener('click', openAddModal);
    document.getElementById('plannerEmptyAuto')?.addEventListener('click', fillSuggestedMeals);
  }

  async function regenerateMeals() {
    const btn = document.getElementById('plannerRegen');
    btn.disabled = true;
    btn.textContent = 'Regenerando...';

    try {
      const recipes = await get('/recipes?limit=50');
      if (!recipes.length) {
        alert('No hay recetas disponibles en la base de datos.');
        return;
      }

      const shuffled = [...recipes].sort(() => Math.random() - 0.5);
      const slotTypes = ['desayuno', 'almuerzo', 'cena', 'snack'];
      const newMeals = slotTypes.map((type, i) => ({
        recipe_id: shuffled[i % shuffled.length].id,
        plan_date: selectedDate,
        meal_type: type,
      }));

      await post('/planner/clear-week', { start: selectedDate, end: selectedDate });

      for (const meal of newMeals) {
        try {
          await post('/planner', meal);
        } catch {}
      }

      logUsage('plan_regenerated');
      await loadDayMeals();
    } catch {
      alert('Error al regenerar. Verifica que el backend esté corriendo.');
    } finally {
      btn.disabled = false;
      btn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
        Regenerar`;
    }
  }

  async function savePlan() {
    const btn = document.getElementById('plannerSave');
    btn.disabled = true;
    btn.textContent = 'Guardando...';

    try {
      const start = toISODate(currentMonday);
      const end = toISODate(new Date(currentMonday.getTime() + 6 * 86400000));

      await post('/planner/clear-week', { start, end });

      const saved = JSON.parse(localStorage.getItem('tf_week_plan') || '{}');
      for (const [dateStr, meals] of Object.entries(saved)) {
        for (const meal of meals) {
          try {
            await post('/planner', {
              recipe_id: meal.recipe_id,
              plan_date: dateStr,
              meal_type: meal.meal_type,
            });
          } catch {}
        }
      }

      logUsage('plan_saved');
      alert('Plan guardado exitosamente');
    } catch {
      alert('Error al guardar el plan. Verifica que el backend esté corriendo.');
    } finally {
      btn.disabled = false;
      btn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
        Guardar`;
    }
  }
}
