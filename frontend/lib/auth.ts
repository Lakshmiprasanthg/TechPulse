import apiClient, { api } from './api';
import {
  User,
  AuthResponse,
  ApiResponse,
  RegisterData,
  LoginData,
} from './types';

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    if (response.data.data.token) {
      apiClient.setToken(response.data.data.token);
    }
    return response.data;
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    if (response.data.data.token) {
      apiClient.setToken(response.data.data.token);
    }
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/auth/profile');
    if (!response.data.data) {
      throw new Error('Failed to fetch profile');
    }
    return response.data.data;
  },

  async updateProfile(data: {
    name?: string;
    email?: string;
  }): Promise<User> {
    const response = await api.put<ApiResponse<User>>('/auth/profile', data);
    if (!response.data.data) {
      throw new Error('Failed to update profile');
    }
    return response.data.data;
  },

  logout(): void {
    apiClient.removeToken();
  },

  isAuthenticated(): boolean {
    return !!apiClient.getToken();
  },
};
