'use client';

import React, { useState, useMemo } from 'react';
import {
  Card,
  Button,
  Input,
  Select,
  Modal,
  Form,
  Statistic,
  Tag,
  Empty,
  InputNumber,
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  SwapOutlined,
  HomeOutlined,
  CalendarOutlined,
  PrinterOutlined,
  FileExcelOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  UserOutlined,
  PhoneOutlined,
  IdcardOutlined,
  GlobalOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/store/authStore';
import styles from './Warranty.module.css';

interface WarrantyContract {
  id: string;
  contractNumber: string;
  contractId: number;
  customerName: string;
  customerPhone: string;
  customerId: string;
  applicantName: string;
  applicantRef: string;
  visaNumber: string;
  visaCountry: string;
  arrivalCity: string;
  arrivalDate: string;
  arrivalConfirm: string;
  daysLeftWarranty: number;
  branchName: string;
  requestType: string;
  status: 'Active' | 'Expired' | 'Expiring Soon' | 'Pending';
}

interface WarrantyStats {
  total: number;
  active: number;
  expiringSoon: number;
  expired: number;
}

// Mock data generation
const generateMockWarranties = (): WarrantyContract[] => [
  {
    id: '169393',
    contractNumber: '6654',
    contractId: 169393,
    customerName: 'سعد علي بن حطفر المساعد',
    customerPhone: '0542222454',
    customerId: '1020411656',
    applicantName: 'MUHAMMAD NOOR',
    applicantRef: 'RW0160681',
    visaNumber: '1907715876',
    visaCountry: 'Pakistan',
    arrivalCity: 'Jeddah',
    arrivalDate: '2026-01-14',
    arrivalConfirm: '2026-01-14',
    daysLeftWarranty: 90,
    branchName: 'Sigma competences recruitment office',
    requestType: 'تفويض باكستان',
    status: 'Active',
  },
  {
    id: '168104',
    contractNumber: '6562',
    contractId: 168104,
    customerName: 'محمد أحمد العتيبي',
    customerPhone: '0551234567',
    customerId: '1025789456',
    applicantName: 'FATIMA ALI',
    applicantRef: 'RW0160542',
    visaNumber: '1907654321',
    visaCountry: 'Philippines',
    arrivalCity: 'Riyadh',
    arrivalDate: '2025-12-31',
    arrivalConfirm: '2025-12-31',
    daysLeftWarranty: 76,
    branchName: 'Sigma competences recruitment office',
    requestType: 'تفويض فلبين',
    status: 'Active',
  },
  {
    id: '168068',
    contractNumber: '6558',
    contractId: 168068,
    customerName: 'عبدالله خالد السالم',
    customerPhone: '0559876543',
    customerId: '1030456789',
    applicantName: 'SARAH KHAN',
    applicantRef: 'RW0160498',
    visaNumber: '1907789012',
    visaCountry: 'Indonesia',
    arrivalCity: 'Dammam',
    arrivalDate: '2026-01-07',
    arrivalConfirm: '2026-01-07',
    daysLeftWarranty: 83,
    branchName: 'SIGMA',
    requestType: 'تفويض اندونيسيا',
    status: 'Active',
  },
  {
    id: '167984',
    contractNumber: '6545',
    contractId: 167984,
    customerName: 'فهد سعود الدوسري',
    customerPhone: '0561112223',
    customerId: '1035123456',
    applicantName: 'ROSE MARIE',
    applicantRef: 'RW0160412',
    visaNumber: '1907456789',
    visaCountry: 'Philippines',
    arrivalCity: 'Jeddah',
    arrivalDate: '2026-01-01',
    arrivalConfirm: '2026-01-01',
    daysLeftWarranty: 77,
    branchName: 'Sigma competences recruitment office',
    requestType: 'تفويض فلبين',
    status: 'Active',
  },
  {
    id: '167941',
    contractNumber: '6539',
    contractId: 167941,
    customerName: 'نورة محمد العنزي',
    customerPhone: '0573334445',
    customerId: '1040789012',
    applicantName: 'MARIA SANTOS',
    applicantRef: 'RW0160389',
    visaNumber: '1907321654',
    visaCountry: 'Philippines',
    arrivalCity: 'Riyadh',
    arrivalDate: '2025-12-20',
    arrivalConfirm: '2025-12-20',
    daysLeftWarranty: 25,
    branchName: 'Sigma competences recruitment office',
    requestType: 'تفويض فلبين',
    status: 'Expiring Soon',
  },
  {
    id: '167910',
    contractNumber: '6532',
    contractId: 167910,
    customerName: 'خالد إبراهيم القحطاني',
    customerPhone: '0585556667',
    customerId: '1045456123',
    applicantName: 'JOHN DELA CRUZ',
    applicantRef: 'RW0160356',
    visaNumber: '1907987654',
    visaCountry: 'Philippines',
    arrivalCity: 'Dammam',
    arrivalDate: '2025-11-15',
    arrivalConfirm: '2025-11-15',
    daysLeftWarranty: 0,
    branchName: 'SIGMA',
    requestType: 'تفويض فلبين',
    status: 'Expired',
  },
  {
    id: '167895',
    contractNumber: '6528',
    contractId: 167895,
    customerName: 'سارة عبدالرحمن الشمري',
    customerPhone: '0597778889',
    customerId: '1050123789',
    applicantName: 'RINA PUTRI',
    applicantRef: 'RW0160334',
    visaNumber: '1907654987',
    visaCountry: 'Indonesia',
    arrivalCity: 'Jeddah',
    arrivalDate: '2026-01-06',
    arrivalConfirm: '2026-01-06',
    daysLeftWarranty: 82,
    branchName: 'Sigma competences recruitment office',
    requestType: 'تفويض اندونيسيا',
    status: 'Active',
  },
  {
    id: '167893',
    contractNumber: '6525',
    contractId: 167893,
    customerName: 'أحمد يوسف الحربي',
    customerPhone: '0501239876',
    customerId: '1055789456',
    applicantName: 'AMINA HASSAN',
    applicantRef: 'RW0160312',
    visaNumber: '1907321987',
    visaCountry: 'Kenya',
    arrivalCity: 'Riyadh',
    arrivalDate: '2025-12-28',
    arrivalConfirm: '2025-12-28',
    daysLeftWarranty: 18,
    branchName: 'SIGMA',
    requestType: 'تفويض كينيا',
    status: 'Expiring Soon',
  },
  {
    id: '167789',
    contractNumber: '6518',
    contractId: 167789,
    customerName: 'منى علي المطيري',
    customerPhone: '0554567890',
    customerId: '1060456123',
    applicantName: 'GRACE JOHNSON',
    applicantRef: 'RW0160289',
    visaNumber: '1907789321',
    visaCountry: 'Uganda',
    arrivalCity: 'Dammam',
    arrivalDate: '2026-01-07',
    arrivalConfirm: '2026-01-07',
    daysLeftWarranty: 83,
    branchName: 'Sigma competences recruitment office',
    requestType: 'تفويض اوغندا',
    status: 'Active',
  },
  {
    id: '167712',
    contractNumber: '6512',
    contractId: 167712,
    customerName: 'يوسف حسن الغامدي',
    customerPhone: '0567891234',
    customerId: '1065123789',
    applicantName: 'NIMRA BIBI',
    applicantRef: 'RW0160267',
    visaNumber: '1907456321',
    visaCountry: 'Pakistan',
    arrivalCity: 'Jeddah',
    arrivalDate: '2026-01-07',
    arrivalConfirm: '2026-01-07',
    daysLeftWarranty: 83,
    branchName: 'SIGMA',
    requestType: 'تفويض باكستان',
    status: 'Active',
  },
];

const getWarrantyStats = (warranties: WarrantyContract[]): WarrantyStats => ({
  total: warranties.length,
  active: warranties.filter((w) => w.status === 'Active').length,
  expiringSoon: warranties.filter((w) => w.status === 'Expiring Soon').length,
  expired: warranties.filter((w) => w.status === 'Expired').length,
});

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'Active':
      return { color: '#52c41a', icon: <CheckCircleOutlined />, label: 'نشط' };
    case 'Expired':
      return { color: '#ff4d4f', icon: <WarningOutlined />, label: 'منتهي' };
    case 'Expiring Soon':
      return { color: '#faad14', icon: <ClockCircleOutlined />, label: 'ينتهي قريباً' };
    default:
      return { color: '#1890ff', icon: <ClockCircleOutlined />, label: 'معلق' };
  }
};

