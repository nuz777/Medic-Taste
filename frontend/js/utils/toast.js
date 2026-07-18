import { escapeHtml } from './escapeHtml.js';

let toastContainer = null;

function ensureContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:10px;pointer-events:none;';
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

export function showToast(message, type = 'info', duration = 4000) {
  const container = ensureContainer();

  const icons = {
    success: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
    info: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
    streak: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>',
  };

  const colors = {
    success: { bg: '#E8F5E9', border: '#4CAF50', text: '#2E7D32' },
    info: { bg: '#E3F2FD', border: '#2196F3', text: '#1565C0' },
    streak: { bg: '#FFF3E0', border: '#FF9800', text: '#E65100' },
  };
  const darkColors = {
    success: { bg: '#1A3A1F', border: '#4CAF50', text: '#81C784' },
    info: { bg: '#152535', border: '#2196F3', text: '#64B5F6' },
    streak: { bg: '#2E2510', border: '#FF9800', text: '#FFB74D' },
  };

  const isDark = document.documentElement.classList.contains('dark') ||
    (!document.documentElement.classList.contains('light') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const palette = isDark ? darkColors : colors;
  const color = palette[type] || palette.info;

  const toast = document.createElement('div');
  toast.style.cssText = `
    pointer-events:auto;
    display:flex;align-items:center;gap:10px;
    padding:12px 18px;
    background:${color.bg};
    border:1.5px solid ${color.border};
    border-radius:12px;
    box-shadow:0 8px 24px rgba(0,0,0,0.12);
    color:${color.text};
    font-size:13px;font-weight:500;
    font-family:var(--font);
    animation:toastSlideIn 0.35s cubic-bezier(0.4,0,0.2,1) forwards;
    max-width:320px;
  `;
  toast.innerHTML = `<span style="flex-shrink:0;display:flex">${icons[type] || icons.info}</span><span>${escapeHtml(message)}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toastSlideOut 0.3s cubic-bezier(0.4,0,0.2,1) forwards';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

const toastStyles = document.createElement('style');
toastStyles.textContent = `
  @keyframes toastSlideIn {
    from { opacity:0;transform:translateX(40px); }
    to { opacity:1;transform:translateX(0); }
  }
  @keyframes toastSlideOut {
    from { opacity:1;transform:translateX(0); }
    to { opacity:0;transform:translateX(40px); }
  }
`;
document.head.appendChild(toastStyles);
