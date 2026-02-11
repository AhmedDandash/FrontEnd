'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Modal,
  Empty,
  Spin,
  DatePicker,
  Table,
  Dropdown,
} from 'antd';
import type { MenuProps, TableColumnsType } from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
  LogoutOutlined,
  MedicineBoxOutlined,
  StopOutlined,
  CloseCircleOutlined,
  FileProtectOutlined,
  EditOutlined,
  PrinterOutlined,
  ClearOutlined,
  DownOutlined,
  FileTextOutlined,
  FileExcelOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/store/authStore';
import {
  useWorkers,
  useWorkerEscape,
  useWorkerRefused,
  useWorkerSick,
  useWorkerDeactivate,
  useWorkerOut,
} from '@/hooks/api/useWorkers';
import type { Worker, WorkerActionDto } from '@/types/api.types';
import styles from './WorkersFollowup.module.css';
import dayjs from 'dayjs';

// Translations
const translations = {
  en: {
    pageTitle: 'Workers Follow-up',
    searchPlaceholder: 'Search workers...',
    filters: 'Search Filters',
    search: 'Search',
    clearFilters: 'Clear',
    totalWorkers: 'Total Workers',
    activeWorkers: 'Active',
    pendingWorkers: 'Pending',
    issuesWorkers: 'Issues',
    status: 'Status',
    all: 'All',
    active: 'Active',
    pending: 'Pending',
    escaped: 'Escaped',
    refused: 'Refused',
    sick: 'Sick',
    out: 'Out',
    reference: 'Ref',
    passportNo: 'Passport No.',
    nationality: 'Nationality',
    mobile: 'Mobile',
    workerName: 'Worker Name',
    agent: 'Agent',
    contractNo: 'Contract No.',
    visaNo: 'Visa No.',
    arrivalDate: 'Arrival Date',
    borderNo: 'Border No.',
    arrivalCity: 'Arrival City',
    residency: 'Residency',
    customerName: 'Customer Name',
    customerId: 'Customer ID',
    customerMobile: 'Customer Mobile',
    workerMobile: 'Worker Mobile',
    whatsApp: 'WhatsApp',
    lastUpdate: 'Last Update',
    branch: 'Branch',
    employee: 'Employee',
    job: 'Job',
    fullNameAr: 'Name (Arabic)',
    fullNameEn: 'Name (English)',
    dataCompletion: 'Data Completion',
    complete: 'Complete',
    incomplete: 'Incomplete',
    workerStatus: 'Worker Status',
    createdBy: 'Created By',
    actions: 'Actions',
    markEscape: 'Mark Escaped',
    markRefused: 'Mark Refused',
    markSick: 'Mark Sick',
    deactivate: 'Deactivate',
    markOut: 'Mark Out',
    edit: 'Edit',
    print: 'Print',
    workerReport: 'Worker Report',
    followupReport: 'Follow-up Report',
    allData: 'All Data',
    noWorkers: 'No workers found',
    noWorkersDesc: 'No workers match your search criteria',
    confirmAction: 'Confirm Action',
    confirmEscape: 'Are you sure you want to mark this worker as escaped?',
    confirmRefused: 'Are you sure you want to mark this worker as refused?',
    confirmSick: 'Are you sure you want to mark this worker as sick?',
    confirmDeactivate: 'Are you sure you want to deactivate this worker?',
    confirmOut: 'Are you sure you want to mark this worker as out?',
    yes: 'Yes',
    cancel: 'Cancel',
    selectDate: 'Select Date',
    date: 'Date',
    // Status options
    statusReceived: 'Worker Received',
    statusEscaped: 'Worker Escaped',
    statusSick: 'Sick',
    statusRefused: 'Work Refused',
    statusReturnTravel: 'Return Travel',
    statusSuspended: 'Suspended',
    statusFinalExit: 'Final Exit',
    statusReturnWork: 'Return to Work',
  },
  ar: {
    pageTitle: 'متابعة العمالة',
    searchPlaceholder: 'البحث في العمال...',
    filters: 'فلاتر البحث',
    search: 'بحث',
    clearFilters: 'إلغاء',
    totalWorkers: 'إجمالي العمال',
    activeWorkers: 'النشطون',
    pendingWorkers: 'قيد الانتظار',
    issuesWorkers: 'المشاكل',
    status: 'الحالة',
    all: 'الكل',
    active: 'نشط',
    pending: 'قيد الانتظار',
    escaped: 'هارب',
    refused: 'رافض',
    sick: 'مريض',
    out: 'خرج',
    reference: 'المرجع',
    passportNo: 'رقم الجواز',
    nationality: 'الجنسية',
    mobile: 'الجوال',
    workerName: 'اسم العامل',
    agent: 'الوكيل',
    contractNo: 'رقم العقد',
    visaNo: 'رقم التأشيرة',
    arrivalDate: 'تاريخ الوصول',
    borderNo: 'رقم الحدود',
    arrivalCity: 'مدينة الوصول',
    residency: 'الإقامة',
    customerName: 'اسم العميل',
    customerId: 'رقم الهوية',
    customerMobile: 'جوال العميل',
    workerMobile: 'جوال العامل',
    whatsApp: 'واتساب',
    lastUpdate: 'آخر تحديث',
    branch: 'الفرع',
    employee: 'الموظف',
    job: 'الوظيفة',
    fullNameAr: 'الاسم (عربي)',
    fullNameEn: 'الاسم (إنجليزي)',
    dataCompletion: 'اكتمال البيانات',
    complete: 'مكتملة',
    incomplete: 'غير مكتملة',
    workerStatus: 'حالة العامل',
    createdBy: 'أنشأ بواسطة',
    actions: 'الإجراءات',
    markEscape: 'تسجيل هروب',
    markRefused: 'تسجيل رفض',
    markSick: 'تسجيل مرض',
    deactivate: 'إيقاف',
    markOut: 'تسجيل خروج',
    edit: 'تعديل',
    print: 'طباعة',
    workerReport: 'تقرير العمالة',
    followupReport: 'تقرير المتابعة',
    allData: 'كل البيانات',
    noWorkers: 'لا يوجد عمال',
    noWorkersDesc: 'لا يوجد عمال يطابقون معايير البحث',
    confirmAction: 'تأكيد الإجراء',
    confirmEscape: 'هل أنت متأكد من تسجيل هذا العامل كهارب؟',
    confirmRefused: 'هل أنت متأكد من تسجيل هذا العامل كرافض؟',
    confirmSick: 'هل أنت متأكد من تسجيل هذا العامل كمريض؟',
    confirmDeactivate: 'هل أنت متأكد من إيقاف هذا العامل؟',
    confirmOut: 'هل أنت متأكد من تسجيل خروج هذا العامل؟',
    yes: 'نعم',
    cancel: 'إلغاء',
    selectDate: 'اختر التاريخ',
    date: 'التاريخ',
    // Status options
    statusReceived: 'استلام العامل',
    statusEscaped: 'هروب العامل',
    statusSick: 'مريض',
    statusRefused: 'رفض العمل',
    statusReturnTravel: 'خروج وعودة',
    statusSuspended: 'ايقاف مؤقت',
    statusFinalExit: 'خروج نهائي',
    statusReturnWork: 'العودة الى العمل',
  },
};

