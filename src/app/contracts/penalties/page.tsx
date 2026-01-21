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
  Progress,
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
  AlertOutlined,
  MoneyCollectOutlined,
} from '@ant-design/icons';

import { useAuthStore } from '@/store/authStore';
import styles from './Penalties.module.css';

const { RangePicker } = DatePicker;

interface ContractPenalty {
  id: string;
  contractNumber: string;
  customerName: string;
  customerNameAr: string;
  customerPhone: string;
  customerId: string;
  penaltyType: 'delay' | 'breach' | 'damage' | 'non-compliance';
  penaltyTypeAr: string;
  status: 'pending' | 'issued' | 'paid' | 'appealed' | 'waived';
  penaltyAmount: number;
  paidAmount: number;
  remainingAmount: number;
  penaltyDate: string;
  dueDate: string;
  description: string;
  descriptionAr: string;
  applicantName: string;
  applicantNameAr: string;
  visaNumber: string;
  nationality: string;
  nationalityAr: string;
  profession: string;
  professionAr: string;
  agentName: string;
  agentNameAr: string;
  reason: string;
  reasonAr: string;
  createdAt: string;
  createdBy: string;
  createdByAr: string;
  daysOverdue: number;
  branch: string;
  branchAr: string;
}

// Mock data
const mockPenalties: ContractPenalty[] = Array.from({ length: 25 }, (_, i) => {
  const penaltyAmount = Math.floor(Math.random() * 3000) + 500;
  const paidAmount = Math.random() > 0.5 ? Math.floor(Math.random() * penaltyAmount) : 0;

  return {
    id: `penalty-${i + 1}`,
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
    penaltyType: (['delay', 'breach', 'damage', 'non-compliance'] as const)[i % 4],
    penaltyTypeAr: ['تأخير', 'انتهاك', 'تلف', 'عدم الامتثال'][i % 4],
    status: (['pending', 'issued', 'paid', 'appealed', 'waived'] as const)[i % 5],
    penaltyAmount,
    paidAmount,
    remainingAmount: penaltyAmount - paidAmount,
    penaltyDate: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    description: `Penalty for ${['contract delay', 'terms breach', 'property damage', 'compliance violation'][i % 4]}`,
    descriptionAr: [
      'غرامة على تأخير العقد',
      'غرامة على انتهاك الشروط',
      'غرامة على تلف الممتلكات',
      'غرامة على انتهاك الامتثال',
    ][i % 4],
    applicantName: ['MD SHABAB ANWAR', 'HAIDER GHULAM', 'ALI SABAHAT', 'KIRSHAN SHAMOON'][i % 4],
    applicantNameAr: ['محمد شباب أنور', 'حيدر غلام', 'علي سباحات', 'كرشان شمعون'][i % 4],
    visaNumber: `19077${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`,
    nationality: ['India', 'Pakistan', 'Bangladesh', 'Philippines'][i % 4],
    nationalityAr: ['الهند', 'باكستان', 'بنغلاديش', 'الفلبين'][i % 4],
    profession: ['Driver', 'Housemaid', 'Cook', 'Nurse'][i % 4],
    professionAr: ['سائق', 'خادمة منزلية', 'طباخ', 'ممرضة'][i % 4],
    agentName: ['M. T TRAVEL AGENCY', 'Pakistan Delegate', 'India Services'][i % 3],
    agentNameAr: ['وكالة إم تي للسفر', 'تفويض باكستان', 'خدمات الهند'][i % 3],
    reason: [
      'Late contract submission',
      'Contract terms violation',
      'Property damage',
      'Non-compliance with agreement',
    ][i % 4],
    reasonAr: ['تأخر تقديم العقد', 'انتهاك شروط العقد', 'تلف الممتلكات', 'عدم الامتثال للاتفاقية'][
      i % 4
    ],
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: ['Muhannad Al-Muhdar', 'Abdulrahman Al-Sarihi', 'Sara Al-Zahrani'][i % 3],
    createdByAr: ['مهند المحضار', 'عبدالرحمن السريحي', 'سارة الزهراني'][i % 3],
    daysOverdue: Math.max(0, Math.floor(Math.random() * 60) - 30),
    branch: 'Sigma Recruitment Office',
    branchAr: 'سيجما الكفاءات للاستقدام',
  };
});

