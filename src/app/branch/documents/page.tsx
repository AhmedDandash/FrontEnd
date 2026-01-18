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
  Dropdown,
  DatePicker,
  Modal,
  Form,
  message,
  Progress,
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
  MoreOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  FileProtectOutlined,
  DownloadOutlined,
  FolderOpenOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/store/authStore';
import styles from './Documents.module.css';


interface Document {
  id: number;
  name: string;
  nameAr: string;
  type: string;
  typeAr: string;
  branch: string;
  branchAr: string;
  expiryDate: string;
  uploadDate: string;
  status: 'valid' | 'expiring-soon' | 'expired';
  fileSize: string;
  fileType: 'pdf' | 'doc' | 'image' | 'excel';
  description?: string;
  descriptionAr?: string;
}

export default function DocumentsPage() {
  const language = useAuthStore((state) => state.language);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [isRenewModalVisible, setIsRenewModalVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [form] = Form.useForm();

  // Mock data
  const documentTypes = [
    { value: '1', label: 'Contract', labelAr: 'عقد' },
    { value: '2', label: 'License', labelAr: 'رخصة' },
    { value: '3', label: 'Certificate', labelAr: 'شهادة' },
    { value: '4', label: 'ID Document', labelAr: 'وثيقة هوية' },
    { value: '5', label: 'Insurance', labelAr: 'تأمين' },
    { value: '6', label: 'Tax Document', labelAr: 'وثيقة ضريبية' },
    { value: '7', label: 'Labor Contract', labelAr: 'عقد عمل' },
    { value: '8', label: 'Visa Document', labelAr: 'وثيقة تأشيرة' },
  ];

  const branches = [
    { value: '1', label: 'Main Branch', labelAr: 'الفرع الرئيسي' },
    { value: '2', label: 'North Branch', labelAr: 'الفرع الشمالي' },
    { value: '3', label: 'South Branch', labelAr: 'الفرع الجنوبي' },
    { value: '4', label: 'East Branch', labelAr: 'الفرع الشرقي' },
    { value: '5', label: 'West Branch', labelAr: 'الفرع الغربي' },
  ];

  const mockDocuments: Document[] = Array.from({ length: 48 }, (_, i) => {
    const uploadDate = new Date(2025, Math.floor(i / 4), (i % 28) + 1);
    const expiryDate = new Date(uploadDate);
    expiryDate.setMonth(expiryDate.getMonth() + (6 + (i % 18)));

    const today = new Date();
    const daysUntilExpiry = Math.floor(
      (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    let status: 'valid' | 'expiring-soon' | 'expired';
    if (daysUntilExpiry < 0) status = 'expired';
    else if (daysUntilExpiry < 30) status = 'expiring-soon';
    else status = 'valid';

    const fileTypes: ('pdf' | 'doc' | 'image' | 'excel')[] = ['pdf', 'doc', 'image', 'excel'];

    return {
      id: 1000 + i,
      name: `Document ${i + 1}`,
      nameAr: `وثيقة ${i + 1}`,
      type: documentTypes[i % documentTypes.length].label,
      typeAr: documentTypes[i % documentTypes.length].labelAr,
      branch: branches[i % branches.length].label,
      branchAr: branches[i % branches.length].labelAr,
      expiryDate: expiryDate.toISOString().split('T')[0],
      uploadDate: uploadDate.toISOString().split('T')[0],
      status,
      fileSize: `${(Math.random() * 5 + 0.5).toFixed(2)} MB`,
      fileType: fileTypes[i % fileTypes.length],
      description: i % 3 === 0 ? `Description for document ${i + 1}` : undefined,
      descriptionAr: i % 3 === 0 ? `وصف الوثيقة ${i + 1}` : undefined,
    };
  });

  const filteredDocuments = useMemo(() => {
    return mockDocuments.filter((doc) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        (language === 'ar' ? doc.nameAr : doc.name).toLowerCase().includes(searchLower) ||
        (language === 'ar' ? doc.typeAr : doc.type).toLowerCase().includes(searchLower) ||
        (language === 'ar' ? doc.branchAr : doc.branch).toLowerCase().includes(searchLower);

      const matchesType =
        selectedTypes.length === 0 ||
        selectedTypes.includes(documentTypes.find((t) => t.label === doc.type)?.value || '');

      const matchesBranch =
        selectedBranches.length === 0 ||
        selectedBranches.includes(branches.find((b) => b.label === doc.branch)?.value || '');

      const matchesStatus = selectedStatus === 'all' || doc.status === selectedStatus;

      return matchesSearch && matchesType && matchesBranch && matchesStatus;
    });
  }, [searchTerm, selectedTypes, selectedBranches, selectedStatus, language]);

  const paginatedDocuments = filteredDocuments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const statistics = {
    total: mockDocuments.length,
    valid: mockDocuments.filter((d) => d.status === 'valid').length,
    expiringSoon: mockDocuments.filter((d) => d.status === 'expiring-soon').length,
    expired: mockDocuments.filter((d) => d.status === 'expired').length,
  };

  const getStatusColor = (status: string) => {
    const colors = {
      valid: 'success',
      'expiring-soon': 'warning',
      expired: 'error',
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const getStatusText = (status: string) => {
    const translations = {
      valid: { ar: 'صالح', en: 'Valid' },
      'expiring-soon': { ar: 'ينتهي قريباً', en: 'Expiring Soon' },
      expired: { ar: 'منتهي', en: 'Expired' },
    };
    return translations[status as keyof typeof translations]?.[language] || status;
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return '📄';
      case 'doc':
        return '📝';
      case 'image':
        return '🖼️';
      case 'excel':
        return '📊';
      default:
        return '📁';
    }
  };

  const handleRenewDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setIsRenewModalVisible(true);
  };

  const handleRenewSubmit = () => {
    form.validateFields().then(() => {
      message.success(
        language === 'ar'
          ? 'تم تجديد تاريخ انتهاء الوثيقة بنجاح'
          : 'Document expiry date renewed successfully'
      );
      setIsRenewModalVisible(false);
      form.resetFields();
    });
  };

  const getActionMenu = (doc: Document): MenuProps => ({
    items: [
      {
        key: 'view',
        label: language === 'ar' ? 'عرض' : 'View',
        icon: <EyeOutlined />,
        onClick: () => console.log('View', doc.id),
      },
      {
        key: 'download',
        label: language === 'ar' ? 'تحميل' : 'Download',
        icon: <DownloadOutlined />,
        onClick: () => console.log('Download', doc.id),
      },
      {
        key: 'renew',
        label: language === 'ar' ? 'تجديد تاريخ الانتهاء' : 'Renew Expiry Date',
        icon: <CalendarOutlined />,
        onClick: () => handleRenewDocument(doc),
      },
      {
        key: 'edit',
        label: language === 'ar' ? 'تعديل' : 'Edit',
        icon: <EditOutlined />,
        onClick: () => console.log('Edit', doc.id),
      },
      {
        type: 'divider',
      },
      {
        key: 'delete',
        label: language === 'ar' ? 'حذف' : 'Delete',
        icon: <DeleteOutlined />,
        danger: true,
        onClick: () => {
          Modal.confirm({
            title: language === 'ar' ? 'تأكيد الحذف' : 'Confirm Delete',
            icon: <ExclamationCircleOutlined />,
            content:
              language === 'ar'
                ? 'هل أنت متأكد من حذف هذه الوثيقة؟'
                : 'Are you sure you want to delete this document?',
            okText: language === 'ar' ? 'حذف' : 'Delete',
            okType: 'danger',
            cancelText: language === 'ar' ? 'إلغاء' : 'Cancel',
            onOk: () => {
              message.success(
                language === 'ar' ? 'تم حذف الوثيقة بنجاح' : 'Document deleted successfully'
              );
            },
          });
        },
      },
    ],
  });

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    return Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className={styles.pageContainer}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <h1>
          <FileProtectOutlined />
          <span>{language === 'ar' ? 'إدارة المستندات' : 'Document Management'}</span>
        </h1>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]} className={styles.statsRow}>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={language === 'ar' ? 'إجمالي المستندات' : 'Total Documents'}
              value={statistics.total}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#003366' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={language === 'ar' ? 'صالحة' : 'Valid'}
              value={statistics.valid}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#00AA64' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={language === 'ar' ? 'تنتهي قريباً' : 'Expiring Soon'}
              value={statistics.expiringSoon}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={language === 'ar' ? 'منتهية' : 'Expired'}
              value={statistics.expired}
              prefix={<WarningOutlined />}
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
            <Button type="primary" size="large" icon={<PlusOutlined />}>
              {language === 'ar' ? 'إضافة مستند' : 'Add Document'}
            </Button>
          </div>

          {showFilters && (
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <label className={styles.filterLabel}>
                  {language === 'ar' ? 'نوع المستند' : 'Document Type'}
                </label>
                <Select
                  mode="multiple"
                  size="large"
                  placeholder={language === 'ar' ? 'اختر النوع' : 'Select Type'}
                  value={selectedTypes}
                  onChange={setSelectedTypes}
                  style={{ width: '100%' }}
                  options={documentTypes.map((t) => ({
                    value: t.value,
                    label: language === 'ar' ? t.labelAr : t.label,
                  }))}
                  allowClear
                />
              </Col>
              <Col xs={24} md={8}>
                <label className={styles.filterLabel}>
                  {language === 'ar' ? 'الفرع' : 'Branch'}
                </label>
                <Select
                  mode="multiple"
                  size="large"
                  placeholder={language === 'ar' ? 'اختر الفرع' : 'Select Branch'}
                  value={selectedBranches}
                  onChange={setSelectedBranches}
                  style={{ width: '100%' }}
                  options={branches.map((b) => ({
                    value: b.value,
                    label: language === 'ar' ? b.labelAr : b.label,
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
                    { value: 'valid', label: language === 'ar' ? 'صالح' : 'Valid' },
                    {
                      value: 'expiring-soon',
                      label: language === 'ar' ? 'ينتهي قريباً' : 'Expiring Soon',
                    },
                    { value: 'expired', label: language === 'ar' ? 'منتهي' : 'Expired' },
                  ]}
                />
              </Col>
            </Row>
          )}
        </Space>
      </Card>

      {/* Documents Grid */}
      <Row gutter={[16, 16]}>
        {paginatedDocuments.map((doc) => {
          const daysUntilExpiry = getDaysUntilExpiry(doc.expiryDate);
          const expiryProgress =
            daysUntilExpiry < 0 ? 0 : Math.min(100, (daysUntilExpiry / 365) * 100);

          return (
            <Col xs={24} sm={12} lg={8} key={doc.id}>
              <Card className={styles.documentCard} hoverable>
                {/* Card Header */}
                <div className={styles.cardHeader}>
                  <div className={styles.documentIcon}>
                    <span className={styles.fileIcon}>{getFileIcon(doc.fileType)}</span>
                  </div>
                  <Dropdown menu={getActionMenu(doc)} trigger={['click']}>
                    <Button type="text" icon={<MoreOutlined />} />
                  </Dropdown>
                </div>

                {/* Document Info */}
                <div className={styles.documentInfo}>
                  <h3 className={styles.documentName}>
                    {language === 'ar' ? doc.nameAr : doc.name}
                  </h3>
                  <Space size={8} wrap>
                    <Tag color="blue">
                      <FolderOpenOutlined style={{ marginRight: 4 }} />
                      {language === 'ar' ? doc.typeAr : doc.type}
                    </Tag>
                    <Tag color={getStatusColor(doc.status)}>{getStatusText(doc.status)}</Tag>
                  </Space>
                </div>

                {/* Branch Info */}
                <div className={styles.branchInfo}>
                  <HomeOutlined />
                  <span>{language === 'ar' ? doc.branchAr : doc.branch}</span>
                </div>

                {/* Expiry Info */}
                <div className={styles.expirySection}>
                  <div className={styles.expiryHeader}>
                    <span className={styles.expiryLabel}>
                      <CalendarOutlined />
                      {language === 'ar' ? 'تاريخ الانتهاء' : 'Expiry Date'}
                    </span>
                    <span
                      className={styles.expiryDate}
                      style={{
                        color:
                          doc.status === 'expired'
                            ? '#ff4d4f'
                            : doc.status === 'expiring-soon'
                            ? '#faad14'
                            : '#00AA64',
                      }}
                    >
                      {doc.expiryDate}
                    </span>
                  </div>
                  {daysUntilExpiry >= 0 && (
                    <div className={styles.daysRemaining}>
                      <span>
                        {language === 'ar'
                          ? `${daysUntilExpiry} يوم متبقي`
                          : `${daysUntilExpiry} days remaining`}
                      </span>
                      <Progress
                        percent={expiryProgress}
                        showInfo={false}
                        strokeColor={
                          daysUntilExpiry < 30
                            ? '#ff4d4f'
                            : daysUntilExpiry < 90
                            ? '#faad14'
                            : '#00AA64'
                        }
                        size="small"
                      />
                    </div>
                  )}
                  {daysUntilExpiry < 0 && (
                    <div className={styles.expiredBadge}>
                      <WarningOutlined />
                      <span>
                        {language === 'ar'
                          ? `منتهي منذ ${Math.abs(daysUntilExpiry)} يوم`
                          : `Expired ${Math.abs(daysUntilExpiry)} days ago`}
                      </span>
                    </div>
                  )}
                </div>

                {/* File Details */}
                <div className={styles.fileDetails}>
                  <div className={styles.fileDetail}>
                    <span className={styles.detailLabel}>
                      {language === 'ar' ? 'الحجم' : 'Size'}
                    </span>
                    <span className={styles.detailValue}>{doc.fileSize}</span>
                  </div>
                  <div className={styles.fileDetail}>
                    <span className={styles.detailLabel}>
                      {language === 'ar' ? 'تاريخ الرفع' : 'Upload Date'}
                    </span>
                    <span className={styles.detailValue}>{doc.uploadDate}</span>
                  </div>
                </div>
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
          total={filteredDocuments.length}
          onChange={(page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          }}
          showSizeChanger
          showTotal={(total) =>
            language === 'ar' ? `إجمالي ${total} مستند` : `Total ${total} documents`
          }
          pageSizeOptions={[12, 24, 36, 48]}
        />
      </div>

      {/* Renew Modal */}
      <Modal
        title={language === 'ar' ? 'تجديد تاريخ انتهاء الوثيقة' : 'Renew Document Expiry Date'}
        open={isRenewModalVisible}
        onOk={handleRenewSubmit}
        onCancel={() => {
          setIsRenewModalVisible(false);
          form.resetFields();
        }}
        okText={language === 'ar' ? 'تجديد' : 'Renew'}
        cancelText={language === 'ar' ? 'إلغاء' : 'Cancel'}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label={language === 'ar' ? 'اسم الوثيقة' : 'Document Name'}
            style={{ marginBottom: 16 }}
          >
            <Input
              value={
                selectedDocument
                  ? language === 'ar'
                    ? selectedDocument.nameAr
                    : selectedDocument.name
                  : ''
              }
              disabled
            />
          </Form.Item>
          <Form.Item
            label={language === 'ar' ? 'تاريخ الانتهاء الحالي' : 'Current Expiry Date'}
            style={{ marginBottom: 16 }}
          >
            <Input value={selectedDocument?.expiryDate} disabled />
          </Form.Item>
          <Form.Item
            name="newExpiryDate"
            label={language === 'ar' ? 'تاريخ الانتهاء الجديد' : 'New Expiry Date'}
            rules={[
              {
                required: true,
                message:
                  language === 'ar'
                    ? 'الرجاء اختيار تاريخ الانتهاء الجديد'
                    : 'Please select new expiry date',
              },
            ]}
          >
            <DatePicker
              style={{ width: '100%' }}
              placeholder={language === 'ar' ? 'اختر التاريخ' : 'Select Date'}
              format="YYYY-MM-DD"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
