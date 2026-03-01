/**
 * React Query hooks for Mediation Contract Messages (Chat)
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { MediationContractMessageService } from '@/services/mediation-contract-message.service';
import type { CreateMediationContractMessageDto } from '@/types/api.types';

const QUERY_KEY = 'mediation-contract-messages';

/**
 * Fetch messages for a contract
 */
export function useMediationContractMessages(contractId: number | null) {
  return useQuery({
    queryKey: [QUERY_KEY, contractId],
    queryFn: () => MediationContractMessageService.getByContract(contractId!),
    enabled: !!contractId,
  });
}

/**
 * Send a message
 */
export function useCreateMediationContractMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMediationContractMessageDto) =>
      MediationContractMessageService.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, variables.contractId] });
      message.success('تم إرسال الرسالة بنجاح | Message sent successfully');
    },
    onError: () => {
      message.error('فشل في إرسال الرسالة | Failed to send message');
    },
  });
}

/**
 * Delete a message
 */
export function useDeleteMediationContractMessage(contractId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => MediationContractMessageService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, contractId] });
      message.success('تم حذف الرسالة بنجاح | Message deleted successfully');
    },
    onError: () => {
      message.error('فشل في حذف الرسالة | Failed to delete message');
    },
  });
}
