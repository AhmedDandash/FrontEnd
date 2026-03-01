/**
 * Mediation Contract Message Service
 * Handles contract messages (chat) API calls
 */

import { api } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/config/api.config';
import type {
  MediationContractMessage,
  CreateMediationContractMessageDto,
} from '@/types/api.types';

export class MediationContractMessageService {
  /**
   * Get all messages for a contract
   */
  static async getByContract(contractId: number): Promise<MediationContractMessage[]> {
    const response = await api.get<any>(
      API_ENDPOINTS.MEDIATION_CONTRACT_MESSAGES.GET_BY_CONTRACT(contractId)
    );

    let items: MediationContractMessage[] = [];
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
   * Send a new message
   */
  static async create(data: CreateMediationContractMessageDto): Promise<MediationContractMessage> {
    const payload = {
      contractId: Number(data.contractId),
      message: data.message,
    };
    const response = await api.post<MediationContractMessage>(
      API_ENDPOINTS.MEDIATION_CONTRACT_MESSAGES.CREATE,
      payload
    );
    return response.data;
  }

  /**
   * Delete a message
   */
  static async delete(id: number): Promise<void> {
    await api.delete(API_ENDPOINTS.MEDIATION_CONTRACT_MESSAGES.DELETE(id));
  }
}
