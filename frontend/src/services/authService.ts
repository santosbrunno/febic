
import api from './api';
import { LoginRequest, LoginResponse, User } from '../types/Auth';

export const authService = {
  // Login
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  // Obter usuário atual
  async getMe(): Promise<{ success: boolean; data: { user: User } }> {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Verificar se token é válido
  async verifyToken(): Promise<boolean> {
    try {
      await this.getMe();
      return true;
    } catch {
      return false;
    }
  },

  // Logout
  logout(): void {
    localStorage.removeItem('febic_token');
    localStorage.removeItem('febic_user');
  }
};