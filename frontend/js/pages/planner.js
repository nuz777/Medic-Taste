import { get, post, del } from '../services/api.js';
import { logUsage } from '../services/usage.js';
import { escapeHtml } from '../utils/escapeHtml.js';

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

    if (!dayMeals.length) {
      cardsEl.innerHTML = `
        <div class="planner-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          <p>No hay comidas planificadas para este día</p>
          <button class="planner-btn planner-btn-primary" id="plannerEmptyAdd">Agregar comida</button>
        </div>`;
      document.getElementById('plannerEmptyAdd')?.addEventListener('click', openAddModal);
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
          <div class="planner-card" data-idx="${m._idx}" data-id="${m.id || ''}">
            <div class="planner-card-icon ${type}">${meta.icon}</div>
            <div class="planner-card-thumb">${thumbHTML}</div>
            <div class="planner-card-info">
              <div class="planner-card-name">${escapeHtml(m.recipe_name)}</div>
              <div class="planner-card-meta">${meta.label}${m.prep_time_minutes ? ' · ' + m.prep_time_minutes + ' min' : ''}</div>
            </div>
            <div class="planner-card-actions">
              <button class="planner-card-delete" data-idx="${m._idx}" title="Eliminar">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
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

    cardsEl.querySelectorAll('.planner-card-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.dataset.idx);
        removeMeal(idx);
      });
    });

    document.getElementById('plannerAddBtn')?.addEventListener('click', openAddModal);
  }

  async function removeMeal(idx) {
    const meal = dayMeals[idx];
    if (!meal) return;

    if (meal.id) {
      try { await del(`/planner/${meal.id}`); } catch {}
    }

    dayMeals.splice(idx, 1);
    renderMealCards();
    logUsage('plan_item_removed');
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
