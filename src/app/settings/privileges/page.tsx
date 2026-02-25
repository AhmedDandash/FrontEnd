'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Tag,
  Popconfirm,
  Row,
  Col,
  Typography,
  Empty,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FilterOutlined,
  TeamOutlined,
  UserOutlined,
  SafetyOutlined,
  EyeOutlined,
  ClearOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { usePrivileges } from '@/hooks/api/usePrivileges';
import { CreateRoleDto, UpdateRoleDto } from '@/types/api.types';
import { PRIVILEGE_TYPE } from '@/constants/enums';
import styles from './Privileges.module.css';

const { Title, Text } = Typography;

// Translations
const translations = {
  en: {
    pageTitle: 'Privileges & Roles',
    pageSubtitle: 'Manage user roles and permissions across the system',
    addNewRole: 'Add New Role',
    totalRoles: 'Total Roles',
    employeeRoles: 'Employee Roles',
    agentRoles: 'Agent Roles',
    searchPlaceholder: 'Search roles...',
    filters: 'Filters',
    relatedTo: 'Related To',
    employees: 'Employees',
    agent: 'Agent',
    activeFilters: 'Active Filters:',
    nameFilter: 'Name',
    clearAll: 'Clear All',
    total: 'Total',
    roles: 'roles',
    noPrivileges: 'No privileges found',
    editRole: 'Edit Role',
    createNewRole: 'Create New Role',
    roleName: 'Role Name',
    enterRoleName: 'Enter role name',
    selectType: 'Select type',
    cancel: 'Cancel',
    updateRole: 'Update Role',
    createRole: 'Create Role',
    pleaseEnterRoleName: 'Please enter role name',
    pleaseSelectType: 'Please select related type',
    deletePrivilege: 'Delete Privilege',
    deleteConfirm: 'Are you sure you want to delete this privilege?',
    yes: 'Yes',
    no: 'No',
    viewPermissions: 'View Permissions',
    edit: 'Edit',
    delete: 'Delete',
    roleNameColumn: 'Role Name',
    relatedToColumn: 'Related To',
    actionsColumn: 'Actions',
    unknown: 'Unknown',
  },
  ar: {
    pageTitle: 'الصلاحيات والأدوار',
    pageSubtitle: 'إدارة أدوار المستخدمين وصلاحياتهم في النظام',
    addNewRole: 'إضافة دور جديد',
    totalRoles: 'إجمالي الأدوار',
    employeeRoles: 'أدوار الموظفين',
    agentRoles: 'أدوار الوكلاء',
    searchPlaceholder: 'البحث في الأدوار...',
    filters: 'Filters',
    relatedTo: 'متعلق بـ',
    employees: 'الموظفون',
    agent: 'وكيل',
    activeFilters: 'التصفيات النشطة:',
    nameFilter: 'الاسم',
    clearAll: 'مسح الكل',
    total: 'إجمالي',
    roles: 'دور',
    noPrivileges: 'لا توجد صلاحيات',
    editRole: ' تعديل الدور',
    createNewRole: 'إنشاء دور جديد',
    roleName: 'اسم الدور',
    enterRoleName: 'أدخل اسم الدور',
    selectType: 'اختر النوع',
    cancel: 'إلغاء',
    updateRole: 'تحديث الدور',
    createRole: 'إنشاء الدور',
    pleaseEnterRoleName: 'الرجاء إدخال اسم الدور',
    pleaseSelectType: 'الرجاء اختيار النوع المتعلق',
    deletePrivilege: 'حذف الصلاحية',
    deleteConfirm: 'هل أنت متأكد من حذف هذه الصلاحية؟',
    yes: 'نعم',
    no: 'لا',
    viewPermissions: 'عرض الصلاحيات',
    edit: ' تعديل',
    delete: 'حذف',
    roleNameColumn: 'اسم الدور',
    relatedToColumn: 'متعلق بـ',
    actionsColumn: 'الإجراءات',
    unknown: 'غير معروف',
  },
};

/**
 * Modern Privileges Management Page
 * Completely redesigned with modern UI patterns
 */
