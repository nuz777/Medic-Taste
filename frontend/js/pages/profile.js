import { getUser, logout, resetOnboarding } from '../services/authService.js';
import { loadPreferences, hasCompletedQuestionnaire } from './questionnaire.js';
import { escapeHtml } from '../utils/escapeHtml.js';

export function renderProfile(container) {
  const user = getUser();
  const prefs = loadPreferences();
  const done = hasCompletedQuestionnaire();
  const initial = (user?.name || 'U')[0].toUpperCase();

  container.innerHTML = `
    <div class="profile-header">
      <h1>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:0.4rem;color:var(--primary)"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        Perfil
      </h1>
    </div>

    <div class="profile-card">
      <div class="profile-avatar-section">
        <div class="profile-avatar" id="profileAvatar">
          <svg viewBox="0 0 80 80" width="80" height="80">
            <circle cx="40" cy="40" r="40" fill="var(--primary-light)"/>
            <text x="40" y="40" text-anchor="middle" dominant-baseline="central" fill="var(--primary)" font-size="28" font-weight="700" font-family="Inter, sans-serif">${escapeHtml(initial)}</text>
          </svg>
        </div>
      </div>

      <div class="profile-card-field">
        <label>Nombre</label>
        <p>${escapeHtml(user?.name || '—')}</p>
      </div>
      <div class="profile-card-field">
        <label>Email</label>
        <p>${escapeHtml(user?.email || '—')}</p>
      </div>

      ${done && prefs ? `
        <div class="profile-preferences">
          <h3>Preferencias alimenticias</h3>
          <div class="profile-pref-tags">
            ${prefs.diet ? `<span class="tag tag-primary">${getDietLabel(prefs.diet)}</span>` : ''}
            ${prefs.goal ? `<span class="tag tag-success">${getGoalLabel(prefs.goal)}</span>` : ''}
            ${prefs.meals ? `<span class="tag tag-primary">${escapeHtml(prefs.meals)} comidas/día</span>` : ''}
            ${prefs.cookTime ? `<span class="tag tag-primary">${getCookTimeLabel(prefs.cookTime)}</span>` : ''}
            ${Array.isArray(prefs.allergies) ? prefs.allergies.filter(a => a !== 'none').map(a => `<span class="tag" style="background:var(--error-light);color:var(--error)">${escapeHtml(a)}</span>`).join('') : ''}
          </div>
        </div>
      ` : `
        <div class="profile-preferences">
          <h3>Preferencias alimenticias</h3>
          <p style="color:var(--text-secondary);font-size:0.9rem">No has realizado el cuestionario aún.</p>
          <button class="btn btn-primary" id="goToQuestionnaire" style="margin-top:0.75rem">Comenzar cuestionario</button>
        </div>
      `}

      <div class="profile-actions">
        <button class="btn btn-outline" id="redoQuestionnaire">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
          Repetir cuestionario
        </button>
        <button class="btn btn-outline" id="logoutBtn" style="margin-left:auto">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          Cerrar sesión
        </button>
      </div>
    </div>
  `;

  document.getElementById('redoQuestionnaire')?.addEventListener('click', async () => {
    localStorage.removeItem('tf_questionnaire_done');
    await resetOnboarding().catch(() => {});
    window.location.href = '/onboarding.html';
  });

  document.getElementById('goToQuestionnaire')?.addEventListener('click', () => {
    window.location.href = '/onboarding.html';
  });

  document.getElementById('logoutBtn').addEventListener('click', logout);
}

function getDietLabel(val) {
  const labels = { omnivore: 'Omnívoro', vegetarian: 'Vegetariano', vegan: 'Vegano', keto: 'Keto', pescatarian: 'Pescetariano' };
  return labels[val] || val;
}

function getGoalLabel(val) {
  const labels = { lose: 'Perder peso', maintain: 'Mantener peso', gain: 'Ganar músculo', energy: 'Más energía' };
  return labels[val] || val;
}

function getCookTimeLabel(val) {
  const labels = { quick: 'Rápido', moderate: 'Moderado', elaborate: 'Elaborado' };
  return labels[val] || val;
}
