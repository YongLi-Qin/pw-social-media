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
  console.log("login request: " + email + password);
  const response = await api.post<AuthResponse>('/auth/login', { email, password });
  return response.data;
};

export const signup = async (email: string, password: string, name: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/signup', { email, password, name });
  return response.data;
};

// 添加 Post 相关类型
export interface PostRequest {
  content: string;
  imageUrl?: string;
}

// 添加创建帖子的 API 方法
export const createPost = async (postData: PostRequest) => {
  const response = await api.post('/posts', postData);
  return response.data;
};

export const getUserPosts = async () => {
  const response = await api.get('/posts/user');
  return response.data;
};

// 添加获取所有帖子的方法
export const getAllPosts = async () => {
  const response = await api.get('/posts');
  return response.data;
};

export const updatePost = async (postId: number, content: string) => {
  const response = await api.put(`/posts/${postId}`, { content });
  return response.data;
};

export const deletePost = async (postId: number) => {
  await api.delete(`/posts/${postId}`);
};

export default api; 