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

// Extrae los datos del usuario del token JWT
export function getUsuario() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload; // { email: '...', id: 1 }
  } catch {
    return null;
  }
}

export default api;