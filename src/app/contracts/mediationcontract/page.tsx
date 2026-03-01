'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Card,
  Row,
  Col,
  Tag,
  Button,
  Input,
  Select,
  Statistic,
  Avatar,
  Empty,
  Modal,
  Progress,
  Badge,
  Spin,
  Form,
  DatePicker,
  InputNumber,
  Switch,
  List,
  Divider,
} from 'antd';
import {
  FileTextOutlined,
  SearchOutlined,
  PlusOutlined,
  PrinterOutlined,
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  FileExcelOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  FileProtectOutlined,
  MoneyCollectOutlined,
  SafetyOutlined,
  SwapOutlined,
  CloseCircleOutlined,
  BarsOutlined,
  ReloadOutlined,
  EyeOutlined,
} from '@ant-design/icons';

import { useAuthStore } from '@/store/authStore';
import { useCustomers } from '@/hooks/api/useCustomers';
import {
  useMediationContracts,
  useMediationContractNotes,
  useMediationContractInvoices,
} from '@/hooks/api/useMediationContracts';
import type {
  MediationContract,
  MediationContractOffer,
  CreateMediationContractDto,
  UpdateMediationContractDto,
  MediationContractNote,
} from '@/types/api.types';
import {
  MEDIATION_CONTRACT_STATUS,
  MEDIATION_CONTRACT_TYPE,
  VISA_TYPE,
  ARRIVAL_DESTINATIONS,
  CANCEL_BY,
  WORKER_NOMINATION,
  getEnumLabel,
  toSelectOptions,
} from '@/constants/enums';
import OfferSelector from '@/components/contracts/OfferSelector';
import FollowUpTimeline from '@/components/contracts/FollowUpTimeline';
import MessageThread from '@/components/contracts/MessageThread';
import styles from './MediationContracts.module.css';

