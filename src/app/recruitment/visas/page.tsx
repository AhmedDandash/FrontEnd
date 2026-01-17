'use client';

import React, { useState, useMemo } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Input,
  Select,
  Tag,
  Space,
  Statistic,
  Pagination,
  Badge,
  DatePicker,
  Dropdown,
  Avatar,
} from 'antd';
import type { MenuProps } from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
  CalendarOutlined,
  GlobalOutlined,
  MoreOutlined,
  PrinterOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
  IdcardOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/store/authStore';
import styles from './Visas.module.css';
import type { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;

interface Visa {
  id: number;
  visaNumber: string;
  customerName: string;
  customerNameAr: string;
  customerId: string;
  jobName: string;
  jobNameAr: string;
  nationality: string;
  nationalityAr: string;
  status: 'active' | 'expired' | 'pending' | 'cancelled';
  issueDate: string;
  expiryDate: string;
  applicantName?: string;
  applicantNameAr?: string;
  religion: 'muslim' | 'non-muslim';
  daysRemaining?: number;
}

export default function VisasPage() {
  const language = useAuthStore((state) => state.language);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNationalities, setSelectedNationalities] = useState<string[]>([]);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Mock data
  const nationalities = [
    { value: '359', label: 'Philippines', labelAr: 'الفلبين' },
    { value: '360', label: 'Kenya', labelAr: 'كينيا' },
    { value: '361', label: 'Uganda', labelAr: 'أوغندا' },
    { value: '362', label: 'India', labelAr: 'الهند' },
    { value: '363', label: 'Sudan', labelAr: 'السودان' },
    { value: '364', label: 'Egypt', labelAr: 'مصر' },
    { value: '365', label: 'Burundi', labelAr: 'بوروندي' },
    { value: '366', label: 'Bangladesh', labelAr: 'بنغلاديش' },
    { value: '367', label: 'Pakistan', labelAr: 'باكستان' },
    { value: '701', label: 'Sri Lanka', labelAr: 'سريلانكا' },
    { value: '731', label: 'Ethiopia', labelAr: 'إثيوبيا' },
    { value: '771', label: 'Indonesia', labelAr: 'إندونيسيا' },
  ];

  const jobs = [
    { value: '1198', label: 'House Maid', labelAr: 'خادمة منزلية' },
    { value: '1199', label: 'Driver', labelAr: 'سائق' },
    { value: '1210', label: 'Household Waiter', labelAr: 'نادل منزلي' },
    { value: '1212', label: 'Home Nurse', labelAr: 'ممرضة منزلية' },
    { value: '1246', label: 'Cook', labelAr: 'طباخ' },
    { value: '1293', label: 'Home Worker', labelAr: 'عامل منزلي' },
    { value: '1568', label: 'Home Guard', labelAr: 'حارس منزلي' },
    { value: '1602', label: 'Home Gardener', labelAr: 'مزارع منزلي' },
  ];

  const mockVisas: Visa[] = Array.from({ length: 689 }, (_, i) => {
    const issueDate = new Date(2025, 0, 1 + (i % 365));
    const expiryDate = new Date(issueDate);
    expiryDate.setMonth(expiryDate.getMonth() + 3);
    const today = new Date();
    const daysRemaining = Math.floor(
      (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    let status: 'active' | 'expired' | 'pending' | 'cancelled';
    if (daysRemaining < 0) status = 'expired';
    else if (daysRemaining < 30) status = 'active';
    else if (i % 5 === 0) status = 'cancelled';
    else status = 'pending';

    return {
      id: 1000 + i,
      visaNumber: `VSA-${2026}-${String(i + 1).padStart(5, '0')}`,
      customerName: `Customer ${i + 1}`,
      customerNameAr: `عميل ${i + 1}`,
      customerId: `CUST${String(i + 1).padStart(4, '0')}`,
      jobName: jobs[i % jobs.length].label,
      jobNameAr: jobs[i % jobs.length].labelAr,
      nationality: nationalities[i % nationalities.length].label,
      nationalityAr: nationalities[i % nationalities.length].labelAr,
      status,
      issueDate: issueDate.toISOString().split('T')[0],
      expiryDate: expiryDate.toISOString().split('T')[0],

      applicantName: i % 3 === 0 ? `Applicant ${i + 1}` : undefined,
      applicantNameAr: i % 3 === 0 ? `متقدم ${i + 1}` : undefined,
      religion: i % 3 === 0 ? 'muslim' : 'non-muslim',
      daysRemaining: daysRemaining > 0 ? daysRemaining : undefined,
    };
  });

  const filteredVisas = useMemo(() => {
    return mockVisas.filter((visa) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        visa.visaNumber.toLowerCase().includes(searchLower) ||
        (language === 'ar' ? visa.customerNameAr : visa.customerName)
          .toLowerCase()
          .includes(searchLower) ||
        (language === 'ar' ? visa.jobNameAr : visa.jobName).toLowerCase().includes(searchLower) ||
        visa.customerId.toLowerCase().includes(searchLower);

      const matchesNationality =
        selectedNationalities.length === 0 ||
        selectedNationalities.includes(
          nationalities.find((n) => n.label === visa.nationality)?.value || ''
        );

      const matchesJob =
        selectedJobs.length === 0 ||
        selectedJobs.includes(jobs.find((j) => j.label === visa.jobName)?.value || '');

      const matchesStatus = selectedStatus === 'all' || visa.status === selectedStatus;

      const matchesDateRange =
        !dateRange ||
        !dateRange[0] ||
        !dateRange[1] ||
        (new Date(visa.issueDate) >= dateRange[0].toDate() &&
          new Date(visa.issueDate) <= dateRange[1].toDate());

      return matchesSearch && matchesNationality && matchesJob && matchesStatus && matchesDateRange;
    });
  }, [searchTerm, selectedNationalities, selectedJobs, selectedStatus, dateRange, language]);

  const paginatedVisas = filteredVisas.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const statistics = {
    total: mockVisas.length,
    active: mockVisas.filter((v) => v.status === 'active').length,
    pending: mockVisas.filter((v) => v.status === 'pending').length,
    expired: mockVisas.filter((v) => v.status === 'expired').length,
    expiringSoon: mockVisas.filter(
      (v) => v.daysRemaining && v.daysRemaining < 30 && v.daysRemaining > 0
    ).length,
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'green',
      pending: 'gold',
      expired: 'red',
      cancelled: 'default',
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const getStatusText = (status: string) => {
    const translations = {
      active: { ar: 'نشط', en: 'Active' },
      pending: { ar: 'قيد الانتظار', en: 'Pending' },
      expired: { ar: 'منتهي', en: 'Expired' },
      cancelled: { ar: 'ملغي', en: 'Cancelled' },
    };
    return translations[status as keyof typeof translations]?.[language] || status;
  };

  const getExpiryStatus = (daysRemaining?: number) => {
    if (!daysRemaining || daysRemaining < 0) return null;

    if (daysRemaining <= 7) {
      return { color: 'red', text: language === 'ar' ? 'ينتهي قريباً' : 'Expiring Soon' };
    } else if (daysRemaining <= 30) {
      return {
        color: 'orange',
        text: language === 'ar' ? `${daysRemaining} يوم` : `${daysRemaining} days`,
      };
    }
    return {
      color: 'green',
      text: language === 'ar' ? `${daysRemaining} يوم` : `${daysRemaining} days`,
    };
  };

  const getActionMenu = (visa: Visa): MenuProps => ({
    items: [
      {
        key: 'view',
        label: language === 'ar' ? 'عرض' : 'View',
        icon: <EyeOutlined />,
        onClick: () => console.log('View', visa.id),
      },
      {
        key: 'edit',
        label: language === 'ar' ? 'تعديل' : 'Edit',
        icon: <EditOutlined />,
        onClick: () => console.log('Edit', visa.id),
      },
      {
        key: 'renew',
        label: language === 'ar' ? 'تجديد' : 'Renew',
        icon: <CalendarOutlined />,
        onClick: () => console.log('Renew', visa.id),
      },
      {
        key: 'print',
        label: language === 'ar' ? 'طباعة' : 'Print',
        icon: <PrinterOutlined />,
        onClick: () => console.log('Print', visa.id),
      },
      {
        type: 'divider',
      },
      {
        key: 'delete',
        label: language === 'ar' ? 'حذف' : 'Delete',
        icon: <DeleteOutlined />,
        danger: true,
        onClick: () => console.log('Delete', visa.id),
      },
    ],
  });

  
  return (
    <div className={styles.pageContainer}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <h1>
          <SafetyCertificateOutlined />
          <span>{language === 'ar' ? 'إدارة التأشيرات' : 'Visa Management'}</span>
        </h1>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]} className={styles.statsRow}>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={language === 'ar' ? 'إجمالي التأشيرات' : 'Total Visas'}
              value={statistics.total}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#003366' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={language === 'ar' ? 'نشط' : 'Active'}
              value={statistics.active}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#00AA64' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={language === 'ar' ? 'قيد الانتظار' : 'Pending'}
              value={statistics.pending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={language === 'ar' ? 'منتهي' : 'Expired'}
              value={statistics.expired}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Search and Filters */}
      <Card className={styles.filterCard}>
        <Space direction="vertical" style={{ width: '100%' }} size={16}>
          <div className={styles.filterHeader}>
            <Space wrap>
              <Input
                size="large"
                placeholder={language === 'ar' ? 'البحث...' : 'Search...'}
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: 300 }}
                allowClear
              />
              <Button
                icon={<FilterOutlined />}
                onClick={() => setShowFilters(!showFilters)}
                type={showFilters ? 'primary' : 'default'}
                size="large"
              >
                {language === 'ar' ? 'الفلاتر' : 'Filters'}
              </Button>
            </Space>
            <Space>
              <Button type="primary" size="large" icon={<PlusOutlined />}>
                {language === 'ar' ? 'إضافة تأشيرة' : 'Add Visa'}
              </Button>
            </Space>
          </div>

          {showFilters && (
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <label className={styles.filterLabel}>
                  {language === 'ar' ? 'تاريخ الإصدار' : 'Issue Date Range'}
                </label>
                <RangePicker
                  size="large"
                  style={{ width: '100%' }}
                  placeholder={[
                    language === 'ar' ? 'من تاريخ' : 'From Date',
                    language === 'ar' ? 'إلى تاريخ' : 'To Date',
                  ]}
                  value={dateRange}
                  onChange={(dates) => setDateRange(dates as [Dayjs | null, Dayjs | null] | null)}
                  format="YYYY-MM-DD"
                  allowClear
                />
              </Col>
              <Col xs={24} md={6}>
                <label className={styles.filterLabel}>
                  {language === 'ar' ? 'الجنسية' : 'Nationality'}
                </label>
                <Select
                  mode="multiple"
                  size="large"
                  placeholder={language === 'ar' ? 'اختر الجنسية' : 'Select Nationality'}
                  value={selectedNationalities}
                  onChange={setSelectedNationalities}
                  style={{ width: '100%' }}
                  options={nationalities.map((n) => ({
                    value: n.value,
                    label: language === 'ar' ? n.labelAr : n.label,
                  }))}
                  allowClear
                />
              </Col>
              <Col xs={24} md={6}>
                <label className={styles.filterLabel}>
                  {language === 'ar' ? 'الوظيفة' : 'Job'}
                </label>
                <Select
                  mode="multiple"
                  size="large"
                  placeholder={language === 'ar' ? 'اختر الوظيفة' : 'Select Job'}
                  value={selectedJobs}
                  onChange={setSelectedJobs}
                  style={{ width: '100%' }}
                  options={jobs.map((j) => ({
                    value: j.value,
                    label: language === 'ar' ? j.labelAr : j.label,
                  }))}
                  allowClear
                />
              </Col>
              <Col xs={24} md={8}>
                <label className={styles.filterLabel}>
                  {language === 'ar' ? 'الحالة' : 'Status'}
                </label>
                <Select
                  size="large"
                  value={selectedStatus}
                  onChange={setSelectedStatus}
                  style={{ width: '100%' }}
                  options={[
                    { value: 'all', label: language === 'ar' ? 'الكل' : 'All' },
                    { value: 'active', label: language === 'ar' ? 'نشط' : 'Active' },
                    { value: 'pending', label: language === 'ar' ? 'قيد الانتظار' : 'Pending' },
                    { value: 'expired', label: language === 'ar' ? 'منتهي' : 'Expired' },
                    { value: 'cancelled', label: language === 'ar' ? 'ملغي' : 'Cancelled' },
                  ]}
                />
              </Col>
            </Row>
          )}
        </Space>
      </Card>

      {/* Visas Grid */}
      <Row gutter={[16, 16]}>
        {paginatedVisas.map((visa) => {
          const expiryStatus = getExpiryStatus(visa.daysRemaining);

          return (
            <Col xs={24} lg={12} key={visa.id}>
              <Card className={styles.visaCard} hoverable>
                {/* Card Header */}
                <div className={styles.cardHeader}>
                  <div className={styles.headerLeft}>
                    <div className={styles.visaNumber}>
                      <SafetyCertificateOutlined />
                      <span>{visa.visaNumber}</span>
                    </div>
                    <Space size={8}>
                      <Tag color={getStatusColor(visa.status)}>{getStatusText(visa.status)}</Tag>
                      {expiryStatus && <Tag color={expiryStatus.color}>{expiryStatus.text}</Tag>}
                    </Space>
                  </div>
                  <Dropdown menu={getActionMenu(visa)} trigger={['click']}>
                    <Button type="text" icon={<MoreOutlined />} />
                  </Dropdown>
                </div>

                {/* Job Section */}
                <div className={styles.jobSection}>
                  <div className={styles.jobTitle}>
                    <span className={styles.jobIcon}>💼</span>
                    <h3>{language === 'ar' ? visa.jobNameAr : visa.jobName}</h3>
                  </div>
                  <Tag color="blue">
                    <GlobalOutlined style={{ marginRight: 4 }} />
                    {language === 'ar' ? visa.nationalityAr : visa.nationality}
                  </Tag>
                </div>

                {/* Customer Info */}
                <div className={styles.customerSection}>
                  <div className={styles.sectionTitle}>
                    {language === 'ar' ? 'معلومات العميل' : 'Customer Information'}
                  </div>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <UserOutlined className={styles.infoIcon} />
                      <div className={styles.infoContent}>
                        <span className={styles.infoLabel}>
                          {language === 'ar' ? 'الاسم' : 'Name'}
                        </span>
                        <span className={styles.infoValue}>
                          {language === 'ar' ? visa.customerNameAr : visa.customerName}
                        </span>
                      </div>
                    </div>
                    <div className={styles.infoItem}>
                      <IdcardOutlined className={styles.infoIcon} />
                      <div className={styles.infoContent}>
                        <span className={styles.infoLabel}>
                          {language === 'ar' ? 'رقم العميل' : 'Customer ID'}
                        </span>
                        <span className={styles.infoValue}>{visa.customerId}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dates Section */}
                <div className={styles.datesSection}>
                  <div className={styles.dateItem}>
                    <CalendarOutlined className={styles.dateIcon} />
                    <div className={styles.dateContent}>
                      <span className={styles.dateLabel}>
                        {language === 'ar' ? 'تاريخ الإصدار' : 'Issue Date'}
                      </span>
                      <span className={styles.dateValue}>{visa.issueDate}</span>
                    </div>
                  </div>
                  <div className={styles.dateItem}>
                    <CalendarOutlined
                      className={styles.dateIcon}
                      style={{
                        color:
                          visa.daysRemaining && visa.daysRemaining < 30 ? '#ff4d4f' : '#00AA64',
                      }}
                    />
                    <div className={styles.dateContent}>
                      <span className={styles.dateLabel}>
                        {language === 'ar' ? 'تاريخ الانتهاء' : 'Expiry Date'}
                      </span>
                      <span className={styles.dateValue}>{visa.expiryDate}</span>
                    </div>
                  </div>
                </div>

                {/* Applicant Info (if assigned) */}
                {visa.applicantName && (
                  <div className={styles.applicantSection}>
                    <Badge.Ribbon text={language === 'ar' ? 'متقدم معين' : 'Assigned'} color="cyan">
                      <div className={styles.applicantInfo}>
                        <Avatar
                          size={40}
                          icon={<UserOutlined />}
                          className={styles.applicantAvatar}
                        />
                        <div>
                          <div className={styles.applicantLabel}>
                            {language === 'ar' ? 'المتقدم' : 'Applicant'}
                          </div>
                          <div className={styles.applicantName}>
                            {language === 'ar' ? visa.applicantNameAr : visa.applicantName}
                          </div>
                        </div>
                      </div>
                    </Badge.Ribbon>
                  </div>
                )}
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Pagination */}
      <div className={styles.paginationWrapper}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredVisas.length}
          onChange={(page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          }}
          showSizeChanger
          showTotal={(total) =>
            language === 'ar' ? `إجمالي ${total} تأشيرة` : `Total ${total} visas`
          }
          pageSizeOptions={[10, 15, 20, 25, 50, 100]}
        />
      </div>
    </div>
  );
}
