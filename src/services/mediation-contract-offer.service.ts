/**
 * Mediation Contract Offer Service
 * Handles all mediation contract offer-related API calls
 */

import { api } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/config/api.config';
import type {
  MediationContractOffer,
  MediationContractOfferSummary,
  CreateMediationContractOfferDto,
  UpdateMediationContractOfferDto,
} from '@/types/api.types';

export class MediationContractOfferService {
  /**
   * Get summary of offers (grouped by nationality/job/branch)
   */
  static async getSummary(): Promise<MediationContractOfferSummary[]> {
    const response = await api.get<any>(API_ENDPOINTS.MEDIATION_CONTRACT_OFFER.GET_SUMMARY);

    let items: MediationContractOfferSummary[] = [];
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
   * Get all offers
   */
  static async getAll(): Promise<MediationContractOffer[]> {
    const response = await api.get<any>(API_ENDPOINTS.MEDIATION_CONTRACT_OFFER.GET_ALL);

    let items: MediationContractOffer[] = [];
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
   * Get offer by ID
   */
  static async getById(id: number): Promise<MediationContractOffer> {
    const response = await api.get<MediationContractOffer>(
      API_ENDPOINTS.MEDIATION_CONTRACT_OFFER.GET_BY_ID(id)
    );
    return response.data;
  }

  /**
   * Create new offer
   */
  static async create(data: CreateMediationContractOfferDto): Promise<MediationContractOffer> {
    const payload = {
      ...data,
      nationalityId: data.nationalityId ? Number(data.nationalityId) : null,
      jobId: data.jobId ? Number(data.jobId) : null,
      branchId: data.branchId ? Number(data.branchId) : null,
      agentId: data.agentId ? Number(data.agentId) : null,
      workerType: data.workerType !== undefined ? Number(data.workerType) : null,
      age: data.age ? Number(data.age) : null,
      religion: data.religion !== undefined ? Number(data.religion) : null,
      previousExperience:
        data.previousExperience !== undefined ? Number(data.previousExperience) : null,
      salary: data.salary ? Number(data.salary) : null,
      localCost: data.localCost ? Number(data.localCost) : null,
      taxLocalCost: data.taxLocalCost ? Number(data.taxLocalCost) : null,
      agentCostSAR: data.agentCostSAR ? Number(data.agentCostSAR) : null,
    };
    const response = await api.post<MediationContractOffer>(
      API_ENDPOINTS.MEDIATION_CONTRACT_OFFER.CREATE,
      payload
    );
    return response.data;
  }

  /**
   * Update offer
   */
  static async update(
    id: number,
    data: UpdateMediationContractOfferDto
  ): Promise<MediationContractOffer> {
    const payload = {
      ...data,
      nationalityId: data.nationalityId ? Number(data.nationalityId) : null,
      jobId: data.jobId ? Number(data.jobId) : null,
      branchId: data.branchId ? Number(data.branchId) : null,
      agentId: data.agentId ? Number(data.agentId) : null,
      workerType: data.workerType !== undefined ? Number(data.workerType) : null,
      age: data.age ? Number(data.age) : null,
      religion: data.religion !== undefined ? Number(data.religion) : null,
      previousExperience:
        data.previousExperience !== undefined ? Number(data.previousExperience) : null,
      salary: data.salary ? Number(data.salary) : null,
      localCost: data.localCost ? Number(data.localCost) : null,
      taxLocalCost: data.taxLocalCost ? Number(data.taxLocalCost) : null,
      agentCostSAR: data.agentCostSAR ? Number(data.agentCostSAR) : null,
    };
    const response = await api.put<MediationContractOffer>(
      API_ENDPOINTS.MEDIATION_CONTRACT_OFFER.UPDATE(id),
      payload
    );
    return response.data;
  }

  /**
   * Delete offer
   */
  static async delete(id: number): Promise<void> {
    await api.delete(API_ENDPOINTS.MEDIATION_CONTRACT_OFFER.DELETE(id));
  }
}
