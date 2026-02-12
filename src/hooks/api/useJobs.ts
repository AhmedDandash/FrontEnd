/**
 * Job Hooks
 * React Query hooks for job management
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { JobService } from '@/services/job.service';
import type { CreateJobDto, UpdateJobDto } from '@/types/api.types';
import { message } from 'antd';

const QUERY_KEY = 'jobs';

/**
 * Hook to fetch all jobs
 */
export const useJobs = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => JobService.getAll(),
  });
};

/**
 * Hook to fetch a single job by ID
 */
export const useJob = (id: number) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => JobService.getById(id),
    enabled: !!id,
  });
};

/**
 * Hook to create a new job
 */
export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateJobDto) => JobService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      message.success('Job created successfully');
    },
    onError: (error: Error) => {
      message.error(`Failed to create job: ${error.message}`);
    },
  });
};

/**
 * Hook to update an existing job
 */
export const useUpdateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateJobDto }) => JobService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      message.success('Job updated successfully');
    },
    onError: (error: Error) => {
      message.error(`Failed to update job: ${error.message}`);
    },
  });
};

/**
 * Hook to delete a job
 */
export const useDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => JobService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      message.success('Job deleted successfully');
    },
    onError: (error: Error) => {
      message.error(`Failed to delete job: ${error.message}`);
    },
  });
};
