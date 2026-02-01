/**
 * Document Service
 * Handles all document-related API calls
 */

import { api } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/config/api.config';
import type { Document, DocumentDto } from '@/types/api.types';

export class DocumentService {
  /**
   * Get all documents
   */
  static async getAll(): Promise<Document[]> {
    const response = await api.get<Document[]>(API_ENDPOINTS.DOCUMENT.GET_ALL);
    return response.data;
  }

  /**
   * Get document by ID
   */
  static async getById(id: number): Promise<Document> {
    const response = await api.get<Document>(API_ENDPOINTS.DOCUMENT.GET_BY_ID(id));
    return response.data;
  }

  /**
   * Create new document
   */
  static async create(data: DocumentDto): Promise<Document> {
    const response = await api.post<Document>(API_ENDPOINTS.DOCUMENT.CREATE, data);
    return response.data;
  }

  /**
   * Update document
   */
  static async update(id: number, data: DocumentDto): Promise<Document> {
    const response = await api.put<Document>(API_ENDPOINTS.DOCUMENT.UPDATE(id), data);
    return response.data;
  }

  /**
   * Delete document
   */
  static async delete(id: number): Promise<void> {
    await api.delete(API_ENDPOINTS.DOCUMENT.DELETE(id));
  }
}
