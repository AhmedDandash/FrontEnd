'use client';

import React, { useState, useMemo } from 'react';
import {
  Card,
  Row,
  Col,
  Select,
  DatePicker,
  Space,
  Statistic,
  Tag,
  Avatar,
  Progress,
  Table,
  Badge
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  UserOutlined,
  TrophyOutlined,
  RiseOutlined,
  FallOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  StarOutlined,
  TeamOutlined,
  FileTextOutlined,
  SmileOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/store/authStore';
import styles from './AgentProductivity.module.css';
import type { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;

interface AgentStats {
  id: number;
  name: string;
  nameAr: string;
  avatar?: string;
  totalContracts: number;
  completedContracts: number;
  pendingContracts: number;
  avgResponseTime: number; // in hours
  customerSatisfaction: number; // percentage
  revenue: number;
  efficiency: number; // percentage
  rank: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  branch: string;
  branchAr: string;
}

export default function AgentProductivityPage() {
  const language = useAuthStore((state) => state.language);
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('month');
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  const branches = [
    { value: 'all', label: 'All Branches', labelAr: 'جميع الفروع' },
    { value: '1', label: 'Main Branch', labelAr: 'الفرع الرئيسي' },
    { value: '2', label: 'North Branch', labelAr: 'الفرع الشمالي' },
    { value: '3', label: 'South Branch', labelAr: 'الفرع الجنوبي' },
    { value: '4', label: 'East Branch', labelAr: 'الفرع الشرقي' },
  ];

  const periods = [
    { value: 'today', label: 'Today', labelAr: 'اليوم' },
    { value: 'week', label: 'This Week', labelAr: 'هذا الأسبوع' },
    { value: 'month', label: 'This Month', labelAr: 'هذا الشهر' },
    { value: 'quarter', label: 'This Quarter', labelAr: 'هذا الربع' },
    { value: 'year', label: 'This Year', labelAr: 'هذا العام' },
    { value: 'custom', label: 'Custom Range', labelAr: 'نطاق مخصص' },
  ];

  // Mock data - 15 agents with realistic statistics
  const mockAgents: AgentStats[] = Array.from({ length: 15 }, (_, i) => {
    const totalContracts = Math.floor(Math.random() * 100) + 50;
    const completedContracts = Math.floor(totalContracts * (0.6 + Math.random() * 0.3));
    const pendingContracts = totalContracts - completedContracts;
    const trends: ('up' | 'down' | 'stable')[] = ['up', 'up', 'up', 'down', 'stable'];

    return {
      id: i + 1,
      name: `Agent ${i + 1}`,
      nameAr: `وكيل ${i + 1}`,
      totalContracts,
      completedContracts,
      pendingContracts,
      avgResponseTime: Math.random() * 24 + 1,
      customerSatisfaction: Math.floor(Math.random() * 30) + 70,
      revenue: Math.floor(Math.random() * 500000) + 100000,
      efficiency: Math.floor(Math.random() * 30) + 70,
      rank: i + 1,
      trend: trends[i % trends.length],
      trendValue: Math.floor(Math.random() * 20) + 5,
      branch: branches[(i % 4) + 1].label,
      branchAr: branches[(i % 4) + 1].labelAr,
    };
  }).sort((a, b) => b.completedContracts - a.completedContracts);

  const filteredAgents = useMemo(() => {
    return mockAgents.filter((agent) => {
      if (selectedBranch === 'all') return true;
      return branches.find((b) => b.label === agent.branch)?.value === selectedBranch;
    });
  }, [selectedBranch]);

  const overallStats = {
    totalAgents: filteredAgents.length,
    totalContracts: filteredAgents.reduce((sum, a) => sum + a.totalContracts, 0),
    completedContracts: filteredAgents.reduce((sum, a) => sum + a.completedContracts, 0),
    avgSatisfaction: Math.floor(
      filteredAgents.reduce((sum, a) => sum + a.customerSatisfaction, 0) / filteredAgents.length
    ),
    totalRevenue: filteredAgents.reduce((sum, a) => sum + a.revenue, 0),
    avgEfficiency: Math.floor(
      filteredAgents.reduce((sum, a) => sum + a.efficiency, 0) / filteredAgents.length
    ),
  };

  const topPerformers = filteredAgents.slice(0, 3);

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <RiseOutlined style={{ color: '#00AA64' }} />;
    if (trend === 'down') return <FallOutlined style={{ color: '#ff4d4f' }} />;
    return <span style={{ color: '#faad14' }}>→</span>;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1)
      return (
        <div className={styles.rankBadge} style={{ background: '#FFD700' }}>
          <TrophyOutlined /> 1st
        </div>
      );
    if (rank === 2)
      return (
        <div className={styles.rankBadge} style={{ background: '#C0C0C0' }}>
          <TrophyOutlined /> 2nd
        </div>
      );
    if (rank === 3)
      return (
        <div className={styles.rankBadge} style={{ background: '#CD7F32' }}>
          <TrophyOutlined /> 3rd
        </div>
      );
    return (
      <div className={styles.rankBadge} style={{ background: '#e8e8e8', color: '#666' }}>
        #{rank}
      </div>
    );
  };

  const columns: ColumnsType<AgentStats> = [
    {
      title: language === 'ar' ? 'الترتيب' : 'Rank',
      dataIndex: 'rank',
      key: 'rank',
      width: 100,
      render: (rank) => getRankBadge(rank),
      sorter: (a, b) => a.rank - b.rank,
    },
    {
      title: language === 'ar' ? 'الوكيل' : 'Agent',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <Space>
          <Avatar size={40} icon={<UserOutlined />} style={{ background: '#003366' }} />
          <div>
            <div style={{ fontWeight: 600 }}>{language === 'ar' ? record.nameAr : record.name}</div>
            <div style={{ fontSize: 12, color: '#999' }}>
              {language === 'ar' ? record.branchAr : record.branch}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: language === 'ar' ? 'العقود المكتملة' : 'Completed Contracts',
      dataIndex: 'completedContracts',
      key: 'completedContracts',
      sorter: (a, b) => a.completedContracts - b.completedContracts,
      render: (value, record) => (
        <Space>
          <Tag color="green" style={{ fontSize: 14, fontWeight: 600 }}>
            {value}
          </Tag>
          <span style={{ color: '#999' }}>/ {record.totalContracts}</span>
        </Space>
      ),
    },
    {
      title: language === 'ar' ? 'الكفاءة' : 'Efficiency',
      dataIndex: 'efficiency',
      key: 'efficiency',
      sorter: (a, b) => a.efficiency - b.efficiency,
      render: (value) => (
        <Progress
          percent={value}
          strokeColor={value >= 85 ? '#00AA64' : value >= 70 ? '#faad14' : '#ff4d4f'}
          size="small"
          style={{ width: 120 }}
        />
      ),
    },
    {
      title: language === 'ar' ? 'رضا العملاء' : 'Customer Satisfaction',
      dataIndex: 'customerSatisfaction',
      key: 'customerSatisfaction',
      sorter: (a, b) => a.customerSatisfaction - b.customerSatisfaction,
      render: (value) => (
        <Space>
          <SmileOutlined style={{ color: value >= 90 ? '#00AA64' : '#faad14', fontSize: 16 }} />
          <span style={{ fontWeight: 600 }}>{value}%</span>
        </Space>
      ),
    },
    {
      title: language === 'ar' ? 'متوسط وقت الاستجابة' : 'Avg Response Time',
      dataIndex: 'avgResponseTime',
      key: 'avgResponseTime',
      sorter: (a, b) => a.avgResponseTime - b.avgResponseTime,
      render: (value) => (
        <Space>
          <ClockCircleOutlined style={{ color: '#003366' }} />
          <span>{value.toFixed(1)}h</span>
        </Space>
      ),
    },
    {
      title: language === 'ar' ? 'الإيرادات' : 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      sorter: (a, b) => a.revenue - b.revenue,
      render: (value) => (
        <span style={{ fontWeight: 600, color: '#003366' }}>${value.toLocaleString()}</span>
      ),
    },
    {
      title: language === 'ar' ? 'الاتجاه' : 'Trend',
      dataIndex: 'trend',
      key: 'trend',
      render: (trend, record) => (
        <Space>
          {getTrendIcon(trend)}
          <span
            style={{
              color: trend === 'up' ? '#00AA64' : trend === 'down' ? '#ff4d4f' : '#faad14',
              fontWeight: 600,
            }}
          >
            {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}
            {record.trendValue}%
          </span>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.pageContainer}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <h1>
          <TeamOutlined />
          <span>{language === 'ar' ? 'إنتاجية الوكلاء' : 'Agent Productivity'}</span>
        </h1>
      </div>

      {/* Filters */}
      <Card className={styles.filterCard}>
        <Space wrap size={16}>
          <div>
            <label className={styles.filterLabel}>{language === 'ar' ? 'الفترة' : 'Period'}</label>
            <Select
              size="large"
              value={selectedPeriod}
              onChange={setSelectedPeriod}
              style={{ width: 180 }}
              options={periods.map((p) => ({
                value: p.value,
                label: language === 'ar' ? p.labelAr : p.label,
              }))}
            />
          </div>
          {selectedPeriod === 'custom' && (
            <div>
              <label className={styles.filterLabel}>
                {language === 'ar' ? 'النطاق الزمني' : 'Date Range'}
              </label>
              <RangePicker
                size="large"
                value={dateRange}
                onChange={(dates) => setDateRange(dates as [Dayjs | null, Dayjs | null] | null)}
                format="YYYY-MM-DD"
              />
            </div>
          )}
          <div>
            <label className={styles.filterLabel}>{language === 'ar' ? 'الفرع' : 'Branch'}</label>
            <Select
              size="large"
              value={selectedBranch}
              onChange={setSelectedBranch}
              style={{ width: 200 }}
              options={branches.map((b) => ({
                value: b.value,
                label: language === 'ar' ? b.labelAr : b.label,
              }))}
            />
          </div>
        </Space>
      </Card>

      {/* Overall Statistics */}
      <Row gutter={[16, 16]} className={styles.statsRow}>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={language === 'ar' ? 'إجمالي الوكلاء' : 'Total Agents'}
              value={overallStats.totalAgents}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#003366' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={language === 'ar' ? 'العقود المكتملة' : 'Completed Contracts'}
              value={overallStats.completedContracts}
              suffix={`/ ${overallStats.totalContracts}`}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#00AA64' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={language === 'ar' ? 'متوسط الرضا' : 'Avg Satisfaction'}
              value={overallStats.avgSatisfaction}
              suffix="%"
              prefix={<SmileOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={language === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue'}
              value={overallStats.totalRevenue}
              prefix="$"
              valueStyle={{ color: '#003366' }}
              formatter={(value) => `${Number(value).toLocaleString()}`}
            />
          </Card>
        </Col>
      </Row>

      {/* Top Performers */}
      <Card
        className={styles.topPerformersCard}
        title={
          <Space>
            <TrophyOutlined style={{ color: '#FFD700', fontSize: 20 }} />
            <span>{language === 'ar' ? 'أفضل الأداءات' : 'Top Performers'}</span>
          </Space>
        }
      >
        <Row gutter={[16, 16]}>
          {topPerformers.map((agent, index) => (
            <Col xs={24} md={8} key={agent.id}>
              <div className={styles.performerCard}>
                <div className={styles.performerRank}>{getRankBadge(index + 1)}</div>
                <Avatar size={64} icon={<UserOutlined />} style={{ background: '#003366' }} />
                <h3>{language === 'ar' ? agent.nameAr : agent.name}</h3>
                <Tag color="blue">{language === 'ar' ? agent.branchAr : agent.branch}</Tag>
                <div className={styles.performerStats}>
                  <div className={styles.performerStat}>
                    <FileTextOutlined />
                    <span>
                      {agent.completedContracts} {language === 'ar' ? 'عقد' : 'Contracts'}
                    </span>
                  </div>
                  <div className={styles.performerStat}>
                    <StarOutlined />
                    <span>{agent.customerSatisfaction}%</span>
                  </div>
                  <div className={styles.performerStat}>
                    <ThunderboltOutlined />
                    <span>{agent.efficiency}%</span>
                  </div>
                </div>
                <div className={styles.performerRevenue}>${agent.revenue.toLocaleString()}</div>
              </div>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Detailed Table */}
      <Card
        className={styles.tableCard}
        title={
          <Space>
            <TeamOutlined />
            <span>{language === 'ar' ? 'جميع الوكلاء' : 'All Agents'}</span>
            <Badge count={filteredAgents.length} style={{ backgroundColor: '#003366' }} />
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredAgents}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) =>
              language === 'ar' ? `إجمالي ${total} وكيل` : `Total ${total} agents`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  );
}
