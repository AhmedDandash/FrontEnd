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
  Row,
  Col,
  Switch,
  Tooltip,
  Timeline,
  Divider,
} from 'antd';
import {
  SearchOutlined,
  PrinterOutlined,
  FileExcelOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  UserOutlined,
  PhoneOutlined,
  IdcardOutlined,
  GlobalOutlined,
  CalendarOutlined,
  FieldTimeOutlined,
  RocketOutlined,
  CloseCircleOutlined,
  MailOutlined,
  StarOutlined,
  FilterOutlined,
  EyeOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/store/authStore';
import styles from './ArrivalReport.module.css';

interface ArrivalContract {
  id: string;
  contractNumber: string;
  contractId: number;
  customerName: string;
  customerPhone: string;
  customerId: string;
  status: string;
  agentStatus: string;
  nationality: string;
  visaNumber: string;
  visaStatus: 'Issued' | 'Pending' | 'Expired';
  agentName: string;
  createdSinceDays: number;
  createdDate: string;
  createdBy: string;
  signedDate: string;
  arrivalDate: string;
  arrivalTime: string;
  arrivalPlace: string;
  carrierLine: string;
  flightNumber: string;
  branchName: string;
  isRated: boolean;
  showCount: number;
  otherCount: number;
  remainingCount: number;
}

interface ArrivalStats {
  total: number;
  arrivedToday: number;
  pendingArrival: number;
  rated: number;
}

// Mock data generation
const generateMockArrivals = (): ArrivalContract[] => [
  {
    id: '169393',
    contractNumber: '6654',
    contractId: 169393,
    customerName: 'سعد علي بن حطفر المساعد',
    customerPhone: '0542222454',
    customerId: '1020411656',
    status: 'Has Arrived',
    agentStatus: 'Booked ticket',
    nationality: 'Pakistan',
    visaNumber: '1907715876',
    visaStatus: 'Issued',
    agentName: 'تفويض باكستان',
    createdSinceDays: 22,
    createdDate: '2025-12-23',
    createdBy: 'مهند احمد مساعد المحضار',
    signedDate: '2025-12-23',
    arrivalDate: '2026-01-14',
    arrivalTime: '04:45 PM',
    arrivalPlace: 'Jeddah',
    carrierLine: 'Saudi Airlines',
    flightNumber: 'SV-842',
    branchName: 'Sigma competences recruitment office',
    isRated: false,
    showCount: 1754,
    otherCount: 0,
    remainingCount: 0,
  },
  {
    id: '168104',
    contractNumber: '6562',
    contractId: 168104,
    customerName: 'دلال عبدالله عبدالكريم المدني',
    customerPhone: '0563018333',
    customerId: '1066803089',
    status: 'Has Arrived',
    agentStatus: 'Booked ticket',
    nationality: 'Philippines',
    visaNumber: '1907823456',
    visaStatus: 'Issued',
    agentName: 'ALHABESHI International Services Inc.',
    createdSinceDays: 20,
    createdDate: '2025-12-11',
    createdBy: 'نداء خالد محمد نائل',
    signedDate: '2025-12-15',
    arrivalDate: '2026-01-12',
    arrivalTime: '10:30 AM',
    arrivalPlace: 'Riyadh',
    carrierLine: 'Emirates',
    flightNumber: 'EK-321',
    branchName: 'Sigma competences recruitment office',
    isRated: true,
    showCount: 1200,
    otherCount: 5,
    remainingCount: 2,
  },
  {
    id: '168068',
    contractNumber: '6548',
    contractId: 168068,
    customerName: 'محمد عبدالرحمن السالم',
    customerPhone: '0501234567',
    customerId: '1098765432',
    status: 'Pending',
    agentStatus: 'Stamped',
    nationality: 'Indonesia',
    visaNumber: '1907934567',
    visaStatus: 'Issued',
    agentName: 'POLY WORLD SERVICE',
    createdSinceDays: 27,
    createdDate: '2025-12-08',
    createdBy: 'أحمد محمد علي',
    signedDate: '2025-12-10',
    arrivalDate: '2026-01-20',
    arrivalTime: '02:15 PM',
    arrivalPlace: 'Dammam',
    carrierLine: 'Qatar Airways',
    flightNumber: 'QR-456',
    branchName: 'SIGMA',
    isRated: false,
    showCount: 890,
    otherCount: 3,
    remainingCount: 5,
  },
  {
    id: '167984',
    contractNumber: '6532',
    contractId: 167984,
    customerName: 'فاطمة أحمد الزهراني',
    customerPhone: '0559876543',
    customerId: '1087654321',
    status: 'Has Arrived',
    agentStatus: 'Travel Clearance Done',
    nationality: 'Kenya',
    visaNumber: '1908012345',
    visaStatus: 'Issued',
    agentName: 'EAMAL SOLUTIONS LIMITED',
    createdSinceDays: 22,
    createdDate: '2025-12-05',
    createdBy: 'سارة عبدالله',
    signedDate: '2025-12-08',
    arrivalDate: '2026-01-10',
    arrivalTime: '08:00 AM',
    arrivalPlace: 'Jeddah',
    carrierLine: 'Flynas',
    flightNumber: 'XY-789',
    branchName: 'Sigma competences recruitment office',
    isRated: true,
    showCount: 2100,
    otherCount: 10,
    remainingCount: 0,
  },
  {
    id: '167941',
    contractNumber: '6520',
    contractId: 167941,
    customerName: 'خالد سعود العتيبي',
    customerPhone: '0571112223',
    customerId: '1076543210',
    status: 'Pending',
    agentStatus: 'Booked ticket',
    nationality: 'Uganda',
    visaNumber: '1908123456',
    visaStatus: 'Pending',
    agentName: 'GLOBAL MANPOWER SOLUTION (U) LIMITED',
    createdSinceDays: 35,
    createdDate: '2025-11-28',
    createdBy: 'عمر فهد',
    signedDate: '2025-12-01',
    arrivalDate: '2026-01-25',
    arrivalTime: '11:45 AM',
    arrivalPlace: 'Riyadh',
    carrierLine: 'Ethiopian Airlines',
    flightNumber: 'ET-654',
    branchName: 'SIGMA',
    isRated: false,
    showCount: 650,
    otherCount: 2,
    remainingCount: 8,
  },
  {
    id: '167910',
    contractNumber: '6508',
    contractId: 167910,
    customerName: 'نورة محمد الشمري',
    customerPhone: '0533334445',
    customerId: '1065432109',
    status: 'Has Arrived',
    agentStatus: 'Booked ticket',
    nationality: 'Bangladesh',
    visaNumber: '1908234567',
    visaStatus: 'Issued',
    agentName: 'WELCOME ENTERPRISES',
    createdSinceDays: 27,
    createdDate: '2025-11-25',
    createdBy: 'ليلى أحمد',
    signedDate: '2025-11-28',
    arrivalDate: '2026-01-08',
    arrivalTime: '06:30 PM',
    arrivalPlace: 'Jeddah',
    carrierLine: 'Biman Bangladesh',
    flightNumber: 'BG-321',
    branchName: 'Sigma competences recruitment office',
    isRated: false,
    showCount: 1450,
    otherCount: 0,
    remainingCount: 1,
  },
  {
    id: '167895',
    contractNumber: '6495',
    contractId: 167895,
    customerName: 'عبدالله فهد القحطاني',
    customerPhone: '0544445556',
    customerId: '1054321098',
    status: 'Has Arrived',
    agentStatus: 'Travel Clearance Done',
    nationality: 'India',
    visaNumber: '1908345678',
    visaStatus: 'Issued',
    agentName: 'AL ARHAM HR SERVICES PVT LTD',
    createdSinceDays: 27,
    createdDate: '2025-11-22',
    createdBy: 'محمد سعيد',
    signedDate: '2025-11-25',
    arrivalDate: '2026-01-05',
    arrivalTime: '09:15 AM',
    arrivalPlace: 'Dammam',
    carrierLine: 'Air India',
    flightNumber: 'AI-987',
    branchName: 'SIGMA',
    isRated: true,
    showCount: 1800,
    otherCount: 5,
    remainingCount: 0,
  },
  {
    id: '167893',
    contractNumber: '6490',
    contractId: 167893,
    customerName: 'ريم سلطان الدوسري',
    customerPhone: '0555556667',
    customerId: '1043210987',
    status: 'Pending',
    agentStatus: 'Stamped',
    nationality: 'Sri Lanka',
    visaNumber: '1908456789',
    visaStatus: 'Issued',
    agentName: 'CAREEM LANKA OVERSEAS (PVT) LTD',
    createdSinceDays: 35,
    createdDate: '2025-11-20',
    createdBy: 'هند خالد',
    signedDate: '2025-11-23',
    arrivalDate: '2026-01-28',
    arrivalTime: '03:00 PM',
    arrivalPlace: 'Riyadh',
    carrierLine: 'SriLankan Airlines',
    flightNumber: 'UL-456',
    branchName: 'Sigma competences recruitment office',
    isRated: false,
    showCount: 920,
    otherCount: 1,
    remainingCount: 4,
  },
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'Has Arrived':
      return { color: '#52c41a', label: 'Has Arrived', icon: <CheckCircleOutlined /> };
    case 'Pending':
      return { color: '#faad14', label: 'Pending', icon: <ClockCircleOutlined /> };
    default:
      return { color: '#1890ff', label: status, icon: <ClockCircleOutlined /> };
  }
};

