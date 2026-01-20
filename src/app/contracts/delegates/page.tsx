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
//   Dropdown,
  DatePicker,
  Progress,
} from 'antd';
// import type { MenuProps } from 'antd';
import {
  FileTextOutlined,
  SearchOutlined,
  PlusOutlined,
//   EditOutlined,
//   DeleteOutlined,
  PrinterOutlined,
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
//   EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
//   MoreOutlined,
  FileExcelOutlined,
  PhoneOutlined,
  IdcardOutlined,
  SafetyOutlined,
  FileDoneOutlined,
  UserAddOutlined,
  FileProtectOutlined,
  CloseCircleOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  AuditOutlined,
} from '@ant-design/icons';

import { useAuthStore } from '@/store/authStore';
import styles from './Delegates.module.css';

const { RangePicker } = DatePicker;

interface ContractDelegate {
  id: string;
  contractNumber: string;
  customerName: string;
  customerNameAr: string;
  customerPhone: string;
  customerId: string;
  status: 'under-revision' | 'approved' | 'rejected' | 'cancelled' | 'pending';
  visaNumber: string;
  applicantName: string;
  applicantNameAr: string;
  nationality: string;
  nationalityAr: string;
  profession: string;
  professionAr: string;
  agentName: string;
  agentNameAr: string;
  totalCost: number;
  paidAmount: number;
  remainingAmount: number;
  signedDate: string;
  delegateEmployeeName: string;
  delegateEmployeeNameAr: string;
  authorizationStatus: string;
  authorizationStatusAr: string;
  authorizationDate: string;
  authorizationNumber: string;
  cancellationNumber: string;
  createdAt: string;
  createdBy: string;
  createdByAr: string;
  daysCreated: number;
  branch: string;
  branchAr: string;
}

