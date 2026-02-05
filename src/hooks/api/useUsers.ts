import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserService } from '@/services/user.service';
import { RegisterDto, UpdateUserDto } from '@/types/api.types';
import { message } from 'antd';

/**
 * React Query hook for User management
 */

const QUERY_KEY = 'users';

export const useUsers = () => {
  const queryClient = useQueryClient();

  // Fetch all users
  const {
    data: users = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => UserService.getAll(),
  });

  // Create user mutation
  const createMutation = useMutation({
    mutationFn: (data: RegisterDto) => UserService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      message.success('User created successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to create user');
    },
  });

  // Update user mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserDto }) => UserService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      message.success('User updated successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to update user');
    },
  });

  // Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => UserService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      message.success('User deleted successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to delete user');
    },
  });

  return {
    users,
    isLoading,
    error,
    refetch,
    createUser: createMutation.mutate,
    updateUser: updateMutation.mutate,
    deleteUser: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

// Hook to get single user
export const useUser = (id: number) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => UserService.getById(id),
    enabled: !!id,
  });
};

export default useUsers;