export default function WorkersFollowupPage() {
  const language = useAuthStore((state) => state.language);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<{
    search?: string;
    status?: string;
    nationality?: string;
    job?: string;
    agent?: string;
    dataCompletion?: string;
    createdBy?: string;
    arrivalDateFrom?: dayjs.Dayjs;
    arrivalDateTo?: dayjs.Dayjs;
  }>({});
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [actionType, setActionType] = useState<string>('');
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [actionDate, setActionDate] = useState<dayjs.Dayjs>(dayjs());

  const t = (key: keyof typeof translations.en) => {
    return translations[language][key] || key;
  };

  const { data: workers = [], isLoading } = useWorkers();
  const { mutate: workerEscape, isPending: isEscaping } = useWorkerEscape();
  const { mutate: workerRefused, isPending: isRefusing } = useWorkerRefused();
  const { mutate: workerSick, isPending: isSicking } = useWorkerSick();
  const { mutate: workerDeactivate, isPending: isDeactivating } = useWorkerDeactivate();
  const { mutate: workerOut, isPending: isOuting } = useWorkerOut();

  // Filter workers
  const filteredWorkers = useMemo(() => {
    return workers.filter((worker) => {
      const searchLower = filters.search?.toLowerCase() || '';
      const matchesSearch =
        !searchLower ||
        worker.fullNameAr?.toLowerCase().includes(searchLower) ||
        worker.fullNameEn?.toLowerCase().includes(searchLower) ||
        worker.passportNo?.toLowerCase().includes(searchLower) ||
        worker.referenceNo?.toLowerCase().includes(searchLower);

      const matchesStatus = !filters.status || worker.workerStatus === filters.status;
      const matchesNationality =
        !filters.nationality || worker.nationalityId === filters.nationality;
      const matchesJob = !filters.job || worker.jobId === filters.job;

      return matchesSearch && matchesStatus && matchesNationality && matchesJob;
    });
  }, [workers, filters]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: filteredWorkers.length,
      active: filteredWorkers.filter((w) => w.workerStatus === 'active').length,
      pending: filteredWorkers.filter((w) => w.workerStatus === 'pending').length,
      issues: filteredWorkers.filter((w) =>
        ['escaped', 'refused', 'sick'].includes(w.workerStatus || '')
      ).length,
    };
  }, [filteredWorkers]);

  // Print menu
  const printMenu: MenuProps = {
    items: [
      { key: 'worker-report', label: t('workerReport'), icon: <FileTextOutlined /> },
      { key: 'followup-report', label: t('followupReport'), icon: <FileTextOutlined /> },
      { key: 'all-data', label: t('allData'), icon: <FileExcelOutlined /> },
    ],
    onClick: ({ key }) => {
      console.log('Print:', key);
    },
  };

  // Action handlers
  const handleOpenActionModal = (worker: Worker, type: string) => {
    setSelectedWorker(worker);
    setActionType(type);
    setActionDate(dayjs());
    setIsActionModalOpen(true);
  };

  const handleCloseActionModal = () => {
    setIsActionModalOpen(false);
    setSelectedWorker(null);
    setActionType('');
  };

  const handleConfirmAction = () => {
    if (!selectedWorker) return;

    const actionData: WorkerActionDto = {
      id: selectedWorker.id,
      date: actionDate.toISOString(),
    };

    switch (actionType) {
      case 'escape':
        workerEscape(actionData);
        break;
      case 'refused':
        workerRefused(actionData);
        break;
      case 'sick':
        workerSick(actionData);
        break;
      case 'deactivate':
        workerDeactivate(actionData);
        break;
      case 'out':
        workerOut(actionData);
        break;
    }

    handleCloseActionModal();
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  // Status tag
  const getStatusTag = (status?: string) => {
    const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
      active: { color: 'success', icon: <CheckCircleOutlined /> },
      pending: { color: 'warning', icon: <ClockCircleOutlined /> },
      escaped: { color: 'error', icon: <ExclamationCircleOutlined /> },
      refused: { color: 'error', icon: <CloseCircleOutlined /> },
      sick: { color: 'processing', icon: <MedicineBoxOutlined /> },
      out: { color: 'default', icon: <LogoutOutlined /> },
    };

    const config = statusConfig[status || ''] || { color: 'default', icon: null };

    return (
      <Tag color={config.color} icon={config.icon}>
        {t(status as any) || status}
      </Tag>
    );
  };

  // Action menu for each row
  const getActionMenu = (worker: Worker): MenuProps => ({
    items: [
      {
        key: 'escape',
        label: t('markEscape'),
        icon: <ExclamationCircleOutlined />,
        onClick: () => handleOpenActionModal(worker, 'escape'),
      },
      {
        key: 'refused',
        label: t('markRefused'),
        icon: <CloseCircleOutlined />,
        onClick: () => handleOpenActionModal(worker, 'refused'),
      },
      {
        key: 'sick',
        label: t('markSick'),
        icon: <MedicineBoxOutlined />,
        onClick: () => handleOpenActionModal(worker, 'sick'),
      },
      {
        key: 'deactivate',
        label: t('deactivate'),
        icon: <StopOutlined />,
        onClick: () => handleOpenActionModal(worker, 'deactivate'),
      },
      {
        key: 'out',
        label: t('markOut'),
        icon: <LogoutOutlined />,
        onClick: () => handleOpenActionModal(worker, 'out'),
      },
    ],
  });

  // Table columns matching the HTML
  const columns: TableColumnsType<Worker> = [
    {
      title: t('workerName'),
      key: 'name',
      fixed: 'left',
      width: 180,
      render: (_, worker) => (
        <div>
          <div style={{ fontWeight: 600, color: '#003366' }}>
            {language === 'ar' ? worker.fullNameAr : worker.fullNameEn || worker.fullNameAr}
          </div>
          {worker.fullNameEn && worker.fullNameAr && (
            <div style={{ fontSize: 12, color: '#94a3b8' }}>
              {language === 'ar' ? worker.fullNameEn : worker.fullNameAr}
            </div>
          )}
        </div>
      ),
    },
    {
      title: t('agent'),
      dataIndex: 'agentId',
      key: 'agent',
      width: 120,
    },
    {
      title: t('passportNo'),
      dataIndex: 'passportNo',
      key: 'passportNo',
      width: 140,
    },
    {
      title: t('contractNo'),
      dataIndex: 'contractNo',
      key: 'contractNo',
      width: 130,
    },
    {
      title: t('visaNo'),
      dataIndex: 'visaNo',
      key: 'visaNo',
      width: 130,
    },
    {
      title: t('arrivalDate'),
      dataIndex: 'arrivalDate',
      key: 'arrivalDate',
      width: 130,
      render: (date: string) => (date ? dayjs(date).format('YYYY-MM-DD') : '-'),
    },
    {
      title: t('customerName'),
      dataIndex: 'customerName',
      key: 'customerName',
      width: 150,
    },
    {
      title: t('customerMobile'),
      dataIndex: 'customerMobile',
      key: 'customerMobile',
      width: 140,
    },
    {
      title: t('workerMobile'),
      dataIndex: 'mobile',
      key: 'workerMobile',
      width: 140,
    },
    {
      title: t('lastUpdate'),
      dataIndex: 'updatedAt',
      key: 'lastUpdate',
      width: 130,
      render: (date: string) => (date ? dayjs(date).format('YYYY-MM-DD') : '-'),
    },
    {
      title: t('status'),
      key: 'status',
      width: 140,
      render: (_, worker) => getStatusTag(worker.workerStatus || undefined),
    },
    {
      title: t('branch'),
      dataIndex: 'branchId',
      key: 'branch',
      width: 120,
    },
    {
      title: t('employee'),
      dataIndex: 'employeeId',
      key: 'employee',
      width: 120,
    },
    {
      title: t('actions'),
      key: 'actions',
      fixed: 'right',
      width: 120,
      render: (_, worker) => (
        <Space>
          <Button type="text" size="small" icon={<EditOutlined />} className={styles.editBtn} />
          <Dropdown menu={getActionMenu(worker)} trigger={['click']}>
            <Button type="text" size="small" className={styles.actionDropdownBtn}>
              {t('actions')} <DownOutlined />
            </Button>
          </Dropdown>
        </Space>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className={styles.followupPage}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
          }}
        >
          <Spin size="large" tip={language === 'ar' ? 'جاري التحميل...' : 'Loading...'} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.followupPage}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <FileProtectOutlined className={styles.headerIcon} />
            <div>
              <h1 className={styles.pageTitle}>{t('pageTitle')}</h1>
            </div>
          </div>
          <div className={styles.headerButtons}>
            <Dropdown menu={printMenu}>
              <Button className={styles.headerBtn} icon={<PrinterOutlined />}>
                {t('print')} <DownOutlined />
              </Button>
            </Dropdown>
            <Button className={styles.headerBtn} icon={<EditOutlined />}>
              {t('edit')}
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <Row gutter={16} className={styles.statsRow}>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <div className={styles.statContent}>
              <div
                className={styles.statIcon}
                style={{ background: 'linear-gradient(135deg, #003366 0%, #00478c 100%)' }}
              >
                <UserOutlined style={{ color: '#ffffff', fontSize: 24 }} />
              </div>
              <div className={styles.statInfo}>
                <p className={styles.statLabel}>{t('totalWorkers')}</p>
                <p className={styles.statValue}>{stats.total}</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <div className={styles.statContent}>
              <div
                className={styles.statIcon}
                style={{ background: 'linear-gradient(135deg, #00aa64 0%, #00c478 100%)' }}
              >
                <CheckCircleOutlined style={{ color: '#ffffff', fontSize: 24 }} />
              </div>
              <div className={styles.statInfo}>
                <p className={styles.statLabel}>{t('activeWorkers')}</p>
                <p className={styles.statValue}>{stats.active}</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <div className={styles.statContent}>
              <div
                className={styles.statIcon}
                style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)' }}
              >
                <ClockCircleOutlined style={{ color: '#ffffff', fontSize: 24 }} />
              </div>
              <div className={styles.statInfo}>
                <p className={styles.statLabel}>{t('pendingWorkers')}</p>
                <p className={styles.statValue}>{stats.pending}</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <div className={styles.statContent}>
              <div
                className={styles.statIcon}
                style={{ background: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)' }}
              >
                <WarningOutlined style={{ color: '#ffffff', fontSize: 24 }} />
              </div>
              <div className={styles.statInfo}>
                <p className={styles.statLabel}>{t('issuesWorkers')}</p>
                <p className={styles.statValue}>{stats.issues}</p>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Search and Filters */}
      <Card className={styles.filterCard}>
        <div className={styles.filterHeader}>
          <Space wrap>
            <Input
              size="large"
              placeholder={t('searchPlaceholder')}
              prefix={<SearchOutlined />}
              value={filters.search || ''}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              style={{ width: 300 }}
              allowClear
            />
            <Button
              icon={<FilterOutlined />}
              onClick={() => setShowFilters(!showFilters)}
              type={showFilters ? 'primary' : 'default'}
              size="large"
            >
              {t('filters')}
            </Button>
          </Space>
        </div>

        {showFilters && (
          <div className={styles.filterContent}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={6}>
                <label className={styles.filterLabel}>{t('nationality')}</label>
                <Select
                  size="large"
                  placeholder={t('nationality')}
                  value={filters.nationality}
                  onChange={(value) => setFilters({ ...filters, nationality: value })}
                  style={{ width: '100%' }}
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  options={[
                    { value: '359', label: language === 'ar' ? 'الفلبين' : 'Philippines' },
                    { value: '360', label: language === 'ar' ? 'كينيا' : 'Kenya' },
                    { value: '361', label: language === 'ar' ? 'أوغندا' : 'Uganda' },
                    { value: '362', label: language === 'ar' ? 'الهند' : 'India' },
                    { value: '731', label: language === 'ar' ? 'أثيوبيا' : 'Ethiopia' },
                  ]}
                />
              </Col>

              <Col xs={24} md={6}>
                <label className={styles.filterLabel}>{t('job')}</label>
                <Select
                  size="large"
                  placeholder={t('job')}
                  value={filters.job}
                  onChange={(value) => setFilters({ ...filters, job: value })}
                  style={{ width: '100%' }}
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  options={[
                    { value: '1198', label: language === 'ar' ? 'عاملة منزلية' : 'Housemaid' },
                    { value: '1199', label: language === 'ar' ? 'سائق خاص' : 'Private Driver' },
                    { value: '1293', label: language === 'ar' ? 'عامل منزلي' : 'Houseworker' },
                  ]}
                />
              </Col>

              <Col xs={24} md={6}>
                <label className={styles.filterLabel}>{t('workerStatus')}</label>
                <Select
                  size="large"
                  placeholder={t('workerStatus')}
                  value={filters.status}
                  onChange={(value) => setFilters({ ...filters, status: value })}
                  style={{ width: '100%' }}
                  allowClear
                >
                  <Select.Option value="1">{t('statusReceived')}</Select.Option>
                  <Select.Option value="2">{t('statusEscaped')}</Select.Option>
                  <Select.Option value="3">{t('statusSick')}</Select.Option>
                  <Select.Option value="4">{t('statusRefused')}</Select.Option>
                  <Select.Option value="5">{t('statusReturnTravel')}</Select.Option>
                  <Select.Option value="6">{t('statusSuspended')}</Select.Option>
                  <Select.Option value="7">{t('statusFinalExit')}</Select.Option>
                  <Select.Option value="8">{t('statusReturnWork')}</Select.Option>
                </Select>
              </Col>

              <Col xs={24} md={6}>
                <label className={styles.filterLabel}>{t('dataCompletion')}</label>
                <Select
                  size="large"
                  placeholder={t('dataCompletion')}
                  value={filters.dataCompletion}
                  onChange={(value) => setFilters({ ...filters, dataCompletion: value })}
                  style={{ width: '100%' }}
                  allowClear
                >
                  <Select.Option value="complete">{t('complete')}</Select.Option>
                  <Select.Option value="incomplete">{t('incomplete')}</Select.Option>
                </Select>
              </Col>

              <Col xs={24} md={6}>
                <label className={styles.filterLabel}>{t('agent')}</label>
                <Select
                  size="large"
                  placeholder={t('agent')}
                  value={filters.agent}
                  onChange={(value) => setFilters({ ...filters, agent: value })}
                  style={{ width: '100%' }}
                  allowClear
                  showSearch
                  optionFilterProp="label"
                />
              </Col>

              <Col xs={24} md={6}>
                <label className={styles.filterLabel}>{t('arrivalDate')}</label>
                <DatePicker.RangePicker
                  size="large"
                  style={{ width: '100%' }}
                  onChange={(dates) => {
                    setFilters({
                      ...filters,
                      arrivalDateFrom: dates?.[0] || undefined,
                      arrivalDateTo: dates?.[1] || undefined,
                    });
                  }}
                />
              </Col>
            </Row>
            <div className={styles.filterActions}>
              <Button icon={<ClearOutlined />} onClick={handleClearFilters}>
                {t('clearFilters')}
              </Button>
              <Button type="primary" icon={<SearchOutlined />} style={{ background: '#003366' }}>
                {t('search')}
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Workers Table */}
      <Card className={styles.tableCard}>
        <Table
          dataSource={filteredWorkers}
          columns={columns}
          rowKey="id"
          scroll={{ x: 1800 }}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total, range) =>
              language === 'ar'
                ? `${range[0]}-${range[1]} من ${total}`
                : `${range[0]}-${range[1]} of ${total}`,
          }}
          locale={{
            emptyText: (
              <Empty description={t('noWorkersDesc')} image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ),
          }}
        />
      </Card>

      {/* Action Confirmation Modal */}
      <Modal
        title={t('confirmAction')}
        open={isActionModalOpen}
        onCancel={handleCloseActionModal}
        footer={null}
        width={500}
        className={styles.modal}
      >
        <Space direction="vertical" style={{ width: '100%' }} size={16}>
          <p>
            {actionType === 'escape' && t('confirmEscape')}
            {actionType === 'refused' && t('confirmRefused')}
            {actionType === 'sick' && t('confirmSick')}
            {actionType === 'deactivate' && t('confirmDeactivate')}
            {actionType === 'out' && t('confirmOut')}
          </p>

          <div>
            <label className={styles.filterLabel}>{t('date')}</label>
            <DatePicker
              value={actionDate}
              onChange={(date) => setActionDate(date || dayjs())}
              style={{ width: '100%' }}
              size="large"
            />
          </div>

          <div className={styles.modalActions}>
            <Button className={styles.cancelButton} onClick={handleCloseActionModal}>
              {t('cancel')}
            </Button>
            <Button
              type="primary"
              className={styles.submitButton}
              onClick={handleConfirmAction}
              loading={isEscaping || isRefusing || isSicking || isDeactivating || isOuting}
            >
              {t('yes')}
            </Button>
          </div>
        </Space>
      </Modal>
    </div>
  );
}
