'use client';

import React, { useState, useMemo } from 'react';
import {
  Card,
  Button,
  Input,
  Select,
  Modal,
  Statistic,
  Tag,
  Empty,
  Row,
  Col,
  Tooltip,
  Timeline,
  Divider,
  Avatar,
  Space,
  Badge,
} from 'antd';
import {
  SearchOutlined,
  PrinterOutlined,
  FileExcelOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  PhoneOutlined,
  IdcardOutlined,
  GlobalOutlined,
  CalendarOutlined,
  SwapOutlined,
  FilterOutlined,
  EyeOutlined,
  HomeOutlined,
  ManOutlined,
  WomanOutlined,
  TeamOutlined,
  FileTextOutlined,
  HistoryOutlined,
  EnvironmentOutlined,
  SafetyCertificateOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/store/authStore';
import styles from './AlternativesReport.module.css';

interface AlternativeContract {
  id: string;
  contractNumber: string;
  contractId: number;
  customerName: string;
  customerPhone: string;
  customerId: string;
  isImportantCustomer: boolean;
  branchName: string;
  status: string;
  agentStatus: string;
  applicantStatus: string;
  nationality: string;
  job: string;
  visaNumber: string;
  visaStatus: 'Issued' | 'Pending' | 'Expired';
  applicantName: string;
  applicantId: string;
  agentName: string;
  gender: 'Male' | 'Female';
  housingName: string | null;
  onContract: boolean;
  onHousing: boolean;
  createdSinceDays: number;
  createdDate: string;
  createdBy: string;
  signedDate: string;
  endAfterDays: number;
  arrivalPlace: string;
  arrivalDate: string;
  lastStatus: {
    status: string;
    date: string;
    employeeName: string;
  };
}

interface AlternativeStats {
  total: number;
  awaitingAlternative: number;
  alternativeProvided: number;
  expelled: number;
  escaped: number;
  inHousing: number;
}

// Mock data generation
const generateMockAlternatives = (): AlternativeContract[] => [
  {
    id: '164929',
    contractNumber: '6339',
    contractId: 164929,
    customerName: 'Bdr ebdalhmyd mhmd almbark',
    customerPhone: '0582427414',
    customerId: '1088001233',
    isImportantCustomer: false,
    branchName: 'سيجما الكفاءات للاستقدام',
    status: 'Has Arrived',
    agentStatus: 'Booked ticket',
    applicantStatus: 'Expelling Applicant',
    nationality: 'India',
    job: 'DRIVER',
    visaNumber: '1907620389',
    visaStatus: 'Issued',
    applicantName: 'ASHAAB ALAM',
    applicantId: '184900',
    agentName: 'M. T TRAVEL AGENCY',
    gender: 'Male',
    housingName: 'مخزون التاجير سيجما الكفاءات',
    onContract: true,
    onHousing: true,
    createdSinceDays: 34,
    createdDate: '2025-11-17',
    createdBy: 'أحمد عبدالله',
    signedDate: '2025-11-17',
    endAfterDays: 32,
    arrivalPlace: 'الدمام',
    arrivalDate: '2025-12-21',
    lastStatus: {
      status: 'Final Exit',
      date: '2026-01-12',
      employeeName: 'محمد علي',
    },
  },
  {
    id: '163740',
    contractNumber: '6280',
    contractId: 163740,
    customerName: 'RAAD AALI ALI AL JUAID',
    customerPhone: '0598984040',
    customerId: '1054196025',
    isImportantCustomer: true,
    branchName: 'سيجما الكفاءات للاستقدام',
    status: 'Has Arrived',
    agentStatus: 'Booked ticket',
    applicantStatus: 'Expelling Applicant',
    nationality: 'Ethiopia',
    job: 'house maid',
    visaNumber: '196025',
    visaStatus: 'Issued',
    applicantName: 'EMAN SHIMELES ASFAW',
    applicantId: '183920',
    agentName: 'ABUFATI FOREIGN EMPLYMENT AGENT PLC',
    gender: 'Female',
    housingName: null,
    onContract: true,
    onHousing: false,
    createdSinceDays: 44,
    createdDate: '2025-11-08',
    createdBy: 'سارة أحمد',
    signedDate: '2025-11-10',
    endAfterDays: 25,
    arrivalPlace: 'جدة',
    arrivalDate: '2025-12-22',
    lastStatus: {
      status: 'Final Exit',
      date: '2025-12-24',
      employeeName: 'خالد محمد',
    },
  },
  {
    id: '160135',
    contractNumber: '6145',
    contractId: 160135,
    customerName: 'عبدالله محمد السعيد',
    customerPhone: '0567890123',
    customerId: '1075432198',
    isImportantCustomer: false,
    branchName: 'سيجما الكفاءات للاستقدام',
    status: 'Has Arrived',
    agentStatus: 'Stamped',
    applicantStatus: 'Receiving Worker',
    nationality: 'Philippines',
    job: 'house maid',
    visaNumber: '1907654321',
    visaStatus: 'Issued',
    applicantName: 'MARIA SANTOS CRUZ',
    applicantId: '182100',
    agentName: 'ALHABESHI International Services Inc.',
    gender: 'Female',
    housingName: 'سكن العمالة المركزي',
    onContract: true,
    onHousing: true,
    createdSinceDays: 26,
    createdDate: '2025-11-20',
    createdBy: 'فاطمة علي',
    signedDate: '2025-11-22',
    endAfterDays: 45,
    arrivalPlace: 'الرياض',
    arrivalDate: '2025-12-15',
    lastStatus: {
      status: 'Housing The Worker',
      date: '2025-12-20',
      employeeName: 'أحمد سالم',
    },
  },
  {
    id: '160056',
    contractNumber: '6098',
    contractId: 160056,
    customerName: 'فهد عبدالعزيز الحربي',
    customerPhone: '0509876543',
    customerId: '1098765432',
    isImportantCustomer: true,
    branchName: 'سيجما الكفاءات للاستقدام',
    status: 'Signed',
    agentStatus: 'Training Done',
    applicantStatus: 'Escape Applicant',
    nationality: 'Indonesia',
    job: 'house maid',
    visaNumber: '1907987654',
    visaStatus: 'Issued',
    applicantName: 'DEWI LESTARI',
    applicantId: '181500',
    agentName: 'POLY WORLD SERVICE',
    gender: 'Female',
    housingName: null,
    onContract: true,
    onHousing: false,
    createdSinceDays: 51,
    createdDate: '2025-10-25',
    createdBy: 'محمد العتيبي',
    signedDate: '2025-10-28',
    endAfterDays: 10,
    arrivalPlace: 'جدة',
    arrivalDate: '2025-12-10',
    lastStatus: {
      status: 'Escape Applicants',
      date: '2026-01-05',
      employeeName: 'سعود الحربي',
    },
  },
  {
    id: '159681',
    contractNumber: '6055',
    contractId: 159681,
    customerName: 'نورة سعد الدوسري',
    customerPhone: '0551234567',
    customerId: '1087654321',
    isImportantCustomer: false,
    branchName: 'سيجما الكفاءات للاستقدام',
    status: 'Has Arrived',
    agentStatus: 'Booked ticket',
    applicantStatus: 'Alternative Requested',
    nationality: 'Kenya',
    job: 'house maid',
    visaNumber: '1907123456',
    visaStatus: 'Issued',
    applicantName: 'GRACE WANJIRU KAMAU',
    applicantId: '180800',
    agentName: 'GESFLY INTERNATIONAL LINKS LIMITED',
    gender: 'Female',
    housingName: 'مخزون التاجير سيجما الكفاءات',
    onContract: true,
    onHousing: true,
    createdSinceDays: 43,
    createdDate: '2025-11-02',
    createdBy: 'ريم عبدالله',
    signedDate: '2025-11-05',
    endAfterDays: 18,
    arrivalPlace: 'الدمام',
    arrivalDate: '2025-12-18',
    lastStatus: {
      status: 'Request An Alternative Worker',
      date: '2026-01-10',
      employeeName: 'لمياء سالم',
    },
  },
  {
    id: '159524',
    contractNumber: '6012',
    contractId: 159524,
    customerName: 'خالد إبراهيم الشمري',
    customerPhone: '0543210987',
    customerId: '1065432109',
    isImportantCustomer: false,
    branchName: 'سيجما الكفاءات للاستقدام',
    status: 'Has Arrived',
    agentStatus: 'Stamped',
    applicantStatus: 'Sponsorship Transfer',
    nationality: 'Bangladesh',
    job: 'DRIVER',
    visaNumber: '1907456789',
    visaStatus: 'Issued',
    applicantName: 'MD RAFIQUL ISLAM',
    applicantId: '180200',
    agentName: 'AMZUL ENTERPRISES (PVT) LTD',
    gender: 'Female',
    housingName: null,
    onContract: true,
    onHousing: false,
    createdSinceDays: 44,
    createdDate: '2025-10-30',
    createdBy: 'عمر السعيد',
    signedDate: '2025-11-02',
    endAfterDays: 15,
    arrivalPlace: 'الرياض',
    arrivalDate: '2025-12-12',
    lastStatus: {
      status: 'Sponsorship Transfer contracts',
      date: '2026-01-08',
      employeeName: 'ماجد العنزي',
    },
  },
  {
    id: '159402',
    contractNumber: '5988',
    contractId: 159402,
    customerName: 'سارة محمد القحطاني',
    customerPhone: '0559876543',
    customerId: '1076543210',
    isImportantCustomer: true,
    branchName: 'سيجما الكفاءات للاستقدام',
    status: 'Has Arrived',
    agentStatus: 'Booked ticket',
    applicantStatus: 'Payment Made',
    nationality: 'Uganda',
    job: 'house maid',
    visaNumber: '1907789012',
    visaStatus: 'Issued',
    applicantName: 'NABIRYE SARAH',
    applicantId: '179800',
    agentName: 'BAZAMU GLOBAL AGENCIES',
    gender: 'Female',
    housingName: 'سكن النساء المركزي',
    onContract: true,
    onHousing: true,
    createdSinceDays: 41,
    createdDate: '2025-11-05',
    createdBy: 'هدى الزهراني',
    signedDate: '2025-11-08',
    endAfterDays: 22,
    arrivalPlace: 'جدة',
    arrivalDate: '2025-12-20',
    lastStatus: {
      status: 'Payment Has Been Made To The Customer',
      date: '2026-01-15',
      employeeName: 'عائشة محمد',
    },
  },
  {
    id: '158491',
    contractNumber: '5945',
    contractId: 158491,
    customerName: 'عبدالرحمن فيصل العمري',
    customerPhone: '0501122334',
    customerId: '1054321098',
    isImportantCustomer: false,
    branchName: 'سيجما الكفاءات للاستقدام',
    status: 'Has Arrived',
    agentStatus: 'Stamped',
    applicantStatus: 'Receiving Worker',
    nationality: 'Sri Lanka',
    job: 'house maid',
    visaNumber: '1907890123',
    visaStatus: 'Issued',
    applicantName: 'KUMARI RATHNAYAKE',
    applicantId: '179200',
    agentName: 'CAREEM LANKA OVERSEAS (PVT) LTD',
    gender: 'Female',
    housingName: null,
    onContract: true,
    onHousing: false,
    createdSinceDays: 37,
    createdDate: '2025-11-10',
    createdBy: 'علي الحربي',
    signedDate: '2025-11-12',
    endAfterDays: 28,
    arrivalPlace: 'الرياض',
    arrivalDate: '2025-12-25',
    lastStatus: {
      status: 'Receiving The Worker From Client',
      date: '2026-01-18',
      employeeName: 'فهد السالم',
    },
  },
  {
    id: '158340',
    contractNumber: '5912',
    contractId: 158340,
    customerName: 'منى عبدالله الغامدي',
    customerPhone: '0556677889',
    customerId: '1043210987',
    isImportantCustomer: false,
    branchName: 'سيجما الكفاءات للاستقدام',
    status: 'Has Arrived',
    agentStatus: 'Booked ticket',
    applicantStatus: 'Alternative Provided',
    nationality: 'Morocco',
    job: 'house maid',
    visaNumber: '1907012345',
    visaStatus: 'Issued',
    applicantName: 'FATIMA ZAHRA BENALI',
    applicantId: '178600',
    agentName: 'SOCIETE DE FORMATION PROFESSIONNELLE',
    gender: 'Female',
    housingName: 'مخزون التاجير سيجما الكفاءات',
    onContract: false,
    onHousing: true,
    createdSinceDays: 25,
    createdDate: '2025-11-18',
    createdBy: 'سلمى أحمد',
    signedDate: '2025-11-20',
    endAfterDays: 35,
    arrivalPlace: 'الدمام',
    arrivalDate: '2025-12-28',
    lastStatus: {
      status: 'Alternative Provided',
      date: '2026-01-20',
      employeeName: 'نوال الشهري',
    },
  },
  {
    id: '157874',
    contractNumber: '5878',
    contractId: 157874,
    customerName: 'تركي سلطان الدوسري',
    customerPhone: '0504455667',
    customerId: '1032109876',
    isImportantCustomer: true,
    branchName: 'سيجما الكفاءات للاستقدام',
    status: 'Signed',
    agentStatus: 'Training OG',
    applicantStatus: 'Housing Worker',
    nationality: 'Pakistan',
    job: 'DRIVER',
    visaNumber: '1907234567',
    visaStatus: 'Pending',
    applicantName: 'MUHAMMAD IMRAN KHAN',
    applicantId: '178000',
    agentName: 'QASWA MANPOWER',
    gender: 'Male',
    housingName: 'سكن السائقين',
    onContract: true,
    onHousing: true,
    createdSinceDays: 60,
    createdDate: '2025-10-15',
    createdBy: 'ناصر المالكي',
    signedDate: '2025-10-18',
    endAfterDays: 5,
    arrivalPlace: 'جدة',
    arrivalDate: '2026-01-05',
    lastStatus: {
      status: 'Housing The Worker',
      date: '2026-01-22',
      employeeName: 'بندر العتيبي',
    },
  },
];

export default function AlternativesReportPage() {
  const language = useAuthStore((state) => state.language);
  const isArabic = language === 'ar';

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [nationalityFilter, setNationalityFilter] = useState<string>('all');
  const [warrantyStatusFilter, setWarrantyStatusFilter] = useState<string>('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedContract, setSelectedContract] = useState<AlternativeContract | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [provideAlternativeModalVisible, setProvideAlternativeModalVisible] = useState(false);

  // Mock data
  const contracts = useMemo(() => generateMockAlternatives(), []);

  // Calculate stats
  const stats: AlternativeStats = useMemo(() => {
    return {
      total: contracts.length,
      awaitingAlternative: contracts.filter((c) => c.applicantStatus === 'Alternative Requested')
        .length,
      alternativeProvided: contracts.filter((c) => c.applicantStatus === 'Alternative Provided')
        .length,
      expelled: contracts.filter((c) => c.applicantStatus === 'Expelling Applicant').length,
      escaped: contracts.filter((c) => c.applicantStatus === 'Escape Applicant').length,
      inHousing: contracts.filter((c) => c.onHousing).length,
    };
  }, [contracts]);

  // Filter contracts
  const filteredContracts = useMemo(() => {
    return contracts.filter((contract) => {
      const matchesSearch =
        searchTerm === '' ||
        contract.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.contractNumber.includes(searchTerm) ||
        contract.customerPhone.includes(searchTerm) ||
        contract.applicantName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
      const matchesNationality =
        nationalityFilter === 'all' || contract.nationality === nationalityFilter;
      const matchesWarrantyStatus =
        warrantyStatusFilter === 'all' || contract.applicantStatus === warrantyStatusFilter;

      return matchesSearch && matchesStatus && matchesNationality && matchesWarrantyStatus;
    });
  }, [contracts, searchTerm, statusFilter, nationalityFilter, warrantyStatusFilter]);

  // Get unique values for filters
  const nationalities = [...new Set(contracts.map((c) => c.nationality))];
  const warrantyStatuses = [...new Set(contracts.map((c) => c.applicantStatus))];

  const handleViewDetails = (contract: AlternativeContract) => {
    setSelectedContract(contract);
    setDetailsModalVisible(true);
  };

  const handleProvideAlternative = (contract: AlternativeContract) => {
    setSelectedContract(contract);
    setProvideAlternativeModalVisible(true);
  };

  const getApplicantStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Expelling Applicant': 'orange',
      'Escape Applicant': 'red',
      'Alternative Requested': 'blue',
      'Alternative Provided': 'green',
      'Receiving Worker': 'cyan',
      'Sponsorship Transfer': 'purple',
      'Payment Made': 'gold',
      'Housing Worker': 'geekblue',
    };
    return colors[status] || 'default';
  };

  const getApplicantStatusIcon = (status: string) => {
    const icons: Record<string, React.ReactNode> = {
      'Expelling Applicant': <StopOutlined />,
      'Escape Applicant': <ExclamationCircleOutlined />,
      'Alternative Requested': <SyncOutlined spin />,
      'Alternative Provided': <CheckCircleOutlined />,
      'Receiving Worker': <UserOutlined />,
      'Sponsorship Transfer': <SwapOutlined />,
      'Payment Made': <SafetyCertificateOutlined />,
      'Housing Worker': <HomeOutlined />,
    };
    return icons[status] || <ClockCircleOutlined />;
  };

  return (
    <div className={styles.pageContainer}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerTitle}>
            <SwapOutlined className={styles.headerIcon} />
            <div>
              <h1>{isArabic ? 'تقرير البدائل' : 'Alternatives Report'}</h1>
              <p className={styles.headerSubtitle}>
                {isArabic
                  ? 'إدارة ومتابعة طلبات البدائل والعمالة'
                  : 'Manage and track alternative requests and workers'}
              </p>
            </div>
          </div>
          <div className={styles.headerActions}>
            <Button icon={<FileExcelOutlined />} className={styles.secondaryBtn}>
              {isArabic ? 'تصدير Excel' : 'Export Excel'}
            </Button>
            <Button icon={<PrinterOutlined />} className={styles.secondaryBtn}>
              {isArabic ? 'طباعة' : 'Print'}
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className={styles.statsRow}>
        <Col xs={12} sm={8} md={4}>
          <Card className={styles.statCard}>
            <Statistic
              title={isArabic ? 'الإجمالي' : 'Total'}
              value={stats.total}
              prefix={<TeamOutlined className={styles.statIconBlue} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card className={styles.statCard}>
            <Statistic
              title={isArabic ? 'بانتظار البديل' : 'Awaiting Alternative'}
              value={stats.awaitingAlternative}
              prefix={<SyncOutlined spin className={styles.statIconOrange} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card className={styles.statCard}>
            <Statistic
              title={isArabic ? 'تم توفير بديل' : 'Alternative Provided'}
              value={stats.alternativeProvided}
              prefix={<CheckCircleOutlined className={styles.statIconGreen} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card className={styles.statCard}>
            <Statistic
              title={isArabic ? 'مطرود' : 'Expelled'}
              value={stats.expelled}
              prefix={<StopOutlined className={styles.statIconRed} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card className={styles.statCard}>
            <Statistic
              title={isArabic ? 'هارب' : 'Escaped'}
              value={stats.escaped}
              prefix={<ExclamationCircleOutlined className={styles.statIconPurple} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card className={styles.statCard}>
            <Statistic
              title={isArabic ? 'في السكن' : 'In Housing'}
              value={stats.inHousing}
              prefix={<HomeOutlined className={styles.statIconCyan} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className={styles.filterCard}>
        <div className={styles.filterHeader}>
          <div className={styles.filterTitle}>
            <FilterOutlined />
            <span>{isArabic ? 'فلاتر البحث' : 'Search Filters'}</span>
            
          </div>
          <Button type="link" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
            {showAdvancedFilters
              ? isArabic
                ? 'إخفاء الفلاتر المتقدمة'
                : 'Hide Advanced'
              : isArabic
                ? 'فلاتر متقدمة'
                : 'Advanced Filters'}
          </Button>
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder={isArabic ? 'بحث...' : 'Search...'}
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder={isArabic ? 'حالة العقد' : 'Contract Status'}
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: '100%' }}
              options={[
                { value: 'all', label: isArabic ? 'الكل' : 'All' },
                { value: 'Has Arrived', label: isArabic ? 'وصل' : 'Has Arrived' },
                { value: 'Signed', label: isArabic ? 'موقع' : 'Signed' },
                { value: 'Pending', label: isArabic ? 'قيد الانتظار' : 'Pending' },
              ]}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder={isArabic ? 'الجنسية' : 'Nationality'}
              value={nationalityFilter}
              onChange={setNationalityFilter}
              style={{ width: '100%' }}
              options={[
                { value: 'all', label: isArabic ? 'الكل' : 'All' },
                ...nationalities.map((n) => ({ value: n, label: n })),
              ]}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder={isArabic ? 'حالة الضمان' : 'Warranty Status'}
              value={warrantyStatusFilter}
              onChange={setWarrantyStatusFilter}
              style={{ width: '100%' }}
              options={[
                { value: 'all', label: isArabic ? 'الكل' : 'All' },
                ...warrantyStatuses.map((s) => ({ value: s, label: s })),
              ]}
            />
          </Col>
        </Row>

        {showAdvancedFilters && (
          <Row gutter={[16, 16]} className={styles.advancedFilters}>
            <Col xs={24} sm={12} md={6}>
              <Select
                placeholder={isArabic ? 'الوكيل' : 'Agent'}
                style={{ width: '100%' }}
                options={[{ value: 'all', label: isArabic ? 'الكل' : 'All' }]}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                placeholder={isArabic ? 'الوظيفة' : 'Job'}
                style={{ width: '100%' }}
                options={[
                  { value: 'all', label: isArabic ? 'الكل' : 'All' },
                  { value: 'house maid', label: isArabic ? 'عاملة منزلية' : 'House Maid' },
                  { value: 'DRIVER', label: isArabic ? 'سائق' : 'Driver' },
                ]}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                placeholder={isArabic ? 'الخبرة' : 'Experience'}
                style={{ width: '100%' }}
                options={[
                  { value: 'all', label: isArabic ? 'الكل' : 'All' },
                  { value: 'experienced', label: isArabic ? 'خبرة سابقة' : 'Has Worked' },
                  { value: 'new', label: isArabic ? 'بدون خبرة' : 'Never Work' },
                ]}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                placeholder={isArabic ? 'في السكن' : 'In Housing'}
                style={{ width: '100%' }}
                options={[
                  { value: 'all', label: isArabic ? 'الكل' : 'All' },
                  { value: 'yes', label: isArabic ? 'نعم' : 'Yes' },
                  { value: 'no', label: isArabic ? 'لا' : 'No' },
                ]}
              />
            </Col>
          </Row>
        )}
      </Card>

      {/* Contracts Grid */}
      <div className={styles.contractsGrid}>
        {filteredContracts.length === 0 ? (
          <Card className={styles.emptyCard}>
            <Empty description={isArabic ? 'لا توجد عقود مطابقة' : 'No matching contracts found'} />
          </Card>
        ) : (
          filteredContracts.map((contract) => (
            <Card key={contract.id} className={styles.contractCard} hoverable>
              {/* Card Header */}
              <div className={styles.cardHeader}>
                <div className={styles.contractNumber}>
                  <span className={styles.numberLabel}>{isArabic ? 'عقد رقم' : 'Contract #'}</span>
                  <span className={styles.numberValue}>{contract.contractNumber}</span>
                </div>
                <Tag color={getApplicantStatusColor(contract.applicantStatus)}>
                  {getApplicantStatusIcon(contract.applicantStatus)}
                  <span style={{ marginInlineStart: 4 }}>{contract.applicantStatus}</span>
                </Tag>
              </div>

              {/* Customer Info */}
              <div className={styles.customerSection}>
                <div className={styles.customerInfo}>
                  <Avatar
                    size={48}
                    icon={<UserOutlined />}
                    className={contract.isImportantCustomer ? styles.vipAvatar : styles.avatar}
                  />
                  <div className={styles.customerDetails}>
                    <h4>
                      {contract.customerName}
                      {contract.isImportantCustomer && (
                        <Tag color="gold" className={styles.vipTag}>
                          VIP
                        </Tag>
                      )}
                    </h4>
                    <div className={styles.customerMeta}>
                      <span>
                        <PhoneOutlined /> {contract.customerPhone}
                      </span>
                      <span>
                        <IdcardOutlined /> {contract.customerId}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Divider className={styles.cardDivider} />

              {/* Applicant & Visa Info */}
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <label>{isArabic ? 'العامل' : 'Worker'}</label>
                  <div className={styles.infoValue}>
                    <span>{contract.applicantName}</span>
                    {contract.gender === 'Male' ? (
                      <ManOutlined className={styles.genderMale} />
                    ) : (
                      <WomanOutlined className={styles.genderFemale} />
                    )}
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <label>{isArabic ? 'الجنسية' : 'Nationality'}</label>
                  <div className={styles.infoValue}>
                    <GlobalOutlined />
                    <span>{contract.nationality}</span>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <label>{isArabic ? 'الوظيفة' : 'Job'}</label>
                  <span>{contract.job}</span>
                </div>
                <div className={styles.infoItem}>
                  <label>{isArabic ? 'التأشيرة' : 'Visa'}</label>
                  <div className={styles.infoValue}>
                    <span>{contract.visaNumber}</span>
                    <Tag
                      color={
                        contract.visaStatus === 'Issued'
                          ? 'green'
                          : contract.visaStatus === 'Pending'
                            ? 'orange'
                            : 'red'
                      }
                    >
                      {contract.visaStatus}
                    </Tag>
                  </div>
                </div>
              </div>

              <Divider className={styles.cardDivider} />

              {/* Status Indicators */}
              <div className={styles.statusIndicators}>
                <div className={styles.statusBadge}>
                  <span className={styles.statusLabel}>{isArabic ? 'على عقد' : 'On Contract'}</span>
                  <Badge
                    status={contract.onContract ? 'success' : 'default'}
                    text={contract.onContract ? (isArabic ? 'نعم' : 'Yes') : isArabic ? 'لا' : 'No'}
                  />
                </div>
                <div className={styles.statusBadge}>
                  <span className={styles.statusLabel}>{isArabic ? 'في السكن' : 'In Housing'}</span>
                  <Badge
                    status={contract.onHousing ? 'processing' : 'default'}
                    text={contract.onHousing ? (isArabic ? 'نعم' : 'Yes') : isArabic ? 'لا' : 'No'}
                  />
                </div>
                {contract.housingName && (
                  <div className={styles.housingInfo}>
                    <HomeOutlined />
                    <span>{contract.housingName}</span>
                  </div>
                )}
              </div>

              <Divider className={styles.cardDivider} />

              {/* Timeline Info */}
              <div className={styles.timelineInfo}>
                <div className={styles.timelineItem}>
                  <CalendarOutlined />
                  <span>
                    {isArabic ? 'منذ' : 'Since'}: {contract.createdSinceDays}{' '}
                    {isArabic ? 'يوم' : 'days'}
                  </span>
                </div>
                <div className={styles.timelineItem}>
                  <ClockCircleOutlined />
                  <span>
                    {isArabic ? 'ينتهي بعد' : 'Ends in'}: {contract.endAfterDays}{' '}
                    {isArabic ? 'يوم' : 'days'}
                  </span>
                </div>
                <div className={styles.timelineItem}>
                  <EnvironmentOutlined />
                  <span>{contract.arrivalPlace}</span>
                </div>
              </div>

              {/* Last Status */}
              <div className={styles.lastStatus}>
                <div className={styles.lastStatusHeader}>
                  <HistoryOutlined />
                  <span>{isArabic ? 'آخر حالة' : 'Last Status'}</span>
                </div>
                <div className={styles.lastStatusContent}>
                  <span className={styles.statusText}>{contract.lastStatus.status}</span>
                  <span className={styles.statusDate}>{contract.lastStatus.date}</span>
                </div>
              </div>

              {/* Card Actions */}
              <div className={styles.cardActions}>
                <Tooltip title={isArabic ? 'عرض التفاصيل' : 'View Details'}>
                  <Button
                    type="text"
                    icon={<EyeOutlined />}
                    onClick={() => handleViewDetails(contract)}
                  />
                </Tooltip>
                <Tooltip title={isArabic ? 'توفير بديل' : 'Provide Alternative'}>
                  <Button
                    type="primary"
                    icon={<SwapOutlined />}
                    onClick={() => handleProvideAlternative(contract)}
                    size="small"
                  >
                    {isArabic ? 'توفير بديل' : 'Alternative'}
                  </Button>
                </Tooltip>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Details Modal */}
      <Modal
        title={
          <Space>
            <FileTextOutlined />
            {isArabic ? 'تفاصيل العقد' : 'Contract Details'}
          </Space>
        }
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedContract && (
          <div className={styles.detailsModal}>
            <div className={styles.detailsHeader}>
              <div className={styles.detailsContractNumber}>
                <span>{isArabic ? 'عقد رقم' : 'Contract #'}</span>
                <h2>{selectedContract.contractNumber}</h2>
              </div>
              <Tag
                color={getApplicantStatusColor(selectedContract.applicantStatus)}
                className={styles.detailsStatusTag}
              >
                {getApplicantStatusIcon(selectedContract.applicantStatus)}
                <span style={{ marginInlineStart: 4 }}>{selectedContract.applicantStatus}</span>
              </Tag>
            </div>

            <Divider />

            <Row gutter={[24, 24]}>
              <Col span={12}>
                <div className={styles.detailsSection}>
                  <h4>
                    <UserOutlined /> {isArabic ? 'معلومات العميل' : 'Customer Info'}
                  </h4>
                  <div className={styles.detailsList}>
                    <div className={styles.detailItem}>
                      <label>{isArabic ? 'الاسم' : 'Name'}</label>
                      <span>{selectedContract.customerName}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <label>{isArabic ? 'الهاتف' : 'Phone'}</label>
                      <span>{selectedContract.customerPhone}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <label>{isArabic ? 'رقم الهوية' : 'ID'}</label>
                      <span>{selectedContract.customerId}</span>
                    </div>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.detailsSection}>
                  <h4>
                    <TeamOutlined /> {isArabic ? 'معلومات العامل' : 'Worker Info'}
                  </h4>
                  <div className={styles.detailsList}>
                    <div className={styles.detailItem}>
                      <label>{isArabic ? 'الاسم' : 'Name'}</label>
                      <span>{selectedContract.applicantName}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <label>{isArabic ? 'الجنسية' : 'Nationality'}</label>
                      <span>{selectedContract.nationality}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <label>{isArabic ? 'الجنس' : 'Gender'}</label>
                      <span>
                        {selectedContract.gender === 'Male'
                          ? isArabic
                            ? 'ذكر'
                            : 'Male'
                          : isArabic
                            ? 'أنثى'
                            : 'Female'}
                      </span>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            <Divider />

            <div className={styles.detailsSection}>
              <h4>
                <HistoryOutlined /> {isArabic ? 'سجل الحالات' : 'Status Timeline'}
              </h4>
              <Timeline
                items={[
                  {
                    color: 'green',
                    children: (
                      <div>
                        <strong>{selectedContract.lastStatus.status}</strong>
                        <p>
                          {selectedContract.lastStatus.date} -{' '}
                          {selectedContract.lastStatus.employeeName}
                        </p>
                      </div>
                    ),
                  },
                  {
                    color: 'blue',
                    children: (
                      <div>
                        <strong>{isArabic ? 'وصل العامل' : 'Worker Arrived'}</strong>
                        <p>{selectedContract.arrivalDate}</p>
                      </div>
                    ),
                  },
                  {
                    color: 'gray',
                    children: (
                      <div>
                        <strong>{isArabic ? 'توقيع العقد' : 'Contract Signed'}</strong>
                        <p>{selectedContract.signedDate}</p>
                      </div>
                    ),
                  },
                  {
                    color: 'gray',
                    children: (
                      <div>
                        <strong>{isArabic ? 'إنشاء العقد' : 'Contract Created'}</strong>
                        <p>
                          {selectedContract.createdDate} - {selectedContract.createdBy}
                        </p>
                      </div>
                    ),
                  },
                ]}
              />
            </div>

            <div className={styles.modalActions}>
              <Button onClick={() => setDetailsModalVisible(false)}>
                {isArabic ? 'إغلاق' : 'Close'}
              </Button>
              <Button
                type="primary"
                icon={<SwapOutlined />}
                onClick={() => {
                  setDetailsModalVisible(false);
                  handleProvideAlternative(selectedContract);
                }}
              >
                {isArabic ? 'توفير بديل' : 'Provide Alternative'}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Provide Alternative Modal */}
      <Modal
        title={
          <Space>
            <SwapOutlined />
            {isArabic ? 'توفير بديل' : 'Provide Alternative'}
          </Space>
        }
        open={provideAlternativeModalVisible}
        onCancel={() => setProvideAlternativeModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedContract && (
          <div className={styles.alternativeModal}>
            <div className={styles.currentWorkerInfo}>
              <h4>{isArabic ? 'العامل الحالي' : 'Current Worker'}</h4>
              <Card size="small">
                <div className={styles.workerCard}>
                  <Avatar size={40} icon={<UserOutlined />} />
                  <div>
                    <strong>{selectedContract.applicantName}</strong>
                    <p>
                      {selectedContract.nationality} • {selectedContract.job}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <Divider />

            <div className={styles.alternativeOptions}>
              <h4>{isArabic ? 'خيارات البديل' : 'Alternative Options'}</h4>

              <div className={styles.optionsList}>
                <Button block className={styles.optionButton}>
                  <HomeOutlined />
                  <span>{isArabic ? 'اختيار من السكن' : 'Select from Housing'}</span>
                </Button>
                <Button block className={styles.optionButton}>
                  <GlobalOutlined />
                  <span>{isArabic ? 'طلب من الوكيل' : 'Request from Agent'}</span>
                </Button>
                <Button block className={styles.optionButton}>
                  <TeamOutlined />
                  <span>{isArabic ? 'العمالة المتاحة' : 'Available Workers'}</span>
                </Button>
              </div>
            </div>

            <Divider />

            <div className={styles.modalActions}>
              <Button onClick={() => setProvideAlternativeModalVisible(false)}>
                {isArabic ? 'إلغاء' : 'Cancel'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
