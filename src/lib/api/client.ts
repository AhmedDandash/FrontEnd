/**
 * API Client
 * Configured Axios instance with interceptors for authentication, error handling, and logging
 */

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG } from '@/config/api.config';
import type { ApiError } from '@/types/api.types';

class ApiClient {
  private client: AxiosInstance;
  private static instance: ApiClient;

  private constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token from localStorage/sessionStorage
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }

        // Log request in development
        if (process.env.NEXT_PUBLIC_ENV === 'development') {
          console.log('🚀 API Request:', {
            method: config.method?.toUpperCase(),
            url: config.url,
            data: config.data,
          });
        }

        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        // Log response in development
        if (process.env.NEXT_PUBLIC_ENV === 'development') {
          console.log('✅ API Response:', {
            url: response.config.url,
            status: response.status,
            data: response.data,
          });
        }

        return response;
      },
      async (error: AxiosError<ApiError>) => {
        // Handle errors
        if (error.response) {
          const { status, data } = error.response;

          // Handle 401 Unauthorized
          if (status === 401) {
            if (typeof window !== 'undefined') {
              localStorage.removeItem('authToken');
              sessionStorage.removeItem('authToken');
              localStorage.removeItem('user');

              // Redirect to login (only on client side)
              if (window.location.pathname !== '/login') {
                window.location.href = '/login';
              }
            }
          }

          // Handle 403 Forbidden
          if (status === 403) {
            console.error('🚫 Access Forbidden:', data?.message || 'You do not have permission');
          }

          // Handle 404 Not Found
          if (status === 404) {
            console.error('🔍 Not Found:', error.config?.url);
          }

          // Handle 500 Server Error
          if (status >= 500) {
            console.error('🔥 Server Error:', data?.message || 'Internal server error');
          }

          // Log all errors in development
          if (process.env.NEXT_PUBLIC_ENV === 'development') {
            console.error('❌ API Error:', {
              url: error.config?.url,
              status,
              message: data?.message,
              errors: data?.errors,
            });
          }
        } else if (error.request) {
          console.error('🌐 Network Error: No response received', error.message);
        } else {
          console.error('⚠️ Error:', error.message);
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * GET request
   */
  public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  /**
   * POST request
   */
  public async post<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config);
  }

  /**
   * PUT request
   */
  public async put<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config);
  }

  /**
   * DELETE request
   */
  public async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config);
  }

  /**
   * PATCH request
   */
  public async patch<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.patch<T>(url, data, config);
  }

  /**
   * Get raw axios instance (for advanced use cases)
   */
  public getAxiosInstance(): AxiosInstance {
    return this.client;
  }
}

// Export singleton instance
export const apiClient = ApiClient.getInstance();

// Export convenience methods
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) => apiClient.get<T>(url, config),
  post: <T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig) =>
    apiClient.post<T, D>(url, data, config),
  put: <T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig) =>
    apiClient.put<T, D>(url, data, config),
  delete: <T = any>(url: string, config?: AxiosRequestConfig) => apiClient.delete<T>(url, config),
  patch: <T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig) =>
    apiClient.patch<T, D>(url, data, config),
};
