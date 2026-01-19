'use client';

import React, { useState, useMemo } from 'react';
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
  TeamOutlined,
  FileProtectOutlined,
  WarningOutlined,
  MoneyCollectOutlined,
  SafetyOutlined,
  UserDeleteOutlined,
  UserAddOutlined,
  SwapOutlined,
  CloseCircleOutlined,
  BarsOutlined,
} from '@ant-design/icons';

import { useAuthStore } from '@/store/authStore';
import styles from './Contracts.module.css';

interface Contract {
  id: string;
  contractNumber: string;
  customerName: string;
  customerNameAr: string;
  customerPhone: string;
  contractType: 'mediation' | 'operation' | 'sponsorship' | 'rent';
  status: 'active' | 'pending' | 'completed' | 'cancelled' | 'expired';
  startDate: string;
  endDate: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  nationality: string;
  nationalityAr: string;
  profession: string;
  professionAr: string;
  agent: string;
  agentAr: string;
  branch: string;
  branchAr: string;
  createdAt: string;
  notes: string;
  notesAr: string;
}

// Mock data for contracts
const mockContracts: Contract[] = Array.from({ length: 60 }, (_, i) => {
  const total = Math.floor(Math.random() * 20000) + 5000;
  const paid = Math.floor(Math.random() * total);
  return {
    id: `contract-${i + 1}`,
    contractNumber: `${2024000 + i}`,
    customerName: [
      'Ahmed Al-Rashid',
      'Fatima Hassan',
      'Mohammed Al-Qahtani',
      'Sara Abdullah',
      'Khalid Ibrahim',
      'Nora Al-Saud',
      'Omar Mansour',
      'Layla Ahmed',
      'Youssef Al-Harbi',
      'Hana Mahmoud',
      'Ali Al-Dosari',
      'Mona Saleh',
    ][i % 12],
    customerNameAr: [
      'أحمد الراشد',
      'فاطمة حسن',
      'محمد القحطاني',
      'سارة عبدالله',
      'خالد إبراهيم',
      'نورة آل سعود',
      'عمر منصور',
      'ليلى أحمد',
      'يوسف الحربي',
      'هناء محمود',
      'علي الدوسري',
      'منى صالح',
    ][i % 12],
    customerPhone: `05${Math.floor(Math.random() * 9)}${String(Math.floor(Math.random() * 10000000)).padStart(7, '0')}`,
    contractType: (['mediation', 'operation', 'sponsorship', 'rent'] as const)[i % 4],
    status: (['active', 'pending', 'completed', 'cancelled', 'expired'] as const)[i % 5],
    startDate: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
    totalAmount: total,
    paidAmount: paid,
    remainingAmount: total - paid,
    nationality: ['Philippines', 'India', 'Indonesia', 'Bangladesh', 'Sri Lanka'][i % 5],
    nationalityAr: ['الفلبين', 'الهند', 'إندونيسيا', 'بنغلاديش', 'سريلانكا'][i % 5],
    profession: ['Housemaid', 'Driver', 'Cook', 'Nurse', 'Nanny'][i % 5],
    professionAr: ['خادمة منزلية', 'سائق', 'طباخ', 'ممرضة', 'مربية'][i % 5],
    agent: ['Siham Al-Harbi', 'Mohammed Al-Otaibi', 'Sara Al-Dosari'][i % 3],
    agentAr: ['سهام الحربي', 'محمد العتيبي', 'سارة الدوسري'][i % 3],
    branch: 'Sigma Recruitment Office',
    branchAr: 'سيجما الكفاءات للاستقدام',
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Contract processed successfully',
    notesAr: 'تم معالجة العقد بنجاح',
  };
});

