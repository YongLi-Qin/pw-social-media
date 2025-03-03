import axios from 'axios';
import { AuthResponse, LoginRequest, SignupRequest } from '../types/auth';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器添加 token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', { email, password });
  return response.data;
};

export const signup = async (email: string, password: string, name: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/signup', { email, password, name });
  return response.data;
};

export default api; 