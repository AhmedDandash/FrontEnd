'use client';

import { useState } from 'react';
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
  Statistic,
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

const { Title, Text } = Typography;
const { Password } = Input;

/**
 * Modern Users Management Page
 * Completely redesigned with modern UI patterns
 */
export default function UsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();

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
          Active
        </Tag>
      );
    }
    return (
      <Tag color="error" icon={<CloseCircleOutlined />}>
        Inactive
      </Tag>
    );
  };

  // Get roles display
  const getRolesDisplay = (roles?: any) => {
    if (!roles || roles.length === 0) {
      return <Text type="secondary">No roles</Text>;
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
      title: 'User ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (id: number) => <Text strong>#{id}</Text>,
    },
    {
      title: 'Username',
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
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 120,
      render: (isActive: boolean) => getStatusTag(isActive),
    },
    {
      title: 'Roles',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles: string[]) => getRolesDisplay(roles),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      align: 'center' as const,
      render: (_: any, record: any) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleOpenModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete User"
            description="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
              <Button type="text" danger icon={<DeleteOutlined />} size="small" />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Header Section */}
      <div style={{ marginBottom: 24 }}>
        <Row align="middle" justify="space-between" style={{ marginBottom: 16 }}>
          <Col>
            <Space align="center">
              <TeamOutlined style={{ fontSize: 32, color: '#1890ff' }} />
              <div>
                <Title level={2} style={{ margin: 0 }}>
                  Users Management
                </Title>
                <Text type="secondary">Manage system users and their roles</Text>
              </div>
            </Space>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleOpenModal()}
              size="large"
            >
              Add New User
            </Button>
          </Col>
        </Row>

        {/* Statistics Cards */}
        <Row gutter={16}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Users"
                value={stats.total}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Active Users"
                value={stats.active}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Inactive Users"
                value={stats.inactive}
                prefix={<CloseCircleOutlined />}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="With Roles"
                value={stats.withRoles}
                prefix={<SafetyOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* Main Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={isLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} users`,
          }}
          locale={{
            emptyText: <Empty description="No users found" image={Empty.PRESENTED_IMAGE_SIMPLE} />,
          }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={
          <Space>
            <UserOutlined />
            <span>{editingId ? 'Edit User' : 'Create New User'}</span>
          </Space>
        }
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ marginTop: 24 }}>
          <Form.Item
            label="Username"
            name="username"
            rules={[
              { required: true, message: 'Please enter username' },
              { min: 3, message: 'Username must be at least 3 characters' },
            ]}
          >
            <Input size="large" prefix={<UserOutlined />} placeholder="Enter username" />
          </Form.Item>

          {!editingId && (
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please enter password' },
                { min: 6, message: 'Password must be at least 6 characters' },
              ]}
            >
              <Password size="large" prefix={<LockOutlined />} placeholder="Enter password" />
            </Form.Item>
          )}

          <Form.Item label="Role" name="roleIds">
            <Select
              mode="multiple"
              size="large"
              placeholder={isLoadingRoles ? 'Loading roles...' : 'Select roles'}
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

          <Form.Item label="Status" name="isActive" valuePropName="checked" initialValue={true}>
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" defaultChecked />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={handleCloseModal}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isCreating || isUpdating}
                icon={editingId ? <EditOutlined /> : <PlusOutlined />}
              >
                {editingId ? 'Update User' : 'Create User'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
