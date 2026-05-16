import api from './axios';
import type { AuthResponse, User } from '../types';

export const authApi = {
  login: async (data: any) => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },
  register: async (data: any) => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get<{ success: boolean, data: { user: User } }>('/auth/me');
    return response.data;
  },
  logout: async () => {
    const response = await api.post<{ success: boolean }>('/auth/logout');
    return response.data;
  },
};
