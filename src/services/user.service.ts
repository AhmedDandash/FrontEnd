/**
 * User Service
 * Handles all user-related API calls
 */

import { api } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/config/api.config';
import type { User, UpdateUserDto } from '@/types/api.types';

export class UserService {
  /**
   * Get all users
   */
  static async getAll(): Promise<User[]> {
    const response = await api.get<User[]>(API_ENDPOINTS.USERS.GET_ALL);
    return response.data;
  }

  /**
   * Get user by ID
   */
  static async getById(id: number): Promise<User> {
    const response = await api.get<User>(API_ENDPOINTS.USERS.GET_BY_ID(id));
    return response.data;
  }

  /**
   * Update user
   */
  static async update(id: number, data: UpdateUserDto): Promise<User> {
    const response = await api.put<User>(API_ENDPOINTS.USERS.UPDATE(id), data);
    return response.data;
  }

  /**
   * Delete user
   */
  static async delete(id: number): Promise<void> {
    await api.delete(API_ENDPOINTS.USERS.DELETE(id));
  }
}
