/**
 * React Query hooks for Mediation Contract Follow-Up (Timeline)
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { MediationContractFollowUpService } from '@/services/mediation-contract-followup.service';
import type { CreateMediationContractFollowUpDto, GetByContractDto } from '@/types/api.types';

const QUERY_KEY = 'mediation-contract-followup';

/**
 * Fetch follow-ups for a contract
 */
export function useMediationContractFollowUps(contractId: number | null, statusId?: number | null) {
  return useQuery({
    queryKey: [QUERY_KEY, contractId, statusId],
    queryFn: () =>
      MediationContractFollowUpService.getByContract({
        contractId: contractId!,
        mediationFollowUpStatusesId: statusId || undefined,
      } as GetByContractDto),
    enabled: !!contractId,
  });
}

/**
 * Create a follow-up entry
 */
export function useCreateMediationContractFollowUp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMediationContractFollowUpDto) =>
      MediationContractFollowUpService.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, variables.contractId] });
      message.success('تم إضافة المتابعة بنجاح | Follow-up created successfully');
    },
    onError: () => {
      message.error('فشل في إضافة المتابعة | Failed to create follow-up');
    },
  });
}
