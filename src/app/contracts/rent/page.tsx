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
  Progress,
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
import styles from './RentContracts.module.css';

const { RangePicker } = DatePicker;

interface RentContract {
  id: string;
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

// Mock data for rent contracts
const mockRentContracts: RentContract[] = Array.from({ length: 50 }, (_, i) => {
  const monthlyRent = Math.floor(Math.random() * 2000) + 1000;
  const monthsActive = Math.floor(Math.random() * 24) + 1;
  const totalCollected = monthlyRent * monthsActive;
  const daysRemaining = Math.floor(Math.random() * 365);

  return {
    id: `rent-${i + 1}`,
    contractNumber: `R${2024000 + i}`,
    customerName: [
      'Ahmed Al-Rashid',
      'Fatima Hassan',
      'Mohammed Al-Qahtani',
      'Sara Abdullah',
      'Khalid Ibrahim',
      'Nora Al-Saud',
      'Omar Mansour',
      'Layla Ahmed',
    ][i % 8],
    customerNameAr: [
      'أحمد الراشد',
      'فاطمة حسن',
      'محمد القحطاني',
      'سارة عبدالله',
      'خالد إبراهيم',
      'نورة آل سعود',
      'عمر منصور',
      'ليلى أحمد',
    ][i % 8],
    customerPhone: `05${Math.floor(Math.random() * 9)}${String(Math.floor(Math.random() * 10000000)).padStart(7, '0')}`,
    status: (['active', 'pending', 'expired', 'renewed', 'cancelled'] as const)[i % 5],
    startDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    monthlyRent,
    totalCollected,
    remainingAmount: Math.floor(Math.random() * monthlyRent),
    workerName: ['Maria Santos', 'Kumar Patel', 'Siti Rahman', 'Fatima Ali'][i % 4],
    workerNameAr: ['ماريا سانتوس', 'كومار باتل', 'سيتي رحمن', 'فاطمة علي'][i % 4],
    nationality: ['Philippines', 'India', 'Indonesia', 'Bangladesh'][i % 4],
    nationalityAr: ['الفلبين', 'الهند', 'إندونيسيا', 'بنغلاديش'][i % 4],
    profession: ['Housemaid', 'Driver', 'Cook', 'Nurse'][i % 4],
    professionAr: ['خادمة منزلية', 'سائق', 'طباخ', 'ممرضة'][i % 4],
    agent: ['Siham Al-Harbi', 'Mohammed Al-Otaibi', 'Sara Al-Dosari'][i % 3],
    agentAr: ['سهام الحربي', 'محمد العتيبي', 'سارة الدوسري'][i % 3],
    branch: 'Sigma Recruitment Office',
    branchAr: 'سيجما الكفاءات للاستقدام',
    renewalCount: Math.floor(Math.random() * 5),
    daysRemaining,
    createdAt: new Date(Date.now() - Math.random() * 730 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Rent contract in good standing',
    notesAr: 'عقد الإيجار في وضع جيد',
  };
});

export default function RentContractsPage() {
  const language = useAuthStore((state) => state.language);
  const [mounted, setMounted] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [nationalityFilter, setNationalityFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[any, any] | null>(null);
  const [selectedContract, setSelectedContract] = useState<RentContract | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

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

  // Filter contracts
  const filteredContracts = useMemo(() => {
    return mockRentContracts.filter((contract) => {
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
  }, [searchText, statusFilter, nationalityFilter, dateRange]);

  // Statistics
  const stats = useMemo(
    () => ({
      total: mockRentContracts.length,
      active: mockRentContracts.filter((c) => c.status === 'active').length,
      expiring: mockRentContracts.filter((c) => c.daysRemaining < 30 && c.status === 'active')
        .length,
      revenue: mockRentContracts.reduce((sum, c) => sum + c.totalCollected, 0),
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
              <Button type="link" icon={<FileProtectOutlined />} className={styles.actionBtn} block>
                {t.addNote}
              </Button>
              <Button type="link" icon={<WarningOutlined />} className={styles.actionBtn} block>
                {t.addComplaint}
              </Button>
              <Button type="link" icon={<PhoneOutlined />} className={styles.actionBtn} block>
                {t.addContact}
              </Button>
              <Button
                type="link"
                icon={<MoneyCollectOutlined />}
                className={`${styles.actionBtn} ${styles.successBtn}`}
                block
              >
                {t.collectPayment}
              </Button>
              <Button
                type="link"
                icon={<ReloadOutlined />}
                className={`${styles.actionBtn} ${styles.successBtn}`}
                block
              >
                {t.renewContract}
              </Button>
              <Button type="link" icon={<UserDeleteOutlined />} className={styles.actionBtn} block>
                {t.releaseWorker}
              </Button>
              <Button type="link" icon={<UserAddOutlined />} className={styles.actionBtn} block>
                {t.transferWorker}
              </Button>
              <Button
                type="link"
                icon={<CloseCircleOutlined />}
                className={`${styles.actionBtn} ${styles.dangerBtn}`}
                block
              >
                {t.cancel}
              </Button>
              <Button type="link" icon={<BarsOutlined />} className={styles.actionBtn} block>
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
            <Button icon={<FileExcelOutlined />} className={styles.secondaryBtn}>
              {t.exportExcel}
            </Button>
            <Button icon={<PrinterOutlined />} className={styles.secondaryBtn}>
              {t.print}
            </Button>
            <Button type="primary" icon={<PlusOutlined />} className={styles.primaryBtn}>
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
            ? `عرض ${filteredContracts.length} من ${mockRentContracts.length} عقد`
            : `Showing ${filteredContracts.length} of ${mockRentContracts.length} contracts`}
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
