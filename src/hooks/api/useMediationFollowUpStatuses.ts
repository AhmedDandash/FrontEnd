/**
 * React Query hooks for Mediation Follow-Up Statuses (Parent + Sub)
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { MediationFollowUpStatusService } from '@/services/mediation-followup-status.service';
import type {
  CreateMediationFollowUpStatusDto,
  CreateMediationStatusDto,
  MediationStatus,
  UpdateMediationStatusDto,
} from '@/types/api.types';

const PARENT_QUERY_KEY = 'mediation-followup-statuses';
const SUB_QUERY_KEY = 'mediation-sub-statuses';

// ==================== Parent Status Hooks ====================

/**
 * Fetch all parent follow-up statuses
 */
export function useMediationFollowUpStatuses() {
  return useQuery({
    queryKey: [PARENT_QUERY_KEY],
    queryFn: () => MediationFollowUpStatusService.getAllParents(),
  });
}

/**
 * Create a parent follow-up status
 */
export function useCreateMediationFollowUpStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMediationFollowUpStatusDto) =>
      MediationFollowUpStatusService.createParent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PARENT_QUERY_KEY] });
      message.success('تم إضافة حالة المتابعة بنجاح | Follow-up status created successfully');
    },
    onError: () => {
      message.error('فشل في إضافة حالة المتابعة | Failed to create follow-up status');
    },
  });
}

// ==================== Sub-Status Hooks ====================

/**
 * Fetch sub-statuses for a parent (sorted by caseOrder)
 */
export function useMediationSubStatuses(parentId: number | null) {
  return useQuery({
    queryKey: [SUB_QUERY_KEY, parentId],
    queryFn: () => MediationFollowUpStatusService.getSubStatuses(parentId!),
    enabled: !!parentId,
  });
}

/**
 * Create a sub-status
 */
export function useCreateMediationSubStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMediationStatusDto) =>
      MediationFollowUpStatusService.createSubStatus(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [SUB_QUERY_KEY, variables.mediationFollowUpStatusesId],
      });
      message.success('تم إضافة الحالة الفرعية بنجاح | Sub-status created successfully');
    },
    onError: () => {
      message.error('فشل في إضافة الحالة الفرعية | Failed to create sub-status');
    },
  });
}

/**
 * Update a sub-status
 */
export function useUpdateMediationSubStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateMediationStatusDto }) =>
      MediationFollowUpStatusService.updateSubStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SUB_QUERY_KEY] });
      message.success('تم تعديل الحالة الفرعية بنجاح | Sub-status updated successfully');
    },
    onError: () => {
      message.error('فشل في تعديل الحالة الفرعية | Failed to update sub-status');
    },
  });
}

/**
 * Toggle sub-status active state (optimistic)
 */
export function useToggleSubStatusActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: number; parentId: number; nextValue: boolean }) =>
      MediationFollowUpStatusService.toggleActive(id),
    onMutate: async ({ id, parentId, nextValue }) => {
      await queryClient.cancelQueries({ queryKey: [SUB_QUERY_KEY, parentId] });
      const previous = queryClient.getQueryData<MediationStatus[]>([SUB_QUERY_KEY, parentId]);

      queryClient.setQueryData<MediationStatus[]>([SUB_QUERY_KEY, parentId], (old = []) =>
        old.map((item) => (item.id === id ? { ...item, isActive: nextValue } : item))
      );

      return { previous, parentId };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData([SUB_QUERY_KEY, context.parentId], context.previous);
      }
      message.error('فشل في تغيير حالة التفعيل | Failed to toggle active status');
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: [SUB_QUERY_KEY, variables.parentId] });
    },
  });
}

/**
 * Toggle sub-status action finish state (optimistic)
 */
export function useToggleSubStatusFinish() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: number; parentId: number; nextValue: boolean }) =>
      MediationFollowUpStatusService.toggleFinish(id),
    onMutate: async ({ id, parentId, nextValue }) => {
      await queryClient.cancelQueries({ queryKey: [SUB_QUERY_KEY, parentId] });
      const previous = queryClient.getQueryData<MediationStatus[]>([SUB_QUERY_KEY, parentId]);

      queryClient.setQueryData<MediationStatus[]>([SUB_QUERY_KEY, parentId], (old = []) =>
        old.map((item) => (item.id === id ? { ...item, isActionFinish: nextValue } : item))
      );

      return { previous, parentId };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData([SUB_QUERY_KEY, context.parentId], context.previous);
      }
      message.error('فشل في تغيير حالة الإنهاء | Failed to toggle finish status');
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: [SUB_QUERY_KEY, variables.parentId] });
    },
  });
}

/**
 * Update sub-status case order
 */
export function useUpdateSubStatusCaseOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, order }: { id: number; order: number }) =>
      MediationFollowUpStatusService.updateCaseOrder(id, order),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SUB_QUERY_KEY] });
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: [SUB_QUERY_KEY] });
      message.error('فشل في تحديث الترتيب | Failed to update case order');
    },
  });
}
