/**
 * useAuth Hook
 * React Query hook for authentication operations
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { message } from 'antd';
import { AuthService } from '@/services';
import type { LoginDto, RegisterDto } from '@/types/api.types';


export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginDto) => AuthService.login(credentials),
    onSuccess: () => {
      message.success('تم تسجيل الدخول بنجاح / Login successful');
      router.push('/home/dashboard');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'فشل تسجيل الدخول / Login failed');
    },
  });

  const registerMutation = useMutation({
    mutationFn: (userData: RegisterDto) => AuthService.register(userData),
    onSuccess: () => {
      message.success('تم التسجيل بنجاح / Registration successful');
      router.push('/login');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'فشل التسجيل / Registration failed');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => AuthService.logout(),
    onSuccess: () => {
      queryClient.clear();
      message.success('تم تسجيل الخروج بنجاح / Logged out successfully');
      router.push('/login');
    },
    onError: () => {
      // Still clear local data even if API call fails
      queryClient.clear();
      router.push('/login');
    },
  });

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
}
