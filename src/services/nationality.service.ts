/**
 * Nationality Service
 * Handles all nationality-related API calls (General Options)
 */

import { api } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/config/api.config';
import type {
  NationalityExtended,
  CreateNationalityDto,
  UpdateNationalityDto,
} from '@/types/api.types';

export class NationalityService {
  /**
   * Get all nationalities
   */
  static async getAll(): Promise<NationalityExtended[]> {
    const response = await api.get<any>(API_ENDPOINTS.NATIONALITY.GET_ALL);

    // Handle different response structures
    let items: NationalityExtended[] = [];
    if (Array.isArray(response.data)) {
      items = response.data;
    } else if (response.data && typeof response.data === 'object') {
      const data = response.data as any;
      if (Array.isArray(data.data)) items = data.data;
      else if (Array.isArray(data.result)) items = data.result;
      else if (Array.isArray(data.items)) items = data.items;
    }
    return items;
  }

  /**
   * Get nationality by ID
   */
  static async getById(id: number): Promise<NationalityExtended> {
    const response = await api.get<NationalityExtended>(API_ENDPOINTS.NATIONALITY.GET_BY_ID(id));
    return response.data;
  }

  /**
   * Create new nationality
   */
  static async create(data: CreateNationalityDto): Promise<NationalityExtended> {
    const payload = {
      ...data,
      nationalityId: data.nationalityId ? Number(data.nationalityId) : null,
      authorizationSystem:
        data.authorizationSystem !== undefined ? Number(data.authorizationSystem) : null,
      ticketPrice: data.ticketPrice ? Number(data.ticketPrice) : null,
      isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
    };
    const response = await api.post<NationalityExtended>(API_ENDPOINTS.NATIONALITY.CREATE, payload);
    return response.data;
  }

  /**
   * Update nationality
   */
  static async update(id: number, data: UpdateNationalityDto): Promise<NationalityExtended> {
    const payload = {
      ...data,
      nationalityId: data.nationalityId ? Number(data.nationalityId) : null,
      authorizationSystem:
        data.authorizationSystem !== undefined ? Number(data.authorizationSystem) : null,
      ticketPrice: data.ticketPrice ? Number(data.ticketPrice) : null,
      isActive: data.isActive !== undefined ? Boolean(data.isActive) : undefined,
    };
    const response = await api.put<NationalityExtended>(
      API_ENDPOINTS.NATIONALITY.UPDATE(id),
      payload
    );
    return response.data;
  }

  /**
   * Delete nationality
   */
  static async delete(id: number): Promise<void> {
    await api.delete(API_ENDPOINTS.NATIONALITY.DELETE(id));
  }
}
