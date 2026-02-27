/**
 * useMediationContracts Hook
 * React Query hooks for mediation contract operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { MediationContractService } from '@/services/mediation-contract.service';
import type {
  CreateMediationContractDto,
  UpdateMediationContractDto,
  MediationContractNoteDto,
  AddDomesticWorkerDto,
  ContractTypeChangeDto,
  ContractCancelDto,
  CreateInvoiceDto,
} from '@/types/api.types';

const QUERY_KEY = 'mediation-contracts';
const NOTES_KEY = 'mediation-contract-notes';

/**
 * Main hook for mediation contract CRUD operations
 */
export function useMediationContracts() {
  const queryClient = useQueryClient();

  // Get all contracts
  const {
    data: contracts,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => MediationContractService.getAll(),
  });

  // Create contract
  const createMutation = useMutation({
    mutationFn: (data: CreateMediationContractDto) => MediationContractService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      message.success('تمت إضافة عقد الوساطة بنجاح / Mediation contract created successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'فشل إضافة العقد / Failed to create contract');
    },
  });

  // Update contract
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateMediationContractDto }) =>
      MediationContractService.update(id, data),
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
    mutationFn: (id: number) => MediationContractService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      message.success('تم حذف العقد بنجاح / Contract deleted successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'فشل حذف العقد / Failed to delete contract');
    },
  });

  // Cancel contract
  const cancelMutation = useMutation({
    mutationFn: (data: ContractCancelDto) => MediationContractService.cancelContract(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      message.success('تم إلغاء العقد بنجاح / Contract cancelled successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'فشل إلغاء العقد / Failed to cancel contract');
    },
  });

  // Change contract type
  const changeTypeMutation = useMutation({
    mutationFn: (data: ContractTypeChangeDto) => MediationContractService.changeContractType(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      message.success('تم تغيير نوع العقد بنجاح / Contract type changed successfully');
    },
    onError: (error: any) => {
      message.error(
        error.response?.data?.message || 'فشل تغيير نوع العقد / Failed to change contract type'
      );
    },
  });

  // Add domestic worker
  const addDomesticWorkerMutation = useMutation({
    mutationFn: (data: AddDomesticWorkerDto) => MediationContractService.addDomesticWorker(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      message.success(
        'تمت إضافة تأمين العامل بنجاح / Domestic worker insurance added successfully'
      );
    },
    onError: (error: any) => {
      message.error(
        error.response?.data?.message ||
          'فشل إضافة تأمين العامل / Failed to add domestic worker insurance'
      );
    },
  });

  return {
    contracts,
    isLoading,
    error,
    refetch,
    createContract: createMutation.mutateAsync,
    updateContract: updateMutation.mutateAsync,
    deleteContract: deleteMutation.mutate,
    cancelContract: cancelMutation.mutateAsync,
    changeContractType: changeTypeMutation.mutateAsync,
    addDomesticWorker: addDomesticWorkerMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isCancelling: cancelMutation.isPending,
    isChangingType: changeTypeMutation.isPending,
    isAddingWorker: addDomesticWorkerMutation.isPending,
  };
}

/**
 * Hook to get a single mediation contract by ID
 */
export function useMediationContract(id: number) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => MediationContractService.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook for mediation contract notes
 */
export function useMediationContractNotes(mediationId?: number) {
  const queryClient = useQueryClient();

  // Get all notes for a contract
  const {
    data: notes,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [NOTES_KEY, mediationId],
    queryFn: () => MediationContractService.getAllNotes(mediationId),
    enabled: !!mediationId,
  });

  // Add note
  const addNoteMutation = useMutation({
    mutationFn: (data: MediationContractNoteDto) => MediationContractService.addNote(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTES_KEY] });
      message.success('تمت إضافة الملاحظة بنجاح / Note added successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'فشل إضافة الملاحظة / Failed to add note');
    },
  });

  return {
    notes,
    isLoading,
    error,
    refetch,
    addNote: addNoteMutation.mutateAsync,
    isAddingNote: addNoteMutation.isPending,
  };
}

/**
 * Hook for mediation contract invoices
 */
export function useMediationContractInvoices() {
  const queryClient = useQueryClient();

  // Create invoice
  const createInvoiceMutation = useMutation({
    mutationFn: (data: CreateInvoiceDto) => MediationContractService.createInvoice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      message.success('تم إنشاء الفاتورة بنجاح / Invoice created successfully');
    },
    onError: (error: any) => {
      message.error(
        error.response?.data?.message || 'فشل إنشاء الفاتورة / Failed to create invoice'
      );
    },
  });

  return {
    createInvoice: createInvoiceMutation.mutateAsync,
    isCreatingInvoice: createInvoiceMutation.isPending,
  };
}

/**
 * Hook to get a single invoice by ID
 */
export function useMediationContractInvoice(id: number) {
  return useQuery({
    queryKey: ['mediation-contract-invoice', id],
    queryFn: () => MediationContractService.getInvoiceById(id),
    enabled: !!id,
  });
}
