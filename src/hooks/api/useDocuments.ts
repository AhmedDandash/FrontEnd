/**
 * useDocuments Hook
 * React Query hook for document operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { DocumentService } from '@/services';
import type {  DocumentDto } from '@/types/api.types';

export function useDocuments() {
  const queryClient = useQueryClient();

  // Fetch all documents
  const documentsQuery = useQuery({
    queryKey: ['documents'],
    queryFn: () => DocumentService.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch single document
  const useDocument = (id: number) =>
    useQuery({
      queryKey: ['document', id],
      queryFn: () => DocumentService.getById(id),
      enabled: !!id,
    });

  // Create document mutation
  const createMutation = useMutation({
    mutationFn: (data: DocumentDto) => DocumentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      message.success('تم إنشاء المستند بنجاح / Document created successfully');
    },
    onError: (error: any) => {
      message.error(
        error.response?.data?.message || 'فشل إنشاء المستند / Failed to create document'
      );
    },
  });

  // Update document mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: DocumentDto }) =>
      DocumentService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      message.success('تم تحديث المستند بنجاح / Document updated successfully');
    },
    onError: (error: any) => {
      message.error(
        error.response?.data?.message || 'فشل تحديث المستند / Failed to update document'
      );
    },
  });

  // Delete document mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => DocumentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      message.success('تم حذف المستند بنجاح / Document deleted successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'فشل حذف المستند / Failed to delete document');
    },
  });

  return {
    // Queries
    documents: documentsQuery.data || [],
    isLoading: documentsQuery.isLoading,
    isError: documentsQuery.isError,
    error: documentsQuery.error,
    refetch: documentsQuery.refetch,
    useDocument,

    // Mutations
    createDocument: createMutation.mutate,
    updateDocument: updateMutation.mutate,
    deleteDocument: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
