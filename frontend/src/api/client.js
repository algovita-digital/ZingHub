import { API_URL } from '../config.js';

async function request(path, { method = 'GET', body, adminKey, isForm = false } = {}) {
  const headers = {};
  if (!isForm && body) headers['Content-Type'] = 'application/json';
  if (adminKey) headers['x-admin-key'] = adminKey;

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
    });
  } catch {
    throw new Error('Network error. Please check your connection and try again.');
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}

export const api = {
  getProduct: () => request('/products/main'),
  createOrder: (order) => request('/orders', { method: 'POST', body: order }),
  getReviews: () => request('/reviews'),
  createReview: (formData) => request('/reviews', { method: 'POST', body: formData, isForm: true }),

  // admin
  checkAdmin: (key) => request('/products/admin/check', { adminKey: key }),
  getOrders: (key) => request('/orders', { adminKey: key }),
  updateOrderStatus: (id, status, key) => request(`/orders/${id}/status`, { method: 'PATCH', body: { status }, adminKey: key }),
  deleteOrder: (id, key) => request(`/orders/${id}`, { method: 'DELETE', adminKey: key }),
  uploadProductImage: (id, file, key) => {
    const fd = new FormData();
    fd.append('image', file);
    return request(`/products/${id}/images`, { method: 'POST', body: fd, isForm: true, adminKey: key });
  },
  deleteProductImage: (id, imageId, key) => request(`/products/${id}/images/${imageId}`, { method: 'DELETE', adminKey: key }),
  makePrimaryImage: (id, imageId, key) => request(`/products/${id}/images/${imageId}/primary`, { method: 'PATCH', adminKey: key }),
};
