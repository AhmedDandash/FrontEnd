'use client';

import React, { useState, useMemo } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Input, Select, DatePicker, Statistic, Row, Col, Badge, Empty, Pagination } from 'antd';
import { SearchOutlined, PhoneOutlined, UserOutlined, MessageOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import styles from './Complaints.module.css';

const { RangePicker } = DatePicker;

interface Complaint {
  id: number;
  sequenceNumber: number;
  customerNameAr: string;
  customerNameEn: string;
  applicantNameAr: string;
  applicantNameEn: string;
  contractType: 'recruitment' | 'rent' | 'sponsorship-transfer';
  status: 'open' | 'closed' | 'pending';
  complaintFrom: 'customer' | 'worker' | 'agent' | 'embassy' | 'ministry';
  workerLocation: 'accommodation' | 'customer-home';
  issueState: 'opened' | 'closed';
  notes: string;
  updates: string;
  finishNotes: string;
  createdByEmployee: string;
  finishedByEmployee: string;
  nationality: string;
  visaNumber: string;
  agentName: string;
  creationDate: string;
  endServiceDate: string;
  updateDate: string;
  idNumber: string;
}

export default function ComplaintsPage() {
  const { language } = useAuthStore();
  const isArabic = language === 'ar';

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [contractTypeFilter, setContractTypeFilter] = useState<string>('all');
  const [complaintFromFilter, setComplaintFromFilter] = useState<string>('all');
  const [issueStateFilter, setIssueStateFilter] = useState<string>('all');
  const [nationalityFilter, setNationalityFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [creationDateRange, setCreationDateRange] = useState<[string, string] | null>(null);
  const [updateDateRange, setUpdateDateRange] = useState<[string, string] | null>(null);

  // Mock data
  const mockComplaints: Complaint[] = [
    {
      id: 7999,
      sequenceNumber: 1,
      customerNameAr: 'ردينه حسن علي الرميلي',
      customerNameEn: 'Radina Hassan Ali Al-Rumaili',
      applicantNameAr: 'ديرارتو سلطان محمد',
      applicantNameEn: 'DERARTU SULTAN MUHAMMED',
      contractType: 'recruitment',
      status: 'closed',
      complaintFrom: 'customer',
      workerLocation: 'customer-home',
      issueState: 'closed',
      notes: 'طالبه مترجمه من امس وللأن محد تواصل معاها',
      updates: '',
      finishNotes: 'تم الترجمه',
      createdByEmployee: 'عبدالرحمن مسعد',
      finishedByEmployee: 'عبدالرحمن مسعد',
      nationality: 'Ethiopia',
      visaNumber: 'V2024001',
      agentName: 'ALHABESHI INTERNATIONAL SERVICES INC.',
      creationDate: '2026-01-13',
      endServiceDate: '2026-01-13',
      updateDate: '2026-01-13',
      idNumber: '1234567890'
    },
    {
      id: 7995,
      sequenceNumber: 2,
      customerNameAr: 'جميله احمد عبدالرزاق هوساوى',
      customerNameEn: 'Jamila Ahmed Abdul-Razzaq Housawi',
      applicantNameAr: 'فاطمة علي محمد',
      applicantNameEn: 'FATIMA ALI MOHAMMED',
      contractType: 'recruitment',
      status: 'closed',
      complaintFrom: 'customer',
      workerLocation: 'accommodation',
      issueState: 'closed',
      notes: 'العاملة ترفض العمل',
      updates: '',
      finishNotes: 'تم الحل',
      createdByEmployee: 'سهام عبدالله الحربي',
      finishedByEmployee: 'سهام عبدالله الحربي',
      nationality: 'Philippines',
      visaNumber: 'V2024002',
      agentName: 'MARAFE INTL MANPOWER SERVICES INC.',
      creationDate: '2026-01-13',
      endServiceDate: '2026-01-13',
      updateDate: '2026-01-13',
      idNumber: '2345678901'
    },
    {
      id: 7993,
      sequenceNumber: 3,
      customerNameAr: 'ردينه حسن علي الرميلي',
      customerNameEn: 'Radina Hassan Ali Al-Rumaili',
      applicantNameAr: 'ديرارتو سلطان محمد',
      applicantNameEn: 'DERARTU SULTAN MUHAMMED',
      contractType: 'recruitment',
      status: 'closed',
      complaintFrom: 'customer',
      workerLocation: 'customer-home',
      issueState: 'closed',
      notes: 'تبغا مترجمه',
      updates: '',
      finishNotes: 'تم التواصل',
      createdByEmployee: 'محمد ايمن فتحي عبد الوهاب',
      finishedByEmployee: 'محمد ايمن فتحي عبد الوهاب',
      nationality: 'Ethiopia',
      visaNumber: 'V2024003',
      agentName: 'ALHABESHI INTERNATIONAL SERVICES INC.',
      creationDate: '2026-01-12',
      endServiceDate: '2026-01-12',
      updateDate: '2026-01-12',
      idNumber: '3456789012'
    },
    {
      id: 7992,
      sequenceNumber: 4,
      customerNameAr: 'لولو محمد احمد البيتي',
      customerNameEn: 'Lulu Mohammed Ahmed Al-Bayti',
      applicantNameAr: 'جيتو موسيسا نادي',
      applicantNameEn: 'JITU MOSISA NADI',
      contractType: 'recruitment',
      status: 'closed',
      complaintFrom: 'customer',
      workerLocation: 'customer-home',
      issueState: 'closed',
      notes: 'تحتاج مترجمه',
      updates: '',
      finishNotes: 'تم التواصل والترجمه',
      createdByEmployee: 'نادر بن احمد جابر الحربي',
      finishedByEmployee: 'نادر بن احمد جابر الحربي',
      nationality: 'Ethiopia',
      visaNumber: 'V2024004',
      agentName: 'ALHABESHI INTERNATIONAL SERVICES INC.',
      creationDate: '2026-01-12',
      endServiceDate: '2026-01-12',
      updateDate: '2026-01-12',
      idNumber: '4567890123'
    },
    {
      id: 7985,
      sequenceNumber: 5,
      customerNameAr: 'منيرة سعد عبدالله القحطاني',
      customerNameEn: 'Munira Saad Abdullah Al-Qahtani',
      applicantNameAr: 'سارة أحمد علي',
      applicantNameEn: 'SARAH AHMED ALI',
      contractType: 'sponsorship-transfer',
      status: 'open',
      complaintFrom: 'worker',
      workerLocation: 'accommodation',
      issueState: 'opened',
      notes: 'العاملة تريد تغيير الكفيل',
      updates: 'جاري التواصل مع العاملة',
      finishNotes: '',
      createdByEmployee: 'اسماء الكيال',
      finishedByEmployee: '',
      nationality: 'Kenya',
      visaNumber: 'V2024005',
      agentName: 'EAMAL SOLUTIONS LIMITED',
      creationDate: '2026-01-11',
      endServiceDate: '',
      updateDate: '2026-01-12',
      idNumber: '5678901234'
    },
    {
      id: 7980,
      sequenceNumber: 6,
      customerNameAr: 'خالد محمد سعيد الزهراني',
      customerNameEn: 'Khalid Mohammed Saeed Al-Zahrani',
      applicantNameAr: 'ماريا جوزيف رودريجيز',
      applicantNameEn: 'MARIA JOSEPH RODRIGUEZ',
      contractType: 'rent',
      status: 'pending',
      complaintFrom: 'agent',
      workerLocation: 'customer-home',
      issueState: 'opened',
      notes: 'مشكلة في الراتب',
      updates: 'تم التواصل مع المكتب',
      finishNotes: '',
      createdByEmployee: 'سلطان الشمري',
      finishedByEmployee: '',
      nationality: 'Philippines',
      visaNumber: 'V2024006',
      agentName: 'MARAFE INTL MANPOWER SERVICES INC.',
      creationDate: '2026-01-10',
      endServiceDate: '',
      updateDate: '2026-01-11',
      idNumber: '6789012345'
    },
    {
      id: 7975,
      sequenceNumber: 7,
      customerNameAr: 'نورة عبدالله محمد الغامدي',
      customerNameEn: 'Noura Abdullah Mohammed Al-Ghamdi',
      applicantNameAr: 'عائشة محمود حسن',
      applicantNameEn: 'AISHA MAHMOUD HASSAN',
      contractType: 'recruitment',
      status: 'open',
      complaintFrom: 'customer',
      workerLocation: 'customer-home',
      issueState: 'opened',
      notes: 'العاملة لا تجيد الطبخ',
      updates: 'جاري التدريب',
      finishNotes: '',
      createdByEmployee: 'اصالة عبدالله عبد العزيز الزهراني',
      finishedByEmployee: '',
      nationality: 'Sudan',
      visaNumber: 'V2024007',
      agentName: 'ALHABESHI INTERNATIONAL SERVICES INC.',
      creationDate: '2026-01-09',
      endServiceDate: '',
      updateDate: '2026-01-10',
      idNumber: '7890123456'
    },
    {
      id: 7970,
      sequenceNumber: 8,
      customerNameAr: 'فهد صالح عبدالرحمن العتيبي',
      customerNameEn: 'Fahad Saleh Abdul-Rahman Al-Otaibi',
      applicantNameAr: 'راجيش كومار باتيل',
      applicantNameEn: 'RAJESH KUMAR PATEL',
      contractType: 'recruitment',
      status: 'closed',
      complaintFrom: 'embassy',
      workerLocation: 'accommodation',
      issueState: 'closed',
      notes: 'مشكلة في الإقامة',
      updates: 'تم حل المشكلة',
      finishNotes: 'تم تجديد الإقامة',
      createdByEmployee: 'عمر محمد احمد بوبكر',
      finishedByEmployee: 'عمر محمد احمد بوبكر',
      nationality: 'India',
      visaNumber: 'V2024008',
      agentName: 'AL ARHAM HR SERVICES PVT LTD',
      creationDate: '2026-01-08',
      endServiceDate: '2026-01-09',
      updateDate: '2026-01-09',
      idNumber: '8901234567'
    },
    {
      id: 7965,
      sequenceNumber: 9,
      customerNameAr: 'سارة فيصل محمد الدوسري',
      customerNameEn: 'Sarah Faisal Mohammed Al-Dosari',
      applicantNameAr: 'نيلوم بينتا راهمان',
      applicantNameEn: 'NELUM BINTA RAHMAN',
      contractType: 'recruitment',
      status: 'pending',
      complaintFrom: 'customer',
      workerLocation: 'customer-home',
      issueState: 'opened',
      notes: 'العاملة تطلب إجازة',
      updates: 'جاري الترتيب',
      finishNotes: '',
      createdByEmployee: 'نداء خالد محمد نائل احمد طاهر',
      finishedByEmployee: '',
      nationality: 'Bangladesh',
      visaNumber: 'V2024009',
      agentName: 'WELCOME ENTERPRISES',
      creationDate: '2026-01-07',
      endServiceDate: '',
      updateDate: '2026-01-08',
      idNumber: '9012345678'
    },
    {
      id: 7960,
      sequenceNumber: 10,
      customerNameAr: 'عبدالعزيز ناصر سعد الشهري',
      customerNameEn: 'Abdul-Aziz Nasser Saad Al-Shahri',
      applicantNameAr: 'محمد رضوان أحمد',
      applicantNameEn: 'MOHAMMED RIDWAN AHMED',
      contractType: 'sponsorship-transfer',
      status: 'open',
      complaintFrom: 'ministry',
      workerLocation: 'accommodation',
      issueState: 'opened',
      notes: 'مطلوب تحديث البيانات',
      updates: 'تم إرسال المستندات',
      finishNotes: '',
      createdByEmployee: 'مهند احمد مساعد المحضار',
      finishedByEmployee: '',
      nationality: 'Pakistan',
      visaNumber: 'V2024010',
      agentName: 'LARKANA OVERSEAS',
      creationDate: '2026-01-06',
      endServiceDate: '',
      updateDate: '2026-01-07',
      idNumber: '0123456789'
    }
  ];

  // Translations
  const t = (key: string): string => {
    const translations: Record<string, Record<string, string>> = {
      ar: {
        complaintsManagement: 'إدارة الشكاوى',
        totalComplaints: 'إجمالي الشكاوى',
        openComplaints: 'شكاوى مفتوحة',
        closedComplaints: 'شكاوى مغلقة',
        pendingComplaints: 'شكاوى معلقة',
        search: 'بحث...',
        status: 'الحالة',
        all: 'الكل',
        open: 'مفتوحة',
        closed: 'مغلقة',
        pending: 'معلقة',
        contractType: 'نوع العقد',
        recruitment: 'عقد استقدام',
        rent: 'عقد تأجير',
        sponsorshipTransfer: 'نقل كفالة',
        complaintFrom: 'الشكوى من',
        customer: 'العميل',
        worker: 'العامل',
        agent: 'الوكيل',
        embassy: 'السفارة',
        ministry: 'الوزارة',
        issueState: 'حالة المشكلة',
        opened: 'مفتوحة',
        nationality: 'الجنسية',
        creationDateRange: 'تاريخ الإنشاء',
        updateDateRange: 'تاريخ التحديث',
        complaintNumber: 'رقم الشكوى',
        customerName: 'اسم العميل',
        applicantName: 'اسم العامل',
        notes: 'الملاحظات',
        updates: 'التحديثات',
        finishNotes: 'ملاحظات الإغلاق',
        createdBy: 'تم الإنشاء بواسطة',
        finishedBy: 'تم الإغلاق بواسطة',
        visaNumber: 'رقم التأشيرة',
        agentName: 'اسم الوكيل',
        creationDate: 'تاريخ الإنشاء',
        endServiceDate: 'تاريخ إنهاء الخدمة',
        updateDate: 'تاريخ التحديث',
        workerLocation: 'موقع العامل',
        accommodation: 'في السكن',
        customerHome: 'عند العميل',
        viewDetails: 'عرض التفاصيل',
        noComplaints: 'لا توجد شكاوى',
        of: 'من',
        items: 'عنصر',
      },
      en: {
        complaintsManagement: 'Complaints Management',
        totalComplaints: 'Total Complaints',
        openComplaints: 'Open Complaints',
        closedComplaints: 'Closed Complaints',
        pendingComplaints: 'Pending Complaints',
        search: 'Search...',
        status: 'Status',
        all: 'All',
        open: 'Open',
        closed: 'Closed',
        pending: 'Pending',
        contractType: 'Contract Type',
        recruitment: 'Recruitment Contract',
        rent: 'Rent Contract',
        sponsorshipTransfer: 'Sponsorship Transfer',
        complaintFrom: 'Complaint From',
        customer: 'Customer',
        worker: 'Worker',
        agent: 'Agent',
        embassy: 'Embassy',
        ministry: 'Ministry',
        issueState: 'Issue State',
        opened: 'Opened',
        nationality: 'Nationality',
        creationDateRange: 'Creation Date',
        updateDateRange: 'Update Date',
        complaintNumber: 'Complaint Number',
        customerName: 'Customer Name',
        applicantName: 'Applicant Name',
        notes: 'Notes',
        updates: 'Updates',
        finishNotes: 'Finish Notes',
        createdBy: 'Created By',
        finishedBy: 'Finished By',
        visaNumber: 'Visa Number',
        agentName: 'Agent Name',
        creationDate: 'Creation Date',
        endServiceDate: 'End Service Date',
        updateDate: 'Update Date',
        workerLocation: 'Worker Location',
        accommodation: 'In Accommodation',
        customerHome: 'At Customer Home',
        viewDetails: 'View Details',
        noComplaints: 'No complaints found',
        of: 'of',
        items: 'items',
      },
    };
    return translations[language][key] || key;
  };

  // Filtered data
  const filteredComplaints = useMemo(() => {
    return mockComplaints.filter((complaint) => {
      const matchesSearch =
        !searchTerm ||
        complaint.id.toString().includes(searchTerm) ||
        complaint.customerNameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.customerNameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.applicantNameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.applicantNameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.notes.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
      const matchesContractType = contractTypeFilter === 'all' || complaint.contractType === contractTypeFilter;
      const matchesComplaintFrom = complaintFromFilter === 'all' || complaint.complaintFrom === complaintFromFilter;
      const matchesIssueState = issueStateFilter === 'all' || complaint.issueState === issueStateFilter;
      const matchesNationality = nationalityFilter === 'all' || complaint.nationality === nationalityFilter;

      const matchesCreationDate =
        !creationDateRange ||
        (new Date(complaint.creationDate) >= new Date(creationDateRange[0]) &&
          new Date(complaint.creationDate) <= new Date(creationDateRange[1]));

      const matchesUpdateDate =
        !updateDateRange ||
        (new Date(complaint.updateDate) >= new Date(updateDateRange[0]) &&
          new Date(complaint.updateDate) <= new Date(updateDateRange[1]));

      return (
        matchesSearch &&
        matchesStatus &&
        matchesContractType &&
        matchesComplaintFrom &&
        matchesIssueState &&
        matchesNationality &&
        matchesCreationDate &&
        matchesUpdateDate
      );
    });
  }, [searchTerm, statusFilter, contractTypeFilter, complaintFromFilter, issueStateFilter, nationalityFilter, creationDateRange, updateDateRange, mockComplaints]);

  // Pagination
  const paginatedComplaints = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredComplaints.slice(startIndex, startIndex + pageSize);
  }, [filteredComplaints, currentPage, pageSize]);

  // Statistics
  const statistics = useMemo(() => {
    const total = mockComplaints.length;
    const open = mockComplaints.filter((c) => c.status === 'open').length;
    const closed = mockComplaints.filter((c) => c.status === 'closed').length;
    const pending = mockComplaints.filter((c) => c.status === 'pending').length;
    return { total, open, closed, pending };
  }, [mockComplaints]);

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: React.ReactNode; text: string }> = {
      open: { color: '#faad14', icon: <ClockCircleOutlined />, text: t('open') },
      closed: { color: '#00AA64', icon: <CheckCircleOutlined />, text: t('closed') },
      pending: { color: '#00478C', icon: <ClockCircleOutlined />, text: t('pending') },
    };
    const config = statusConfig[status] || statusConfig.open;
    return (
      <span className={styles.statusBadge} style={{ backgroundColor: config.color }}>
        {config.icon} {config.text}
      </span>
    );
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>{t('complaintsManagement')}</h1>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]} className={styles.statsRow}>
        <Col xs={24} sm={12} md={6}>
          <div className={styles.statCard}>
            <Statistic
              title={t('totalComplaints')}
              value={statistics.total}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#003366' }}
            />
          </div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <div className={styles.statCard}>
            <Statistic
              title={t('openComplaints')}
              value={statistics.open}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <div className={styles.statCard}>
            <Statistic
              title={t('closedComplaints')}
              value={statistics.closed}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#00AA64' }}
            />
          </div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <div className={styles.statCard}>
            <Statistic
              title={t('pendingComplaints')}
              value={statistics.pending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#00478C' }}
            />
          </div>
        </Col>
      </Row>

      {/* Filters */}
      <div className={styles.filtersCard}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <label className={styles.filterLabel}>{t('search')}</label>
            <Input
              placeholder={t('search')}
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} md={8}>
            <label className={styles.filterLabel}>{t('status')}</label>
            <Select
              style={{ width: '100%' }}
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { label: t('all'), value: 'all' },
                { label: t('open'), value: 'open' },
                { label: t('closed'), value: 'closed' },
                { label: t('pending'), value: 'pending' },
              ]}
            />
          </Col>
          <Col xs={24} md={8}>
            <label className={styles.filterLabel}>{t('contractType')}</label>
            <Select
              style={{ width: '100%' }}
              value={contractTypeFilter}
              onChange={setContractTypeFilter}
              options={[
                { label: t('all'), value: 'all' },
                { label: t('recruitment'), value: 'recruitment' },
                { label: t('rent'), value: 'rent' },
                { label: t('sponsorshipTransfer'), value: 'sponsorship-transfer' },
              ]}
            />
          </Col>
          <Col xs={24} md={8}>
            <label className={styles.filterLabel}>{t('complaintFrom')}</label>
            <Select
              style={{ width: '100%' }}
              value={complaintFromFilter}
              onChange={setComplaintFromFilter}
              options={[
                { label: t('all'), value: 'all' },
                { label: t('customer'), value: 'customer' },
                { label: t('worker'), value: 'worker' },
                { label: t('agent'), value: 'agent' },
                { label: t('embassy'), value: 'embassy' },
                { label: t('ministry'), value: 'ministry' },
              ]}
            />
          </Col>
          <Col xs={24} md={8}>
            <label className={styles.filterLabel}>{t('issueState')}</label>
            <Select
              style={{ width: '100%' }}
              value={issueStateFilter}
              onChange={setIssueStateFilter}
              options={[
                { label: t('all'), value: 'all' },
                { label: t('opened'), value: 'opened' },
                { label: t('closed'), value: 'closed' },
              ]}
            />
          </Col>
          <Col xs={24} md={8}>
            <label className={styles.filterLabel}>{t('nationality')}</label>
            <Select
              style={{ width: '100%' }}
              value={nationalityFilter}
              onChange={setNationalityFilter}
              showSearch
              options={[
                { label: t('all'), value: 'all' },
                { label: 'Philippines', value: 'Philippines' },
                { label: 'Kenya', value: 'Kenya' },
                { label: 'Ethiopia', value: 'Ethiopia' },
                { label: 'India', value: 'India' },
                { label: 'Sudan', value: 'Sudan' },
                { label: 'Bangladesh', value: 'Bangladesh' },
                { label: 'Pakistan', value: 'Pakistan' },
              ]}
            />
          </Col>
          <Col xs={24} md={12}>
            <label className={styles.filterLabel}>{t('creationDateRange')}</label>
            <RangePicker
              style={{ width: '100%' }}
              onChange={(dates) => {
                if (dates && dates[0] && dates[1]) {
                  setCreationDateRange([dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD')]);
                } else {
                  setCreationDateRange(null);
                }
              }}
            />
          </Col>
          <Col xs={24} md={12}>
            <label className={styles.filterLabel}>{t('updateDateRange')}</label>
            <RangePicker
              style={{ width: '100%' }}
              onChange={(dates) => {
                if (dates && dates[0] && dates[1]) {
                  setUpdateDateRange([dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD')]);
                } else {
                  setUpdateDateRange(null);
                }
              }}
            />
          </Col>
        </Row>
      </div>

      {/* Complaints List */}
      <div className={styles.complaintsList}>
        {paginatedComplaints.length === 0 ? (
          <Empty description={t('noComplaints')} />
        ) : (
          paginatedComplaints.map((complaint) => (
            <div key={complaint.id} className={styles.complaintCard}>
              {/* Status Banner */}
              {complaint.status === 'closed' && (
                <div className={styles.statusBanner}>{getStatusBadge(complaint.status)}</div>
              )}

              <div className={styles.cardContent}>
                {/* Left Section - Complaint Number */}
                <div className={styles.numberSection}>
                  <div className={styles.sequenceNumber}>{complaint.sequenceNumber}</div>
                  <div className={styles.complaintNumber}>#{complaint.id}</div>
                  <div className={styles.dateText}>{complaint.creationDate}</div>
                </div>

                {/* Middle Section - Details */}
                <div className={styles.detailsSection}>
                  <Row gutter={[16, 8]}>
                    <Col xs={24} md={12}>
                      <div className={styles.infoItem}>
                        <UserOutlined className={styles.icon} />
                        <div>
                          <div className={styles.infoLabel}>{t('customerName')}</div>
                          <div className={styles.infoValue}>
                            {isArabic ? complaint.customerNameAr : complaint.customerNameEn}
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} md={12}>
                      <div className={styles.infoItem}>
                        <UserOutlined className={styles.icon} />
                        <div>
                          <div className={styles.infoLabel}>{t('applicantName')}</div>
                          <div className={styles.infoValue}>
                            {isArabic ? complaint.applicantNameAr : complaint.applicantNameEn}
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col xs={24}>
                      <div className={styles.infoItem}>
                        <MessageOutlined className={styles.icon} />
                        <div>
                          <div className={styles.infoLabel}>{t('notes')}</div>
                          <div className={styles.infoValue}>{complaint.notes}</div>
                        </div>
                      </div>
                    </Col>
                    {complaint.updates && (
                      <Col xs={24}>
                        <div className={styles.infoItem}>
                          <MessageOutlined className={styles.icon} />
                          <div>
                            <div className={styles.infoLabel}>{t('updates')}</div>
                            <div className={styles.infoValue}>{complaint.updates}</div>
                          </div>
                        </div>
                      </Col>
                    )}
                    {complaint.finishNotes && (
                      <Col xs={24}>
                        <div className={styles.finishNotesSection}>
                          <CheckCircleOutlined className={styles.icon} />
                          <div>
                            <div className={styles.infoLabel}>{t('finishNotes')}</div>
                            <div className={styles.infoValue}>{complaint.finishNotes}</div>
                          </div>
                        </div>
                      </Col>
                    )}
                  </Row>
                </div>

                {/* Right Section - Status & Tags */}
                <div className={styles.statusSection}>
                  {complaint.status !== 'closed' && getStatusBadge(complaint.status)}
                  <div className={styles.tags}>
                    <Badge
                      count={t(complaint.contractType.replace('-', ''))}
                      style={{ backgroundColor: '#003366' }}
                    />
                    <Badge
                      count={t(complaint.complaintFrom)}
                      style={{ backgroundColor: '#505050' }}
                    />
                    <Badge
                      count={complaint.nationality}
                      style={{ backgroundColor: '#00478C' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {filteredComplaints.length > 0 && (
        <div className={styles.paginationContainer}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredComplaints.length}
            onChange={(page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            }}
            showSizeChanger
            showTotal={(total, range) => `${range[0]}-${range[1]} ${t('of')} ${total} ${t('items')}`}
            pageSizeOptions={['10', '20', '30', '50']}
          />
        </div>
      )}
    </div>
  );
}