export default function ContractPenaltiesPage() {
  const language = useAuthStore((state) => state.language);
  const [mounted, setMounted] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [penaltyTypeFilter, setPenaltyTypeFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[any, any] | null>(null);
  const [selectedPenalty, setSelectedPenalty] = useState<ContractPenalty | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const t = {
    pageTitle: language === 'ar' ? 'غرامات العقود' : 'Contract Penalties',
    pageSubtitle:
      language === 'ar'
        ? 'إدارة غرامات العقود والعقوبات'
        : 'Manage contract penalties and sanctions',
    addPenalty: language === 'ar' ? 'إضافة غرامة' : 'Add Penalty',
    exportExcel: language === 'ar' ? 'تصدير إكسل' : 'Export Excel',
    print: language === 'ar' ? 'طباعة' : 'Print',
    search:
      language === 'ar'
        ? 'بحث برقم العقد أو اسم العميل...'
        : 'Search by contract number or customer name...',
    allStatuses: language === 'ar' ? 'جميع الحالات' : 'All Statuses',
    pending: language === 'ar' ? 'معلق' : 'Pending',
    issued: language === 'ar' ? 'صادر' : 'Issued',
    paid: language === 'ar' ? 'مدفوع' : 'Paid',
    appealed: language === 'ar' ? 'معترض' : 'Appealed',
    waived: language === 'ar' ? 'معفي' : 'Waived',
    allPenaltyTypes: language === 'ar' ? 'جميع الأنواع' : 'All Types',
    delay: language === 'ar' ? 'تأخير' : 'Delay',
    breach: language === 'ar' ? 'انتهاك' : 'Breach',
    damage: language === 'ar' ? 'تلف' : 'Damage',
    nonCompliance: language === 'ar' ? 'عدم الامتثال' : 'Non-Compliance',
    dateRange: language === 'ar' ? 'نطاق التاريخ' : 'Date Range',
    startDate: language === 'ar' ? 'تاريخ البداية' : 'Start Date',
    endDate: language === 'ar' ? 'تاريخ النهاية' : 'End Date',
    totalPenalties: language === 'ar' ? 'إجمالي الغرامات' : 'Total Penalties',
    pendingCount: language === 'ar' ? 'معلق' : 'Pending',
    paidCount: language === 'ar' ? 'مدفوع' : 'Paid',
    totalAmount: language === 'ar' ? 'إجمالي المبلغ' : 'Total Amount',
    contractNumber: language === 'ar' ? 'رقم العقد' : 'Contract Number',
    customer: language === 'ar' ? 'العميل' : 'Customer',
    applicant: language === 'ar' ? 'المتقدم' : 'Applicant',
    status: language === 'ar' ? 'الحالة' : 'Status',
    penaltyAmount: language === 'ar' ? 'مبلغ الغرامة' : 'Penalty Amount',
    remaining: language === 'ar' ? 'المتبقي' : 'Remaining',
    penaltyDate: language === 'ar' ? 'تاريخ الغرامة' : 'Penalty Date',
    dueDate: language === 'ar' ? 'تاريخ الاستحقاق' : 'Due Date',
    daysOverdue: language === 'ar' ? 'أيام التأخير' : 'Days Overdue',
    nationality: language === 'ar' ? 'الجنسية' : 'Nationality',
    profession: language === 'ar' ? 'المهنة' : 'Profession',
    viewDetails: language === 'ar' ? 'عرض التفاصيل' : 'View Details',
    edit: language === 'ar' ? 'تعديل' : 'Edit',
    delete: language === 'ar' ? 'حذف' : 'Delete',
    noResults: language === 'ar' ? 'لا توجد نتائج' : 'No results found',
    phone: language === 'ar' ? 'الهاتف' : 'Phone',
    visa: language === 'ar' ? 'التأشيرة' : 'Visa',
    agent: language === 'ar' ? 'الوكيل' : 'Agent',
    penaltyInfo: language === 'ar' ? 'معلومات الغرامة' : 'Penalty Information',
    penaltyType: language === 'ar' ? 'نوع الغرامة' : 'Penalty Type',
    reason: language === 'ar' ? 'السبب' : 'Reason',
    createdBy: language === 'ar' ? 'أنشأ بواسطة' : 'Created By',
    createdAt: language === 'ar' ? 'تاريخ الإنشاء' : 'Created At',
    daysAgo: language === 'ar' ? 'يوم مضى' : 'days ago',
    payPenalty: language === 'ar' ? 'دفع الغرامة' : 'Pay Penalty',
    refresh: language === 'ar' ? 'تحديث' : 'Refresh',
  };

  // Filter penalties
  const filteredPenalties = useMemo(() => {
    return mockPenalties.filter((penalty) => {
      const searchLower = searchText.toLowerCase();
      const matchesSearch =
        !searchText ||
        penalty.contractNumber.toLowerCase().includes(searchLower) ||
        penalty.customerName.toLowerCase().includes(searchLower) ||
        penalty.customerNameAr.includes(searchText) ||
        penalty.applicantName.toLowerCase().includes(searchLower);

      const matchesStatus = statusFilter === 'all' || penalty.status === statusFilter;
      const matchesPenaltyType =
        penaltyTypeFilter === 'all' || penalty.penaltyType === penaltyTypeFilter;

      const matchesDate =
        !dateRange ||
        (new Date(penalty.penaltyDate) >= dateRange[0].toDate() &&
          new Date(penalty.penaltyDate) <= dateRange[1].toDate());

      return matchesSearch && matchesStatus && matchesPenaltyType && matchesDate;
    });
  }, [searchText, statusFilter, penaltyTypeFilter, dateRange]);

  // Statistics
  const stats = useMemo(
    () => ({
      total: mockPenalties.length,
      pending: mockPenalties.filter((p) => p.status === 'pending').length,
      paid: mockPenalties.filter((p) => p.status === 'paid').length,
      totalAmount: mockPenalties.reduce((sum, p) => sum + p.penaltyAmount, 0),
    }),
    []
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
      pending: {
        color: 'warning',
        label: t.pending,
        icon: <ClockCircleOutlined />,
      },
      issued: { color: 'processing', label: t.issued, icon: <AlertOutlined /> },
      paid: { color: 'success', label: t.paid, icon: <CheckCircleOutlined /> },
      appealed: { color: 'default', label: t.appealed, icon: <ExclamationCircleOutlined /> },
      waived: { color: 'default', label: t.waived, icon: <CheckCircleOutlined /> },
    };
    return (
      config[status] || {
        color: 'default',
        label: status,
        icon: <ClockCircleOutlined />,
      }
    );
  };

  const getPenaltyTypeConfig = (type: string) => {
    const config: Record<string, { color: string; label: string }> = {
      delay: { color: '#faad14', label: t.delay },
      breach: { color: '#ff4d4f', label: t.breach },
      damage: { color: '#ff7875', label: t.damage },
      'non-compliance': { color: '#ff85c0', label: t.nonCompliance },
    };
    return config[type] || { color: '#666', label: type };
  };

  const handleViewDetails = (penalty: ContractPenalty) => {
    setSelectedPenalty(penalty);
    setShowDetailsModal(true);
  };

  const getMenuItems = (penalty: ContractPenalty): MenuProps['items'] => [
    {
      key: 'view',
      label: t.viewDetails,
      icon: <EyeOutlined />,
      onClick: () => handleViewDetails(penalty),
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

  const renderPenaltyCard = (penalty: ContractPenalty) => {
    const statusConfig = getStatusConfig(penalty.status);
    const penaltyTypeConfig = getPenaltyTypeConfig(penalty.penaltyType);
    const paymentProgress =
      penalty.penaltyAmount > 0 ? (penalty.paidAmount / penalty.penaltyAmount) * 100 : 0;
    const isOverdue = new Date(penalty.dueDate) < new Date() && penalty.status !== 'paid';

    return (
      <Col xs={24} key={penalty.id}>
        <Card className={styles.penaltyCard} hoverable>
          <div className={styles.cardContent}>
            {/* Left Section - Contract & Customer Info */}
            <div className={styles.cardLeft}>
              <div className={styles.cardHeader}>
                <div className={styles.contractNumber}>
                  <FileTextOutlined className={styles.contractIcon} />
                  <span>#{penalty.contractNumber}</span>
                </div>
                <Dropdown menu={{ items: getMenuItems(penalty) }} trigger={['click']}>
                  <Button type="text" icon={<MoreOutlined />} className={styles.moreBtn} />
                </Dropdown>
              </div>

              <div className={styles.statusSection}>
                <Badge status={statusConfig.color as any} text={statusConfig.label} />
                {isOverdue && (
                  <Tag color="red" icon={<AlertOutlined />}>
                    {penalty.daysOverdue} {t.daysOverdue}
                  </Tag>
                )}
              </div>

              {/* Penalty Type Badge */}
              <div className={styles.penaltyTypeSection}>
                <span
                  className={styles.penaltyTypeBadge}
                  style={{
                    backgroundColor: penaltyTypeConfig.color + '20',
                    color: penaltyTypeConfig.color,
                  }}
                >
                  {language === 'ar' ? penalty.penaltyTypeAr : penaltyTypeConfig.label}
                </span>
              </div>

              {/* Customer Info */}
              <div className={styles.customerSection}>
                <Avatar size={44} icon={<UserOutlined />} className={styles.customerAvatar} />
                <div className={styles.customerDetails}>
                  <span className={styles.customerName}>
                    {language === 'ar' ? penalty.customerNameAr : penalty.customerName}
                  </span>
                  <div className={styles.customerMeta}>
                    <PhoneOutlined />
                    <span dir="ltr">{penalty.customerPhone}</span>
                    <IdcardOutlined style={{ marginInlineStart: 12 }} />
                    <span dir="ltr">{penalty.customerId}</span>
                  </div>
                </div>
              </div>

              {/* Applicant & Visa Info */}
              <div className={styles.infoSection}>
                <div className={styles.infoItem}>
                  <SafetyOutlined className={styles.infoIcon} />
                  <div className={styles.infoText}>
                    <span className={styles.infoLabel}>{t.visa}</span>
                    <span className={styles.infoValue}>{penalty.visaNumber}</span>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <UserAddOutlined className={styles.infoIcon} />
                  <div className={styles.infoText}>
                    <span className={styles.infoLabel}>{t.applicant}</span>
                    <span className={styles.infoValue}>
                      {language === 'ar' ? penalty.applicantNameAr : penalty.applicantName}
                    </span>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <EnvironmentOutlined className={styles.infoIcon} />
                  <div className={styles.infoText}>
                    <span className={styles.infoLabel}>{t.nationality}</span>
                    <span className={styles.infoValue}>
                      {language === 'ar' ? penalty.nationalityAr : penalty.nationality}
                    </span>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <TeamOutlined className={styles.infoIcon} />
                  <div className={styles.infoText}>
                    <span className={styles.infoLabel}>{t.profession}</span>
                    <span className={styles.infoValue}>
                      {language === 'ar' ? penalty.professionAr : penalty.profession}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Section - Penalty Amount & Payment */}
            <div className={styles.cardMiddle}>
              <div className={styles.amountSection}>
                <div className={styles.amountHeader}>
                  <span className={styles.amountLabel}>{t.penaltyAmount}</span>
                  <span className={styles.amountValue}>
                    {formatCurrency(penalty.penaltyAmount)}
                  </span>
                </div>
                <Progress
                  percent={Math.round(paymentProgress)}
                  showInfo={false}
                  strokeColor={{
                    '0%': '#003366',
                    '100%': '#0056b3',
                  }}
                />
                <div className={styles.paymentDetails}>
                  <div className={styles.paymentItem}>
                    <span className={styles.paymentLabel}>{t.paid}</span>
                    <span className={styles.paymentValue} style={{ color: '#52c41a' }}>
                      {formatCurrency(penalty.paidAmount)}
                    </span>
                  </div>
                  <div className={styles.paymentItem}>
                    <span className={styles.paymentLabel}>{t.remaining}</span>
                    <span className={styles.paymentValue} style={{ color: '#ff4d4f' }}>
                      {formatCurrency(penalty.remainingAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className={styles.datesSection}>
                <div className={styles.dateItem}>
                  <span className={styles.dateLabel}>{t.penaltyDate}</span>
                  <span className={styles.dateValue}>{formatDate(penalty.penaltyDate)}</span>
                </div>
                <div className={styles.dateItem}>
                  <span className={styles.dateLabel}>{t.dueDate}</span>
                  <span
                    className={styles.dateValue}
                    style={{ color: isOverdue ? '#ff4d4f' : '#262626' }}
                  >
                    {formatDate(penalty.dueDate)}
                  </span>
                </div>
              </div>

              <Button
                type="primary"
                block
                icon={<MoneyCollectOutlined />}
                className={styles.payBtn}
                onClick={() => handleViewDetails(penalty)}
              >
                {t.payPenalty}
              </Button>
            </div>

            {/* Right Section - Reason & Agent */}
            <div className={styles.cardRight}>
              <div className={styles.reasonHeader}>
                <AlertOutlined className={styles.reasonIcon} />
                <span className={styles.reasonTitle}>{t.reason}</span>
              </div>

              <div className={styles.reasonContent}>
                <p className={styles.reasonText}>
                  {language === 'ar' ? penalty.reasonAr : penalty.reason}
                </p>
              </div>

              <div className={styles.agentInfo}>
                <TeamOutlined className={styles.agentIcon} />
                <div>
                  <span className={styles.agentLabel}>{t.agent}</span>
                  <span className={styles.agentValue}>
                    {language === 'ar' ? penalty.agentNameAr : penalty.agentName}
                  </span>
                </div>
              </div>

              <div className={styles.createdInfo}>
                <div className={styles.createdItem}>
                  <span className={styles.createdLabel}>{t.createdBy}</span>
                  <span className={styles.createdValue}>
                    {language === 'ar' ? penalty.createdByAr : penalty.createdBy}
                  </span>
                </div>
                <div className={styles.createdItem}>
                  <span className={styles.createdLabel}>{t.createdAt}</span>
                  <span className={styles.createdValue}>{formatDate(penalty.createdAt)}</span>
                </div>
              </div>

              <Button
                type="default"
                block
                icon={<EyeOutlined />}
                className={styles.detailsBtn}
                onClick={() => handleViewDetails(penalty)}
              >
                {t.viewDetails}
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
    <div className={styles.penaltiesPage}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerTitle}>
            <AlertOutlined className={styles.headerIcon} />
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
              {t.addPenalty}
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className={styles.statisticsRow}>
        <Col xs={12} sm={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={t.totalPenalties}
              value={stats.total}
              prefix={<AlertOutlined style={{ color: '#003366' }} />}
              valueStyle={{ color: '#003366' }}
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
              title={t.paidCount}
              value={stats.paid}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={t.totalAmount}
              value={stats.totalAmount}
              prefix={<DollarOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f' }}
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
                { value: 'issued', label: t.issued },
                { value: 'paid', label: t.paid },
                { value: 'appealed', label: t.appealed },
                { value: 'waived', label: t.waived },
              ]}
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              value={penaltyTypeFilter}
              onChange={setPenaltyTypeFilter}
              style={{ width: '100%' }}
              size="large"
              options={[
                { value: 'all', label: t.allPenaltyTypes },
                { value: 'delay', label: t.delay },
                { value: 'breach', label: t.breach },
                { value: 'damage', label: t.damage },
                { value: 'non-compliance', label: t.nonCompliance },
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
            ? `عرض ${filteredPenalties.length} من ${mockPenalties.length} غرامة`
            : `Showing ${filteredPenalties.length} of ${mockPenalties.length} penalties`}
        </span>
      </div>

      {/* Penalties Grid */}
      {filteredPenalties.length > 0 ? (
        <Row gutter={[16, 16]} className={styles.penaltiesGrid}>
          {filteredPenalties.map(renderPenaltyCard)}
        </Row>
      ) : (
        <Card className={styles.emptyCard}>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t.noResults} />
        </Card>
      )}

      {/* Details Modal */}
      <Modal
        title={`${t.contractNumber}: #${selectedPenalty?.contractNumber}`}
        open={showDetailsModal}
        onCancel={() => {
          setShowDetailsModal(false);
          setSelectedPenalty(null);
        }}
        footer={
          <Button type="primary" onClick={() => setShowDetailsModal(false)}>
            {language === 'ar' ? 'إغلاق' : 'Close'}
          </Button>
        }
        width={750}
      >
        {selectedPenalty && (
          <div className={styles.detailsModal}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <div className={styles.modalSection}>
                  <h4>{t.customer}</h4>
                  <p className={styles.modalValue}>
                    {language === 'ar'
                      ? selectedPenalty.customerNameAr
                      : selectedPenalty.customerName}
                  </p>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.modalSection}>
                  <h4>{t.phone}</h4>
                  <p className={styles.modalValue} dir="ltr">
                    {selectedPenalty.customerPhone}
                  </p>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.modalSection}>
                  <h4>{t.visa}</h4>
                  <p className={styles.modalValue}>{selectedPenalty.visaNumber}</p>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.modalSection}>
                  <h4>{t.applicant}</h4>
                  <p className={styles.modalValue}>
                    {language === 'ar'
                      ? selectedPenalty.applicantNameAr
                      : selectedPenalty.applicantName}
                  </p>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.modalSection}>
                  <h4>{t.nationality}</h4>
                  <p className={styles.modalValue}>
                    {language === 'ar'
                      ? selectedPenalty.nationalityAr
                      : selectedPenalty.nationality}
                  </p>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.modalSection}>
                  <h4>{t.penaltyType}</h4>
                  <p className={styles.modalValue}>
                    {language === 'ar'
                      ? selectedPenalty.penaltyTypeAr
                      : selectedPenalty.penaltyType}
                  </p>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.modalSection}>
                  <h4>{t.reason}</h4>
                  <p className={styles.modalValue}>
                    {language === 'ar' ? selectedPenalty.reasonAr : selectedPenalty.reason}
                  </p>
                </div>
              </Col>
              <Col span={8}>
                <div className={styles.modalSection}>
                  <h4>{t.penaltyAmount}</h4>
                  <p className={styles.modalValue}>
                    {formatCurrency(selectedPenalty.penaltyAmount)}
                  </p>
                </div>
              </Col>
              <Col span={8}>
                <div className={styles.modalSection}>
                  <h4>{t.paid}</h4>
                  <p className={styles.modalValue} style={{ color: '#52c41a' }}>
                    {formatCurrency(selectedPenalty.paidAmount)}
                  </p>
                </div>
              </Col>
              <Col span={8}>
                <div className={styles.modalSection}>
                  <h4>{t.remaining}</h4>
                  <p className={styles.modalValue} style={{ color: '#ff4d4f' }}>
                    {formatCurrency(selectedPenalty.remainingAmount)}
                  </p>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.modalSection}>
                  <h4>{t.penaltyDate}</h4>
                  <p className={styles.modalValue}>{formatDate(selectedPenalty.penaltyDate)}</p>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.modalSection}>
                  <h4>{t.dueDate}</h4>
                  <p className={styles.modalValue}>{formatDate(selectedPenalty.dueDate)}</p>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
}
