import { get } from '../services/api.js';
import { getUser } from '../services/authService.js';
import { showToast } from '../utils/toast.js';

function nameToSlug(name) {
  return name
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function recipeImgFallback(name, photoUrl) {
  const slug = nameToSlug(name);
  const jpg = `assets/images/recipes/${slug}.jpg`;
  const svg = `assets/images/recipes/${slug}.svg`;
  if (photoUrl) {
    return `<img src="${photoUrl}" alt="${name}" loading="lazy" onerror="var s=this;if(!s.dataset.f){s.dataset.f=1;s.src='${jpg}'}else if(!s.dataset.g){s.dataset.g=1;s.src='${svg}'}else{s.style.display='none';s.nextElementSibling.style.display='flex'}"><div class="recipe-mini-placeholder" style="display:none">${name.charAt(0).toUpperCase()}</div>`;
  }
  return `<img src="${jpg}" alt="${name}" loading="lazy" onerror="var s=this;if(!s.dataset.f){s.dataset.f=1;s.src='${svg}'}else{s.style.display='none';s.nextElementSibling.style.display='flex'}"><div class="recipe-mini-placeholder" style="display:none">${name.charAt(0).toUpperCase()}</div>`;
}

function calculateStreak() {
  const plan = JSON.parse(localStorage.getItem('tf_week_plan') || '{}');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let streak = 0;
  let checkDate = new Date(today);

  while (true) {
    const dateStr = checkDate.toISOString().split('T')[0];
    const meals = plan[dateStr];
    if (meals && meals.length >= 2) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

function getStreakMessage(streak) {
  const pool = {
    0: ['Planifica tus comidas para hoy!', 'Tu cuerpo merece lo mejor hoy'],
    1: ['Primer dia! El mejor momento para empezar fue ayer, el segundo es hoy', 'Bien empezado! Cada paso cuenta'],
    2: ['2 dias seguidos! Tu yo del futuro te lo va a agradecer', 'Dos dias seguidos, el habito esta naciendo'],
    3: ['3 dias! Ya estas en racha, no pares', 'Tres dias seguidos, tu disciplina brilla'],
    4: ['4 dias! La constancia es tu superpoder', 'Cuatro dias! Ya vas por buen camino'],
    5: ['5 dias! Eres una maquina de salud', 'Una semana casi completa, sigue asi!'],
    6: ['6 dias! Un dia mas y cierras la semana', 'Casi una semana entera, increible!'],
    7: ['Una semana entera! Eres una leyenda', '7 dias seguidos! Tu cuerpo te esta felicitando'],
    8: ['8 dias! Ya superaste a la mayoria', 'Segunda semana, misma energia!'],
    10: ['10 dias! Tu disciplina es inspiradora', 'Dos digitos! Eres imparable'],
    14: ['2 semanas! Lifestyle confirmado', '14 dias! Ya es parte de tu identidad'],
    21: ['3 semanas! Esto ya es tu estilo de vida', '21 dias formaron un habito, lo lograste'],
    30: ['Un mes entero! Eres una inspiracion', '30 dias! Tu dedicacion no tiene limites'],
  };
  let range = 0;
  for (const key of Object.keys(pool).map(Number).sort((a, b) => a - b)) {
    if (streak >= key) range = key;
  }
  const options = pool[range];
  return options[Math.floor(Math.random() * options.length)];
}

export async function renderDashboard(container) {
  const user = getUser();
  const firstName = user?.name?.split(' ')[0] || 'Usuario';
  const streak = calculateStreak();

  container.innerHTML = `
    <div class="dashboard-banner">
      <div class="dashboard-banner-decoration"></div>
      <div class="dashboard-banner-content">
        <h1>Bienvenido, ${firstName}</h1>
        <p>Resumen de tu actividad nutricional</p>
      </div>
    </div>

    ${streak > 0 ? `
    <div class="streak-bar">
      <div class="streak-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
      </div>
      <div style="flex:1">
        <div class="streak-text-title">${streak} ${streak === 1 ? 'dia' : 'dias'} seguido${streak > 1 ? 's' : ''}</div>
        <div class="streak-text-msg">${getStreakMessage(streak)}</div>
      </div>
      <div class="streak-fire">${streak}🔥</div>
    </div>
    ` : ''}

    <div class="stats-row" id="statsRow"></div>

    <div class="quick-access">
      <h2>Acceso rápido</h2>
      <div class="quick-access-grid">
        <a href="#planner" class="quick-card" data-page="planner">
          <div class="quick-card-icon qc-planner">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
              <path d="M8 14h.01"></path><path d="M12 14h.01"></path><path d="M16 14h.01"></path>
              <path d="M8 18h.01"></path><path d="M12 18h.01"></path><path d="M16 18h.01"></path>
            </svg>
          </div>
          <span>Planificador <small>Organiza tu semana</small></span>
        </a>
        <a href="#favorites" class="quick-card" data-page="favorites">
          <div class="quick-card-icon qc-favs">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
          <span>Favoritos <small>Tus recetas guardadas</small></span>
        </a>
        <a href="#shopping" class="quick-card" data-page="shopping">
          <div class="quick-card-icon qc-shop">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
          <span>Lista de compras <small>Tus ingredientes</small></span>
        </a>
        <a href="#profile" class="quick-card" data-page="profile">
          <div class="quick-card-icon qc-profile">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <span>Perfil <small>Tu información</small></span>
        </a>
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="dashboard-card">
        <div class="dashboard-card-header">
          <h3>Progreso semanal</h3>
          <span class="tag tag-primary" style="font-size:0.72rem">7 dias</span>
        </div>
        <div class="dashboard-card-body">
          <div class="progress-chart">
            <canvas id="progressChart" width="500" height="200"></canvas>
          </div>
          <div class="progress-summary" id="progressSummary"></div>
        </div>
      </div>

      <div class="dashboard-card">
        <div class="dashboard-card-header">
          <h3>Comidas de hoy</h3>
          <a href="#planner" style="font-size:0.75rem;color:var(--primary);font-weight:500">Ver todo</a>
        </div>
        <div class="dashboard-card-body">
          <div class="meal-list" id="mealList"></div>
        </div>
      </div>
    </div>

    <div class="section-label">
      Recetas mas vistas
      <a href="#recipes">Ver todas</a>
    </div>
    <div class="recipe-mini-list" id="recipeList"></div>

  `;

  loadStats();
  loadTodayMeals();
  loadRanking();
  setTimeout(() => { drawChart(); setupChartClick(document.getElementById('progressChart')); }, 100);

  if (streak >= 3) {
    const streakToasts = [
      `${streak} dias seguidos! Tu disciplina es inspiradora`,
      `Llevas ${streak} dias! Sigue asi, lo estas logrando`,
      `${streak} dias de racha! Tu cuerpo te lo esta agradeciendo`,
      `Wow! ${streak} dias seguidos, eres una maquina`,
    ];
    setTimeout(() => showToast(streakToasts[Math.floor(Math.random() * streakToasts.length)], 'streak'), 1500);
  } else if (streak === 0) {
    const zeroToasts = [
      'Planifica tus comidas de hoy para empezar tu racha!',
      'Hoy es el dia perfecto para empezar tu racha',
      'Empieza tu racha hoy, tu cuerpo te lo merece',
    ];
    setTimeout(() => showToast(zeroToasts[Math.floor(Math.random() * zeroToasts.length)], 'info'), 2000);
  }

  container.querySelectorAll('.quick-card').forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const page = card.dataset.page;
      if (page) window.location.hash = page;
    });
  });
}

