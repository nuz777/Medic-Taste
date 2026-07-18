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
})();
