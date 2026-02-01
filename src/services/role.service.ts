/**
 * Role Service
 * Handles all role-related API calls
 */

import { api } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/config/api.config';
import type { Role, CreateRoleDto, UpdateRoleDto } from '@/types/api.types';

export class RoleService {
  /**
   * Get all roles
   */
  static async getAll(): Promise<Role[]> {
    const response = await api.get<Role[]>(API_ENDPOINTS.ROLES.GET_ALL);
    return response.data;
  }

  /**
   * Get role by ID
   */
  static async getById(id: number): Promise<Role> {
    const response = await api.get<Role>(API_ENDPOINTS.ROLES.GET_BY_ID(id));
    return response.data;
  }

  /**
   * Create new role
   */
  static async create(data: CreateRoleDto): Promise<Role> {
    const response = await api.post<Role>(API_ENDPOINTS.ROLES.CREATE, data);
    return response.data;
  }

  /**
   * Update role
   */
  static async update(id: number, data: UpdateRoleDto): Promise<Role> {
    const response = await api.put<Role>(API_ENDPOINTS.ROLES.UPDATE(id), data);
    return response.data;
  }

  /**
   * Delete role
   */
  static async delete(id: number): Promise<void> {
    await api.delete(API_ENDPOINTS.ROLES.DELETE(id));
  }
}