export default function MediationContractsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledCustomerId = searchParams.get('customerId');

  const language = useAuthStore((state) => state.language);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showTypeChangeModal, setShowTypeChangeModal] = useState(false);
  const [showInsuranceModal, setShowInsuranceModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showNotesListModal, setShowNotesListModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState<MediationContract | null>(null);

  // Customer selection modal (for add contract when no customer prefilled)
  const [showCustomerSelectModal, setShowCustomerSelectModal] = useState(false);
  const [customerSelectId, setCustomerSelectId] = useState<number | null>(null);

  // Edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingContract, setEditingContract] = useState<MediationContract | null>(null);

  // Offer selection state for create/edit modals
  const [createSelectedOffer, setCreateSelectedOffer] = useState<MediationContractOffer | null>(
    null
  );
  const [editSelectedOffer, setEditSelectedOffer] = useState<MediationContractOffer | null>(null);

  // Forms
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [noteForm] = Form.useForm();
  const [cancelForm] = Form.useForm();
  const [typeChangeForm] = Form.useForm();
  const [insuranceForm] = Form.useForm();
  const [invoiceForm] = Form.useForm();

  // API hooks
  const {
    contracts,
    isLoading,
    refetch,
    createContract,
    updateContract,
    deleteContract,
    cancelContract,
    changeContractType,
    addDomesticWorker,
    isCreating,
    isUpdating,
    isCancelling,
    isChangingType,
    isAddingWorker,
  } = useMediationContracts();

  const { customers: allCustomers, isLoading: isLoadingCustomers } = useCustomers();

  const {
    notes,
    isLoading: isLoadingNotes,
    addNote,
    isAddingNote,
  } = useMediationContractNotes(selectedContract?.id);

  const { createInvoice, isCreatingInvoice } = useMediationContractInvoices();

  // Translations
  const t = {
    pageTitle: language === 'ar' ? 'عقود الوساطة' : 'Mediation Contracts',
    pageSubtitle:
      language === 'ar' ? 'إدارة جميع عقود الوساطة والتوسط' : 'Manage all mediation contracts',
    addContract: language === 'ar' ? 'إضافة عقد' : 'Add Contract',
    exportExcel: language === 'ar' ? 'تصدير إكسل' : 'Export Excel',
    print: language === 'ar' ? 'طباعة' : 'Print',
    refresh: language === 'ar' ? 'تحديث' : 'Refresh',
    search:
      language === 'ar'
        ? 'بحث برقم العقد أو اسم العميل...'
        : 'Search by contract number or customer name...',
    allTypes: language === 'ar' ? 'جميع الأنواع' : 'All Types',
    allStatuses: language === 'ar' ? 'جميع الحالات' : 'All Statuses',
    totalContracts: language === 'ar' ? 'إجمالي العقود' : 'Total Contracts',
    activeContracts: language === 'ar' ? 'عقود نشطة' : 'Active Contracts',
    pendingContracts: language === 'ar' ? 'عقود معلقة' : 'Pending Contracts',
    totalRevenue: language === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue',
    contractNumber: language === 'ar' ? 'رقم العقد' : 'Contract #',
    customer: language === 'ar' ? 'العميل' : 'Customer',
    type: language === 'ar' ? 'النوع' : 'Type',
    status: language === 'ar' ? 'الحالة' : 'Status',
    totalCost: language === 'ar' ? 'التكلفة الإجمالية' : 'Total Cost',
    localCost: language === 'ar' ? 'التكلفة المحلية' : 'Local Cost',
    agentCost: language === 'ar' ? 'تكلفة الوكيل' : 'Agent Cost',
    salary: language === 'ar' ? 'الراتب' : 'Salary',
    nationality: language === 'ar' ? 'الجنسية' : 'Nationality',
    profession: language === 'ar' ? 'المهنة' : 'Profession',
    musanedNumber: language === 'ar' ? 'رقم مساند' : 'Musaned #',
    visaNumber: language === 'ar' ? 'رقم التأشيرة' : 'Visa Number',
    arrivalCity: language === 'ar' ? 'مدينة الوصول' : 'Arrival City',
    addNote: language === 'ar' ? 'إضافة ملاحظة' : 'Add Note',
    viewNotes: language === 'ar' ? 'عرض الملاحظات' : 'View Notes',
    payBill: language === 'ar' ? 'دفع الفاتورة' : 'Pay Bill',
    createInvoice: language === 'ar' ? 'إنشاء فاتورة' : 'Create Invoice',
    addInsurance: language === 'ar' ? 'إضافة تأمين عامل' : 'Domestic Worker Insurance',
    changeType: language === 'ar' ? 'تغيير النوع' : 'Change Type',
    cancelContract: language === 'ar' ? 'إلغاء العقد' : 'Cancel Contract',
    noResults: language === 'ar' ? 'لا توجد نتائج' : 'No results found',
    save: language === 'ar' ? 'حفظ' : 'Save',
    cancel: language === 'ar' ? 'إلغاء' : 'Cancel',
    close: language === 'ar' ? 'إغلاق' : 'Close',
    submit: language === 'ar' ? 'إرسال' : 'Submit',
    selectCustomer: language === 'ar' ? 'اختر العميل' : 'Select Customer',
    selectOffer: language === 'ar' ? 'اختر العرض' : 'Select Offer',
    contractDetails: language === 'ar' ? 'تفاصيل العقد' : 'Contract Details',
    financialInfo: language === 'ar' ? 'المعلومات المالية' : 'Financial Information',
    visaInfo: language === 'ar' ? 'معلومات التأشيرة' : 'Visa Information',
    notes: language === 'ar' ? 'الملاحظات' : 'Notes',
    note: language === 'ar' ? 'الملاحظة' : 'Note',
    date: language === 'ar' ? 'التاريخ' : 'Date',
    noNotes: language === 'ar' ? 'لا توجد ملاحظات' : 'No notes found',
    cancelBy: language === 'ar' ? 'إلغاء بواسطة' : 'Cancel By',
    cancelNote: language === 'ar' ? 'سبب الإلغاء' : 'Cancel Reason',
    newType: language === 'ar' ? 'النوع الجديد' : 'New Type',
    insuranceCost: language === 'ar' ? 'تكلفة التأمين' : 'Insurance Cost',
    hasInsurance: language === 'ar' ? 'يوجد تأمين' : 'Has Insurance',
    paymentDate: language === 'ar' ? 'تاريخ الدفع' : 'Payment Date',
    delete: language === 'ar' ? 'حذف' : 'Delete',
    confirmDelete:
      language === 'ar'
        ? 'هل أنت متأكد من حذف هذا العقد؟'
        : 'Are you sure you want to delete this contract?',
    otherCosts: language === 'ar' ? 'تكاليف أخرى' : 'Other Costs',
    taxValue: language === 'ar' ? 'قيمة الضريبة' : 'Tax Value',
    managerDiscount: language === 'ar' ? 'خصم المدير' : 'Manager Discount',
    costDiscount: language === 'ar' ? 'خصم التكلفة' : 'Cost Discount',
    costDescription: language === 'ar' ? 'وصف التكلفة' : 'Cost Description',
    comprehensiveVisa: language === 'ar' ? 'تأشيرة تأهيل شامل' : 'Comprehensive Qualification Visa',
    contractCategory: language === 'ar' ? 'تصنيف العقد' : 'Contract Category',
    marketerSource: language === 'ar' ? 'مصدر التسويق' : 'Marketer Source',
    documentationNumber: language === 'ar' ? 'رقم التوثيق' : 'Documentation #',
    visaDateHijri: language === 'ar' ? 'تاريخ التأشيرة هجري' : 'Visa Date (Hijri)',
  };

  // Helper functions
  const formatCurrency = (amount: number | null | undefined) => {
    if (!amount) return '0 SAR';
    return new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'SAR',
    }).format(amount);
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const getStatusConfig = (statusId: number | null | undefined) => {
    const configs: Record<number, { color: string; label: string; icon: React.ReactNode }> = {
      1: {
        color: 'processing',
        label: getEnumLabel([...MEDIATION_CONTRACT_STATUS], 1, language),
        icon: <ClockCircleOutlined />,
      },
      2: {
        color: 'warning',
        label: getEnumLabel([...MEDIATION_CONTRACT_STATUS], 2, language),
        icon: <ClockCircleOutlined />,
      },
      3: {
        color: 'success',
        label: getEnumLabel([...MEDIATION_CONTRACT_STATUS], 3, language),
        icon: <CheckCircleOutlined />,
      },
      4: {
        color: 'error',
        label: getEnumLabel([...MEDIATION_CONTRACT_STATUS], 4, language),
        icon: <ExclamationCircleOutlined />,
      },
      5: {
        color: 'default',
        label: getEnumLabel([...MEDIATION_CONTRACT_STATUS], 5, language),
        icon: <ClockCircleOutlined />,
      },
    };
    return (
      configs[statusId ?? 0] || {
        color: 'default',
        label: language === 'ar' ? 'غير محدد' : 'Unknown',
        icon: <ClockCircleOutlined />,
      }
    );
  };

  const getTypeTag = (contractType: number | null | undefined) => {
    const configs: Record<number, { color: string; label: string }> = {
      1: { color: 'blue', label: getEnumLabel([...MEDIATION_CONTRACT_TYPE], 1, language) },
      2: { color: 'green', label: getEnumLabel([...MEDIATION_CONTRACT_TYPE], 2, language) },
    };
    return (
      configs[contractType ?? 0] || {
        color: 'default',
        label: language === 'ar' ? 'غير محدد' : 'Unknown',
      }
    );
  };

  // Filter contracts
  const filteredContracts = useMemo(() => {
    if (!contracts) return [];
    return contracts.filter((contract) => {
      const searchLower = searchText.toLowerCase();
      const matchesSearch =
        !searchText ||
        String(contract.id).includes(searchText) ||
        (contract.musanedContractNumber || '').includes(searchText) ||
        (contract.customerName || '').toLowerCase().includes(searchLower) ||
        (contract.customerNameAr || '').includes(searchText);
      const matchesType = typeFilter === 'all' || contract.contractType === Number(typeFilter);
      const matchesStatus = statusFilter === 'all' || contract.statusId === Number(statusFilter);
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [contracts, searchText, typeFilter, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const all = contracts || [];
    return {
      total: all.length,
      active: all.filter((c) => c.statusId === 2).length,
      pending: all.filter((c) => c.statusId === 5 || c.statusId === 1).length,
      revenue: all.reduce((sum, c) => sum + (c.totalCost || 0), 0),
    };
  }, [contracts]);

  // Calculate total cost from form values
  const computeTotalCost = (values: Record<string, unknown>) => {
    const localCost = Number(values.localCost) || 0;
    const agentCostSAR = Number(values.agentCostSAR) || 0;
    const salary = Number(values.salary) || 0;
    const otherCosts = Number(values.otherCosts) || 0;
    const totalTaxValue = Number(values.totalTaxValue) || 0;
    const managerDiscount = Number(values.managerDiscount) || 0;
    const costDiscount = Number(values.costDiscount) || 0;
    const domesticWorkerInsurance = values.hasContractInsurance
      ? Number(values.domesticWorkerInsurance) || 0
      : 0;
    return (
      localCost +
      agentCostSAR +
      salary +
      otherCosts +
      totalTaxValue -
      managerDiscount -
      costDiscount +
      domesticWorkerInsurance
    );
  };

  const handleCostFieldChange = () => {
    const values = createForm.getFieldsValue();
    createForm.setFieldValue('totalCost', computeTotalCost(values));
  };

  // Handle offer selection in CREATE modal → auto-fill fields
  const handleCreateOfferSelect = (offer: MediationContractOffer) => {
    setCreateSelectedOffer(offer);
    createForm.setFieldsValue({
      offerId: offer.id,
      salary: offer.salary ?? 0,
      localCost: offer.localCost ?? 0,
      agentCostSAR: offer.agentCostSAR ?? 0,
    });
    setTimeout(() => {
      const values = createForm.getFieldsValue();
      createForm.setFieldValue('totalCost', computeTotalCost(values));
    }, 50);
  };

  // Handle offer selection in EDIT modal → auto-fill fields
  const handleEditOfferSelect = (offer: MediationContractOffer) => {
    setEditSelectedOffer(offer);
    editForm.setFieldsValue({
      offerId: offer.id,
      salary: offer.salary ?? 0,
      localCost: offer.localCost ?? 0,
      agentCostSAR: offer.agentCostSAR ?? 0,
    });
    setTimeout(() => {
      const values = editForm.getFieldsValue();
      editForm.setFieldValue('totalCost', computeTotalCost(values));
    }, 50);
  };

  // Handle contract creation
  const handleCreateContract = async () => {
    try {
      const values = await createForm.validateFields();
      const totalCost = computeTotalCost(values);
      const data: CreateMediationContractDto = {
        contractType: values.contractType,
        statusId: values.statusId || 1,
        customerId: values.customerId,
        musanedContractNumber: values.musanedContractNumber || null,
        musanedDocumentationNumber: values.musanedDocumentationNumber || null,
        marketerId: values.marketerId || null,
        contractCategory: values.contractCategory || null,
        offerId: values.offerId || null,
        visaType: values.visaType || null,
        visaNumber: values.visaNumber || null,
        visaDateHijri: values.visaDateHijri || null,
        visaDate: values.visaDate ? new Date(values.visaDate).toISOString() : null,
        isComprehensiveQualificationVisa: values.isComprehensiveQualificationVisa || false,
        arrivalDestinationId: values.arrivalDestinationId || null,
        localCost: values.localCost || 0,
        agentCostSAR: values.agentCostSAR || 0,
        salary: values.salary || 0,
        otherCosts: values.otherCosts || 0,
        totalTaxValue: values.totalTaxValue || 0,
        managerDiscount: values.managerDiscount || 0,
        costDiscount: values.costDiscount || 0,
        totalCost: totalCost,
        costDescription: values.costDescription || null,
        hasContractInsurance: values.hasContractInsurance || false,
        domesticWorkerInsurance: values.hasContractInsurance
          ? values.domesticWorkerInsurance || 0
          : 0,
      };
      await createContract(data);
      setShowCreateModal(false);
      setCreateSelectedOffer(null);
      createForm.resetFields();
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  // Handle add note
  const handleAddNote = async () => {
    try {
      const values = await noteForm.validateFields();
      await addNote({
        mediationId: selectedContract!.id,
        dateNote: new Date().toISOString(),
        note: values.note,
      });
      setShowNoteModal(false);
      noteForm.resetFields();
    } catch (error) {
      console.error('Note form validation failed:', error);
    }
  };

  // Handle cancel contract
  const handleCancelContract = async () => {
    try {
      const values = await cancelForm.validateFields();
      await cancelContract({
        contractId: selectedContract!.id,
        cancelBy: values.cancelBy,
        cancelNote: values.cancelNote,
      });
      setShowCancelModal(false);
      cancelForm.resetFields();
      setSelectedContract(null);
    } catch (error) {
      console.error('Cancel form validation failed:', error);
    }
  };

  // Handle type change
  const handleTypeChange = async () => {
    try {
      const values = await typeChangeForm.validateFields();
      await changeContractType({
        contractId: selectedContract!.id,
        type: values.type,
      });
      setShowTypeChangeModal(false);
      typeChangeForm.resetFields();
      setSelectedContract(null);
    } catch (error) {
      console.error('Type change form validation failed:', error);
    }
  };

  // Handle add insurance / domestic worker
  const handleAddInsurance = async () => {
    try {
      const values = await insuranceForm.validateFields();
      await addDomesticWorker({
        contractId: selectedContract!.id,
        hasContractInsurance: values.hasContractInsurance,
        cost: values.cost,
      });
      setShowInsuranceModal(false);
      insuranceForm.resetFields();
      setSelectedContract(null);
    } catch (error) {
      console.error('Insurance form validation failed:', error);
    }
  };

  // Handle create invoice
  const handleCreateInvoice = async () => {
    try {
      const values = await invoiceForm.validateFields();
      await createInvoice({
        mediationContractId: selectedContract!.id,
        paymentDate: values.paymentDate
          ? new Date(values.paymentDate).toISOString()
          : new Date().toISOString(),
        musanedContractNumber:
          values.musanedContractNumber || selectedContract!.musanedContractNumber || '',
      });
      setShowInvoiceModal(false);
      invoiceForm.resetFields();
      setSelectedContract(null);
    } catch (error) {
      console.error('Invoice form validation failed:', error);
    }
  };

  // Handle delete contract
  const handleDeleteContract = (contract: MediationContract) => {
    Modal.confirm({
      title: t.delete,
      content: t.confirmDelete,
      okText: t.delete,
      cancelText: t.cancel,
      okButtonProps: { danger: true },
      onOk: () => deleteContract(contract.id),
    });
  };

  // Open edit modal
  const openEditModal = (contract: MediationContract) => {
    setEditingContract(contract);
    editForm.setFieldsValue({
      contractType: contract.contractType,
      statusId: contract.statusId,
      customerId: contract.customerId,
      musanedContractNumber: contract.musanedContractNumber,
      musanedDocumentationNumber: contract.musanedDocumentationNumber,
      contractCategory: contract.contractCategory,
      offerId: contract.offerId,
      visaType: contract.visaType,
      visaNumber: contract.visaNumber,
      visaDateHijri: contract.visaDateHijri,
      isComprehensiveQualificationVisa: contract.isComprehensiveQualificationVisa ?? false,
      arrivalDestinationId: contract.arrivalDestinationId,
      localCost: contract.localCost,
      agentCostSAR: contract.agentCostSAR,
      salary: contract.salary,
      otherCosts: contract.otherCosts,
      totalTaxValue: contract.totalTaxValue,
      managerDiscount: contract.managerDiscount,
      costDiscount: contract.costDiscount,
      totalCost: contract.totalCost,
      costDescription: contract.costDescription,
      hasContractInsurance: contract.hasContractInsurance ?? false,
      domesticWorkerInsurance: contract.domesticWorkerInsurance,
    });
    setShowEditModal(true);
  };

  // Handle contract update
  const handleUpdateContract = async () => {
    try {
      const values = await editForm.validateFields();
      const totalCost = computeTotalCost(values);
      const data: UpdateMediationContractDto = {
        contractType: values.contractType,
        statusId: values.statusId,
        customerId: values.customerId,
        musanedContractNumber: values.musanedContractNumber || null,
        musanedDocumentationNumber: values.musanedDocumentationNumber || null,
        marketerId: values.marketerId || null,
        contractCategory: values.contractCategory || null,
        offerId: values.offerId || null,
        visaType: values.visaType || null,
        visaNumber: values.visaNumber || null,
        visaDateHijri: values.visaDateHijri || null,
        visaDate: values.visaDate ? new Date(values.visaDate).toISOString() : null,
        isComprehensiveQualificationVisa: values.isComprehensiveQualificationVisa || false,
        arrivalDestinationId: values.arrivalDestinationId || null,
        localCost: values.localCost || 0,
        agentCostSAR: values.agentCostSAR || 0,
        salary: values.salary || 0,
        otherCosts: values.otherCosts || 0,
        totalTaxValue: values.totalTaxValue || 0,
        managerDiscount: values.managerDiscount || 0,
        costDiscount: values.costDiscount || 0,
        totalCost: totalCost,
        costDescription: values.costDescription || null,
        hasContractInsurance: values.hasContractInsurance || false,
        domesticWorkerInsurance: values.hasContractInsurance
          ? values.domesticWorkerInsurance || 0
          : 0,
      };
      await updateContract({ id: editingContract!.id, data });
      setShowEditModal(false);
      editForm.resetFields();
      setEditingContract(null);
      setEditSelectedOffer(null);
    } catch (error) {
      console.error('Edit form validation failed:', error);
    }
  };

  // Open create modal can be re-added if needed; currently Add Contract navigates to /add page

  // Render a contract card
  const renderContractCard = (contract: MediationContract) => {
    const statusConfig = getStatusConfig(contract.statusId);
    const typeTag = getTypeTag(contract.contractType);
    const customerDisplay =
      language === 'ar'
        ? contract.customerNameAr ||
          contract.customerName ||
          `${t.customer} #${contract.customerId}`
        : contract.customerName ||
          contract.customerNameAr ||
          `${t.customer} #${contract.customerId}`;

    return (
      <Col xs={24} key={contract.id}>
        <Card className={styles.contractCard} hoverable>
          <div className={styles.cardContent}>
            {/* Left Section */}
            <div className={styles.cardLeft}>
              <div className={styles.cardHeader}>
                <div className={styles.contractNumber}>
                  <FileTextOutlined className={styles.contractIcon} />
                  <span>#{contract.id}</span>
                  {contract.musanedContractNumber && (
                    <Tag color="geekblue" style={{ marginInlineStart: 8 }}>
                      {t.musanedNumber}: {contract.musanedContractNumber}
                    </Tag>
                  )}
                </div>
              </div>

              <div className={styles.tagsSection}>
                <Tag color={typeTag.color} className={styles.typeTag}>
                  {typeTag.label}
                </Tag>
                <Badge
                  status={
                    statusConfig.color as 'processing' | 'warning' | 'success' | 'error' | 'default'
                  }
                  text={statusConfig.label}
                />
              </div>

              <div className={styles.customerSection}>
                <Avatar size={44} icon={<UserOutlined />} className={styles.customerAvatar} />
                <div className={styles.customerDetails}>
                  <span className={styles.customerName}>{customerDisplay}</span>
                  {contract.customerPhone && (
                    <div className={styles.customerMeta}>
                      <PhoneOutlined />
                      <span dir="ltr">{contract.customerPhone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.detailsSection}>
                {contract.visaNumber && (
                  <div className={styles.detailItem}>
                    <FileTextOutlined className={styles.detailIcon} />
                    <div className={styles.detailText}>
                      <span className={styles.detailLabel}>{t.visaNumber}</span>
                      <span className={styles.detailValue}>{contract.visaNumber}</span>
                    </div>
                  </div>
                )}
                {contract.arrivalDestinationId && (
                  <div className={styles.detailItem}>
                    <EnvironmentOutlined className={styles.detailIcon} />
                    <div className={styles.detailText}>
                      <span className={styles.detailLabel}>{t.arrivalCity}</span>
                      <span className={styles.detailValue}>
                        {getEnumLabel(
                          [...ARRIVAL_DESTINATIONS],
                          contract.arrivalDestinationId,
                          language
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Section */}
            <div className={styles.cardRight}>
              <div className={styles.paymentSection}>
                <div className={styles.paymentHeader}>
                  <span className={styles.paymentLabel}>{t.totalCost}</span>
                  <span className={styles.paymentPercentage}>
                    {formatCurrency(contract.totalCost)}
                  </span>
                </div>
                <Progress
                  percent={0}
                  showInfo={false}
                  strokeColor={{ '0%': '#003366', '100%': '#0056b3' }}
                />
                <div className={styles.paymentAmounts}>
                  <div className={styles.amountItem}>
                    <span className={styles.amountLabel}>{t.localCost}</span>
                    <span className={styles.amountValue} style={{ color: '#52c41a' }}>
                      {formatCurrency(contract.localCost)}
                    </span>
                  </div>
                  <div className={styles.amountItem}>
                    <span className={styles.amountLabel}>{t.agentCost}</span>
                    <span className={styles.amountValue} style={{ color: '#faad14' }}>
                      {formatCurrency(contract.agentCostSAR)}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.datesSection}>
                <div className={styles.dateItem}>
                  <CalendarOutlined />
                  <span>{formatDate(contract.createdAt)}</span>
                </div>
                {contract.visaDate && (
                  <>
                    <span className={styles.dateSeparator}>{'\u2192'}</span>
                    <div className={styles.dateItem}>
                      <CalendarOutlined />
                      <span>{formatDate(contract.visaDate)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Action Buttons */}
          <div className={styles.cardBottom}>
            <div className={styles.actionsList}>
              <Button
                type="link"
                icon={<FileProtectOutlined />}
                className={styles.actionBtn}
                block
                onClick={() => {
                  setSelectedContract(contract);
                  noteForm.resetFields();
                  setShowNoteModal(true);
                }}
              >
                {t.addNote}
              </Button>
              <Button
                type="link"
                icon={<BarsOutlined />}
                className={styles.actionBtn}
                block
                onClick={() => {
                  setSelectedContract(contract);
                  setShowNotesListModal(true);
                }}
              >
                {t.viewNotes}
              </Button>
              <Button
                type="link"
                icon={<MoneyCollectOutlined />}
                className={styles.actionBtn}
                block
                onClick={() => {
                  setSelectedContract(contract);
                  invoiceForm.resetFields();
                  invoiceForm.setFieldValue(
                    'musanedContractNumber',
                    contract.musanedContractNumber
                  );
                  setShowInvoiceModal(true);
                }}
              >
                {t.createInvoice}
              </Button>
              <Button
                type="link"
                icon={<SafetyOutlined />}
                className={[styles.actionBtn, styles.successBtn].join(' ')}
                block
                onClick={() => {
                  setSelectedContract(contract);
                  insuranceForm.resetFields();
                  insuranceForm.setFieldValue(
                    'hasContractInsurance',
                    contract.hasContractInsurance || false
                  );
                  setShowInsuranceModal(true);
                }}
              >
                {t.addInsurance}
              </Button>
              <Button
                type="link"
                icon={<SwapOutlined />}
                className={[styles.actionBtn, styles.dangerBtn].join(' ')}
                block
                onClick={() => {
                  setSelectedContract(contract);
                  typeChangeForm.resetFields();
                  setShowTypeChangeModal(true);
                }}
              >
                {t.changeType}
              </Button>
              <Button
                type="link"
                icon={<CloseCircleOutlined />}
                className={[styles.actionBtn, styles.dangerBtn].join(' ')}
                block
                onClick={() => {
                  setSelectedContract(contract);
                  cancelForm.resetFields();
                  setShowCancelModal(true);
                }}
              >
                {t.cancelContract}
              </Button>
              <Button
                type="link"
                icon={<EyeOutlined />}
                className={styles.actionBtn}
                block
                onClick={() => {
                  setSelectedContract(contract);
                  setShowDetailsModal(true);
                }}
              >
                {t.contractDetails}
              </Button>
              <Button
                type="link"
                icon={<FileTextOutlined />}
                className={styles.actionBtn}
                block
                onClick={() => openEditModal(contract)}
              >
                {language === 'ar' ? 'تعديل العقد' : 'Edit Contract'}
              </Button>
            </div>
          </div>
        </Card>
      </Col>
    );
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className={styles.contractsPage}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerTitle}>
            <FileTextOutlined className={styles.headerIcon} />
            <div>
              <h1>{t.pageTitle}</h1>
              <p className={styles.headerSubtitle}>{t.pageSubtitle}</p>
            </div>
          </div>
          <div className={styles.headerActions}>
            <Button
              icon={<ReloadOutlined />}
              className={styles.secondaryBtn}
              onClick={() => refetch()}
            >
              {t.refresh}
            </Button>
            <Button icon={<FileExcelOutlined />} className={styles.secondaryBtn}>
              {t.exportExcel}
            </Button>
            <Button icon={<PrinterOutlined />} className={styles.secondaryBtn}>
              {t.print}
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className={styles.primaryBtn}
              onClick={() => {
                if (prefilledCustomerId) {
                  router.push(`/contracts/mediationcontract/add?customerId=${prefilledCustomerId}`);
                } else {
                  setCustomerSelectId(null);
                  setShowCustomerSelectModal(true);
                }
              }}
            >
              {t.addContract}
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className={styles.statisticsRow}>
        <Col xs={12} sm={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={t.totalContracts}
              value={stats.total}
              prefix={<FileTextOutlined style={{ color: '#003366' }} />}
              valueStyle={{ color: '#003366' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={t.activeContracts}
              value={stats.active}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={t.pendingContracts}
              value={stats.pending}
              prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={t.totalRevenue}
              value={stats.revenue}
              prefix={<DollarOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
              formatter={(value) => formatCurrency(value as number)}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className={styles.filterCard}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={10}>
            <Input
              placeholder={t.search}
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              size="large"
              className={styles.searchInput}
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              value={typeFilter}
              onChange={setTypeFilter}
              style={{ width: '100%' }}
              size="large"
              options={[
                { value: 'all', label: t.allTypes },
                ...toSelectOptions([...MEDIATION_CONTRACT_TYPE], language).map((o) => ({
                  ...o,
                  value: String(o.value),
                })),
              ]}
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: '100%' }}
              size="large"
              options={[
                { value: 'all', label: t.allStatuses },
                ...toSelectOptions([...MEDIATION_CONTRACT_STATUS], language).map((o) => ({
                  ...o,
                  value: String(o.value),
                })),
              ]}
            />
          </Col>
        </Row>
      </Card>

      {/* Results Info */}
      <div className={styles.resultsInfo}>
        <span>
          {language === 'ar'
            ? '\u0639\u0631\u0636 ' +
              filteredContracts.length +
              ' \u0645\u0646 ' +
              (contracts || []).length +
              ' \u0639\u0642\u062f'
            : 'Showing ' +
              filteredContracts.length +
              ' of ' +
              (contracts || []).length +
              ' contracts'}
        </span>
      </div>

      {/* Contracts Grid */}
      {filteredContracts.length > 0 ? (
        <Row gutter={[16, 16]} className={styles.contractsGrid}>
          {filteredContracts.map(renderContractCard)}
        </Row>
      ) : (
        <Card className={styles.emptyCard}>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t.noResults} />
        </Card>
      )}

      {/* ========== CREATE CONTRACT MODAL ========== */}
      <Modal
        title={t.addContract}
        open={showCreateModal}
        onCancel={() => {
          setShowCreateModal(false);
          setCreateSelectedOffer(null);
        }}
        onOk={handleCreateContract}
        okText={t.save}
        cancelText={t.cancel}
        confirmLoading={isCreating}
        width={800}
        destroyOnClose
      >
        <Form form={createForm} layout="vertical" onValuesChange={handleCostFieldChange}>
          <Divider>{t.contractDetails}</Divider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="customerId"
                label={t.selectCustomer}
                rules={[{ required: true, message: language === 'ar' ? 'مطلوب' : 'Required' }]}
              >
                <Select
                  showSearch
                  placeholder={t.selectCustomer}
                  optionFilterProp="label"
                  options={[]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="contractType"
                label={t.type}
                rules={[{ required: true, message: language === 'ar' ? 'مطلوب' : 'Required' }]}
              >
                <Select
                  placeholder={t.type}
                  options={toSelectOptions([...MEDIATION_CONTRACT_TYPE], language)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="offerId" hidden>
                <InputNumber />
              </Form.Item>
              <Form.Item name="contractCategory" label={t.contractCategory}>
                <Select
                  allowClear
                  placeholder={t.contractCategory}
                  options={toSelectOptions([...WORKER_NOMINATION], language)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="statusId" label={t.status}>
                <Select
                  placeholder={t.status}
                  options={toSelectOptions([...MEDIATION_CONTRACT_STATUS], language)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="musanedContractNumber" label={t.musanedNumber}>
                <Input placeholder={t.musanedNumber} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="musanedDocumentationNumber" label={t.documentationNumber}>
                <Input placeholder={t.documentationNumber} />
              </Form.Item>
            </Col>
          </Row>

          <Divider>{language === 'ar' ? 'اختيار العرض' : 'Select Offer'}</Divider>
          <OfferSelector
            language={language}
            selectedOfferId={createSelectedOffer?.id ?? createForm.getFieldValue('offerId') ?? null}
            onSelect={handleCreateOfferSelect}
            compact
          />

          <Divider>{t.visaInfo}</Divider>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="visaType" label={language === 'ar' ? 'نوع التأشيرة' : 'Visa Type'}>
                <Select
                  allowClear
                  placeholder={language === 'ar' ? 'نوع التأشيرة' : 'Visa Type'}
                  options={toSelectOptions([...VISA_TYPE], language)}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="visaNumber" label={t.visaNumber}>
                <Input placeholder={t.visaNumber} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="visaDateHijri" label={t.visaDateHijri}>
                <Input placeholder="1446/06/15" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="arrivalDestinationId" label={t.arrivalCity}>
                <Select
                  showSearch
                  allowClear
                  placeholder={t.arrivalCity}
                  optionFilterProp="label"
                  options={toSelectOptions([...ARRIVAL_DESTINATIONS], language)}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="isComprehensiveQualificationVisa"
                valuePropName="checked"
                label={t.comprehensiveVisa}
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Divider>{t.financialInfo}</Divider>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="localCost" label={t.localCost}>
                <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="agentCostSAR" label={t.agentCost}>
                <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="salary" label={t.salary}>
                <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="otherCosts" label={t.otherCosts}>
                <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="totalTaxValue" label={t.taxValue}>
                <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="managerDiscount" label={t.managerDiscount}>
                <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="costDiscount" label={t.costDiscount}>
                <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="totalCost" label={t.totalCost}>
                <InputNumber style={{ width: '100%' }} disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="costDescription" label={t.costDescription}>
                <Input placeholder={t.costDescription} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="hasContractInsurance" valuePropName="checked" label={t.hasInsurance}>
                <Switch />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                noStyle
                shouldUpdate={(prev: Record<string, unknown>, curr: Record<string, unknown>) =>
                  prev.hasContractInsurance !== curr.hasContractInsurance
                }
              >
                {({ getFieldValue }: { getFieldValue: (name: string) => unknown }) =>
                  getFieldValue('hasContractInsurance') ? (
                    <Form.Item name="domesticWorkerInsurance" label={t.insuranceCost}>
                      <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
                    </Form.Item>
                  ) : null
                }
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* ========== ADD NOTE MODAL ========== */}
      <Modal
        title={t.addNote}
        open={showNoteModal}
        onCancel={() => setShowNoteModal(false)}
        onOk={handleAddNote}
        okText={t.save}
        cancelText={t.cancel}
        confirmLoading={isAddingNote}
        destroyOnClose
      >
        <Form form={noteForm} layout="vertical">
          <Form.Item
            name="note"
            label={t.note}
            rules={[{ required: true, message: language === 'ar' ? 'مطلوب' : 'Required' }]}
          >
            <Input.TextArea
              rows={4}
              placeholder={language === 'ar' ? 'أدخل الملاحظة...' : 'Enter note...'}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* ========== VIEW NOTES MODAL ========== */}
      <Modal
        title={t.notes + ' - #' + (selectedContract?.id || '')}
        open={showNotesListModal}
        onCancel={() => {
          setShowNotesListModal(false);
          setSelectedContract(null);
        }}
        footer={
          <Button type="primary" onClick={() => setShowNotesListModal(false)}>
            {t.close}
          </Button>
        }
        width={600}
        destroyOnClose
      >
        {isLoadingNotes ? (
          <div style={{ textAlign: 'center', padding: 24 }}>
            <Spin />
          </div>
        ) : notes && notes.length > 0 ? (
          <List
            dataSource={notes}
            renderItem={(item: MediationContractNote) => (
              <List.Item>
                <List.Item.Meta
                  title={formatDate(item.dateNote || item.createdAt)}
                  description={item.note}
                />
              </List.Item>
            )}
          />
        ) : (
          <Empty description={t.noNotes} />
        )}
      </Modal>

      {/* ========== CANCEL CONTRACT MODAL ========== */}
      <Modal
        title={t.cancelContract}
        open={showCancelModal}
        onCancel={() => setShowCancelModal(false)}
        onOk={handleCancelContract}
        okText={t.submit}
        cancelText={t.cancel}
        confirmLoading={isCancelling}
        okButtonProps={{ danger: true }}
        destroyOnClose
      >
        <Form form={cancelForm} layout="vertical">
          <Form.Item
            name="cancelBy"
            label={t.cancelBy}
            rules={[{ required: true, message: language === 'ar' ? 'مطلوب' : 'Required' }]}
          >
            <Select placeholder={t.cancelBy} options={toSelectOptions([...CANCEL_BY], language)} />
          </Form.Item>
          <Form.Item
            name="cancelNote"
            label={t.cancelNote}
            rules={[{ required: true, message: language === 'ar' ? 'مطلوب' : 'Required' }]}
          >
            <Input.TextArea
              rows={3}
              placeholder={language === 'ar' ? 'سبب الإلغاء...' : 'Cancellation reason...'}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* ========== CHANGE TYPE MODAL ========== */}
      <Modal
        title={t.changeType}
        open={showTypeChangeModal}
        onCancel={() => setShowTypeChangeModal(false)}
        onOk={handleTypeChange}
        okText={t.save}
        cancelText={t.cancel}
        confirmLoading={isChangingType}
        destroyOnClose
      >
        <Form form={typeChangeForm} layout="vertical">
          <Form.Item
            name="type"
            label={t.newType}
            rules={[{ required: true, message: language === 'ar' ? 'مطلوب' : 'Required' }]}
          >
            <Select
              placeholder={t.newType}
              options={toSelectOptions([...MEDIATION_CONTRACT_TYPE], language)}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* ========== ADD INSURANCE MODAL ========== */}
      <Modal
        title={t.addInsurance}
        open={showInsuranceModal}
        onCancel={() => setShowInsuranceModal(false)}
        onOk={handleAddInsurance}
        okText={t.save}
        cancelText={t.cancel}
        confirmLoading={isAddingWorker}
        destroyOnClose
      >
        <Form form={insuranceForm} layout="vertical">
          <Form.Item name="hasContractInsurance" valuePropName="checked" label={t.hasInsurance}>
            <Switch />
          </Form.Item>
          <Form.Item
            name="cost"
            label={t.insuranceCost}
            rules={[{ required: true, message: language === 'ar' ? 'مطلوب' : 'Required' }]}
          >
            <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
          </Form.Item>
        </Form>
      </Modal>

      {/* ========== CREATE INVOICE MODAL ========== */}
      <Modal
        title={t.createInvoice}
        open={showInvoiceModal}
        onCancel={() => setShowInvoiceModal(false)}
        onOk={handleCreateInvoice}
        okText={t.save}
        cancelText={t.cancel}
        confirmLoading={isCreatingInvoice}
        destroyOnClose
      >
        <Form form={invoiceForm} layout="vertical">
          <Form.Item name="musanedContractNumber" label={t.musanedNumber}>
            <Input placeholder={t.musanedNumber} />
          </Form.Item>
          <Form.Item
            name="paymentDate"
            label={t.paymentDate}
            rules={[{ required: true, message: language === 'ar' ? 'مطلوب' : 'Required' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* ========== CONTRACT DETAILS MODAL ========== */}
      <Modal
        title={t.contractDetails + ': #' + (selectedContract?.id || '')}
        open={showDetailsModal}
        onCancel={() => {
          setShowDetailsModal(false);
          setSelectedContract(null);
        }}
        footer={
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button
              danger
              onClick={() => selectedContract && handleDeleteContract(selectedContract)}
            >
              {t.delete}
            </Button>
            <Button type="primary" onClick={() => setShowDetailsModal(false)}>
              {t.close}
            </Button>
          </div>
        }
        width={900}
        destroyOnClose
      >
        {selectedContract &&
          (() => {
            const detailCustomerDisplay =
              language === 'ar'
                ? selectedContract.customerNameAr ||
                  selectedContract.customerName ||
                  '#' + selectedContract.customerId
                : selectedContract.customerName ||
                  selectedContract.customerNameAr ||
                  '#' + selectedContract.customerId;
            return (
              <div className={styles.detailsModal}>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <div className={styles.modalSection}>
                      <h4>{t.customer}</h4>
                      <p className={styles.modalValue}>{detailCustomerDisplay}</p>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className={styles.modalSection}>
                      <h4>{t.type}</h4>
                      <Tag color={getTypeTag(selectedContract.contractType).color}>
                        {getTypeTag(selectedContract.contractType).label}
                      </Tag>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className={styles.modalSection}>
                      <h4>{t.status}</h4>
                      <Badge
                        status={
                          getStatusConfig(selectedContract.statusId).color as
                            | 'processing'
                            | 'warning'
                            | 'success'
                            | 'error'
                            | 'default'
                        }
                        text={getStatusConfig(selectedContract.statusId).label}
                      />
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className={styles.modalSection}>
                      <h4>{t.musanedNumber}</h4>
                      <p className={styles.modalValue}>
                        {selectedContract.musanedContractNumber || '-'}
                      </p>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className={styles.modalSection}>
                      <h4>{t.visaNumber}</h4>
                      <p className={styles.modalValue}>{selectedContract.visaNumber || '-'}</p>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className={styles.modalSection}>
                      <h4>{t.arrivalCity}</h4>
                      <p className={styles.modalValue}>
                        {selectedContract.arrivalDestinationId
                          ? getEnumLabel(
                              [...ARRIVAL_DESTINATIONS],
                              selectedContract.arrivalDestinationId,
                              language
                            )
                          : '-'}
                      </p>
                    </div>
                  </Col>

                  <Col span={24}>
                    <Divider>{t.financialInfo}</Divider>
                  </Col>

                  <Col span={8}>
                    <div className={styles.modalSection}>
                      <h4>{t.localCost}</h4>
                      <p className={styles.modalValue}>
                        {formatCurrency(selectedContract.localCost)}
                      </p>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div className={styles.modalSection}>
                      <h4>{t.agentCost}</h4>
                      <p className={styles.modalValue}>
                        {formatCurrency(selectedContract.agentCostSAR)}
                      </p>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div className={styles.modalSection}>
                      <h4>{t.salary}</h4>
                      <p className={styles.modalValue}>{formatCurrency(selectedContract.salary)}</p>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div className={styles.modalSection}>
                      <h4>{t.otherCosts}</h4>
                      <p className={styles.modalValue}>
                        {formatCurrency(selectedContract.otherCosts)}
                      </p>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div className={styles.modalSection}>
                      <h4>{t.taxValue}</h4>
                      <p className={styles.modalValue}>
                        {formatCurrency(selectedContract.totalTaxValue)}
                      </p>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div className={styles.modalSection}>
                      <h4>{t.managerDiscount}</h4>
                      <p className={styles.modalValue} style={{ color: '#ff4d4f' }}>
                        -{formatCurrency(selectedContract.managerDiscount)}
                      </p>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div className={styles.modalSection}>
                      <h4>{t.costDiscount}</h4>
                      <p className={styles.modalValue} style={{ color: '#ff4d4f' }}>
                        -{formatCurrency(selectedContract.costDiscount)}
                      </p>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div className={styles.modalSection}>
                      <h4>{t.totalCost}</h4>
                      <p className={styles.modalValue} style={{ color: '#003366', fontSize: 18 }}>
                        {formatCurrency(selectedContract.totalCost)}
                      </p>
                    </div>
                  </Col>
                  {selectedContract.hasContractInsurance && (
                    <Col span={8}>
                      <div className={styles.modalSection}>
                        <h4>{t.insuranceCost}</h4>
                        <p className={styles.modalValue}>
                          {formatCurrency(selectedContract.domesticWorkerInsurance)}
                        </p>
                      </div>
                    </Col>
                  )}

                  {/* Follow-Up Timeline */}
                  <Col span={24}>
                    <Divider>{language === 'ar' ? 'متابعة العقد' : 'Contract Follow-Up'}</Divider>
                    <FollowUpTimeline contractId={selectedContract.id} language={language} />
                  </Col>

                  {/* Messages Chat */}
                  <Col span={24}>
                    <Divider>{language === 'ar' ? 'الرسائل' : 'Messages'}</Divider>
                    <MessageThread contractId={selectedContract.id} language={language} />
                  </Col>

                  {selectedContract.cancelNote && (
                    <>
                      <Col span={24}>
                        <Divider>{t.cancelContract}</Divider>
                      </Col>
                      <Col span={12}>
                        <div className={styles.modalSection}>
                          <h4>{t.cancelBy}</h4>
                          <p className={styles.modalValue}>
                            {getEnumLabel([...CANCEL_BY], selectedContract.cancelBy, language)}
                          </p>
                        </div>
                      </Col>
                      <Col span={12}>
                        <div className={styles.modalSection}>
                          <h4>{t.cancelNote}</h4>
                          <p className={styles.modalValue}>{selectedContract.cancelNote}</p>
                        </div>
                      </Col>
                    </>
                  )}
                </Row>
              </div>
            );
          })()}
      </Modal>

      {/* ========== EDIT CONTRACT MODAL ========== */}
      <Modal
        title={`${language === 'ar' ? 'تعديل العقد' : 'Edit Contract'} #${editingContract?.id || ''}`}
        open={showEditModal}
        onCancel={() => {
          setShowEditModal(false);
          editForm.resetFields();
          setEditingContract(null);
          setEditSelectedOffer(null);
        }}
        onOk={handleUpdateContract}
        okText={t.save}
        cancelText={t.cancel}
        confirmLoading={isUpdating}
        width={800}
        destroyOnClose
      >
        <Form
          form={editForm}
          layout="vertical"
          onValuesChange={() => {
            const values = editForm.getFieldsValue();
            editForm.setFieldValue('totalCost', computeTotalCost(values));
          }}
        >
          <Divider>{t.contractDetails}</Divider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="contractType"
                label={t.type}
                rules={[{ required: true, message: language === 'ar' ? 'مطلوب' : 'Required' }]}
              >
                <Select
                  placeholder={t.type}
                  options={toSelectOptions([...MEDIATION_CONTRACT_TYPE], language)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="statusId" label={t.status}>
                <Select
                  placeholder={t.status}
                  options={toSelectOptions([...MEDIATION_CONTRACT_STATUS], language)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="contractCategory" label={t.contractCategory}>
                <Select
                  allowClear
                  placeholder={t.contractCategory}
                  options={toSelectOptions([...WORKER_NOMINATION], language)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="musanedContractNumber" label={t.musanedNumber}>
                <Input placeholder={t.musanedNumber} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="musanedDocumentationNumber" label={t.documentationNumber}>
                <Input placeholder={t.documentationNumber} />
              </Form.Item>
            </Col>
          </Row>

          <Divider>{language === 'ar' ? 'اختيار العرض' : 'Select Offer'}</Divider>
          <Form.Item name="offerId" hidden>
            <InputNumber />
          </Form.Item>
          <OfferSelector
            language={language}
            selectedOfferId={
              editSelectedOffer?.id ??
              editForm.getFieldValue('offerId') ??
              editingContract?.offerId ??
              null
            }
            onSelect={handleEditOfferSelect}
            compact
          />

          <Divider>{t.visaInfo}</Divider>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="visaType" label={language === 'ar' ? 'نوع التأشيرة' : 'Visa Type'}>
                <Select
                  allowClear
                  placeholder={language === 'ar' ? 'نوع التأشيرة' : 'Visa Type'}
                  options={toSelectOptions([...VISA_TYPE], language)}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="visaNumber" label={t.visaNumber}>
                <Input placeholder={t.visaNumber} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="visaDateHijri" label={t.visaDateHijri}>
                <Input placeholder="1446/06/15" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="arrivalDestinationId" label={t.arrivalCity}>
                <Select
                  showSearch
                  allowClear
                  placeholder={t.arrivalCity}
                  optionFilterProp="label"
                  options={toSelectOptions([...ARRIVAL_DESTINATIONS], language)}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="isComprehensiveQualificationVisa"
                valuePropName="checked"
                label={t.comprehensiveVisa}
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Divider>{t.financialInfo}</Divider>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="localCost" label={t.localCost}>
                <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="agentCostSAR" label={t.agentCost}>
                <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="salary" label={t.salary}>
                <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="otherCosts" label={t.otherCosts}>
                <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="totalTaxValue" label={t.taxValue}>
                <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="managerDiscount" label={t.managerDiscount}>
                <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="costDiscount" label={t.costDiscount}>
                <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="totalCost" label={t.totalCost}>
                <InputNumber style={{ width: '100%' }} disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="costDescription" label={t.costDescription}>
                <Input placeholder={t.costDescription} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="hasContractInsurance" valuePropName="checked" label={t.hasInsurance}>
                <Switch />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                noStyle
                shouldUpdate={(prev: Record<string, unknown>, curr: Record<string, unknown>) =>
                  prev.hasContractInsurance !== curr.hasContractInsurance
                }
              >
                {({ getFieldValue }: { getFieldValue: (name: string) => unknown }) =>
                  getFieldValue('hasContractInsurance') ? (
                    <Form.Item name="domesticWorkerInsurance" label={t.insuranceCost}>
                      <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
                    </Form.Item>
                  ) : null
                }
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Customer Selection Modal - shown when adding a contract without a pre-selected customer */}
      <Modal
        title={
          language === 'ar'
            ? 'اختر العميل لإنشاء عقد وساطة'
            : 'Select Customer to Create Mediation Contract'
        }
        open={showCustomerSelectModal}
        onCancel={() => {
          setShowCustomerSelectModal(false);
          setCustomerSelectId(null);
        }}
        onOk={() => {
          if (customerSelectId) {
            setShowCustomerSelectModal(false);
            router.push(`/contracts/mediationcontract/add?customerId=${customerSelectId}`);
          }
        }}
        okText={language === 'ar' ? 'متابعة' : 'Continue'}
        cancelText={language === 'ar' ? 'إلغاء' : 'Cancel'}
        okButtonProps={{ disabled: !customerSelectId }}
      >
        <Form layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item label={language === 'ar' ? 'العميل' : 'Customer'} required>
            <Select
              showSearch
              placeholder={
                language === 'ar' ? 'ابحث واختر العميل...' : 'Search and select customer...'
              }
              loading={isLoadingCustomers}
              value={customerSelectId}
              onChange={(val) => setCustomerSelectId(val)}
              filterOption={(input, option) =>
                String(option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={(Array.isArray(allCustomers) ? allCustomers : []).map((c: any) => ({
                value: c.id,
                label:
                  language === 'ar'
                    ? c.arabicName || c.name || `#${c.id}`
                    : c.name || c.arabicName || `#${c.id}`,
              }))}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
