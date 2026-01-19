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
  Space,
  Statistic,
  Dropdown,
  message,
  Collapse,
  Tabs,
  Badge,
  Divider,
  Tooltip,
} from 'antd';
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  SearchOutlined,
  PlusOutlined,
  WhatsAppOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  FilterOutlined,
  UsergroupAddOutlined,
  CheckCircleOutlined,
  IdcardOutlined,
  DollarOutlined,
  FileExcelOutlined,
  PrinterOutlined,
  StarOutlined,
  DownOutlined,
  UpOutlined,
  CopyOutlined,
  FileAddOutlined,
  SwapOutlined,
} from '@ant-design/icons';

import { useAuthStore } from '@/store/authStore';
import styles from './Customers.module.css';

const { Panel } = Collapse;

interface Customer {
  id: string;
  name: string;
  nameAr: string;
  email: string;
  phone: string;
  nationalId: string;
  city: string;
  cityAr: string;
  address: string;
  addressAr: string;
  status: 'active' | 'pending' | 'inactive' | 'blocked';
  branch: string;
  branchAr: string;
  customerType: 'individual' | 'company';
  nationality: string;
  nationalityAr: string;
  maritalStatus: string;
  maritalStatusAr: string;
  residenceType: string;
  residenceTypeAr: string;
  evaluationLevel: 'good' | 'excellent' | 'bad' | 'forbidden';
  importance: 'important' | 'not-important';
  marketer: string;
  hasDebt: boolean;
  totalContracts: number;
  mediationContracts: number;
  sponsorshipContracts: number;
  rentContracts: number;
  complaintsCount: number;
  registrationDate: string;
  lastContact: string;
  notes: string;
  notesAr: string;
}

