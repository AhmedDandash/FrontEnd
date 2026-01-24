'use client';

import React, { useState, useMemo } from 'react';
import {
  Card,
  Button,
  Input,
  Select,
  Tag,
  Empty,
  Row,
  Col,
  Tooltip,
  Statistic,
  Progress,
  Modal,
  Divider,
  Avatar,
  Badge,
  Pagination,
  Segmented,
} from 'antd';
import {
  SearchOutlined,
  FileExcelOutlined,
  CalendarOutlined,
  UserOutlined,
  IdcardOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  ReloadOutlined,
  WhatsAppOutlined,
  HistoryOutlined,
  SyncOutlined,
  FieldTimeOutlined,
  FileTextOutlined,
  RiseOutlined,
  WarningOutlined,
  ShopOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/store/authStore';
import styles from './CollectionRenewal.module.css';

interface RentalContract {
  id: string;
  contractId: number;
  contractNumber: number;
  branchName: string;
  branchNameAr: string;
  customerName: string;
  customerNameAr: string;
  customerPhone: string;
  customerId: string;
  customerUuid: string;
  signDate: string;
  startDate: string;
  endDate: string;
  remainingDays: number;
  status: 'valid' | 'expiring-soon' | 'expired';
  totalAmount: number;
  paidAmount: number;
  workerName?: string;
  workerNameAr?: string;
  workerNationality?: string;
  workerNationalityAr?: string;
}

interface ContractStats {
  total: number;
  valid: number;
  expiringSoon: number;
  expired: number;
  collectionRate: number;
}

// Mock data generation
const generateMockContracts = (): RentalContract[] => [
  {
    id: '1',
    contractId: 20939,
    contractNumber: 766,
    branchName: 'Sigma Competences Recruitment Office',
    branchNameAr: 'سيقما الكفاءات للإستقدام',
    customerName: 'Abdullah Syed Hassan Al-Harfi',
    customerNameAr: 'عبدالله سيد حسن الهرفي',
    customerPhone: '0555255501',
    customerId: '1001808714',
    customerUuid: '700860f2-d75a-40f5-bf2a-dd070792d574',
    signDate: '2026-01-14',
    startDate: '2026-01-14',
    endDate: '2026-02-12',
    remainingDays: 29,
    status: 'valid',
    totalAmount: 15000,
    paidAmount: 15000,
    workerName: 'Maria Santos',
    workerNameAr: 'ماريا سانتوس',
    workerNationality: 'Philippines',
    workerNationalityAr: 'الفلبين',
  },
  {
    id: '2',
    contractId: 17179,
    contractNumber: 765,
    branchName: 'Sigma Competences Recruitment Office',
    branchNameAr: 'سيقما الكفاءات للإستقدام',
    customerName: 'Hanan Mohammed Ali Bek',
    customerNameAr: 'حنان محمد علي بيك',
    customerPhone: '0505617966',
    customerId: '1008012286',
    customerUuid: '84701c4b-1c58-4ae9-a25d-8f47fdd18bbe',
    signDate: '2024-08-15',
    startDate: '2024-08-17',
    endDate: '2024-09-15',
    remainingDays: -486,
    status: 'expired',
    totalAmount: 12000,
    paidAmount: 10000,
    workerName: 'Sarah Ahmed',
    workerNameAr: 'سارة أحمد',
    workerNationality: 'Indonesia',
    workerNationalityAr: 'إندونيسيا',
  },
  {
    id: '3',
    contractId: 17159,
    contractNumber: 764,
    branchName: 'Sigma Competences Recruitment Office',
    branchNameAr: 'سيقما الكفاءات للإستقدام',
    customerName: 'Mohammed Ahmed Al-Otaibi',
    customerNameAr: 'محمد أحمد العتيبي',
    customerPhone: '0501234567',
    customerId: '1023456789',
    customerUuid: 'abc123-def456',
    signDate: '2026-01-10',
    startDate: '2026-01-12',
    endDate: '2026-01-28',
    remainingDays: 4,
    status: 'expiring-soon',
    totalAmount: 18000,
    paidAmount: 18000,
    workerName: 'Rosa Martinez',
    workerNameAr: 'روزا مارتينيز',
    workerNationality: 'Philippines',
    workerNationalityAr: 'الفلبين',
  },
  {
    id: '4',
    contractId: 17155,
    contractNumber: 763,
    branchName: 'SIGMA Branch',
    branchNameAr: 'فرع سيقما',
    customerName: 'Fahd Saud Al-Maliki',
    customerNameAr: 'فهد سعود المالكي',
    customerPhone: '0559876543',
    customerId: '1098765432',
    customerUuid: 'xyz789-abc123',
    signDate: '2025-12-01',
    startDate: '2025-12-05',
    endDate: '2026-03-05',
    remainingDays: 40,
    status: 'valid',
    totalAmount: 20000,
    paidAmount: 20000,
    workerName: 'Ana Marcela',
    workerNameAr: 'أنا مارسيلا',
    workerNationality: 'Philippines',
    workerNationalityAr: 'الفلبين',
  },
  {
    id: '5',
    contractId: 17055,
    contractNumber: 762,
    branchName: 'Sigma Competences Recruitment Office',
    branchNameAr: 'سيقما الكفاءات للإستقدام',
    customerName: 'Sara Khalid Al-Qahtani',
    customerNameAr: 'سارة خالد القحطاني',
    customerPhone: '0543219876',
    customerId: '1012345678',
    customerUuid: 'def456-ghi789',
    signDate: '2025-11-15',
    startDate: '2025-11-20',
    endDate: '2026-01-20',
    remainingDays: -4,
    status: 'expired',
    totalAmount: 14000,
    paidAmount: 12000,
    workerName: 'Layla Jones',
    workerNameAr: 'ليلى جونز',
    workerNationality: 'Kenya',
    workerNationalityAr: 'كينيا',
  },
  {
    id: '6',
    contractId: 17044,
    contractNumber: 761,
    branchName: 'Sigma Competences Recruitment Office',
    branchNameAr: 'سيقما الكفاءات للإستقدام',
    customerName: 'Abdulrahman Mohammed Al-Shammari',
    customerNameAr: 'عبدالرحمن محمد الشمري',
    customerPhone: '0567891234',
    customerId: '1087654321',
    customerUuid: 'jkl012-mno345',
    signDate: '2026-01-05',
    startDate: '2026-01-08',
    endDate: '2026-02-08',
    remainingDays: 15,
    status: 'valid',
    totalAmount: 16000,
    paidAmount: 16000,
    workerName: 'Maria Lopez',
    workerNameAr: 'ماريا لوبيز',
    workerNationality: 'Philippines',
    workerNationalityAr: 'الفلبين',
  },
  {
    id: '7',
    contractId: 17018,
    contractNumber: 760,
    branchName: 'SIGMA Branch',
    branchNameAr: 'فرع سيقما',
    customerName: 'Noura Ibrahim Al-Subaie',
    customerNameAr: 'نورة إبراهيم السبيعي',
    customerPhone: '0578901234',
    customerId: '1076543210',
    customerUuid: 'pqr678-stu901',
    signDate: '2025-10-20',
    startDate: '2025-10-25',
    endDate: '2026-01-25',
    remainingDays: 1,
    status: 'expiring-soon',
    totalAmount: 13500,
    paidAmount: 13500,
    workerName: 'Jane Doe',
    workerNameAr: 'جين دو',
    workerNationality: 'Indonesia',
    workerNationalityAr: 'إندونيسيا',
  },
  {
    id: '8',
    contractId: 16878,
    contractNumber: 759,
    branchName: 'Sigma Competences Recruitment Office',
    branchNameAr: 'سيقما الكفاءات للإستقدام',
    customerName: 'Khalid Abdullah Al-Dosari',
    customerNameAr: 'خالد عبدالله الدوسري',
    customerPhone: '0589012345',
    customerId: '1065432109',
    customerUuid: 'vwx234-yza567',
    signDate: '2025-09-10',
    startDate: '2025-09-15',
    endDate: '2025-12-15',
    remainingDays: -40,
    status: 'expired',
    totalAmount: 17500,
    paidAmount: 14000,
    workerName: 'Anna Cruz',
    workerNameAr: 'آنا كروز',
    workerNationality: 'Philippines',
    workerNationalityAr: 'الفلبين',
  },
  {
    id: '9',
    contractId: 16842,
    contractNumber: 758,
    branchName: 'Sigma Competences Recruitment Office',
    branchNameAr: 'سيقما الكفاءات للإستقدام',
    customerName: 'Hind Salman Al-Omari',
    customerNameAr: 'هند سلمان العمري',
    customerPhone: '0590123456',
    customerId: '1054321098',
    customerUuid: 'bcd890-efg123',
    signDate: '2026-01-02',
    startDate: '2026-01-05',
    endDate: '2026-04-05',
    remainingDays: 71,
    status: 'valid',
    totalAmount: 22000,
    paidAmount: 22000,
    workerName: 'Lisa Rivera',
    workerNameAr: 'ليزا ريفيرا',
    workerNationality: 'Philippines',
    workerNationalityAr: 'الفلبين',
  },
  {
    id: '10',
    contractId: 16761,
    contractNumber: 757,
    branchName: 'SIGMA Branch',
    branchNameAr: 'فرع سيقما',
    customerName: 'Ahmed Ali Al-Zahrani',
    customerNameAr: 'أحمد علي الزهراني',
    customerPhone: '0512345678',
    customerId: '1043210987',
    customerUuid: 'hij456-klm789',
    signDate: '2025-12-20',
    startDate: '2025-12-25',
    endDate: '2026-01-30',
    remainingDays: 6,
    status: 'expiring-soon',
    totalAmount: 11000,
    paidAmount: 11000,
    workerName: 'Susan Lim',
    workerNameAr: 'سوزان ليم',
    workerNationality: 'Indonesia',
    workerNationalityAr: 'إندونيسيا',
  },
];

export default function CollectionRenewalPage() {
  const language = useAuthStore((state) => state.language);
  const isRTL = language === 'ar';

  const contracts = useMemo(() => generateMockContracts(), []);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedContract, setSelectedContract] = useState<RentalContract | null>(null);
  const [viewMode, setViewMode] = useState<string>('cards');

  // Calculate stats
  const stats: ContractStats = useMemo(() => {
    const valid = contracts.filter((c) => c.status === 'valid').length;
    const expiringSoon = contracts.filter((c) => c.status === 'expiring-soon').length;
    const expired = contracts.filter((c) => c.status === 'expired').length;
    const totalPaid = contracts.reduce((sum, c) => sum + c.paidAmount, 0);
    const totalAmount = contracts.reduce((sum, c) => sum + c.totalAmount, 0);

    return {
      total: contracts.length,
      valid,
      expiringSoon,
      expired,
      collectionRate: totalAmount > 0 ? Math.round((totalPaid / totalAmount) * 100) : 0,
    };
  }, [contracts]);

  // Filter contracts
  const filteredContracts = useMemo(() => {
    return contracts.filter((contract) => {
      const customerName = isRTL ? contract.customerNameAr : contract.customerName;
      const matchesSearch =
        customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.contractNumber.toString().includes(searchTerm) ||
        contract.customerPhone.includes(searchTerm) ||
        contract.customerId.includes(searchTerm);

      const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [contracts, searchTerm, statusFilter, isRTL]);

  // Paginate contracts
  const paginatedContracts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredContracts.slice(startIndex, startIndex + pageSize);
  }, [filteredContracts, currentPage, pageSize]);

  const getStatusConfig = (status: string, remainingDays: number) => {
    switch (status) {
      case 'valid':
        return {
          color: 'success',
          icon: <CheckCircleOutlined />,
          label: isRTL ? 'ساري' : 'Valid',
          description: isRTL
            ? `ينتهي بعد ${remainingDays} يوم`
            : `Expires in ${remainingDays} days`,
          badgeStatus: 'success' as const,
        };
      case 'expiring-soon':
        return {
          color: 'warning',
          icon: <ExclamationCircleOutlined />,
          label: isRTL ? 'ينتهي قريباً' : 'Expiring Soon',
          description: isRTL
            ? `ينتهي بعد ${remainingDays} يوم`
            : `Expires in ${remainingDays} days`,
          badgeStatus: 'warning' as const,
        };
      case 'expired':
        return {
          color: 'error',
          icon: <CloseCircleOutlined />,
          label: isRTL ? 'منتهي' : 'Expired',
          description: isRTL
            ? `انتهى منذ ${Math.abs(remainingDays)} يوم`
            : `Expired ${Math.abs(remainingDays)} days ago`,
          badgeStatus: 'error' as const,
        };
      default:
        return {
          color: 'default',
          icon: <ClockCircleOutlined />,
          label: isRTL ? 'غير معروف' : 'Unknown',
          description: '',
          badgeStatus: 'default' as const,
        };
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const formatFullDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat(isRTL ? 'ar-SA' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const handleExportExcel = () => {
    console.log('Exporting to Excel...');
  };

  const handleRenewContract = (contract: RentalContract) => {
    console.log('Renewing contract:', contract.contractNumber);
  };

  const handleViewContract = (contract: RentalContract) => {
    setSelectedContract(contract);
  };

  return (
    <div className={styles.container} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerTitle}>
            <div className={styles.headerIcon}>
              <SyncOutlined />
            </div>
            <div>
              <h1>{isRTL ? 'التحصيل والتجديد' : 'Collection & Renewal'}</h1>
              <p className={styles.headerSubtitle}>
                {isRTL
                  ? 'إدارة تحصيل وتجديد عقود التشغيل'
                  : 'Manage operation contract collection and renewals'}
              </p>
            </div>
          </div>
          <div className={styles.headerActions}>
            <Button
              icon={<FileExcelOutlined />}
              className={styles.secondaryBtn}
              onClick={handleExportExcel}
            >
              {isRTL ? 'تصدير Excel' : 'Export Excel'}
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} className={styles.statsRow}>
        <Col xs={12} sm={6}>
          <Card
            className={`${styles.statCard} ${styles.totalCard}`}
            onClick={() => setStatusFilter('all')}
          >
            <div className={styles.statContent}>
              <div className={styles.statIcon}>
                <FileTextOutlined />
              </div>
              <div className={styles.statInfo}>
                <Statistic
                  title={isRTL ? 'إجمالي العقود' : 'Total Contracts'}
                  value={stats.total}
                  valueStyle={{ color: '#003366', fontWeight: 700 }}
                />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card
            className={`${styles.statCard} ${styles.validCard}`}
            onClick={() => setStatusFilter('valid')}
          >
            <div className={styles.statContent}>
              <div className={`${styles.statIcon} ${styles.successIcon}`}>
                <CheckCircleOutlined />
              </div>
              <div className={styles.statInfo}>
                <Statistic
                  title={isRTL ? 'عقود سارية' : 'Valid Contracts'}
                  value={stats.valid}
                  valueStyle={{ color: '#52c41a', fontWeight: 700 }}
                />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card
            className={`${styles.statCard} ${styles.warningCard}`}
            onClick={() => setStatusFilter('expiring-soon')}
          >
            <div className={styles.statContent}>
              <div className={`${styles.statIcon} ${styles.warningIcon}`}>
                <WarningOutlined />
              </div>
              <div className={styles.statInfo}>
                <Statistic
                  title={isRTL ? 'تنتهي قريباً' : 'Expiring Soon'}
                  value={stats.expiringSoon}
                  valueStyle={{ color: '#faad14', fontWeight: 700 }}
                />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card
            className={`${styles.statCard} ${styles.expiredCard}`}
            onClick={() => setStatusFilter('expired')}
          >
            <div className={styles.statContent}>
              <div className={`${styles.statIcon} ${styles.errorIcon}`}>
                <CloseCircleOutlined />
              </div>
              <div className={styles.statInfo}>
                <Statistic
                  title={isRTL ? 'عقود منتهية' : 'Expired Contracts'}
                  value={stats.expired}
                  valueStyle={{ color: '#ff4d4f', fontWeight: 700 }}
                />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Collection Rate Card */}
      <Card className={styles.collectionCard}>
        <Row gutter={[24, 16]} align="middle">
          <Col xs={24} md={8}>
            <div className={styles.collectionInfo}>
              <RiseOutlined className={styles.collectionIcon} />
              <div>
                <h3>{isRTL ? 'معدل التحصيل' : 'Collection Rate'}</h3>
                <p>
                  {isRTL
                    ? 'نسبة المبالغ المحصلة من إجمالي العقود'
                    : 'Percentage of collected amounts from total contracts'}
                </p>
              </div>
            </div>
          </Col>
          <Col xs={24} md={16}>
            <div className={styles.progressWrapper}>
              <Progress
                percent={stats.collectionRate}
                strokeColor={{
                  '0%': '#003366',
                  '100%': '#52c41a',
                }}
                strokeWidth={20}
                format={(percent) => <span className={styles.progressText}>{percent}%</span>}
              />
            </div>
          </Col>
        </Row>
      </Card>

      {/* Filter Section */}
      <Card className={styles.filterCard}>
        <div className={styles.filterContent}>
          <div className={styles.filterLeft}>
            <Input
              placeholder={
                isRTL
                  ? 'البحث بالاسم أو رقم العقد أو الهاتف...'
                  : 'Search by name, contract number, or phone...'
              }
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
              allowClear
            />
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              className={styles.statusSelect}
              options={[
                { value: 'all', label: isRTL ? 'جميع الحالات' : 'All Statuses' },
                { value: 'valid', label: isRTL ? 'عقود سارية' : 'Valid Contracts' },
                { value: 'expiring-soon', label: isRTL ? 'تنتهي قريباً' : 'Expiring Soon' },
                { value: 'expired', label: isRTL ? 'عقود منتهية' : 'Expired Contracts' },
              ]}
            />
          </div>
          <div className={styles.filterRight}>
            <Segmented
              value={viewMode}
              onChange={(value) => setViewMode(value as string)}
              options={[
                {
                  value: 'cards',
                  icon: <AppstoreOutlined />,
                  label: isRTL ? 'بطاقات' : 'Cards',
                },
                {
                  value: 'compact',
                  icon: <UnorderedListOutlined />,
                  label: isRTL ? 'مضغوط' : 'Compact',
                },
              ]}
            />
            <span className={styles.resultCount}>
              {isRTL
                ? `عرض ${paginatedContracts.length} من ${filteredContracts.length}`
                : `Showing ${paginatedContracts.length} of ${filteredContracts.length}`}
            </span>
          </div>
        </div>
      </Card>

      {/* Contracts Grid/List */}
      {paginatedContracts.length === 0 ? (
        <Card className={styles.emptyCard}>
          <Empty description={isRTL ? 'لا توجد عقود مطابقة' : 'No matching contracts'} />
        </Card>
      ) : viewMode === 'cards' ? (
        <div className={styles.contractsGrid}>
          {paginatedContracts.map((contract) => {
            const statusConfig = getStatusConfig(contract.status, contract.remainingDays);
            return (
              <Card
                key={contract.id}
                className={`${styles.contractCard} ${styles[contract.status]}`}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.contractNumberSection}>
                    <span className={styles.contractNumber}>{contract.contractNumber}</span>
                    <Badge status={statusConfig.badgeStatus} text={statusConfig.label} />
                  </div>
                  <Tag
                    color={statusConfig.color}
                    icon={statusConfig.icon}
                    className={styles.statusTag}
                  >
                    {statusConfig.description}
                  </Tag>
                </div>

                <Divider className={styles.cardDivider} />

                <div className={styles.cardBody}>
                  {/* Customer Info */}
                  <div className={styles.customerSection}>
                    <Avatar size={48} icon={<UserOutlined />} className={styles.customerAvatar} />
                    <div className={styles.customerInfo}>
                      <h4 className={styles.customerName}>
                        {isRTL ? contract.customerNameAr : contract.customerName}
                      </h4>
                      <div className={styles.customerMeta}>
                        <Tooltip title={isRTL ? 'واتساب' : 'WhatsApp'}>
                          <a
                            href={`https://wa.me/966${contract.customerPhone.substring(1)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.whatsappLink}
                          >
                            <WhatsAppOutlined /> {contract.customerPhone}
                          </a>
                        </Tooltip>
                        <span className={styles.customerId}>
                          <IdcardOutlined /> {contract.customerId}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contract Dates */}
                  <div className={styles.datesGrid}>
                    <div className={styles.dateItem}>
                      <CalendarOutlined className={styles.dateIcon} />
                      <div>
                        <span className={styles.dateLabel}>
                          {isRTL ? 'تاريخ التوقيع' : 'Sign Date'}
                        </span>
                        <span className={styles.dateValue}>{formatDate(contract.signDate)}</span>
                      </div>
                    </div>
                    <div className={styles.dateItem}>
                      <FieldTimeOutlined className={styles.dateIcon} />
                      <div>
                        <span className={styles.dateLabel}>
                          {isRTL ? 'تاريخ البداية' : 'Start Date'}
                        </span>
                        <span className={styles.dateValue}>{formatDate(contract.startDate)}</span>
                      </div>
                    </div>
                    <div className={styles.dateItem}>
                      <ClockCircleOutlined className={styles.dateIcon} />
                      <div>
                        <span className={styles.dateLabel}>
                          {isRTL ? 'تاريخ الانتهاء' : 'End Date'}
                        </span>
                        <span className={styles.dateValue}>{formatDate(contract.endDate)}</span>
                      </div>
                    </div>
                    <div className={styles.dateItem}>
                      <HistoryOutlined className={styles.dateIcon} />
                      <div>
                        <span className={styles.dateLabel}>
                          {isRTL ? 'المدة المتبقية' : 'Remaining'}
                        </span>
                        <span className={`${styles.dateValue} ${styles[contract.status + 'Text']}`}>
                          {contract.remainingDays > 0
                            ? isRTL
                              ? `${contract.remainingDays} يوم`
                              : `${contract.remainingDays} days`
                            : isRTL
                              ? `${Math.abs(contract.remainingDays)} يوم مضت`
                              : `${Math.abs(contract.remainingDays)} days ago`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Branch */}
                  <div className={styles.branchInfo}>
                    <ShopOutlined />
                    <span>{isRTL ? contract.branchNameAr : contract.branchName}</span>
                  </div>
                </div>

                <Divider className={styles.cardDivider} />

                <div className={styles.cardFooter}>
                  <Button
                    type="text"
                    icon={<EyeOutlined />}
                    onClick={() => handleViewContract(contract)}
                  >
                    {isRTL ? 'عرض' : 'View'}
                  </Button>
                  {(contract.status === 'expired' || contract.status === 'expiring-soon') && (
                    <Button
                      type="primary"
                      icon={<ReloadOutlined />}
                      onClick={() => handleRenewContract(contract)}
                      className={styles.renewBtn}
                    >
                      {isRTL ? 'تجديد' : 'Renew'}
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className={styles.compactListCard}>
          {paginatedContracts.map((contract, index) => {
            const statusConfig = getStatusConfig(contract.status, contract.remainingDays);
            return (
              <div
                key={contract.id}
                className={`${styles.compactRow} ${index < paginatedContracts.length - 1 ? styles.withBorder : ''}`}
              >
                <div className={styles.compactLeft}>
                  <span className={styles.compactNumber}>{contract.contractNumber}</span>
                  <div className={styles.compactInfo}>
                    <span className={styles.compactName}>
                      {isRTL ? contract.customerNameAr : contract.customerName}
                    </span>
                    <span className={styles.compactPhone}>{contract.customerPhone}</span>
                  </div>
                </div>
                <div className={styles.compactCenter}>
                  <span>{formatDate(contract.startDate)}</span>
                  <span className={styles.dateSeparator}>→</span>
                  <span>{formatDate(contract.endDate)}</span>
                </div>
                <div className={styles.compactRight}>
                  <Tag color={statusConfig.color}>{statusConfig.label}</Tag>
                  <Button
                    type="text"
                    icon={<EyeOutlined />}
                    onClick={() => handleViewContract(contract)}
                  />
                </div>
              </div>
            );
          })}
        </Card>
      )}

      {/* Pagination */}
      <div className={styles.paginationWrapper}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredContracts.length}
          onChange={(page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          }}
          showSizeChanger
          showQuickJumper
          pageSizeOptions={['10', '15', '20', '24', '50', '100']}
          showTotal={(total, range) =>
            isRTL
              ? `${range[0]}-${range[1]} من ${total} عقد`
              : `${range[0]}-${range[1]} of ${total} contracts`
          }
        />
      </div>

      {/* Contract Details Modal */}
      <Modal
        title={
          <div className={styles.modalTitle}>
            <FileTextOutlined />
            <span>
              {isRTL ? 'تفاصيل العقد' : 'Contract Details'} #{selectedContract?.contractNumber}
            </span>
          </div>
        }
        open={!!selectedContract}
        onCancel={() => setSelectedContract(null)}
        footer={[
          <Button key="close" onClick={() => setSelectedContract(null)}>
            {isRTL ? 'إغلاق' : 'Close'}
          </Button>,
          selectedContract &&
            (selectedContract.status === 'expired' ||
              selectedContract.status === 'expiring-soon') && (
              <Button
                key="renew"
                type="primary"
                icon={<ReloadOutlined />}
                onClick={() => selectedContract && handleRenewContract(selectedContract)}
              >
                {isRTL ? 'تجديد العقد' : 'Renew Contract'}
              </Button>
            ),
        ]}
        width={700}
        className={styles.detailsModal}
      >
        {selectedContract && (
          <div className={styles.modalContent}>
            {/* Status Banner */}
            <div className={`${styles.statusBanner} ${styles[selectedContract.status]}`}>
              {getStatusConfig(selectedContract.status, selectedContract.remainingDays).icon}
              <span>
                {getStatusConfig(selectedContract.status, selectedContract.remainingDays).description}
              </span>
            </div>

            {/* Customer Section */}
            <div className={styles.detailSection}>
              <h4>
                <UserOutlined /> {isRTL ? 'معلومات العميل' : 'Customer Information'}
              </h4>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>{isRTL ? 'الاسم' : 'Name'}</span>
                  <span className={styles.detailValue}>
                    {isRTL ? selectedContract.customerNameAr : selectedContract.customerName}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>{isRTL ? 'الهاتف' : 'Phone'}</span>
                  <span className={styles.detailValue}>{selectedContract.customerPhone}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>{isRTL ? 'رقم الهوية' : 'ID Number'}</span>
                  <span className={styles.detailValue}>{selectedContract.customerId}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>{isRTL ? 'الفرع' : 'Branch'}</span>
                  <span className={styles.detailValue}>
                    {isRTL ? selectedContract.branchNameAr : selectedContract.branchName}
                  </span>
                </div>
              </div>
            </div>

            <Divider />

            {/* Contract Dates Section */}
            <div className={styles.detailSection}>
              <h4>
                <CalendarOutlined /> {isRTL ? 'تواريخ العقد' : 'Contract Dates'}
              </h4>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>{isRTL ? 'تاريخ التوقيع' : 'Sign Date'}</span>
                  <span className={styles.detailValue}>
                    {formatFullDate(selectedContract.signDate)}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>
                    {isRTL ? 'تاريخ البداية' : 'Start Date'}
                  </span>
                  <span className={styles.detailValue}>
                    {formatFullDate(selectedContract.startDate)}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>
                    {isRTL ? 'تاريخ الانتهاء' : 'End Date'}
                  </span>
                  <span className={styles.detailValue}>
                    {formatFullDate(selectedContract.endDate)}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>
                    {isRTL ? 'المدة المتبقية' : 'Remaining'}
                  </span>
                  <span
                    className={`${styles.detailValue} ${styles[selectedContract.status + 'Text']}`}
                  >
                    {selectedContract.remainingDays > 0
                      ? isRTL
                        ? `${selectedContract.remainingDays} يوم`
                        : `${selectedContract.remainingDays} days`
                      : isRTL
                        ? `انتهى منذ ${Math.abs(selectedContract.remainingDays)} يوم`
                        : `Expired ${Math.abs(selectedContract.remainingDays)} days ago`}
                  </span>
                </div>
              </div>
            </div>

            <Divider />

            {/* Financial Section */}
            <div className={styles.detailSection}>
              <h4>
                <RiseOutlined /> {isRTL ? 'المعلومات المالية' : 'Financial Information'}
              </h4>
              <div className={styles.financialInfo}>
                <div className={styles.amountCard}>
                  <span className={styles.amountLabel}>
                    {isRTL ? 'إجمالي العقد' : 'Total Amount'}
                  </span>
                  <span className={styles.amountValue}>
                    {selectedContract.totalAmount.toLocaleString()} {isRTL ? 'ريال' : 'SAR'}
                  </span>
                </div>
                <div className={styles.amountCard}>
                  <span className={styles.amountLabel}>{isRTL ? 'المبلغ المحصل' : 'Paid Amount'}</span>
                  <span className={styles.amountValue}>
                    {selectedContract.paidAmount.toLocaleString()} {isRTL ? 'ريال' : 'SAR'}
                  </span>
                </div>
                <div className={styles.amountCard}>
                  <span className={styles.amountLabel}>{isRTL ? 'المتبقي' : 'Remaining'}</span>
                  <span
                    className={`${styles.amountValue} ${selectedContract.totalAmount - selectedContract.paidAmount > 0 ? styles.errorText : styles.successText}`}
                  >
                    {(selectedContract.totalAmount - selectedContract.paidAmount).toLocaleString()}{' '}
                    {isRTL ? 'ريال' : 'SAR'}
                  </span>
                </div>
              </div>
              <Progress
                percent={Math.round(
                  (selectedContract.paidAmount / selectedContract.totalAmount) * 100
                )}
                status={
                  selectedContract.paidAmount >= selectedContract.totalAmount ? 'success' : 'active'
                }
                strokeColor="#52c41a"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
