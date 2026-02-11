'use client';

import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Input,
  Select,
  Tag,
  Avatar,
  Space,
  Dropdown,
  Badge,
  Empty,
  Tooltip,
  Pagination,
  Statistic,
} from 'antd';
import type { MenuProps } from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PhoneOutlined,
  MailOutlined,
  SafetyCertificateOutlined,
  FileTextOutlined,
  PaperClipOutlined,
  UserOutlined,
  GlobalOutlined,
  FilterOutlined,
  PrinterOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/store/authStore';
import styles from './Agents.module.css';

interface AgentData {
  id: number;
  name: string;
  nameAr: string;
  email: string;
  licenseNumber: string;
  phone1: string;
  phone2?: string;
  nationality: string;
  nationalityAr: string;
  agentType: 'mediation' | 'operation';
  contractsCount: number;
  filesCount: number;
  branchName: string;
  branchNameAr: string;
  isActive: boolean;
}

export default function AgentsPage() {
  const language = useAuthStore((state) => state.language);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNationalities, setSelectedNationalities] = useState<string[]>([]);
  const [selectedAgentType, setSelectedAgentType] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showFilters, setShowFilters] = useState(false);

  // Mock data based on HTML
  const nationalities = [
    { value: '359', label: 'Philippines', labelAr: 'الفلبين' },
    { value: '360', label: 'Kenya', labelAr: 'كينيا' },
    { value: '361', label: 'Uganda', labelAr: 'أوغندا' },
    { value: '362', label: 'India', labelAr: 'الهند' },
    { value: '363', label: 'Sudan', labelAr: 'السودان' },
    { value: '364', label: 'Egypt', labelAr: 'مصر' },
    { value: '365', label: 'Burundi', labelAr: 'بوروندي' },
    { value: '366', label: 'Bangladesh', labelAr: 'بنغلاديش' },
    { value: '367', label: 'Pakistan', labelAr: 'باكستان' },
    { value: '701', label: 'Sri Lanka', labelAr: 'سريلانكا' },
    { value: '731', label: 'Ethiopia', labelAr: 'إثيوبيا' },
    { value: '771', label: 'Indonesia', labelAr: 'إندونيسيا' },
  ];

  const agents: AgentData[] = Array.from({ length: 56 }, (_, i) => ({
    id: i + 1,
    name: `Agent ${i + 1}`,
    nameAr: `وكيل ${i + 1}`,
    email: `agent${i + 1}@sigma.sa`,
    licenseNumber: `0720412202${i}`,
    phone1: '63285258361',
    phone2: i % 2 === 0 ? '63285258362' : undefined,
    nationality: nationalities[i % nationalities.length].label,
    nationalityAr: nationalities[i % nationalities.length].labelAr,
    agentType: i % 2 === 0 ? 'mediation' : 'operation',
    contractsCount: Math.floor(Math.random() * 50),
    filesCount: Math.floor(Math.random() * 20),
    branchName: 'Sigma Competences Recruitment Office',
    branchNameAr: 'سيجما الكفاءات للاستقدام',
    isActive: i % 5 !== 0,
  }));

  const t = (key: string) => {
    const translations: { [key: string]: { ar: string; en: string } } = {
      pageTitle: { ar: 'إدارة الوكلاء', en: 'Agents Management' },
      addAgent: { ar: 'إضافة وكيل جديد', en: 'Add New Agent' },
      searchPlaceholder: { ar: 'البحث عن وكيل...', en: 'Search agents...' },
      filters: { ar: 'الفلاتر', en: 'Filters' },
      nationality: { ar: 'الجنسية', en: 'Nationality' },
      agentType: { ar: 'نوع الوكيل', en: 'Agent Type' },
      all: { ar: 'الكل', en: 'All' },
      mediation: { ar: 'توسط', en: 'Mediation' },
      operation: { ar: 'تشغيل', en: 'Operation' },
      totalAgents: { ar: 'إجمالي الوكلاء', en: 'Total Agents' },
      activeAgents: { ar: 'وكلاء نشطون', en: 'Active Agents' },
      totalContracts: { ar: 'إجمالي العقود', en: 'Total Contracts' },
      email: { ar: 'البريد الإلكتروني', en: 'Email' },
      licenseNumber: { ar: 'رقم الترخيص', en: 'License Number' },
      phone: { ar: 'الهاتف', en: 'Phone' },
      contracts: { ar: 'عقود', en: 'Contracts' },
      files: { ar: 'ملفات', en: 'Files' },
      view: { ar: 'عرض', en: 'View' },
      edit: { ar: 'تعديل', en: 'Edit' },
      delete: { ar: 'حذف', en: 'Delete' },
      actions: { ar: 'الإجراءات', en: 'Actions' },
      active: { ar: 'نشط', en: 'Active' },
      inactive: { ar: 'غير نشط', en: 'Inactive' },
      noAgents: { ar: 'لا توجد وكلاء', en: 'No Agents Found' },
      print: { ar: 'طباعة', en: 'Print' },
      export: { ar: 'تصدير', en: 'Export' },
      showingResults: { ar: 'عرض النتائج', en: 'Showing Results' },
    };
    return translations[key]?.[language] || key;
  };

  const filteredAgents = agents.filter((agent) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      (language === 'ar' ? agent.nameAr : agent.name).toLowerCase().includes(searchLower) ||
      agent.email.toLowerCase().includes(searchLower) ||
      agent.licenseNumber.includes(searchLower) ||
      (language === 'ar' ? agent.nationalityAr : agent.nationality)
        .toLowerCase()
        .includes(searchLower);

    const matchesNationality =
      selectedNationalities.length === 0 ||
      selectedNationalities.includes(
        nationalities.find(
          (n) => n.label === agent.nationality || n.labelAr === agent.nationalityAr
        )?.value || ''
      );

    const matchesType =
      selectedAgentType === 'all' ||
      (selectedAgentType === 'mediation' && agent.agentType === 'mediation') ||
      (selectedAgentType === 'operation' && agent.agentType === 'operation');

    return matchesSearch && matchesNationality && matchesType;
  });

  const paginatedAgents = filteredAgents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalContracts = agents.reduce((sum, agent) => sum + agent.contractsCount, 0);
  const activeAgentsCount = agents.filter((a) => a.isActive).length;

  const getActionMenu = (agent: AgentData): MenuProps => ({
    items: [
      {
        key: 'view',
        label: t('view'),
        icon: <EyeOutlined />,
        onClick: () => console.log('View', agent.id),
      },
      {
        key: 'edit',
        label: t('edit'),
        icon: <EditOutlined />,
        onClick: () => console.log('Edit', agent.id),
      },
      {
        type: 'divider',
      },
      {
        key: 'delete',
        label: t('delete'),
        icon: <DeleteOutlined />,
        danger: true,
        onClick: () => console.log('Delete', agent.id),
      },
    ],
  });

  const printMenu: MenuProps = {
    items: [
      {
        key: 'print',
        label: t('print'),
        icon: <PrinterOutlined />,
      },
      {
        key: 'export',
        label: t('export'),
        icon: <DownloadOutlined />,
      },
    ],
  };

  return (
    <div className={styles.agentsPage}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <UserOutlined className={styles.headerIcon} />
            <div>
              <h1 className={styles.pageTitle}>{t('pageTitle')}</h1>
              <p style={{ display: 'none' }} className={styles.pageSubtitle}>
                {t('showingResults')}: <strong>{filteredAgents.length}</strong>
              </p>
            </div>
          </div>
          <Space>
            <Dropdown menu={printMenu} trigger={['click']}>
              <Button icon={<PrinterOutlined />}>{t('print')}</Button>
            </Dropdown>
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              className={styles.addButton}
            >
              {t('addAgent')}
            </Button>
          </Space>
        </div>
      </div>

      {/* Stats Overview */}
      <Row gutter={[24, 24]} className={styles.statsRow}>
        <Col xs={24} sm={8}>
          <Card className={styles.statCard}>
            <Statistic
              title={t('totalAgents')}
              value={agents.length}
              prefix={<UserOutlined style={{ color: '#00478C' }} />}
              valueStyle={{ color: '#003366', fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className={styles.statCard}>
            <Statistic
              title={t('activeAgents')}
              value={activeAgentsCount}
              prefix={<UserOutlined style={{ color: '#00AA64' }} />}
              valueStyle={{ color: '#00AA64', fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className={styles.statCard}>
            <Statistic
              title={t('totalContracts')}
              value={totalContracts}
              prefix={<FileTextOutlined style={{ color: '#F59E0B' }} />}
              valueStyle={{ color: '#F59E0B', fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Search and Filters */}
      <Card className={styles.filterCard}>
        <Space vertical style={{ width: '100%' }} size={16}>
          <Space style={{ width: '100%', justifyContent: 'space-between' }} wrap>
            <Input
              size="large"
              placeholder={t('searchPlaceholder')}
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
              style={{ width: 300 }}
              allowClear
            />
            <Button
              icon={<FilterOutlined />}
              onClick={() => setShowFilters(!showFilters)}
              type={showFilters ? 'primary' : 'default'}
            >
              {t('filters')}
            </Button>
          </Space>

          {showFilters && (
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <label className={styles.filterLabel}>{t('nationality')}</label>
                <Select
                  mode="multiple"
                  size="large"
                  placeholder={t('nationality')}
                  value={selectedNationalities}
                  onChange={setSelectedNationalities}
                  style={{ width: '100%' }}
                  options={nationalities.map((n) => ({
                    value: n.value,
                    label: language === 'ar' ? n.labelAr : n.label,
                  }))}
                  allowClear
                />
              </Col>
              <Col xs={24} md={12}>
                <label className={styles.filterLabel}>{t('agentType')}</label>
                <Select
                  size="large"
                  value={selectedAgentType}
                  onChange={setSelectedAgentType}
                  style={{ width: '100%' }}
                  options={[
                    { value: 'all', label: t('all') },
                    { value: 'mediation', label: t('mediation') },
                    { value: 'operation', label: t('operation') },
                  ]}
                />
              </Col>
            </Row>
          )}
        </Space>
      </Card>

      {/* Agents Grid */}
      {paginatedAgents.length > 0 ? (
        <>
          <Row gutter={[24, 24]} className={styles.agentsGrid}>
            {paginatedAgents.map((agent) => (
              <Col xs={24} lg={12} key={agent.id}>
                <Card className={styles.agentCard} hoverable>
                  {/* Card Header */}
                  <div className={styles.cardHeader}>
                    <div className={styles.agentHeaderLeft}>
                      <Avatar size={56} icon={<UserOutlined />} className={styles.agentAvatar} />
                      <div className={styles.agentNameSection}>
                        <h3 className={styles.agentName}>
                          {language === 'ar' ? agent.nameAr : agent.name}
                        </h3>
                        <Space size={8} wrap>
                          <Tag
                            color={agent.agentType === 'mediation' ? 'blue' : 'green'}
                            className={styles.agentTag}
                          >
                            {agent.agentType === 'mediation' ? t('mediation') : t('operation')}
                          </Tag>
                          <Badge
                            status={agent.isActive ? 'success' : 'default'}
                            text={agent.isActive ? t('active') : t('inactive')}
                          />
                        </Space>
                      </div>
                    </div>
                    <Dropdown menu={getActionMenu(agent)} trigger={['click']}>
                      <Button type="text" icon={<MoreOutlined />} className={styles.actionButton} />
                    </Dropdown>
                  </div>

                  {/* Branch Info */}
                  <div className={styles.branchInfo}>
                    <GlobalOutlined className={styles.branchIcon} />
                    <span className={styles.branchText}>
                      {language === 'ar' ? agent.branchNameAr : agent.branchName}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className={styles.cardContent}>
                    {/* Email */}
                    <div className={styles.infoRow}>
                      <div className={styles.infoIcon}>
                        <MailOutlined />
                      </div>
                      <div className={styles.infoContent}>
                        <p className={styles.infoLabel}>{t('email')}</p>
                        <p className={styles.infoValue}>{agent.email}</p>
                      </div>
                    </div>

                    {/* License */}
                    <div className={styles.infoRow}>
                      <div className={styles.infoIcon}>
                        <SafetyCertificateOutlined />
                      </div>
                      <div className={styles.infoContent}>
                        <p className={styles.infoLabel}>{t('licenseNumber')}</p>
                        <p className={styles.infoValue}>{agent.licenseNumber}</p>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className={styles.infoRow}>
                      <div className={styles.infoIcon}>
                        <PhoneOutlined />
                      </div>
                      <div className={styles.infoContent}>
                        <p className={styles.infoLabel}>{t('phone')}</p>
                        <Space size={4} direction="vertical">
                          <p className={styles.infoValue}>{agent.phone1}</p>
                          {agent.phone2 && <p className={styles.infoValue}>{agent.phone2}</p>}
                        </Space>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className={styles.agentStats}>
                      <Tooltip title={t('contracts')}>
                        <div className={styles.statItem}>
                          <FileTextOutlined className={styles.statIcon} />
                          <span className={styles.statValue}>{agent.contractsCount}</span>
                          <span className={styles.statLabel}>{t('contracts')}</span>
                        </div>
                      </Tooltip>
                      <Tooltip title={t('files')}>
                        <div className={styles.statItem}>
                          <PaperClipOutlined className={styles.statIcon} />
                          <span className={styles.statValue}>{agent.filesCount}</span>
                          <span className={styles.statLabel}>{t('files')}</span>
                        </div>
                      </Tooltip>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className={styles.cardFooter}>
                    <Button
                      type="link"
                      icon={<EyeOutlined />}
                      onClick={() => console.log('View', agent.id)}
                    >
                      {t('view')}
                    </Button>
                    <Button
                      type="link"
                      icon={<EditOutlined />}
                      onClick={() => console.log('Edit', agent.id)}
                    >
                      {t('edit')}
                    </Button>
                    <Button
                      type="link"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => console.log('Delete', agent.id)}
                    >
                      {t('delete')}
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          <div className={styles.paginationWrapper}>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredAgents.length}
              onChange={(page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              }}
              showSizeChanger
              showTotal={(total) => `${t('totalAgents')}: ${total}`}
              pageSizeOptions={[10, 15, 20, 25, 50, 100]}
            />
          </div>
        </>
      ) : (
        <Card>
          <Empty description={t('noAgents')} />
        </Card>
      )}
    </div>
  );
}
