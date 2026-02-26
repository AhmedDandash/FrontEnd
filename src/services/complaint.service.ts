/**
 * Complaint Service
 * Handles all complaint-related API calls
 */

import { api } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/config/api.config';
import type {
  Complaint,
  CreateComplaintDto,
  UpdateComplaintDto,
  FinishComplaintDto,
  AddIssueDto,
  ComplaintIssue,
} from '@/types/api.types';

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

    // Derive status from isFinish / ishold for UI compatibility
    return complaints.map((c) => ({
      ...c,
      status: c.isFinish ? 2 : c.ishold ? 3 : 1,
    }));
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

  /**
   * Finish (close) a complaint with notes
   * API expects an array: [{ id, note }]
   */
  static async finish(data: FinishComplaintDto): Promise<Complaint> {
    console.log('[ComplaintService] Finishing complaint with data:', JSON.stringify(data));
    const response = await api.post<Complaint>(API_ENDPOINTS.COMPLAINT.FINISH, [data]);
    console.log('[ComplaintService] Finish response:', JSON.stringify(response.data));
    return response.data;
  }

  /**
   * Put a complaint on hold
   */
  static async hold(id: number): Promise<Complaint> {
    const response = await api.post<Complaint>(API_ENDPOINTS.COMPLAINT.HOLD(id), {});
    return response.data;
  }

  /**
   * Add an issue/case to a complaint (supports file upload)
   */
  static async addIssue(data: AddIssueDto): Promise<ComplaintIssue> {
    const formData = new FormData();
    formData.append('complaintId', data.complaintId.toString());
    if (data.incomingNumber) formData.append('incomingNumber', data.incomingNumber);
    if (data.submissionAuthority != null)
      formData.append('submissionAuthority', data.submissionAuthority.toString());
    if (data.transactionDate) formData.append('transactionDate', data.transactionDate);
    if (data.attachmentFile && data.attachmentFile instanceof File) {
      formData.append('attachmentFile', data.attachmentFile);
    }
    const response = await api.post<ComplaintIssue>(API_ENDPOINTS.COMPLAINT.ADD_ISSUE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  /**
   * Get issue by complaint ID
   */
  static async getIssueById(id: number): Promise<ComplaintIssue[]> {
    const response = await api.get<any>(API_ENDPOINTS.COMPLAINT.GET_ISSUE(id));
    if (Array.isArray(response.data)) return response.data;
    if (response.data?.data && Array.isArray(response.data.data)) return response.data.data;
    if (response.data?.result && Array.isArray(response.data.result)) return response.data.result;
    return response.data ? [response.data] : [];
  }
}
