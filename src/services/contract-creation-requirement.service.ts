/**
 * Contract Creation Requirement Service
 * Handles all contract creation requirement-related API calls
 */

import { api } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/config/api.config';
import type {
  ContractCreationRequirement,
  CreateContractCreationRequirementDto,
  UpdateContractCreationRequirementDto,
  GetRequirementFilterDto,
} from '@/types/api.types';

export class ContractCreationRequirementService {
  /**
   * Get all contract creation requirements
   */
  static async getAll(): Promise<ContractCreationRequirement[]> {
    const response = await api.get<any>(API_ENDPOINTS.CONTRACT_CREATION_REQUIREMENTS.GET_ALL);

    let items: ContractCreationRequirement[] = [];
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
   * Get requirement by ID
   */
  static async getById(id: number): Promise<ContractCreationRequirement> {
    const response = await api.get<ContractCreationRequirement>(
      API_ENDPOINTS.CONTRACT_CREATION_REQUIREMENTS.GET_BY_ID(id)
    );
    return response.data;
  }

  /**
   * Create a new requirement
   */
  static async create(
    data: CreateContractCreationRequirementDto
  ): Promise<ContractCreationRequirement> {
    const payload = {
      nationalityId: Number(data.nationalityId),
      jobId: Number(data.jobId),
      contractRequirements: data.contractRequirements,
    };
    const response = await api.post<ContractCreationRequirement>(
      API_ENDPOINTS.CONTRACT_CREATION_REQUIREMENTS.CREATE,
      payload
    );
    return response.data;
  }

  /**
   * Update a requirement
   */
  static async update(
    id: number,
    data: UpdateContractCreationRequirementDto
  ): Promise<ContractCreationRequirement> {
    const payload = {
      ...data,
      nationalityId: data.nationalityId != null ? Number(data.nationalityId) : undefined,
      jobId: data.jobId != null ? Number(data.jobId) : undefined,
    };
    const response = await api.put<ContractCreationRequirement>(
      API_ENDPOINTS.CONTRACT_CREATION_REQUIREMENTS.UPDATE(id),
      payload
    );
    return response.data;
  }

  /**
   * Delete a requirement
   */
  static async delete(id: number): Promise<void> {
    await api.delete(API_ENDPOINTS.CONTRACT_CREATION_REQUIREMENTS.DELETE(id));
  }

  /**
   * Filter requirements by nationality and/or job
   */
  static async getRequirement(
    filter: GetRequirementFilterDto
  ): Promise<ContractCreationRequirement[]> {
    const response = await api.post<any>(
      API_ENDPOINTS.CONTRACT_CREATION_REQUIREMENTS.GET_REQUIREMENT,
      filter
    );

    let items: ContractCreationRequirement[] = [];
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
}
