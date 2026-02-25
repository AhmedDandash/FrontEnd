'use client';

import React, { useState } from 'react';
import {
  Card,
  Tabs,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Switch,
  InputNumber,
  Select,
  Tag,
  Row,
  Col,
  Tooltip,
  Popconfirm,
  Empty,
  Spin,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  GlobalOutlined,
  EnvironmentOutlined,
  UserOutlined,
  FileTextOutlined,
  MailOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useJobs, useCreateJob, useUpdateJob, useDeleteJob } from '@/hooks/api/useJobs';
import {
  useNationalities,
  useCreateNationality,
  useUpdateNationality,
  useDeleteNationality,
} from '@/hooks/api/useNationalities';
import type {
  Job,
  CreateJobDto,
  UpdateJobDto,
  NationalityExtended,
  CreateNationalityDto,
  UpdateNationalityDto,
} from '@/types/api.types';
import {
  AUTHORIZATION_SYSTEM,
  NATIONALITIES,
  getEnumLabel,
  toSelectOptions,
} from '@/constants/enums';
import { useAuthStore } from '@/store/authStore';
import styles from './GeneralSettings.module.css';

const { TabPane } = Tabs;

export default function GeneralSettingsPage() {
  const language = useAuthStore((state) => state.language);
  const isRTL = language === 'ar';

  const [activeTab, setActiveTab] = useState('jobs');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Nationality modal state
  const [isNatCreateOpen, setIsNatCreateOpen] = useState(false);
  const [isNatEditOpen, setIsNatEditOpen] = useState(false);
  const [isNatViewOpen, setIsNatViewOpen] = useState(false);
  const [selectedNationality, setSelectedNationality] = useState<NationalityExtended | null>(null);

  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [natCreateForm] = Form.useForm();
  const [natEditForm] = Form.useForm();

  // API hooks - Jobs
  const { data: jobs = [], isLoading } = useJobs();
  const createJobMutation = useCreateJob();
  const updateJobMutation = useUpdateJob();
  const deleteJobMutation = useDeleteJob();

  // API hooks - Nationalities
  const { data: nationalities = [], isLoading: isNatLoading } = useNationalities();
  const createNatMutation = useCreateNationality();
  const updateNatMutation = useUpdateNationality();
  const deleteNatMutation = useDeleteNationality();

  // Statistics
  const stats = {
    total: jobs.length,
    active: jobs.filter((j) => j.isActive).length,
    withWorkCard: jobs.filter((j) => j.hasWorkCard).length,
    inactive: jobs.filter((j) => !j.isActive).length,
  };

  // Table columns
  const jobColumns: ColumnsType<Job> = [
    {
      title: isRTL ? 'الرقم' : 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      align: 'center',
    },
    {
      title: isRTL ? 'اسم الوظيفة (عربي)' : 'Job Name (Arabic)',
      dataIndex: 'jobNameAr',
      key: 'jobNameAr',
      ellipsis: true,
    },
    {
      title: isRTL ? 'اسم الوظيفة (إنجليزي)' : 'Job Name (English)',
      dataIndex: 'jobNameEn',
      key: 'jobNameEn',
      ellipsis: true,
    },
    {
      title: isRTL ? 'بطاقة عمل' : 'Work Card',
      dataIndex: 'hasWorkCard',
      key: 'hasWorkCard',
      width: 120,
      align: 'center',
      render: (hasWorkCard: boolean) =>
        hasWorkCard ? (
          <Tag icon={<CheckCircleOutlined />} color="success">
            {isRTL ? 'نعم' : 'Yes'}
          </Tag>
        ) : (
          <Tag icon={<CloseCircleOutlined />} color="default">
            {isRTL ? 'لا' : 'No'}
          </Tag>
        ),
    },
    {
      title: isRTL ? 'رسوم البطاقة' : 'Card Fees',
      dataIndex: 'workCardFees',
      key: 'workCardFees',
      width: 120,
      align: 'center',
      render: (fees: number | null) => (fees ? `${fees.toLocaleString()} SAR` : '-'),
    },
    {
      title: isRTL ? 'الحالة' : 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      align: 'center',
      render: (isActive: boolean) =>
        isActive ? (
          <Tag color="success">{isRTL ? 'نشط' : 'Active'}</Tag>
        ) : (
          <Tag color="default">{isRTL ? 'غير نشط' : 'Inactive'}</Tag>
        ),
    },
    {
      title: isRTL ? 'الإجراءات' : 'Actions',
      key: 'actions',
      width: 150,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title={isRTL ? 'عرض' : 'View'}>
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
              size="small"
            />
          </Tooltip>
          <Tooltip title={isRTL ? 'تعديل' : 'Edit'}>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              size="small"
            />
          </Tooltip>
          <Tooltip title={isRTL ? 'حذف' : 'Delete'}>
            <Popconfirm
              title={isRTL ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete?'}
              onConfirm={() => handleDelete(record.id)}
              okText={isRTL ? 'نعم' : 'Yes'}
              cancelText={isRTL ? 'لا' : 'No'}
            >
              <Button type="text" danger icon={<DeleteOutlined />} size="small" />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Handlers
  const handleCreate = () => {
    createForm.resetFields();
    setIsCreateModalOpen(true);
  };

  const handleEdit = (job: Job) => {
    setSelectedJob(job);
    editForm.setFieldsValue(job);
    setIsEditModalOpen(true);
  };

  const handleView = (job: Job) => {
    setSelectedJob(job);
    setIsViewModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    await deleteJobMutation.mutateAsync(id);
  };

  const handleCreateSubmit = async () => {
    try {
      const values = await createForm.validateFields();
      await createJobMutation.mutateAsync(values as CreateJobDto);
      setIsCreateModalOpen(false);
      createForm.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleEditSubmit = async () => {
    if (!selectedJob) return;
    try {
      const values = await editForm.validateFields();
      await updateJobMutation.mutateAsync({
        id: selectedJob.id,
        data: values as UpdateJobDto,
      });
      setIsEditModalOpen(false);
      setSelectedJob(null);
      editForm.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  // ==================== Nationality Logic ====================

  const natStats = {
    total: nationalities.length,
    active: nationalities.filter((n) => n.isActive).length,
    inactive: nationalities.filter((n) => !n.isActive).length,
    musaned: nationalities.filter((n) => n.authorizationSystem === 1).length,
  };

  const nationalityColumns: ColumnsType<NationalityExtended> = [
    {
      title: isRTL ? 'الرقم' : 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      align: 'center',
    },
    {
      title: isRTL ? 'اسم الجنسية (عربي)' : 'Nationality (Arabic)',
      dataIndex: 'nationalityNameAr',
      key: 'nationalityNameAr',
      ellipsis: true,
    },
    {
      title: isRTL ? 'اسم الجنسية (إنجليزي)' : 'Nationality (English)',
      dataIndex: 'nationalityNameEn',
      key: 'nationalityNameEn',
      ellipsis: true,
    },
    {
      title: isRTL ? 'نظام التفويض' : 'Authorization System',
      dataIndex: 'authorizationSystem',
      key: 'authorizationSystem',
      width: 150,
      align: 'center',
      render: (val: number | null | undefined) => (
        <Tag color={val === 1 ? 'blue' : val === 2 ? 'orange' : 'default'}>
          {getEnumLabel([...AUTHORIZATION_SYSTEM], val, language)}
        </Tag>
      ),
    },
    {
      title: isRTL ? 'سعر التذكرة' : 'Ticket Price',
      dataIndex: 'ticketPrice',
      key: 'ticketPrice',
      width: 130,
      align: 'center',
      render: (price: number | null) =>
        price !== null && price !== undefined ? `${price.toLocaleString()} SAR` : '-',
    },
    {
      title: isRTL ? 'الحالة' : 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      align: 'center',
      render: (isActive: boolean | null) =>
        isActive ? (
          <Tag color="success">{isRTL ? 'نشط' : 'Active'}</Tag>
        ) : (
          <Tag color="default">{isRTL ? 'غير نشط' : 'Inactive'}</Tag>
        ),
    },
    {
      title: isRTL ? 'الإجراءات' : 'Actions',
      key: 'actions',
      width: 150,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title={isRTL ? 'عرض' : 'View'}>
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleNatView(record)}
              size="small"
            />
          </Tooltip>
          <Tooltip title={isRTL ? 'تعديل' : 'Edit'}>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleNatEdit(record)}
              size="small"
            />
          </Tooltip>
          <Tooltip title={isRTL ? 'حذف' : 'Delete'}>
            <Popconfirm
              title={isRTL ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete?'}
              onConfirm={() => handleNatDelete(record.id)}
              okText={isRTL ? 'نعم' : 'Yes'}
              cancelText={isRTL ? 'لا' : 'No'}
            >
              <Button type="text" danger icon={<DeleteOutlined />} size="small" />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleNatCreate = () => {
    natCreateForm.resetFields();
    setIsNatCreateOpen(true);
  };

  const handleNatEdit = (nat: NationalityExtended) => {
    setSelectedNationality(nat);
    natEditForm.setFieldsValue({
      nationalityId: nat.nationalityId,
      authorizationSystem: nat.authorizationSystem,
      ticketPrice: nat.ticketPrice,
      headerFile: nat.headerFile,
      isActive: nat.isActive,
    });
    setIsNatEditOpen(true);
  };

  const handleNatView = (nat: NationalityExtended) => {
    setSelectedNationality(nat);
    setIsNatViewOpen(true);
  };

  const handleNatDelete = async (id: number) => {
    await deleteNatMutation.mutateAsync(id);
  };

  const handleNatCreateSubmit = async () => {
    try {
      const values = await natCreateForm.validateFields();
      const natEntry = NATIONALITIES.find((n) => n.value === values.nationalityId);
      const enriched: CreateNationalityDto = {
        ...values,
        nationalityNameAr: natEntry?.labelAr ?? null,
        nationalityNameEn: natEntry?.labelEn ?? null,
      };
      await createNatMutation.mutateAsync(enriched);
      setIsNatCreateOpen(false);
      natCreateForm.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleNatEditSubmit = async () => {
    if (!selectedNationality) return;
    try {
      const values = await natEditForm.validateFields();
      const natEntry = NATIONALITIES.find((n) => n.value === values.nationalityId);
      await updateNatMutation.mutateAsync({
        id: selectedNationality.id,
        data: {
          ...values,
          nationalityNameAr: natEntry?.labelAr ?? null,
          nationalityNameEn: natEntry?.labelEn ?? null,
        } as UpdateNationalityDto,
      });
      setIsNatEditOpen(false);
      setSelectedNationality(null);
      natEditForm.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  // Nationality Stats Cards
  const NatStatsCards = () => (
    <Row gutter={[16, 16]} className={styles.statsRow}>
      <Col xs={24} sm={12} lg={6}>
        <Card bordered={false} className={styles.statCard}>
          <div className={styles.statContent}>
            <div className={`${styles.statIcon} ${styles.statIconPurple}`}>
              <GlobalOutlined />
            </div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>
                {isRTL ? 'إجمالي الجنسيات' : 'Total Nationalities'}
              </p>
              <h2 className={styles.statValue}>{natStats.total}</h2>
            </div>
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card bordered={false} className={styles.statCard}>
          <div className={styles.statContent}>
            <div className={`${styles.statIcon} ${styles.statIconPink}`}>
              <CheckCircleOutlined />
            </div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>{isRTL ? 'نشطة' : 'Active'}</p>
              <h2 className={styles.statValue}>{natStats.active}</h2>
            </div>
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card bordered={false} className={styles.statCard}>
          <div className={styles.statContent}>
            <div className={`${styles.statIcon} ${styles.statIconBlue}`}>
              <FileTextOutlined />
            </div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>{isRTL ? 'مساند' : 'Musaned'}</p>
              <h2 className={styles.statValue}>{natStats.musaned}</h2>
            </div>
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card bordered={false} className={styles.statCard}>
          <div className={styles.statContent}>
            <div className={`${styles.statIcon} ${styles.statIconOrange}`}>
              <CloseCircleOutlined />
            </div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>{isRTL ? 'غير نشطة' : 'Inactive'}</p>
              <h2 className={styles.statValue}>{natStats.inactive}</h2>
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  );

  // Nationalities Tab Content
  const NationalitiesTabContent = () => (
    <>
      <NatStatsCards />
      <Card
        title={
          <div className={styles.jobCardHeader}>
            <GlobalOutlined className={styles.jobCardHeaderIcon} />
            <span>{isRTL ? 'إدارة الجنسيات' : 'Nationality Management'}</span>
          </div>
        }
        bordered={false}
        className={styles.jobCard}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleNatCreate}
            style={{ background: '#00aa64', borderColor: '#00aa64' }}
          >
            {isRTL ? 'إضافة جنسية' : 'Add Nationality'}
          </Button>
        }
      >
        {isNatLoading ? (
          <div className={styles.loadingContainer}>
            <Spin size="large" />
          </div>
        ) : nationalities.length === 0 ? (
          <div className={styles.emptyContainer}>
            <Empty
              description={isRTL ? 'لا توجد جنسيات' : 'No nationalities found'}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        ) : (
          <div className={styles.jobTable}>
            <Table
              columns={nationalityColumns}
              dataSource={nationalities}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) =>
                  `${isRTL ? 'إجمالي' : 'Total'} ${total} ${isRTL ? 'جنسية' : 'nationalities'}`,
              }}
              scroll={{ x: 'max-content' }}
            />
          </div>
        )}
      </Card>
    </>
  );

  // Stats Cards
  const StatsCards = () => (
    <Row gutter={[16, 16]} className={styles.statsRow}>
      <Col xs={24} sm={12} lg={6}>
        <Card bordered={false} className={styles.statCard}>
          <div className={styles.statContent}>
            <div className={`${styles.statIcon} ${styles.statIconPurple}`}>
              <UserOutlined />
            </div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>{isRTL ? 'إجمالي الوظائف' : 'Total Jobs'}</p>
              <h2 className={styles.statValue}>{stats.total}</h2>
            </div>
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card bordered={false} className={styles.statCard}>
          <div className={styles.statContent}>
            <div className={`${styles.statIcon} ${styles.statIconPink}`}>
              <CheckCircleOutlined />
            </div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>{isRTL ? 'الوظائف النشطة' : 'Active Jobs'}</p>
              <h2 className={styles.statValue}>{stats.active}</h2>
            </div>
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card bordered={false} className={styles.statCard}>
          <div className={styles.statContent}>
            <div className={`${styles.statIcon} ${styles.statIconBlue}`}>
              <FileTextOutlined />
            </div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>{isRTL ? 'مع بطاقة عمل' : 'With Work Card'}</p>
              <h2 className={styles.statValue}>{stats.withWorkCard}</h2>
            </div>
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card bordered={false} className={styles.statCard}>
          <div className={styles.statContent}>
            <div className={`${styles.statIcon} ${styles.statIconOrange}`}>
              <CloseCircleOutlined />
            </div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>{isRTL ? 'غير نشط' : 'Inactive'}</p>
              <h2 className={styles.statValue}>{stats.inactive}</h2>
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  );

  // Jobs Tab Content
  const JobsTabContent = () => (
    <>
      <StatsCards />

      <Card
        title={
          <div className={styles.jobCardHeader}>
            <EyeOutlined className={styles.jobCardHeaderIcon} />
            <span>{isRTL ? 'إدارة الوظائف' : 'Job Management'}</span>
          </div>
        }
        bordered={false}
        className={styles.jobCard}
      >
        {isLoading ? (
          <div className={styles.loadingContainer}>
            <Spin size="large" />
          </div>
        ) : jobs.length === 0 ? (
          <div className={styles.emptyContainer}>
            <Empty
              description={isRTL ? 'لا توجد وظائف' : 'No jobs found'}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        ) : (
          <div className={styles.jobTable}>
            <Table
              columns={jobColumns}
              dataSource={jobs}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) =>
                  `${isRTL ? 'إجمالي' : 'Total'} ${total} ${isRTL ? 'وظيفة' : 'jobs'}`,
              }}
              scroll={{ x: 'max-content' }}
            />
          </div>
        )}
      </Card>
    </>
  );

  // Placeholder tabs for other settings
  const PlaceholderTab = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
    <Card bordered={false} className={styles.placeholderCard}>
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <div className={styles.placeholderContent}>
            <div className={styles.placeholderIcon}>{icon}</div>
            <div>
              <h3 className={styles.placeholderTitle}>{title}</h3>
              <p className={styles.placeholderText}>{isRTL ? 'قريباً...' : 'Coming soon...'}</p>
            </div>
          </div>
        }
      />
    </Card>
  );

  return (
    <div className={styles.generalSettingsPage}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <SettingOutlined className={styles.headerIcon} />
            <div>
              <h1 className={styles.pageTitle}>
                {isRTL ? 'الإعدادات العامة' : 'General Settings'}
              </h1>
            </div>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={activeTab === 'nationalities' ? handleNatCreate : handleCreate}
            className={styles.addButton}
          >
            {activeTab === 'nationalities'
              ? isRTL
                ? 'إضافة جنسية'
                : 'Add Nationality'
              : isRTL
                ? 'إضافة وظيفة'
                : 'Add Job'}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Card bordered={false} className={styles.tabsCard}>
        <Tabs activeKey={activeTab} onChange={setActiveTab} size="large">
          <TabPane
            tab={
              <span>
                <UserOutlined className={styles.tabIcon} />
                {isRTL ? 'الوظائف' : 'Jobs'}
              </span>
            }
            key="jobs"
          >
            <JobsTabContent />
          </TabPane>

          <TabPane
            tab={
              <span>
                <GlobalOutlined className={styles.tabIcon} />
                {isRTL ? 'الجنسيات' : 'Nationalities'}
              </span>
            }
            key="nationalities"
          >
            <NationalitiesTabContent />
          </TabPane>

          <TabPane
            tab={
              <span>
                <EnvironmentOutlined className={styles.tabIcon} />
                {isRTL ? 'المدن' : 'Cities'}
              </span>
            }
            key="cities"
          >
            <PlaceholderTab icon={<EnvironmentOutlined />} title={isRTL ? 'المدن' : 'Cities'} />
          </TabPane>

          <TabPane
            tab={
              <span>
                <UserOutlined className={styles.tabIcon} />
                {isRTL ? 'المسوقين' : 'Marketers'}
              </span>
            }
            key="marketers"
          >
            <PlaceholderTab icon={<UserOutlined />} title={isRTL ? 'المسوقين' : 'Marketers'} />
          </TabPane>

          <TabPane
            tab={
              <span>
                <FileTextOutlined className={styles.tabIcon} />
                {isRTL ? 'أنواع المستندات' : 'Document Types'}
              </span>
            }
            key="documents"
          >
            <PlaceholderTab
              icon={<FileTextOutlined />}
              title={isRTL ? 'أنواع المستندات' : 'Document Types'}
            />
          </TabPane>

          <TabPane
            tab={
              <span>
                <MailOutlined className={styles.tabIcon} />
                {isRTL ? 'إعدادات الرسائل' : 'SMS Settings'}
              </span>
            }
            key="sms"
          >
            <PlaceholderTab
              icon={<MailOutlined />}
              title={isRTL ? 'إعدادات الرسائل' : 'SMS Settings'}
            />
          </TabPane>

          <TabPane
            tab={
              <span>
                <SettingOutlined className={styles.tabIcon} />
                {isRTL ? 'إعدادات أخرى' : 'Other Settings'}
              </span>
            }
            key="other"
          >
            <PlaceholderTab
              icon={<SettingOutlined />}
              title={isRTL ? 'إعدادات أخرى' : 'Other Settings'}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* Create Modal */}
      <Modal
        title={isRTL ? 'إضافة وظيفة جديدة' : 'Add New Job'}
        open={isCreateModalOpen}
        onOk={handleCreateSubmit}
        onCancel={() => setIsCreateModalOpen(false)}
        width={600}
        okText={isRTL ? 'حفظ' : 'Save'}
        cancelText={isRTL ? 'إلغاء' : 'Cancel'}
        confirmLoading={createJobMutation.isPending}
      >
        <Form form={createForm} layout="vertical" className={styles.modalForm}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={isRTL ? 'اسم الوظيفة (عربي)' : 'Job Name (Arabic)'}
                name="jobNameAr"
                rules={[{ required: true, message: isRTL ? 'مطلوب' : 'Required' }]}
              >
                <Input placeholder={isRTL ? 'أدخل الاسم بالعربي' : 'Enter Arabic name'} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={isRTL ? 'اسم الوظيفة (إنجليزي)' : 'Job Name (English)'}
                name="jobNameEn"
                rules={[{ required: true, message: isRTL ? 'مطلوب' : 'Required' }]}
              >
                <Input placeholder={isRTL ? 'أدخل الاسم بالإنجليزي' : 'Enter English name'} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={isRTL ? 'بطاقة عمل' : 'Has Work Card'}
                name="hasWorkCard"
                valuePropName="checked"
                initialValue={false}
              >
                <Switch
                  checkedChildren={isRTL ? 'نعم' : 'Yes'}
                  unCheckedChildren={isRTL ? 'لا' : 'No'}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={isRTL ? 'رسوم البطاقة (ريال)' : 'Card Fees (SAR)'}
                name="workCardFees"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  placeholder={isRTL ? 'أدخل الرسوم' : 'Enter fees'}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={isRTL ? 'الحالة' : 'Status'}
            name="isActive"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch
              checkedChildren={isRTL ? 'نشط' : 'Active'}
              unCheckedChildren={isRTL ? 'غير نشط' : 'Inactive'}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        title={isRTL ? 'تعديل الوظيفة' : 'Edit Job'}
        open={isEditModalOpen}
        onOk={handleEditSubmit}
        onCancel={() => {
          setIsEditModalOpen(false);
          setSelectedJob(null);
        }}
        width={600}
        okText={isRTL ? 'حفظ' : 'Save'}
        cancelText={isRTL ? 'إلغاء' : 'Cancel'}
        confirmLoading={updateJobMutation.isPending}
      >
        <Form form={editForm} layout="vertical" className={styles.modalForm}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={isRTL ? 'اسم الوظيفة (عربي)' : 'Job Name (Arabic)'}
                name="jobNameAr"
                rules={[{ required: true, message: isRTL ? 'مطلوب' : 'Required' }]}
              >
                <Input placeholder={isRTL ? 'أدخل الاسم بالعربي' : 'Enter Arabic name'} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={isRTL ? 'اسم الوظيفة (إنجليزي)' : 'Job Name (English)'}
                name="jobNameEn"
                rules={[{ required: true, message: isRTL ? 'مطلوب' : 'Required' }]}
              >
                <Input placeholder={isRTL ? 'أدخل الاسم بالإنجليزي' : 'Enter English name'} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={isRTL ? 'بطاقة عمل' : 'Has Work Card'}
                name="hasWorkCard"
                valuePropName="checked"
              >
                <Switch
                  checkedChildren={isRTL ? 'نعم' : 'Yes'}
                  unCheckedChildren={isRTL ? 'لا' : 'No'}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={isRTL ? 'رسوم البطاقة (ريال)' : 'Card Fees (SAR)'}
                name="workCardFees"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  placeholder={isRTL ? 'أدخل الرسوم' : 'Enter fees'}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label={isRTL ? 'الحالة' : 'Status'} name="isActive" valuePropName="checked">
            <Switch
              checkedChildren={isRTL ? 'نشط' : 'Active'}
              unCheckedChildren={isRTL ? 'غير نشط' : 'Inactive'}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* View Modal */}
      <Modal
        title={isRTL ? 'تفاصيل الوظيفة' : 'Job Details'}
        open={isViewModalOpen}
        onCancel={() => {
          setIsViewModalOpen(false);
          setSelectedJob(null);
        }}
        footer={[
          <Button key="close" onClick={() => setIsViewModalOpen(false)}>
            {isRTL ? 'إغلاق' : 'Close'}
          </Button>,
        ]}
        width={500}
      >
        {selectedJob && (
          <div className={styles.viewModalContent}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <div className={styles.viewModalHeader}>
                  <div className={styles.viewModalLabel}>{isRTL ? 'رقم الوظيفة' : 'Job ID'}</div>
                  <div className={styles.viewModalValue}>#{selectedJob.id}</div>
                </div>
              </Col>

              <Col span={12}>
                <div className={styles.viewModalField}>
                  <div className={styles.viewModalFieldLabel}>
                    {isRTL ? 'الاسم (عربي)' : 'Name (Arabic)'}
                  </div>
                  <div className={styles.viewModalFieldValue}>{selectedJob.jobNameAr || '-'}</div>
                </div>
              </Col>

              <Col span={12}>
                <div className={styles.viewModalField}>
                  <div className={styles.viewModalFieldLabel}>
                    {isRTL ? 'الاسم (إنجليزي)' : 'Name (English)'}
                  </div>
                  <div className={styles.viewModalFieldValue}>{selectedJob.jobNameEn || '-'}</div>
                </div>
              </Col>

              <Col span={12}>
                <div className={styles.viewModalField}>
                  <div className={styles.viewModalFieldLabel}>
                    {isRTL ? 'بطاقة عمل' : 'Work Card'}
                  </div>
                  <div>
                    {selectedJob.hasWorkCard ? (
                      <Tag icon={<CheckCircleOutlined />} color="success">
                        {isRTL ? 'نعم' : 'Yes'}
                      </Tag>
                    ) : (
                      <Tag icon={<CloseCircleOutlined />} color="default">
                        {isRTL ? 'لا' : 'No'}
                      </Tag>
                    )}
                  </div>
                </div>
              </Col>

              <Col span={12}>
                <div className={styles.viewModalField}>
                  <div className={styles.viewModalFieldLabel}>
                    {isRTL ? 'رسوم البطاقة' : 'Card Fees'}
                  </div>
                  <div className={styles.viewModalFieldValueBold}>
                    {selectedJob.workCardFees
                      ? `${selectedJob.workCardFees.toLocaleString()} SAR`
                      : '-'}
                  </div>
                </div>
              </Col>

              <Col span={12}>
                <div className={styles.viewModalField}>
                  <div className={styles.viewModalFieldLabel}>{isRTL ? 'الحالة' : 'Status'}</div>
                  <div>
                    {selectedJob.isActive ? (
                      <Tag color="success">{isRTL ? 'نشط' : 'Active'}</Tag>
                    ) : (
                      <Tag color="default">{isRTL ? 'غير نشط' : 'Inactive'}</Tag>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Modal>

      {/* ==================== Nationality Modals ==================== */}

      {/* Nationality Create Modal */}
      <Modal
        title={isRTL ? 'إضافة جنسية جديدة' : 'Add New Nationality'}
        open={isNatCreateOpen}
        onOk={handleNatCreateSubmit}
        onCancel={() => setIsNatCreateOpen(false)}
        width={600}
        okText={isRTL ? 'حفظ' : 'Save'}
        cancelText={isRTL ? 'إلغاء' : 'Cancel'}
        confirmLoading={createNatMutation.isPending}
      >
        <Form form={natCreateForm} layout="vertical" className={styles.modalForm}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={isRTL ? 'الجنسية' : 'Nationality'}
                name="nationalityId"
                rules={[{ required: true, message: isRTL ? 'مطلوب' : 'Required' }]}
              >
                <Select
                  showSearch
                  placeholder={isRTL ? 'اختر الجنسية' : 'Select nationality'}
                  filterOption={(input, option) =>
                    ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={toSelectOptions([...NATIONALITIES], language)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={isRTL ? 'نظام التفويض' : 'Authorization System'}
                name="authorizationSystem"
              >
                <Select
                  placeholder={isRTL ? 'اختر النظام' : 'Select system'}
                  allowClear
                  options={toSelectOptions([...AUTHORIZATION_SYSTEM], language)}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={isRTL ? 'سعر التذكرة' : 'Ticket Price'} name="ticketPrice">
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  placeholder={isRTL ? 'أدخل السعر' : 'Enter price'}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={isRTL ? 'ملف الرأس' : 'Header File'} name="headerFile">
                <Input placeholder={isRTL ? 'أدخل اسم الملف' : 'Enter file name'} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={isRTL ? 'الحالة' : 'Status'}
            name="isActive"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch
              checkedChildren={isRTL ? 'نشط' : 'Active'}
              unCheckedChildren={isRTL ? 'غير نشط' : 'Inactive'}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Nationality Edit Modal */}
      <Modal
        title={isRTL ? 'تعديل الجنسية' : 'Edit Nationality'}
        open={isNatEditOpen}
        onOk={handleNatEditSubmit}
        onCancel={() => {
          setIsNatEditOpen(false);
          setSelectedNationality(null);
        }}
        width={600}
        okText={isRTL ? 'حفظ' : 'Save'}
        cancelText={isRTL ? 'إلغاء' : 'Cancel'}
        confirmLoading={updateNatMutation.isPending}
      >
        <Form form={natEditForm} layout="vertical" className={styles.modalForm}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={isRTL ? 'الجنسية' : 'Nationality'}
                name="nationalityId"
                rules={[{ required: true, message: isRTL ? 'مطلوب' : 'Required' }]}
              >
                <Select
                  showSearch
                  placeholder={isRTL ? 'اختر الجنسية' : 'Select nationality'}
                  filterOption={(input, option) =>
                    ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={toSelectOptions([...NATIONALITIES], language)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={isRTL ? 'نظام التفويض' : 'Authorization System'}
                name="authorizationSystem"
              >
                <Select
                  placeholder={isRTL ? 'اختر النظام' : 'Select system'}
                  allowClear
                  options={toSelectOptions([...AUTHORIZATION_SYSTEM], language)}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={isRTL ? 'سعر التذكرة' : 'Ticket Price'} name="ticketPrice">
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  placeholder={isRTL ? 'أدخل السعر' : 'Enter price'}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={isRTL ? 'ملف الرأس' : 'Header File'} name="headerFile">
                <Input placeholder={isRTL ? 'أدخل اسم الملف' : 'Enter file name'} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label={isRTL ? 'الحالة' : 'Status'} name="isActive" valuePropName="checked">
            <Switch
              checkedChildren={isRTL ? 'نشط' : 'Active'}
              unCheckedChildren={isRTL ? 'غير نشط' : 'Inactive'}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Nationality View Modal */}
      <Modal
        title={isRTL ? 'تفاصيل الجنسية' : 'Nationality Details'}
        open={isNatViewOpen}
        onCancel={() => {
          setIsNatViewOpen(false);
          setSelectedNationality(null);
        }}
        footer={[
          <Button key="close" onClick={() => setIsNatViewOpen(false)}>
            {isRTL ? 'إغلاق' : 'Close'}
          </Button>,
        ]}
        width={500}
      >
        {selectedNationality && (
          <div className={styles.viewModalContent}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <div className={styles.viewModalHeader}>
                  <div className={styles.viewModalLabel}>{isRTL ? 'الرقم' : 'ID'}</div>
                  <div className={styles.viewModalValue}>#{selectedNationality.id}</div>
                </div>
              </Col>

              <Col span={12}>
                <div className={styles.viewModalField}>
                  <div className={styles.viewModalFieldLabel}>
                    {isRTL ? 'الجنسية (عربي)' : 'Nationality (Arabic)'}
                  </div>
                  <div className={styles.viewModalFieldValue}>
                    {selectedNationality.nationalityNameAr || '-'}
                  </div>
                </div>
              </Col>

              <Col span={12}>
                <div className={styles.viewModalField}>
                  <div className={styles.viewModalFieldLabel}>
                    {isRTL ? 'الجنسية (إنجليزي)' : 'Nationality (English)'}
                  </div>
                  <div className={styles.viewModalFieldValue}>
                    {selectedNationality.nationalityNameEn || '-'}
                  </div>
                </div>
              </Col>

              <Col span={12}>
                <div className={styles.viewModalField}>
                  <div className={styles.viewModalFieldLabel}>
                    {isRTL ? 'نظام التفويض' : 'Authorization'}
                  </div>
                  <div>
                    <Tag
                      color={
                        selectedNationality.authorizationSystem === 1
                          ? 'blue'
                          : selectedNationality.authorizationSystem === 2
                            ? 'orange'
                            : 'default'
                      }
                    >
                      {getEnumLabel(
                        [...AUTHORIZATION_SYSTEM],
                        selectedNationality.authorizationSystem,
                        language
                      )}
                    </Tag>
                  </div>
                </div>
              </Col>

              <Col span={12}>
                <div className={styles.viewModalField}>
                  <div className={styles.viewModalFieldLabel}>
                    {isRTL ? 'سعر التذكرة' : 'Ticket Price'}
                  </div>
                  <div className={styles.viewModalFieldValueBold}>
                    {selectedNationality.ticketPrice
                      ? `${selectedNationality.ticketPrice.toLocaleString()} SAR`
                      : '-'}
                  </div>
                </div>
              </Col>

              <Col span={12}>
                <div className={styles.viewModalField}>
                  <div className={styles.viewModalFieldLabel}>
                    {isRTL ? 'ملف الرأس' : 'Header File'}
                  </div>
                  <div className={styles.viewModalFieldValue}>
                    {selectedNationality.headerFile || '-'}
                  </div>
                </div>
              </Col>

              <Col span={12}>
                <div className={styles.viewModalField}>
                  <div className={styles.viewModalFieldLabel}>{isRTL ? 'الحالة' : 'Status'}</div>
                  <div>
                    {selectedNationality.isActive ? (
                      <Tag color="success">{isRTL ? 'نشط' : 'Active'}</Tag>
                    ) : (
                      <Tag color="default">{isRTL ? 'غير نشط' : 'Inactive'}</Tag>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
}
