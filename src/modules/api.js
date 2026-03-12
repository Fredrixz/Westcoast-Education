import { API_URL as BASE_URL, API_KEY } from '../config.js';

// RestDB använder _id – vi normaliserar till id för enklare hantering
function normalize(data) {
  if (Array.isArray(data)) return data.map(normalize);
  if (data && data._id) return { ...data, id: data._id };
  return data;
}

async function request(endpoint, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      'x-apikey': API_KEY,
      'cache-control': 'no-cache',
    },
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`);
  const data = await res.json();
  return normalize(data);
}

// Hjälpfunktion för att bygga RestDB query-filter
export function q(filter) {
  return `?q=${encodeURIComponent(JSON.stringify(filter))}`;
}

export const api = {
  get: (endpoint) => request(endpoint),
  post: (endpoint, body) => request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};
