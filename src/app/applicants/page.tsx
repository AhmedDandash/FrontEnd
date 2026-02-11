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
  Form,
  Empty,
  Spin,
  Tooltip,
  Dropdown,
  DatePicker,
} from 'antd';
import type { MenuProps } from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  TeamOutlined,
  UserOutlined,
  IdcardOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  TrophyOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
  ClearOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  PrinterOutlined,
  UploadOutlined,
  FileExcelOutlined,
  FileTextOutlined,
  DownOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/store/authStore';
import {
  useWorkers,
  useCreateWorker,
  useUpdateWorker,
  useDeleteWorker,
} from '@/hooks/api/useWorkers';
import type { Worker, WorkerDto } from '@/types/api.types';
import styles from './Workers.module.css';
import dayjs from 'dayjs';

// Translations
const translations = {
  en: {
    pageTitle: 'Workers Management',
    addWorker: 'Add Worker',
    addFromFile: 'Add from File',
    printSalary: 'Print Salary',
    quickSearch: 'Quick Search',
    print: 'Print',
    workerReport: 'Worker Report',
    trialReport: 'Trial Report',
    allData: 'All Data',
    searchPlaceholder: 'Search workers...',
    filters: 'Search Filters',
    search: 'Search',
    clearFilters: 'Clear',
    totalWorkers: 'Total Workers',
    maleWorkers: 'Male Workers',
    femaleWorkers: 'Female Workers',
    experiencedWorkers: 'Experienced',
    // Tabs
    tabAll: 'All',
    tabTrial: 'Trial Workers',
    tabAvailable: 'Available',
    tabUnderProcedure: 'Under Procedure',
    tabBackOut: 'Back Out',
    tabInsideKingdom: 'Inside Kingdom',
    tabDeported: 'Deported',
    // Filters
    workerNo: 'Worker No.',
    fullNameAr: 'Name (Arabic)',
    fullNameEn: 'Name (English)',
    passportNo: 'Passport No.',
    nationality: 'Nationality',
    nationalId: 'National ID',
    job: 'Job',
    agent: 'Agent',
    employee: 'Employee',
    workerType: 'Worker Type',
    deletionStatus: 'Deletion Status',
    notDeleted: 'Not Deleted',
    deleted: 'Deleted Workers',
    vip: 'VIP',
    vipOnly: 'VIP Only',
    notVip: 'Not VIP',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    workerStatus: 'Worker Status',
    religion: 'Religion',
    muslim: 'Muslim',
    nonMuslim: 'Non-Muslim',
    experience: 'Experience',
    hasExperience: 'Has Experience',
    noExperience: 'No Experience',
    approvalStatus: 'Approval Status',
    approved: 'Approved',
    notApproved: 'Not Approved',
    visaNo: 'Visa No.',
    flightNo: 'Flight No.',
    age: 'Age',
    phone: 'Phone',
    airline: 'Airline',
    sponsorshipTransfer: 'Sponsorship Transfer',
    transferred: 'Transferred',
    all: 'All',
    // Status options
    statusReceived: 'Worker Received',
    statusEscaped: 'Worker Escaped',
    statusSick: 'Sick',
    statusRefused: 'Work Refused',
    statusReturnTravel: 'Return Travel',
    statusSuspended: 'Suspended',
    statusFinalExit: 'Final Exit',
    statusReturnWork: 'Return to Work',
    statusEmergencyExit: 'Emergency Exit',
    statusChangeAccom: 'Change Accommodation',
    statusAccom: 'Worker Accommodation',
    statusEndService: 'End Service',
    // Worker type options
    typeMediation: 'Mediation',
    typeTransfer: 'Service Transfer',
    typeVisit: 'Visit',
    typeDuration: 'Duration',
    typeTransferContract: 'Transfer Contracts',
    // Card fields
    salary: 'Salary',
    skills: 'Skills',
    noSkills: 'No skills listed',
    actions: 'Actions',
    view: 'View',
    edit: 'Edit',
    delete: 'Delete',
    createWorker: 'Create Worker',
    updateWorker: 'Update Worker',
    cancel: 'Cancel',
    save: 'Save',
    noWorkers: 'No workers found',
    noWorkersDesc: 'No workers match your search criteria',
    deleteConfirm: 'Are you sure you want to delete this worker?',
    deleteTitle: 'Delete Worker',
    years: 'years',
    reference: 'Ref',
    mobile: 'Mobile',
    birthDate: 'Birth Date',
    status: 'Status',
    active: 'Active',
    pending: 'Pending',
    refused: 'Refused',
    // Form
    basicInfo: 'Basic Information',
    addressAr: 'Address (Arabic)',
    addressEn: 'Address (English)',
    passportIssueDate: 'Issue Date',
    passportExpiryDate: 'Expiry Date',
    passportIssuePlace: 'Issue Place',
    educationLevel: 'Education Level',
    maritalStatus: 'Marital Status',
    childrenCount: 'Children',
    weight: 'Weight',
    height: 'Height',
    referenceNo: 'Reference No.',
  },
  ar: {
    pageTitle: 'ادارة العمالة',
    addWorker: 'إضافة العمالة',
    addFromFile: 'إضافة من ملف',
    printSalary: 'رواتب العمالة',
    quickSearch: 'البحث السريع',
    print: 'طباعة',
    workerReport: 'تقرير العمالة',
    trialReport: 'تقرير التجربة',
    allData: 'كل البيانات',
    searchPlaceholder: 'البحث في العمال...',
    filters: 'فلاتر البحث',
    search: 'بحث',
    clearFilters: 'إلغاء',
    totalWorkers: 'إجمالي العمال',
    maleWorkers: 'عمال ذكور',
    femaleWorkers: 'عمال إناث',
    experiencedWorkers: 'ذوو خبرة',
    // Tabs
    tabAll: 'الكل',
    tabTrial: 'عمالة في التجربة',
    tabAvailable: 'عمالة للاختيار',
    tabUnderProcedure: 'تحت الاجراء',
    tabBackOut: 'Back out',
    tabInsideKingdom: 'داخل المملكة',
    tabDeported: 'تم الترحيل',
    // Filters
    workerNo: 'رقم العامل',
    fullNameAr: 'الاسم (عربي)',
    fullNameEn: 'الاسم (إنجليزي)',
    passportNo: 'رقم الجواز',
    nationality: 'الجنسية',
    nationalId: 'رقم الهوية',
    job: 'الوظيفة',
    agent: 'الوكيل',
    employee: 'الموظف',
    workerType: 'نوع العامل',
    deletionStatus: 'حالة الحذف',
    notDeleted: 'غير محذوف',
    deleted: 'عمالة تم حذفها',
    vip: 'VIP',
    vipOnly: 'VIP فقط',
    notVip: 'ليس VIP',
    gender: 'جنس العامل/ه',
    male: 'ذكر',
    female: 'أنثى',
    workerStatus: 'حالة العامل',
    religion: 'الديانة',
    muslim: 'مسلم',
    nonMuslim: 'غير مسلم',
    experience: 'سبق له العمل',
    hasExperience: 'سبق له العمل',
    noExperience: 'لم يسبق له العمل',
    approvalStatus: 'حالة الموافقة',
    approved: 'تم الموافقة',
    notApproved: 'لم يتم الموافقة',
    visaNo: 'رقم التأشيرة',
    flightNo: 'رقم الرحلة',
    age: 'العمر',
    phone: 'تليفون ارضي',
    airline: 'الخطوط الناقلة',
    sponsorshipTransfer: 'نقل الكفالة',
    transferred: 'تم نقل الخدمات',
    all: 'الكل',
    // Status options
    statusReceived: 'استلام العامل',
    statusEscaped: 'هروب العامل',
    statusSick: 'مريض',
    statusRefused: 'رفض العمل',
    statusReturnTravel: 'خروج وعودة',
    statusSuspended: 'ايقاف مؤقت',
    statusFinalExit: 'خروج نهائي',
    statusReturnWork: 'العودة الى العمل',
    statusEmergencyExit: 'خروج طوارئ',
    statusChangeAccom: 'تغير الايواء',
    statusAccom: 'تسكين العامل',
    statusEndService: 'انهاء الخدمة',
    // Worker type options
    typeMediation: 'التوسط',
    typeTransfer: 'نقل الخدمات',
    typeVisit: 'زيارة',
    typeDuration: 'المدة',
    typeTransferContract: 'عقود نقل الخدمات',
    // Card fields
    salary: 'الراتب',
    skills: 'المهارات',
    noSkills: 'لا توجد مهارات',
    actions: 'الإجراءات',
    view: 'عرض',
    edit: 'تعديل',
    delete: 'حذف',
    createWorker: 'إنشاء عامل',
    updateWorker: 'تحديث العامل',
    cancel: 'إلغاء',
    save: 'حفظ',
    noWorkers: 'لا يوجد عمال',
    noWorkersDesc: 'لا يوجد عمال يطابقون معايير البحث',
    deleteConfirm: 'هل أنت متأكد من حذف هذا العامل؟',
    deleteTitle: 'حذف العامل',
    years: 'سنة',
    reference: 'المرجع',
    mobile: 'الجوال',
    birthDate: 'تاريخ الميلاد',
    status: 'الحالة',
    active: 'نشط',
    pending: 'قيد الانتظار',
    refused: 'مرفوض',
    // Form
    basicInfo: 'المعلومات الأساسية',
    addressAr: 'العنوان (عربي)',
    addressEn: 'العنوان (إنجليزي)',
    passportIssueDate: 'تاريخ الإصدار',
    passportExpiryDate: 'تاريخ الانتهاء',
    passportIssuePlace: 'مكان الإصدار',
    educationLevel: 'المستوى التعليمي',
    maritalStatus: 'الحالة الاجتماعية',
    childrenCount: 'الأطفال',
    weight: 'الوزن',
    height: 'الطول',
    referenceNo: 'رقم المرجع',
  },
};

