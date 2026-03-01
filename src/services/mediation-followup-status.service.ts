/**
 * Mediation Follow-Up Status Service
 * Handles parent follow-up statuses and sub-statuses (MediationStatus) API calls
 */

import { api } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/config/api.config';
import type {
  MediationFollowUpStatus,
  CreateMediationFollowUpStatusDto,
  MediationStatus,
  CreateMediationStatusDto,
  UpdateMediationStatusDto,
} from '@/types/api.types';

export class MediationFollowUpStatusService {
  // ==================== Parent Statuses ====================

  /**
   * Get all parent follow-up statuses
   */
  static async getAllParents(): Promise<MediationFollowUpStatus[]> {
    const response = await api.get<any>(API_ENDPOINTS.MEDIATION_FOLLOWUP_STATUSES.GET_ALL_PARENTS);

    let items: MediationFollowUpStatus[] = [];
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
   * Create a parent follow-up status
   */
  static async createParent(
    data: CreateMediationFollowUpStatusDto
  ): Promise<MediationFollowUpStatus> {
    const response = await api.post<MediationFollowUpStatus>(
      API_ENDPOINTS.MEDIATION_FOLLOWUP_STATUSES.CREATE_PARENT,
      data
    );
    return response.data;
  }

  // ==================== Sub-Statuses ====================

  /**
   * Get all sub-statuses for a parent
   */
  static async getSubStatuses(parentId: number): Promise<MediationStatus[]> {
    const response = await api.get<any>(
      API_ENDPOINTS.MEDIATION_FOLLOWUP_STATUSES.GET_SUB_STATUSES(parentId)
    );

    let items: MediationStatus[] = [];
    if (Array.isArray(response.data)) {
      items = response.data;
    } else if (response.data && typeof response.data === 'object') {
      const data = response.data as any;
      if (Array.isArray(data.data)) items = data.data;
      else if (Array.isArray(data.result)) items = data.result;
      else if (Array.isArray(data.items)) items = data.items;
    }
    // Sort by caseOrder
    return items.sort((a, b) => (a.caseOrder ?? 0) - (b.caseOrder ?? 0));
  }

  /**
   * Create a sub-status
   */
  static async createSubStatus(data: CreateMediationStatusDto): Promise<MediationStatus> {
    const payload = {
      ...data,
      caseOrder: data.caseOrder != null ? Number(data.caseOrder) : null,
      isActionFinish: data.isActionFinish ?? false,
      isActive: data.isActive ?? true,
      mediationFollowUpStatusesId: Number(data.mediationFollowUpStatusesId),
    };
    const response = await api.post<MediationStatus>(
      API_ENDPOINTS.MEDIATION_FOLLOWUP_STATUSES.CREATE_SUB,
      payload
    );
    return response.data;
  }

  /**
   * Update a sub-status
   */
  static async updateSubStatus(
    id: number,
    data: UpdateMediationStatusDto
  ): Promise<MediationStatus> {
    const response = await api.put<MediationStatus>(
      API_ENDPOINTS.MEDIATION_FOLLOWUP_STATUSES.UPDATE_SUB(id),
      data
    );
    return response.data;
  }

  /**
   * Toggle sub-status active state
   */
  static async toggleActive(id: number): Promise<void> {
    await api.post(API_ENDPOINTS.MEDIATION_FOLLOWUP_STATUSES.TOGGLE_ACTIVE, null, {
      params: { id : id },
    });
  }

  /**
   * Toggle sub-status action finish state
   */
  static async toggleFinish(id: number): Promise<void> {
    await api.post(API_ENDPOINTS.MEDIATION_FOLLOWUP_STATUSES.TOGGLE_FINISH, null, {
      params: { id : id },
    });
  }

  /**
   * Update sub-status case order
   */
  static async updateCaseOrder(id: number, order: number): Promise<void> {
    await api.post(API_ENDPOINTS.MEDIATION_FOLLOWUP_STATUSES.UPDATE_CASE_ORDER, { id, order });
  }
}
