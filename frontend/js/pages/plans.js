import { get } from '../services/api.js';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const DAYS_FULL = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day + (day === 0 ? -6 : 1));
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function renderPlans(container) {
  container.innerHTML = `
    <div class="plans-header">
      <h1>Progreso</h1>
      <p>Monitorea tu avance nutricional</p>
    </div>

    <div class="plans-goal">
      <div class="plans-goal-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"></path></svg>
        Weight Loss Goal
      </div>
      <div class="plans-goal-stats">
        <div class="plans-goal-stat">
          <span class="plans-goal-stat-value" id="goalWeight">70 kg</span>
          <span class="plans-goal-stat-label">Goal Weight</span>
        </div>
        <div class="plans-goal-stat">
          <span class="plans-goal-stat-value" id="goalRateKg">0.5 kg</span>
          <span class="plans-goal-stat-label">Goal Rate</span>
        </div>
        <div class="plans-goal-stat">
          <span class="plans-goal-stat-value" id="goalRatePct">0.7%</span>
          <span class="plans-goal-stat-label">Goal Rate %</span>
        </div>
      </div>
    </div>

    <div class="plans-chart">
      <div class="plans-chart-header">
        <span class="plans-chart-title">Coached Program</span>
        <div class="plans-chart-legend">
          <div class="plans-chart-legend-item">
            <span class="plans-chart-legend-dot" style="background:var(--macro-protein)"></span> Protein
          </div>
          <div class="plans-chart-legend-item">
            <span class="plans-chart-legend-dot" style="background:var(--macro-carbs)"></span> Carbs
          </div>
          <div class="plans-chart-legend-item">
            <span class="plans-chart-legend-dot" style="background:var(--macro-fat)"></span> Fat
          </div>
          <select class="plans-chart-select" id="chartRange">
            <option value="week" selected>Weekly</option>
          </select>
        </div>
      </div>
      <div class="plans-bars" id="chartBars"></div>
    </div>

    <div class="plans-stats" id="statsGrid"></div>
  `;

  loadGoalStats();
  loadChart();
  loadStatsGrid();
}

async function loadGoalStats() {
  try {
    const user = await get('/auth/me');
    if (user) {
      const prefs = JSON.parse(localStorage.getItem('tf_preferences') || '{}');
      if (prefs.goal_weight) document.getElementById('goalWeight').textContent = prefs.goal_weight + ' kg';
      if (prefs.goal_rate) document.getElementById('goalRateKg').textContent = prefs.goal_rate + ' kg';
    }
  } catch {}
}

async function loadChart() {
  const el = document.getElementById('chartBars');
  const monday = getMonday(new Date());
  const start = monday.toISOString().split('T')[0];
  const end = new Date(monday.getTime() + 6 * 86400000).toISOString().split('T')[0];

  try {
    const weekData = await get(`/nutrition/week?start=${start}&end=${end}`);

    const dataByDate = {};
    weekData.forEach(d => {
      const key = typeof d.plan_date === 'string' ? d.plan_date.split('T')[0] : d.plan_date;
      dataByDate[key] = d;
    });

    const dayEntries = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const ds = d.toISOString().split('T')[0];
      return {
        label: DAYS[i],
        fullDay: DAYS_FULL[d.getDay()],
        protein: Number(dataByDate[ds]?.total_protein) || 0,
        carbs: Number(dataByDate[ds]?.total_carbs) || 0,
        fat: Number(dataByDate[ds]?.total_fat) || 0,
      };
    });

    const maxTotal = Math.max(10, ...dayEntries.map(d => d.protein + d.carbs + d.fat));

    const containerH = el.clientHeight || 260;
    const labelH = 20;
    const maxBarH = containerH - labelH - 8;

    el.innerHTML = dayEntries.map((d, idx) => {
      const total = d.protein + d.carbs + d.fat;
      const barH = total > 0 ? Math.max(12, (total / maxTotal) * maxBarH) : 4;
      const pPct = total > 0 ? (d.protein / total) * 100 : 0;
      const cPct = total > 0 ? (d.carbs / total) * 100 : 0;
      const fPct = total > 0 ? (d.fat / total) * 100 : 0;

      return `
        <div class="plans-bar-col">
          <div class="plans-bar-stack" style="height:${barH}px; animation-delay:${idx * 0.08}s">
            ${d.fat > 0 ? `<div class="plans-bar-segment fat" style="height:${fPct}%"></div>` : ''}
            ${d.carbs > 0 ? `<div class="plans-bar-segment carbs" style="height:${cPct}%"></div>` : ''}
            ${d.protein > 0 ? `<div class="plans-bar-segment protein" style="height:${pPct}%"></div>` : ''}
          </div>
          <span class="plans-bar-label">${d.label}</span>
        </div>`;
    }).join('');
  } catch {
    el.innerHTML = DAYS.map((d, idx) => `
      <div class="plans-bar-col">
        <div class="plans-bar-stack" style="height:4px; animation-delay:${idx * 0.08}s"></div>
        <span class="plans-bar-label">${d}</span>
      </div>`).join('');
  }
}

function loadStatsGrid() {
  const el = document.getElementById('statsGrid');

  const stats = [
    {
      icon: 'heart',
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>',
      value: '96 Bpm',
      label: 'Heart Rate',
    },
    {
      icon: 'water',
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>',
      value: '1200 ml',
      label: 'Water',
    },
    {
      icon: 'steps',
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>',
      value: '4352 Steps',
      label: 'Walk Steps',
    },
    {
      icon: 'sleep',
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>',
      value: '7h 36m',
      label: 'Sleep',
    },
  ];

  el.innerHTML = stats.map(s => `
    <div class="plans-stat-card">
      <div class="plans-stat-icon ${s.icon}">${s.svg}</div>
      <div class="plans-stat-info">
        <div class="plans-stat-value">${s.value}</div>
        <div class="plans-stat-label">${s.label}</div>
      </div>
    </div>
  `).join('');
}
