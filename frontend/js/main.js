import { renderDashboard } from './pages/dashboard.js';
import { hasCompletedQuestionnaire } from './pages/questionnaire.js';
import { renderRecipes } from './pages/recipes.js';
import { renderPlanner } from './pages/planner.js';
import { renderPlans } from './pages/plans.js';
import { renderFavorites } from './pages/favorites.js';
import { renderShopping } from './pages/shopping.js';
import { renderProfile } from './pages/profile.js';
import { getUser, isAuthenticated, logout, getMe } from './services/authService.js';

const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const menuToggle = document.getElementById('menuToggle');
const sidebarClose = document.getElementById('sidebarClose');
const sidebarToggle = document.getElementById('sidebarToggle');
const pageContent = document.getElementById('pageContent');
const sidebarLinks = document.querySelectorAll('.sidebar-link');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const userAvatar = document.getElementById('userAvatar');

if (!isAuthenticated()) {
  window.location.href = '/login.html';
}

function toggleSidebar(open) {
  sidebar.classList.toggle('open', open);
  sidebarOverlay.classList.toggle('open', open);
}

menuToggle.addEventListener('click', () => toggleSidebar(true));
sidebarClose.addEventListener('click', () => toggleSidebar(false));
sidebarOverlay.addEventListener('click', () => toggleSidebar(false));
sidebarToggle.addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
  document.body.classList.toggle('sidebar-collapsed');
  sidebarToggle.textContent = sidebar.classList.contains('collapsed') ? '▶' : '◀';
});

// Dark mode toggle
const darkToggle = document.getElementById('darkToggle');
const darkLabel = document.getElementById('darkLabel');
const savedTheme = localStorage.getItem('tf_theme');

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    darkLabel.textContent = 'Modo claro';
  } else if (theme === 'light') {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
    darkLabel.textContent = 'Modo oscuro';
  } else {
    document.documentElement.classList.remove('dark', 'light');
    darkLabel.textContent = 'Modo oscuro';
  }
}

applyTheme(savedTheme || 'auto');

darkToggle.addEventListener('click', () => {
  const isDark = document.documentElement.classList.contains('dark') ||
    (!document.documentElement.classList.contains('light') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const next = isDark ? 'light' : 'dark';
  localStorage.setItem('tf_theme', next);
  applyTheme(next);
});

function updateSidebarUser(user) {
  userName.textContent = user.name || 'Usuario';
  userEmail.textContent = user.email || '';
  const initial = (user.name || 'U')[0].toUpperCase();
  userAvatar.innerHTML = `
    <svg viewBox="0 0 36 36" width="36" height="36">
      <circle cx="18" cy="18" r="18" fill="var(--primary-light)"/>
      <text x="18" y="18" text-anchor="middle" dominant-baseline="central" fill="var(--primary)" font-size="14" font-weight="700" font-family="Inter, sans-serif">${initial}</text>
    </svg>`;
}

let user = getUser();
if (user) {
  updateSidebarUser(user);
}

const routes = {
  dashboard: renderDashboard,
  recipes: renderRecipes,
  planner: renderPlanner,
  plans: renderPlans,
  favorites: renderFavorites,
  shopping: renderShopping,
  profile: renderProfile,
};

function getPageFromHash() {
  return window.location.hash.replace('#', '') || 'dashboard';
}

function navigate(page) {
  sidebarLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.page === page);
  });

  toggleSidebar(false);

  const render = routes[page];
  if (render) {
    pageContent.innerHTML = '';
    render(pageContent);
  } else {
    pageContent.innerHTML = `
      <div style="text-align:center;padding:4rem 1rem;color:var(--text-secondary);">
        <h2>Próximamente</h2>
        <p>La vista "${page}" está en desarrollo.</p>
      </div>`;
  }
}

sidebarLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const page = link.dataset.page;
    window.location.hash = page;
  });
});

(async function init() {
  try {
    const serverUser = await getMe();
    if (serverUser) {
      user = serverUser;
      localStorage.setItem('tf_user', JSON.stringify(serverUser));
      if (!serverUser.onboarding_completed) localStorage.removeItem('tf_questionnaire_done');
      updateSidebarUser(serverUser);
    }
  } catch {}

  if (!hasCompletedQuestionnaire()) {
    window.location.href = '/onboarding.html';
    return;
  }

  window.addEventListener('hashchange', () => {
    navigate(getPageFromHash());
  });

  navigate(getPageFromHash());

  // Toast recommendations
  const TOAST_TIPS = [
    { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>', title: 'Desayuno saludable', desc: 'Una buena base de proteína te da energía todo el día.', route: 'recipes' },
    { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>', title: 'No olvides hidratarte', desc: 'Beber agua mejora tu digestión y concentración.', route: 'dashboard' },
    { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>', title: 'Revisa tu progreso semanal', desc: 'Las barras de macros te muestran cómo vas.', route: 'plans' },
    { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>', title: 'Planifica el almuerzo', desc: 'Tener un plan reduce malas decisiones alimenticias.', route: 'planner' },
    { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>', title: 'Prepara tu lista', desc: 'Ingredientes frescos = comidas más nutritivas.', route: 'shopping' },
    { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>', title: 'Busca recetas nuevas', desc: 'Variety es la clave para no aburrirte de tu dieta.', route: 'recipes' },
    { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>', title: 'Hora de cenar', desc: 'Cena ligera y rica en proteína para mejor descanso.', route: 'recipes' },
    { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>', title: 'Guarda tus favoritos', desc: 'Las recetas que más te gustan siempre a mano.', route: 'favorites' },
  ];

  let toastIdx = 0;

  function showToast(tip) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const dur = 5000;
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `
      <div class="toast-body">
        <div class="toast-icon">${tip.icon}</div>
        <div class="toast-text">
          <div class="toast-title">${tip.title}</div>
          <div class="toast-desc">${tip.desc}</div>
        </div>
      </div>
      <button class="toast-close" aria-label="Cerrar">&times;</button>
      <div class="toast-progress" style="animation-duration:${dur}ms"></div>`;
    t.addEventListener('click', e => {
      if (e.target.closest('.toast-close')) return;
      dismissToast(t);
      window.location.hash = tip.route;
    });
    t.querySelector('.toast-close').addEventListener('click', e => {
      e.stopPropagation();
      dismissToast(t);
    });
    container.appendChild(t);
    t._timer = setTimeout(() => dismissToast(t), dur);
  }

  function dismissToast(t) {
    if (t._done) return;
    t._done = true;
    clearTimeout(t._timer);
    t.classList.add('dismissing');
    t.addEventListener('animationend', () => t.remove());
  }

  let toastInterval = null;
  function startToasts() {
    showToast(TOAST_TIPS[toastIdx % TOAST_TIPS.length]);
    toastIdx++;
    toastInterval = setInterval(() => {
      showToast(TOAST_TIPS[toastIdx % TOAST_TIPS.length]);
      toastIdx++;
    }, 30000 + Math.random() * 20000);
  }

  setTimeout(startToasts, 8000);
})();
