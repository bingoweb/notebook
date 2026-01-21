import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const postAPI = {
  getAll: (params) => api.get('/posts', { params }),
  getBySlug: (slug) => api.get(`/posts/${slug}`),
  create: (data) => api.post('/posts', data),
  update: (id, data) => api.put(`/posts/id/${id}`, data),
  delete: (id) => api.delete(`/posts/id/${id}`),
  like: (id) => api.put(`/posts/id/${id}/like`)
};

export const commentAPI = {
  getForPost: (postId) => api.get(`/comments/${postId}`),
  create: (data) => api.post('/comments', data),
  update: (id, content) => api.put(`/comments/comment/${id}`, { content }),
  delete: (id) => api.delete(`/comments/comment/${id}`),
  approve: (id) => api.put(`/comments/comment/${id}/approve`)
};

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password) => api.post('/auth/register', { name, email, password }),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data)
};
