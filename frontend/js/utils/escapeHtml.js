const map = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
};

const regex = /[&<>"'`/]/g;

export function escapeHtml(str) {
  if (str == null) return '';
  return String(str).replace(regex, c => map[c]);
}

export function escapeAttr(str) {
  return escapeHtml(str);
}