export default function PrivilegesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filters, setFilters] = useState<{ name?: string; relatedTo?: number }>({});
  const [isRtl, setIsRtl] = useState(false);
  const [form] = Form.useForm();

  // Detect RTL direction
  useEffect(() => {
    const dir = document.documentElement.getAttribute('dir') || document.body.getAttribute('dir');
    setIsRtl(dir === 'rtl');

    // Observer to detect direction changes
    const observer = new MutationObserver(() => {
      const newDir =
        document.documentElement.getAttribute('dir') || document.body.getAttribute('dir');
      setIsRtl(newDir === 'rtl');
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['dir'],
    });

    return () => observer.disconnect();
  }, []);

  // Get translations based on direction
  const t = isRtl ? translations.ar : translations.en;

  const {
    privileges,
    isLoading,
    createPrivilege,
    updatePrivilege,
    deletePrivilege,
    isCreating,
    isUpdating,
  } = usePrivileges();

  const filteredPrivileges = privileges.filter((role) => {
    const matchesName = filters.name
      ? role.name?.toLowerCase().includes(filters.name.toLowerCase())
      : true;
    const matchesRelatedTo =
      filters.relatedTo !== undefined ? role.relatedTo === filters.relatedTo : true;
    return matchesName && matchesRelatedTo;
  });

  // Adjust the statistics calculation to map integers correctly for display in status cards
  const stats = {
    total: filteredPrivileges.length,
    employees: filteredPrivileges.filter((p) => p.relatedTo === 2).length, // Map 2 to employees
    agents: filteredPrivileges.filter((p) => p.relatedTo === 1).length, // Map 1 to agent
  };

  // Handle modal open for create/edit
  const handleOpenModal = (record?: any) => {
    if (record) {
      setEditingId(record.id);
      form.setFieldsValue({
        name: record.name,
        relatedTo: record.relatedTo,
      });
    } else {
      setEditingId(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    form.resetFields();
  };

  // Handle form submit
  const handleSubmit = async (values: any) => {
    const relatedToValue = values.relatedTo === 0 ? 2 : 1; // Map 0 to 2 (employees) and 1 to 1 (agent)

    if (editingId) {
      const updateData: UpdateRoleDto = {
        name: values.name,
        relatedTo: relatedToValue,
      };
      updatePrivilege({ id: editingId, data: updateData });
    } else {
      const createData: CreateRoleDto = {
        name: values.name,
        relatedTo: relatedToValue,
      };
      createPrivilege(createData);
    }
    handleCloseModal();
  };

  // Handle delete
  const handleDelete = (id: number) => {
    deletePrivilege(id);
  };

  // Handle filter apply
  const handleApplyFilters = (name?: string, relatedTo?: number) => {
    setFilters({
      name: name || undefined,
      relatedTo: relatedTo !== undefined ? relatedTo : undefined,
    });
  };

  // Clear filters
  const handleClearFilters = () => {
    setFilters({});
  };

  // Get type display
  const getTypeTag = (relatedTo?: number) => {
    if (relatedTo === 2) {
      // Map 2 to employees
      return (
        <Tag color="blue" icon={<TeamOutlined />}>
          {t.employees}
        </Tag>
      );
    } else if (relatedTo === 1) {
      // Map 1 to agent
      return (
        <Tag color="green" icon={<UserOutlined />}>
          {t.agent}
        </Tag>
      );
    }
    return <Tag>{t.unknown}</Tag>;
  };

  // Table columns
  const columns = [
    {
      title: t.roleNameColumn,
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: t.relatedToColumn,
      dataIndex: 'relatedTo',
      key: 'relatedTo',
      width: 150,
      render: (relatedTo: number) => getTypeTag(relatedTo),
    },
    {
      title: t.actionsColumn,
      key: 'actions',
      width: 180,
      align: 'center' as const,
      render: (_: any, record: any) => (
        <div className={styles.actionButtons}>
          <Tooltip title={t.viewPermissions}>
            <Button
              type="text"
              className={`${styles.actionButton} ${styles.viewButton}`}
              icon={<EyeOutlined />}
              size="small"
              onClick={() => {
                // View role permissions - implement later
                console.log('View role:', record.id);
              }}
            />
          </Tooltip>
          <Tooltip title={t.edit}>
            <Button
              type="text"
              className={`${styles.actionButton} ${styles.editButton}`}
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleOpenModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title={t.deletePrivilege}
            description={t.deleteConfirm}
            onConfirm={() => handleDelete(record.id)}
            okText={t.yes}
            cancelText={t.no}
          >
            <Tooltip title={t.delete}>
              <Button
                type="text"
                danger
                className={`${styles.actionButton} ${styles.deleteButton}`}
                icon={<DeleteOutlined />}
                size="small"
              />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.privilegesPage}>
      {/* Header Section */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <SafetyOutlined className={styles.headerIcon} />
            <div className={styles.titleSection}>
              <Title level={2} className={styles.pageTitle}>
                {t.pageTitle}
              </Title>
              <p className={styles.pageSubtitle}>{t.pageSubtitle}</p>
            </div>
          </div>
          <div className={styles.headerActions}>
            <Button
              type="primary"
              className={styles.addButton}
              icon={<PlusOutlined />}
              onClick={() => handleOpenModal()}
            >
              {t.addNewRole}
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <Row gutter={16} className={styles.statsRow}>
        <Col xs={24} sm={8}>
          <Card className={styles.statCard}>
            <div className={styles.statContent}>
              <div
                className={styles.statIcon}
                style={{ background: 'linear-gradient(135deg, #e6f4ff 0%, #bae0ff 100%)' }}
              >
                <SafetyOutlined style={{ color: '#1890ff' }} />
              </div>
              <div className={styles.statInfo}>
                <p className={styles.statLabel}>{t.totalRoles}</p>
                <p className={styles.statValue}>{stats.total}</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className={styles.statCard}>
            <div className={styles.statContent}>
              <div
                className={styles.statIcon}
                style={{ background: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)' }}
              >
                <TeamOutlined style={{ color: '#52c41a' }} />
              </div>
              <div className={styles.statInfo}>
                <p className={styles.statLabel}>{t.employeeRoles}</p>
                <p className={styles.statValue}>{stats.employees}</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className={styles.statCard}>
            <div className={styles.statContent}>
              <div
                className={styles.statIcon}
                style={{ background: 'linear-gradient(135deg, #fffbe6 0%, #fff1b8 100%)' }}
              >
                <UserOutlined style={{ color: '#faad14' }} />
              </div>
              <div className={styles.statInfo}>
                <p className={styles.statLabel}>{t.agentRoles}</p>
                <p className={styles.statValue}>{stats.agents}</p>
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
              placeholder={t.searchPlaceholder}
              prefix={<SearchOutlined />}
              value={filters.name || ''}
              onChange={(e) => handleApplyFilters(e.target.value, filters.relatedTo)}
              style={{ width: 300 }}
              allowClear
            />
            <Button
              icon={<FilterOutlined />}
              onClick={() => setShowFilters(!showFilters)}
              type={showFilters ? 'primary' : 'default'}
              size="large"
            >
              {t.filters}
            </Button>
          </Space>
        </div>

        {showFilters && (
          <div className={styles.filterContent}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <label className={styles.filterLabel}>{t.relatedTo}</label>
                <Select
                  size="large"
                  placeholder={t.selectType}
                  value={filters.relatedTo}
                  onChange={(value) => handleApplyFilters(filters.name, value)}
                  style={{ width: '100%' }}
                  allowClear
                  onClear={() => handleApplyFilters(filters.name, undefined)}
                >
                  <Select.Option value={PRIVILEGE_TYPE[0].value}>
                    <Space>
                      <TeamOutlined />
                      {t.employees}
                    </Space>
                  </Select.Option>
                  <Select.Option value={PRIVILEGE_TYPE[1].value}>
                    <Space>
                      <UserOutlined />
                      {t.agent}
                    </Space>
                  </Select.Option>
                </Select>
              </Col>
            </Row>
          </div>
        )}
      </Card>

      {/* Active Filters Display */}
      {Object.keys(filters).filter((k) => filters[k as keyof typeof filters]).length > 0 && (
        <div className={styles.activeFilters}>
          <div className={styles.filterTags}>
            <Text strong>{t.activeFilters}</Text>
            {filters.name && (
              <Tag closable onClose={() => setFilters((prev) => ({ ...prev, name: undefined }))}>
                {t.nameFilter}: {filters.name}
              </Tag>
            )}
            {filters.relatedTo !== undefined && (
              <Tag
                closable
                onClose={() => setFilters((prev) => ({ ...prev, relatedTo: undefined }))}
              >
                {t.relatedTo}: {filters.relatedTo === 0 ? t.employees : t.agent}
              </Tag>
            )}
            <Button
              type="link"
              size="small"
              className={styles.clearFiltersButton}
              icon={<ClearOutlined />}
              onClick={handleClearFilters}
            >
              {t.clearAll}
            </Button>
          </div>
        </div>
      )}

      {/* Main Table */}
      <Card className={styles.tableCard}>
        <Table
          columns={columns}
          dataSource={filteredPrivileges}
          rowKey="id"
          loading={isLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `${t.total} ${total} ${t.roles}`,
          }}
          locale={{
            emptyText: (
              <div className={styles.emptyState}>
                <Empty description={t.noPrivileges} image={Empty.PRESENTED_IMAGE_SIMPLE} />
              </div>
            ),
          }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={
          <Space>
            <SafetyOutlined />
            <span>{editingId ? t.editRole : t.createNewRole}</span>
          </Space>
        }
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={600}
        className={styles.modal}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} className={styles.modalForm}>
          <Form.Item
            label={t.roleName}
            name="name"
            rules={[{ required: true, message: t.pleaseEnterRoleName }]}
          >
            <Input size="large" placeholder={t.enterRoleName} />
          </Form.Item>

          <Form.Item
            label={t.relatedTo}
            name="relatedTo"
            rules={[{ required: true, message: t.pleaseSelectType }]}
            initialValue={0}
          >
            <Select size="large" placeholder={t.selectType}>
              <Select.Option value={PRIVILEGE_TYPE[0].value}>
                <Space>
                  <TeamOutlined />
                  {t.employees}
                </Space>
              </Select.Option>
              <Select.Option value={PRIVILEGE_TYPE[1].value}>
                <Space>
                  <UserOutlined />
                  {t.agent}
                </Space>
              </Select.Option>
            </Select>
          </Form.Item>

          <div className={styles.modalActions}>
            <Button className={styles.cancelButton} onClick={handleCloseModal}>
              {t.cancel}
            </Button>
            <Button
              type="primary"
              className={styles.submitButton}
              htmlType="submit"
              loading={isCreating || isUpdating}
              icon={editingId ? <EditOutlined /> : <PlusOutlined />}
            >
              {editingId ? t.updateRole : t.createRole}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
