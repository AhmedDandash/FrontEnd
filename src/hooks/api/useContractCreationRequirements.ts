/**
 * React Query hooks for Contract Creation Requirements
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { ContractCreationRequirementService } from '@/services/contract-creation-requirement.service';
import type {
  CreateContractCreationRequirementDto,
  UpdateContractCreationRequirementDto,
  GetRequirementFilterDto,
} from '@/types/api.types';

const QUERY_KEY = 'contract-creation-requirements';

/**
 * Fetch all contract creation requirements
 */
export function useContractCreationRequirements() {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => ContractCreationRequirementService.getAll(),
  });
}

/**
 * Fetch a single requirement by ID
 */
export function useContractCreationRequirement(id: number | null) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => ContractCreationRequirementService.getById(id!),
    enabled: !!id,
  });
}

/**
 * Filter requirements by nationality/job
 */
export function useFilterRequirements() {
  return useMutation({
    mutationFn: (filter: GetRequirementFilterDto) =>
      ContractCreationRequirementService.getRequirement(filter),
    onError: () => {
      message.error('فشل في تصفية المتطلبات | Failed to filter requirements');
    },
  });
}

/**
 * Create a new requirement
 */
export function useCreateContractCreationRequirement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateContractCreationRequirementDto) =>
      ContractCreationRequirementService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      message.success('تم إضافة المتطلبات بنجاح | Requirement created successfully');
    },
    onError: () => {
      message.error('فشل في إضافة المتطلبات | Failed to create requirement');
    },
  });
}

/**
 * Update a requirement
 */
export function useUpdateContractCreationRequirement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateContractCreationRequirementDto }) =>
      ContractCreationRequirementService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      message.success('تم تعديل المتطلبات بنجاح | Requirement updated successfully');
    },
    onError: () => {
      message.error('فشل في تعديل المتطلبات | Failed to update requirement');
    },
  });
}

/**
 * Delete a requirement
 */
export function useDeleteContractCreationRequirement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ContractCreationRequirementService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      message.success('تم حذف المتطلبات بنجاح | Requirement deleted successfully');
    },
    onError: () => {
      message.error('فشل في حذف المتطلبات | Failed to delete requirement');
    },
  });
}
