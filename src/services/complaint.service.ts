/**
 * Complaint Service
 * Handles all complaint-related API calls
 */

import { api } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/config/api.config';
import type { Complaint, CreateComplaintDto, UpdateComplaintDto } from '@/types/api.types';

export class ComplaintService {
  /**
   * Get all complaints
   */
  static async getAll(): Promise<Complaint[]> {
    const response = await api.get<any>(API_ENDPOINTS.COMPLAINT.GET_ALL);

    // Handle different response structures
    let complaints: Complaint[] = [];
    if (Array.isArray(response.data)) {
      complaints = response.data;
    } else if (response.data && typeof response.data === 'object') {
      const data = response.data as any;
      if (Array.isArray(data.data)) complaints = data.data;
      else if (Array.isArray(data.result)) complaints = data.result;
      else if (Array.isArray(data.items)) complaints = data.items;
    }
    return complaints;
  }

  /**
   * Get complaint by ID
   */
  static async getById(id: number): Promise<Complaint> {
    const response = await api.get<Complaint>(API_ENDPOINTS.COMPLAINT.GET_BY_ID(id));
    return response.data;
  }

  /**
   * Create new complaint
   */
  static async create(data: CreateComplaintDto): Promise<Complaint> {
    const response = await api.post<Complaint>(API_ENDPOINTS.COMPLAINT.CREATE, data);
    return response.data;
  }

  /**
   * Update complaint
   */
  static async update(id: number, data: UpdateComplaintDto): Promise<Complaint> {
    const response = await api.put<Complaint>(API_ENDPOINTS.COMPLAINT.UPDATE(id), data);
    return response.data;
  }

  /**
   * Delete complaint
   */
  static async delete(id: number): Promise<void> {
    await api.delete(API_ENDPOINTS.COMPLAINT.DELETE(id));
  }
}