export default function WarrantyPage() {
  const language = useAuthStore((state) => state.language);
  const [warranties] = useState<WarrantyContract[]>(generateMockWarranties());
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [modalType, setModalType] = useState<string | null>(null);
  const [selectedContract, setSelectedContract] = useState<WarrantyContract | null>(null);
  const [form] = Form.useForm();

  const filteredWarranties = useMemo(() => {
    return warranties.filter((w) => {
      const matchesSearch =
        w.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.applicantName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !filterStatus || w.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [warranties, searchTerm, filterStatus]);

  const stats = useMemo(() => getWarrantyStats(warranties), [warranties]);

  const handleModalOpen = (type: string, contract?: WarrantyContract) => {
    setModalType(type);
    if (contract) {
      setSelectedContract(contract);
    }
  };

  const handleModalClose = () => {
    setModalType(null);
    setSelectedContract(null);
    form.resetFields();
  };

  const handleModalSubmit = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      handleModalClose();
    }, 1000);
  };

  const renderWarrantyCard = (warranty: WarrantyContract) => {
    const statusConfig = getStatusConfig(warranty.status);

    return (
      <Card key={warranty.id} className={styles.warrantyCard}>
        {/* Card Header */}
        <div className={styles.cardHeader}>
          <div className={styles.contractBadge}>
            <span className={styles.contractNumber}>{warranty.contractNumber}</span>
            <Tag color={statusConfig.color} icon={statusConfig.icon}>
              {statusConfig.label}
            </Tag>
          </div>
          <div className={styles.warrantyDays}>
            <span className={styles.daysNumber}>{warranty.daysLeftWarranty}</span>
            <span className={styles.daysLabel}>
              {language === 'ar' ? 'يوم متبقي' : 'Days Left'}
            </span>
          </div>
        </div>

        {/* Customer Section */}
        <div className={styles.cardSection}>
          <div className={styles.sectionTitle}>
            <UserOutlined /> {language === 'ar' ? 'بيانات العميل' : 'Customer Info'}
          </div>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>{language === 'ar' ? 'الاسم' : 'Name'}</span>
              <span className={styles.infoValue}>{warranty.customerName}</span>
            </div>
            <div className={styles.infoItem}>
              <PhoneOutlined className={styles.infoIcon} />
              <span className={styles.infoValue}>{warranty.customerPhone}</span>
            </div>
            <div className={styles.infoItem}>
              <IdcardOutlined className={styles.infoIcon} />
              <span className={styles.infoValue}>{warranty.customerId}</span>
            </div>
          </div>
        </div>

        {/* Applicant Section */}
        <div className={styles.cardSection}>
          <div className={styles.sectionTitle}>
            <GlobalOutlined /> {language === 'ar' ? 'بيانات العامل' : 'Applicant Info'}
          </div>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>{language === 'ar' ? 'الاسم' : 'Name'}</span>
              <span className={styles.infoValue}>{warranty.applicantName}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>{language === 'ar' ? 'المرجع' : 'Ref'}</span>
              <span className={styles.infoValue}>{warranty.applicantRef}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>{language === 'ar' ? 'التأشيرة' : 'Visa'}</span>
              <span className={styles.infoValue}>{warranty.visaNumber}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>{language === 'ar' ? 'البلد' : 'Country'}</span>
              <Tag color="blue">{warranty.visaCountry}</Tag>
            </div>
          </div>
        </div>

        {/* Arrival Info */}
        <div className={styles.arrivalInfo}>
          <div className={styles.arrivalItem}>
            <CalendarOutlined />
            <span>
              {language === 'ar' ? 'الوصول' : 'Arrival'}: {warranty.arrivalDate}
            </span>
          </div>
          <div className={styles.arrivalItem}>
            <HomeOutlined />
            <span>{warranty.arrivalCity}</span>
          </div>
        </div>

        {/* Card Actions */}
        <div className={styles.cardActions}>
          <Button
            type="primary"
            size="small"
            icon={<PlusOutlined />}
            onClick={() => handleModalOpen('extend', warranty)}
          >
            {language === 'ar' ? 'تمديد الضمان' : 'Extend'}
          </Button>
          <Button
            size="small"
            icon={<SwapOutlined />}
            onClick={() => handleModalOpen('transfer', warranty)}
          >
            {language === 'ar' ? 'نقل الكفالة' : 'Transfer'}
          </Button>
          <Button
            size="small"
            icon={<HomeOutlined />}
            onClick={() => handleModalOpen('housing', warranty)}
          >
            {language === 'ar' ? 'إعادة للإيواء' : 'Housing'}
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerTitle}>
            <SafetyOutlined className={styles.headerIcon} />
            <div>
              <h1>{language === 'ar' ? 'إدارة الضمان' : 'Warranty Management'}</h1>
              <p className={styles.headerSubtitle}>
                {language === 'ar'
                  ? 'متابعة وإدارة ضمانات العقود'
                  : 'Track and manage contract warranties'}
              </p>
            </div>
          </div>
          <div className={styles.headerActions}>
            <Button icon={<FileExcelOutlined />} className={styles.secondaryBtn}>
              {language === 'ar' ? 'تصدير Excel' : 'Export Excel'}
            </Button>
            <Button icon={<PrinterOutlined />} className={styles.secondaryBtn}>
              {language === 'ar' ? 'طباعة' : 'Print'}
            </Button>
            <Button type="primary" icon={<PlusOutlined />} className={styles.primaryBtn}>
              {language === 'ar' ? 'إضافة ضمان' : 'Add Warranty'}
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <Statistic
            title={language === 'ar' ? 'إجمالي العقود' : 'Total Contracts'}
            value={stats.total}
            valueStyle={{ color: '#003366' }}
            prefix={<SafetyOutlined style={{ color: '#003366' }} />}
          />
        </Card>
        <Card className={styles.statCard}>
          <Statistic
            title={language === 'ar' ? 'ضمانات نشطة' : 'Active Warranties'}
            value={stats.active}
            valueStyle={{ color: '#52c41a' }}
            prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
          />
        </Card>
        <Card className={styles.statCard}>
          <Statistic
            title={language === 'ar' ? 'تنتهي قريباً' : 'Expiring Soon'}
            value={stats.expiringSoon}
            valueStyle={{ color: '#faad14' }}
            prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
          />
        </Card>
        <Card className={styles.statCard}>
          <Statistic
            title={language === 'ar' ? 'منتهية' : 'Expired'}
            value={stats.expired}
            valueStyle={{ color: '#ff4d4f' }}
            prefix={<WarningOutlined style={{ color: '#ff4d4f' }} />}
          />
        </Card>
      </div>

      {/* Filters */}
      <Card className={styles.filterCard}>
        <div className={styles.filterGrid}>
          <Input
            placeholder={
              language === 'ar' ? 'بحث بالاسم أو رقم العقد...' : 'Search by name or contract...'
            }
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <Select
            allowClear
            placeholder={language === 'ar' ? 'حالة الضمان' : 'Status'}
            value={filterStatus || undefined}
            onChange={(val) => setFilterStatus(val || '')}
            style={{ minWidth: 150 }}
            options={[
              { label: language === 'ar' ? 'نشط' : 'Active', value: 'Active' },
              { label: language === 'ar' ? 'منتهي' : 'Expired', value: 'Expired' },
              {
                label: language === 'ar' ? 'ينتهي قريباً' : 'Expiring Soon',
                value: 'Expiring Soon',
              },
            ]}
          />
          <div className={styles.resultsCount}>
            {language === 'ar'
              ? `عرض ${filteredWarranties.length} من ${stats.total}`
              : `Showing ${filteredWarranties.length} of ${stats.total}`}
          </div>
        </div>
      </Card>

      {/* Warranties Grid */}
      {filteredWarranties.length === 0 ? (
        <Empty description={language === 'ar' ? 'لا توجد ضمانات' : 'No warranties found'} />
      ) : (
        <div className={styles.warrantiesGrid}>
          {filteredWarranties.map((warranty) => renderWarrantyCard(warranty))}
        </div>
      )}

      {/* Extend Warranty Modal */}
      <Modal
        title={
          selectedContract
            ? `${language === 'ar' ? 'تمديد فترة الضمان - عقد' : 'Extend Warranty - Contract'} #${selectedContract.contractNumber}`
            : language === 'ar'
              ? 'تمديد فترة الضمان'
              : 'Extend Warranty Period'
        }
        open={modalType === 'extend'}
        onCancel={handleModalClose}
        onOk={handleModalSubmit}
        confirmLoading={loading}
        okText={language === 'ar' ? 'حفظ' : 'Save'}
        cancelText={language === 'ar' ? 'إلغاء' : 'Cancel'}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label={language === 'ar' ? 'عدد أيام الضمان' : 'Warranty Days'}
            name="warrantyDays"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label={language === 'ar' ? 'ملاحظات' : 'Notes'} name="notes">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Transfer Modal */}
      <Modal
        title={
          selectedContract
            ? `${language === 'ar' ? 'نقل الكفالة - عقد' : 'Transfer Sponsorship - Contract'} #${selectedContract.contractNumber}`
            : language === 'ar'
              ? 'نقل الكفالة'
              : 'Transfer Sponsorship'
        }
        open={modalType === 'transfer'}
        onCancel={handleModalClose}
        onOk={handleModalSubmit}
        confirmLoading={loading}
        okText={language === 'ar' ? 'حفظ' : 'Save'}
        cancelText={language === 'ar' ? 'إلغاء' : 'Cancel'}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label={language === 'ar' ? 'مصاريف نقل الكفالة' : 'Transfer Fees'}
            name="transferFees"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label={language === 'ar' ? 'مصروف الجوازات' : 'Passport Fees'}
            name="passportFees"
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label={language === 'ar' ? 'إجمالي المبلغ' : 'Total Amount'}
            name="totalAmount"
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Housing Modal */}
      <Modal
        title={
          selectedContract
            ? `${language === 'ar' ? 'إعادة العاملة للإيواء - عقد' : 'Return to Housing - Contract'} #${selectedContract.contractNumber}`
            : language === 'ar'
              ? 'إعادة العاملة للإيواء'
              : 'Return to Housing'
        }
        open={modalType === 'housing'}
        onCancel={handleModalClose}
        onOk={handleModalSubmit}
        confirmLoading={loading}
        okText={language === 'ar' ? 'حفظ' : 'Save'}
        cancelText={language === 'ar' ? 'إلغاء' : 'Cancel'}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label={language === 'ar' ? 'السكن' : 'Housing'}
            name="housingId"
            rules={[{ required: true }]}
          >
            <Select
              placeholder={language === 'ar' ? 'اختر السكن' : 'Select Housing'}
              options={[
                { label: 'سكن صاري', value: '50' },
                { label: 'مخزون التاجير سيجما الكفاءات', value: '73' },
                { label: 'مخزون التاجير / سيجما', value: '115' },
                { label: 'مخزون التاجير / التطبيق', value: '116' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