const getVisaStatusColor = (status: string) => {
  switch (status) {
    case 'Issued':
      return 'success';
    case 'Pending':
      return 'warning';
    case 'Expired':
      return 'error';
    default:
      return 'default';
  }
};

export default function ArrivalReportPage() {
  const language = useAuthStore((state) => state.language);
  const [arrivals] = useState<ArrivalContract[]>(generateMockArrivals());
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterNationality, setFilterNationality] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedArrival, setSelectedArrival] = useState<ArrivalContract | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [form] = Form.useForm();

  const filteredArrivals = useMemo(() => {
    return arrivals.filter((a) => {
      const matchesSearch =
        a.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.customerId.includes(searchTerm);
      const matchesStatus = !filterStatus || a.status === filterStatus;
      const matchesNationality = !filterNationality || a.nationality === filterNationality;
      return matchesSearch && matchesStatus && matchesNationality;
    });
  }, [arrivals, searchTerm, filterStatus, filterNationality]);

  const stats: ArrivalStats = useMemo(() => {
    return {
      total: arrivals.length,
      arrivedToday: arrivals.filter((a) => a.status === 'Has Arrived').length,
      pendingArrival: arrivals.filter((a) => a.status === 'Pending').length,
      rated: arrivals.filter((a) => a.isRated).length,
    };
  }, [arrivals]);

  const nationalities = useMemo(() => {
    return [...new Set(arrivals.map((a) => a.nationality))];
  }, [arrivals]);

  const handleViewDetails = (arrival: ArrivalContract) => {
    setSelectedArrival(arrival);
    setDetailsModalVisible(true);
  };

  const handleCancelArrival = (arrival: ArrivalContract) => {
    setSelectedArrival(arrival);
    setCancelModalVisible(true);
  };

  const handleCancelConfirm = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCancelModalVisible(false);
      setSelectedArrival(null);
      form.resetFields();
    }, 1000);
  };

  const handleRatingChange = (arrivalId: string, checked: boolean) => {
    // API call would go here
    console.log(`Rating changed for ${arrivalId}: ${checked}`);
  };

  const renderArrivalCard = (arrival: ArrivalContract) => {
    const statusConfig = getStatusConfig(arrival.status);

    return (
      <Card key={arrival.id} className={styles.arrivalCard}>
        {/* Card Header */}
        <div className={styles.cardHeader}>
          <div className={styles.contractInfo}>
            <span className={styles.contractNumber}>{arrival.contractNumber}</span>
            <Tag color={statusConfig.color} icon={statusConfig.icon}>
              {statusConfig.label}
            </Tag>
          </div>
        </div>

        {/* Main Content */}
        <div className={styles.cardBody}>
          <Row gutter={[16, 16]}>
            {/* Customer Info */}
            <Col xs={24} md={8}>
              <div className={styles.infoSection}>
                <div className={styles.sectionTitle}>
                  <UserOutlined /> {language === 'ar' ? 'بيانات العميل' : 'Customer'}
                </div>
                <div className={styles.customerName}>{arrival.customerName}</div>
                <div className={styles.infoRow}>
                  <PhoneOutlined className={styles.infoIcon} />
                  <span>{arrival.customerPhone}</span>
                </div>
                <div className={styles.infoRow}>
                  <IdcardOutlined className={styles.infoIcon} />
                  <span>{arrival.customerId}</span>
                </div>
              </div>
            </Col>

            {/* Flight Info */}
            <Col xs={24} md={8}>
              <div className={styles.infoSection}>
                <div className={styles.sectionTitle}>
                  <RocketOutlined /> {language === 'ar' ? 'معلومات الرحلة' : 'Flight Info'}
                </div>
                <div className={styles.flightDetails}>
                  <div className={styles.flightItem}>
                    <CalendarOutlined className={styles.flightIcon} />
                    <span>{arrival.arrivalDate}</span>
                  </div>
                  <div className={styles.flightItem}>
                    <FieldTimeOutlined className={styles.flightIcon} />
                    <span>{arrival.arrivalTime}</span>
                  </div>
                  <div className={styles.flightItem}>
                    <EnvironmentOutlined className={styles.flightIcon} />
                    <span>{arrival.arrivalPlace}</span>
                  </div>
                  <div className={styles.flightItem}>
                    <RocketOutlined className={styles.flightIcon} />
                    <span>
                      {arrival.carrierLine} - {arrival.flightNumber}
                    </span>
                  </div>
                </div>
              </div>
            </Col>

            {/* Visa & Agent Info */}
            <Col xs={24} md={8}>
              <div className={styles.infoSection}>
                <div className={styles.sectionTitle}>
                  <GlobalOutlined /> {language === 'ar' ? 'التأشيرة والوكيل' : 'Visa & Agent'}
                </div>
                <div className={styles.visaInfo}>
                  <Tag color={getVisaStatusColor(arrival.visaStatus)}>{arrival.visaNumber}</Tag>
                  <span className={styles.nationality}>{arrival.nationality}</span>
                </div>
                <div className={styles.agentName}>{arrival.agentName}</div>
                <div className={styles.createdInfo}>
                  {language === 'ar' ? 'منذ' : 'Since'} {arrival.createdSinceDays}{' '}
                  {language === 'ar' ? 'يوم' : 'days'}
                </div>
              </div>
            </Col>
          </Row>
        </div>

        {/* Card Footer */}
        <div className={styles.cardFooter}>
          <div className={styles.ratingSection}>
            <span className={styles.ratingLabel}>{language === 'ar' ? 'تم التقييم' : 'Rated'}</span>
            <Switch
              size="small"
              checked={arrival.isRated}
              onChange={(checked) => handleRatingChange(arrival.id, checked)}
            />
          </div>
          <div className={styles.cardActions}>
            <Tooltip title={language === 'ar' ? 'عرض التفاصيل' : 'View Details'}>
              <Button
                type="text"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => handleViewDetails(arrival)}
              />
            </Tooltip>
            <Tooltip title={language === 'ar' ? 'إرسال رسالة' : 'Send Message'}>
              <Button type="text" size="small" icon={<MailOutlined />} />
            </Tooltip>
            {arrival.status === 'Has Arrived' && (
              <Tooltip title={language === 'ar' ? 'إلغاء الوصول' : 'Cancel Arrival'}>
                <Button
                  type="text"
                  size="small"
                  danger
                  icon={<CloseCircleOutlined />}
                  onClick={() => handleCancelArrival(arrival)}
                />
              </Tooltip>
            )}
          </div>
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
            <RocketOutlined className={styles.headerIcon} />
            <div>
              <h1>{language === 'ar' ? 'تقرير الوصول' : 'Arrival Report'}</h1>
              <p className={styles.headerSubtitle}>
                {language === 'ar'
                  ? 'متابعة وصول العمالة وحالات الرحلات'
                  : 'Track worker arrivals and flight status'}
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
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className={styles.statsRow}>
        <Col xs={12} sm={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={language === 'ar' ? 'إجمالي العقود' : 'Total Contracts'}
              value={stats.total}
              prefix={<FileTextOutlined style={{ color: '#003366' }} />}
              valueStyle={{ color: '#003366' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={language === 'ar' ? 'وصلوا' : 'Arrived'}
              value={stats.arrivedToday}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={language === 'ar' ? 'في الانتظار' : 'Pending'}
              value={stats.pendingArrival}
              prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={language === 'ar' ? 'تم تقييمهم' : 'Rated'}
              value={stats.rated}
              prefix={<StarOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className={styles.filterCard}>
        <div className={styles.filterHeader}>
          <div className={styles.mainFilters}>
            <Input
              placeholder={
                language === 'ar'
                  ? 'بحث بالاسم أو رقم العقد أو الهوية...'
                  : 'Search by name, contract or ID...'
              }
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <Select
              allowClear
              placeholder={language === 'ar' ? 'الحالة' : 'Status'}
              value={filterStatus || undefined}
              onChange={(val) => setFilterStatus(val || '')}
              style={{ minWidth: 150 }}
              options={[
                { label: language === 'ar' ? 'وصل' : 'Has Arrived', value: 'Has Arrived' },
                { label: language === 'ar' ? 'في الانتظار' : 'Pending', value: 'Pending' },
              ]}
            />
            <Select
              allowClear
              placeholder={language === 'ar' ? 'الجنسية' : 'Nationality'}
              value={filterNationality || undefined}
              onChange={(val) => setFilterNationality(val || '')}
              style={{ minWidth: 150 }}
              options={nationalities.map((n) => ({ label: n, value: n }))}
            />
            <Button
              icon={<FilterOutlined />}
              onClick={() => setShowFilters(!showFilters)}
              type={showFilters ? 'primary' : 'default'}
            >
              {language === 'ar' ? 'فلاتر متقدمة' : 'More Filters'}
            </Button>
          </div>
          <div className={styles.resultsCount}>
            {language === 'ar'
              ? `عرض ${filteredArrivals.length} من ${stats.total}`
              : `Showing ${filteredArrivals.length} of ${stats.total}`}
          </div>
        </div>

        {showFilters && (
          <>
            <Divider style={{ margin: '16px 0' }} />
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Select
                  allowClear
                  placeholder={language === 'ar' ? 'الوكيل' : 'Agent'}
                  style={{ width: '100%' }}
                  options={[
                    { label: 'تفويض باكستان', value: 'pak' },
                    { label: 'ALHABESHI International', value: 'alh' },
                    { label: 'POLY WORLD SERVICE', value: 'poly' },
                  ]}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Select
                  allowClear
                  placeholder={language === 'ar' ? 'حالة العقد' : 'Contract Status'}
                  style={{ width: '100%' }}
                  options={[
                    { label: language === 'ar' ? 'تم الحجز' : 'Booked', value: 'booked' },
                    { label: language === 'ar' ? 'مختوم' : 'Stamped', value: 'stamped' },
                    {
                      label: language === 'ar' ? 'تصريح السفر' : 'Travel Clearance',
                      value: 'clearance',
                    },
                  ]}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Input
                  placeholder={language === 'ar' ? 'رقم التأشيرة' : 'Visa Number'}
                  style={{ width: '100%' }}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Select
                  allowClear
                  placeholder={language === 'ar' ? 'مكان الوصول' : 'Arrival Place'}
                  style={{ width: '100%' }}
                  options={[
                    { label: 'Jeddah', value: 'jeddah' },
                    { label: 'Riyadh', value: 'riyadh' },
                    { label: 'Dammam', value: 'dammam' },
                  ]}
                />
              </Col>
            </Row>
          </>
        )}
      </Card>

      {/* Arrivals Grid */}
      {filteredArrivals.length === 0 ? (
        <Empty
          description={language === 'ar' ? 'لا توجد نتائج' : 'No arrivals found'}
          className={styles.emptyState}
        />
      ) : (
        <div className={styles.arrivalsGrid}>
          {filteredArrivals.map((arrival) => renderArrivalCard(arrival))}
        </div>
      )}

      {/* Details Modal */}
      <Modal
        title={
          selectedArrival
            ? `${language === 'ar' ? 'تفاصيل العقد' : 'Contract Details'} #${selectedArrival.contractNumber}`
            : ''
        }
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedArrival && (
          <div className={styles.detailsContent}>
            <Timeline
              items={[
                {
                  color: 'blue',
                  children: (
                    <div>
                      <strong>{language === 'ar' ? 'تاريخ الإنشاء' : 'Created'}</strong>
                      <p>
                        {selectedArrival.createdDate} - {selectedArrival.createdBy}
                      </p>
                    </div>
                  ),
                },
                {
                  color: 'green',
                  children: (
                    <div>
                      <strong>{language === 'ar' ? 'تاريخ التوقيع' : 'Signed'}</strong>
                      <p>{selectedArrival.signedDate}</p>
                    </div>
                  ),
                },
                {
                  color: selectedArrival.status === 'Has Arrived' ? 'green' : 'gray',
                  children: (
                    <div>
                      <strong>{language === 'ar' ? 'الوصول' : 'Arrival'}</strong>
                      <p>
                        {selectedArrival.arrivalDate} - {selectedArrival.arrivalTime}
                      </p>
                      <p>
                        {selectedArrival.arrivalPlace} ({selectedArrival.flightNumber})
                      </p>
                    </div>
                  ),
                },
              ]}
            />

            <Divider />

            <Row gutter={[16, 8]}>
              <Col span={12}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>
                    {language === 'ar' ? 'التأشيرة' : 'Visa'}
                  </span>
                  <span>{selectedArrival.visaNumber}</span>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>
                    {language === 'ar' ? 'الجنسية' : 'Nationality'}
                  </span>
                  <span>{selectedArrival.nationality}</span>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>
                    {language === 'ar' ? 'الوكيل' : 'Agent'}
                  </span>
                  <span>{selectedArrival.agentName}</span>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>
                    {language === 'ar' ? 'الناقل' : 'Carrier'}
                  </span>
                  <span>{selectedArrival.carrierLine}</span>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Modal>

      {/* Cancel Arrival Modal */}
      <Modal
        title={language === 'ar' ? 'إلغاء الوصول' : 'Cancel Arrival'}
        open={cancelModalVisible}
        onCancel={() => setCancelModalVisible(false)}
        onOk={handleCancelConfirm}
        confirmLoading={loading}
        okText={language === 'ar' ? 'تأكيد الإلغاء' : 'Confirm Cancel'}
        cancelText={language === 'ar' ? 'إلغاء' : 'Cancel'}
        okButtonProps={{ danger: true }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label={language === 'ar' ? 'سبب الإلغاء' : 'Cancellation Reason'}
            name="reason"
            rules={[{ required: true }]}
          >
            <Select
              placeholder={language === 'ar' ? 'اختر السبب' : 'Select Reason'}
              options={[
                {
                  label: language === 'ar' ? 'خطأ في البيانات' : 'Data Error',
                  value: 'data_error',
                },
                {
                  label: language === 'ar' ? 'إلغاء الرحلة' : 'Flight Cancelled',
                  value: 'flight_cancelled',
                },
                {
                  label: language === 'ar' ? 'طلب العميل' : 'Customer Request',
                  value: 'customer_request',
                },
                { label: language === 'ar' ? 'أخرى' : 'Other', value: 'other' },
              ]}
            />
          </Form.Item>
          <Form.Item label={language === 'ar' ? 'ملاحظات' : 'Notes'} name="notes">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
