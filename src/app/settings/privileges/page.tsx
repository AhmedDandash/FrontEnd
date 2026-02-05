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
  Badge,
  Drawer,
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
} from '@ant-design/icons';
import { usePrivileges } from '@/hooks/api/usePrivileges';
import { CreateRoleDto, UpdateRoleDto } from '@/types/api.types';

const { Title, Text } = Typography;

/**
 * Modern Privileges Management Page
 * Completely redesigned with modern UI patterns
 */
export default function PrivilegesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filters, setFilters] = useState<{ name?: string; relatedTo?: number }>({});
  const [form] = Form.useForm();

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

  // Calculate statistics
  const stats = {
    total: filteredPrivileges.length,
    employees: filteredPrivileges.filter((p) => p.relatedTo === 0).length,
    agents: filteredPrivileges.filter((p) => p.relatedTo === 1).length,
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
    if (editingId) {
      const updateData: UpdateRoleDto = {
        name: values.name,
        relatedTo: values.relatedTo,
      };
      updatePrivilege({ id: editingId, data: updateData });
    } else {
      const createData: CreateRoleDto = {
        name: values.name,
        relatedTo: values.relatedTo,
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
  const handleApplyFilters = (values: any) => {
    setFilters({
      name: values.name || undefined,
      relatedTo: values.relatedTo !== undefined ? values.relatedTo : undefined,
    });
    setIsFilterDrawerOpen(false);
  };

  // Clear filters
  const handleClearFilters = () => {
    setFilters({});
    form.resetFields();
  };

  // Get type display
  const getTypeTag = (relatedTo?: number) => {
    if (relatedTo === 0) {
      return (
        <Tag color="blue" icon={<TeamOutlined />}>
          Employees
        </Tag>
      );
    } else if (relatedTo === 1) {
      return (
        <Tag color="green" icon={<UserOutlined />}>
          Agent
        </Tag>
      );
    }
    return <Tag>Unknown</Tag>;
  };

  // Table columns
  const columns = [
    {
      title: 'Role Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Related To',
      dataIndex: 'relatedTo',
      key: 'relatedTo',
      width: 150,
      render: (relatedTo: number) => getTypeTag(relatedTo),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 180,
      align: 'center' as const,
      render: (_: any, record: any) => (
        <Space size="small">
          <Tooltip title="View Permissions">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => {
                // View role permissions - implement later
                console.log('View role:', record.id);
              }}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleOpenModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete Privilege"
            description="Are you sure you want to delete this privilege?"
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
              <SafetyOutlined style={{ fontSize: 32, color: '#1890ff' }} />
              <div>
                <Title level={2} style={{ margin: 0 }}>
                  Privileges & Roles
                </Title>
                <Text type="secondary">Manage user roles and permissions</Text>
              </div>
            </Space>
          </Col>
          <Col>
            <Space>
              <Badge
                count={
                  Object.keys(filters).filter((k) => filters[k as keyof typeof filters]).length
                }
              >
                <Button icon={<FilterOutlined />} onClick={() => setIsFilterDrawerOpen(true)}>
                  Filters
                </Button>
              </Badge>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => handleOpenModal()}
                size="large"
              >
                Add New Role
              </Button>
            </Space>
          </Col>
        </Row>

        {/* Statistics Cards */}
        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Total Roles"
                value={stats.total}
                prefix={<SafetyOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Employee Roles"
                value={stats.employees}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Agent Roles"
                value={stats.agents}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* Active Filters Display */}
      {Object.keys(filters).filter((k) => filters[k as keyof typeof filters]).length > 0 && (
        <Card size="small" style={{ marginBottom: 16, background: '#f0f5ff' }}>
          <Space wrap>
            <Text strong>Active Filters:</Text>
            {filters.name && (
              <Tag closable onClose={() => setFilters((prev) => ({ ...prev, name: undefined }))}>
                Name: {filters.name}
              </Tag>
            )}
            {filters.relatedTo !== undefined && (
              <Tag
                closable
                onClose={() => setFilters((prev) => ({ ...prev, relatedTo: undefined }))}
              >
                Related To: {filters.relatedTo === 0 ? 'Employees' : 'Agent'}
              </Tag>
            )}
            <Button type="link" size="small" icon={<ClearOutlined />} onClick={handleClearFilters}>
              Clear All
            </Button>
          </Space>
        </Card>
      )}

      {/* Main Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredPrivileges}
          rowKey="id"
          loading={isLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} roles`,
          }}
          locale={{
            emptyText: (
              <Empty description="No privileges found" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ),
          }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={
          <Space>
            <SafetyOutlined />
            <span>{editingId ? 'Edit Role' : 'Create New Role'}</span>
          </Space>
        }
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ marginTop: 24 }}>
          <Form.Item
            label="Role Name"
            name="name"
            rules={[{ required: true, message: 'Please enter role name' }]}
          >
            <Input size="large" placeholder="Enter role name" />
          </Form.Item>

          <Form.Item
            label="Related To"
            name="relatedTo"
            rules={[{ required: true, message: 'Please select related type' }]}
            initialValue={0}
          >
            <Select size="large" placeholder="Select type">
              <Select.Option value={0}>
                <Space>
                  <TeamOutlined />
                  Employees
                </Space>
              </Select.Option>
              <Select.Option value={1}>
                <Space>
                  <UserOutlined />
                  Agent
                </Space>
              </Select.Option>
            </Select>
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
                {editingId ? 'Update Role' : 'Create Role'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Filter Drawer */}
      <Drawer
        title={
          <Space>
            <FilterOutlined />
            <span>Filter Roles</span>
          </Space>
        }
        placement="right"
        onClose={() => setIsFilterDrawerOpen(false)}
        open={isFilterDrawerOpen}
        width={400}
      >
        <Form layout="vertical" onFinish={handleApplyFilters}>
          <Form.Item label="Role Name" name="name">
            <Input placeholder="Search by name" allowClear />
          </Form.Item>

          <Form.Item label="Related To" name="relatedTo">
            <Select placeholder="Select type" allowClear>
              <Select.Option value={0}>
                <Space>
                  <TeamOutlined />
                  Employees
                </Space>
              </Select.Option>
              <Select.Option value={1}>
                <Space>
                  <UserOutlined />
                  Agent
                </Space>
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setIsFilterDrawerOpen(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit" icon={<FilterOutlined />}>
                Apply Filters
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}
