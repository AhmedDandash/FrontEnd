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
  BgColorsOutlined,
  RollbackOutlined,
  CheckOutlined,
} from '@ant-design/icons';

import { useAuthStore } from '@/store/authStore';
import styles from './AutomaticFollowup.module.css';

const { RangePicker } = DatePicker;

interface ContractFollowup {
  id: string;
  contractNumber: string;
  customerName: string;
  customerNameAr: string;
  customerPhone: string;
  customerId: string;
  applicantName: string;
  applicantNameAr: string;
  visaNumber: string;
  nationality: string;
  nationalityAr: string;
  profession: string;
  professionAr: string;
  age: number;
  religion: string;
  religionAr: string;
  experience: string;
  experienceAr: string;
  agentName: string;
  agentNameAr: string;
  contractStatus: 'unsigned' | 'pending-payment' | 'paid' | 'invoice-issued' | 'worker-chosen';
  agentStatus: string;
  agentStatusAr: string;
  medicalStatus: 'pending' | 'done' | 'failed';
  musandStatus: 'pending' | 'done';
  poloStatus: 'pending' | 'done';
  tesdaStatus: 'pending' | 'done';
  owwaStatus: 'pending' | 'done';
  biometricStatus: 'pending' | 'done' | 'failed';
  visaStampStatus: 'pending' | 'submitted' | 'stamped' | 'rejected';
  travelClearanceStatus: 'pending' | 'done' | 'rejected';
  flightStatus: 'booked' | 'cancelled';
  arrivalStatus: 'not-arrived' | 'arrived' | 'confirmed';
  priority: 'low' | 'normal' | 'high';
  createdDate: string;
  createdSinceDays: number;
  daysUntilExpiry: number;
  agentAssignmentId: string;
  branch: string;
  branchAr: string;
  certificateApprovals: number;
  notes: string;
  lastModifiedDays: number;
  warrantyStatus: string;
  warrantyStatusAr: string;
  contractType: 'manual' | 'musaned';
  createdBy: string;
  createdByAr: string;
  arrivals: string;
}

