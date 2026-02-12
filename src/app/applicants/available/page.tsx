'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Empty,
  Spin,
  Tooltip,
  Avatar,
  Dropdown,
  Modal,
  Descriptions,
  Divider,
  Image,
} from 'antd';
import type { MenuProps } from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  TeamOutlined,
  UserOutlined,
  IdcardOutlined,
  EyeOutlined,
  PrinterOutlined,
  StarFilled,
  ManOutlined,
  WomanOutlined,
  FlagOutlined,
  FileTextOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/store/authStore';
import { useWorker, useWorkers } from '@/hooks/api/useWorkers';
import styles from './AvailableWorkers.module.css';
import dayjs from 'dayjs';

// Translations
const translations = {
  en: {
    pageTitle: 'Available Workers',
    searchPlaceholder: 'Search by name or passport...',
    filters: 'Filters',
    totalAvailable: 'Total Available',
    mediation: 'Mediation',
    rent: 'Rent/Operation',
    sponsorship: 'Sponsorship Transfer',
    all: 'All',
    mediationWorkers: 'Mediation Workers',
    rentWorkers: 'Rent Workers',
    sponsorshipWorkers: 'Sponsorship Workers',
    nameAr: 'Name (Arabic)',
    passportNo: 'Passport No.',
    nationality: 'Nationality',
    agent: 'Agent',
    job: 'Job',
    jobname: 'Job',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    age: 'Age',
    religion: 'Religion',
    muslim: 'Muslim',
    nonMuslim: 'Non-Muslim',
    experience: 'Experience',
    hasExperience: 'Has Experience',
    noExperience: 'No Experience',
    vip: 'VIP',
    maritalStatus: 'Marital Status',
    single: 'Single',
    married: 'Married',
    view: 'View Details',
    print: 'Print',
    noWorkers: 'No workers found',
    noWorkersDesc: 'No workers match your criteria',
    createdBy: 'Created By',
    agentName: 'Agent Name',
    years: 'years',
    type: 'Type',
    personalInfo: 'Personal Info',
    workInfo: 'Work Info',
    skills: 'Skills',
    viewWorker: 'Worker Details',
    personalDetails: 'Personal Details',
    passportDetails: 'Passport Details',
    contactDetails: 'Contact Details',
    addressDetails: 'Address Details',
    close: 'Close',
    birthDate: 'Birth Date',
    childrenCount: 'Children',
    workerType: 'Worker Type',
    basicSalary: 'Basic Salary',
    boxNumber: 'Box Number',
    borderNumber: 'Border Number',
    phone: 'Phone',
    mobile: 'Mobile',
    addressAr: 'Address (Arabic)',
    addressEn: 'Address (English)',
    referenceNo: 'Reference No.',
    passportIssueDate: 'Issue Date',
    passportExpiryDate: 'Expiry Date',
    passportIssuePlaceAr: 'Issue Place (Arabic)',
    passportIssuePlaceEn: 'Issue Place (English)',
    educationLevelAr: 'Education (Arabic)',
    educationLevelEn: 'Education (English)',
  },
  ar: {
    pageTitle: 'العمالة المتاحة للاختيار',
    searchPlaceholder: 'البحث بالاسم أو رقم الجواز...',
    filters: 'التصفيات',
    totalAvailable: 'إجمالي المتاح',
    mediation: 'التوسط',
    rent: 'التشغيل',
    sponsorship: 'نقل الكفالة',
    all: 'الكل',
    mediationWorkers: 'عمالة التوسط',
    rentWorkers: 'عمالة التشغيل',
    sponsorshipWorkers: 'عمالة نقل الكفالة',
    nameAr: 'الاسم (عربي)',
    passportNo: 'رقم الجواز',
    nationality: 'الجنسية',
    agent: 'الوكيل',
    job: 'الوظيفة',
    jobname: 'الوظيفة',
    gender: 'الجنس',
    male: 'ذكر',
    female: 'أنثى',
    age: 'العمر',
    religion: 'الديانة',
    muslim: 'مسلم',
    nonMuslim: 'غير مسلم',
    experience: 'الخبرة',
    hasExperience: 'سبق له العمل',
    noExperience: 'لم يسبق له العمل',
    vip: 'VIP',
    maritalStatus: 'الحالة الاجتماعية',
    single: 'أعزب',
    married: 'متزوج',
    view: 'عرض التفاصيل',
    print: 'طباعة',
    noWorkers: 'لا يوجد عمال',
    noWorkersDesc: 'لا يوجد عمال يطابقون معايير البحث',
    createdBy: 'تم الانشاء بواسطة',
    agentName: 'اسم الوكيل',
    years: 'سنة',
    type: 'النوع',
    personalInfo: 'المعلومات الشخصية',
    workInfo: 'معلومات العمل',
    skills: 'المهارات',
    viewWorker: 'تفاصيل العامل',
    personalDetails: 'البيانات الشخصية',
    passportDetails: 'بيانات الجواز',
    contactDetails: 'بيانات التواصل',
    addressDetails: 'بيانات العنوان',
    close: 'إغلاق',
    birthDate: 'تاريخ الميلاد',
    childrenCount: 'الأطفال',
    workerType: 'نوع العامل',
    basicSalary: 'الراتب الأساسي',
    boxNumber: 'رقم الصندوق',
    borderNumber: 'رقم الحدود',
    phone: 'تليفون ارضي',
    mobile: 'الجوال',
    addressAr: 'العنوان (عربي)',
    addressEn: 'العنوان (إنجليزي)',
    referenceNo: 'رقم المرجع',
    passportIssueDate: 'تاريخ الإصدار',
    passportExpiryDate: 'تاريخ الانتهاء',
    passportIssuePlaceAr: 'مكان الإصدار (عربي)',
    passportIssuePlaceEn: 'مكان الإصدار (إنجليزي)',
    educationLevelAr: 'التعليم (عربي)',
    educationLevelEn: 'التعليم (إنجليزي)',
  },
};

