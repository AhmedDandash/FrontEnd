import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import type {
  Worker,
  WorkerDto,
  WorkerActionDto,
  MedicalExaminationDto,
  MedicalExamination,
} from '@/types/api.types';
import { api } from '@/lib/api/client';

const WORKERS_KEY = ['workers'];
const MEDICAL_EXAMINATIONS_KEY = ['medical-examinations'];

/**
 * Fetch all workers
 */
export function useWorkers() {
  return useQuery<Worker[]>({
    queryKey: WORKERS_KEY,
    queryFn: async () => {
      const response = await api.get('/api/Worker');
      const payload = response.data;
      // Normalize payload: allow API to return either an array or an object with `data` array
      if (Array.isArray(payload)) return payload as Worker[];
      if (payload && Array.isArray(payload.data)) return payload.data as Worker[];
      return [] as Worker[];
    },
  });
}

/**
 * Fetch a single worker by ID
 */
export function useWorker(id: string | undefined) {
  const normalizedId = id && id !== 'undefined' ? id : undefined;

  return useQuery<Worker>({
    queryKey: [...WORKERS_KEY, normalizedId],
    queryFn: async () => {
      if (!normalizedId) throw new Error('Worker ID is required');
      const response = await api.get(`/api/Worker/${normalizedId}`);
      const payload = response.data;
      // If API wraps the object in { data: { ... } }
      if (payload && payload.data) return payload.data as Worker;
      return payload as Worker;
    },
    enabled: !!normalizedId,
  });
}

/**
 * Create a new worker
 */
export function useCreateWorker() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: WorkerDto) => {
      const response = await api.post<Worker>('/api/Worker', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORKERS_KEY });
      message.success('Worker created successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to create worker');
    },
  });
}

/**
 * Update an existing worker
 */
export function useUpdateWorker() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: WorkerDto }) => {
      const response = await api.put<Worker>(`/api/Worker/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORKERS_KEY });
      message.success('Worker updated successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to update worker');
    },
  });
}

/**
 * Delete a worker
 */
export function useDeleteWorker() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/Worker/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORKERS_KEY });
      message.success('Worker deleted successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to delete worker');
    },
  });
}

/**
 * Worker action: Escape
 */
export function useWorkerEscape() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: WorkerActionDto) => {
      await api.post('/api/Worker/WorkerEscape', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORKERS_KEY });
      message.success('Worker escape status updated');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to update worker status');
    },
  });
}

/**
 * Worker action: Refused
 */
export function useWorkerRefused() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: WorkerActionDto) => {
      await api.post('/api/Worker/WorkerRefused', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORKERS_KEY });
      message.success('Worker refused status updated');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to update worker status');
    },
  });
}

/**
 * Worker action: Sick
 */
export function useWorkerSick() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: WorkerActionDto) => {
      await api.post('/api/Worker/WorkerSick', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORKERS_KEY });
      message.success('Worker sick status updated');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to update worker status');
    },
  });
}

/**
 * Worker action: Deactivate
 */
export function useWorkerDeactivate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: WorkerActionDto) => {
      const response = await api.post('/api/Worker/WorkerIsNoActive', data);
      return response.data;
    },
    onSuccess: (result: any) => {
      queryClient.invalidateQueries({ queryKey: WORKERS_KEY });
      message.success(result?.message || 'Worker deactivated successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to deactivate worker');
    },
  });
}

/**
 * Worker action: Out/Termination
 */
export function useWorkerOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: WorkerActionDto) => {
      await api.post('/api/Worker/WorkerOut', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORKERS_KEY });
      message.success('Worker out status updated');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to update worker status');
    },
  });
}

/**
 * Create medical examination for a worker
 */
export function useCreateMedicalExamination() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: MedicalExaminationDto) => {
      const response = await api.post('/api/Worker/CreateMedicalExamination', data);
      return response.data;
    },
    onSuccess: (result: any) => {
      queryClient.invalidateQueries({ queryKey: WORKERS_KEY });
      queryClient.invalidateQueries({ queryKey: MEDICAL_EXAMINATIONS_KEY });
      message.success(result?.message || 'Medical examination created successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to create medical examination');
    },
  });
}

/**
 * Get all medical examinations
 */
export function useMedicalExaminations() {
  return useQuery<MedicalExamination[]>({
    queryKey: MEDICAL_EXAMINATIONS_KEY,
    queryFn: async () => {
      const response = await api.get('/api/Worker/GetAllMedicalExamination');
      const payload = response.data;
      if (Array.isArray(payload)) return payload as MedicalExamination[];
      if (payload && Array.isArray(payload.data)) return payload.data as MedicalExamination[];
      return [] as MedicalExamination[];
    },
  });
}

/**
 * Update medical examination
 */
export function useUpdateMedicalExamination() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<MedicalExaminationDto> }) => {
      const response = await api.put(`/api/Worker/UpdateMedicalExamination/${id}`, data);
      return response.data;
    },
    onSuccess: (result: any) => {
      queryClient.invalidateQueries({ queryKey: WORKERS_KEY });
      queryClient.invalidateQueries({ queryKey: MEDICAL_EXAMINATIONS_KEY });
      message.success(result?.message || 'Medical examination updated successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to update medical examination');
    },
  });
}

/**
 * Delete medical examination
 */
export function useDeleteMedicalExamination() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/api/Worker/DeleteMedicalExamination/${id}`);
      return response.data;
    },
    onSuccess: (result: any) => {
      queryClient.invalidateQueries({ queryKey: WORKERS_KEY });
      queryClient.invalidateQueries({ queryKey: MEDICAL_EXAMINATIONS_KEY });
      message.success(result?.message || 'Medical examination deleted successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to delete medical examination');
    },
  });
}
