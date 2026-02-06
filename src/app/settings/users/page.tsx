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
  Switch,
  Empty,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LockOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import { useUsers } from '@/hooks/api/useUsers';
import { usePrivileges } from '@/hooks/api/usePrivileges';
import { RegisterDto, UpdateUserDto } from '@/types/api.types';
import styles from './Users.module.css';

const { Title, Text } = Typography;
const { Password } = Input;

// Translations
const translations = {
  en: {
    pageTitle: 'Users Management',
    pageSubtitle: 'Manage system users and their roles',
    addNewUser: 'Add New User',
    totalUsers: 'Total Users',
    activeUsers: 'Active Users',
    inactiveUsers: 'Inactive Users',
    withRoles: 'With Roles',
    total: 'Total',
    users: 'users',
    noUsers: 'No users found',
    editUser: 'Edit User',
    createNewUser: 'Create New User',
    username: 'Username',
    password: 'Password',
    role: 'Role',
    status: 'Status',
    cancel: 'Cancel',
    updateUser: 'Update User',
    createUser: 'Create User',
    pleaseEnterUsername: 'Please enter username',
    usernameTooShort: 'Username must be at least 3 characters',
    pleaseEnterPassword: 'Please enter password',
    passwordTooShort: 'Password must be at least 6 characters',
    enterUsername: 'Enter username',
    enterPassword: 'Enter password',
    selectRoles: 'Select roles',
    loadingRoles: 'Loading roles...',
    active: 'Active',
    inactive: 'Inactive',
    deleteUser: 'Delete User',
    deleteConfirm: 'Are you sure you want to delete this user?',
    yes: 'Yes',
    no: 'No',
    edit: 'Edit',
    delete: 'Delete',
    userIdColumn: 'User ID',
    usernameColumn: 'Username',
    statusColumn: 'Status',
    rolesColumn: 'Roles',
    actionsColumn: 'Actions',
    noRoles: 'No roles',
  },
  ar: {
    pageTitle: 'إدارة المستخدمين',
    pageSubtitle: 'إدارة مستخدمي النظام وأدوارهم',
    addNewUser: 'إضافة مستخدم جديد',
    totalUsers: 'إجمالي المستخدمين',
    activeUsers: 'المستخدمون النشطون',
    inactiveUsers: 'المستخدمون غير النشطين',
    withRoles: 'لديهم أدوار',
    total: 'إجمالي',
    users: 'مستخدم',
    noUsers: 'لا يوجد مستخدمون',
    editUser: 'تعديل المستخدم',
    createNewUser: 'إنشاء مستخدم جديد',
    username: 'اسم المستخدم',
    password: 'كلمة المرور',
    role: 'الدور',
    status: 'الحالة',
    cancel: 'إلغاء',
    updateUser: 'تحديث المستخدم',
    createUser: 'إنشاء المستخدم',
    pleaseEnterUsername: 'الرجاء إدخال اسم المستخدم',
    usernameTooShort: 'يجب أن يكون اسم المستخدم 3 أحرف على الأقل',
    pleaseEnterPassword: 'الرجاء إدخال كلمة المرور',
    passwordTooShort: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل',
    enterUsername: 'أدخل اسم المستخدم',
    enterPassword: 'أدخل كلمة المرور',
    selectRoles: 'اختر الأدوار',
    loadingRoles: 'جاري تحميل الأدوار...',
    active: 'نشط',
    inactive: 'غير نشط',
    deleteUser: 'حذف المستخدم',
    deleteConfirm: 'هل أنت متأكد من حذف هذا المستخدم؟',
    yes: 'نعم',
    no: 'لا',
    edit: 'تعديل',
    delete: 'حذف',
    userIdColumn: 'معرف المستخدم',
    usernameColumn: 'اسم المستخدم',
    statusColumn: 'الحالة',
    rolesColumn: 'الأدوار',
    actionsColumn: 'الإجراءات',
    noRoles: 'لا توجد أدوار',
  },
};

/**
 * Modern Users Management Page
 * Completely redesigned with modern UI patterns
 */
