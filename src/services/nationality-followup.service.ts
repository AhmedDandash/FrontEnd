/**
 * Nationality Follow-Up Status Service
 * Handles CRUD for nationality-to-followup-status associations
 */

import { api } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/config/api.config';
import type {
  NationalityFollowUpStatus,
  CreateNationalityFollowUpStatusDto,
  UpdateNationalityFollowUpStatusDto,
} from '@/types/api.types';

export class NationalityFollowUpService {
  /**
   * Get all nationality follow-up status associations
   */
  static async getAll(): Promise<NationalityFollowUpStatus[]> {
    const response = await api.get<any>(API_ENDPOINTS.NATIONALITY_FOLLOWUP.GET_ALL);
    let items: NationalityFollowUpStatus[] = [];
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
   * Create nationality follow-up status association
   */
  static async create(
    data: CreateNationalityFollowUpStatusDto
  ): Promise<NationalityFollowUpStatus> {
    const response = await api.post<NationalityFollowUpStatus>(
      API_ENDPOINTS.NATIONALITY_FOLLOWUP.CREATE,
      data
    );
    return response.data;
  }

  /**
   * Update nationality follow-up status association
   */
  static async update(
    id: number,
    data: UpdateNationalityFollowUpStatusDto
  ): Promise<NationalityFollowUpStatus> {
    const response = await api.put<NationalityFollowUpStatus>(
      API_ENDPOINTS.NATIONALITY_FOLLOWUP.UPDATE(id),
      data
    );
    return response.data;
  }

  /**
   * Toggle active status
   */
  static async toggleActive(id: number): Promise<void> {
    await api.put(API_ENDPOINTS.NATIONALITY_FOLLOWUP.TOGGLE_ACTIVE(id));
  }

  /**
   * Delete association
   */
  static async delete(id: number): Promise<void> {
    await api.delete(API_ENDPOINTS.NATIONALITY_FOLLOWUP.DELETE(id));
  }
}
