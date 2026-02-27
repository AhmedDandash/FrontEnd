'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  Dropdown,
  DatePicker,
  Spin,
  Form,
  InputNumber,
  Alert,
  message,
} from 'antd';
import type { MenuProps } from 'antd';
import {
  FileTextOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  PrinterOutlined,
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  MoreOutlined,
  FileExcelOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  FileProtectOutlined,
  WarningOutlined,
  MoneyCollectOutlined,
  UserDeleteOutlined,
  UserAddOutlined,
  CloseCircleOutlined,
  BarsOutlined,
  ReloadOutlined,
  HomeOutlined,
} from '@ant-design/icons';

import { useAuthStore } from '@/store/authStore';
import { useEmploymentOperatingContracts } from '@/hooks/api/useEmploymentOperatingContracts';
import { useNationalities } from '@/hooks/api/useNationalities';
import { useJobs } from '@/hooks/api/useJobs';
import { useCustomers } from '@/hooks/api/useCustomers';
import RentOfferSelector from '@/components/contracts/RentOfferSelector';
import type { EmploymentOperatingContract, EmploymentContractOffer } from '@/types/api.types';
import styles from './RentContracts.module.css';

const { RangePicker } = DatePicker;

interface RentContract {
  id: string;
  customerId: number;
  contractNumber: string;
  customerName: string;
  customerNameAr: string;
  customerPhone: string;
  status: 'active' | 'pending' | 'expired' | 'renewed' | 'cancelled';
  startDate: string;
  endDate: string;
  monthlyRent: number;
  totalCollected: number;
  remainingAmount: number;
  workerName: string;
  workerNameAr: string;
  nationality: string;
  nationalityAr: string;
  profession: string;
  professionAr: string;
  agent: string;
  agentAr: string;
  branch: string;
  branchAr: string;
  renewalCount: number;
  daysRemaining: number;
  createdAt: string;
  notes: string;
  notesAr: string;
}