// Mock data
const mockFollowups: ContractFollowup[] = Array.from({ length: 35 }, (_, i) => {
  const statuses = [
    'unsigned',
    'pending-payment',
    'paid',
    'invoice-issued',
    'worker-chosen',
  ] as const;
  const medicalStatuses: Array<'pending' | 'done' | 'failed'> = ['pending', 'done', 'failed'];
  const biometricStatuses: Array<'pending' | 'done' | 'failed'> = ['pending', 'done', 'failed'];
  const arrivals = ['Riyadh', 'Jeddah', 'Dammam', 'Abha', 'Tabuk'] as const;

  return {
    id: `followup-${i + 1}`,
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
    applicantName: ['MD SHABAB ANWAR', 'HAIDER GHULAM', 'ALI SABAHAT', 'KIRSHAN SHAMOON'][i % 4],
    applicantNameAr: ['محمد شباب أنور', 'حيدر غلام', 'علي سباحات', 'كرشان شمعون'][i % 4],
    visaNumber: `19077${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`,
    nationality: ['India', 'Pakistan', 'Bangladesh', 'Philippines'][i % 4],
    nationalityAr: ['الهند', 'باكستان', 'بنغلاديش', 'الفلبين'][i % 4],
    profession: ['Driver', 'Housemaid', 'Cook', 'Nurse'][i % 4],
    professionAr: ['سائق', 'خادمة منزلية', 'طباخ', 'ممرضة'][i % 4],
    age: 25 + Math.floor(Math.random() * 20),
    religion: ['Muslim', 'Christian', 'Hindu', 'Buddhist'][i % 4],
    religionAr: ['مسلم', 'مسيحي', 'هندوسي', 'بوذي'][i % 4],
    experience: [`${Math.floor(Math.random() * 10) + 1} Years`, 'Fresh', '6 Months', '2 Years'][
      i % 4
    ],
    experienceAr: [`${Math.floor(Math.random() * 10) + 1} سنوات`, 'بدون خبرة', '6 أشهر', 'سنتان'][
      i % 4
    ],
    agentName: ['M. T TRAVEL AGENCY', 'Pakistan Delegate', 'India Services'][i % 3],
    agentNameAr: ['وكالة إم تي للسفر', 'تفويض باكستان', 'خدمات الهند'][i % 3],
    contractStatus: statuses[i % 5],
    agentStatus: ['Medical OG', 'Biometric Done', 'Visa Stamped', 'Travel Clearance'][i % 4],
    agentStatusAr: ['فحص طبي', 'بصمة منجزة', 'فيزا موثقة', 'إذن سفر'][i % 4],
    medicalStatus: medicalStatuses[i % 3],
    musandStatus: i % 2 === 0 ? 'done' : 'pending',
    poloStatus: i % 2 === 0 ? 'done' : 'pending',
    tesdaStatus: i % 3 === 0 ? 'done' : 'pending',
    owwaStatus: i % 2 === 0 ? 'done' : 'pending',
    biometricStatus: biometricStatuses[i % 3],
    visaStampStatus: (['pending', 'submitted', 'stamped', 'rejected'] as const)[i % 4],
    travelClearanceStatus: (['pending', 'done', 'rejected'] as const)[i % 3],
    flightStatus: i % 2 === 0 ? 'booked' : 'cancelled',
    arrivalStatus: (['not-arrived', 'arrived', 'confirmed'] as const)[i % 3],
    priority: i % 2 === 0 ? 'normal' : i % 3 === 0 ? 'high' : 'low',
    createdDate: new Date(Date.now() - Math.random() * 120 * 24 * 60 * 60 * 1000).toISOString(),
    createdSinceDays: Math.floor(Math.random() * 180),
    daysUntilExpiry: Math.floor(Math.random() * 60) - 30,
    agentAssignmentId: `AGT-${Math.floor(Math.random() * 10000)}`,
    branch: 'Sigma Recruitment Office',
    branchAr: 'سيجما الكفاءات للاستقدام',
    certificateApprovals: Math.floor(Math.random() * 5),
    notes: ['No issues', 'Pending documents', 'On track', 'Follow up needed'][i % 4],
    lastModifiedDays: Math.floor(Math.random() * 30),
    warrantyStatus: ['Active', 'Expiring Soon', 'Expired'][i % 3],
    warrantyStatusAr: ['نشط', 'قريب الانتهاء', 'منتهي'][i % 3],
    contractType: i % 2 === 0 ? 'musaned' : 'manual',
    createdBy: ['Muhannad Al-Muhdar', 'Abdulrahman Al-Sarihi', 'Sara Al-Zahrani'][i % 3],
    createdByAr: ['مهند المحضار', 'عبدالرحمن السريحي', 'سارة الزهراني'][i % 3],
    arrivals: arrivals[i % 5],
  };
});

