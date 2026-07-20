const isDev = process.env.NODE_ENV !== 'production';

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