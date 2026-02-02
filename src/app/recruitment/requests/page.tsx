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
  UserAddOutlined,
  PhoneOutlined,
  IdcardOutlined,
  CalendarOutlined,
  GlobalOutlined,
  MoreOutlined,
  PrinterOutlined,
  DownloadOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/store/authStore';
import styles from './RecruitmentRequests.module.css';

interface RecruitmentRequest {
  id: number;
  code: string;
  customerId: string;
  customerName: string;
  customerNameAr: string;
  customerPhone: string;
  customerEmail: string;
  customerIdNumber: string;
  jobName: string;
  jobNameAr: string;
  religion: 'muslim' | 'non-muslim';
  nationality: string;
  nationalityAr: string;
  age: number;
  applicantName?: string;
  applicantNameAr?: string;
  requestType: 'automatic' | 'manual';
  status: 'pending' | 'assigned' | 'completed' | 'cancelled';
  createdDate: string;
}

export default function RecruitmentRequestsPage() {
  const language = useAuthStore((state) => state.language);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReligion, setSelectedReligion] = useState<string[]>([]);
  const [selectedNationalities, setSelectedNationalities] = useState<string[]>([]);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
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

  const mockRequests: RecruitmentRequest[] = Array.from({ length: 119 }, (_, i) => ({
    id: 2645 + i,
    code: `WLL${27 + i}F`,
    customerId: `cust-${i + 1}`,
    customerName: `Customer ${i + 1}`,
    customerNameAr: `عميل ${i + 1}`,
    customerPhone: `53888${5300 + i}`,
    customerEmail: `customer${i + 1}@example.com`,
    customerIdNumber: `102130763${i}`,
    jobName: jobs[i % jobs.length].label,
    jobNameAr: jobs[i % jobs.length].labelAr,
    religion: i % 3 === 0 ? 'muslim' : 'non-muslim',
    nationality: nationalities[i % nationalities.length].label,
    nationalityAr: nationalities[i % nationalities.length].labelAr,
    age: 23 + (i % 25),
    applicantName: i % 4 === 0 ? `Applicant ${i + 1}` : undefined,
    applicantNameAr: i % 4 === 0 ? `متقدم ${i + 1}` : undefined,
    requestType: i % 5 === 0 ? 'manual' : 'automatic',
    status: ['pending', 'assigned', 'completed', 'cancelled'][i % 4] as any,
    createdDate: `2026-01-${14 + (i % 4)}`,
  }));

  const filteredRequests = useMemo(() => {
    return mockRequests.filter((request) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        request.code.toLowerCase().includes(searchLower) ||
        (language === 'ar' ? request.customerNameAr : request.customerName)
          .toLowerCase()
          .includes(searchLower) ||
        request.customerPhone.includes(searchLower) ||
        (language === 'ar' ? request.jobNameAr : request.jobName)
          .toLowerCase()
          .includes(searchLower);

      const matchesReligion =
        selectedReligion.length === 0 || selectedReligion.includes(request.religion);

      const matchesNationality =
        selectedNationalities.length === 0 ||
        selectedNationalities.includes(
          nationalities.find((n) => n.label === request.nationality)?.value || ''
        );

      const matchesJob =
        selectedJobs.length === 0 ||
        selectedJobs.includes(jobs.find((j) => j.label === request.jobName)?.value || '');

      const matchesStatus = selectedStatus === 'all' || request.status === selectedStatus;

      return matchesSearch && matchesReligion && matchesNationality && matchesJob && matchesStatus;
    });
  }, [searchTerm, selectedReligion, selectedNationalities, selectedJobs, selectedStatus, language]);

  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const statistics = {
    total: mockRequests.length,
    pending: mockRequests.filter((r) => r.status === 'pending').length,
    assigned: mockRequests.filter((r) => r.status === 'assigned').length,
    completed: mockRequests.filter((r) => r.status === 'completed').length,
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'gold',
      assigned: 'blue',
      completed: 'green',
      cancelled: 'red',
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const getStatusText = (status: string) => {
    const translations = {
      pending: { ar: 'قيد الانتظار', en: 'Pending' },
      assigned: { ar: 'تم التعيين', en: 'Assigned' },
      completed: { ar: 'مكتمل', en: 'Completed' },
      cancelled: { ar: 'ملغي', en: 'Cancelled' },
    };
    return translations[status as keyof typeof translations]?.[language] || status;
  };

  const getActionMenu = (request: RecruitmentRequest): MenuProps => ({
    items: [
      {
        key: 'view',
        label: language === 'ar' ? 'عرض' : 'View',
        icon: <EyeOutlined />,
        onClick: () => console.log('View', request.id),
      },
      {
        key: 'edit',
        label: language === 'ar' ? 'تعديل' : 'Edit',
        icon: <EditOutlined />,
        onClick: () => console.log('Edit', request.id),
      },
      {
        key: 'assign',
        label: language === 'ar' ? 'تعيين متقدم' : 'Assign Applicant',
        icon: <UserAddOutlined />,
        onClick: () => console.log('Assign', request.id),
      },
      {
        type: 'divider',
      },
      {
        key: 'delete',
        label: language === 'ar' ? 'حذف' : 'Delete',
        icon: <DeleteOutlined />,
        danger: true,
        onClick: () => console.log('Delete', request.id),
      },
    ],
  });

  const printMenu: MenuProps = {
    items: [
      {
        key: 'print',
        label: language === 'ar' ? 'طباعة' : 'Print',
        icon: <PrinterOutlined />,
      },
      {
        key: 'export',
        label: language === 'ar' ? 'تصدير' : 'Export',
        icon: <DownloadOutlined />,
      },
    ],
  };

  return (
    <div className={styles.pageContainer}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <h1>
          <FileTextOutlined />
          <span>{language === 'ar' ? 'طلبات التوظيف' : 'Recruitment Requests'}</span>
        </h1>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]} className={styles.statsRow}>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={language === 'ar' ? 'إجمالي الطلبات' : 'Total Requests'}
              value={statistics.total}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#003366' }}
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
              title={language === 'ar' ? 'تم التعيين' : 'Assigned'}
              value={statistics.assigned}
              prefix={<UserAddOutlined />}
              valueStyle={{ color: '#00478C' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={language === 'ar' ? 'مكتمل' : 'Completed'}
              value={statistics.completed}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#00AA64' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Search and Filters */}
      <Card className={styles.filterCard}>
        <Space vertical style={{ width: '100%' }} size={16}>
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
              <Dropdown menu={printMenu} trigger={['click']}>
                <Button icon={<PrinterOutlined />} size="large">
                  {language === 'ar' ? 'طباعة' : 'Print'}
                </Button>
              </Dropdown>
              <Button type="primary" size="large" icon={<PlusOutlined />}>
                {language === 'ar' ? 'إضافة طلب جديد' : 'Add New Request'}
              </Button>
            </Space>
          </div>

          {showFilters && (
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12} lg={6}>
                <label className={styles.filterLabel}>
                  {language === 'ar' ? 'الديانة' : 'Religion'}
                </label>
                <Select
                  mode="multiple"
                  size="large"
                  placeholder={language === 'ar' ? 'اختر الديانة' : 'Select Religion'}
                  value={selectedReligion}
                  onChange={setSelectedReligion}
                  style={{ width: '100%' }}
                  options={[
                    { value: 'muslim', label: language === 'ar' ? 'مسلم' : 'Muslim' },
                    { value: 'non-muslim', label: language === 'ar' ? 'غير مسلم' : 'Non-Muslim' },
                  ]}
                  allowClear
                />
              </Col>
              <Col xs={24} md={12} lg={6}>
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
              <Col xs={24} md={12} lg={6}>
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
              <Col xs={24} md={12} lg={6}>
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
                    { value: 'pending', label: language === 'ar' ? 'قيد الانتظار' : 'Pending' },
                    { value: 'assigned', label: language === 'ar' ? 'تم التعيين' : 'Assigned' },
                    { value: 'completed', label: language === 'ar' ? 'مكتمل' : 'Completed' },
                    { value: 'cancelled', label: language === 'ar' ? 'ملغي' : 'Cancelled' },
                  ]}
                />
              </Col>
            </Row>
          )}
        </Space>
      </Card>

      {/* Requests Grid */}
      <Row gutter={[16, 16]}>
        {paginatedRequests.map((request) => (
          <Col xs={24} lg={12} key={request.id}>
            <Card className={styles.requestCard} hoverable>
              {/* Card Header */}
              <div className={styles.cardHeader}>
                <div className={styles.headerLeft}>
                  <div className={styles.requestCode}>
                    <FileTextOutlined />
                    <span>#{request.code}</span>
                  </div>
                  <Space size={8}>
                    <Tag color={getStatusColor(request.status)}>
                      {getStatusText(request.status)}
                    </Tag>
                    <Tag color={request.requestType === 'automatic' ? 'cyan' : 'purple'}>
                      {request.requestType === 'automatic'
                        ? language === 'ar'
                          ? 'أوتوماتيك'
                          : 'Automatic'
                        : language === 'ar'
                          ? 'يدوي'
                          : 'Manual'}
                    </Tag>
                  </Space>
                </div>
                <Dropdown menu={getActionMenu(request)} trigger={['click']}>
                  <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
              </div>

              {/* Job Info */}
              <div className={styles.jobSection}>
                <div className={styles.jobTitle}>
                  <span className={styles.jobIcon}>💼</span>
                  <h3>{language === 'ar' ? request.jobNameAr : request.jobName}</h3>
                </div>
                <div className={styles.jobDetails}>
                  <Tag color="blue">
                    <GlobalOutlined style={{ marginRight: 4 }} />
                    {language === 'ar' ? request.nationalityAr : request.nationality}
                  </Tag>
                  <Tag color={request.religion === 'muslim' ? 'green' : 'orange'}>
                    {request.religion === 'muslim'
                      ? language === 'ar'
                        ? 'مسلم'
                        : 'Muslim'
                      : language === 'ar'
                        ? 'غير مسلم'
                        : 'Non-Muslim'}
                  </Tag>
                  <Tag>{language === 'ar' ? `${request.age} سنة` : `${request.age} years`}</Tag>
                </div>
              </div>

              {/* Customer Info */}
              <div className={styles.customerSection}>
                <div className={styles.sectionTitle}>
                  {language === 'ar' ? 'معلومات العميل' : 'Customer Information'}
                </div>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <UserAddOutlined className={styles.infoIcon} />
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>
                        {language === 'ar' ? 'الاسم' : 'Name'}
                      </span>
                      <span className={styles.infoValue}>
                        {language === 'ar' ? request.customerNameAr : request.customerName}
                      </span>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <PhoneOutlined className={styles.infoIcon} />
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>
                        {language === 'ar' ? 'الهاتف' : 'Phone'}
                      </span>
                      <span className={styles.infoValue}>{request.customerPhone}</span>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <IdcardOutlined className={styles.infoIcon} />
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>
                        {language === 'ar' ? 'رقم الهوية' : 'ID Number'}
                      </span>
                      <span className={styles.infoValue}>{request.customerIdNumber}</span>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <CalendarOutlined className={styles.infoIcon} />
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>
                        {language === 'ar' ? 'تاريخ الإنشاء' : 'Created Date'}
                      </span>
                      <span className={styles.infoValue}>{request.createdDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Applicant Info (if assigned) */}
              {request.applicantName && (
                <div className={styles.applicantSection}>
                  <Badge.Ribbon text={language === 'ar' ? 'تم التعيين' : 'Assigned'} color="green">
                    <div className={styles.applicantInfo}>
                      <Avatar
                        size={40}
                        icon={<UserAddOutlined />}
                        className={styles.applicantAvatar}
                      />
                      <div>
                        <div className={styles.applicantLabel}>
                          {language === 'ar' ? 'المتقدم المعين' : 'Assigned Applicant'}
                        </div>
                        <div className={styles.applicantName}>
                          {language === 'ar' ? request.applicantNameAr : request.applicantName}
                        </div>
                      </div>
                    </div>
                  </Badge.Ribbon>
                </div>
              )}
            </Card>
          </Col>
        ))}
      </Row>

      {/* Pagination */}
      <div className={styles.paginationWrapper}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredRequests.length}
          onChange={(page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          }}
          showSizeChanger
          showTotal={(total) =>
            language === 'ar' ? `إجمالي ${total} طلب` : `Total ${total} requests`
          }
          pageSizeOptions={[10, 15, 20, 25, 50, 100]}
        />
      </div>
    </div>
  );
}
