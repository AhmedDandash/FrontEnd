/**
 * Employment Operating Contract Service
 * Handles all employment operating contract-related API calls
 */

import { api } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/config/api.config';
import type {
  EmploymentOperatingContract,
  CreateEmploymentOperatingContractDto,
  UpdateEmploymentOperatingContractDto,
  EndContractDto,
} from '@/types/api.types';

export class EmploymentOperatingContractService {
  /**
   * Get all employment operating contracts
   */
  static async getAll(params?: Record<string, any>): Promise<EmploymentOperatingContract[]> {
    const response = await api.get<EmploymentOperatingContract[]>(
      API_ENDPOINTS.EMPLOYMENT_OPERATING_CONTRACT.GET_ALL,
      { params }
    );
    return response.data;
  }

  /**
   * Get employment operating contract by ID
   */
  static async getById(id: number): Promise<EmploymentOperatingContract> {
    const response = await api.get<EmploymentOperatingContract>(
      API_ENDPOINTS.EMPLOYMENT_OPERATING_CONTRACT.GET_BY_ID(id)
    );
    return response.data;
  }

  /**
   * Create new employment operating contract
   */
  static async create(
    data: CreateEmploymentOperatingContractDto
  ): Promise<EmploymentOperatingContract> {
    const response = await api.post<EmploymentOperatingContract>(
      API_ENDPOINTS.EMPLOYMENT_OPERATING_CONTRACT.CREATE,
      data
    );
    return response.data;
  }

  /**
   * Update employment operating contract
   */
  static async update(
    id: number,
    data: UpdateEmploymentOperatingContractDto
  ): Promise<EmploymentOperatingContract> {
    const response = await api.put<EmploymentOperatingContract>(
      API_ENDPOINTS.EMPLOYMENT_OPERATING_CONTRACT.UPDATE(id),
      data
    );
    return response.data;
  }

  /**
   * Delete employment operating contract
   */
  static async delete(id: number): Promise<void> {
    await api.delete(API_ENDPOINTS.EMPLOYMENT_OPERATING_CONTRACT.DELETE(id));
  }

  /**
   * End an employment operating contract
   */
  static async endContract(data: EndContractDto): Promise<void> {
    await api.post(API_ENDPOINTS.EMPLOYMENT_OPERATING_CONTRACT.END_CONTRACT, data);
  }
}
