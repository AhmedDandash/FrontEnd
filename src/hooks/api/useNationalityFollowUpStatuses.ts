/**
 * Nationality Follow-Up Status Hooks
 * React Query hooks for nationality-to-follow-up-status association CRUD
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { NationalityFollowUpService } from '@/services/nationality-followup.service';
import type {
  NationalityFollowUpStatus,
  CreateNationalityFollowUpStatusDto,
  UpdateNationalityFollowUpStatusDto,
} from '@/types/api.types';
import { message } from 'antd';

const QUERY_KEY = 'nationalityFollowUpStatuses';

/**
 * Fetch all nationality follow-up status associations
 */
export const useNationalityFollowUpStatuses = () => {
  return useQuery<NationalityFollowUpStatus[], Error>({
    queryKey: [QUERY_KEY],
    queryFn: NationalityFollowUpService.getAll,
  });
};

/**
 * Create nationality follow-up status association
 */
export const useCreateNationalityFollowUp = () => {
  const queryClient = useQueryClient();
  return useMutation<NationalityFollowUpStatus, Error, CreateNationalityFollowUpStatusDto>({
    mutationFn: NationalityFollowUpService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      message.success('تمت إضافة ربط الجنسية بنجاح / Association created successfully');
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || 'حدث خطأ / Error occurred');
    },
  });
};

/**
 * Update nationality follow-up status association
 */
export const useUpdateNationalityFollowUp = () => {
  const queryClient = useQueryClient();
  return useMutation<
    NationalityFollowUpStatus,
    Error,
    { id: number; data: UpdateNationalityFollowUpStatusDto }
  >({
    mutationFn: ({ id, data }) => NationalityFollowUpService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      message.success('تم التحديث بنجاح / Updated successfully');
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || 'حدث خطأ / Error occurred');
    },
  });
};

/**
 * Toggle active status
 */
export const useToggleNationalityFollowUpActive = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: NationalityFollowUpService.toggleActive,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || 'حدث خطأ / Error occurred');
    },
  });
};

/**
 * Delete nationality follow-up status association
 */
export const useDeleteNationalityFollowUp = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: NationalityFollowUpService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      message.success('تم الحذف بنجاح / Deleted successfully');
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || 'حدث خطأ / Error occurred');
    },
  });
};
