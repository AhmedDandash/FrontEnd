'use client';

import React, { useState, useMemo } from 'react';
import { useAuthStore } from '@/store/authStore';
import {
  Input,
  Select,
  Statistic,
  Row,
  Col,
  Badge,
  Empty,
  Pagination,
  Button,
  Modal,
  Form,
  Spin,
  Dropdown,
} from 'antd';
import type { MenuProps } from 'antd';
import {
  SearchOutlined,
  UserOutlined,
  MessageOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import {
  useComplaints,
  useCreateComplaint,
  useUpdateComplaint,
  useDeleteComplaint,
} from '@/hooks/api/useComplaints';
import {
  COMPLAINT_TYPE,
  COMPLAINT_FROM,
  WORKER_LOCATION,
  CONTRACT_TYPE,
  getEnumLabel,
  toSelectOptions,
} from '@/constants/enums';
import type { Complaint, CreateComplaintDto, UpdateComplaintDto } from '@/types/api.types';
import styles from './Complaints.module.css';

const { TextArea } = Input;

export default function ComplaintsPage() {
  const { language } = useAuthStore();
  const isArabic = language === 'ar';

  // API hooks
  const { data: complaints = [], isLoading } = useComplaints();
  const createMutation = useCreateComplaint();
  const updateMutation = useUpdateComplaint();
  const deleteMutation = useDeleteComplaint();

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [contractTypeFilter, setContractTypeFilter] = useState<string>('all');
  const [complaintFromFilter, setComplaintFromFilter] = useState<string>('all');
  const [workerLocationFilter, setWorkerLocationFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingComplaint, setEditingComplaint] = useState<Complaint | null>(null);
  const [form] = Form.useForm();

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
        contractType: 'نوع العقد',
        complaintFrom: 'الشكوى من',
        complaintType: 'نوع الشكوى',
        workerLocation: 'موقع العامل',
        complaintNumber: 'رقم الشكوى',
        customerName: 'اسم العميل',
        workerName: 'اسم العامل',
        notes: 'الملاحظات',
        notesAr: 'الملاحظات بالعربي',
        notesEn: 'الملاحظات بالإنجليزي',
        noComplaints: 'لا توجد شكاوى',
        of: 'من',
        items: 'عنصر',
        addComplaint: 'إضافة شكوى',
        editComplaint: 'تعديل الشكوى',
        save: 'حفظ',
        cancel: 'إلغاء',
        edit: 'تعديل',
        delete: 'حذف',
        confirmDelete: 'هل أنت متأكد من حذف هذه الشكوى؟',
        deleteTitle: 'حذف الشكوى',
        customerId: 'رقم العميل',
        workerId: 'رقم العامل',
        contractId: 'رقم العقد',
        loading: 'جاري التحميل...',
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
        contractType: 'Contract Type',
        complaintFrom: 'Complaint From',
        complaintType: 'Complaint Type',
        workerLocation: 'Worker Location',
        complaintNumber: 'Complaint Number',
        customerName: 'Customer Name',
        workerName: 'Worker Name',
        notes: 'Notes',
        notesAr: 'Notes (Arabic)',
        notesEn: 'Notes (English)',
        noComplaints: 'No complaints found',
        of: 'of',
        items: 'items',
        addComplaint: 'Add Complaint',
        editComplaint: 'Edit Complaint',
        save: 'Save',
        cancel: 'Cancel',
        edit: 'Edit',
        delete: 'Delete',
        confirmDelete: 'Are you sure you want to delete this complaint?',
        deleteTitle: 'Delete Complaint',
        customerId: 'Customer ID',
        workerId: 'Worker ID',
        contractId: 'Contract ID',
        loading: 'Loading...',
      },
    };
    return translations[language][key] || key;
  };

  // Filtered data
  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const matchesSearch =
        !searchTerm ||
        complaint.id.toString().includes(searchTerm) ||
        (complaint.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (complaint.workerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (complaint.notesAr || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (complaint.notesEn || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || complaint.status?.toString() === statusFilter;
      const matchesContractType =
        contractTypeFilter === 'all' || complaint.contractType?.toString() === contractTypeFilter;
      const matchesComplaintFrom =
        complaintFromFilter === 'all' ||
        complaint.complaintFrom?.toString() === complaintFromFilter;
      const matchesWorkerLocation =
        workerLocationFilter === 'all' ||
        complaint.workerLocation?.toString() === workerLocationFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesContractType &&
        matchesComplaintFrom &&
        matchesWorkerLocation
      );
    });
  }, [
    searchTerm,
    statusFilter,
    contractTypeFilter,
    complaintFromFilter,
    workerLocationFilter,
    complaints,
  ]);

  // Pagination
  const paginatedComplaints = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredComplaints.slice(startIndex, startIndex + pageSize);
  }, [filteredComplaints, currentPage, pageSize]);

  // Statistics
  const statistics = useMemo(() => {
    const total = complaints.length;
    const open = complaints.filter((c) => c.status === 1).length;
    const closed = complaints.filter((c) => c.status === 2).length;
    const pending = complaints.filter((c) => c.status === 3).length;
    return { total, open, closed, pending };
  }, [complaints]);

  // Get status badge
  const getStatusBadge = (status: number | null | undefined) => {
    const statusConfig: Record<number, { color: string; icon: React.ReactNode; text: string }> = {
      1: { color: '#faad14', icon: <ClockCircleOutlined />, text: isArabic ? 'مفتوحة' : 'Open' },
      2: { color: '#00aa64', icon: <CheckCircleOutlined />, text: isArabic ? 'مغلقة' : 'Closed' },
      3: { color: '#8c0000', icon: <WarningOutlined />, text: isArabic ? 'معلقة' : 'Pending' },
    };
    const config = statusConfig[status || 1] || statusConfig[1];
    return (
      <span className={styles.statusBadge} style={{ backgroundColor: config.color }}>
        {config.icon} {config.text}
      </span>
    );
  };

  // Modal handlers
  const handleAdd = () => {
    setEditingComplaint(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (complaint: Complaint) => {
    setEditingComplaint(complaint);
    form.setFieldsValue({
      type: complaint.type,
      complaintFrom: complaint.complaintFrom,
      customerId: complaint.customerId,
      workerId: complaint.workerId,
      workerLocation: complaint.workerLocation,
      contractType: complaint.contractType,
      contractId: complaint.contractId,
      notesAr: complaint.notesAr,
      notesEn: complaint.notesEn,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (complaint: Complaint) => {
    Modal.confirm({
      title: t('deleteTitle'),
      icon: <ExclamationCircleOutlined />,
      content: t('confirmDelete'),
      okText: t('delete'),
      cancelText: t('cancel'),
      okButtonProps: { danger: true },
      onOk: () => deleteMutation.mutate(complaint.id),
    });
  };

  const handleModalSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingComplaint) {
        const dto: UpdateComplaintDto = values;
        updateMutation.mutate(
          { id: editingComplaint.id, data: dto },
          {
            onSuccess: () => {
              setIsModalVisible(false);
              form.resetFields();
              setEditingComplaint(null);
            },
          }
        );
      } else {
        const dto: CreateComplaintDto = values;
        createMutation.mutate(dto, {
          onSuccess: () => {
            setIsModalVisible(false);
            form.resetFields();
          },
        });
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingComplaint(null);
  };

  // Action menu for each complaint card
  const getActionMenu = (complaint: Complaint): MenuProps => ({
    items: [
      {
        key: 'edit',
        label: t('edit'),
        icon: <EditOutlined />,
        onClick: () => handleEdit(complaint),
      },
      { type: 'divider' as const },
      {
        key: 'delete',
        label: t('delete'),
        icon: <DeleteOutlined />,
        danger: true,
        onClick: () => handleDelete(complaint),
      },
    ],
  });

  if (isLoading) {
    return (
      <div
        className={styles.container}
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Spin size="large" tip={t('loading')} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <FileTextOutlined style={{ fontSize: 28, color: '#fff' }} />
            <h1 className={styles.title}>{t('complaintsManagement')}</h1>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            loading={createMutation.isPending}
            style={{ background: '#00aa64', borderColor: '#00aa64', borderRadius: 8 }}
          >
            {t('addComplaint')}
          </Button>
        </div>
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
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              allowClear
            />
          </Col>
          <Col xs={24} md={8}>
            <label className={styles.filterLabel}>{t('status')}</label>
            <Select
              style={{ width: '100%' }}
              value={statusFilter}
              onChange={(v) => {
                setStatusFilter(v);
                setCurrentPage(1);
              }}
              options={[
                { label: t('all'), value: 'all' },
                { label: isArabic ? 'مفتوحة' : 'Open', value: '1' },
                { label: isArabic ? 'مغلقة' : 'Closed', value: '2' },
                { label: isArabic ? 'معلقة' : 'Pending', value: '3' },
              ]}
            />
          </Col>
          <Col xs={24} md={8}>
            <label className={styles.filterLabel}>{t('contractType')}</label>
            <Select
              style={{ width: '100%' }}
              value={contractTypeFilter}
              onChange={(v) => {
                setContractTypeFilter(v);
                setCurrentPage(1);
              }}
              options={[
                { label: t('all'), value: 'all' },
                ...toSelectOptions([...CONTRACT_TYPE], language).map((o) => ({
                  ...o,
                  value: o.value.toString(),
                })),
              ]}
            />
          </Col>
          <Col xs={24} md={8}>
            <label className={styles.filterLabel}>{t('complaintFrom')}</label>
            <Select
              style={{ width: '100%' }}
              value={complaintFromFilter}
              onChange={(v) => {
                setComplaintFromFilter(v);
                setCurrentPage(1);
              }}
              options={[
                { label: t('all'), value: 'all' },
                ...toSelectOptions([...COMPLAINT_FROM], language).map((o) => ({
                  ...o,
                  value: o.value.toString(),
                })),
              ]}
            />
          </Col>
          <Col xs={24} md={8}>
            <label className={styles.filterLabel}>{t('workerLocation')}</label>
            <Select
              style={{ width: '100%' }}
              value={workerLocationFilter}
              onChange={(v) => {
                setWorkerLocationFilter(v);
                setCurrentPage(1);
              }}
              options={[
                { label: t('all'), value: 'all' },
                ...toSelectOptions([...WORKER_LOCATION], language).map((o) => ({
                  ...o,
                  value: o.value.toString(),
                })),
              ]}
            />
          </Col>
        </Row>
      </div>

      {/* Complaints List */}
      <div className={styles.complaintsList}>
        {paginatedComplaints.length === 0 ? (
          <Empty description={t('noComplaints')} />
        ) : (
          paginatedComplaints.map((complaint, index) => (
            <div key={complaint.id} className={styles.complaintCard}>
              {/* Status Banner */}
              {complaint.status === 2 && (
                <div className={styles.statusBanner}>{getStatusBadge(complaint.status)}</div>
              )}

              <div className={styles.cardContent}>
                {/* Left Section - Complaint Number */}
                <div className={styles.numberSection}>
                  <div className={styles.sequenceNumber}>
                    {(currentPage - 1) * pageSize + index + 1}
                  </div>
                  <div className={styles.complaintNumber}>#{complaint.id}</div>
                  <div className={styles.dateText}>
                    {complaint.createdAt
                      ? new Date(complaint.createdAt).toLocaleDateString(
                          isArabic ? 'ar-SA' : 'en-US'
                        )
                      : ''}
                  </div>
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
                            {complaint.customerName || (isArabic ? 'غير محدد' : 'N/A')}
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} md={12}>
                      <div className={styles.infoItem}>
                        <UserOutlined className={styles.icon} />
                        <div>
                          <div className={styles.infoLabel}>{t('workerName')}</div>
                          <div className={styles.infoValue}>
                            {complaint.workerName || (isArabic ? 'غير محدد' : 'N/A')}
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col xs={24}>
                      <div className={styles.infoItem}>
                        <MessageOutlined className={styles.icon} />
                        <div>
                          <div className={styles.infoLabel}>{t('notes')}</div>
                          <div className={styles.infoValue}>
                            {(isArabic ? complaint.notesAr : complaint.notesEn) ||
                              complaint.notesAr ||
                              complaint.notesEn ||
                              (isArabic ? 'لا توجد ملاحظات' : 'No notes')}
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>

                {/* Right Section - Status & Tags & Actions */}
                <div className={styles.statusSection}>
                  {complaint.status !== 2 && getStatusBadge(complaint.status)}
                  <div className={styles.tags}>
                    <Badge
                      count={getEnumLabel([...CONTRACT_TYPE], complaint.contractType, language)}
                      style={{ backgroundColor: '#003366' }}
                    />
                    <Badge
                      count={getEnumLabel([...COMPLAINT_FROM], complaint.complaintFrom, language)}
                      style={{ backgroundColor: '#505050' }}
                    />
                    <Badge
                      count={getEnumLabel([...WORKER_LOCATION], complaint.workerLocation, language)}
                      style={{ backgroundColor: '#00478C' }}
                    />
                  </div>
                  <Dropdown menu={getActionMenu(complaint)} trigger={['click']}>
                    <Button
                      type="text"
                      icon={<MoreOutlined style={{ fontSize: 18 }} />}
                      style={{ marginTop: 8 }}
                    />
                  </Dropdown>
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
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} ${t('of')} ${total} ${t('items')}`
            }
            pageSizeOptions={['10', '20', '30', '50']}
          />
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        title={editingComplaint ? t('editComplaint') : t('addComplaint')}
        open={isModalVisible}
        onOk={handleModalSubmit}
        onCancel={handleModalCancel}
        okText={t('save')}
        cancelText={t('cancel')}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        width={700}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Row gutter={[16, 0]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="type"
                label={t('complaintType')}
                rules={[{ required: true, message: isArabic ? 'مطلوب' : 'Required' }]}
              >
                <Select
                  placeholder={t('complaintType')}
                  options={toSelectOptions([...COMPLAINT_TYPE], language)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="complaintFrom"
                label={t('complaintFrom')}
                rules={[{ required: true, message: isArabic ? 'مطلوب' : 'Required' }]}
              >
                <Select
                  placeholder={t('complaintFrom')}
                  options={toSelectOptions([...COMPLAINT_FROM], language)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="contractType" label={t('contractType')}>
                <Select
                  placeholder={t('contractType')}
                  options={toSelectOptions([...CONTRACT_TYPE], language)}
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="workerLocation" label={t('workerLocation')}>
                <Select
                  placeholder={t('workerLocation')}
                  options={toSelectOptions([...WORKER_LOCATION], language)}
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="customerId" label={t('customerId')}>
                <Input type="number" placeholder={t('customerId')} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="workerId" label={t('workerId')}>
                <Input type="number" placeholder={t('workerId')} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="contractId" label={t('contractId')}>
                <Input type="number" placeholder={t('contractId')} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="notesAr" label={t('notesAr')}>
                <TextArea rows={3} placeholder={t('notesAr')} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="notesEn" label={t('notesEn')}>
                <TextArea rows={3} placeholder={t('notesEn')} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
