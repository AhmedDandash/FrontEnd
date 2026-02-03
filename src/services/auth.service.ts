/**
 * Auth Service
 * Handles all authentication-related API calls
 */

import { api } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/config/api.config';
import type { LoginDto, RegisterDto, AuthResponse } from '@/types/api.types';

export class AuthService {
  /**
   * Login user
   */
  static async login(credentials: LoginDto): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);

    // Store token if present
    if (typeof window !== 'undefined') {
      // Handle both 'token' and 'accessToken' field names
      const responseData: any = response.data;
      const tokenValue = responseData?.accessToken || responseData?.token;

      if (tokenValue) {
        localStorage.setItem('authToken', tokenValue);

        const userData = responseData?.user;
        if (userData) {
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } else {
        console.error('No token found in response data');
        console.error('Response data structure:', JSON.stringify(response.data, null, 2));
        throw new Error('No token in login response');
      }
    }

    return response.data;
  }

  /**
   * Register new user
   */
  static async register(userData: RegisterDto): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  }

  /**
   * Logout user
   */
  static async logout(): Promise<void> {
    try {
      await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    } finally {
      // Clear local storage and cookies regardless of API response
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        sessionStorage.clear();

        // Best-effort clear of legacy non-HttpOnly cookie (refresh cookie is HttpOnly)
        document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'authToken=; path=/; max-age=0';
      }
    }
  }

  /**
   * Get current auth token
   */
  static getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Get current user from storage
   */
  static getCurrentUser(): any | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}
