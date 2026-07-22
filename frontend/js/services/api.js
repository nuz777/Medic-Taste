import { CONFIG } from '../config.js';

class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const MAX_RETRIES = 2;
const RETRY_DELAY = 800;

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function request(endpoint, options = {}, retryCount = 0) {
  const token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${CONFIG.API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok && res.status >= 500 && retryCount < MAX_RETRIES) {
    await delay(RETRY_DELAY * (retryCount + 1));
    return request(endpoint, options, retryCount + 1);
  }

  let data;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await res.json();
  } else {
    data = { error: await res.text() || 'Error en la solicitud' };
  }

  if (!res.ok) {
    throw new ApiError(res.status, data.message || data.error || 'Error en la solicitud');
  }

  return data;
}

export function get(endpoint) {
  return request(endpoint, { method: 'GET' });
}

export function post(endpoint, body) {
  return request(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function put(endpoint, body) {
  return request(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export function del(endpoint) {
  return request(endpoint, { method: 'DELETE' });
}

export { ApiError };
