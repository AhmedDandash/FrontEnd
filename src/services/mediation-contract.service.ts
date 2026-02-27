/**
 * Mediation Contract Service
 * Handles all mediation contract-related API calls
 */

import { api } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/config/api.config';
import type {
  MediationContract,
  CreateMediationContractDto,
  UpdateMediationContractDto,
  MediationContractNoteDto,
  MediationContractNote,
  AddDomesticWorkerDto,
  ContractTypeChangeDto,
  ContractCancelDto,
  MediationContractInvoice,
  CreateInvoiceDto,
} from '@/types/api.types';

export class MediationContractService {
  /**
   * Get all mediation contracts
   */
  static async getAll(): Promise<MediationContract[]> {
    const response = await api.get<any>(API_ENDPOINTS.MEDIATION_CONTRACT.GET_ALL);

    let items: MediationContract[] = [];
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
   * Get a mediation contract by ID
   */
  static async getById(id: number): Promise<MediationContract> {
    const response = await api.get<MediationContract>(
      API_ENDPOINTS.MEDIATION_CONTRACT.GET_BY_ID(id)
    );
    return response.data;
  }

  /**
   * Create a new mediation contract
   */
  static async create(data: CreateMediationContractDto): Promise<MediationContract> {
    const payload = {
      ...data,
      contractType: data.contractType != null ? Number(data.contractType) : null,
      statusId: data.statusId != null ? Number(data.statusId) : null,
      customerId: data.customerId != null ? Number(data.customerId) : null,
      marketerId: data.marketerId != null ? Number(data.marketerId) : null,
      contractCategory: data.contractCategory != null ? Number(data.contractCategory) : null,
      offerId: data.offerId != null ? Number(data.offerId) : null,
      visaType: data.visaType != null ? Number(data.visaType) : null,
      arrivalDestinationId:
        data.arrivalDestinationId != null ? Number(data.arrivalDestinationId) : null,
      localCost: data.localCost != null ? Number(data.localCost) : null,
      agentCostSAR: data.agentCostSAR != null ? Number(data.agentCostSAR) : null,
      salary: data.salary != null ? Number(data.salary) : null,
      otherCosts: data.otherCosts != null ? Number(data.otherCosts) : null,
      totalTaxValue: data.totalTaxValue != null ? Number(data.totalTaxValue) : null,
      managerDiscount: data.managerDiscount != null ? Number(data.managerDiscount) : null,
      costDiscount: data.costDiscount != null ? Number(data.costDiscount) : null,
      totalCost: data.totalCost != null ? Number(data.totalCost) : null,
      domesticWorkerInsurance:
        data.domesticWorkerInsurance != null ? Number(data.domesticWorkerInsurance) : null,
    };
    const response = await api.post<MediationContract>(
      API_ENDPOINTS.MEDIATION_CONTRACT.CREATE,
      payload
    );
    return response.data;
  }

  /**
   * Update a mediation contract
   */
  static async update(id: number, data: UpdateMediationContractDto): Promise<MediationContract> {
    const payload = {
      ...data,
      contractType: data.contractType != null ? Number(data.contractType) : null,
      statusId: data.statusId != null ? Number(data.statusId) : null,
      customerId: data.customerId != null ? Number(data.customerId) : null,
      marketerId: data.marketerId != null ? Number(data.marketerId) : null,
      contractCategory: data.contractCategory != null ? Number(data.contractCategory) : null,
      offerId: data.offerId != null ? Number(data.offerId) : null,
      visaType: data.visaType != null ? Number(data.visaType) : null,
      arrivalDestinationId:
        data.arrivalDestinationId != null ? Number(data.arrivalDestinationId) : null,
      localCost: data.localCost != null ? Number(data.localCost) : null,
      agentCostSAR: data.agentCostSAR != null ? Number(data.agentCostSAR) : null,
      salary: data.salary != null ? Number(data.salary) : null,
      otherCosts: data.otherCosts != null ? Number(data.otherCosts) : null,
      totalTaxValue: data.totalTaxValue != null ? Number(data.totalTaxValue) : null,
      managerDiscount: data.managerDiscount != null ? Number(data.managerDiscount) : null,
      costDiscount: data.costDiscount != null ? Number(data.costDiscount) : null,
      totalCost: data.totalCost != null ? Number(data.totalCost) : null,
      domesticWorkerInsurance:
        data.domesticWorkerInsurance != null ? Number(data.domesticWorkerInsurance) : null,
    };
    const response = await api.put<MediationContract>(
      API_ENDPOINTS.MEDIATION_CONTRACT.UPDATE(id),
      payload
    );
    return response.data;
  }

  /**
   * Delete a mediation contract
   */
  static async delete(id: number): Promise<void> {
    await api.delete(API_ENDPOINTS.MEDIATION_CONTRACT.DELETE(id));
  }

  // ==================== Notes ====================

  /**
   * Add a note to a mediation contract
   */
  static async addNote(data: MediationContractNoteDto): Promise<MediationContractNote> {
    const response = await api.post<MediationContractNote>(
      API_ENDPOINTS.MEDIATION_CONTRACT.ADD_NOTE,
      {
        ...data,
        mediationId: Number(data.mediationId),
        dateNote: data.dateNote || new Date().toISOString(),
      }
    );
    return response.data;
  }

  /**
   * Get all notes (optionally filter by contract ID via query param)
   */
  static async getAllNotes(mediationId?: number): Promise<MediationContractNote[]> {
    const params = mediationId ? { mediationId } : {};
    const response = await api.get<any>(API_ENDPOINTS.MEDIATION_CONTRACT.ALL_NOTES, { params });

    let items: MediationContractNote[] = [];
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

  // ==================== Domestic Worker ====================

  /**
   * Add domestic worker insurance to a contract
   */
  static async addDomesticWorker(data: AddDomesticWorkerDto): Promise<any> {
    const response = await api.post(API_ENDPOINTS.MEDIATION_CONTRACT.ADD_DOMESTIC_WORKER, {
      ...data,
      contractId: Number(data.contractId),
      cost: data.cost != null ? Number(data.cost) : 0,
    });
    return response.data;
  }

  // ==================== Contract Type Change ====================

  /**
   * Change the type of a mediation contract
   */
  static async changeContractType(data: ContractTypeChangeDto): Promise<any> {
    const response = await api.post(API_ENDPOINTS.MEDIATION_CONTRACT.CONTRACT_TYPE_CHANGE, {
      type: Number(data.type),
      contractId: Number(data.contractId),
    });
    return response.data;
  }

  // ==================== Contract Cancel ====================

  /**
   * Cancel a mediation contract
   */
  static async cancelContract(data: ContractCancelDto): Promise<any> {
    const response = await api.post(API_ENDPOINTS.MEDIATION_CONTRACT.CONTRACT_CANCEL, {
      contractId: Number(data.contractId),
      cancelBy: data.cancelBy != null ? Number(data.cancelBy) : null,
      cancelNote: data.cancelNote || null,
    });
    return response.data;
  }

  // ==================== Invoices ====================

  /**
   * Get invoice by ID
   */
  static async getInvoiceById(id: number): Promise<MediationContractInvoice> {
    const response = await api.get<MediationContractInvoice>(
      API_ENDPOINTS.MEDIATION_CONTRACT.GET_INVOICE_BY_ID(id)
    );
    return response.data;
  }

  /**
   * Create invoice for a mediation contract
   */
  static async createInvoice(data: CreateInvoiceDto): Promise<MediationContractInvoice> {
    const response = await api.post<MediationContractInvoice>(
      API_ENDPOINTS.MEDIATION_CONTRACT.CREATE_INVOICE,
      {
        ...data,
        mediationContractId: Number(data.mediationContractId),
        paymentDate: data.paymentDate || new Date().toISOString(),
      }
    );
    return response.data;
  }
}
