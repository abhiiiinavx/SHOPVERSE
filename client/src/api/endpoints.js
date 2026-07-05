import api from './axios.js';

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  verifyToken: () => api.get('/auth/verify-token'),
};

export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data, config) => api.post('/products', data, config),
  update: (id, data, config) => api.put(`/products/${id}`, data, config),
  delete: (id) => api.delete(`/products/${id}`),
  getFeatured: () => api.get('/products/featured'),
  getTrending: () => api.get('/products/trending'),
  getNewArrivals: () => api.get('/products/new-arrivals'),
};

export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data, config) => api.post('/categories', data, config),
  update: (id, data, config) => api.put(`/categories/${id}`, data, config),
  delete: (id) => api.delete(`/categories/${id}`),
};

export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (data) => api.post('/cart', data),
  updateCart: (itemId, data) => api.put(`/cart/${itemId}`, data),
  removeFromCart: (itemId) => api.delete(`/cart/${itemId}`),
  clearCart: () => api.delete('/cart'),
};

export const wishlistAPI = {
  getWishlist: () => api.get('/wishlist'),
  addToWishlist: (data) => api.post('/wishlist', data),
  removeFromWishlist: (productId) => api.delete(`/wishlist/${productId}`),
};

export const orderAPI = {
  createOrder: (data) => api.post('/orders', data),
  getOrders: () => api.get('/orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  updateOrderStatus: (id, data) => api.put(`/orders/${id}/status`, data),
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
  getAllOrders: () => api.get('/orders/admin/all'),
};

export const reviewAPI = {
  create: (data) => api.post('/reviews', data),
  getProductReviews: (productId) => api.get(`/reviews/product/${productId}`),
  getMyReviews: () => api.get('/reviews/my/reviews'),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
};

export const couponAPI = {
  getAll: () => api.get('/coupons'),
  validate: (data) => api.post('/coupons/validate', data),
  create: (data) => api.post('/coupons', data),
  update: (id, data) => api.put(`/coupons/${id}`, data),
  delete: (id) => api.delete(`/coupons/${id}`),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data, config) => api.put('/users/profile', data, config),
  getAllUsers: () => api.get('/users/all'),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUserStatus: (id, data) => api.put(`/users/${id}/status`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getSalesChart: () => api.get('/dashboard/sales-chart'),
  getRevenueChart: () => api.get('/dashboard/revenue-chart'),
  getTopProducts: () => api.get('/dashboard/top-products'),
  getCustomerMetrics: () => api.get('/dashboard/customer-metrics'),
};
