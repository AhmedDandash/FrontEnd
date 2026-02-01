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

    console.log('🔑 Login Response:', response.data);

    // Store token if present
    if (typeof window !== 'undefined') {
      const tokenValue = response.data?.token;

      if (tokenValue) {
        console.log('💾 Storing token:', tokenValue.substring(0, 30) + '...');
        console.log('📍 Token length:', tokenValue.length);
        localStorage.setItem('authToken', tokenValue);

        // Store token in cookie for middleware access
        document.cookie = `authToken=${tokenValue}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`;
        console.log('✅ Token stored in localStorage and cookie');

        // Verify storage immediately
        const storedToken = localStorage.getItem('authToken');
        console.log(
          '🔍 Verification - Token retrieved:',
          storedToken === tokenValue ? 'MATCH ✓' : 'MISMATCH ✗'
        );

        const userData = response.data?.user;
        if (userData) {
          localStorage.setItem('user', JSON.stringify(userData));
          console.log('👤 User data stored');
        }
      } else {
        console.error('❌ No token found in response:', response.data);
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

        // Clear auth cookie with multiple approaches to ensure it's deleted
        document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie =
          'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict';
        document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
        document.cookie = 'authToken=; path=/; max-age=0';

        console.log('🔓 Auth token cleared from localStorage and cookies');
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
