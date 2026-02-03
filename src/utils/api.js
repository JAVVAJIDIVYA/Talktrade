import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth API
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
};

// User API
export const userAPI = {
  getUser: (id) => api.get(`/users/${id}`),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
  requestSeller: (data) => api.post("/users/request-seller", data),
  toggleFavouriteGig: (gigId) => api.put(`/users/favourites/${gigId}`),
  getFavouriteGigs: () => api.get("/users/favourites"),
};

// Gig API
export const gigAPI = {
  createGig: (data) => api.post("/gigs", data),
  getGigs: (params) => api.get("/gigs", { params }),
  getGig: (id) => api.get(`/gigs/single/${id}`),
  getMyGigs: () => api.get("/gigs/mygigs"),
  deleteGig: (id) => api.delete(`/gigs/${id}`),
};

// Order API
export const orderAPI = {
  createOrder: (data) => api.post("/orders", data),
  getOrders: () => api.get("/orders"),
  confirmOrder: (id) => api.put(`/orders/${id}`),
};

// Review API
export const reviewAPI = {
  createReview: (data) => api.post("/reviews", data),
  getReviews: (gigId) => api.get(`/reviews/${gigId}`),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
};

// Conversation API
export const conversationAPI = {
  createConversation: (data) => api.post("/conversations", data),
  getConversations: () => api.get("/conversations"),
  getSingleConversation: (id) => api.get(`/conversations/single/${id}`),
  updateConversation: (id) => api.put(`/conversations/${id}`),
};

// Message API
export const messageAPI = {
  createMessage: (data) => api.post("/messages", data),
  getMessages: (id) => api.get(`/messages/${id}`),
};

// Admin API
export const adminAPI = {
  getStats: () => api.get("/admin/stats"),
  getUsers: (sellersOnly) =>
    api.get("/admin/users", { params: { sellersOnly: sellersOnly ? "true" : "false" } }),
  getGigs: () => api.get("/admin/gigs"),
  getSellerRequests: () => api.get("/admin/seller-requests"),
  approveSeller: (userId) => api.put(`/admin/seller-requests/${userId}/approve`),
  rejectSeller: (userId) => api.put(`/admin/seller-requests/${userId}/reject`),
  createEmployee: (data) => api.post("/admin/users", data),
  createGig: (data) => api.post("/admin/gigs", data),
  deleteGig: (id) => api.delete(`/admin/gigs/${id}`),
};

export default api;
