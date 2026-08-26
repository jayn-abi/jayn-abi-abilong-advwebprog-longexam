const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const TOKEN_KEY = 'bulldogex_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

const FALLBACK_MESSAGES = {
  400: 'That request was invalid. Please check the form and try again.',
  401: 'You need to be signed in to do that.',
  403: "You don't have permission to do that.",
  404: 'We could not find what you were looking for.',
  409: 'That already exists. Please use a different value.',
  500: 'Something went wrong on our end. Please try again later.',
};

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.message || FALLBACK_MESSAGES[res.status] || 'Something went wrong. Please try again.');
    error.status = res.status;
    throw error;
  }

  return data;
}

export const authApi = {
  login: (email, password) => request('/api/users/login', { method: 'POST', body: { email, password } }),
  signup: (payload) => request('/api/users/register', { method: 'POST', body: payload }),
};

export const usersApi = {
  me: () => request('/api/users/me', { auth: true }),
  updateMe: (payload) => request('/api/users/me', { method: 'PUT', auth: true, body: payload }),
  changeMyPassword: (payload) => request('/api/users/me/password', { method: 'PUT', auth: true, body: payload }),
  list: () => request('/api/users', { auth: true }),
  get: (id) => request(`/api/users/${id}`, { auth: true }),
  update: (id, payload) => request(`/api/users/${id}`, { method: 'PUT', auth: true, body: payload }),
  remove: (id) => request(`/api/users/${id}`, { method: 'DELETE', auth: true }),
};

export const productsApi = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/api/products${query ? `?${query}` : ''}`);
  },
  get: (id) => request(`/api/products/${id}`),
  mine: () => request('/api/products/mine', { auth: true }),
  create: (payload) => request('/api/products', { method: 'POST', auth: true, body: payload }),
  update: (id, payload) => request(`/api/products/${id}`, { method: 'PUT', auth: true, body: payload }),
  remove: (id) => request(`/api/products/${id}`, { method: 'DELETE', auth: true }),
};

export const categoriesApi = {
  list: () => request('/api/categories'),
};

export const suppliersApi = {
  list: () => request('/api/suppliers'),
  me: () => request('/api/suppliers/me', { auth: true }),
  updateMe: (payload) => request('/api/suppliers/me', { method: 'PUT', auth: true, body: payload }),
};

export const reviewsApi = {
  forProduct: (productId) => request(`/api/products/${productId}/reviews`),
  all: () => request('/api/reviews', { auth: true }),
  create: (payload) => request('/api/reviews', { method: 'POST', auth: true, body: payload }),
  update: (id, payload) => request(`/api/reviews/${id}`, { method: 'PUT', auth: true, body: payload }),
  remove: (id) => request(`/api/reviews/${id}`, { method: 'DELETE', auth: true }),
};

export const cartApi = {
  get: () => request('/api/cart', { auth: true }),
  addItem: (productId, quantity = 1) =>
    request('/api/cart', { method: 'POST', auth: true, body: { productId, quantity } }),
  updateItem: (productId, quantity) =>
    request(`/api/cart/${productId}`, { method: 'PUT', auth: true, body: { quantity } }),
  removeItem: (productId) => request(`/api/cart/${productId}`, { method: 'DELETE', auth: true }),
  clear: () => request('/api/cart', { method: 'DELETE', auth: true }),
};

export const ordersApi = {
  create: (payload) => request('/api/orders', { method: 'POST', auth: true, body: payload }),
  mine: () => request('/api/orders/mine', { auth: true }),
  get: (id) => request(`/api/orders/${id}`, { auth: true }),
  all: (status) => request(`/api/orders/admin${status ? `?status=${status}` : ''}`, { auth: true }),
  updateStatus: (id, status) => request(`/api/orders/${id}/status`, { method: 'PUT', auth: true, body: { status } }),
  remove: (id) => request(`/api/orders/${id}`, { method: 'DELETE', auth: true }),
};