export default function AvailableWorkersPage() {
  const language = useAuthStore((state) => state.language);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [viewingWorkerId, setViewingWorkerId] = useState<number | null>(null);
  const [filters, setFilters] = useState<{
    search?: string;
    nationality?: string;
    job?: string;
    religion?: string;
    experience?: string;
    gender?: string;
    vip?: string;
    agent?: string;
  }>({});

  const t = (key: keyof typeof translations.en) => {
    return translations[language][key] || key;
  };

  const { data: workers = [], isLoading } = useWorkers();
  const { data: viewingWorker, isLoading: isViewingLoading } = useWorker(
    viewingWorkerId ? String(viewingWorkerId) : undefined
  );

  const getGenderLabel = (g?: number | null) => (g === 1 ? t('female') : t('male'));
  const getMaritalLabel = (m?: number | null) => (m === 1 ? t('married') : t('single'));

  // Filter workers (show only active workers)
  const filteredWorkers = useMemo(() => {
    return workers.filter((worker) => {
      const searchLower = filters.search?.toLowerCase() || '';
      const matchesSearch =
        !searchLower ||
        worker.fullNameAr?.toLowerCase().includes(searchLower) ||
        worker.fullNameEn?.toLowerCase().includes(searchLower) ||
        worker.passportNo?.toLowerCase().includes(searchLower);

      const matchesNationality =
        !filters.nationality || worker.nationalityId === Number(filters.nationality);
      const matchesJob = !filters.job || worker.jobname === filters.job;
      const matchesReligion = !filters.religion || worker.religion === Number(filters.religion);
      const matchesExperience =
        !filters.experience ||
        (filters.experience === '1' && worker.hasExperience) ||
        (filters.experience === '2' && !worker.hasExperience);
      const matchesAgent = !filters.agent || worker.agentId === Number(filters.agent);
      const matchesGender = !filters.gender || worker.gender === Number(filters.gender);

      // Only include active workers
      const matchesActive = worker.isActive === true;

      // Tab filtering based on workerType
      const matchesTab =
        activeTab === 'all' ||
        (activeTab === 'mediation' && worker.workerType === 1) ||
        (activeTab === 'rent' && worker.workerType === 2) ||
        (activeTab === 'sponsorship' && worker.workerType === 5);

      return (
        matchesActive &&
        matchesSearch &&
        matchesNationality &&
        matchesJob &&
        matchesReligion &&
        matchesExperience &&
        matchesAgent &&
        matchesGender &&
        matchesTab
      );
    });
  }, [workers, filters, activeTab]);

  // Stats
  const stats = useMemo(() => {
    return {
      total: filteredWorkers.length,
      mediation: filteredWorkers.filter((w) => w.workerType === 1).length,
      rent: filteredWorkers.filter((w) => w.workerType === 2).length,
      sponsorship: filteredWorkers.filter((w) => w.workerType === 3).length,
    };
  }, [filteredWorkers]);

  // Print menu
  const printMenu: MenuProps = {
    items: [
      {
        key: 'report',
        label: language === 'ar' ? 'تقرير العمالة' : 'Workers Report',
        icon: <FileTextOutlined />,
      },
    ],
    onClick: ({ key }) => {
      console.log('Print report:', key);
    },
  };

  // Tab items
  const tabs = [
    { key: 'all', label: t('all'), icon: <TeamOutlined /> },
    { key: 'mediation', label: t('mediationWorkers'), icon: <FileTextOutlined /> },
    { key: 'rent', label: t('rentWorkers'), icon: <FileTextOutlined /> },
    { key: 'sponsorship', label: t('sponsorshipWorkers'), icon: <FileTextOutlined /> },
  ];

  if (isLoading) {
    return (
      <div className={styles.availablePage}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
          }}
        >
          <Spin size="large" tip={language === 'ar' ? 'جاري التحميل...' : 'Loading...'} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.availablePage}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <TeamOutlined className={styles.headerIcon} />
            <div>
              <h1 className={styles.pageTitle}>{t('pageTitle')}</h1>
            </div>
          </div>
          <div className={styles.headerButtons}>
            <Dropdown menu={printMenu}>
              <Button className={styles.printButton} icon={<PrinterOutlined />}>
                {t('print')} <DownOutlined />
              </Button>
            </Dropdown>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={styles.tabNav}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`${styles.tabItem} ${activeTab === tab.key ? styles.tabItemActive : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Statistics */}
      <Row gutter={16} className={styles.statsRow}>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <div className={styles.statContent}>
              <div
                className={styles.statIcon}
                style={{ background: 'linear-gradient(135deg, #003366 0%, #00478c 100%)' }}
              >
                <TeamOutlined style={{ color: '#ffffff', fontSize: 24 }} />
              </div>
              <div className={styles.statInfo}>
                <p className={styles.statLabel}>{t('totalAvailable')}</p>
                <p className={styles.statValue}>{stats.total}</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <div className={styles.statContent}>
              <div
                className={styles.statIcon}
                style={{ background: 'linear-gradient(135deg, #00aa64 0%, #00c478 100%)' }}
              >
                <FileTextOutlined style={{ color: '#ffffff', fontSize: 24 }} />
              </div>
              <div className={styles.statInfo}>
                <p className={styles.statLabel}>{t('mediation')}</p>
                <p className={styles.statValue}>{stats.mediation}</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <div className={styles.statContent}>
              <div
                className={styles.statIcon}
                style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)' }}
              >
                <FileTextOutlined style={{ color: '#ffffff', fontSize: 24 }} />
              </div>
              <div className={styles.statInfo}>
                <p className={styles.statLabel}>{t('rent')}</p>
                <p className={styles.statValue}>{stats.rent}</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <div className={styles.statContent}>
              <div
                className={styles.statIcon}
                style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)' }}
              >
                <FileTextOutlined style={{ color: '#ffffff', fontSize: 24 }} />
              </div>
              <div className={styles.statInfo}>
                <p className={styles.statLabel}>{t('sponsorship')}</p>
                <p className={styles.statValue}>{stats.sponsorship}</p>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Search and Filters */}
      <Card className={styles.filterCard}>
        <div className={styles.filterHeader}>
          <Space wrap>
            <Input
              size="large"
              placeholder={t('searchPlaceholder')}
              prefix={<SearchOutlined />}
              value={filters.search || ''}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              style={{ width: 300 }}
              allowClear
            />
            <Button
              icon={<FilterOutlined />}
              onClick={() => setShowFilters(!showFilters)}
              type={showFilters ? 'primary' : 'default'}
              size="large"
            >
              {t('filters')}
            </Button>
          </Space>
        </div>

        {showFilters && (
          <div className={styles.filterContent}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={6}>
                <label className={styles.filterLabel}>{t('nationality')}</label>
                <Select
                  size="large"
                  placeholder={t('nationality')}
                  value={filters.nationality}
                  onChange={(value) => setFilters({ ...filters, nationality: value })}
                  style={{ width: '100%' }}
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  options={[
                    { value: '359', label: language === 'ar' ? 'الفلبين' : 'Philippines' },
                    { value: '360', label: language === 'ar' ? 'كينيا' : 'Kenya' },
                    { value: '361', label: language === 'ar' ? 'أوغندا' : 'Uganda' },
                    { value: '362', label: language === 'ar' ? 'الهند' : 'India' },
                    { value: '363', label: language === 'ar' ? 'السودان' : 'Sudan' },
                    { value: '364', label: language === 'ar' ? 'مصر' : 'Egypt' },
                    { value: '366', label: language === 'ar' ? 'بنجلادش' : 'Bangladesh' },
                    { value: '367', label: language === 'ar' ? 'باكستان' : 'Pakistan' },
                    { value: '731', label: language === 'ar' ? 'أثيوبيا' : 'Ethiopia' },
                    { value: '771', label: language === 'ar' ? 'أندونيسيا' : 'Indonesia' },
                  ]}
                />
              </Col>

              <Col xs={24} md={6}>
                <label className={styles.filterLabel}>{t('religion')}</label>
                <Select
                  size="large"
                  placeholder={t('religion')}
                  value={filters.religion}
                  onChange={(value) => setFilters({ ...filters, religion: value })}
                  style={{ width: '100%' }}
                  allowClear
                >
                  <Select.Option value="1">{t('muslim')}</Select.Option>
                  <Select.Option value="2">{t('nonMuslim')}</Select.Option>
                </Select>
              </Col>

              <Col xs={24} md={6}>
                <label className={styles.filterLabel}>{t('experience')}</label>
                <Select
                  size="large"
                  placeholder={t('experience')}
                  value={filters.experience}
                  onChange={(value) => setFilters({ ...filters, experience: value })}
                  style={{ width: '100%' }}
                  allowClear
                >
                  <Select.Option value="1">{t('hasExperience')}</Select.Option>
                  <Select.Option value="2">{t('noExperience')}</Select.Option>
                </Select>
              </Col>

              <Col xs={24} md={6}>
                <label className={styles.filterLabel}>{t('gender')}</label>
                <Select
                  size="large"
                  placeholder={t('gender')}
                  value={filters.gender}
                  onChange={(value) => setFilters({ ...filters, gender: value })}
                  style={{ width: '100%' }}
                  allowClear
                >
                  <Select.Option value="0">{t('male')}</Select.Option>
                  <Select.Option value="1">{t('female')}</Select.Option>
                </Select>
              </Col>
            </Row>
          </div>
        )}
      </Card>

      {/* Workers Cards */}
      {filteredWorkers.length === 0 ? (
        <Card className={styles.emptyState}>
          <Empty description={t('noWorkersDesc')} image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </Card>
      ) : (
        <div className={styles.workersGrid}>
          {filteredWorkers.map((worker) => (
            <Card key={worker.id} className={styles.workerCard}>
              <div className={styles.cardLayout}>
                {/* Worker Image */}
                <div className={styles.cardImage}>
                  <Avatar
                    size={120}
                    icon={<UserOutlined />}
                    className={styles.workerAvatar}
                    style={{
                      backgroundColor: worker.gender === 1 ? '#f472b6' : '#003366',
                    }}
                  />
                </div>

                {/* Card Body */}
                <div className={styles.cardBody}>
                  <div className={styles.cardTop}>
                    <div className={styles.workerMainInfo}>
                      <p className={styles.workerRef}>{worker.referenceNo || 'N/A'}</p>
                      <h3 className={styles.workerName}>
                        {language === 'ar'
                          ? worker.fullNameAr || worker.fullNameEn
                          : worker.fullNameEn || worker.fullNameAr}
                      </h3>
                      {worker.fullNameEn && worker.fullNameAr && (
                        <p className={styles.workerSubName}>
                          {language === 'ar' ? worker.fullNameEn : worker.fullNameAr}
                        </p>
                      )}
                      <div className={styles.workerTags}>
                        <Tag color="blue" icon={<FlagOutlined />}>
                          {worker.nationalityId || 'N/A'}
                        </Tag>
                        <Tag color="green" icon={<IdcardOutlined />}>
                          {worker.passportNo || 'N/A'}
                        </Tag>
                        {worker.hasExperience && (
                          <Tag color="orange" icon={<StarFilled />}>
                            {t('hasExperience')}
                          </Tag>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className={styles.cardDetails}>
                    <div className={styles.detailGroup}>
                      <p className={styles.detailGroupTitle}>{t('personalInfo')}</p>
                      <div className={styles.detailItem}>
                        <span className={styles.detailItemLabel}>{t('gender')}</span>
                        <span className={styles.detailItemValue}>
                          {worker.gender === 0 ? (
                            <Tag icon={<ManOutlined />} color="blue">
                              {t('male')}
                            </Tag>
                          ) : worker.gender === 1 ? (
                            <Tag icon={<WomanOutlined />} color="pink">
                              {t('female')}
                            </Tag>
                          ) : (
                            'N/A'
                          )}
                        </span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailItemLabel}>{t('age')}</span>
                        <span className={styles.detailItemValue}>
                          {worker.age ? `${worker.age} ${t('years')}` : 'N/A'}
                        </span>
                      </div>

                      <div className={styles.detailItem}>
                        <span className={styles.detailItemLabel}>{t('maritalStatus')}</span>
                        <span className={styles.detailItemValue}>
                          {worker.maritalStatus === 1 ? t('married') : t('single')}
                        </span>
                      </div>
                    </div>

                    <div className={styles.detailGroup}>
                      <p className={styles.detailGroupTitle}>{t('workInfo')}</p>
                      <div className={styles.detailItem}>
                        <span className={styles.detailItemLabel}>{t('jobname')}</span>
                        <span className={styles.detailItemValue}>{worker.jobname || 'N/A'}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailItemLabel}>{t('experience')}</span>
                        <span className={styles.detailItemValue}>
                          {worker.hasExperience ? t('hasExperience') : t('noExperience')}
                        </span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailItemLabel}>{t('agentName')}</span>
                        <span className={styles.detailItemValue}>
                          {worker.agentName || worker.agentId || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className={styles.cardFooter}>
                    <div className={styles.cardFooterLeft}>
                      {worker.skills && worker.skills.length > 0 && (
                        <>
                          {worker.skills.slice(0, 3).map((skill, i) => (
                            <Tag key={i} color="cyan">
                              {skill}
                            </Tag>
                          ))}
                          {worker.skills.length > 3 && <Tag>+{worker.skills.length - 3}</Tag>}
                        </>
                      )}
                    </div>
                    <div className={styles.cardFooterRight}>
                      <Tooltip title={t('view')}>
                        <Button
                          type="default"
                          icon={<EyeOutlined />}
                          className={`${styles.actionBtn} ${styles.viewBtn}`}
                          onClick={() => setViewingWorkerId(worker.id)}
                        >
                          {t('view')}
                        </Button>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        title={
          <Space>
            <EyeOutlined />
            <span>{t('viewWorker')}</span>
          </Space>
        }
        open={!!viewingWorkerId}
        onCancel={() => setViewingWorkerId(null)}
        footer={
          <Button type="primary" onClick={() => setViewingWorkerId(null)}>
            {t('close')}
          </Button>
        }
        width={900}
      >
        {(isViewingLoading || viewingWorker) && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              {viewingWorker?.uploadimage ? (
                <Image
                  src={viewingWorker.uploadimage}
                  alt={viewingWorker.fullNameAr || 'Worker'}
                  width={150}
                  height={150}
                  style={{ borderRadius: '50%', objectFit: 'cover', border: '4px solid #003366' }}
                  preview={{ mask: <EyeOutlined style={{ fontSize: 20 }} /> }}
                />
              ) : (
                <Avatar
                  size={150}
                  icon={<UserOutlined />}
                  style={{ backgroundColor: viewingWorker?.gender === 1 ? '#f472b6' : '#003366' }}
                />
              )}
              <h2 style={{ margin: '12px 0 4px', color: '#003366' }}>
                {language === 'ar'
                  ? viewingWorker?.fullNameAr
                  : viewingWorker?.fullNameEn || viewingWorker?.fullNameAr}
              </h2>
              <p style={{ color: '#6b7280', margin: 0 }}>
                {language === 'ar' ? viewingWorker?.fullNameEn : viewingWorker?.fullNameAr}
              </p>
            </div>

            <Divider />

            <Descriptions
              title={t('personalDetails')}
              bordered
              column={{ xs: 1, sm: 2 }}
              size="small"
              style={{ marginBottom: 16 }}
            >
              <Descriptions.Item label={t('referenceNo')}>
                {viewingWorker?.referenceNo || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('gender')}>
                {getGenderLabel(viewingWorker?.gender)}
              </Descriptions.Item>
              <Descriptions.Item label={t('age')}>
                {viewingWorker?.age ? `${viewingWorker.age} ${t('years')}` : '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('birthDate')}>
                {viewingWorker?.birthDate
                  ? dayjs(viewingWorker.birthDate).format('YYYY-MM-DD')
                  : '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('maritalStatus')}>
                {getMaritalLabel(viewingWorker?.maritalStatus)}
              </Descriptions.Item>
              <Descriptions.Item label={t('childrenCount')}>
                {viewingWorker?.childrenCount ?? '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('religion')}>
                {viewingWorker?.religion === 1
                  ? t('muslim')
                  : viewingWorker?.religion === 2
                    ? t('nonMuslim')
                    : viewingWorker?.religion || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('nationality')}>
                {viewingWorker?.nationalityId || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('educationLevelAr')}>
                {viewingWorker?.educationLevelAr || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('educationLevelEn')}>
                {viewingWorker?.educationLevelEn || '-'}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions
              title={t('passportDetails')}
              bordered
              column={{ xs: 1, sm: 2 }}
              size="small"
              style={{ marginBottom: 16 }}
            >
              <Descriptions.Item label={t('passportNo')}>
                {viewingWorker?.passportNo || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('passportIssueDate')}>
                {viewingWorker?.passportIssueDate
                  ? dayjs(viewingWorker.passportIssueDate).format('YYYY-MM-DD')
                  : '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('passportExpiryDate')}>
                {viewingWorker?.passportExpiryDate
                  ? dayjs(viewingWorker.passportExpiryDate).format('YYYY-MM-DD')
                  : '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('passportIssuePlaceAr')}>
                {viewingWorker?.passportIssuePlaceAr || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('passportIssuePlaceEn')}>
                {viewingWorker?.passportIssuePlaceEn || '-'}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions
              title={t('workInfo')}
              bordered
              column={{ xs: 1, sm: 2 }}
              size="small"
              style={{ marginBottom: 16 }}
            >
              <Descriptions.Item label={t('jobname')}>
                {viewingWorker?.jobname || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('basicSalary')}>
                {viewingWorker?.basicSalary || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('agentName')}>
                {viewingWorker?.agentName || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('createdBy')}>
                {viewingWorker?.userName || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('workerType')}>
                {viewingWorker?.workerType === 1
                  ? t('mediation')
                  : viewingWorker?.workerType === 2
                    ? t('rent')
                    : viewingWorker?.workerType === 3
                      ? t('sponsorship')
                      : '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('boxNumber')}>
                {viewingWorker?.boxNumber || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('borderNumber')}>
                {viewingWorker?.borderNumber || '-'}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions
              title={t('contactDetails')}
              bordered
              column={{ xs: 1, sm: 2 }}
              size="small"
              style={{ marginBottom: 16 }}
            >
              <Descriptions.Item label={t('mobile')}>
                {viewingWorker?.mobile || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('phone')}>
                {viewingWorker?.phone || '-'}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions
              title={t('addressDetails')}
              bordered
              column={{ xs: 1, sm: 2 }}
              size="small"
            >
              <Descriptions.Item label={t('addressAr')}>
                {viewingWorker?.addressAr || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('addressEn')}>
                {viewingWorker?.addressEn || '-'}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
}
