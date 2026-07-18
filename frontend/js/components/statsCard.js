import { escapeHtml } from '../utils/escapeHtml.js';

export function createStatsCard({ icon, iconClass, value, label, change, changeDir }) {
  const card = document.createElement('div');
  card.className = 'stat-card-modern animate-on-scroll';

  card.innerHTML = `
    <div class="stat-card-icon ${iconClass}">${icon}</div>
    <div class="stat-card-body">
      <div class="stat-card-value">${escapeHtml(String(value))}</div>
      <div class="stat-card-label">${escapeHtml(label)}</div>
      ${change ? `<div class="stat-card-change ${changeDir}">${escapeHtml(change)}</div>` : ''}
    </div>`;

  return card;
}
