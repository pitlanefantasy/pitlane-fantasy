import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.0.153:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Añade el token JWT automáticamente en cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
