'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
  Badge,
  Dropdown,
  DatePicker,
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
  DollarOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  MoreOutlined,
  FileExcelOutlined,
  PhoneOutlined,
  IdcardOutlined,
  SafetyOutlined,
  UserAddOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  StopOutlined,
  WarningOutlined,
} from '@ant-design/icons';

import { useAuthStore } from '@/store/authStore';
import styles from './Cancellation.module.css';

const { RangePicker } = DatePicker;

interface ContractCancellation {
  id: string;
  contractNumber: string;
  customerName: string;
  customerNameAr: string;
  customerPhone: string;
  customerId: string;
  cancellationReason: string;
  cancellationReasonAr: string;
  status: 'pending' | 'completed' | 'appealed';
  cancellationFee: number;
  refundAmount: number;
  netAmount: number;
  cancellationDate: string;
  applicantName: string;
  applicantNameAr: string;
  visaNumber: string;
  hasVisa: boolean;
  nationality: string;
  nationalityAr: string;
  profession: string;
  professionAr: string;
  agentName: string;
  agentNameAr: string;
  contractStartDate: string;
  contractEndDate: string;
  daysActive: number;
  createdAt: string;
  createdBy: string;
  createdByAr: string;
  branch: string;
  branchAr: string;
}

// Mock data
const mockCancellations: ContractCancellation[] = Array.from({ length: 20 }, (_, i) => {
  const cancellationFee = Math.floor(Math.random() * 2000) + 500;
  const contractValue = Math.floor(Math.random() * 8000) + 3000;
  const refundAmount = contractValue - cancellationFee;

  const reasons = [
    'Cancelled during grace period',
    'Employee not responsive',
    'Contract change request',
    'Backout twice',
    'Customer cancelled by mistake',
    'Property damage',
    'Contract terms violation',
  ];

  const reasonsAr = [
    'ملغي من قبل العميل في فترة السماح',
    'تم الغاء العقد في فترة السماح',
    'تم الغاء العقد نظرا للباك اوات',
    'العامله مو راضيه تكمل الاجراءات',
    'تم الغاء العقد نظرا لعدم تجاوب العامله',
    'تم الغاء العقد في فترة السماح نظرا لوجود ملاحضه على العامله',
    'تغيير العقد',
  ];

  return {
    id: `cancellation-${i + 1}`,
    contractNumber: `${6700 + i}`,
    customerName: [
      'Nuaf Abdullah Al-Khamash',
      'Mohammed Al-Ali',
      'Malhah Al-Rashidi',
      'Hamad Al-Khatani',
      'Abdullah Al-Dosari',
    ][i % 5],
    customerNameAr: [
      'نواف عبدالله الخماش',
      'محمد العلي',
      'ملحة الرشيدي',
      'حمد الخطاني',
      'عبدالله الدوسري',
    ][i % 5],
    customerPhone: `05${Math.floor(Math.random() * 9)}${String(Math.floor(Math.random() * 10000000)).padStart(7, '0')}`,
    customerId: `10${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
    cancellationReason: reasons[i % reasons.length],
    cancellationReasonAr: reasonsAr[i % reasonsAr.length],
    status: (['pending', 'completed', 'appealed'] as const)[i % 3],
    cancellationFee,
    refundAmount,
    netAmount: refundAmount - cancellationFee,
    cancellationDate: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
    applicantName: ['MD SHABAB ANWAR', 'HAIDER GHULAM', 'ALI SABAHAT', 'KIRSHAN SHAMOON'][i % 4],
    applicantNameAr: ['محمد شباب أنور', 'حيدر غلام', 'علي سباحات', 'كرشان شمعون'][i % 4],
    visaNumber: `19077${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`,
    hasVisa: Math.random() > 0.3,
    nationality: ['India', 'Pakistan', 'Bangladesh', 'Philippines'][i % 4],
    nationalityAr: ['الهند', 'باكستان', 'بنغلاديش', 'الفلبين'][i % 4],
    profession: ['Driver', 'Housemaid', 'Cook', 'Nurse'][i % 4],
    professionAr: ['سائق', 'خادمة منزلية', 'طباخ', 'ممرضة'][i % 4],
    agentName: ['M. T TRAVEL AGENCY', 'Pakistan Delegate', 'India Services'][i % 3],
    agentNameAr: ['وكالة إم تي للسفر', 'تفويض باكستان', 'خدمات الهند'][i % 3],
    contractStartDate: new Date(
      Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000
    ).toISOString(),
    contractEndDate: new Date(Date.now() + Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
    daysActive: Math.floor(Math.random() * 365) + 1,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: ['Muhannad Al-Muhdar', 'Abdulrahman Al-Sarihi', 'Sara Al-Zahrani'][i % 3],
    createdByAr: ['مهند المحضار', 'عبدالرحمن السريحي', 'سارة الزهراني'][i % 3],
    branch: 'Sigma Recruitment Office',
    branchAr: 'سيجما الكفاءات للاستقدام',
  };
});

export default function ContractCancellationPage() {
  const language = useAuthStore((state) => state.language);
  const [mounted, setMounted] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [reasonFilter, setReasonFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[any, any] | null>(null);
  const [selectedCancellation, setSelectedCancellation] = useState<ContractCancellation | null>(
    null
  );
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const t = {
    pageTitle: language === 'ar' ? 'إلغاء العقود' : 'Contract Cancellations',
    pageSubtitle:
      language === 'ar'
        ? 'إدارة إلغاءات العقود والاسترجاعات'
        : 'Manage contract cancellations and refunds',
    addCancellation: language === 'ar' ? 'إلغاء عقد' : 'Cancel Contract',
    exportExcel: language === 'ar' ? 'تصدير إكسل' : 'Export Excel',
    print: language === 'ar' ? 'طباعة' : 'Print',
    search:
      language === 'ar'
        ? 'بحث برقم العقد أو اسم العميل...'
        : 'Search by contract number or customer name...',
    allStatuses: language === 'ar' ? 'جميع الحالات' : 'All Statuses',
    pending: language === 'ar' ? 'معلق' : 'Pending',
    completed: language === 'ar' ? 'مكتمل' : 'Completed',
    appealed: language === 'ar' ? 'معترض' : 'Appealed',
    allReasons: language === 'ar' ? 'جميع الأسباب' : 'All Reasons',
    dateRange: language === 'ar' ? 'نطاق التاريخ' : 'Date Range',
    startDate: language === 'ar' ? 'تاريخ البداية' : 'Start Date',
    endDate: language === 'ar' ? 'تاريخ النهاية' : 'End Date',
    totalCancellations: language === 'ar' ? 'إجمالي الإلغاءات' : 'Total Cancellations',
    pendingCount: language === 'ar' ? 'معلق' : 'Pending',
    completedCount: language === 'ar' ? 'مكتمل' : 'Completed',
    totalRefunds: language === 'ar' ? 'إجمالي الاسترجاعات' : 'Total Refunds',
    contractNumber: language === 'ar' ? 'رقم العقد' : 'Contract Number',
    customer: language === 'ar' ? 'العميل' : 'Customer',
    applicant: language === 'ar' ? 'المتقدم' : 'Applicant',
    status: language === 'ar' ? 'الحالة' : 'Status',
    cancellationFee: language === 'ar' ? 'رسم الإلغاء' : 'Cancellation Fee',
    refund: language === 'ar' ? 'الاسترجاع' : 'Refund',
    netAmount: language === 'ar' ? 'المبلغ الصافي' : 'Net Amount',
    cancellationDate: language === 'ar' ? 'تاريخ الإلغاء' : 'Cancellation Date',
    daysActive: language === 'ar' ? 'أيام النشاط' : 'Days Active',
    nationality: language === 'ar' ? 'الجنسية' : 'Nationality',
    profession: language === 'ar' ? 'المهنة' : 'Profession',
    viewDetails: language === 'ar' ? 'عرض التفاصيل' : 'View Details',
    edit: language === 'ar' ? 'تعديل' : 'Edit',
    delete: language === 'ar' ? 'حذف' : 'Delete',
    noResults: language === 'ar' ? 'لا توجد نتائج' : 'No results found',
    phone: language === 'ar' ? 'الهاتف' : 'Phone',
    visa: language === 'ar' ? 'التأشيرة' : 'Visa',
    agent: language === 'ar' ? 'الوكيل' : 'Agent',
    cancellationInfo: language === 'ar' ? 'معلومات الإلغاء' : 'Cancellation Information',
    reason: language === 'ar' ? 'السبب' : 'Reason',
    createdBy: language === 'ar' ? 'أنشأ بواسطة' : 'Created By',
    createdAt: language === 'ar' ? 'تاريخ الإنشاء' : 'Created At',
    daysAgo: language === 'ar' ? 'يوم مضى' : 'days ago',
    processCancellation: language === 'ar' ? 'معالجة الإلغاء' : 'Process Cancellation',
    refresh: language === 'ar' ? 'تحديث' : 'Refresh',
    contractStartDate: language === 'ar' ? 'تاريخ بداية العقد' : 'Contract Start Date',
    contractEndDate: language === 'ar' ? 'تاريخ نهاية العقد' : 'Contract End Date',
  };

  // Filter cancellations
  const filteredCancellations = useMemo(() => {
    return mockCancellations.filter((cancellation) => {
      const searchLower = searchText.toLowerCase();
      const matchesSearch =
        !searchText ||
        cancellation.contractNumber.toLowerCase().includes(searchLower) ||
        cancellation.customerName.toLowerCase().includes(searchLower) ||
        cancellation.customerNameAr.includes(searchText) ||
        cancellation.applicantName.toLowerCase().includes(searchLower);

      const matchesStatus = statusFilter === 'all' || cancellation.status === statusFilter;
      const matchesReason =
        reasonFilter === 'all' || cancellation.cancellationReason === reasonFilter;

      const matchesDate =
        !dateRange ||
        (new Date(cancellation.cancellationDate) >= dateRange[0].toDate() &&
          new Date(cancellation.cancellationDate) <= dateRange[1].toDate());

      return matchesSearch && matchesStatus && matchesReason && matchesDate;
    });
  }, [searchText, statusFilter, reasonFilter, dateRange]);

  // Statistics
  const stats = useMemo(
    () => ({
      total: mockCancellations.length,
      pending: mockCancellations.filter((c) => c.status === 'pending').length,
      completed: mockCancellations.filter((c) => c.status === 'completed').length,
      totalRefunds: mockCancellations.reduce((sum, c) => sum + c.refundAmount, 0),
    }),
    []
  );

  const uniqueReasons = useMemo(() => {
    return Array.from(new Set(mockCancellations.map((c) => c.cancellationReason)));
  }, []);

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
      pending: {
        color: 'warning',
        label: t.pending,
        icon: <ClockCircleOutlined />,
      },
      completed: { color: 'success', label: t.completed, icon: <CheckCircleOutlined /> },
      appealed: { color: 'error', label: t.appealed, icon: <ExclamationCircleOutlined /> },
    };
    return (
      config[status] || {
        color: 'default',
        label: status,
        icon: <ClockCircleOutlined />,
      }
    );
  };

  const handleViewDetails = (cancellation: ContractCancellation) => {
    setSelectedCancellation(cancellation);
    setShowDetailsModal(true);
  };

  const getMenuItems = (cancellation: ContractCancellation): MenuProps['items'] => [
    {
      key: 'view',
      label: t.viewDetails,
      icon: <EyeOutlined />,
      onClick: () => handleViewDetails(cancellation),
    },
    {
      key: 'edit',
      label: t.edit,
      icon: <EditOutlined />,
    },
    {
      key: 'print',
      label: t.print,
      icon: <PrinterOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: 'delete',
      label: t.delete,
      icon: <DeleteOutlined />,
      danger: true,
    },
  ];

  const renderCancellationCard = (cancellation: ContractCancellation) => {
    const statusConfig = getStatusConfig(cancellation.status);

    return (
      <Col xs={24} key={cancellation.id}>
        <Card className={styles.cancellationCard} hoverable>
          <div className={styles.cardContent}>
            {/* Left Section - Contract & Customer Info */}
            <div className={styles.cardLeft}>
              <div className={styles.cardHeader}>
                <div className={styles.contractNumber}>
                  <FileTextOutlined className={styles.contractIcon} />
                  <span>#{cancellation.contractNumber}</span>
                </div>
                <Dropdown menu={{ items: getMenuItems(cancellation) }} trigger={['click']}>
                  <Button type="text" icon={<MoreOutlined />} className={styles.moreBtn} />
                </Dropdown>
              </div>

              <div className={styles.statusSection}>
                <Badge status={statusConfig.color as any} text={statusConfig.label} />
                <Tag color="volcano" icon={<StopOutlined />}>
                  {cancellation.daysActive} {t.daysActive}
                </Tag>
              </div>

              {/* Customer Info */}
              <div className={styles.customerSection}>
                <Avatar size={44} icon={<UserOutlined />} className={styles.customerAvatar} />
                <div className={styles.customerDetails}>
                  <span className={styles.customerName}>
                    {language === 'ar' ? cancellation.customerNameAr : cancellation.customerName}
                  </span>
                  <div className={styles.customerMeta}>
                    <PhoneOutlined />
                    <span dir="ltr">{cancellation.customerPhone}</span>
                    <IdcardOutlined style={{ marginInlineStart: 12 }} />
                    <span dir="ltr">{cancellation.customerId}</span>
                  </div>
                </div>
              </div>

              {/* Applicant & Visa Info */}
              <div className={styles.infoSection}>
                <div className={styles.infoItem}>
                  <SafetyOutlined className={styles.infoIcon} />
                  <div className={styles.infoText}>
                    <span className={styles.infoLabel}>{t.visa}</span>
                    <span className={styles.infoValue}>
                      {cancellation.hasVisa ? cancellation.visaNumber : 'N/A'}
                    </span>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <UserAddOutlined className={styles.infoIcon} />
                  <div className={styles.infoText}>
                    <span className={styles.infoLabel}>{t.applicant}</span>
                    <span className={styles.infoValue}>
                      {language === 'ar'
                        ? cancellation.applicantNameAr
                        : cancellation.applicantName}
                    </span>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <EnvironmentOutlined className={styles.infoIcon} />
                  <div className={styles.infoText}>
                    <span className={styles.infoLabel}>{t.nationality}</span>
                    <span className={styles.infoValue}>
                      {language === 'ar' ? cancellation.nationalityAr : cancellation.nationality}
                    </span>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <TeamOutlined className={styles.infoIcon} />
                  <div className={styles.infoText}>
                    <span className={styles.infoLabel}>{t.profession}</span>
                    <span className={styles.infoValue}>
                      {language === 'ar' ? cancellation.professionAr : cancellation.profession}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Section - Financial Details */}
            <div className={styles.cardMiddle}>
              <div className={styles.financialSection}>
                <div className={styles.financialItem}>
                  <span className={styles.financialLabel}>{t.cancellationFee}</span>
                  <span className={styles.financialValue} style={{ color: '#ff4d4f' }}>
                    {formatCurrency(cancellation.cancellationFee)}
                  </span>
                </div>
                <div className={styles.financialItem}>
                  <span className={styles.financialLabel}>{t.refund}</span>
                  <span className={styles.financialValue} style={{ color: '#52c41a' }}>
                    {formatCurrency(cancellation.refundAmount)}
                  </span>
                </div>
                <div className={styles.financialItem}>
                  <span className={styles.financialLabel}>{t.netAmount}</span>
                  <span className={styles.financialValue} style={{ color: '#1890ff' }}>
                    {formatCurrency(cancellation.netAmount)}
                  </span>
                </div>
              </div>

              {/* Dates */}
              <div className={styles.datesSection}>
                <div className={styles.dateItem}>
                  <span className={styles.dateLabel}>{t.contractStartDate}</span>
                  <span className={styles.dateValue}>
                    {formatDate(cancellation.contractStartDate)}
                  </span>
                </div>
                <div className={styles.dateItem}>
                  <span className={styles.dateLabel}>{t.cancellationDate}</span>
                  <span className={styles.dateValue}>
                    {formatDate(cancellation.cancellationDate)}
                  </span>
                </div>
              </div>

              <Button
                type="primary"
                block
                icon={<EyeOutlined />}
                className={styles.viewBtn}
                onClick={() => handleViewDetails(cancellation)}
              >
                {t.viewDetails}
              </Button>
            </div>

            {/* Right Section - Cancellation Reason */}
            <div className={styles.cardRight}>
              <div className={styles.reasonHeader}>
                <StopOutlined className={styles.reasonIcon} />
                <span className={styles.reasonTitle}>{t.cancellationInfo}</span>
              </div>

              <div className={styles.reasonContent}>
                <div className={styles.reasonSection}>
                  <span className={styles.reasonLabel}>{t.reason}</span>
                  <p className={styles.reasonText}>
                    {language === 'ar'
                      ? cancellation.cancellationReasonAr
                      : cancellation.cancellationReason}
                  </p>
                </div>
              </div>

              <div className={styles.agentInfo}>
                <TeamOutlined className={styles.agentIcon} />
                <div>
                  <span className={styles.agentLabel}>{t.agent}</span>
                  <span className={styles.agentValue}>
                    {language === 'ar' ? cancellation.agentNameAr : cancellation.agentName}
                  </span>
                </div>
              </div>

              <div className={styles.createdInfo}>
                <div className={styles.createdItem}>
                  <span className={styles.createdLabel}>{t.createdBy}</span>
                  <span className={styles.createdValue}>
                    {language === 'ar' ? cancellation.createdByAr : cancellation.createdBy}
                  </span>
                </div>
                <div className={styles.createdItem}>
                  <span className={styles.createdLabel}>{t.createdAt}</span>
                  <span className={styles.createdValue}>{formatDate(cancellation.createdAt)}</span>
                </div>
              </div>

              <Button
                type="default"
                block
                icon={<WarningOutlined />}
                className={styles.processBtn}
                onClick={() => handleViewDetails(cancellation)}
              >
                {t.processCancellation}
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

  return (
    <div className={styles.cancellationPage}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerTitle}>
            <StopOutlined className={styles.headerIcon} />
            <div>
              <h1>{t.pageTitle}</h1>
              <p className={styles.headerSubtitle}>{t.pageSubtitle}</p>
            </div>
          </div>
          <div className={styles.headerActions}>
            <Button icon={<FileExcelOutlined />} className={styles.secondaryBtn}>
              {t.exportExcel}
            </Button>
            <Button icon={<PrinterOutlined />} className={styles.secondaryBtn}>
              {t.print}
            </Button>
            <Button type="primary" icon={<PlusOutlined />} className={styles.primaryBtn}>
              {t.addCancellation}
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className={styles.statisticsRow}>
        <Col xs={12} sm={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={t.totalCancellations}
              value={stats.total}
              prefix={<StopOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={t.pendingCount}
              value={stats.pending}
              prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={t.completedCount}
              value={stats.completed}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={t.totalRefunds}
              value={stats.totalRefunds}
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
                { value: 'pending', label: t.pending },
                { value: 'completed', label: t.completed },
                { value: 'appealed', label: t.appealed },
              ]}
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              value={reasonFilter}
              onChange={setReasonFilter}
              style={{ width: '100%' }}
              size="large"
              options={[
                { value: 'all', label: t.allReasons },
                ...uniqueReasons.map((reason) => ({
                  value: reason,
                  label: reason,
                })),
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
            ? `عرض ${filteredCancellations.length} من ${mockCancellations.length} إلغاء`
            : `Showing ${filteredCancellations.length} of ${mockCancellations.length} cancellations`}
        </span>
      </div>

      {/* Cancellations Grid */}
      {filteredCancellations.length > 0 ? (
        <Row gutter={[16, 16]} className={styles.cancellationsGrid}>
          {filteredCancellations.map(renderCancellationCard)}
        </Row>
      ) : (
        <Card className={styles.emptyCard}>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t.noResults} />
        </Card>
      )}

      {/* Details Modal */}
      <Modal
        title={`${t.contractNumber}: #${selectedCancellation?.contractNumber}`}
        open={showDetailsModal}
        onCancel={() => {
          setShowDetailsModal(false);
          setSelectedCancellation(null);
        }}
        footer={
          <Button type="primary" onClick={() => setShowDetailsModal(false)}>
            {language === 'ar' ? 'إغلاق' : 'Close'}
          </Button>
        }
        width={750}
      >
        {selectedCancellation && (
          <div className={styles.detailsModal}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <div className={styles.modalSection}>
                  <h4>{t.customer}</h4>
                  <p className={styles.modalValue}>
                    {language === 'ar'
                      ? selectedCancellation.customerNameAr
                      : selectedCancellation.customerName}
                  </p>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.modalSection}>
                  <h4>{t.phone}</h4>
                  <p className={styles.modalValue} dir="ltr">
                    {selectedCancellation.customerPhone}
                  </p>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.modalSection}>
                  <h4>{t.visa}</h4>
                  <p className={styles.modalValue}>
                    {selectedCancellation.hasVisa ? selectedCancellation.visaNumber : 'N/A'}
                  </p>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.modalSection}>
                  <h4>{t.applicant}</h4>
                  <p className={styles.modalValue}>
                    {language === 'ar'
                      ? selectedCancellation.applicantNameAr
                      : selectedCancellation.applicantName}
                  </p>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.modalSection}>
                  <h4>{t.nationality}</h4>
                  <p className={styles.modalValue}>
                    {language === 'ar'
                      ? selectedCancellation.nationalityAr
                      : selectedCancellation.nationality}
                  </p>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.modalSection}>
                  <h4>{t.reason}</h4>
                  <p className={styles.modalValue}>
                    {language === 'ar'
                      ? selectedCancellation.cancellationReasonAr
                      : selectedCancellation.cancellationReason}
                  </p>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.modalSection}>
                  <h4>{t.status}</h4>
                  <p className={styles.modalValue}>
                    {getStatusConfig(selectedCancellation.status).label}
                  </p>
                </div>
              </Col>
              <Col span={8}>
                <div className={styles.modalSection}>
                  <h4>{t.cancellationFee}</h4>
                  <p className={styles.modalValue} style={{ color: '#ff4d4f' }}>
                    {formatCurrency(selectedCancellation.cancellationFee)}
                  </p>
                </div>
              </Col>
              <Col span={8}>
                <div className={styles.modalSection}>
                  <h4>{t.refund}</h4>
                  <p className={styles.modalValue} style={{ color: '#52c41a' }}>
                    {formatCurrency(selectedCancellation.refundAmount)}
                  </p>
                </div>
              </Col>
              <Col span={8}>
                <div className={styles.modalSection}>
                  <h4>{t.netAmount}</h4>
                  <p className={styles.modalValue} style={{ color: '#1890ff' }}>
                    {formatCurrency(selectedCancellation.netAmount)}
                  </p>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.modalSection}>
                  <h4>{t.contractStartDate}</h4>
                  <p className={styles.modalValue}>
                    {formatDate(selectedCancellation.contractStartDate)}
                  </p>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.modalSection}>
                  <h4>{t.cancellationDate}</h4>
                  <p className={styles.modalValue}>
                    {formatDate(selectedCancellation.cancellationDate)}
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
