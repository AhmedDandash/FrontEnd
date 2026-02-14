'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
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
  Modal,
  Form,
  message,
  Spin,
  Popconfirm,
  InputNumber,
} from 'antd';
import type { MenuProps } from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  EyeOutlined,
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
  CloseCircleOutlined,
  AuditOutlined,
  SendOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/store/authStore';
import { RecruitmentRequestService } from '@/services/recruitment-request.service';
import type {
  RecruitmentRequest,
  Job,
  Nationality,
  Customer,
  Worker,
  CreateRecruitmentRequestDto,
} from '@/types/api.types';
import styles from './RecruitmentRequests.module.css';

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

  // Hardcoded Nationalities Data
  const nationalities: Nationality[] = [
    { id: 359, nationalityNameAr: 'الفلبين', nationalityNameEn: 'Philippines', isActive: true },
    { id: 360, nationalityNameAr: 'كينيا', nationalityNameEn: 'Kenya', isActive: true },
    { id: 361, nationalityNameAr: 'أوغندا', nationalityNameEn: 'Uganda', isActive: true },
    { id: 362, nationalityNameAr: 'الهند', nationalityNameEn: 'India', isActive: true },
    { id: 363, nationalityNameAr: 'السودان', nationalityNameEn: 'Sudan', isActive: true },
    { id: 364, nationalityNameAr: 'مصر', nationalityNameEn: 'Egypt', isActive: true },
    { id: 365, nationalityNameAr: 'بوروندي', nationalityNameEn: 'Burundi', isActive: true },
    { id: 366, nationalityNameAr: 'بنغلاديش', nationalityNameEn: 'Bangladesh', isActive: true },
    { id: 367, nationalityNameAr: 'باكستان', nationalityNameEn: 'Pakistan', isActive: true },
    { id: 482, nationalityNameAr: 'المغرب', nationalityNameEn: 'Morocco', isActive: true },
    { id: 701, nationalityNameAr: 'سريلانكا', nationalityNameEn: 'Sri Lanka', isActive: true },
    { id: 731, nationalityNameAr: 'إثيوبيا', nationalityNameEn: 'Ethiopia', isActive: true },
    { id: 771, nationalityNameAr: 'إندونيسيا', nationalityNameEn: 'Indonesia', isActive: true },
    { id: 839, nationalityNameAr: 'اليمن', nationalityNameEn: 'Yemen', isActive: true },
  ];

  // API Data States
  const [requests, setRequests] = useState<RecruitmentRequest[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Modal States
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [assignWorkerModalOpen, setAssignWorkerModalOpen] = useState(false);
  const [assignCustomerModalOpen, setAssignCustomerModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RecruitmentRequest | null>(null);

  const [form] = Form.useForm();
  const [assignWorkerForm] = Form.useForm();
  const [assignCustomerForm] = Form.useForm();

  // Fetch all data on mount
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [requestsData, jobsData, customersData, workersData] = await Promise.all([
        RecruitmentRequestService.getAll(),
        RecruitmentRequestService.getJobs(),
        RecruitmentRequestService.getCustomers(),
        RecruitmentRequestService.getWorkers(),
      ]);

      setRequests(requestsData);
      setJobs(jobsData);
      setCustomers(customersData);
      setWorkers(workersData);
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error(language === 'ar' ? 'خطأ في جلب البيانات' : 'Error fetching data');
    } finally {
      setLoading(false);
    }
  }, [language]);

  // Optimistic update - immediately update UI before server confirms
  const updateRequestStatusLocally = useCallback((requestId: number, newStatus: number) => {
    console.log('🔄 Optimistic update:', requestId, '→ status:', newStatus);
    setRequests((prev) =>
      prev.map((request) =>
        request.id === requestId ? { ...request, requestStats: newStatus } : request
      )
    );
  }, []);

  const refetchRequests = useCallback(async () => {
    try {
      // Add timestamp to force fresh data
      const requestsData = await RecruitmentRequestService.getAll();
      console.log('📥 Refetched requests:', requestsData);
      setRequests([...requestsData]); // Force new array reference
    } catch (error) {
      console.error('Error refreshing requests:', error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter requests
  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        (request.requestCode?.toLowerCase() || '').includes(searchLower) ||
        (request.customerName?.toLowerCase() || '').includes(searchLower) ||
        (request.customerPhone || '').includes(searchLower) ||
        (request.jobName?.toLowerCase() || '').includes(searchLower);

      const matchesReligion =
        selectedReligion.length === 0 || selectedReligion.includes(String(request.workerReligion));

      const matchesNationality =
        selectedNationalities.length === 0 ||
        selectedNationalities.includes(String(request.nationalityId));

      const matchesJob = selectedJobs.length === 0 || selectedJobs.includes(String(request.jobId));

      const matchesStatus =
        selectedStatus === 'all' || String(request.requestStats) === selectedStatus;

      return matchesSearch && matchesReligion && matchesNationality && matchesJob && matchesStatus;
    });
  }, [requests, searchTerm, selectedReligion, selectedNationalities, selectedJobs, selectedStatus]);

  // Paginate requests
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Calculate statistics
  const statistics = useMemo(() => {
    return {
      total: requests.length,
      pending: requests.filter((r) => r.requestStats === 0 || r.requestStats === null).length,
      inReview: requests.filter((r) => r.requestStats === 1).length,
      accepted: requests.filter((r) => r.requestStats === 2).length,
      refused: requests.filter((r) => r.requestStats === 3).length,
    };
  }, [requests]);

  // Get status color
  const getStatusColor = (status: number | null | undefined) => {
    const colors: Record<number, string> = {
      0: 'gold', // Pending
      1: 'blue', // In Review
      2: 'green', // Accepted
      3: 'red', // Refused
    };
    return colors[status ?? 0] || 'default';
  };

  // Get status text
  const getStatusText = (status: number | null | undefined) => {
    const translations: Record<number, { ar: string; en: string }> = {
      0: { ar: 'قيد الانتظار', en: 'Pending' },
      1: { ar: 'قيد المراجعة', en: 'In Review' },
      2: { ar: 'مقبول', en: 'Accepted' },
      3: { ar: 'مرفوض', en: 'Refused' },
    };
    const key = status ?? 0;
    return translations[key]?.[language] || (language === 'ar' ? 'غير محدد' : 'Unknown');
  };

  // Get religion text
  const getReligionText = (religion: number | null | undefined) => {
    if (religion === 1) return language === 'ar' ? 'مسلم' : 'Muslim';
    if (religion === 2) return language === 'ar' ? 'غير مسلم' : 'Non-Muslim';
    return language === 'ar' ? 'غير محدد' : 'Not specified';
  };

  // Get nationality name
  const getNationalityName = (nationalityId: number | null | undefined) => {
    const nationality = nationalities.find((n) => n.id === nationalityId);
    if (!nationality) return language === 'ar' ? 'غير محدد' : 'Not specified';
    return language === 'ar' ? nationality.nationalityNameAr : nationality.nationalityNameEn;
  };

  // Handle create request
  const handleCreateRequest = async (values: CreateRecruitmentRequestDto) => {
    try {
      setActionLoading(-1);
      const requestCode = RecruitmentRequestService.generateRequestCode();
      await RecruitmentRequestService.create({
        ...values,
        requestCode,
      });
      message.success(language === 'ar' ? 'تم إنشاء الطلب بنجاح' : 'Request created successfully');
      setCreateModalOpen(false);
      form.resetFields();
      await refetchRequests();
    } catch (error) {
      message.error(language === 'ar' ? 'خطأ في إنشاء الطلب' : 'Error creating request');
    } finally {
      setActionLoading(null);
    }
  };

  // Handle review request
  const handleReviewRequest = async (request: RecruitmentRequest) => {
    const previousStatus = request.requestStats;
    try {
      setActionLoading(request.id);
      // Optimistic update - immediately update UI
      updateRequestStatusLocally(request.id, 1);

      console.log('📤 Sending review request for:', request.id);
      await RecruitmentRequestService.reviewRequest({
        requestStats: 1,
        requestId: request.id,
      });
      console.log('✅ Review request successful');
      message.success(language === 'ar' ? 'تم إرسال الطلب للمراجعة' : 'Request sent for review');
      // Refetch to ensure data is in sync
      await refetchRequests();
    } catch (error) {
      console.error('❌ Review request failed:', error);
      // Revert optimistic update on error
      updateRequestStatusLocally(request.id, previousStatus ?? 0);
      message.error(language === 'ar' ? 'خطأ في إرسال الطلب' : 'Error sending request');
    } finally {
      setActionLoading(null);
    }
  };

  // Handle accept request
  const handleAcceptRequest = async (request: RecruitmentRequest) => {
    const previousStatus = request.requestStats;
    try {
      setActionLoading(request.id);
      // Optimistic update - immediately update UI
      updateRequestStatusLocally(request.id, 2);

      console.log('📤 Sending accept request for:', request.id);
      await RecruitmentRequestService.acceptRequest({
        requestStats: 2,
        requestId: request.id,
      });
      console.log('✅ Accept request successful');
      message.success(language === 'ar' ? 'تم قبول الطلب بنجاح' : 'Request accepted successfully');
      // Refetch to ensure data is in sync
      await refetchRequests();
    } catch (error) {
      console.error('❌ Accept request failed:', error);
      // Revert optimistic update on error
      updateRequestStatusLocally(request.id, previousStatus ?? 0);
      message.error(language === 'ar' ? 'خطأ في قبول الطلب' : 'Error accepting request');
    } finally {
      setActionLoading(null);
    }
  };

  // Handle refuse request
  const handleRefuseRequest = async (request: RecruitmentRequest) => {
    const previousStatus = request.requestStats;
    try {
      setActionLoading(request.id);
      // Optimistic update - immediately update UI
      updateRequestStatusLocally(request.id, 3);

      console.log('📤 Sending refuse request for:', request.id);
      await RecruitmentRequestService.refuseRequest({
        requestStats: 3,
        requestId: request.id,
      });
      console.log('✅ Refuse request successful');
      message.success(language === 'ar' ? 'تم رفض الطلب' : 'Request refused');
      // Refetch to ensure data is in sync
      await refetchRequests();
    } catch (error) {
      console.error('❌ Refuse request failed:', error);
      // Revert optimistic update on error
      updateRequestStatusLocally(request.id, previousStatus ?? 0);
      message.error(language === 'ar' ? 'خطأ في رفض الطلب' : 'Error refusing request');
    } finally {
      setActionLoading(null);
    }
  };

  // Handle assign worker
  const handleAssignWorker = async (values: { workerId: number | string }) => {
    if (!selectedRequest) return;
    try {
      const parsedWorkerId = Number(values.workerId);
      if (!Number.isFinite(parsedWorkerId) || parsedWorkerId <= 0) {
        message.error(language === 'ar' ? 'رقم العامل غير صحيح' : 'Invalid worker id');
        return;
      }

      setActionLoading(selectedRequest.id);
      await RecruitmentRequestService.choiceWorker({
        workerId: parsedWorkerId,
        requestId: selectedRequest.id,
      });
      message.success(language === 'ar' ? 'تم تعيين العامل بنجاح' : 'Worker assigned successfully');
      setAssignWorkerModalOpen(false);
      assignWorkerForm.resetFields();
      await refetchRequests();
    } catch (error) {
      message.error(language === 'ar' ? 'خطأ في تعيين العامل' : 'Error assigning worker');
    } finally {
      setActionLoading(null);
    }
  };

  // Handle assign customer
  const handleAssignCustomer = async (values: { customerId: number }) => {
    if (!selectedRequest) return;
    try {
      setActionLoading(selectedRequest.id);
      await RecruitmentRequestService.choiceCustomer({
        customerId: values.customerId,
        requestId: selectedRequest.id,
      });
      message.success(
        language === 'ar' ? 'تم تعيين العميل بنجاح' : 'Customer assigned successfully'
      );
      setAssignCustomerModalOpen(false);
      assignCustomerForm.resetFields();
      await refetchRequests();
    } catch (error) {
      message.error(language === 'ar' ? 'خطأ في تعيين العميل' : 'Error assigning customer');
    } finally {
      setActionLoading(null);
    }
  };

  // Handle delete worker from request
  const handleDeleteWorker = async (request: RecruitmentRequest) => {
    try {
      setActionLoading(request.id);
      await RecruitmentRequestService.deleteWorker(request.id);
      message.success(language === 'ar' ? 'تم إلغاء تعيين العامل' : 'Worker unassigned');
      await refetchRequests();
    } catch (error) {
      message.error(language === 'ar' ? 'خطأ في إلغاء التعيين' : 'Error unassigning worker');
    } finally {
      setActionLoading(null);
    }
  };

  // Action menu for each card
  const getActionMenu = (request: RecruitmentRequest): MenuProps => ({
    items: [
      {
        key: 'view',
        label: language === 'ar' ? 'عرض التفاصيل' : 'View Details',
        icon: <EyeOutlined />,
        onClick: () => {
          setSelectedRequest(request);
          setViewModalOpen(true);
        },
      },
      {
        key: 'assignWorker',
        label: language === 'ar' ? 'تعيين عامل' : 'Assign Worker',
        icon: <UserAddOutlined />,
        onClick: () => {
          setSelectedRequest(request);
          setAssignWorkerModalOpen(true);
        },
      },
      {
        key: 'assignCustomer',
        label: language === 'ar' ? 'تعيين عميل' : 'Assign Customer',
        icon: <UserOutlined />,
        onClick: () => {
          setSelectedRequest(request);
          setAssignCustomerModalOpen(true);
        },
      },
      ...(request.workerId
        ? [
            {
              key: 'deleteWorker',
              label: language === 'ar' ? 'إلغاء تعيين العامل' : 'Unassign Worker',
              icon: <DeleteOutlined />,
              danger: true,
              onClick: () => handleDeleteWorker(request),
            },
          ]
        : []),
    ],
  });

  // Print menu
  const printMenu: MenuProps = {
    items: [
      {
        key: 'print',
        label: language === 'ar' ? 'طباعة' : 'Print',
        icon: <PrinterOutlined />,
        onClick: () => window.print(),
      },
      {
        key: 'export',
        label: language === 'ar' ? 'تصدير' : 'Export',
        icon: <DownloadOutlined />,
      },
    ],
  };

  if (loading) {
    return (
      <div
        className={styles.pageContainer}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <h1>
          <FileTextOutlined />
          <span>{language === 'ar' ? 'طلبات الاستقدام' : 'Recruitment Requests'}</span>
        </h1>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]} className={styles.statsRow}>
        <Col xs={24} sm={12} lg={5}>
          <Card className={styles.statCard}>
            <Statistic
              title={language === 'ar' ? 'إجمالي الطلبات' : 'Total Requests'}
              value={statistics.total}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#003366' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={5}>
          <Card className={styles.statCard}>
            <Statistic
              title={language === 'ar' ? 'قيد الانتظار' : 'Pending'}
              value={statistics.pending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={5}>
          <Card className={styles.statCard}>
            <Statistic
              title={language === 'ar' ? 'قيد المراجعة' : 'In Review'}
              value={statistics.inReview}
              prefix={<AuditOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={5}>
          <Card className={styles.statCard}>
            <Statistic
              title={language === 'ar' ? 'مقبول' : 'Accepted'}
              value={statistics.accepted}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#00AA64' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className={styles.statCard}>
            <Statistic
              title={language === 'ar' ? 'مرفوض' : 'Refused'}
              value={statistics.refused}
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
              <Dropdown menu={printMenu} trigger={['click']}>
                <Button icon={<PrinterOutlined />} size="large">
                  {language === 'ar' ? 'طباعة' : 'Print'}
                </Button>
              </Dropdown>
              <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                onClick={() => setCreateModalOpen(true)}
              >
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
                    { value: '1', label: language === 'ar' ? 'مسلم' : 'Muslim' },
                    { value: '2', label: language === 'ar' ? 'غير مسلم' : 'Non-Muslim' },
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
                    value: String(n.id),
                    label: language === 'ar' ? n.nationalityNameAr : n.nationalityNameEn,
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
                    value: String(j.id),
                    label: language === 'ar' ? j.jobNameAr : j.jobNameEn,
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
                    { value: '0', label: language === 'ar' ? 'قيد الانتظار' : 'Pending' },
                    { value: '1', label: language === 'ar' ? 'قيد المراجعة' : 'In Review' },
                    { value: '2', label: language === 'ar' ? 'مقبول' : 'Accepted' },
                    { value: '3', label: language === 'ar' ? 'مرفوض' : 'Refused' },
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
            <Card className={styles.requestCard} hoverable loading={actionLoading === request.id}>
              {/* Card Header */}
              <div className={styles.cardHeader}>
                <div className={styles.headerLeft}>
                  <div className={styles.requestCode}>
                    <FileTextOutlined />
                    <span>#{request.requestCode}</span>
                  </div>
                  <Space size={8}>
                    <Tag color={getStatusColor(request.requestStats)}>
                      {getStatusText(request.requestStats)}
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
                  <h3>{request.jobName || (language === 'ar' ? 'غير محدد' : 'Not specified')}</h3>
                </div>
                <div className={styles.jobDetails}>
                  <Tag color="blue">
                    <GlobalOutlined style={{ marginRight: 4 }} />
                    {getNationalityName(request.nationalityId)}
                  </Tag>
                  <Tag color={request.workerReligion === 1 ? 'green' : 'orange'}>
                    {getReligionText(request.workerReligion)}
                  </Tag>
                  {request.workerAge && (
                    <Tag>
                      {language === 'ar'
                        ? `${request.workerAge} سنة`
                        : `${request.workerAge} years`}
                    </Tag>
                  )}
                </div>
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
                        {request.customerName || (language === 'ar' ? 'غير محدد' : 'Not specified')}
                      </span>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <PhoneOutlined className={styles.infoIcon} />
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>
                        {language === 'ar' ? 'الهاتف' : 'Phone'}
                      </span>
                      <span className={styles.infoValue}>{request.customerPhone || '-'}</span>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <IdcardOutlined className={styles.infoIcon} />
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>
                        {language === 'ar' ? 'البريد' : 'Email'}
                      </span>
                      <span className={styles.infoValue}>{request.customerEmail || '-'}</span>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <CalendarOutlined className={styles.infoIcon} />
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>
                        {language === 'ar' ? 'تاريخ الإنشاء' : 'Created Date'}
                      </span>
                      <span className={styles.infoValue}>
                        {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : '-'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Worker Info (if assigned) */}
              {request.workerName && (
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
                          {language === 'ar' ? 'العامل المعين' : 'Assigned Worker'}
                        </div>
                        <div className={styles.applicantName}>{request.workerName}</div>
                      </div>
                    </div>
                  </Badge.Ribbon>
                </div>
              )}

              {/* Action Buttons */}
              <div className={styles.cardActions}>
                <Space wrap>
                  {/* Show Review button when status is 0 (Pending) */}
                  {(request.requestStats === 0 || request.requestStats === null) && (
                    <>
                      <Button
                        type="primary"
                        icon={<SendOutlined />}
                        onClick={() => handleReviewRequest(request)}
                        loading={actionLoading === request.id}
                      >
                        {language === 'ar' ? 'إرسال للمراجعة' : 'Send for Review'}
                      </Button>
                      <Popconfirm
                        title={language === 'ar' ? 'رفض الطلب' : 'Refuse Request'}
                        description={
                          language === 'ar'
                            ? 'هل أنت متأكد من رفض هذا الطلب؟'
                            : 'Are you sure you want to refuse this request?'
                        }
                        onConfirm={() => handleRefuseRequest(request)}
                        okText={language === 'ar' ? 'نعم' : 'Yes'}
                        cancelText={language === 'ar' ? 'لا' : 'No'}
                      >
                        <Button danger icon={<CloseCircleOutlined />}>
                          {language === 'ar' ? 'رفض' : 'Refuse'}
                        </Button>
                      </Popconfirm>
                    </>
                  )}

                  {/* Show Accept button when status is 1 (In Review) */}
                  {request.requestStats === 1 && (
                    <>
                      <Button
                        type="primary"
                        style={{ backgroundColor: '#00AA64', borderColor: '#00AA64' }}
                        icon={<CheckCircleOutlined />}
                        onClick={() => handleAcceptRequest(request)}
                        loading={actionLoading === request.id}
                      >
                        {language === 'ar' ? 'قبول' : 'Accept'}
                      </Button>
                      <Popconfirm
                        title={language === 'ar' ? 'رفض الطلب' : 'Refuse Request'}
                        description={
                          language === 'ar'
                            ? 'هل أنت متأكد من رفض هذا الطلب؟'
                            : 'Are you sure you want to refuse this request?'
                        }
                        onConfirm={() => handleRefuseRequest(request)}
                        okText={language === 'ar' ? 'نعم' : 'Yes'}
                        cancelText={language === 'ar' ? 'لا' : 'No'}
                      >
                        <Button danger icon={<CloseCircleOutlined />}>
                          {language === 'ar' ? 'رفض' : 'Refuse'}
                        </Button>
                      </Popconfirm>
                    </>
                  )}

                  {/* Show status badge for Accepted/Refused */}
                  {request.requestStats === 2 && (
                    <Tag
                      color="green"
                      icon={<CheckCircleOutlined />}
                      style={{ fontSize: 14, padding: '4px 12px' }}
                    >
                      {language === 'ar' ? 'تم القبول' : 'Accepted'}
                    </Tag>
                  )}
                  {request.requestStats === 3 && (
                    <Tag
                      color="red"
                      icon={<CloseCircleOutlined />}
                      style={{ fontSize: 14, padding: '4px 12px' }}
                    >
                      {language === 'ar' ? 'مرفوض' : 'Refused'}
                    </Tag>
                  )}
                </Space>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Empty State */}
      {paginatedRequests.length === 0 && !loading && (
        <Card style={{ textAlign: 'center', padding: 40 }}>
          <FileTextOutlined style={{ fontSize: 48, color: '#ccc' }} />
          <p style={{ marginTop: 16, color: '#666' }}>
            {language === 'ar' ? 'لا توجد طلبات' : 'No requests found'}
          </p>
        </Card>
      )}

      {/* Pagination */}
      {filteredRequests.length > 0 && (
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
      )}

      {/* Create Request Modal */}
      <Modal
        title={language === 'ar' ? 'إضافة طلب استقدام جديد' : 'Add New Recruitment Request'}
        open={createModalOpen}
        onCancel={() => {
          setCreateModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateRequest}
          initialValues={{ workerReligion: 1 }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="customerName"
                label={language === 'ar' ? 'اسم العميل' : 'Customer Name'}
                rules={[{ required: true, message: language === 'ar' ? 'مطلوب' : 'Required' }]}
              >
                <Input
                  placeholder={language === 'ar' ? 'أدخل اسم العميل' : 'Enter customer name'}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="customerPhone"
                label={language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                rules={[{ required: true, message: language === 'ar' ? 'مطلوب' : 'Required' }]}
              >
                <Input placeholder={language === 'ar' ? 'أدخل رقم الهاتف' : 'Enter phone number'} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="customerEmail"
                label={language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
              >
                <Input
                  type="email"
                  placeholder={language === 'ar' ? 'أدخل البريد الإلكتروني' : 'Enter email'}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="customerNationalId"
                label={language === 'ar' ? 'رقم الهوية' : 'National ID'}
              >
                <Input placeholder={language === 'ar' ? 'أدخل رقم الهوية' : 'Enter national ID'} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="jobId"
                label={language === 'ar' ? 'الوظيفة' : 'Job'}
                rules={[{ required: true, message: language === 'ar' ? 'مطلوب' : 'Required' }]}
              >
                <Select
                  placeholder={language === 'ar' ? 'اختر الوظيفة' : 'Select job'}
                  options={jobs.map((j) => ({
                    value: j.id,
                    label: language === 'ar' ? j.jobNameAr : j.jobNameEn,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="workerNationalityId"
                label={language === 'ar' ? 'جنسية العامل' : 'Worker Nationality'}
                rules={[{ required: true, message: language === 'ar' ? 'مطلوب' : 'Required' }]}
              >
                <Select
                  placeholder={language === 'ar' ? 'اختر الجنسية' : 'Select nationality'}
                  options={nationalities.map((n) => ({
                    value: n.id,
                    label: language === 'ar' ? n.nationalityNameAr : n.nationalityNameEn,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="workerReligion"
                label={language === 'ar' ? 'ديانة العامل' : 'Worker Religion'}
                rules={[{ required: true, message: language === 'ar' ? 'مطلوب' : 'Required' }]}
              >
                <Select
                  placeholder={language === 'ar' ? 'اختر الديانة' : 'Select religion'}
                  options={[
                    { value: 1, label: language === 'ar' ? 'مسلم' : 'Muslim' },
                    { value: 2, label: language === 'ar' ? 'غير مسلم' : 'Non-Muslim' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="workerAge" label={language === 'ar' ? 'عمر العامل' : 'Worker Age'}>
                <InputNumber
                  min={18}
                  max={60}
                  style={{ width: '100%' }}
                  placeholder={language === 'ar' ? 'أدخل العمر' : 'Enter age'}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="specialSpecifications"
            label={language === 'ar' ? 'مواصفات خاصة' : 'Special Specifications'}
          >
            <Input.TextArea
              rows={3}
              placeholder={
                language === 'ar'
                  ? 'أدخل أي مواصفات أو متطلبات خاصة'
                  : 'Enter any special specifications or requirements'
              }
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={actionLoading === -1}>
                {language === 'ar' ? 'إنشاء الطلب' : 'Create Request'}
              </Button>
              <Button
                htmlType="button"
                onClick={() => {
                  setCreateModalOpen(false);
                  form.resetFields();
                }}
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Assign Worker Modal */}
      <Modal
        title={language === 'ar' ? 'تعيين عامل' : 'Assign Worker'}
        open={assignWorkerModalOpen}
        onCancel={() => {
          setAssignWorkerModalOpen(false);
          assignWorkerForm.resetFields();
        }}
        footer={null}
      >
        <Form form={assignWorkerForm} layout="vertical" onFinish={handleAssignWorker}>
          <Form.Item
            name="workerId"
            label={language === 'ar' ? 'اختر العامل' : 'Select Worker'}
            rules={[{ required: true, message: language === 'ar' ? 'مطلوب' : 'Required' }]}
          >
            <Select
              showSearch
              placeholder={language === 'ar' ? 'ابحث واختر العامل' : 'Search and select worker'}
              optionFilterProp="label"
              options={workers
                .map((w) => {
                  const worker = w as unknown as {
                    id?: number | string;
                    workerId?: number | string;
                    workerID?: number | string;
                    fullNameAr?: string | null;
                    fullNameEn?: string | null;
                  };

                  const rawWorkerId = worker.id ?? worker.workerId ?? worker.workerID;
                  const parsedWorkerId = Number(rawWorkerId);
                  const label = worker.fullNameAr || worker.fullNameEn || '';

                  if (!Number.isFinite(parsedWorkerId) || parsedWorkerId <= 0 || !label) {
                    return null;
                  }

                  return {
                    value: parsedWorkerId,
                    label,
                  };
                })
                .filter((option): option is { value: number; label: string } => option !== null)}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={actionLoading === selectedRequest?.id}
              >
                {language === 'ar' ? 'تعيين' : 'Assign'}
              </Button>
              <Button
                htmlType="button"
                onClick={() => {
                  setAssignWorkerModalOpen(false);
                  assignWorkerForm.resetFields();
                  setSelectedRequest(null);
                }}
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Assign Customer Modal */}
      <Modal
        title={language === 'ar' ? 'تعيين عميل' : 'Assign Customer'}
        open={assignCustomerModalOpen}
        onCancel={() => {
          setAssignCustomerModalOpen(false);
          assignCustomerForm.resetFields();
        }}
        footer={null}
      >
        <Form form={assignCustomerForm} layout="vertical" onFinish={handleAssignCustomer}>
          <Form.Item
            name="customerId"
            label={language === 'ar' ? 'اختر العميل' : 'Select Customer'}
            rules={[{ required: true, message: language === 'ar' ? 'مطلوب' : 'Required' }]}
          >
            <Select
              showSearch
              placeholder={language === 'ar' ? 'ابحث واختر العميل' : 'Search and select customer'}
              optionFilterProp="label"
              options={customers.map((c) => ({
                value: c.id,
                label: c.arabicName || c.englishName || '',
              }))}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={actionLoading === selectedRequest?.id}
              >
                {language === 'ar' ? 'تعيين' : 'Assign'}
              </Button>
              <Button
                htmlType="button"
                onClick={() => {
                  setAssignCustomerModalOpen(false);
                  assignCustomerForm.resetFields();
                  setSelectedRequest(null);
                }}
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Details Modal */}
      <Modal
        title={language === 'ar' ? 'تفاصيل الطلب' : 'Request Details'}
        open={viewModalOpen}
        onCancel={() => {
          setViewModalOpen(false);
          setSelectedRequest(null);
        }}
        footer={
          <Button onClick={() => setViewModalOpen(false)}>
            {language === 'ar' ? 'إغلاق' : 'Close'}
          </Button>
        }
        width={600}
      >
        {selectedRequest && (
          <div style={{ padding: '16px 0' }}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <strong>{language === 'ar' ? 'رقم الطلب:' : 'Request Code:'}</strong>
                <p>{selectedRequest.requestCode}</p>
              </Col>
              <Col span={12}>
                <strong>{language === 'ar' ? 'الحالة:' : 'Status:'}</strong>
                <p>
                  <Tag color={getStatusColor(selectedRequest.requestStats)}>
                    {getStatusText(selectedRequest.requestStats)}
                  </Tag>
                </p>
              </Col>
              <Col span={12}>
                <strong>{language === 'ar' ? 'اسم العميل:' : 'Customer Name:'}</strong>
                <p>{selectedRequest.customerName || '-'}</p>
              </Col>
              <Col span={12}>
                <strong>{language === 'ar' ? 'رقم الهاتف:' : 'Phone:'}</strong>
                <p>{selectedRequest.customerPhone || '-'}</p>
              </Col>
              <Col span={12}>
                <strong>{language === 'ar' ? 'البريد الإلكتروني:' : 'Email:'}</strong>
                <p>{selectedRequest.customerEmail || '-'}</p>
              </Col>
              <Col span={12}>
                <strong>{language === 'ar' ? 'الوظيفة:' : 'Job:'}</strong>
                <p>{selectedRequest.jobName || '-'}</p>
              </Col>
              <Col span={12}>
                <strong>{language === 'ar' ? 'الجنسية:' : 'Nationality:'}</strong>
                <p>{getNationalityName(selectedRequest.nationalityId)}</p>
              </Col>
              <Col span={12}>
                <strong>{language === 'ar' ? 'الديانة:' : 'Religion:'}</strong>
                <p>{getReligionText(selectedRequest.workerReligion)}</p>
              </Col>
              <Col span={12}>
                <strong>{language === 'ar' ? 'عمر العامل:' : 'Worker Age:'}</strong>
                <p>{selectedRequest.workerAge || '-'}</p>
              </Col>
              <Col span={12}>
                <strong>{language === 'ar' ? 'العامل المعين:' : 'Assigned Worker:'}</strong>
                <p>{selectedRequest.workerName || '-'}</p>
              </Col>
              <Col span={24}>
                <strong>{language === 'ar' ? 'مواصفات خاصة:' : 'Special Specifications:'}</strong>
                <p>{selectedRequest.specialSpecifications || '-'}</p>
              </Col>
              <Col span={12}>
                <strong>{language === 'ar' ? 'تاريخ الإنشاء:' : 'Created At:'}</strong>
                <p>
                  {selectedRequest.createdAt
                    ? new Date(selectedRequest.createdAt).toLocaleString()
                    : '-'}
                </p>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
}