export default function WorkersPage() {
  const language = useAuthStore((state) => state.language);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [filters, setFilters] = useState<{
    search?: string;
    gender?: string;
    nationality?: string;
    religion?: string;
    job?: string;
    agent?: string;
    hasExperience?: boolean;
    status?: string;
    workerType?: string;
    vip?: string;
    deletionStatus?: string;
  }>({});
  const [form] = Form.useForm();

  const t = (key: keyof typeof translations.en) => {
    return translations[language][key] || key;
  };

  const { data: workers = [], isLoading } = useWorkers();
  const { mutate: createWorker, isPending: isCreating } = useCreateWorker();
  const { mutate: updateWorker, isPending: isUpdating } = useUpdateWorker();
  const { mutate: deleteWorker } = useDeleteWorker();

  // Tab items matching the legacy HTML
  const tabs = [
    { key: 0, label: t('tabAll'), icon: <FileTextOutlined /> },
    { key: 1, label: t('tabTrial'), icon: <ClockCircleOutlined /> },
    { key: 2, label: t('tabAvailable'), icon: <CheckCircleOutlined /> },
    { key: 3, label: t('tabUnderProcedure'), icon: <FileTextOutlined /> },
    { key: 4, label: t('tabBackOut'), icon: <ExclamationCircleOutlined /> },
    { key: 5, label: t('tabInsideKingdom'), icon: <EnvironmentOutlined /> },
    { key: 6, label: t('tabDeported'), icon: <StopOutlined /> },
  ];

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

      const matchesGender = !filters.gender || worker.gender === filters.gender;
      const matchesNationality =
        !filters.nationality || worker.nationalityId === filters.nationality;
      const matchesReligion = !filters.religion || worker.religion === filters.religion;
      const matchesJob = !filters.job || worker.jobId === filters.job;
      const matchesAgent = !filters.agent || worker.agentId === filters.agent;
      const matchesExperience =
        filters.hasExperience === undefined || worker.hasExperience === filters.hasExperience;
      const matchesStatus = !filters.status || worker.workerStatus === filters.status;

      return (
        matchesSearch &&
        matchesGender &&
        matchesNationality &&
        matchesReligion &&
        matchesJob &&
        matchesAgent &&
        matchesExperience &&
        matchesStatus
      );
    });
  }, [workers, filters]);

  // Stats
  const stats = useMemo(() => {
    return {
      total: filteredWorkers.length,
      male: filteredWorkers.filter((w) => w.gender === 'male').length,
      female: filteredWorkers.filter((w) => w.gender === 'female').length,
      experienced: filteredWorkers.filter((w) => w.hasExperience).length,
    };
  }, [filteredWorkers]);

  // Print menu items from HTML
  const printMenu: MenuProps = {
    items: [
      { key: 'worker-report', label: t('workerReport'), icon: <FileTextOutlined /> },
      { key: 'trial-report', label: t('trialReport'), icon: <FileTextOutlined /> },
      { key: 'all-data', label: t('allData'), icon: <FileExcelOutlined /> },
    ],
    onClick: ({ key }) => {
      console.log('Print:', key);
    },
  };

  // Modal handlers
  const handleOpenModal = (worker?: Worker) => {
    if (worker) {
      setEditingWorker(worker);
      form.setFieldsValue({
        ...worker,
        birthDate: worker.birthDate ? dayjs(worker.birthDate) : undefined,
        passportIssueDate: worker.passportIssueDate ? dayjs(worker.passportIssueDate) : undefined,
        passportExpiryDate: worker.passportExpiryDate
          ? dayjs(worker.passportExpiryDate)
          : undefined,
      });
    } else {
      setEditingWorker(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingWorker(null);
    form.resetFields();
  };

  const handleSubmit = async (values: any) => {
    const workerData: WorkerDto = {
      ...values,
      birthDate: values.birthDate?.format('YYYY-MM-DD'),
      passportIssueDate: values.passportIssueDate?.format('YYYY-MM-DD'),
      passportExpiryDate: values.passportExpiryDate?.format('YYYY-MM-DD'),
    };

    if (editingWorker) {
      updateWorker({ id: editingWorker.id, data: workerData });
    } else {
      createWorker(workerData);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: t('deleteTitle'),
      icon: <ExclamationCircleOutlined />,
      content: t('deleteConfirm'),
      okText: t('delete'),
      cancelText: t('cancel'),
      okButtonProps: { danger: true },
      onOk: () => deleteWorker(id),
    });
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  // Status tag
  const getStatusTag = (status?: string) => {
    const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
      active: { color: 'success', icon: <CheckCircleOutlined /> },
      pending: { color: 'warning', icon: <ClockCircleOutlined /> },
      refused: { color: 'error', icon: <ExclamationCircleOutlined /> },
    };

    const config = statusConfig[status || ''] || { color: 'default', icon: null };

    return (
      <Tag color={config.color} icon={config.icon}>
        {t((status as any) || 'pending') || status}
      </Tag>
    );
  };

  // Action menu
  const getActionMenu = (worker: Worker): MenuProps => ({
    items: [
      {
        key: 'view',
        label: t('view'),
        icon: <EyeOutlined />,
      },
      {
        key: 'edit',
        label: t('edit'),
        icon: <EditOutlined />,
        onClick: () => handleOpenModal(worker),
      },
      { type: 'divider' },
      {
        key: 'delete',
        label: t('delete'),
        icon: <DeleteOutlined />,
        danger: true,
        onClick: () => handleDelete(worker.id),
      },
    ],
  });

  if (isLoading) {
    return (
      <div className={styles.workersPage}>
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
    <div className={styles.workersPage}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <TeamOutlined className={styles.headerIcon} />
            <div>
              <h1 className={styles.pageTitle}>{t('pageTitle')}</h1>
            </div>
          </div>
          <div className={styles.headerButtons}>
            <Dropdown menu={printMenu}>
              <Button className={styles.headerBtn} icon={<FileExcelOutlined />}>
                {t('print')} <DownOutlined />
              </Button>
            </Dropdown>
            <Button
              className={styles.headerBtn}
              icon={<PrinterOutlined />}
              onClick={() => console.log('Print salary')}
            >
              {t('printSalary')}
            </Button>
            <Button
              className={styles.headerBtn}
              icon={<UploadOutlined />}
              onClick={() => console.log('Add from file')}
            >
              {t('addFromFile')}
            </Button>
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              className={styles.addButton}
              onClick={() => handleOpenModal()}
              loading={isCreating}
            >
              {t('addWorker')}
            </Button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={styles.tabNav}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`${styles.tabItem} ${activeTab === tab.key ? styles.tabItemActive : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
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
                <TeamOutlined style={{ color: '#ffffff', fontSize: 24 }} />
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
                <UserOutlined style={{ color: '#ffffff', fontSize: 24 }} />
              </div>
              <div className={styles.statInfo}>
                <p className={styles.statLabel}>{t('maleWorkers')}</p>
                <p className={styles.statValue}>{stats.male}</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <div className={styles.statContent}>
              <div
                className={styles.statIcon}
                style={{ background: 'linear-gradient(135deg, #f472b6 0%, #ec4899 100%)' }}
              >
                <UserOutlined style={{ color: '#ffffff', fontSize: 24 }} />
              </div>
              <div className={styles.statInfo}>
                <p className={styles.statLabel}>{t('femaleWorkers')}</p>
                <p className={styles.statValue}>{stats.female}</p>
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
                <TrophyOutlined style={{ color: '#ffffff', fontSize: 24 }} />
              </div>
              <div className={styles.statInfo}>
                <p className={styles.statLabel}>{t('experiencedWorkers')}</p>
                <p className={styles.statValue}>{stats.experienced}</p>
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
                    { value: '363', label: language === 'ar' ? 'السودان' : 'Sudan' },
                    { value: '364', label: language === 'ar' ? 'مصر' : 'Egypt' },
                    { value: '366', label: language === 'ar' ? 'بنجلادش' : 'Bangladesh' },
                    { value: '367', label: language === 'ar' ? 'باكستان' : 'Pakistan' },
                    { value: '731', label: language === 'ar' ? 'أثيوبيا' : 'Ethiopia' },
                    { value: '771', label: language === 'ar' ? 'أندونيسيا' : 'Indonesia' },
                    { value: '839', label: language === 'ar' ? 'اليمن' : 'Yemen' },
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
                    { value: '1246', label: language === 'ar' ? 'طباخ' : 'Cook' },
                    { value: '1568', label: language === 'ar' ? 'حارس منزلي' : 'Home Guard' },
                    { value: '1602', label: language === 'ar' ? 'مزارع منزلي' : 'Home Farmer' },
                  ]}
                />
              </Col>

              <Col xs={24} md={6}>
                <label className={styles.filterLabel}>{t('gender')}</label>
                <Select
                  size="large"
                  placeholder={t('gender')}
                  value={filters.gender}
                  onChange={(value) => setFilters({ ...filters, gender: value })}
                  style={{ width: '100%' }}
                  allowClear
                >
                  <Select.Option value="male">{t('male')}</Select.Option>
                  <Select.Option value="female">{t('female')}</Select.Option>
                </Select>
              </Col>

              <Col xs={24} md={6}>
                <label className={styles.filterLabel}>{t('workerType')}</label>
                <Select
                  size="large"
                  placeholder={t('workerType')}
                  value={filters.workerType}
                  onChange={(value) => setFilters({ ...filters, workerType: value })}
                  style={{ width: '100%' }}
                  allowClear
                >
                  <Select.Option value="1">{t('typeMediation')}</Select.Option>
                  <Select.Option value="5">{t('typeTransfer')}</Select.Option>
                  <Select.Option value="2">{t('typeVisit')}</Select.Option>
                  <Select.Option value="3">{t('typeDuration')}</Select.Option>
                  <Select.Option value="4">{t('typeTransferContract')}</Select.Option>
                </Select>
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
                <label className={styles.filterLabel}>{t('religion')}</label>
                <Select
                  size="large"
                  placeholder={t('religion')}
                  value={filters.religion}
                  onChange={(value) => setFilters({ ...filters, religion: value })}
                  style={{ width: '100%' }}
                  allowClear
                >
                  <Select.Option value="1">{t('muslim')}</Select.Option>
                  <Select.Option value="2">{t('nonMuslim')}</Select.Option>
                </Select>
              </Col>

              <Col xs={24} md={6}>
                <label className={styles.filterLabel}>{t('experience')}</label>
                <Select
                  size="large"
                  placeholder={t('experience')}
                  value={
                    filters.hasExperience === undefined
                      ? undefined
                      : filters.hasExperience
                        ? 'yes'
                        : 'no'
                  }
                  onChange={(value) =>
                    setFilters({
                      ...filters,
                      hasExperience: value === 'yes' ? true : value === 'no' ? false : undefined,
                    })
                  }
                  style={{ width: '100%' }}
                  allowClear
                >
                  <Select.Option value="yes">{t('hasExperience')}</Select.Option>
                  <Select.Option value="no">{t('noExperience')}</Select.Option>
                </Select>
              </Col>

              <Col xs={24} md={6}>
                <label className={styles.filterLabel}>{t('vip')}</label>
                <Select
                  size="large"
                  placeholder={t('vip')}
                  value={filters.vip}
                  onChange={(value) => setFilters({ ...filters, vip: value })}
                  style={{ width: '100%' }}
                  allowClear
                >
                  <Select.Option value="1">{t('vipOnly')}</Select.Option>
                  <Select.Option value="2">{t('notVip')}</Select.Option>
                </Select>
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

      {/* Active Filters Display */}
      {Object.values(filters).some((v) => v !== undefined && v !== '') && (
        <div className={styles.activeFilters}>
          <div className={styles.filterTags}>
            <span style={{ fontWeight: 600, color: '#334155' }}>
              {language === 'ar' ? 'التصفيات النشطة:' : 'Active Filters:'}
            </span>
            {filters.search && (
              <Tag closable onClose={() => setFilters({ ...filters, search: undefined })}>
                {filters.search}
              </Tag>
            )}
            {filters.gender && (
              <Tag closable onClose={() => setFilters({ ...filters, gender: undefined })}>
                {t(filters.gender as any)}
              </Tag>
            )}
            {filters.hasExperience !== undefined && (
              <Tag closable onClose={() => setFilters({ ...filters, hasExperience: undefined })}>
                {filters.hasExperience ? t('hasExperience') : t('noExperience')}
              </Tag>
            )}
            <Button
              type="link"
              size="small"
              className={styles.clearFiltersButton}
              icon={<ClearOutlined />}
              onClick={handleClearFilters}
            >
              {t('clearFilters')}
            </Button>
          </div>
        </div>
      )}

      {/* Workers Grid */}
      {filteredWorkers.length === 0 ? (
        <Card className={styles.emptyState}>
          <Empty description={t('noWorkersDesc')} image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </Card>
      ) : (
        <div className={styles.workersGrid}>
          {filteredWorkers.map((worker) => (
            <Card key={worker.id} className={styles.workerCard}>
              <div className={styles.workerCardHeader}>
                <p className={styles.workerReference}>
                  {t('reference')}: {worker.referenceNo || 'N/A'}
                </p>
                {getStatusTag(worker.workerStatus || undefined)}
              </div>

              <div className={styles.workerCardBody}>
                <h3 className={styles.workerName}>
                  <UserOutlined />
                  {language === 'ar' ? worker.fullNameAr : worker.fullNameEn || worker.fullNameAr}
                </h3>

                <div className={styles.workerDetails}>
                  <div className={styles.detailRow}>
                    <IdcardOutlined className={styles.detailIcon} />
                    <span className={styles.detailLabel}>{t('passportNo')}:</span>
                    <span className={styles.detailValue}>{worker.passportNo || 'N/A'}</span>
                  </div>

                  <div className={styles.detailRow}>
                    <EnvironmentOutlined className={styles.detailIcon} />
                    <span className={styles.detailLabel}>{t('nationality')}:</span>
                    <span className={styles.detailValue}>{worker.nationalityId || 'N/A'}</span>
                  </div>

                  <div className={styles.detailRow}>
                    <CalendarOutlined className={styles.detailIcon} />
                    <span className={styles.detailLabel}>{t('age')}:</span>
                    <span className={styles.detailValue}>
                      {worker.age ? `${worker.age} ${t('years')}` : 'N/A'}
                    </span>
                  </div>

                  <div className={styles.detailRow}>
                    <PhoneOutlined className={styles.detailIcon} />
                    <span className={styles.detailLabel}>{t('mobile')}:</span>
                    <span className={styles.detailValue}>{worker.mobile || 'N/A'}</span>
                  </div>
                </div>

                {/* Badges */}
                <div className={styles.workerBadges}>
                  {worker.gender && (
                    <Tag color={worker.gender === 'male' ? 'blue' : 'pink'}>
                      {worker.gender === 'male' ? t('male') : t('female')}
                    </Tag>
                  )}
                  {worker.hasExperience && (
                    <Tag color="orange" icon={<TrophyOutlined />}>
                      {t('hasExperience')}
                    </Tag>
                  )}
                  {worker.religion && <Tag color="cyan">{worker.religion}</Tag>}
                </div>

                {worker.skills && worker.skills.length > 0 && (
                  <div className={styles.workerSkills}>
                    <p className={styles.skillsTitle}>{t('skills')}:</p>
                    <div className={styles.skillsList}>
                      {worker.skills.map((skill, index) => (
                        <Tag key={index} color="blue" className={styles.skillTag}>
                          {skill}
                        </Tag>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.workerCardActions}>
                <Tooltip title={t('view')}>
                  <Button type="text" icon={<EyeOutlined />} className={styles.actionButton} />
                </Tooltip>
                <Tooltip title={t('edit')}>
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    className={styles.actionButton}
                    onClick={() => handleOpenModal(worker)}
                  />
                </Tooltip>
                <Dropdown menu={getActionMenu(worker)} trigger={['click']}>
                  <Button type="text" icon={<MoreOutlined />} className={styles.actionButton} />
                </Dropdown>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        title={
          <Space>
            <UserOutlined />
            <span>{editingWorker ? t('updateWorker') : t('createWorker')}</span>
          </Space>
        }
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={800}
        className={styles.modal}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} className={styles.modalForm}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label={t('fullNameAr')} name="fullNameAr" rules={[{ required: true }]}>
                <Input size="large" placeholder={t('fullNameAr')} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label={t('fullNameEn')} name="fullNameEn">
                <Input size="large" placeholder={t('fullNameEn')} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label={t('passportNo')} name="passportNo" rules={[{ required: true }]}>
                <Input size="large" placeholder={t('passportNo')} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label={t('gender')} name="gender" rules={[{ required: true }]}>
                <Select size="large" placeholder={t('gender')}>
                  <Select.Option value="male">{t('male')}</Select.Option>
                  <Select.Option value="female">{t('female')}</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label={t('mobile')} name="mobile">
                <Input size="large" placeholder={t('mobile')} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label={t('birthDate')} name="birthDate">
                <DatePicker size="large" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label={t('nationality')} name="nationalityId">
                <Select
                  size="large"
                  placeholder={t('nationality')}
                  showSearch
                  optionFilterProp="label"
                  options={[
                    { value: '359', label: language === 'ar' ? 'الفلبين' : 'Philippines' },
                    { value: '360', label: language === 'ar' ? 'كينيا' : 'Kenya' },
                    { value: '361', label: language === 'ar' ? 'أوغندا' : 'Uganda' },
                    { value: '362', label: language === 'ar' ? 'الهند' : 'India' },
                    { value: '367', label: language === 'ar' ? 'باكستان' : 'Pakistan' },
                    { value: '731', label: language === 'ar' ? 'أثيوبيا' : 'Ethiopia' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label={t('religion')} name="religion">
                <Select size="large" placeholder={t('religion')}>
                  <Select.Option value="muslim">{t('muslim')}</Select.Option>
                  <Select.Option value="non-muslim">{t('nonMuslim')}</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <div className={styles.modalActions}>
            <Button className={styles.cancelButton} onClick={handleCloseModal}>
              {t('cancel')}
            </Button>
            <Button
              type="primary"
              className={styles.submitButton}
              htmlType="submit"
              loading={isCreating || isUpdating}
              icon={editingWorker ? <EditOutlined /> : <PlusOutlined />}
            >
              {editingWorker ? t('updateWorker') : t('createWorker')}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