export default function UsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
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

  const { users, isLoading, createUser, updateUser, deleteUser, isCreating, isUpdating } =
    useUsers();
  const { privileges, isLoading: isLoadingRoles } = usePrivileges();

  // Calculate statistics
  const stats = {
    total: users.length,
    active: users.filter((u) => u.isActive).length,
    inactive: users.filter((u) => !u.isActive).length,
    withRoles: users.filter((u) => u.roles && u.roles.length > 0).length,
  };

  // Handle modal open for create/edit
  const handleOpenModal = (record?: any) => {
    if (record) {
      const roleIdsFromNames = Array.isArray(record.roles)
        ? record.roles
            .map((roleName: string) => privileges.find((role) => role.name === roleName)?.id)
            .filter((id: number | undefined): id is number => typeof id === 'number')
        : [];

      setEditingId(record.id);
      form.setFieldsValue({
        username: record.username,
        isActive: record.isActive,
        roleIds: roleIdsFromNames,
      });
    } else {
      setEditingId(null);
      form.resetFields();
      form.setFieldsValue({ isActive: true });
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
    const roleIds = Array.isArray(values.roleIds)
      ? values.roleIds
          .map((value: any) => Number(value))
          .filter((value: number) => !Number.isNaN(value))
      : [];

    if (editingId) {
      // For update, use UpdateUserDto format
      const updateData: UpdateUserDto = {
        username: values.username,
        isActive: values.isActive,
        roleIds,
      };
      updateUser({ id: editingId, data: updateData });
    } else {
      // For create, use UserDto format
      const createData: RegisterDto = {
        username: values.username,
        password: values.password,
        roles: roleIds,
      };
      createUser(createData);
    }
    handleCloseModal();
  };

  // Handle delete
  const handleDelete = (id: number) => {
    deleteUser(id);
  };

  // Get status tag
  const getStatusTag = (isActive?: boolean) => {
    if (isActive) {
      return (
        <Tag color="success" icon={<CheckCircleOutlined />}>
          {t.active}
        </Tag>
      );
    }
    return (
      <Tag color="error" icon={<CloseCircleOutlined />}>
        {t.inactive}
      </Tag>
    );
  };

  // Get roles display
  const getRolesDisplay = (roles?: any) => {
    if (!roles || roles.length === 0) {
      return <Text type="secondary">{t.noRoles}</Text>;
    }
    return (
      <Space size={4} wrap>
        {roles.map((role: any, index: number) => (
          <Tag key={index} color="blue">
            {typeof role === 'string' ? role : role.name || role.nameAr || 'Role'}
          </Tag>
        ))}
      </Space>
    );
  };

  // Table columns
  const columns = [
    {
      title: t.userIdColumn,
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (id: number) => <Text strong>#{id}</Text>,
    },
    {
      title: t.usernameColumn,
      dataIndex: 'username',
      key: 'username',
      render: (text: string) => (
        <Space>
          <UserOutlined style={{ color: '#1890ff' }} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: t.statusColumn,
      dataIndex: 'isActive',
      key: 'isActive',
      width: 120,
      render: (isActive: boolean) => getStatusTag(isActive),
    },
    {
      title: t.rolesColumn,
      dataIndex: 'roles',
      key: 'roles',
      render: (roles: string[]) => getRolesDisplay(roles),
    },
    {
      title: t.actionsColumn,
      key: 'actions',
      width: 150,
      align: 'center' as const,
      render: (_: any, record: any) => (
        <div className={styles.actionButtons}>
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
            title={t.deleteUser}
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
    <div className={styles.usersPage}>
      {/* Header Section */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <TeamOutlined className={styles.headerIcon} />
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
              {t.addNewUser}
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <Row gutter={16} className={styles.statsRow}>
        <Col xs={24} sm={12} md={6}>
          <Card className={styles.statCard}>
            <div className={styles.statContent}>
              <div
                className={styles.statIcon}
                style={{ background: 'linear-gradient(135deg, #e6f4ff 0%, #bae0ff 100%)' }}
              >
                <TeamOutlined style={{ color: '#1890ff' }} />
              </div>
              <div className={styles.statInfo}>
                <p className={styles.statLabel}>{t.totalUsers}</p>
                <p className={styles.statValue}>{stats.total}</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className={styles.statCard}>
            <div className={styles.statContent}>
              <div
                className={styles.statIcon}
                style={{ background: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)' }}
              >
                <CheckCircleOutlined style={{ color: '#52c41a' }} />
              </div>
              <div className={styles.statInfo}>
                <p className={styles.statLabel}>{t.activeUsers}</p>
                <p className={styles.statValue}>{stats.active}</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className={styles.statCard}>
            <div className={styles.statContent}>
              <div
                className={styles.statIcon}
                style={{ background: 'linear-gradient(135deg, #fff1f0 0%, #ffccc7 100%)' }}
              >
                <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
              </div>
              <div className={styles.statInfo}>
                <p className={styles.statLabel}>{t.inactiveUsers}</p>
                <p className={styles.statValue}>{stats.inactive}</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className={styles.statCard}>
            <div className={styles.statContent}>
              <div
                className={styles.statIcon}
                style={{ background: 'linear-gradient(135deg, #fffbe6 0%, #fff1b8 100%)' }}
              >
                <SafetyOutlined style={{ color: '#faad14' }} />
              </div>
              <div className={styles.statInfo}>
                <p className={styles.statLabel}>{t.withRoles}</p>
                <p className={styles.statValue}>{stats.withRoles}</p>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Main Table */}
      <Card className={styles.tableCard}>
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={isLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `${t.total} ${total} ${t.users}`,
          }}
          locale={{
            emptyText: (
              <div className={styles.emptyState}>
                <Empty description={t.noUsers} image={Empty.PRESENTED_IMAGE_SIMPLE} />
              </div>
            ),
          }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={
          <Space>
            <UserOutlined />
            <span>{editingId ? t.editUser : t.createNewUser}</span>
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
            label={t.username}
            name="username"
            rules={[
              { required: true, message: t.pleaseEnterUsername },
              { min: 3, message: t.usernameTooShort },
            ]}
          >
            <Input size="large" prefix={<UserOutlined />} placeholder={t.enterUsername} />
          </Form.Item>

          {!editingId && (
            <Form.Item
              label={t.password}
              name="password"
              rules={[
                { required: true, message: t.pleaseEnterPassword },
                { min: 6, message: t.passwordTooShort },
              ]}
            >
              <Password size="large" prefix={<LockOutlined />} placeholder={t.enterPassword} />
            </Form.Item>
          )}

          <Form.Item label={t.role} name="roleIds">
            <Select
              mode="multiple"
              size="large"
              placeholder={isLoadingRoles ? t.loadingRoles : t.selectRoles}
              loading={isLoadingRoles}
              style={{ width: '100%' }}
              optionFilterProp="label"
              showSearch
            >
              {privileges.map((role) => (
                <Select.Option key={role.id} value={role.id} label={role.name || ''}>
                  {role.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label={t.status} name="isActive" valuePropName="checked" initialValue={true}>
            <Switch checkedChildren={t.active} unCheckedChildren={t.inactive} defaultChecked />
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
              {editingId ? t.updateUser : t.createUser}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
