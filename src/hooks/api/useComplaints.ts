/**
 * Complaint Hooks
 * React Query hooks for complaint CRUD operations
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ComplaintService } from '@/services/complaint.service';
import type {
  Complaint,
  CreateComplaintDto,
  UpdateComplaintDto,
  FinishComplaintDto,
  AddIssueDto,
  ComplaintIssue,
} from '@/types/api.types';
import { message } from 'antd';

const QUERY_KEY = 'complaints';

/**
 * Fetch all complaints
 */
export const useComplaints = () => {
  return useQuery<Complaint[], Error>({
    queryKey: [QUERY_KEY],
    queryFn: ComplaintService.getAll,
  });
};

/**
 * Fetch complaint by ID
 */
export const useComplaint = (id: number) => {
  return useQuery<Complaint, Error>({
    queryKey: [QUERY_KEY, id],
    queryFn: () => ComplaintService.getById(id),
    enabled: !!id,
  });
};

/**
 * Create new complaint
 */
export const useCreateComplaint = () => {
  const queryClient = useQueryClient();

  return useMutation<Complaint, Error, CreateComplaintDto>({
    mutationFn: ComplaintService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      message.success('تمت إضافة الشكوى بنجاح / Complaint created successfully');
    },
    onError: (error: any) => {
      message.error(
        error?.response?.data?.message || 'فشل إضافة الشكوى / Failed to create complaint'
      );
    },
  });
};

/**
 * Update complaint
 */
export const useUpdateComplaint = () => {
  const queryClient = useQueryClient();

  return useMutation<Complaint, Error, { id: number; data: UpdateComplaintDto }>({
    mutationFn: ({ id, data }) => ComplaintService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      message.success('تم تحديث الشكوى بنجاح / Complaint updated successfully');
    },
    onError: (error: any) => {
      message.error(
        error?.response?.data?.message || 'فشل تحديث الشكوى / Failed to update complaint'
      );
    },
  });
};

/**
 * Delete complaint
 */
export const useDeleteComplaint = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: ComplaintService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      message.success('تم حذف الشكوى بنجاح / Complaint deleted successfully');
    },
    onError: (error: any) => {
      message.error(
        error?.response?.data?.message || 'فشل حذف الشكوى / Failed to delete complaint'
      );
    },
  });
};

/**
 * Finish (close) a complaint with notes
 */
export const useFinishComplaint = () => {
  const queryClient = useQueryClient();

  return useMutation<Complaint, Error, FinishComplaintDto>({
    mutationFn: ComplaintService.finish,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      message.success('تم إنهاء الشكوى بنجاح / Complaint finished successfully');
    },
    onError: (error: any) => {
      message.error(
        error?.response?.data?.message || 'فشل إنهاء الشكوى / Failed to finish complaint'
      );
    },
  });
};

/**
 * Put a complaint on hold
 */
export const useHoldComplaint = () => {
  const queryClient = useQueryClient();

  return useMutation<Complaint, Error, number>({
    mutationFn: ComplaintService.hold,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      message.success('تم تعليق الشكوى بنجاح / Complaint put on hold successfully');
    },
    onError: (error: any) => {
      message.error(
        error?.response?.data?.message || 'فشل تعليق الشكوى / Failed to hold complaint'
      );
    },
  });
};

/**
 * Add an issue/case to a complaint
 */
export const useAddIssue = () => {
  const queryClient = useQueryClient();

  return useMutation<ComplaintIssue, Error, AddIssueDto>({
    mutationFn: ComplaintService.addIssue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['complaint-issues'] });
      message.success('تمت إضافة القضية بنجاح / Issue added successfully');
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || 'فشل إضافة القضية / Failed to add issue');
    },
  });
};

/**
 * Get issues for a complaint
 */
export const useComplaintIssues = (complaintId: number) => {
  return useQuery<ComplaintIssue[], Error>({
    queryKey: ['complaint-issues', complaintId],
    queryFn: () => ComplaintService.getIssueById(complaintId),
    enabled: !!complaintId,
  });
};
