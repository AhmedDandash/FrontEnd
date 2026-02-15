/**
 * Employment Contract Offer Service
 * Handles all employment contract offer-related API calls
 */

import { api } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/config/api.config';
import type {
  EmploymentContractOffer,
  EmploymentContractOfferSummary,
  CreateEmploymentContractOfferDto,
  UpdateEmploymentContractOfferDto,
} from '@/types/api.types';

export class EmploymentContractOfferService {
  /**
   * Get offers summary (grouped by nationality/job/branch)
   */
  static async getSummary(): Promise<EmploymentContractOfferSummary[]> {
    const response = await api.get<EmploymentContractOfferSummary[]>(
      API_ENDPOINTS.EMPLOYMENT_CONTRACT_OFFERS.SUMMARY
    );
    return response.data;
  }

  /**
   * Get all employment contract offers
   */
  static async getAll(params?: Record<string, any>): Promise<EmploymentContractOffer[]> {
    const response = await api.get<EmploymentContractOffer[]>(
      API_ENDPOINTS.EMPLOYMENT_CONTRACT_OFFERS.GET_ALL,
      { params }
    );
    return response.data;
  }

  /**
   * Get employment contract offer by ID
   */
  static async getById(id: number): Promise<EmploymentContractOffer> {
    const response = await api.get<EmploymentContractOffer>(
      API_ENDPOINTS.EMPLOYMENT_CONTRACT_OFFERS.GET_BY_ID(id)
    );
    return response.data;
  }

  /**
   * Create new employment contract offer
   */
  static async create(data: CreateEmploymentContractOfferDto): Promise<EmploymentContractOffer> {
    const response = await api.post<EmploymentContractOffer>(
      API_ENDPOINTS.EMPLOYMENT_CONTRACT_OFFERS.CREATE,
      data
    );
    return response.data;
  }

  /**
   * Update employment contract offer
   */
  static async update(
    id: number,
    data: UpdateEmploymentContractOfferDto
  ): Promise<EmploymentContractOffer> {
    const response = await api.put<EmploymentContractOffer>(
      API_ENDPOINTS.EMPLOYMENT_CONTRACT_OFFERS.UPDATE(id),
      data
    );
    return response.data;
  }

  /**
   * Delete employment contract offer
   */
  static async delete(id: number): Promise<void> {
    await api.delete(API_ENDPOINTS.EMPLOYMENT_CONTRACT_OFFERS.DELETE(id));
  }
}