async function loadStats() {
  const row = document.getElementById('statsRow');
  try {
    const [summary, daily] = await Promise.all([
      get('/stats/summary'),
      get('/stats/daily?days=7'),
    ]);

    const todayStr = new Date().toISOString().split('T')[0];
    const todayActions = Array.isArray(daily) ? daily.filter(d => d.date === todayStr) : [];
    const todayViews = todayActions.filter(d => d.action_type === 'recipe_viewed').reduce((s, d) => s + d.count, 0);
    const todayPlans = todayActions.filter(d => d.action_type === 'plan_created').reduce((s, d) => s + d.count, 0);

    const icons = {
      recipes: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path><line x1="8" y1="7" x2="16" y2="7"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>`,
      favorites: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`,
      planned: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
      ingredients: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>`,
    };

    const stats = [
      { icon: icons.recipes, iconClass: 'green', value: String(summary.recipes || 0), label: 'Recetas' },
      { icon: icons.favorites, iconClass: 'red', value: String(summary.favorites || 0), label: 'Favoritos' },
      { icon: icons.planned, iconClass: 'blue', value: String(summary.plannedMeals || 0), label: 'Comidas planificadas' },
      { icon: icons.ingredients, iconClass: 'orange', value: String(summary.ingredients || 0), label: 'Ingredientes' },
    ];

    stats.forEach(s => row.appendChild(createStatCard(s)));
  } catch {
    const fallbackIcons = {
      recipes: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path><line x1="8" y1="7" x2="16" y2="7"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>`,
      favorites: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`,
      planned: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
      ingredients: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>`,
    };
    const fallback = [
      { icon: fallbackIcons.recipes, iconClass: 'green', value: '—', label: 'Recetas' },
      { icon: fallbackIcons.favorites, iconClass: 'red', value: '—', label: 'Favoritos' },
      { icon: fallbackIcons.planned, iconClass: 'blue', value: '—', label: 'Comidas planificadas' },
      { icon: fallbackIcons.ingredients, iconClass: 'orange', value: '—', label: 'Ingredientes' },
    ];
    fallback.forEach(s => row.appendChild(createStatCard(s)));
  }
}