export default function AutomaticFollowupPage() {
  const language = useAuthStore((state) => state.language);
  const [mounted, setMounted] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[any, any] | null>(null);
  const [selectedFollowup, setSelectedFollowup] = useState<ContractFollowup | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const t = {
    pageTitle: language === 'ar' ? 'المتابعة التلقائية' : 'Automatic Followup',
    pageSubtitle:
      language === 'ar'
        ? 'إدارة ومتابعة العقود والتطبيقات'
        : 'Manage and track contracts and applications',
    addFollowup: language === 'ar' ? 'إضافة متابعة' : 'Add Followup',
    exportExcel: language === 'ar' ? 'تصدير إكسل' : 'Export Excel',
    print: language === 'ar' ? 'طباعة' : 'Print',
    search:
      language === 'ar'
        ? 'بحث برقم العقد أو اسم العميل...'
        : 'Search by contract number or customer name...',
    allStatuses: language === 'ar' ? 'جميع الحالات' : 'All Statuses',
    unsigned: language === 'ar' ? 'غير موقع' : 'Unsigned',
    pendingPayment: language === 'ar' ? 'في انتظار الدفع' : 'Pending Payment',
    paid: language === 'ar' ? 'مدفوع' : 'Paid',
    invoiceIssued: language === 'ar' ? 'الفاتورة صادرة' : 'Invoice Issued',
    workerChosen: language === 'ar' ? 'تم اختيار العامل' : 'Worker Chosen',
    allPriorities: language === 'ar' ? 'جميع الأولويات' : 'All Priorities',
    low: language === 'ar' ? 'منخفضة' : 'Low',
    normal: language === 'ar' ? 'عادية' : 'Normal',
    high: language === 'ar' ? 'عالية' : 'High',
    dateRange: language === 'ar' ? 'نطاق التاريخ' : 'Date Range',
    startDate: language === 'ar' ? 'تاريخ البداية' : 'Start Date',
    endDate: language === 'ar' ? 'تاريخ النهاية' : 'End Date',
    totalFollowups: language === 'ar' ? 'إجمالي المتابعات' : 'Total Followups',
    pending: language === 'ar' ? 'قيد المتابعة' : 'Pending',
    completed: language === 'ar' ? 'مكتمل' : 'Completed',
    atRisk: language === 'ar' ? 'في الخطر' : 'At Risk',
    contractNumber: language === 'ar' ? 'رقم العقد' : 'Contract Number',
    customer: language === 'ar' ? 'العميل' : 'Customer',
    applicant: language === 'ar' ? 'المتقدم' : 'Applicant',
    status: language === 'ar' ? 'الحالة' : 'Status',
    agentStatus: language === 'ar' ? 'حالة الوكيل' : 'Agent Status',
    priority: language === 'ar' ? 'الأولوية' : 'Priority',
    viewDetails: language === 'ar' ? 'عرض التفاصيل' : 'View Details',
    edit: language === 'ar' ? 'تعديل' : 'Edit',
    delete: language === 'ar' ? 'حذف' : 'Delete',
    noResults: language === 'ar' ? 'لا توجد نتائج' : 'No results found',
    phone: language === 'ar' ? 'الهاتف' : 'Phone',
    visa: language === 'ar' ? 'التأشيرة' : 'Visa',
    agent: language === 'ar' ? 'الوكيل' : 'Agent',
    followupInfo: language === 'ar' ? 'معلومات المتابعة' : 'Followup Information',
    nationality: language === 'ar' ? 'الجنسية' : 'Nationality',
    profession: language === 'ar' ? 'المهنة' : 'Profession',
    age: language === 'ar' ? 'العمر' : 'Age',
    religion: language === 'ar' ? 'الديانة' : 'Religion',
    experience: language === 'ar' ? 'الخبرة' : 'Experience',
    createdBy: language === 'ar' ? 'أنشأ بواسطة' : 'Created By',
    createdAt: language === 'ar' ? 'تاريخ الإنشاء' : 'Created At',
    daysAgo: language === 'ar' ? 'يوم مضى' : 'days ago',
    updateStatus: language === 'ar' ? 'تحديث الحالة' : 'Update Status',
    refresh: language === 'ar' ? 'تحديث' : 'Refresh',
    medical: language === 'ar' ? 'فحص طبي' : 'Medical',
    biometric: language === 'ar' ? 'بصمة' : 'Biometric',
    visaStamp: language === 'ar' ? 'ختم الفيزا' : 'Visa Stamp',
    travelClearance: language === 'ar' ? 'إذن السفر' : 'Travel Clearance',
    arrival: language === 'ar' ? 'الوصول' : 'Arrival',
    days: language === 'ar' ? 'أيام' : 'Days',
  };

  // Filter followups
  const filteredFollowups = useMemo(() => {
    return mockFollowups.filter((followup) => {
      const searchLower = searchText.toLowerCase();
      const matchesSearch =
        !searchText ||
        followup.contractNumber.toLowerCase().includes(searchLower) ||
        followup.customerName.toLowerCase().includes(searchLower) ||
        followup.customerNameAr.includes(searchText) ||
        followup.applicantName.toLowerCase().includes(searchLower);

      const matchesStatus = statusFilter === 'all' || followup.contractStatus === statusFilter;
      const matchesPriority = priorityFilter === 'all' || followup.priority === priorityFilter;

      const matchesDate =
        !dateRange ||
        (new Date(followup.createdDate) >= dateRange[0].toDate() &&
          new Date(followup.createdDate) <= dateRange[1].toDate());

      return matchesSearch && matchesStatus && matchesPriority && matchesDate;
    });
  }, [searchText, statusFilter, priorityFilter, dateRange]);

  // Statistics
  const stats = useMemo(
    () => ({
      total: mockFollowups.length,
      pending: mockFollowups.filter((f) => f.contractStatus !== 'paid').length,
      completed: mockFollowups.filter((f) => f.arrivalStatus === 'confirmed').length,
      atRisk: mockFollowups.filter((f) => f.daysUntilExpiry < 0).length,
    }),
    []
  );

  const getStatusConfig = (status: string) => {
    const config: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
      unsigned: {
        color: 'default',
        label: t.unsigned,
        icon: <FileTextOutlined />,
      },
      'pending-payment': {
        color: 'warning',
        label: t.pendingPayment,
        icon: <ClockCircleOutlined />,
      },
      paid: { color: 'success', label: t.paid, icon: <CheckCircleOutlined /> },
      'invoice-issued': {
        color: 'processing',
        label: t.invoiceIssued,
        icon: <FileExcelOutlined />,
      },
      'worker-chosen': {
        color: 'success',
        label: t.workerChosen,
        icon: <CheckCircleOutlined />,
      },
    };
    return (
      config[status] || {
        color: 'default',
        label: status,
        icon: <ClockCircleOutlined />,
      }
    );
  };

  const handleViewDetails = (followup: ContractFollowup) => {
    setSelectedFollowup(followup);
    setShowDetailsModal(true);
  };

  const getMenuItems = (followup: ContractFollowup): MenuProps['items'] => [
    {
      key: 'view',
      label: t.viewDetails,
      icon: <EyeOutlined />,
      onClick: () => handleViewDetails(followup),
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

  const renderFollowupCard = (followup: ContractFollowup) => {
    const statusConfig = getStatusConfig(followup.contractStatus);
    const daysRemaining = Math.max(0, followup.daysUntilExpiry);
    const isAtRisk = followup.daysUntilExpiry < 0;

    return (
      <Col xs={24} key={followup.id}>
        <Card className={styles.followupCard} hoverable>
          <div className={styles.cardContent}>
            {/* Left Section - Contract & Customer Info */}
            <div className={styles.cardLeft}>
              <div className={styles.cardHeader}>
                <div className={styles.contractNumber}>
                  <FileTextOutlined className={styles.contractIcon} />
                  <span>#{followup.contractNumber}</span>
                </div>
                <div className={styles.headerActions}>
                  <Button
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                    title={language === 'ar' ? 'أولوية' : 'Priority'}
                  />
                  <Dropdown menu={{ items: getMenuItems(followup) }} trigger={['click']}>
                    <Button type="text" icon={<MoreOutlined />} className={styles.moreBtn} />
                  </Dropdown>
                </div>
              </div>

              <div className={styles.statusSection}>
                <Badge status={statusConfig.color as any} text={statusConfig.label} />
                <Tag
                  color={
                    followup.priority === 'high'
                      ? 'red'
                      : followup.priority === 'normal'
                        ? 'blue'
                        : 'default'
                  }
                  icon={<BgColorsOutlined />}
                >
                  {language === 'ar'
                    ? followup.priority === 'high'
                      ? 'عالية'
                      : followup.priority === 'normal'
                        ? 'عادية'
                        : 'منخفضة'
                    : followup.priority.charAt(0).toUpperCase() + followup.priority.slice(1)}
                </Tag>
              </div>

              {/* Customer Info */}
              <div className={styles.customerSection}>
                <Avatar size={44} icon={<UserOutlined />} className={styles.customerAvatar} />
                <div className={styles.customerDetails}>
                  <span className={styles.customerName}>
                    {language === 'ar' ? followup.customerNameAr : followup.customerName}
                  </span>
                  <div className={styles.customerMeta}>
                    <PhoneOutlined />
                    <span dir="ltr">{followup.customerPhone}</span>
                    <IdcardOutlined style={{ marginInlineStart: 12 }} />
                    <span dir="ltr">{followup.customerId}</span>
                  </div>
                </div>
              </div>

              {/* Applicant & Visa Info */}
              <div className={styles.infoSection}>
                <div className={styles.infoItem}>
                  <SafetyOutlined className={styles.infoIcon} />
                  <div className={styles.infoText}>
                    <span className={styles.infoLabel}>{t.visa}</span>
                    <span className={styles.infoValue}>{followup.visaNumber}</span>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <UserAddOutlined className={styles.infoIcon} />
                  <div className={styles.infoText}>
                    <span className={styles.infoLabel}>{t.applicant}</span>
                    <span className={styles.infoValue}>
                      {language === 'ar' ? followup.applicantNameAr : followup.applicantName}
                    </span>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <EnvironmentOutlined className={styles.infoIcon} />
                  <div className={styles.infoText}>
                    <span className={styles.infoLabel}>{t.nationality}</span>
                    <span className={styles.infoValue}>
                      {language === 'ar' ? followup.nationalityAr : followup.nationality}
                    </span>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <TeamOutlined className={styles.infoIcon} />
                  <div className={styles.infoText}>
                    <span className={styles.infoLabel}>{t.profession}</span>
                    <span className={styles.infoValue}>
                      {language === 'ar' ? followup.professionAr : followup.profession}
                    </span>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <ClockCircleOutlined className={styles.infoIcon} />
                  <div className={styles.infoText}>
                    <span className={styles.infoLabel}>{t.age}</span>
                    <span className={styles.infoValue}>{followup.age}</span>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <CheckCircleOutlined className={styles.infoIcon} />
                  <div className={styles.infoText}>
                    <span className={styles.infoLabel}>{t.religion}</span>
                    <span className={styles.infoValue}>
                      {language === 'ar' ? followup.religionAr : followup.religion}
                    </span>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <FileTextOutlined className={styles.infoIcon} />
                  <div className={styles.infoText}>
                    <span className={styles.infoLabel}>{t.experience}</span>
                    <span className={styles.infoValue}>
                      {language === 'ar' ? followup.experienceAr : followup.experience}
                    </span>
                  </div>
                </div>
              </div>

              {/* Created By Section */}
              <div className={styles.createdInfo}>
                <div className={styles.createdItem}>
                  <UserOutlined className={styles.createdIcon} />
                  <div className={styles.createdText}>
                    <span className={styles.createdLabel}>{t.createdBy}</span>
                    <span className={styles.createdValue}>
                      {language === 'ar' ? followup.createdByAr : followup.createdBy}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Actions */}
            <div className={styles.cardRight}>
              <div className={styles.agentInfo}>
                <TeamOutlined className={styles.agentIcon} />
                <div>
                  <span className={styles.agentLabel}>{t.agent}</span>
                  <span className={styles.agentValue}>
                    {language === 'ar' ? followup.agentNameAr : followup.agentName}
                  </span>
                </div>
              </div>

              {/* Dates Section */}
              <div className={styles.datesSection}>
                <div className={styles.dateItem}>
                  <span className={styles.dateLabel}>{t.createdAt}</span>
                  <span className={styles.dateValue}>
                    {followup.createdSinceDays} {t.days}
                  </span>
                </div>
                <div className={styles.dateItem}>
                  <span className={styles.dateLabel}>
                    {language === 'ar' ? 'الأيام المتبقية' : 'Days Remaining'}
                  </span>
                  <span
                    className={styles.dateValue}
                    style={{ color: isAtRisk ? '#ff4d4f' : '#52c41a' }}
                  >
                    {isAtRisk
                      ? `${Math.abs(daysRemaining)} ${t.days} (${language === 'ar' ? 'متأخر' : 'Overdue'})`
                      : `${daysRemaining} ${t.days}`}
                  </span>
                </div>
              </div>

              <div className={styles.warrantyInfo}>
                <div className={styles.warrantyItem}>
                  <span className={styles.warrantyLabel}>
                    {language === 'ar' ? 'الضمان' : 'Warranty'}
                  </span>
                  <Tag
                    color={
                      followup.warrantyStatus === 'Active'
                        ? 'green'
                        : followup.warrantyStatus === 'Expiring Soon'
                          ? 'orange'
                          : 'red'
                    }
                  >
                    {language === 'ar' ? followup.warrantyStatusAr : followup.warrantyStatus}
                  </Tag>
                </div>
                <div className={styles.warrantyItem}>
                  <span className={styles.warrantyLabel}>
                    {language === 'ar' ? 'الوصول' : 'Arrival'}
                  </span>
                  <span className={styles.warrantyValue}>{followup.arrivals}</span>
                </div>
              </div>

              {/* Main Action Buttons */}
              <div className={styles.mainActionsSection}>
                <Button
                  type="primary"
                  size="small"
                  block
                  icon={<CheckOutlined />}
                  className={styles.confirmBtn}
                >
                  {language === 'ar' ? 'تأكيد الوصول' : 'Confirm Arrival'}
                </Button>
                <Button
                  type="default"
                  size="small"
                  block
                  icon={<RollbackOutlined />}
                  className={styles.backoutBtn}
                >
                  {language === 'ar' ? 'باك آوت' : 'Back Out'}
                </Button>
              </div>

              {/* Secondary Action Buttons */}
              <div className={styles.secondaryActionsSection}>
                <Button
                  type="text"
                  size="small"
                  block
                  icon={<UserAddOutlined />}
                  className={styles.actionLink}
                >
                  {language === 'ar' ? 'إضافة متفوض' : 'Add Delegate'}
                </Button>
                <Button
                  type="text"
                  size="small"
                  block
                  icon={<FileTextOutlined />}
                  className={styles.actionLink}
                >
                  {language === 'ar' ? 'ملاحظات' : 'Notes'}
                </Button>
                <Button
                  type="text"
                  size="small"
                  block
                  icon={<EditOutlined />}
                  className={styles.actionLink}
                >
                  {language === 'ar' ? 'رقم العقد' : 'Edit Contract'}
                </Button>
              </div>
            </div>

            {/* Bottom Section - Status Update Buttons */}
            <div className={styles.cardBottom}>
              <div className={styles.buttonGroup}>
                <Button
                  type="primary"
                  size="middle"
                  icon={<EditOutlined />}
                  className={styles.updateStatusBtn}
                  onClick={() => handleViewDetails(followup)}
                >
                  {language === 'ar' ? 'تحديث الحالة' : 'Update Status'}
                </Button>
              </div>
              <div className={styles.buttonGroup}>
                <span className={styles.groupLabel}>
                  {language === 'ar' ? 'التحديثات السريعة' : 'Quick Updates'}
                </span>
                <div className={styles.groupButtons}>
                  <Button size="small" icon={<SafetyOutlined />} className={styles.actionBtn}>
                    {language === 'ar' ? 'فحص طبي' : 'Medical'}
                  </Button>
                  <Button size="small" icon={<IdcardOutlined />} className={styles.actionBtn}>
                    {language === 'ar' ? 'بصمة' : 'Biometric'}
                  </Button>
                  <Button size="small" icon={<FileTextOutlined />} className={styles.actionBtn}>
                    {language === 'ar' ? 'تدريب' : 'TESDA'}
                  </Button>
                  <Button size="small" icon={<SafetyOutlined />} className={styles.actionBtn}>
                    {language === 'ar' ? 'تأمين' : 'OWWA'}
                  </Button>
                  <Button size="small" icon={<CheckCircleOutlined />} className={styles.actionBtn}>
                    {language === 'ar' ? 'ختم فيزا' : 'Visa Stamp'}
                  </Button>
                  <Button size="small" icon={<CheckOutlined />} className={styles.actionBtn}>
                    {language === 'ar' ? 'إذن سفر' : 'Travel Clearance'}
                  </Button>
                  <Button size="small" icon={<EnvironmentOutlined />} className={styles.actionBtn}>
                    {language === 'ar' ? 'تذكرة طيران' : 'Flight Ticket'}
                  </Button>
                </div>
              </div>
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
    <div className={styles.followupPage}>
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
              {t.addFollowup}
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className={styles.statisticsRow}>
        <Col xs={12} sm={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={t.totalFollowups}
              value={stats.total}
              prefix={<FileTextOutlined style={{ color: '#003366' }} />}
              valueStyle={{ color: '#003366' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={t.pending}
              value={stats.pending}
              prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={t.completed}
              value={stats.completed}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={t.atRisk}
              value={stats.atRisk}
              prefix={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f' }}
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
                { value: 'unsigned', label: t.unsigned },
                { value: 'pending-payment', label: t.pendingPayment },
                { value: 'paid', label: t.paid },
                { value: 'invoice-issued', label: t.invoiceIssued },
                { value: 'worker-chosen', label: t.workerChosen },
              ]}
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              value={priorityFilter}
              onChange={setPriorityFilter}
              style={{ width: '100%' }}
              size="large"
              options={[
                { value: 'all', label: t.allPriorities },
                { value: 'low', label: t.low },
                { value: 'normal', label: t.normal },
                { value: 'high', label: t.high },
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
            ? `عرض ${filteredFollowups.length} من ${mockFollowups.length} متابعة`
            : `Showing ${filteredFollowups.length} of ${mockFollowups.length} followups`}
        </span>
      </div>

      {/* Followups Grid */}
      {filteredFollowups.length > 0 ? (
        <Row gutter={[16, 16]} className={styles.followupsGrid}>
          {filteredFollowups.map(renderFollowupCard)}
        </Row>
      ) : (
        <Card className={styles.emptyCard}>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t.noResults} />
        </Card>
      )}

      {/* Details Modal */}
      <Modal
        title={`${t.contractNumber}: #${selectedFollowup?.contractNumber}`}
        open={showDetailsModal}
        onCancel={() => {
          setShowDetailsModal(false);
          setSelectedFollowup(null);
        }}
        footer={
          <Button type="primary" onClick={() => setShowDetailsModal(false)}>
            {language === 'ar' ? 'إغلاق' : 'Close'}
          </Button>
        }
        width={750}
      >
        {selectedFollowup && (
          <div className={styles.detailsModal}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <div className={styles.modalSection}>
                  <h4>{t.customer}</h4>
                  <p className={styles.modalValue}>
                    {language === 'ar'
                      ? selectedFollowup.customerNameAr
                      : selectedFollowup.customerName}
                  </p>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.modalSection}>
                  <h4>{t.phone}</h4>
                  <p className={styles.modalValue} dir="ltr">
                    {selectedFollowup.customerPhone}
                  </p>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.modalSection}>
                  <h4>{t.visa}</h4>
                  <p className={styles.modalValue}>{selectedFollowup.visaNumber}</p>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.modalSection}>
                  <h4>{t.applicant}</h4>
                  <p className={styles.modalValue}>
                    {language === 'ar'
                      ? selectedFollowup.applicantNameAr
                      : selectedFollowup.applicantName}
                  </p>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.modalSection}>
                  <h4>{t.nationality}</h4>
                  <p className={styles.modalValue}>
                    {language === 'ar'
                      ? selectedFollowup.nationalityAr
                      : selectedFollowup.nationality}
                  </p>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.modalSection}>
                  <h4>{t.agentStatus}</h4>
                  <p className={styles.modalValue}>
                    {language === 'ar'
                      ? selectedFollowup.agentStatusAr
                      : selectedFollowup.agentStatus}
                  </p>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.modalSection}>
                  <h4>{t.agent}</h4>
                  <p className={styles.modalValue}>
                    {language === 'ar' ? selectedFollowup.agentNameAr : selectedFollowup.agentName}
                  </p>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.modalSection}>
                  <h4>{t.createdBy}</h4>
                  <p className={styles.modalValue}>
                    {language === 'ar' ? selectedFollowup.createdByAr : selectedFollowup.createdBy}
                  </p>
                </div>
              </Col>
              <Col span={24}>
                <div className={styles.modalSection}>
                  <h4>{language === 'ar' ? 'ملاحظات' : 'Notes'}</h4>
                  <p className={styles.modalValue}>{selectedFollowup.notes}</p>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
}
