/**
 * Mediation Contract Follow-Up Service
 * Handles contract follow-up timeline API calls
 */

import { api } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/config/api.config';
import type {
  MediationContractFollowUp,
  CreateMediationContractFollowUpDto,
  GetByContractDto,
} from '@/types/api.types';

export class MediationContractFollowUpService {
  /**
   * Get follow-ups for a contract, optionally filtered by parent status
   */
  static async getByContract(filter: GetByContractDto): Promise<MediationContractFollowUp[]> {
    const response = await api.post<any>(
      API_ENDPOINTS.MEDIATION_CONTRACT_FOLLOWUP.GET_BY_CONTRACT,
      filter
    );

    let items: MediationContractFollowUp[] = [];
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
   * Create a new follow-up entry
   */
  static async create(
    data: CreateMediationContractFollowUpDto
  ): Promise<MediationContractFollowUp> {
    const payload = {
      contractId: Number(data.contractId),
      examinationDate: data.examinationDate,
      mediationFollowUpStatusesId: Number(data.mediationFollowUpStatusesId),
      mediationStatusesId: Number(data.mediationStatusesId),
      notes: data.notes || null,
    };
    const response = await api.post<MediationContractFollowUp>(
      API_ENDPOINTS.MEDIATION_CONTRACT_FOLLOWUP.CREATE,
      payload
    );
    return response.data;
  }
}
