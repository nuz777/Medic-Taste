const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const API_BASE_URL = isDev
  ? 'http://localhost:3000'
  : 'https://medic-taste.vercel.app';

export const CONFIG = {
  API_URL: `${API_BASE_URL}/api`,
  API_BASE_URL: API_BASE_URL,
  STORAGE_KEYS: {
    TOKEN: 'tf_token',
    USER: 'tf_user',
  },
};