function createStatCard({ icon, iconClass, value, label }) {
  const card = document.createElement('div');
  card.className = 'stat-card';
  card.innerHTML = `
    <div class="stat-card-icon ${iconClass}">${icon}</div>
    <div class="stat-card-body">
      <div class="stat-card-value">${value}</div>
      <div class="stat-card-label">${label}</div>
    </div>`;
  return card;
}

function loadTodayMeals() {
  const list = document.getElementById('mealList');
  try {
    const weekPlan = JSON.parse(localStorage.getItem('tf_week_plan') || '{}');
    const todayStr = new Date().toISOString().split('T')[0];
    const todayMeals = weekPlan[todayStr] || [];
    const mealSvg = {
      desayuno: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>`,
      almuerzo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M2 12h20"></path><path d="M2 18h20"></path><path d="M2 6h20"></path></svg>`,
      cena: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M3 3l18 18"></path><path d="M21 3l-18 18"></path></svg>`,
      snack: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>`,
    };
    const labels = { desayuno: 'Desayuno', almuerzo: 'Almuerzo', cena: 'Cena', snack: 'Snack' };
    const shortLabels = { desayuno: 'Des', almuerzo: 'Alm', cena: 'Cen', snack: 'Snack' };

    if (todayMeals.length) {
      todayMeals.forEach(m => {
        const item = document.createElement('div');
        item.className = 'meal-item';
        item.innerHTML = `
          <div class="meal-item-icon">${mealSvg[m.meal_type] || '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path><line x1="8" y1="7" x2="16" y2="7"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>'}</div>
          <div class="meal-item-info">
            <div class="meal-item-name">${labels[m.meal_type] || m.meal_type}</div>
            <div class="meal-item-cal">${m.recipe_name}</div>
          </div>
          <div class="meal-item-time">${shortLabels[m.meal_type] || m.meal_type}</div>`;
        list.appendChild(item);
      });
    } else {
      list.innerHTML = '<div style="text-align:center;padding:2rem 0;color:var(--text-muted);font-size:0.85rem">No hay comidas planificadas para hoy</div>';
    }
  } catch {
    list.innerHTML = '<div style="text-align:center;padding:2rem 0;color:var(--text-muted);font-size:0.85rem">No hay comidas planificadas para hoy</div>';
  }
}

async function loadRanking() {
  const list = document.getElementById('recipeList');
  try {
    const ranking = await get('/stats/ranking?limit=4');
    if (ranking.length) {
      ranking.forEach(r => {
        const card = document.createElement('div');
        card.className = 'recipe-mini-card';
        card.innerHTML = `
          <div class="recipe-mini-thumb">
            ${recipeImgFallback(r.name, r.photo_url)}
          </div>
          <div class="recipe-mini-info">
            <div class="recipe-mini-name">${r.name}</div>
            <div class="recipe-mini-meta">${r.views || 0} vistas</div>
          </div>`;
        list.appendChild(card);
      });
    } else {
      list.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:2rem;color:var(--text-muted);font-size:0.85rem">Aún no hay datos de visualización</div>';
    }
  } catch {
    list.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:2rem;color:var(--text-muted);font-size:0.85rem">Sin datos</div>';
  }
}

let chartPoints = [];

function drawChart() {
  const canvas = document.getElementById('progressChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const w = rect.width;
  const h = rect.height;
  const padding = 20;
  const chartW = w - padding * 2;
  const chartH = h - padding * 2;

  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const weekPlan = JSON.parse(localStorage.getItem('tf_week_plan') || '{}');
  const monday = getMonday(new Date());
  const values = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const ds = d.toISOString().split('T')[0];
    const meals = weekPlan[ds] || [];
    return meals.length;
  });
  const max = Math.max(5, ...values);

  const stepX = chartW / (days.length - 1);

  ctx.clearRect(0, 0, w, h);

  ctx.strokeStyle = '#E9F0EE';
  ctx.lineWidth = 1;
  [0, 0.25, 0.5, 0.75, 1].forEach(f => {
    const y = padding + chartH * (1 - f);
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(w - padding, y);
    ctx.stroke();
  });

  ctx.beginPath();
  ctx.moveTo(padding, padding + chartH);
  values.forEach((v, i) => {
    const x = padding + i * stepX;
    const y = padding + chartH * (1 - v / max);
    i === 0 ? ctx.lineTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.lineTo(padding + (values.length - 1) * stepX, padding + chartH);
  ctx.closePath();
  const grad = ctx.createLinearGradient(0, padding, 0, padding + chartH);
  grad.addColorStop(0, 'rgba(0, 137, 123, 0.2)');
  grad.addColorStop(1, 'rgba(0, 137, 123, 0.02)');
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.beginPath();
  ctx.strokeStyle = '#00897B';
  ctx.lineWidth = 3;
  ctx.lineJoin = 'round';
  values.forEach((v, i) => {
    const x = padding + i * stepX;
    const y = padding + chartH * (1 - v / max);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();

  chartPoints = [];
  values.forEach((v, i) => {
    const x = padding + i * stepX;
    const y = padding + chartH * (1 - v / max);
    chartPoints.push({ x, y, day: days[i], value: v, index: i });
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#00897B';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 137, 123, 0.2)';
    ctx.lineWidth = 3;
    ctx.stroke();
  });

  ctx.fillStyle = '#6B7280';
  ctx.font = '11px Inter, sans-serif';
  ctx.textAlign = 'center';
  days.forEach((d, i) => {
    const x = padding + i * stepX;
    ctx.fillText(d, x, h - 6);
  });

  ctx.fillStyle = '#00897B';
  ctx.font = 'bold 12px Inter, sans-serif';
  values.forEach((v, i) => {
    const x = padding + i * stepX;
    const y = padding + chartH * (1 - v / max) - 10;
    ctx.fillText(v > 0 ? v : '', x, y);
  });

  const total = values.reduce((a, b) => a + b, 0);
  const avg = (total / 7).toFixed(1);
  const maxVal = Math.max(...values);
  const bestDay = days[values.indexOf(maxVal)];
  const sum = document.getElementById('progressSummary');
  if (sum) {
    sum.innerHTML = `
      <div class="progress-stat"><span class="progress-stat-value">${total}</span><span class="progress-stat-label">Total comidas</span></div>
      <div class="progress-stat"><span class="progress-stat-value">${avg}</span><span class="progress-stat-label">Promedio/día</span></div>
      <div class="progress-stat"><span class="progress-stat-value">${maxVal > 0 ? maxVal : '—'}</span><span class="progress-stat-label">${maxVal > 0 ? 'Mejor día' : 'Sin datos'}</span></div>
      <div class="progress-stat"><span class="progress-stat-value">${maxVal > 0 ? bestDay : '—'}</span><span class="progress-stat-label">${maxVal > 0 ? 'Día pico' : ''}</span></div>
    `;
  }
}

let chartTooltip = null;

function removeChartTooltip() {
  if (chartTooltip) { chartTooltip.remove(); chartTooltip = null; }
}

function setupChartClick(canvas) {
  canvas.addEventListener('click', function (e) {
    removeChartTooltip();
    const rect = this.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    let closest = null, minDist = Infinity;
    chartPoints.forEach(p => {
      const d = Math.hypot(mx - p.x, my - p.y);
      if (d < minDist) { minDist = d; closest = p; }
    });
    if (!closest || minDist > 30) return;
    const tip = document.createElement('div');
    tip.className = 'chart-tooltip';
    const ds = closest.day;
    const shortNames = { Lun: 'lunes', Mar: 'martes', Mié: 'miércoles', Jue: 'jueves', Vie: 'viernes', Sáb: 'sábado', Dom: 'domingo' };
    const dayName = shortNames[ds] || ds;
    const comida = closest.value === 1 ? 'comida' : 'comidas';
    tip.innerHTML = `
      <strong>${ds}</strong><br>
      <span style="font-size:0.85rem">${closest.value} ${comida} planificadas</span>
      <a href="#planner" class="chart-tooltip-link">Ir al planificador →</a>
    `;
    const parent = canvas.parentElement;
    parent.style.position = 'relative';
    parent.appendChild(tip);
    const posX = closest.x + 10;
    const tipW = 160;
    const parentRect = parent.getBoundingClientRect();
    const adjustedX = Math.min(posX, parentRect.width - tipW - 10);
    tip.style.left = Math.max(10, adjustedX) + 'px';
    tip.style.top = (closest.y - 20) + 'px';
    chartTooltip = tip;
  });
  canvas.addEventListener('mouseleave', removeChartTooltip);
}

function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day + (day === 0 ? -6 : 1));
  d.setHours(0, 0, 0, 0);
  return d;
}