export default function CustomersPage() {
  const language = useAuthStore((state) => state.language);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [branchFilter, setBranchFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [nationalityFilter, setNationalityFilter] = useState<string[]>([]);
  const [debtFilter, setDebtFilter] = useState<string>('all');
  const [contractFilter, setContractFilter] = useState<string>('all');
  const [evaluationFilter, setEvaluationFilter] = useState<string[]>([]);
  const [importanceFilter, setImportanceFilter] = useState<string>('all');
  const [marketerFilter, setMarketerFilter] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  // Mock data - will be replaced with API
  const mockCustomers: Customer[] = Array.from({ length: 50 }, (_, i) => {
    const statuses: Customer['status'][] = ['active', 'pending', 'inactive', 'blocked'];
    const types: Customer['customerType'][] = ['individual', 'company'];
    const evaluations: Customer['evaluationLevel'][] = ['good', 'excellent', 'bad', 'forbidden'];
    const importances: Customer['importance'][] = ['important', 'not-important'];

    const branches = ['Main Branch', 'North Branch', 'East Branch', 'West Branch'];
    const branchesAr = ['الفرع الرئيسي', 'الفرع الشمالي', 'الفرع الشرقي', 'الفرع الغربي'];
    const cities = ['Riyadh', 'Jeddah', 'Dammam', 'Mecca', 'Medina'];
    const citiesAr = ['الرياض', 'جدة', 'الدمام', 'مكة', 'المدينة'];
    const nationalities = ['Saudi Arabia', 'Philippines', 'Kenya', 'India', 'Bangladesh'];
    const nationalitiesAr = ['السعودية', 'الفلبين', 'كينيا', 'الهند', 'بنجلاديش'];
    const maritalStatuses = ['Single', 'Married', 'Divorced', 'Widowed'];
    const maritalStatusesAr = ['أعزب', 'متزوج', 'مطلق', 'أرمل'];
    const residenceTypes = ['Apartment', 'Villa', 'House', 'Compound'];
    const residenceTypesAr = ['شقة', 'فيلا', 'منزل', 'مجمع'];
    const marketers = ['Google', 'Snapchat', 'Instagram', 'Twitter', 'Musaned', 'Friend'];

    const branchIdx = i % branches.length;
    const cityIdx = i % cities.length;
    const statusIdx = i % statuses.length;
    const typeIdx = i % types.length;
    const nationalityIdx = i % nationalities.length;

    return {
      id: `customer-${i + 1}`,
      name: `Customer ${i + 1}`,
      nameAr: `العميل ${i + 1}`,
      email: `customer${i + 1}@email.com`,
      phone: `+966 5${Math.floor(Math.random() * 90000000 + 10000000)}`,
      nationalId: `${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
      city: cities[cityIdx],
      cityAr: citiesAr[cityIdx],
      address: `Address ${i + 1}, Street ${i + 10}`,
      addressAr: `العنوان ${i + 1}، شارع ${i + 10}`,
      status: statuses[statusIdx],
      branch: branches[branchIdx],
      branchAr: branchesAr[branchIdx],
      customerType: types[typeIdx],
      nationality: nationalities[nationalityIdx],
      nationalityAr: nationalitiesAr[nationalityIdx],
      maritalStatus: maritalStatuses[i % maritalStatuses.length],
      maritalStatusAr: maritalStatusesAr[i % maritalStatusesAr.length],
      residenceType: residenceTypes[i % residenceTypes.length],
      residenceTypeAr: residenceTypesAr[i % residenceTypesAr.length],
      evaluationLevel: evaluations[i % evaluations.length],
      importance: importances[i % importances.length],
      marketer: marketers[i % marketers.length],
      hasDebt: Math.random() > 0.5,
      totalContracts: Math.floor(Math.random() * 20),
      mediationContracts: Math.floor(Math.random() * 10),
      sponsorshipContracts: Math.floor(Math.random() * 5),
      rentContracts: Math.floor(Math.random() * 8),
      complaintsCount: Math.floor(Math.random() * 3),
      registrationDate: new Date(
        2023,
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1
      )
        .toISOString()
        .split('T')[0],
      lastContact: new Date(
        2024,
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1
      )
        .toISOString()
        .split('T')[0],
      notes: `Customer notes ${i + 1}`,
      notesAr: `ملاحظات العميل ${i + 1}`,
    };
  });

  const filteredCustomers = useMemo(() => {
    return mockCustomers.filter((customer) => {
      const matchesSearch =
        searchText === '' ||
        customer.name.toLowerCase().includes(searchText.toLowerCase()) ||
        customer.nameAr.includes(searchText) ||
        customer.email.toLowerCase().includes(searchText.toLowerCase()) ||
        customer.phone.includes(searchText) ||
        customer.nationalId.includes(searchText);

      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
      const matchesBranch =
        branchFilter === 'all' ||
        customer.branch === branchFilter ||
        customer.branchAr === branchFilter;
      const matchesType = typeFilter === 'all' || customer.customerType === typeFilter;
      const matchesNationality =
        nationalityFilter.length === 0 || nationalityFilter.includes(customer.nationality);
      const matchesDebt =
        debtFilter === 'all' ||
        (debtFilter === 'debtors' && customer.hasDebt) ||
        (debtFilter === 'paid' && !customer.hasDebt);
      const matchesContract =
        contractFilter === 'all' ||
        (contractFilter === 'with' && customer.totalContracts > 0) ||
        (contractFilter === 'without' && customer.totalContracts === 0);
      const matchesEvaluation =
        evaluationFilter.length === 0 || evaluationFilter.includes(customer.evaluationLevel);
      const matchesImportance =
        importanceFilter === 'all' || customer.importance === importanceFilter;
      const matchesMarketer =
        marketerFilter.length === 0 || marketerFilter.includes(customer.marketer);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesBranch &&
        matchesType &&
        matchesNationality &&
        matchesDebt &&
        matchesContract &&
        matchesEvaluation &&
        matchesImportance &&
        matchesMarketer
      );
    });
  }, [
    mockCustomers,
    searchText,
    statusFilter,
    branchFilter,
    typeFilter,
    nationalityFilter,
    debtFilter,
    contractFilter,
    evaluationFilter,
    importanceFilter,
    marketerFilter,
  ]);

  const statistics = useMemo(() => {
    return {
      total: mockCustomers.length,
      active: mockCustomers.filter((c) => c.status === 'active').length,
      withDebt: mockCustomers.filter((c) => c.hasDebt).length,
      important: mockCustomers.filter((c) => c.importance === 'important').length,
      totalContracts: mockCustomers.reduce((sum, c) => sum + c.totalContracts, 0),
      totalComplaints: mockCustomers.reduce((sum, c) => sum + c.complaintsCount, 0),
    };
  }, [mockCustomers]);

  const getEvaluationTag = (level: Customer['evaluationLevel']) => {
    const config = {
      excellent: { color: 'green', label: language === 'ar' ? 'ممتاز' : 'Excellent' },
      good: { color: 'blue', label: language === 'ar' ? 'جيد' : 'Good' },
      bad: { color: 'orange', label: language === 'ar' ? 'سيء' : 'Bad' },
      forbidden: { color: 'red', label: language === 'ar' ? 'محظور' : 'Forbidden' },
    };
    const { color, label } = config[level];
    return <Tag color={color}>{label}</Tag>;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success(language === 'ar' ? 'تم النسخ' : 'Copied!');
  };

  const renderCustomerCard = (customer: Customer) => {
    const tabItems = [
      {
        key: '1',
        label: (
          <span>
            <UserOutlined /> {language === 'ar' ? 'معلومات العميل' : 'Customer Info'}
          </span>
        ),
        children: (
          <div className={styles.customerDetails}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <div className={styles.infoItem}>
                  <strong>{language === 'ar' ? 'الجنسية:' : 'Nationality:'}</strong>
                  <span>{language === 'ar' ? customer.nationalityAr : customer.nationality}</span>
                </div>
                <div className={styles.infoItem}>
                  <strong>{language === 'ar' ? 'الحالة الاجتماعية:' : 'Marital Status:'}</strong>
                  <span>
                    {language === 'ar' ? customer.maritalStatusAr : customer.maritalStatus}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <strong>{language === 'ar' ? 'نوع السكن:' : 'Residence Type:'}</strong>
                  <span>
                    {language === 'ar' ? customer.residenceTypeAr : customer.residenceType}
                  </span>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div className={styles.infoItem}>
                  <strong>{language === 'ar' ? 'المدينة:' : 'City:'}</strong>
                  <span>{language === 'ar' ? customer.cityAr : customer.city}</span>
                </div>
                <div className={styles.infoItem}>
                  <strong>{language === 'ar' ? 'عدد الشكاوي:' : 'Complaints:'}</strong>
                  <Tag color={customer.complaintsCount > 0 ? 'red' : 'green'}>
                    {customer.complaintsCount}
                  </Tag>
                </div>
                <div className={styles.infoItem}>
                  <strong>{language === 'ar' ? 'التقييم:' : 'Evaluation:'}</strong>
                  {getEvaluationTag(customer.evaluationLevel)}
                </div>
              </Col>
            </Row>
          </div>
        ),
      },
      {
        key: '2',
        label: (
          <span>
            <FileTextOutlined /> {language === 'ar' ? 'عقود الوساطة' : 'Mediation Contracts'} (
            {customer.mediationContracts})
          </span>
        ),
        children: (
          <div className={styles.tabContent}>
            <p>{language === 'ar' ? 'لا توجد عقود' : 'No contracts available'}</p>
          </div>
        ),
      },
      {
        key: '3',
        label: (
          <span>
            <SwapOutlined /> {language === 'ar' ? 'عقود نقل الكفالة' : 'Sponsorship Transfer'} (
            {customer.sponsorshipContracts})
          </span>
        ),
        children: (
          <div className={styles.tabContent}>
            <p>{language === 'ar' ? 'لا توجد عقود' : 'No contracts available'}</p>
          </div>
        ),
      },
      {
        key: '4',
        label: (
          <span>
            <FileTextOutlined /> {language === 'ar' ? 'عقود التشغيل' : 'Operation Contracts'} (
            {customer.rentContracts})
          </span>
        ),
        children: (
          <div className={styles.tabContent}>
            <p>{language === 'ar' ? 'لا توجد عقود' : 'No contracts available'}</p>
          </div>
        ),
      },
      {
        key: '5',
        label: (
          <span>
            <DollarOutlined /> {language === 'ar' ? 'الفاتورة' : 'Bill'}
          </span>
        ),
        children: (
          <div className={styles.tabContent}>
            <p>{language === 'ar' ? 'لا توجد فواتير' : 'No bills available'}</p>
          </div>
        ),
      },
    ];

    return (
      <Panel
        key={customer.id}
        header={
          <div className={styles.customerCardHeader}>
            <div className={styles.customerMainInfo}>
              <div className={styles.customerNameSection}>
                <div className={styles.customerName}>
                  {language === 'ar' ? customer.nameAr : customer.name}
                  {customer.importance === 'important' && (
                    <Tooltip title={language === 'ar' ? 'عميل مهم' : 'Important Customer'}>
                      <StarOutlined className={styles.importantIcon} />
                    </Tooltip>
                  )}
                </div>
                <Space size="small" wrap>
                  <Tag color={customer.customerType === 'company' ? 'blue' : 'purple'}>
                    {customer.customerType === 'company'
                      ? language === 'ar'
                        ? 'شركة'
                        : 'Company'
                      : language === 'ar'
                        ? 'فرد'
                        : 'Individual'}
                  </Tag>
                  <Tag color="default">
                    <IdcardOutlined /> {customer.nationalId}
                    <Tooltip title={language === 'ar' ? 'نسخ' : 'Copy'}>
                      <CopyOutlined
                        className={styles.copyIcon}
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(customer.nationalId);
                        }}
                      />
                    </Tooltip>
                  </Tag>
                </Space>
                <Space size="small" wrap className={styles.contactIcons}>
                  <Tooltip title={customer.phone}>
                    <a
                      href={`https://wa.me/${customer.phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <WhatsAppOutlined className={styles.whatsappIcon} /> {customer.phone}
                    </a>
                  </Tooltip>
                  <Tooltip title={language === 'ar' ? 'نسخ' : 'Copy'}>
                    <CopyOutlined
                      className={styles.copyIcon}
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(customer.phone);
                      }}
                    />
                  </Tooltip>
                </Space>
              </div>
            </div>
            <div className={styles.customerStats}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>
                  {language === 'ar' ? 'عقود الوساطة' : 'Mediation'}
                </span>
                <span className={styles.statValue}>{customer.mediationContracts}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>
                  {language === 'ar' ? 'عقود التشغيل' : 'Operation'}
                </span>
                <span className={styles.statValue}>{customer.rentContracts}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>
                  {language === 'ar' ? 'الشكاوي' : 'Complaints'}
                </span>
                <span
                  className={styles.statValue}
                  style={{ color: customer.complaintsCount > 0 ? '#ff4d4f' : '#00AA64' }}
                >
                  {customer.complaintsCount}
                </span>
              </div>
            </div>
          </div>
        }
        extra={
          <Space size="small" onClick={(e) => e.stopPropagation()}>
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => message.info(`Edit customer ${customer.id}`)}
            >
              {language === 'ar' ? 'تعديل' : 'Edit'}
            </Button>
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => message.warning(`Delete customer ${customer.id}`)}
            >
              {language === 'ar' ? 'حذف' : 'Delete'}
            </Button>
          </Space>
        }
      >
        <Tabs items={tabItems} size="large" tabBarGutter={16} />
        <Divider />
        <div className={styles.customerActions}>
          <Space wrap size="small">
            <Button icon={<FileAddOutlined />} onClick={() => message.info('Add Complaint')}>
              {language === 'ar' ? 'إضافة شكوى' : 'Add Complaint'}
            </Button>
            <Button
              icon={<FileTextOutlined />}
              onClick={() => message.info('Add Mediation Contract')}
            >
              {language === 'ar' ? 'عقد وساطة' : 'Mediation Contract'}
            </Button>
            <Button
              icon={<SwapOutlined />}
              onClick={() => message.info('Add Sponsorship Transfer')}
            >
              {language === 'ar' ? 'نقل كفالة' : 'Sponsorship Transfer'}
            </Button>
            <Button icon={<FileTextOutlined />} onClick={() => message.info('Add Rent Contract')}>
              {language === 'ar' ? 'عقد إيجار' : 'Rent Contract'}
            </Button>
            <Button icon={<PhoneOutlined />} onClick={() => message.info('Add Contact')}>
              {language === 'ar' ? 'إضافة اتصال' : 'Add Contact'}
            </Button>
          </Space>
        </div>
      </Panel>
    );
  };

  return (
    <div className={styles.customersPage}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerTitle}>
            <UsergroupAddOutlined className={styles.headerIcon} />
            <h1>{language === 'ar' ? 'إدارة العملاء' : 'Customer Management'}</h1>
          </div>
          <div className={styles.headerActions}>
            <Space wrap>
              <Button type="primary" icon={<PlusOutlined />} size="large">
                {language === 'ar' ? 'إضافة عميل' : 'Add Customer'}
              </Button>
              <Button icon={<MailOutlined />} size="large">
                {language === 'ar' ? 'إرسال بريد' : 'Send Email'}
              </Button>
              <Button icon={<FileExcelOutlined />} size="large">
                {language === 'ar' ? 'إضافة من إكسل' : 'Add from Excel'}
              </Button>
              <Button icon={<WhatsAppOutlined />} size="large">
                {language === 'ar' ? 'واتساب' : 'WhatsApp'}
              </Button>
              <Dropdown
                menu={{
                  items: [
                    { key: '1', label: language === 'ar' ? 'تقرير شامل' : 'Full Report' },
                    { key: '2', label: language === 'ar' ? 'تقرير العملاء' : 'Customers Report' },
                  ],
                }}
              >
                <Button icon={<PrinterOutlined />} size="large">
                  {language === 'ar' ? 'طباعة' : 'Print'} <DownOutlined />
                </Button>
              </Dropdown>
            </Space>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className={styles.statisticsRow}>
        <Col xs={24} sm={12} lg={4}>
          <Card className={styles.statCard}>
            <Statistic
              title={language === 'ar' ? 'إجمالي العملاء' : 'Total Customers'}
              value={statistics.total}
              prefix={<UsergroupAddOutlined />}
              valueStyle={{ color: '#003366' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className={styles.statCard}>
            <Statistic
              title={language === 'ar' ? 'العملاء النشطون' : 'Active Customers'}
              value={statistics.active}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#00AA64' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className={styles.statCard}>
            <Statistic
              title={language === 'ar' ? 'عملاء مهمون' : 'Important'}
              value={statistics.important}
              prefix={<StarOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className={styles.statCard}>
            <Statistic
              title={language === 'ar' ? 'عملاء مدينون' : 'Debtors'}
              value={statistics.withDebt}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className={styles.statCard}>
            <Statistic
              title={language === 'ar' ? 'إجمالي العقود' : 'Total Contracts'}
              value={statistics.totalContracts}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#00478C' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className={styles.statCard}>
            <Statistic
              title={language === 'ar' ? 'إجمالي الشكاوي' : 'Total Complaints'}
              value={statistics.totalComplaints}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content Card */}
      <Card className={styles.mainCard}>
        {/* Search and Quick Filters */}
        <div className={styles.filterSection}>
          <Row gutter={[12, 12]} align="middle">
            <Col xs={24} md={12} lg={8}>
              <Input
                size="large"
                placeholder={language === 'ar' ? 'البحث عن عميل...' : 'Search customers...'}
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={12} md={6} lg={4}>
              <Select
                size="large"
                style={{ width: '100%' }}
                placeholder={language === 'ar' ? 'الحالة' : 'Status'}
                value={statusFilter}
                onChange={setStatusFilter}
              >
                <Select.Option value="all">
                  {language === 'ar' ? 'جميع الحالات' : 'All Status'}
                </Select.Option>
                <Select.Option value="active">{language === 'ar' ? 'نشط' : 'Active'}</Select.Option>
                <Select.Option value="pending">
                  {language === 'ar' ? 'قيد الانتظار' : 'Pending'}
                </Select.Option>
                <Select.Option value="inactive">
                  {language === 'ar' ? 'غير نشط' : 'Inactive'}
                </Select.Option>
                <Select.Option value="blocked">
                  {language === 'ar' ? 'محظور' : 'Blocked'}
                </Select.Option>
              </Select>
            </Col>
            <Col xs={12} md={6} lg={4}>
              <Select
                size="large"
                style={{ width: '100%' }}
                placeholder={language === 'ar' ? 'النوع' : 'Type'}
                value={typeFilter}
                onChange={setTypeFilter}
              >
                <Select.Option value="all">
                  {language === 'ar' ? 'جميع الأنواع' : 'All Types'}
                </Select.Option>
                <Select.Option value="individual">
                  {language === 'ar' ? 'فرد' : 'Individual'}
                </Select.Option>
                <Select.Option value="company">
                  {language === 'ar' ? 'شركة' : 'Company'}
                </Select.Option>
              </Select>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Space wrap>
                <Button
                  icon={<FilterOutlined />}
                  onClick={() => setShowFilters(!showFilters)}
                  type={showFilters ? 'primary' : 'default'}
                >
                  {language === 'ar' ? 'فلاتر متقدمة' : 'Advanced Filters'}
                  {showFilters ? <UpOutlined /> : <DownOutlined />}
                </Button>
                <Badge count={filteredCustomers.length} showZero color="#003366">
                  <Button>{language === 'ar' ? 'النتائج' : 'Results'}</Button>
                </Badge>
              </Space>
            </Col>
          </Row>

          {/* Advanced Filters */}
          {showFilters && (
            <div className={styles.advancedFilters}>
              <Divider>{language === 'ar' ? 'الفلاتر المتقدمة' : 'Advanced Filters'}</Divider>
              <Row gutter={[12, 12]}>
                <Col xs={24} md={8}>
                  <Select
                    mode="multiple"
                    size="large"
                    style={{ width: '100%' }}
                    placeholder={language === 'ar' ? 'الجنسية' : 'Nationality'}
                    value={nationalityFilter}
                    onChange={setNationalityFilter}
                    showSearch
                    maxTagCount="responsive"
                  >
                    <Select.Option value="Saudi Arabia">
                      {language === 'ar' ? 'السعودية' : 'Saudi Arabia'}
                    </Select.Option>
                    <Select.Option value="Philippines">
                      {language === 'ar' ? 'الفلبين' : 'Philippines'}
                    </Select.Option>
                    <Select.Option value="Kenya">
                      {language === 'ar' ? 'كينيا' : 'Kenya'}
                    </Select.Option>
                    <Select.Option value="India">
                      {language === 'ar' ? 'الهند' : 'India'}
                    </Select.Option>
                    <Select.Option value="Bangladesh">
                      {language === 'ar' ? 'بنجلاديش' : 'Bangladesh'}
                    </Select.Option>
                  </Select>
                </Col>
                <Col xs={24} md={8}>
                  <Select
                    size="large"
                    style={{ width: '100%' }}
                    placeholder={language === 'ar' ? 'المديونية' : 'Debt Status'}
                    value={debtFilter}
                    onChange={setDebtFilter}
                  >
                    <Select.Option value="all">{language === 'ar' ? 'الكل' : 'All'}</Select.Option>
                    <Select.Option value="debtors">
                      {language === 'ar' ? 'مدينون' : 'Debtors'}
                    </Select.Option>
                    <Select.Option value="paid">
                      {language === 'ar' ? 'مسدد' : 'Paid'}
                    </Select.Option>
                  </Select>
                </Col>
                <Col xs={24} md={8}>
                  <Select
                    size="large"
                    style={{ width: '100%' }}
                    placeholder={language === 'ar' ? 'العقود' : 'Contracts'}
                    value={contractFilter}
                    onChange={setContractFilter}
                  >
                    <Select.Option value="all">{language === 'ar' ? 'الكل' : 'All'}</Select.Option>
                    <Select.Option value="with">
                      {language === 'ar' ? 'لديه عقود' : 'With Contracts'}
                    </Select.Option>
                    <Select.Option value="without">
                      {language === 'ar' ? 'بدون عقود' : 'Without Contracts'}
                    </Select.Option>
                  </Select>
                </Col>
                <Col xs={24} md={8}>
                  <Select
                    mode="multiple"
                    size="large"
                    style={{ width: '100%' }}
                    placeholder={language === 'ar' ? 'مستوى التقييم' : 'Evaluation Level'}
                    value={evaluationFilter}
                    onChange={setEvaluationFilter}
                    maxTagCount="responsive"
                  >
                    <Select.Option value="excellent">
                      {language === 'ar' ? 'ممتاز' : 'Excellent'}
                    </Select.Option>
                    <Select.Option value="good">{language === 'ar' ? 'جيد' : 'Good'}</Select.Option>
                    <Select.Option value="bad">{language === 'ar' ? 'سيء' : 'Bad'}</Select.Option>
                    <Select.Option value="forbidden">
                      {language === 'ar' ? 'محظور' : 'Forbidden'}
                    </Select.Option>
                  </Select>
                </Col>
                <Col xs={24} md={8}>
                  <Select
                    size="large"
                    style={{ width: '100%' }}
                    placeholder={language === 'ar' ? 'الأهمية' : 'Importance'}
                    value={importanceFilter}
                    onChange={setImportanceFilter}
                  >
                    <Select.Option value="all">{language === 'ar' ? 'الكل' : 'All'}</Select.Option>
                    <Select.Option value="important">
                      {language === 'ar' ? 'مهم' : 'Important'}
                    </Select.Option>
                    <Select.Option value="not-important">
                      {language === 'ar' ? 'غير مهم' : 'Not Important'}
                    </Select.Option>
                  </Select>
                </Col>
                <Col xs={24} md={8}>
                  <Select
                    mode="multiple"
                    size="large"
                    style={{ width: '100%' }}
                    placeholder={language === 'ar' ? 'المسوق' : 'Marketer'}
                    value={marketerFilter}
                    onChange={setMarketerFilter}
                    showSearch
                    maxTagCount="responsive"
                  >
                    <Select.Option value="Google">Google</Select.Option>
                    <Select.Option value="Snapchat">Snapchat</Select.Option>
                    <Select.Option value="Instagram">Instagram</Select.Option>
                    <Select.Option value="Twitter">Twitter</Select.Option>
                    <Select.Option value="Musaned">
                      {language === 'ar' ? 'مساند' : 'Musaned'}
                    </Select.Option>
                    <Select.Option value="Friend">
                      {language === 'ar' ? 'صديق' : 'Friend'}
                    </Select.Option>
                  </Select>
                </Col>
              </Row>
              <Divider />
              <Button
                block
                onClick={() => {
                  setSearchText('');
                  setStatusFilter('all');
                  setBranchFilter('all');
                  setTypeFilter('all');
                  setNationalityFilter([]);
                  setDebtFilter('all');
                  setContractFilter('all');
                  setEvaluationFilter([]);
                  setImportanceFilter('all');
                  setMarketerFilter([]);
                  message.success(language === 'ar' ? 'تم مسح الفلاتر' : 'Filters cleared');
                }}
              >
                {language === 'ar' ? 'مسح جميع الفلاتر' : 'Clear All Filters'}
              </Button>
            </div>
          )}
        </div>

        {/* Customer Cards */}
        <div className={styles.customerList}>
          <Collapse
            activeKey={expandedKeys}
            onChange={(keys) => setExpandedKeys(keys as string[])}
            expandIconPosition="end"
            className={styles.customerCollapse}
          >
            {filteredCustomers.map((customer) => renderCustomerCard(customer))}
          </Collapse>

          {filteredCustomers.length === 0 && (
            <div className={styles.emptyState}>
              <UsergroupAddOutlined style={{ fontSize: 64, color: '#ccc' }} />
              <h3>{language === 'ar' ? 'لا توجد نتائج' : 'No Results Found'}</h3>
              <p>
                {language === 'ar'
                  ? 'حاول تغيير معايير البحث أو الفلاتر'
                  : 'Try changing your search criteria or filters'}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
