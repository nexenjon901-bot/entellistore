import { jwtDecode } from 'jwt-decode';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  const userStr = localStorage.getItem('entelli_user');
  let token = null;
  if (userStr) {
    try { token = JSON.parse(userStr).token; } catch {}
  }
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Server xatosi');
  }
  return data;
}

export const api = {
  health: () => request('/health'),
  fetchData: () => request('/data'),
  register: body => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: body => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  googleLogin: async (credential) => {
    const decoded = jwtDecode(credential);
    return request('/auth/google', {
      method: 'POST',
      body: JSON.stringify({
        googleId: decoded.sub,
        email: decoded.email,
        name: decoded.name,
      }),
    });
  },
  createOrder: body => request('/orders', { method: 'POST', body: JSON.stringify(body) }),
  updateOrder: (id, body) => request(`/orders/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteOrder: id => request(`/orders/${id}`, { method: 'DELETE' }),
  createProduct: body => request('/products', { method: 'POST', body: JSON.stringify(body) }),
  deleteProduct: id => request(`/products/${id}`, { method: 'DELETE' }),
  sendMessage: body => request('/support/messages', { method: 'POST', body: JSON.stringify(body) }),
  updateUser: (id, body) => request(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
};
