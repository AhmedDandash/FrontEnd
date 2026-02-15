/**
 * useEmploymentOperatingContracts Hook
 * React Query hooks for employment operating contract operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { EmploymentOperatingContractService } from '@/services';
import type {
  CreateEmploymentOperatingContractDto,
  UpdateEmploymentOperatingContractDto,
  EndContractDto,
} from '@/types/api.types';

const QUERY_KEY = 'employment-operating-contracts';

export function useEmploymentOperatingContracts(params?: Record<string, any>) {
  const queryClient = useQueryClient();

  // Get all contracts
  const {
    data: contracts,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () => EmploymentOperatingContractService.getAll(params),
  });

  // Get contract by ID
  const useContract = (id: number) => {
    return useQuery({
      queryKey: [QUERY_KEY, id],
      queryFn: () => EmploymentOperatingContractService.getById(id),
      enabled: !!id,
    });
  };

  // Create contract
  const createMutation = useMutation({
    mutationFn: (data: CreateEmploymentOperatingContractDto) =>
      EmploymentOperatingContractService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      message.success('تمت إضافة العقد بنجاح / Contract created successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'فشل إضافة العقد / Failed to create contract');
    },
  });

  // Update contract
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateEmploymentOperatingContractDto }) =>
      EmploymentOperatingContractService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      message.success('تم تحديث العقد بنجاح / Contract updated successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'فشل تحديث العقد / Failed to update contract');
    },
  });

  // Delete contract
  const deleteMutation = useMutation({
    mutationFn: (id: number) => EmploymentOperatingContractService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      message.success('تم حذف العقد بنجاح / Contract deleted successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'فشل حذف العقد / Failed to delete contract');
    },
  });

  // End contract
  const endContractMutation = useMutation({
    mutationFn: (data: EndContractDto) => EmploymentOperatingContractService.endContract(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      message.success('تم إنهاء العقد بنجاح / Contract ended successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'فشل إنهاء العقد / Failed to end contract');
    },
  });

  return {
    contracts,
    isLoading,
    error,
    refetch,
    useContract,
    createContract: createMutation.mutate,
    updateContract: updateMutation.mutate,
    deleteContract: deleteMutation.mutate,
    endContract: endContractMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isEndingContract: endContractMutation.isPending,
  };
}