export default function ContractsPage() {
  const language = useAuthStore((state) => state.language);
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [nationalityFilter, setNationalityFilter] = useState<string>('all');
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Translations
  const t = {
    pageTitle: language === 'ar' ? 'عقود الوساطة' : 'Mediation Contracts',
    pageSubtitle:
      language === 'ar'
        ? 'إدارة جميع عقود الوساطة والتشغيل'
        : 'Manage all mediation and operation contracts',
    addContract: language === 'ar' ? 'إضافة عقد' : 'Add Contract',
    exportExcel: language === 'ar' ? 'تصدير إكسل' : 'Export Excel',
    print: language === 'ar' ? 'طباعة' : 'Print',
    search:
      language === 'ar'
        ? 'بحث برقم العقد أو اسم العميل...'
        : 'Search by contract number or customer name...',
    allTypes: language === 'ar' ? 'جميع الأنواع' : 'All Types',
    mediation: language === 'ar' ? 'وساطة' : 'Mediation',
    operation: language === 'ar' ? 'تشغيل' : 'Operation',
    sponsorship: language === 'ar' ? 'كفالة' : 'Sponsorship',
    rent: language === 'ar' ? 'إيجار' : 'Rent',
    allStatuses: language === 'ar' ? 'جميع الحالات' : 'All Statuses',
    active: language === 'ar' ? 'نشط' : 'Active',
    pending: language === 'ar' ? 'معلق' : 'Pending',
    completed: language === 'ar' ? 'مكتمل' : 'Completed',
    cancelled: language === 'ar' ? 'ملغى' : 'Cancelled',
    expired: language === 'ar' ? 'منتهي' : 'Expired',
    allNationalities: language === 'ar' ? 'جميع الجنسيات' : 'All Nationalities',
    totalContracts: language === 'ar' ? 'إجمالي العقود' : 'Total Contracts',
    activeContracts: language === 'ar' ? 'عقود نشطة' : 'Active Contracts',
    pendingContracts: language === 'ar' ? 'عقود معلقة' : 'Pending Contracts',
    totalRevenue: language === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue',
    contractNumber: language === 'ar' ? 'رقم العقد' : 'Contract Number',
    customer: language === 'ar' ? 'العميل' : 'Customer',
    type: language === 'ar' ? 'النوع' : 'Type',
    status: language === 'ar' ? 'الحالة' : 'Status',
    amount: language === 'ar' ? 'المبلغ' : 'Amount',
    paid: language === 'ar' ? 'المدفوع' : 'Paid',
    remaining: language === 'ar' ? 'المتبقي' : 'Remaining',
    startDate: language === 'ar' ? 'تاريخ البداية' : 'Start Date',
    endDate: language === 'ar' ? 'تاريخ الانتهاء' : 'End Date',
    nationality: language === 'ar' ? 'الجنسية' : 'Nationality',
    profession: language === 'ar' ? 'المهنة' : 'Profession',
    agent: language === 'ar' ? 'الوكيل' : 'Agent',
    edit: language === 'ar' ? 'تعديل' : 'Edit',
    delete: language === 'ar' ? 'حذف' : 'Delete',
    noResults: language === 'ar' ? 'لا توجد نتائج' : 'No results found',
    phone: language === 'ar' ? 'الهاتف' : 'Phone',
    paymentProgress: language === 'ar' ? 'تقدم الدفع' : 'Payment Progress',
    addNote: language === 'ar' ? 'إضافة ملاحظة' : 'Add Note',
    addComplaint: language === 'ar' ? 'إضافة شكوى' : 'Add Complaint',
    addContact: language === 'ar' ? 'إضافة اتصال' : 'Add Contact',
    payBill: language === 'ar' ? 'دفع الفاتورة' : 'Pay Bill',
    addInsurance: language === 'ar' ? 'إضافة تأمين' : 'Add Insurance',
    releaseApplicant: language === 'ar' ? 'تحرير المتقدم' : 'Release Applicant',
    addDelegate: language === 'ar' ? 'إضافة مندوب' : 'Add Delegate',
    changeType: language === 'ar' ? 'تغيير النوع' : 'Change Type',
    cancel: language === 'ar' ? 'إلغاء' : 'Cancel',
    followUpStatus: language === 'ar' ? 'حالة المتابعة' : 'Follow-up Status',
    actions: language === 'ar' ? 'الإجراءات' : 'Actions',
  };

  // Filter contracts
  const filteredContracts = useMemo(() => {
    return mockContracts.filter((contract) => {
      const searchLower = searchText.toLowerCase();
      const matchesSearch =
        !searchText ||
        contract.contractNumber.includes(searchText) ||
        contract.customerName.toLowerCase().includes(searchLower) ||
        contract.customerNameAr.includes(searchText);

      const matchesType = typeFilter === 'all' || contract.contractType === typeFilter;
      const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
      const matchesNationality =
        nationalityFilter === 'all' || contract.nationality === nationalityFilter;

      return matchesSearch && matchesType && matchesStatus && matchesNationality;
    });
  }, [searchText, typeFilter, statusFilter, nationalityFilter]);

  // Statistics
  const stats = useMemo(
    () => ({
      total: mockContracts.length,
      active: mockContracts.filter((c) => c.status === 'active').length,
      pending: mockContracts.filter((c) => c.status === 'pending').length,
      revenue: mockContracts.reduce((sum, c) => sum + c.totalAmount, 0),
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

  const getTypeTag = (type: string) => {
    const config: Record<string, { color: string; label: string }> = {
      mediation: { color: 'blue', label: t.mediation },
      operation: { color: 'green', label: t.operation },
      sponsorship: { color: 'purple', label: t.sponsorship },
      rent: { color: 'orange', label: t.rent },
    };
    return config[type] || { color: 'default', label: type };
  };

  const getStatusConfig = (status: string) => {
    const config: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
      active: { color: 'success', label: t.active, icon: <CheckCircleOutlined /> },
      pending: { color: 'warning', label: t.pending, icon: <ClockCircleOutlined /> },
      completed: { color: 'success', label: t.completed, icon: <CheckCircleOutlined /> },
      cancelled: { color: 'error', label: t.cancelled, icon: <ExclamationCircleOutlined /> },
      expired: { color: 'default', label: t.expired, icon: <ClockCircleOutlined /> },
    };
    return config[status] || { color: 'default', label: status, icon: <ClockCircleOutlined /> };
  };

  const renderContractCard = (contract: Contract) => {
    const paymentProgress = (contract.paidAmount / contract.totalAmount) * 100;
    const statusConfig = getStatusConfig(contract.status);
    const typeTag = getTypeTag(contract.contractType);

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
                </div>
              </div>

              {/* Contract Type & Status */}
              <div className={styles.tagsSection}>
                <Tag color={typeTag.color} className={styles.typeTag}>
                  {typeTag.label}
                </Tag>
                <Badge status={statusConfig.color as any} text={statusConfig.label} />
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

              {/* Contract Details */}
              <div className={styles.detailsSection}>
                <div className={styles.detailItem}>
                  <EnvironmentOutlined className={styles.detailIcon} />
                  <div className={styles.detailText}>
                    <span className={styles.detailLabel}>{t.nationality}</span>
                    <span className={styles.detailValue}>
                      {language === 'ar' ? contract.nationalityAr : contract.nationality}
                    </span>
                  </div>
                </div>
                <div className={styles.detailItem}>
                  <TeamOutlined className={styles.detailIcon} />
                  <div className={styles.detailText}>
                    <span className={styles.detailLabel}>{t.profession}</span>
                    <span className={styles.detailValue}>
                      {language === 'ar' ? contract.professionAr : contract.profession}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className={styles.cardRight}>
              {/* Payment Progress */}
              <div className={styles.paymentSection}>
                <div className={styles.paymentHeader}>
                  <span className={styles.paymentLabel}>{t.paymentProgress}</span>
                  <span className={styles.paymentPercentage}>{Math.round(paymentProgress)}%</span>
                </div>
                <Progress
                  percent={paymentProgress}
                  showInfo={false}
                  strokeColor={{
                    '0%': '#003366',
                    '100%': '#0056b3',
                  }}
                />
                <div className={styles.paymentAmounts}>
                  <div className={styles.amountItem}>
                    <span className={styles.amountLabel}>{t.paid}</span>
                    <span className={styles.amountValue}>
                      {formatCurrency(contract.paidAmount)}
                    </span>
                  </div>
                  <div className={styles.amountItem}>
                    <span className={styles.amountLabel}>{t.remaining}</span>
                    <span className={styles.amountValue}>
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
                className={styles.actionBtn}
                block
              >
                {t.payBill}
              </Button>
              <Button
                type="link"
                icon={<SafetyOutlined />}
                className={`${styles.actionBtn} ${styles.successBtn}`}
                block
              >
                {t.addInsurance}
              </Button>
              <Button type="link" icon={<UserDeleteOutlined />} className={styles.actionBtn} block>
                {t.releaseApplicant}
              </Button>
              <Button
                type="link"
                icon={<UserAddOutlined />}
                className={`${styles.actionBtn} ${styles.successBtn}`}
                block
              >
                {t.addDelegate}
              </Button>
              <Button
                type="link"
                icon={<SwapOutlined />}
                className={`${styles.actionBtn} ${styles.dangerBtn}`}
                block
              >
                {t.changeType}
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
              value={typeFilter}
              onChange={setTypeFilter}
              style={{ width: '100%' }}
              size="large"
              options={[
                { value: 'all', label: t.allTypes },
                { value: 'mediation', label: t.mediation },
                { value: 'operation', label: t.operation },
                { value: 'sponsorship', label: t.sponsorship },
                { value: 'rent', label: t.rent },
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
                { value: 'active', label: t.active },
                { value: 'pending', label: t.pending },
                { value: 'completed', label: t.completed },
                { value: 'cancelled', label: t.cancelled },
                { value: 'expired', label: t.expired },
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
                { value: 'Sri Lanka', label: language === 'ar' ? 'سريلانكا' : 'Sri Lanka' },
              ]}
            />
          </Col>
        </Row>
      </Card>

      {/* Results Info */}
      <div className={styles.resultsInfo}>
        <span>
          {language === 'ar'
            ? `عرض ${filteredContracts.length} من ${mockContracts.length} عقد`
            : `Showing ${filteredContracts.length} of ${mockContracts.length} contracts`}
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
        width={600}
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
                    status={getStatusConfig(selectedContract.status).color as any}
                    text={getStatusConfig(selectedContract.status).label}
                  />
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
                  <h4>{t.amount}</h4>
                  <p className={styles.modalValue}>
                    {formatCurrency(selectedContract.totalAmount)}
                  </p>
                </div>
              </Col>
              <Col span={8}>
                <div className={styles.modalSection}>
                  <h4>{t.paid}</h4>
                  <p className={styles.modalValue} style={{ color: '#52c41a' }}>
                    {formatCurrency(selectedContract.paidAmount)}
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
