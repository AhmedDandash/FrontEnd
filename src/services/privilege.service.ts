import { api } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/config/api.config';
import { Role, CreateRoleDto, UpdateRoleDto } from '@/types/api.types';

/**
 * Privilege Service - API calls for privilege/role management
 */

export const PrivilegeService = {
  /**
   * Get all privileges
   */
  getAll: async (): Promise<Role[]> => {
    const response = await api.get(API_ENDPOINTS.ROLES.GET_ALL);
    return response.data;
  },

  /**
   * Get privilege by ID
   */
  getById: async (id: number): Promise<Role> => {
    const response = await api.get(API_ENDPOINTS.ROLES.GET_BY_ID(id));
    return response.data;
  },

  /**
   * Create new privilege
   */
  create: async (data: CreateRoleDto): Promise<Role> => {
    const response = await api.post(API_ENDPOINTS.ROLES.CREATE, data);
    return response.data;
  },

  /**
   * Update privilege
   */
  update: async (id: number, data: UpdateRoleDto): Promise<Role> => {
    const response = await api.put(API_ENDPOINTS.ROLES.UPDATE(id), data);
    return response.data;
  },

  /**
   * Delete privilege
   */
  delete: async (id: number): Promise<void> => {
    await api.delete(API_ENDPOINTS.ROLES.DELETE(id));
  },
};

export default PrivilegeService;
