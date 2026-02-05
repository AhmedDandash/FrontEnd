import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import PrivilegeService from '@/services/privilege.service';
import { CreateRoleDto, UpdateRoleDto } from '@/types/api.types';
import { message } from 'antd';

/**
 * React Query hook for Privilege management
 */

const QUERY_KEY = 'privileges';

export const usePrivileges = () => {
  const queryClient = useQueryClient();

  // Fetch all privileges
  const {
    data: privileges = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => PrivilegeService.getAll(),
  });

  // Create privilege mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateRoleDto) => PrivilegeService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      message.success('Privilege created successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to create privilege');
    },
  });

  // Update privilege mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateRoleDto }) =>
      PrivilegeService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      message.success('Privilege updated successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to update privilege');
    },
  });

  // Delete privilege mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => PrivilegeService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      message.success('Privilege deleted successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to delete privilege');
    },
  });

  return {
    privileges,
    isLoading,
    error,
    refetch,
    createPrivilege: createMutation.mutate,
    updatePrivilege: updateMutation.mutate,
    deletePrivilege: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

// Hook to get single privilege
export const usePrivilege = (id: number) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => PrivilegeService.getById(id),
    enabled: !!id,
  });
};

export default usePrivileges;