// Mock data
const mockDelegates: ContractDelegate[] = Array.from({ length: 30 }, (_, i) => {
  const totalCost = Math.floor(Math.random() * 5000) + 2000;
  const paidAmount = Math.floor(Math.random() * totalCost);

  return {
    id: `delegate-${i + 1}`,
    contractNumber: `${6700 + i}`,
    customerName: [
      'Nuaf Abdullah Al-Khamash',
      'Mohammed Al-Ali',
      'Malhah Al-Rashidi',
      'Hamad Al-Khatani',
      'Abdullah Al-Dosari',
      'Salem Al-Harbi',
    ][i % 6],
    customerNameAr: [
      'نواف عبدالله الخماش',
      'محمد العلي',
      'ملحة الرشيدي',
      'حمد الخطاني',
      'عبدالله الدوسري',
      'سالم الحربي',
    ][i % 6],
    customerPhone: `05${Math.floor(Math.random() * 9)}${String(Math.floor(Math.random() * 10000000)).padStart(7, '0')}`,
    customerId: `10${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
    status: (['under-revision', 'approved', 'rejected', 'cancelled', 'pending'] as const)[i % 5],
    visaNumber: `19077${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`,
    applicantName: ['MD SHABAB ANWAR', 'HAIDER GHULAM', 'ALI SABAHAT', 'KIRSHAN SHAMOON'][i % 4],
    applicantNameAr: ['محمد شباب أنور', 'حيدر غلام', 'علي سباحات', 'كرشان شمعون'][i % 4],
    nationality: ['India', 'Pakistan', 'Bangladesh', 'Philippines'][i % 4],
    nationalityAr: ['الهند', 'باكستان', 'بنغلاديش', 'الفلبين'][i % 4],
    profession: ['Driver', 'Housemaid', 'Cook', 'Nurse'][i % 4],
    professionAr: ['سائق', 'خادمة منزلية', 'طباخ', 'ممرضة'][i % 4],
    agentName: ['M. T TRAVEL AGENCY', 'Pakistan Delegate', 'India Services'][i % 3],
    agentNameAr: ['وكالة إم تي للسفر', 'تفويض باكستان', 'خدمات الهند'][i % 3],
    totalCost,
    paidAmount,
    remainingAmount: totalCost - paidAmount,
    signedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    delegateEmployeeName: ['Sara Al-Harbi', 'Ahmed Al-Otaibi', 'Fahad Al-Zahrani'][i % 3],
    delegateEmployeeNameAr: ['سارة الحربي', 'أحمد العتيبي', 'فهد الزهراني'][i % 3],
    authorizationStatus: ['Under Revision', 'Approved', 'Rejected', 'Pending', 'Cancelled'][i % 5],
    authorizationStatusAr: ['قيد المراجعة', 'موافق عليه', 'مرفوض', 'معلق', 'ملغى'][i % 5],
    authorizationDate: new Date(
      Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000
    ).toISOString(),
    authorizationNumber: `254${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`,
    cancellationNumber:
      i % 5 === 3 ? `CAN${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}` : '',
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: ['Muhannad Al-Muhdar', 'Abdulrahman Al-Sarihi', 'Sara Al-Zahrani'][i % 3],
    createdByAr: ['مهند المحضار', 'عبدالرحمن السريحي', 'سارة الزهراني'][i % 3],
    daysCreated: Math.floor(Math.random() * 30) + 1,
    branch: 'Sigma Recruitment Office',
    branchAr: 'سيجما الكفاءات للاستقدام',
  };
});

export default function ContractDelegatesPage() {
  const language = useAuthStore((state) => state.language);
  const [mounted, setMounted] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [nationalityFilter, setNationalityFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[any, any] | null>(null);
  const [selectedDelegate, setSelectedDelegate] = useState<ContractDelegate | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const t = {
    pageTitle: language === 'ar' ? 'مندوبو العقود' : 'Contract Delegates',
    pageSubtitle:
      language === 'ar'
        ? 'إدارة تفويضات واعتمادات العقود'
        : 'Manage contract authorizations and delegates',
    addDelegate: language === 'ar' ? 'إضافة تفويض' : 'Add Delegate',
    exportExcel: language === 'ar' ? 'تصدير إكسل' : 'Export Excel',
    print: language === 'ar' ? 'طباعة' : 'Print',
    search:
      language === 'ar'
        ? 'بحث برقم العقد أو اسم العميل...'
        : 'Search by contract number or customer name...',
    allStatuses: language === 'ar' ? 'جميع الحالات' : 'All Statuses',
    underRevision: language === 'ar' ? 'قيد المراجعة' : 'Under Revision',
    approved: language === 'ar' ? 'موافق عليه' : 'Approved',
    rejected: language === 'ar' ? 'مرفوض' : 'Rejected',
    cancelled: language === 'ar' ? 'ملغى' : 'Cancelled',
    pending: language === 'ar' ? 'معلق' : 'Pending',
    allNationalities: language === 'ar' ? 'جميع الجنسيات' : 'All Nationalities',
    dateRange: language === 'ar' ? 'نطاق التاريخ' : 'Date Range',
    startDate: language === 'ar' ? 'تاريخ البداية' : 'Start Date',
    endDate: language === 'ar' ? 'تاريخ النهاية' : 'End Date',
    totalDelegates: language === 'ar' ? 'إجمالي التفاويض' : 'Total Delegates',
    underRevisionCount: language === 'ar' ? 'قيد المراجعة' : 'Under Revision',
    approvedCount: language === 'ar' ? 'موافق عليها' : 'Approved',
    totalRevenue: language === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue',
    contractNumber: language === 'ar' ? 'رقم العقد' : 'Contract Number',
    customer: language === 'ar' ? 'العميل' : 'Customer',
    applicant: language === 'ar' ? 'المتقدم' : 'Applicant',
    status: language === 'ar' ? 'الحالة' : 'Status',
    totalCost: language === 'ar' ? 'التكلفة الإجمالية' : 'Total Cost',
    paid: language === 'ar' ? 'المدفوع' : 'Paid',
    remaining: language === 'ar' ? 'المتبقي' : 'Remaining',
    signedDate: language === 'ar' ? 'تاريخ التوقيع' : 'Signed Date',
    nationality: language === 'ar' ? 'الجنسية' : 'Nationality',
    profession: language === 'ar' ? 'المهنة' : 'Profession',
    edit: language === 'ar' ? 'تعديل' : 'Edit',
    delete: language === 'ar' ? 'حذف' : 'Delete',
    noResults: language === 'ar' ? 'لا توجد نتائج' : 'No results found',
    phone: language === 'ar' ? 'الهاتف' : 'Phone',
    visa: language === 'ar' ? 'التأشيرة' : 'Visa',
    agent: language === 'ar' ? 'الوكيل' : 'Agent',
    delegateInfo: language === 'ar' ? 'معلومات التفويض' : 'Delegate Information',
    employeeName: language === 'ar' ? 'اسم الموظف' : 'Employee Name',
    authorizationStatus: language === 'ar' ? 'حالة التفويض' : 'Authorization Status',
    authorizationDate: language === 'ar' ? 'تاريخ التفويض' : 'Authorization Date',
    authorizationNumber: language === 'ar' ? 'رقم التفويض' : 'Authorization Number',
    cancellationNumber: language === 'ar' ? 'رقم الإلغاء' : 'Cancellation Number',
    createdBy: language === 'ar' ? 'أنشأ بواسطة' : 'Created By',
    createdAt: language === 'ar' ? 'تاريخ الإنشاء' : 'Created At',
    daysAgo: language === 'ar' ? 'يوم مضى' : 'days ago',
    approveDelegate: language === 'ar' ? 'الموافقة على التفويض' : 'Approve Delegate',
    refresh: language === 'ar' ? 'تحديث' : 'Refresh',
  };

  // Filter delegates
  const filteredDelegates = useMemo(() => {
    return mockDelegates.filter((delegate) => {
      const searchLower = searchText.toLowerCase();
      const matchesSearch =
        !searchText ||
        delegate.contractNumber.toLowerCase().includes(searchLower) ||
        delegate.customerName.toLowerCase().includes(searchLower) ||
        delegate.customerNameAr.includes(searchText) ||
        delegate.applicantName.toLowerCase().includes(searchLower);

      const matchesStatus = statusFilter === 'all' || delegate.status === statusFilter;
      const matchesNationality =
        nationalityFilter === 'all' || delegate.nationality === nationalityFilter;

      const matchesDate =
        !dateRange ||
        (new Date(delegate.authorizationDate) >= dateRange[0].toDate() &&
          new Date(delegate.authorizationDate) <= dateRange[1].toDate());

      return matchesSearch && matchesStatus && matchesNationality && matchesDate;
    });
  }, [searchText, statusFilter, nationalityFilter, dateRange]);

  // Statistics
  const stats = useMemo(
    () => ({
      total: mockDelegates.length,
      underRevision: mockDelegates.filter((d) => d.status === 'under-revision').length,
      approved: mockDelegates.filter((d) => d.status === 'approved').length,
      revenue: mockDelegates.reduce((sum, d) => sum + d.paidAmount, 0),
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
      'under-revision': {
        color: 'processing',
        label: t.underRevision,
        icon: <ClockCircleOutlined />,
      },
      approved: { color: 'success', label: t.approved, icon: <CheckCircleOutlined /> },
      rejected: { color: 'error', label: t.rejected, icon: <ExclamationCircleOutlined /> },
      cancelled: { color: 'default', label: t.cancelled, icon: <CloseCircleOutlined /> },
      pending: { color: 'warning', label: t.pending, icon: <ClockCircleOutlined /> },
    };
    return (
      config[status] || {
        color: 'default',
        label: status,
        icon: <ClockCircleOutlined />,
      }
    );
  };

 

//   const getMenuItems = (delegate: ContractDelegate): MenuProps['items'] => [
//     {
//       key: 'view',
//       label: t.viewDetails,
//       icon: <EyeOutlined />,
//       onClick: () => handleViewDetails(delegate),
//     },
//     {
//       key: 'edit',
//       label: t.edit,
//       icon: <EditOutlined />,
//     },
//     {
//       key: 'print',
//       label: t.print,
//       icon: <PrinterOutlined />,
//     },
//     {
//       type: 'divider',
//     },
//     {
//       key: 'delete',
//       label: t.delete,
//       icon: <DeleteOutlined />,
//       danger: true,
//     },
//   ];

  const renderDelegateCard = (delegate: ContractDelegate) => {
    const statusConfig = getStatusConfig(delegate.status);
    const paymentProgress = (delegate.paidAmount / delegate.totalCost) * 100;

    return (
      <Col xs={24} key={delegate.id}>
        <Card className={styles.delegateCard} hoverable>
          <div className={styles.cardContent}>
            {/* Left Section - Contract Info */}
            <div className={styles.cardLeft}>
              <div className={styles.cardHeader}>
                <div className={styles.contractNumber}>
                  <FileTextOutlined className={styles.contractIcon} />
                  <span>#{delegate.contractNumber}</span>
                </div>
                {/* <Dropdown menu={{ items: getMenuItems(delegate) }} trigger={['click']}>
                  <Button type="text" icon={<MoreOutlined />} className={styles.moreBtn} />
                </Dropdown> */}
              </div>

              <div className={styles.statusSection}>
                <Badge status={statusConfig.color as any} text={statusConfig.label} />
                <Tag color="blue" icon={<CalendarOutlined />}>
                  {delegate.daysCreated} {t.daysAgo}
                </Tag>
              </div>

              {/* Customer Info */}
              <div className={styles.customerSection}>
                <Avatar size={44} icon={<UserOutlined />} className={styles.customerAvatar} />
                <div className={styles.customerDetails}>
                  <span className={styles.customerName}>
                    {language === 'ar' ? delegate.customerNameAr : delegate.customerName}
                  </span>
                  <div className={styles.customerMeta}>
                    <PhoneOutlined />
                    <span dir="ltr">{delegate.customerPhone}</span>
                    <IdcardOutlined style={{ marginInlineStart: 12 }} />
                    <span dir="ltr">{delegate.customerId}</span>
                  </div>
                </div>
              </div>

              {/* Applicant & Visa Info */}
              <div className={styles.infoSection}>
                <div className={styles.infoItem}>
                  <SafetyOutlined className={styles.infoIcon} />
                  <div className={styles.infoText}>
                    <span className={styles.infoLabel}>{t.visa}</span>
                    <span className={styles.infoValue}>{delegate.visaNumber}</span>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <UserAddOutlined className={styles.infoIcon} />
                  <div className={styles.infoText}>
                    <span className={styles.infoLabel}>{t.applicant}</span>
                    <span className={styles.infoValue}>
                      {language === 'ar' ? delegate.applicantNameAr : delegate.applicantName}
                    </span>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <EnvironmentOutlined className={styles.infoIcon} />
                  <div className={styles.infoText}>
                    <span className={styles.infoLabel}>{t.nationality}</span>
                    <span className={styles.infoValue}>
                      {language === 'ar' ? delegate.nationalityAr : delegate.nationality}
                    </span>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <TeamOutlined className={styles.infoIcon} />
                  <div className={styles.infoText}>
                    <span className={styles.infoLabel}>{t.profession}</span>
                    <span className={styles.infoValue}>
                      {language === 'ar' ? delegate.professionAr : delegate.profession}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Section - Financials */}
            <div className={styles.cardMiddle}>
              <div className={styles.costSection}>
                <div className={styles.costHeader}>
                  <span className={styles.costLabel}>{t.totalCost}</span>
                  <span className={styles.costAmount}>{formatCurrency(delegate.totalCost)}</span>
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
                      {formatCurrency(delegate.paidAmount)}
                    </span>
                  </div>
                  <div className={styles.paymentItem}>
                    <span className={styles.paymentLabel}>{t.remaining}</span>
                    <span className={styles.paymentValue} style={{ color: '#ff4d4f' }}>
                      {formatCurrency(delegate.remainingAmount)}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.agentInfo}>
                <TeamOutlined className={styles.agentIcon} />
                <div>
                  <span className={styles.agentLabel}>{t.agent}</span>
                  <span className={styles.agentValue}>
                    {language === 'ar' ? delegate.agentNameAr : delegate.agentName}
                  </span>
                </div>
              </div>

              
            </div>

            {/* Right Section - Delegate Info */}
            <div className={styles.cardRight}>
              <div className={styles.delegateHeader}>
                <AuditOutlined className={styles.delegateIcon} />
                <span className={styles.delegateTitle}>{t.delegateInfo}</span>
              </div>

              <div className={styles.delegateDetails}>
                <div className={styles.delegateItem}>
                  <span className={styles.delegateLabel}>{t.authorizationStatus}</span>
                  <Tag
                    color={statusConfig.color}
                    icon={statusConfig.icon}
                    className={styles.delegateTag}
                  >
                    {language === 'ar'
                      ? delegate.authorizationStatusAr
                      : delegate.authorizationStatus}
                  </Tag>
                </div>
                <div className={styles.delegateItem}>
                  <span className={styles.delegateLabel}>{t.authorizationDate}</span>
                  <span className={styles.delegateValue}>
                    {formatDate(delegate.authorizationDate)}
                  </span>
                </div>
                <div className={styles.delegateItem}>
                  <span className={styles.delegateLabel}>{t.authorizationNumber}</span>
                  <span className={styles.delegateValue}>{delegate.authorizationNumber}</span>
                </div>
                {delegate.cancellationNumber && (
                  <div className={styles.delegateItem}>
                    <span className={styles.delegateLabel}>{t.cancellationNumber}</span>
                    <span className={styles.delegateValue} style={{ color: '#ff4d4f' }}>
                      {delegate.cancellationNumber}
                    </span>
                  </div>
                )}
                <div className={styles.delegateItem}>
                  <span className={styles.delegateLabel}>{t.createdBy}</span>
                  <span className={styles.delegateValue}>
                    {language === 'ar' ? delegate.createdByAr : delegate.createdBy}
                  </span>
                </div>
              </div>

              <Button
                type="default"
                block
                icon={<FileDoneOutlined />}
                className={styles.approveBtn}
              >
                {t.approveDelegate}
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
    <div className={styles.delegatesPage}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerTitle}>
            <FileProtectOutlined className={styles.headerIcon} />
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
              {t.addDelegate}
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className={styles.statisticsRow}>
        <Col xs={12} sm={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={t.totalDelegates}
              value={stats.total}
              prefix={<FileProtectOutlined style={{ color: '#003366' }} />}
              valueStyle={{ color: '#003366' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={t.underRevisionCount}
              value={stats.underRevision}
              prefix={<ClockCircleOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={t.approvedCount}
              value={stats.approved}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
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
                { value: 'under-revision', label: t.underRevision },
                { value: 'approved', label: t.approved },
                { value: 'rejected', label: t.rejected },
                { value: 'pending', label: t.pending },
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
                { value: 'India', label: language === 'ar' ? 'الهند' : 'India' },
                { value: 'Pakistan', label: language === 'ar' ? 'باكستان' : 'Pakistan' },
                { value: 'Bangladesh', label: language === 'ar' ? 'بنغلاديش' : 'Bangladesh' },
                { value: 'Philippines', label: language === 'ar' ? 'الفلبين' : 'Philippines' },
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
            ? `عرض ${filteredDelegates.length} من ${mockDelegates.length} تفويض`
            : `Showing ${filteredDelegates.length} of ${mockDelegates.length} delegates`}
        </span>
      </div>

      {/* Delegates Grid */}
      {filteredDelegates.length > 0 ? (
        <Row gutter={[16, 16]} className={styles.delegatesGrid}>
          {filteredDelegates.map(renderDelegateCard)}
        </Row>
      ) : (
        <Card className={styles.emptyCard}>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t.noResults} />
        </Card>
      )}

      {/* Details Modal */}
      <Modal
        title={`${t.contractNumber}: #${selectedDelegate?.contractNumber}`}
        open={showDetailsModal}
        onCancel={() => {
          setShowDetailsModal(false);
          setSelectedDelegate(null);
        }}
        footer={
          <Button type="primary" onClick={() => setShowDetailsModal(false)}>
            {language === 'ar' ? 'إغلاق' : 'Close'}
          </Button>
        }
        width={750}
      >
        {selectedDelegate && (
          <div className={styles.detailsModal}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <div className={styles.modalSection}>
                  <h4>{t.customer}</h4>
                  <p className={styles.modalValue}>
                    {language === 'ar'
                      ? selectedDelegate.customerNameAr
                      : selectedDelegate.customerName}
                  </p>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.modalSection}>
                  <h4>{t.phone}</h4>
                  <p className={styles.modalValue} dir="ltr">
                    {selectedDelegate.customerPhone}
                  </p>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.modalSection}>
                  <h4>{t.visa}</h4>
                  <p className={styles.modalValue}>{selectedDelegate.visaNumber}</p>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.modalSection}>
                  <h4>{t.applicant}</h4>
                  <p className={styles.modalValue}>
                    {language === 'ar'
                      ? selectedDelegate.applicantNameAr
                      : selectedDelegate.applicantName}
                  </p>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.modalSection}>
                  <h4>{t.nationality}</h4>
                  <p className={styles.modalValue}>
                    {language === 'ar'
                      ? selectedDelegate.nationalityAr
                      : selectedDelegate.nationality}
                  </p>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.modalSection}>
                  <h4>{t.profession}</h4>
                  <p className={styles.modalValue}>
                    {language === 'ar'
                      ? selectedDelegate.professionAr
                      : selectedDelegate.profession}
                  </p>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.modalSection}>
                  <h4>{t.agent}</h4>
                  <p className={styles.modalValue}>
                    {language === 'ar' ? selectedDelegate.agentNameAr : selectedDelegate.agentName}
                  </p>
                </div>
              </Col>
              <Col span={8}>
                <div className={styles.modalSection}>
                  <h4>{t.totalCost}</h4>
                  <p className={styles.modalValue}>{formatCurrency(selectedDelegate.totalCost)}</p>
                </div>
              </Col>
              <Col span={8}>
                <div className={styles.modalSection}>
                  <h4>{t.paid}</h4>
                  <p className={styles.modalValue} style={{ color: '#52c41a' }}>
                    {formatCurrency(selectedDelegate.paidAmount)}
                  </p>
                </div>
              </Col>
              <Col span={8}>
                <div className={styles.modalSection}>
                  <h4>{t.remaining}</h4>
                  <p className={styles.modalValue} style={{ color: '#ff4d4f' }}>
                    {formatCurrency(selectedDelegate.remainingAmount)}
                  </p>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.modalSection}>
                  <h4>{t.authorizationNumber}</h4>
                  <p className={styles.modalValue}>{selectedDelegate.authorizationNumber}</p>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.modalSection}>
                  <h4>{t.authorizationDate}</h4>
                  <p className={styles.modalValue}>
                    {formatDate(selectedDelegate.authorizationDate)}
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
