'use client';

import React, { useState } from 'react';
import { Table, Tag, Typography, Space, Button, Tooltip } from 'antd';
import { EyeOutlined, InboxOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useAuthStore } from '@/store/authStore';
import { useHRInbox } from '@/hooks/api/useHR';
import { HR_PROCESS_STATE } from '@/constants/hr.enums';
import { getEnumLabel } from '@/constants/enums';
import RequestStatusBadge from '@/features/hr/components/RequestStatusBadge';
import RequestsFilterPanel from '@/features/hr/components/RequestsFilterPanel';
import type { HRRequestSummary, HRRequestsFilterDto } from '@/types/hr.types';

const { Title } = Typography;

export default function RequestsInboxPage() {
  const language = useAuthStore((s) => s.language);
  const isAr = language === 'ar';
  const [filter, setFilter] = useState<HRRequestsFilterDto>({});

  const { data: requests = [], isLoading } = useHRInbox(filter);

  const columns: ColumnsType<HRRequestSummary> = [
    {
      title: '#',
      dataIndex: 'id',
      width: 60,
    },
    {
      title: isAr ? 'نوع الطلب' : 'Request Type',
      dataIndex: 'processState',
      render: (v) => <Tag>{getEnumLabel(HR_PROCESS_STATE, v, language)}</Tag>,
    },
    {
      title: isAr ? 'اسم الموظف' : 'Employee',
      dataIndex: 'employeeName',
    },
    {
      title: isAr ? 'رقم الموظف' : 'Emp. No.',
      dataIndex: 'employeeNumber',
    },
    {
      title: isAr ? 'القسم' : 'Department',
      dataIndex: 'departmentName',
    },
    {
      title: isAr ? 'الحالة' : 'Status',
      dataIndex: 'result',
      render: (v) => <RequestStatusBadge result={v} />,
    },
    {
      title: isAr ? 'المحال إليه' : 'Assignee',
      dataIndex: 'assigneeEmpName',
      render: (v) => v || '—',
    },
    {
      title: isAr ? 'تاريخ الإنشاء' : 'Created At',
      dataIndex: 'createdAt',
      render: (v) => new Date(v).toLocaleDateString(isAr ? 'ar-SA' : 'en-US'),
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: '',
      key: 'actions',
      width: 60,
      render: () => (
        <Tooltip title={isAr ? 'عرض' : 'View'}>
          <Button type="text" icon={<EyeOutlined />} size="small" />
        </Tooltip>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space align="center" style={{ marginBottom: 16 }}>
        <InboxOutlined style={{ fontSize: 20 }} />
        <Title level={4} style={{ margin: 0 }}>
          {isAr ? 'صندوق الوارد – الطلبات' : 'Requests Inbox'}
        </Title>
      </Space>

      <RequestsFilterPanel onFilter={setFilter} loading={isLoading} />

      <Table
        columns={columns}
        dataSource={requests}
        rowKey="id"
        loading={isLoading}
        size="small"
        pagination={{ pageSize: 15, showTotal: (total) => `${total} ${isAr ? 'طلب' : 'requests'}` }}
        scroll={{ x: 800 }}
      />
    </div>
  );
}