export default function RentContractsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const customerId = searchParams.get('customerId');

  const language = useAuthStore((state) => state.language);
  const isRtl = language === 'ar';
  const [mounted, setMounted] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [nationalityFilter, setNationalityFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[any, any] | null>(null);
  const [selectedContract, setSelectedContract] = useState<RentContract | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Create Contract Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createSelectedOffer, setCreateSelectedOffer] = useState<EmploymentContractOffer | null>(
    null
  );
  const [createForm] = Form.useForm();

  // Fetch contracts from API
  const {
    contracts: apiContracts,
    isLoading,
    createContract,
    isCreating,
  } = useEmploymentOperatingContracts();

  // Lookup hooks for resolving null names
  const { data: nationalities = [] } = useNationalities();
  const { data: jobs = [] } = useJobs();
  const { customers = [] } = useCustomers();

  // Safely extract data from API response (handles wrapped responses)
  const contractsData = useMemo((): EmploymentOperatingContract[] => {
    console.log('Rent Page - API Response:', apiContracts);
    if (!apiContracts) return [];
    if (Array.isArray(apiContracts)) return apiContracts;
    if (
      typeof apiContracts === 'object' &&
      'data' in apiContracts &&
      Array.isArray((apiContracts as any).data)
    ) {
      return (apiContracts as any).data;
    }
    return [];
  }, [apiContracts]);

  // Helper: resolve nationality name from ID
  const getNationalityNameById = useMemo(() => {
    const map = new Map<number, { ar: string; en: string }>();
    (nationalities as any[]).forEach((n: any) => {
      map.set(n.id, {
        ar: n.nationalityNameAr || n.name || `#${n.id}`,
        en: n.nationalityName || n.name || n.nationalityNameAr || `#${n.id}`,
      });
    });
    return (id: number | null | undefined): { ar: string; en: string } => {
      if (!id) return { ar: 'غير معروف', en: 'Unknown' };
      return map.get(id) || { ar: 'غير معروف', en: 'Unknown' };
    };
  }, [nationalities]);

  // Helper: resolve job name from ID
  const getJobNameById = useMemo(() => {
    const map = new Map<number, { ar: string; en: string }>();
    (jobs as any[]).forEach((j: any) => {
      map.set(j.id, {
        ar: j.jobNameAr || j.name || `#${j.id}`,
        en: j.jobNameEn || j.jobNameAr || j.name || `#${j.id}`,
      });
    });
    return (id: number | null | undefined): { ar: string; en: string } => {
      if (!id) return { ar: 'غير معروف', en: 'Unknown' };
      return map.get(id) || { ar: 'غير معروف', en: 'Unknown' };
    };
  }, [jobs]);

  // Map API data to internal RentContract format
  const allContracts = useMemo((): RentContract[] => {
    console.log('Rent Page - Contracts Data Count:', contractsData.length);
    const mapped = contractsData.map((contract): RentContract => {
      const startDate = contract.contractStartDate || new Date().toISOString();
      const endDate = contract.contractEndDate || new Date().toISOString();
      const daysRemaining = Math.max(
        0,
        Math.floor((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      );

      // Determine status based on dates and finish status
      let status: RentContract['status'] = 'active';
      if (contract.isFinish) {
        status = 'cancelled';
      } else if (daysRemaining <= 0) {
        status = 'expired';
      } else if (daysRemaining <= 30) {
        status = 'pending'; // expiring soon
      }

      const monthlyRent = contract.cost || 0;
      const monthsActive = Math.max(
        1,
        Math.floor((Date.now() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24 * 30))
      );
      const totalCollected = monthlyRent * monthsActive;

      // Resolve nationality and job names via lookup
      const natName = getNationalityNameById(contract.nationalityId);
      const jobNameResolved = contract.jobName
        ? { ar: contract.jobName, en: contract.jobName }
        : getJobNameById(contract.jobId);

      return {
        id: String(contract.id),
        customerId: contract.customerId || 0,
        contractNumber: `R${2024000 + contract.id}`,
        customerName: contract.customerNameAr || 'Unknown',
        customerNameAr: contract.customerNameAr || 'غير معروف',
        customerPhone: contract.mobile || '05xxxxxxxx',
        status,
        startDate,
        endDate,
        monthlyRent,
        totalCollected,
        remainingAmount: Math.max(
          0,
          (contract.totalCostWithTax || contract.cost || 0) - totalCollected
        ),
        workerName: jobNameResolved.en,
        workerNameAr: jobNameResolved.ar,
        nationality: natName.en,
        nationalityAr: natName.ar,
        profession: jobNameResolved.en,
        professionAr: jobNameResolved.ar,
        agent: 'Unknown',
        agentAr: 'غير معروف',
        branch: 'Sigma Recruitment Office',
        branchAr: 'سيجما الكفاءات للاستقدام',
        renewalCount: 0,
        daysRemaining,
        createdAt: contract.createdAt || new Date().toISOString(),
        notes: contract.noteFinish || '',
        notesAr: contract.noteFinish || '',
      };
    });
    console.log('Rent Page - Mapped Contracts Count:', mapped.length);
    console.log('Rent Page - Sample Contract:', mapped[0]);
    return mapped;
  }, [contractsData, getNationalityNameById, getJobNameById]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Translations
  const t = {
    pageTitle: language === 'ar' ? 'عقود التشغيل' : 'Operation Contracts',
    pageSubtitle:
      language === 'ar' ? 'إدارة جميع عقود تشغيل العمالة' : 'Manage all operation worker contracts',
    addContract: language === 'ar' ? 'إضافة عقد' : 'Add Contract',
    exportExcel: language === 'ar' ? 'تصدير إكسل' : 'Export Excel',
    print: language === 'ar' ? 'طباعة' : 'Print',
    search:
      language === 'ar'
        ? 'بحث برقم العقد أو اسم العميل...'
        : 'Search by contract number or customer name...',
    allStatuses: language === 'ar' ? 'جميع الحالات' : 'All Statuses',
    active: language === 'ar' ? 'نشط' : 'Active',
    pending: language === 'ar' ? 'معلق' : 'Pending',
    expired: language === 'ar' ? 'منتهي' : 'Expired',
    renewed: language === 'ar' ? 'متجدد' : 'Renewed',
    cancelled: language === 'ar' ? 'ملغى' : 'Cancelled',
    allNationalities: language === 'ar' ? 'جميع الجنسيات' : 'All Nationalities',
    dateRange: language === 'ar' ? 'نطاق التاريخ' : 'Date Range',
    startDate: language === 'ar' ? 'تاريخ البداية' : 'Start Date',
    endDate: language === 'ar' ? 'تاريخ النهاية' : 'End Date',
    totalContracts: language === 'ar' ? 'إجمالي العقود' : 'Total Contracts',
    activeContracts: language === 'ar' ? 'عقود نشطة' : 'Active Contracts',
    expiringContracts: language === 'ar' ? 'عقود قرب الانتهاء' : 'Expiring Soon',
    totalRevenue: language === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue',
    contractNumber: language === 'ar' ? 'رقم العقد' : 'Contract Number',
    customer: language === 'ar' ? 'العميل' : 'Customer',
    worker: language === 'ar' ? 'العامل' : 'Worker',
    status: language === 'ar' ? 'الحالة' : 'Status',
    monthlyRent: language === 'ar' ? 'الإيجار الشهري' : 'Monthly Rent',
    collected: language === 'ar' ? 'المحصل' : 'Collected',
    remaining: language === 'ar' ? 'المتبقي' : 'Remaining',
    nationality: language === 'ar' ? 'الجنسية' : 'Nationality',
    profession: language === 'ar' ? 'المهنة' : 'Profession',
    renewals: language === 'ar' ? 'التجديدات' : 'Renewals',
    daysLeft: language === 'ar' ? 'الأيام المتبقية' : 'Days Left',
    viewDetails: language === 'ar' ? 'عرض التفاصيل' : 'View Details',
    edit: language === 'ar' ? 'تعديل' : 'Edit',
    delete: language === 'ar' ? 'حذف' : 'Delete',
    noResults: language === 'ar' ? 'لا توجد نتائج' : 'No results found',
    phone: language === 'ar' ? 'الهاتف' : 'Phone',
    addNote: language === 'ar' ? 'إضافة ملاحظة' : 'Add Note',
    addComplaint: language === 'ar' ? 'إضافة شكوى' : 'Add Complaint',
    addContact: language === 'ar' ? 'إضافة اتصال' : 'Add Contact',
    collectPayment: language === 'ar' ? 'تحصيل دفعة' : 'Collect Payment',
    renewContract: language === 'ar' ? 'تجديد العقد' : 'Renew Contract',
    releaseWorker: language === 'ar' ? 'تحرير العامل' : 'Release Worker',
    transferWorker: language === 'ar' ? 'نقل العامل' : 'Transfer Worker',
    cancel: language === 'ar' ? 'إلغاء' : 'Cancel',
    followUpStatus: language === 'ar' ? 'حالة المتابعة' : 'Follow-up Status',
    refresh: language === 'ar' ? 'تحديث' : 'Refresh',
  };

  // Filter contracts (including by customer ID if provided)
  const filteredContracts = useMemo(() => {
    return allContracts.filter((contract) => {
      // Filter by customer ID if provided in URL
      if (customerId && contract.customerId !== Number(customerId)) {
        return false;
      }
      const searchLower = searchText.toLowerCase();
      const matchesSearch =
        !searchText ||
        contract.contractNumber.toLowerCase().includes(searchLower) ||
        contract.customerName.toLowerCase().includes(searchLower) ||
        contract.customerNameAr.includes(searchText) ||
        contract.workerName.toLowerCase().includes(searchLower) ||
        contract.workerNameAr.includes(searchText);

      const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
      const matchesNationality =
        nationalityFilter === 'all' || contract.nationality === nationalityFilter;

      const matchesDate =
        !dateRange ||
        (new Date(contract.startDate) >= dateRange[0].toDate() &&
          new Date(contract.startDate) <= dateRange[1].toDate());

      return matchesSearch && matchesStatus && matchesNationality && matchesDate;
    });
  }, [allContracts, searchText, statusFilter, nationalityFilter, dateRange, customerId]);

  // Statistics
  const stats = useMemo(
    () => ({
      total: allContracts.length,
      active: allContracts.filter((c) => c.status === 'active').length,
      expiring: allContracts.filter((c) => c.daysRemaining < 30 && c.status === 'active').length,
      revenue: allContracts.reduce((sum, c) => sum + c.totalCollected, 0),
    }),
    [allContracts]
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'SAR',
    }).format(amount);
  };

  const getStatusConfig = (status: string) => {
    const config: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
      active: { color: 'success', label: t.active, icon: <CheckCircleOutlined /> },
      pending: { color: 'warning', label: t.pending, icon: <ClockCircleOutlined /> },
      expired: { color: 'error', label: t.expired, icon: <ExclamationCircleOutlined /> },
      renewed: { color: 'processing', label: t.renewed, icon: <ReloadOutlined /> },
      cancelled: { color: 'default', label: t.cancelled, icon: <CloseCircleOutlined /> },
    };
    return (
      config[status] || {
        color: 'default',
        label: status,
        icon: <ClockCircleOutlined />,
      }
    );
  };

  const handleViewDetails = (contract: RentContract) => {
    setSelectedContract(contract);
    setShowDetailsModal(true);
  };

  const handleAddContract = () => {
    setCreateSelectedOffer(null);
    createForm.resetFields();
    setShowCreateModal(true);
  };

  // Handle offer selection in create modal — auto-fill form fields
  const handleCreateOfferSelect = (offer: EmploymentContractOffer) => {
    setCreateSelectedOffer(offer);
    createForm.setFieldsValue({
      offerId: offer.id,
      nationalityId: offer.nationalityId ?? undefined,
      jobId: offer.jobId ?? undefined,
      duration: offer.duration ?? undefined,
      cost: offer.cost ?? 0,
      insurance: offer.insurance ?? 0,
      offerPrice: offer.totalCostWithTax ?? offer.cost ?? 0,
    });
  };

  // Handle create contract form submission
  const handleCreateContractSubmit = async () => {
    try {
      const values = await createForm.validateFields();
      createContract({
        customerId: values.customerId,
        offerId: values.offerId,
        nationalityId: values.nationalityId,
        jobId: values.jobId,
        duration: values.duration,
        cost: values.cost,
        insurance: values.insurance,
        offerPrice: values.offerPrice,
        contractStartDate: values.contractStartDate?.toISOString(),
        contractEndDate: values.contractEndDate?.toISOString(),
        customerAddress: values.customerAddress,
        workerNameAr: values.workerNameAr,
        workerNameEn: values.workerNameEn,
        workerPhone: values.workerPhone,
        workersCount: values.workersCount,
        paymentMethod: values.paymentMethod,
      });
      setShowCreateModal(false);
      createForm.resetFields();
      setCreateSelectedOffer(null);
    } catch {
      // validation errors handled by form
    }
  };

  const handleExportExcel = () => {
    console.log('Export to Excel clicked');
    // TODO: Implement Excel export
  };

  const handlePrint = () => {
    console.log('Print clicked');
    window.print();
  };

  const handleEditContract = (contract: RentContract) => {
    console.log('Edit contract:', contract.id);
    // TODO: Navigate to edit page or open modal
  };

  const handleDeleteContract = (contract: RentContract) => {
    console.log('Delete contract:', contract.id);
    // TODO: Show confirmation modal and delete
  };

  const handlePrintContract = (contract: RentContract) => {
    console.log('Print contract:', contract.id);
    // TODO: Open print preview for specific contract
  };

  const handleAddNote = (contract: RentContract) => {
    console.log('Add note for contract:', contract.id);
    // TODO: Open add note modal
  };

  const handleAddComplaint = (contract: RentContract) => {
    console.log('Add complaint for contract:', contract.id);
    // TODO: Open add complaint modal
  };

  const handleAddContact = (contract: RentContract) => {
    console.log('Add contact for contract:', contract.id);
    // TODO: Open add contact modal
  };

  const handleCollectPayment = (contract: RentContract) => {
    console.log('Collect payment for contract:', contract.id);
    // TODO: Open payment collection modal
  };

  const handleRenewContract = (contract: RentContract) => {
    console.log('Renew contract:', contract.id);
    // TODO: Open contract renewal modal
  };

  const handleReleaseWorker = (contract: RentContract) => {
    console.log('Release worker from contract:', contract.id);
    // TODO: Open release worker confirmation
  };

  const handleTransferWorker = (contract: RentContract) => {
    console.log('Transfer worker from contract:', contract.id);
    // TODO: Open transfer worker modal
  };

  const handleCancelContract = (contract: RentContract) => {
    console.log('Cancel contract:', contract.id);
    // TODO: Open cancel contract confirmation
  };

  const handleFollowUpStatus = (contract: RentContract) => {
    console.log('View follow-up status for contract:', contract.id);
    // TODO: Navigate to follow-up page or open modal
  };

  const getMenuItems = (contract: RentContract): MenuProps['items'] => [
    {
      key: 'view',
      label: t.viewDetails,
      icon: <EyeOutlined />,
      onClick: () => handleViewDetails(contract),
    },
    {
      key: 'edit',
      label: t.edit,
      icon: <EditOutlined />,
      onClick: () => handleEditContract(contract),
    },
    {
      key: 'print',
      label: t.print,
      icon: <PrinterOutlined />,
      onClick: () => handlePrintContract(contract),
    },
    {
      type: 'divider',
    },
    {
      key: 'delete',
      label: t.delete,
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => handleDeleteContract(contract),
    },
  ];

  const renderContractCard = (contract: RentContract) => {
    const statusConfig = getStatusConfig(contract.status);
    const collectionProgress =
      (contract.totalCollected / (contract.totalCollected + contract.remainingAmount)) * 100;

    return (
      <Col xs={24} key={contract.id}>
        <Card className={styles.contractCard} hoverable>
          <div className={styles.cardContent}>
            {/* Left Section */}
            <div className={styles.cardLeft}>
              {/* Card Header */}
              <div className={styles.cardHeader}>
                <div className={styles.contractNumber}>
                  <FileTextOutlined className={styles.contractIcon} />
                  <span>#{contract.contractNumber}</span>
                  {contract.renewalCount > 0 && (
                    <Tag color="cyan" className={styles.renewalTag}>
                      <ReloadOutlined /> {contract.renewalCount}{' '}
                      {language === 'ar' ? 'تجديد' : 'Renewals'}
                    </Tag>
                  )}
                </div>
                <Dropdown menu={{ items: getMenuItems(contract) }} trigger={['click']}>
                  <Button type="text" icon={<MoreOutlined />} className={styles.moreBtn} />
                </Dropdown>
              </div>

              {/* Status & Days Left */}
              <div className={styles.tagsSection}>
                <Badge status={statusConfig.color as any} text={statusConfig.label} />
                {contract.status === 'active' && contract.daysRemaining < 30 && (
                  <Tag color="warning" icon={<ClockCircleOutlined />}>
                    {contract.daysRemaining} {t.daysLeft}
                  </Tag>
                )}
              </div>

              {/* Customer Info */}
              <div className={styles.customerSection}>
                <Avatar size={44} icon={<UserOutlined />} className={styles.customerAvatar} />
                <div className={styles.customerDetails}>
                  <span className={styles.customerName}>
                    {language === 'ar' ? contract.customerNameAr : contract.customerName}
                  </span>
                  <div className={styles.customerMeta}>
                    <PhoneOutlined />
                    <span dir="ltr">{contract.customerPhone}</span>
                  </div>
                </div>
              </div>

              {/* Worker Info */}
              <div className={styles.workerSection}>
                <div className={styles.workerItem}>
                  <HomeOutlined className={styles.workerIcon} />
                  <div className={styles.workerText}>
                    <span className={styles.workerLabel}>{t.worker}</span>
                    <span className={styles.workerValue}>
                      {language === 'ar' ? contract.workerNameAr : contract.workerName}
                    </span>
                  </div>
                </div>
                <div className={styles.workerItem}>
                  <EnvironmentOutlined className={styles.workerIcon} />
                  <div className={styles.workerText}>
                    <span className={styles.workerLabel}>{t.nationality}</span>
                    <span className={styles.workerValue}>
                      {language === 'ar' ? contract.nationalityAr : contract.nationality}
                    </span>
                  </div>
                </div>
                <div className={styles.workerItem}>
                  <TeamOutlined className={styles.workerIcon} />
                  <div className={styles.workerText}>
                    <span className={styles.workerLabel}>{t.profession}</span>
                    <span className={styles.workerValue}>
                      {language === 'ar' ? contract.professionAr : contract.profession}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className={styles.cardRight}>
              {/* Monthly Rent */}
              <div className={styles.rentSection}>
                <div className={styles.rentHeader}>
                  <span className={styles.rentLabel}>{t.monthlyRent}</span>
                  <span className={styles.rentAmount}>{formatCurrency(contract.monthlyRent)}</span>
                </div>
                <Progress
                  percent={collectionProgress}
                  showInfo={false}
                  strokeColor={{
                    '0%': '#003366',
                    '100%': '#0056b3',
                  }}
                />
                <div className={styles.rentAmounts}>
                  <div className={styles.amountItem}>
                    <span className={styles.amountLabel}>{t.collected}</span>
                    <span className={styles.amountValue} style={{ color: '#52c41a' }}>
                      {formatCurrency(contract.totalCollected)}
                    </span>
                  </div>
                  <div className={styles.amountItem}>
                    <span className={styles.amountLabel}>{t.remaining}</span>
                    <span className={styles.amountValue} style={{ color: '#faad14' }}>
                      {formatCurrency(contract.remainingAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className={styles.datesSection}>
                <div className={styles.dateItem}>
                  <CalendarOutlined />
                  <span>{formatDate(contract.startDate)}</span>
                </div>
                <span className={styles.dateSeparator}>→</span>
                <div className={styles.dateItem}>
                  <CalendarOutlined />
                  <span>{formatDate(contract.endDate)}</span>
                </div>
              </div>

              {/* View Details Button */}
              <Button
                type="primary"
                block
                icon={<EyeOutlined />}
                className={styles.viewBtn}
                onClick={() => handleViewDetails(contract)}
              >
                {t.viewDetails}
              </Button>
            </div>
          </div>

          {/* Bottom Section - Action Buttons */}
          <div className={styles.cardBottom}>
            <div className={styles.actionsList}>
              <Button
                type="link"
                icon={<FileProtectOutlined />}
                className={styles.actionBtn}
                block
                onClick={() => handleAddNote(contract)}
              >
                {t.addNote}
              </Button>
              <Button
                type="link"
                icon={<WarningOutlined />}
                className={styles.actionBtn}
                block
                onClick={() => handleAddComplaint(contract)}
              >
                {t.addComplaint}
              </Button>
              <Button
                type="link"
                icon={<PhoneOutlined />}
                className={styles.actionBtn}
                block
                onClick={() => handleAddContact(contract)}
              >
                {t.addContact}
              </Button>
              <Button
                type="link"
                icon={<MoneyCollectOutlined />}
                className={`${styles.actionBtn} ${styles.successBtn}`}
                block
                onClick={() => handleCollectPayment(contract)}
              >
                {t.collectPayment}
              </Button>
              <Button
                type="link"
                icon={<ReloadOutlined />}
                className={`${styles.actionBtn} ${styles.successBtn}`}
                block
                onClick={() => handleRenewContract(contract)}
              >
                {t.renewContract}
              </Button>
              <Button
                type="link"
                icon={<UserDeleteOutlined />}
                className={styles.actionBtn}
                block
                onClick={() => handleReleaseWorker(contract)}
              >
                {t.releaseWorker}
              </Button>
              <Button
                type="link"
                icon={<UserAddOutlined />}
                className={styles.actionBtn}
                block
                onClick={() => handleTransferWorker(contract)}
              >
                {t.transferWorker}
              </Button>
              <Button
                type="link"
                icon={<CloseCircleOutlined />}
                className={`${styles.actionBtn} ${styles.dangerBtn}`}
                block
                onClick={() => handleCancelContract(contract)}
              >
                {t.cancel}
              </Button>
              <Button
                type="link"
                icon={<BarsOutlined />}
                className={styles.actionBtn}
                block
                onClick={() => handleFollowUpStatus(contract)}
              >
                {t.followUpStatus}
              </Button>
            </div>
          </div>
        </Card>
      </Col>
    );
  };

  if (!mounted) {
    return null;
  }

  if (isLoading) {
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}
      >
        <Spin size="large" tip={language === 'ar' ? 'جاري التحميل...' : 'Loading...'} />
      </div>
    );
  }

  return (
    <div className={styles.rentContractsPage}>
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
              icon={<FileExcelOutlined />}
              className={styles.secondaryBtn}
              onClick={handleExportExcel}
            >
              {t.exportExcel}
            </Button>
            <Button
              icon={<PrinterOutlined />}
              className={styles.secondaryBtn}
              onClick={handlePrint}
            >
              {t.print}
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className={styles.primaryBtn}
              onClick={handleAddContract}
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
              title={t.expiringContracts}
              value={stats.expiring}
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

      {/* Customer Filter Indicator */}
      {customerId && (
        <Card style={{ marginBottom: 16, background: '#e6f7ff', borderColor: '#1890ff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <UserOutlined style={{ color: '#1890ff' }} />
            <span>
              {language === 'ar'
                ? `عرض عقود العميل رقم: ${customerId}`
                : `Showing contracts for Customer ID: ${customerId}`}
            </span>
            <Button type="link" size="small" onClick={() => router.push('/operation/rent')}>
              {language === 'ar' ? 'عرض جميع العقود' : 'Show All Contracts'}
            </Button>
          </div>
        </Card>
      )}

      {/* Filters */}
      <Card className={styles.filterCard}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
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
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: '100%' }}
              size="large"
              options={[
                { value: 'all', label: t.allStatuses },
                { value: 'active', label: t.active },
                { value: 'pending', label: t.pending },
                { value: 'expired', label: t.expired },
                { value: 'renewed', label: t.renewed },
                { value: 'cancelled', label: t.cancelled },
              ]}
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              value={nationalityFilter}
              onChange={setNationalityFilter}
              style={{ width: '100%' }}
              size="large"
              options={[
                { value: 'all', label: t.allNationalities },
                { value: 'Philippines', label: language === 'ar' ? 'الفلبين' : 'Philippines' },
                { value: 'India', label: language === 'ar' ? 'الهند' : 'India' },
                { value: 'Indonesia', label: language === 'ar' ? 'إندونيسيا' : 'Indonesia' },
                { value: 'Bangladesh', label: language === 'ar' ? 'بنغلاديش' : 'Bangladesh' },
              ]}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <RangePicker
              value={dateRange}
              onChange={(dates) => setDateRange(dates)}
              style={{ width: '100%' }}
              size="large"
              placeholder={[t.startDate, t.endDate]}
              format="YYYY-MM-DD"
            />
          </Col>
        </Row>
      </Card>

      {/* Results Info */}
      <div className={styles.resultsInfo}>
        <span>
          {language === 'ar'
            ? `عرض ${filteredContracts.length} من ${allContracts.length} عقد`
            : `Showing ${filteredContracts.length} of ${allContracts.length} contracts`}
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

      {/* Create Contract Modal */}
      <Modal
        title={
          <span>
            <PlusOutlined style={{ marginInlineEnd: 8 }} />
            {isRtl ? 'إضافة عقد تشغيل' : 'Add Operating Contract'}
          </span>
        }
        open={showCreateModal}
        onCancel={() => {
          setShowCreateModal(false);
          createForm.resetFields();
          setCreateSelectedOffer(null);
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setShowCreateModal(false);
              createForm.resetFields();
              setCreateSelectedOffer(null);
            }}
          >
            {isRtl ? 'إلغاء' : 'Cancel'}
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={isCreating}
            onClick={handleCreateContractSubmit}
          >
            {isRtl ? 'إنشاء العقد' : 'Create Contract'}
          </Button>,
        ]}
        width={1000}
        destroyOnClose
      >
        {/* Step 1: Select Offer */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 8 }}>{isRtl ? '1. اختر العرض' : '1. Select Offer'}</h3>
          <Alert
            type="info"
            showIcon
            message={
              isRtl
                ? 'اختر عرض من الجدول أدناه لملء بيانات العقد تلقائياً'
                : 'Select an offer from the table below to auto-fill contract data'
            }
            style={{ marginBottom: 16 }}
          />
          <RentOfferSelector
            language={language}
            selectedOfferId={createSelectedOffer?.id ?? createForm.getFieldValue('offerId') ?? null}
            onSelect={handleCreateOfferSelect}
            compact
          />
        </div>

        {/* Step 2: Contract Form */}
        <div>
          <h3 style={{ marginBottom: 16 }}>{isRtl ? '2. بيانات العقد' : '2. Contract Details'}</h3>

          {createSelectedOffer && (
            <Alert
              type="success"
              showIcon
              message={
                isRtl
                  ? `تم ملء البيانات تلقائياً من العرض #${createSelectedOffer.id}`
                  : `Data auto-filled from Offer #${createSelectedOffer.id}`
              }
              style={{ marginBottom: 16 }}
            />
          )}

          <Form
            form={createForm}
            layout="vertical"
            requiredMark="optional"
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            <Form.Item name="offerId" hidden>
              <Input />
            </Form.Item>

            <Row gutter={[16, 0]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="customerId"
                  label={isRtl ? 'العميل' : 'Customer'}
                  rules={[{ required: true, message: isRtl ? 'مطلوب' : 'Required' }]}
                >
                  <Select
                    showSearch
                    optionFilterProp="label"
                    placeholder={isRtl ? 'اختر العميل' : 'Select Customer'}
                    options={(customers as any[]).map((c: any) => ({
                      value: c.id,
                      label: isRtl
                        ? c.arabicName || c.englishName || `#${c.id}`
                        : c.englishName || c.arabicName || `#${c.id}`,
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="nationalityId"
                  label={
                    <span>
                      {isRtl ? 'الجنسية' : 'Nationality'}
                      {createSelectedOffer && (
                        <Tag color="green" style={{ marginInlineStart: 8, fontSize: 11 }}>
                          {isRtl ? 'من العرض' : 'From Offer'}
                        </Tag>
                      )}
                    </span>
                  }
                >
                  <Select
                    showSearch
                    optionFilterProp="label"
                    placeholder={isRtl ? 'اختر الجنسية' : 'Select Nationality'}
                    options={(nationalities as any[]).map((n: any) => ({
                      value: n.id,
                      label: isRtl ? n.nationalityNameAr || n.name : n.nationalityName || n.name,
                    }))}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 0]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="jobId"
                  label={
                    <span>
                      {isRtl ? 'الوظيفة' : 'Job'}
                      {createSelectedOffer && (
                        <Tag color="blue" style={{ marginInlineStart: 8, fontSize: 11 }}>
                          {isRtl ? 'من العرض' : 'From Offer'}
                        </Tag>
                      )}
                    </span>
                  }
                >
                  <Select
                    showSearch
                    optionFilterProp="label"
                    placeholder={isRtl ? 'اختر الوظيفة' : 'Select Job'}
                    options={(jobs as any[]).map((j: any) => ({
                      value: j.id,
                      label: isRtl ? j.jobNameAr || j.name : j.jobNameEn || j.name,
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="duration"
                  label={
                    <span>
                      {isRtl ? 'المدة (أشهر)' : 'Duration (months)'}
                      {createSelectedOffer && (
                        <Tag color="orange" style={{ marginInlineStart: 8, fontSize: 11 }}>
                          {isRtl ? 'من العرض' : 'From Offer'}
                        </Tag>
                      )}
                    </span>
                  }
                >
                  <InputNumber style={{ width: '100%' }} min={1} max={24} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 0]}>
              <Col xs={24} sm={8}>
                <Form.Item
                  name="cost"
                  label={
                    <span>
                      {isRtl ? 'التكلفة' : 'Cost'}
                      {createSelectedOffer && (
                        <Tag color="green" style={{ marginInlineStart: 8, fontSize: 11 }}>
                          {isRtl ? 'من العرض' : 'From Offer'}
                        </Tag>
                      )}
                    </span>
                  }
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    addonAfter={isRtl ? 'ريال' : 'SAR'}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item
                  name="insurance"
                  label={
                    <span>
                      {isRtl ? 'التأمين' : 'Insurance'}
                      {createSelectedOffer && (
                        <Tag color="purple" style={{ marginInlineStart: 8, fontSize: 11 }}>
                          {isRtl ? 'من العرض' : 'From Offer'}
                        </Tag>
                      )}
                    </span>
                  }
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    addonAfter={isRtl ? 'ريال' : 'SAR'}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item
                  name="offerPrice"
                  label={
                    <span>
                      {isRtl ? 'الإجمالي مع الضريبة' : 'Total with Tax'}
                      {createSelectedOffer && (
                        <Tag color="cyan" style={{ marginInlineStart: 8, fontSize: 11 }}>
                          {isRtl ? 'من العرض' : 'From Offer'}
                        </Tag>
                      )}
                    </span>
                  }
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    addonAfter={isRtl ? 'ريال' : 'SAR'}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 0]}>
              <Col xs={24} sm={12}>
                <Form.Item name="contractStartDate" label={isRtl ? 'تاريخ البداية' : 'Start Date'}>
                  <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="contractEndDate" label={isRtl ? 'تاريخ النهاية' : 'End Date'}>
                  <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 0]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="workerNameAr"
                  label={isRtl ? 'اسم العامل (عربي)' : 'Worker Name (Arabic)'}
                >
                  <Input placeholder={isRtl ? 'اسم العامل بالعربي' : 'Worker name in Arabic'} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="workerNameEn"
                  label={isRtl ? 'اسم العامل (إنجليزي)' : 'Worker Name (English)'}
                >
                  <Input placeholder={isRtl ? 'اسم العامل بالإنجليزي' : 'Worker name in English'} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 0]}>
              <Col xs={24} sm={12}>
                <Form.Item name="workerPhone" label={isRtl ? 'هاتف العامل' : 'Worker Phone'}>
                  <Input placeholder="05xxxxxxxx" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="customerAddress"
                  label={isRtl ? 'عنوان العميل' : 'Customer Address'}
                >
                  <Input placeholder={isRtl ? 'العنوان' : 'Address'} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 0]}>
              <Col xs={24} sm={12}>
                <Form.Item name="workersCount" label={isRtl ? 'عدد العمال' : 'Workers Count'}>
                  <InputNumber style={{ width: '100%' }} min={1} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="paymentMethod" label={isRtl ? 'طريقة الدفع' : 'Payment Method'}>
                  <Select
                    placeholder={isRtl ? 'اختر طريقة الدفع' : 'Select Payment Method'}
                    options={[
                      { value: 1, label: isRtl ? 'نقدي' : 'Cash' },
                      { value: 2, label: isRtl ? 'شبكة' : 'Card/Network' },
                      { value: 3, label: isRtl ? 'تحويل بنكي' : 'Bank Transfer' },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>

      {/* Details Modal */}
      <Modal
        title={`${t.contractNumber}: #${selectedContract?.contractNumber}`}
        open={showDetailsModal}
        onCancel={() => {
          setShowDetailsModal(false);
          setSelectedContract(null);
        }}
        footer={
          <Button type="primary" onClick={() => setShowDetailsModal(false)}>
            {language === 'ar' ? 'إغلاق' : 'Close'}
          </Button>
        }
        width={650}
      >
        {selectedContract && (
          <div className={styles.detailsModal}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <div className={styles.modalSection}>
                  <h4>{t.customer}</h4>
                  <p className={styles.modalValue}>
                    {language === 'ar'
                      ? selectedContract.customerNameAr
                      : selectedContract.customerName}
                  </p>
                </div>
              </Col>
              <Col span={24}>
                <div className={styles.modalSection}>
                  <h4>{t.worker}</h4>
                  <p className={styles.modalValue}>
                    {language === 'ar'
                      ? selectedContract.workerNameAr
                      : selectedContract.workerName}
                  </p>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.modalSection}>
                  <h4>{t.status}</h4>
                  <Badge
                    status={getStatusConfig(selectedContract.status).color as any}
                    text={getStatusConfig(selectedContract.status).label}
                  />
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.modalSection}>
                  <h4>{t.renewals}</h4>
                  <p className={styles.modalValue}>{selectedContract.renewalCount}</p>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.modalSection}>
                  <h4>{t.nationality}</h4>
                  <p className={styles.modalValue}>
                    {language === 'ar'
                      ? selectedContract.nationalityAr
                      : selectedContract.nationality}
                  </p>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.modalSection}>
                  <h4>{t.profession}</h4>
                  <p className={styles.modalValue}>
                    {language === 'ar'
                      ? selectedContract.professionAr
                      : selectedContract.profession}
                  </p>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.modalSection}>
                  <h4>{t.startDate}</h4>
                  <p className={styles.modalValue}>{formatDate(selectedContract.startDate)}</p>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.modalSection}>
                  <h4>{t.endDate}</h4>
                  <p className={styles.modalValue}>{formatDate(selectedContract.endDate)}</p>
                </div>
              </Col>
              <Col span={8}>
                <div className={styles.modalSection}>
                  <h4>{t.monthlyRent}</h4>
                  <p className={styles.modalValue}>
                    {formatCurrency(selectedContract.monthlyRent)}
                  </p>
                </div>
              </Col>
              <Col span={8}>
                <div className={styles.modalSection}>
                  <h4>{t.collected}</h4>
                  <p className={styles.modalValue} style={{ color: '#52c41a' }}>
                    {formatCurrency(selectedContract.totalCollected)}
                  </p>
                </div>
              </Col>
              <Col span={8}>
                <div className={styles.modalSection}>
                  <h4>{t.remaining}</h4>
                  <p className={styles.modalValue} style={{ color: '#faad14' }}>
                    {formatCurrency(selectedContract.remainingAmount)}
                  </p>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
}
