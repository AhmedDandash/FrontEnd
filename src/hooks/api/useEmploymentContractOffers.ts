/**
 * useEmploymentContractOffers Hook
 * React Query hooks for employment contract offer operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { EmploymentContractOfferService } from '@/services';
import type {
  CreateEmploymentContractOfferDto,
  UpdateEmploymentContractOfferDto,
} from '@/types/api.types';

const QUERY_KEY = 'employment-contract-offers';
const SUMMARY_KEY = 'employment-contract-offers-summary';

export function useEmploymentContractOffers(params?: Record<string, any>) {
  const queryClient = useQueryClient();

  // Get offers summary
  const {
    data: summary,
    isLoading: isSummaryLoading,
    error: summaryError,
    refetch: refetchSummary,
  } = useQuery({
    queryKey: [SUMMARY_KEY],
    queryFn: () => EmploymentContractOfferService.getSummary(),
  });

  // Get all offers
  const {
    data: offers,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () => EmploymentContractOfferService.getAll(params),
  });

  // Get offer by ID
  const useOffer = (id: number) => {
    return useQuery({
      queryKey: [QUERY_KEY, id],
      queryFn: () => EmploymentContractOfferService.getById(id),
      enabled: !!id,
    });
  };

  // Create offer
  const createMutation = useMutation({
    mutationFn: (data: CreateEmploymentContractOfferDto) =>
      EmploymentContractOfferService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [SUMMARY_KEY] });
      message.success('تمت إضافة العرض بنجاح / Offer created successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'فشل إضافة العرض / Failed to create offer');
    },
  });

  // Update offer
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateEmploymentContractOfferDto }) =>
      EmploymentContractOfferService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [SUMMARY_KEY] });
      message.success('تم تحديث العرض بنجاح / Offer updated successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'فشل تحديث العرض / Failed to update offer');
    },
  });

  // Delete offer
  const deleteMutation = useMutation({
    mutationFn: (id: number) => EmploymentContractOfferService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [SUMMARY_KEY] });
      message.success('تم حذف العرض بنجاح / Offer deleted successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'فشل حذف العرض / Failed to delete offer');
    },
  });

  return {
    summary,
    isSummaryLoading,
    summaryError,
    refetchSummary,
    offers,
    isLoading,
    error,
    refetch,
    useOffer,
    createOffer: createMutation.mutate,
    createOfferAsync: createMutation.mutateAsync,
    updateOffer: updateMutation.mutate,
    updateOfferAsync: updateMutation.mutateAsync,
    deleteOffer: deleteMutation.mutate,
    deleteOfferAsync: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
