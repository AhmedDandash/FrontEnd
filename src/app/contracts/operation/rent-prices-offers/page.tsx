'use client';

import React, { useState, useMemo } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Select,
  Spin,
  Empty,
  Table,
  Tag,
  Space,
  Collapse,
  Dropdown,
  Tooltip,
} from 'antd';
import type { MenuProps, TableColumnsType } from 'antd';
import {
  DollarOutlined,
  SearchOutlined,
  PlusOutlined,
  EyeOutlined,
  FilterOutlined,
  FileTextOutlined,
  ShopOutlined,
  GlobalOutlined,
  DownOutlined,
  GiftOutlined,
  AppstoreOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useEmploymentContractOffers } from '@/hooks/api/useEmploymentContractOffers';
import { useBranches } from '@/hooks/api/useBranches';
import type { EmploymentContractOfferSummary } from '@/types/api.types';
import styles from './RentPricesOffers.module.css';

export default function RentPricesOffersPage() {
  const language = useAuthStore((state) => state.language);
  const [searchText, setSearchText] = useState('');
  const [nationalityFilter, setNationalityFilter] = useState<string>('all');
  const [jobFilter, setJobFilter] = useState<string>('all');
  const [branchFilter, setBranchFilter] = useState<string>('all');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const { summary, isSummaryLoading, refetchSummary } = useEmploymentContractOffers();

  const { branches } = useBranches();

  const t = (key: string) => {
    const translations: { [key: string]: { ar: string; en: string } } = {
      pageTitle: { ar: 'Ø¹Ø±ÙˆØ¶ Ùˆ Ø§Ø³Ø¹Ø§Ø± Ø§Ù„ØªØ´ØºÙŠÙ„', en: 'Operating Prices & Offers' },
      totalOffers: { ar: 'Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ø¹Ø±ÙˆØ¶', en: 'Total Offers' },
      searchPlaceholder: { ar: 'Ø§Ù„Ø¨Ø­Ø« Ø¹Ù† Ø¹Ø±Ø¶...', en: 'Search offers...' },
      searchFilters: { ar: 'ÙÙ„Ø§ØªØ± Ø§Ù„Ø¨Ø­Ø«', en: 'Search Filters' },
      nationality: { ar: 'Ø§Ù„Ø¬Ù†Ø³ÙŠØ©', en: 'Nationality' },
      job: { ar: 'Ø§Ù„ÙˆØ¸ÙŠÙØ©', en: 'Job' },
      branch: { ar: 'Ø§Ù„ÙØ±Ø¹', en: 'Branch' },
      branchName: { ar: 'Ø§Ø³Ù… Ø§Ù„ÙØ±Ø¹', en: 'Branch Name' },
      nationalities: { ar: 'Ø§Ù„Ø¬Ù†Ø³ÙŠØ§Øª', en: 'Nationalities' },
      availableOffers: { ar: 'Ø¹Ø¯Ø¯ Ø§Ù„Ø¹Ø±ÙˆØ¶ Ø§Ù„Ù…ØªØ§Ø­Ø©', en: 'Available Offers' },
      offersAndPrices: { ar: 'Ø§Ù„Ø¹Ø±ÙˆØ¶ ÙˆØ§Ù„Ø§Ø³Ø¹Ø§Ø±', en: 'Offers & Prices' },
      addOffer: { ar: 'Ø¥Ø¶Ø§ÙØ© Ø¹Ø±ÙˆØ¶ Ùˆ Ø§Ø³Ø¹Ø§Ø± Ø§Ù„ØªØ´ØºÙŠÙ„', en: 'Add Operating Offers & Prices' },
      addSpecialOffer: { ar: 'Ø¥Ø¶Ø§ÙØ© Ø¹Ø±ÙˆØ¶ Ø®Ø§ØµØ©', en: 'Add Special Offers' },
      addPackageOffer: { ar: 'Ø¥Ø¶Ø§ÙØ© Ø¹Ø±ÙˆØ¶ Ø§Ù„Ø¨Ø§Ù‚Ø§Øª', en: 'Add Package Offers' },
      duration: { ar: 'Ù…Ø¯Ø©', en: 'Duration' },
      serviceTransfer: { ar: 'Ù†Ù‚Ù„ Ø§Ù„Ø®Ø¯Ù…Ø§Øª', en: 'Service Transfer' },
      dailyDuration: { ar: 'Ù…Ø¯Ø© (Ø¹Ù‚ÙˆØ¯ ÙŠÙˆÙ…ÙŠØ©)', en: 'Duration (Daily Contracts)' },
      dailyServiceTransfer: { ar: 'Ù†Ù‚Ù„ Ø§Ù„Ø®Ø¯Ù…Ø§Øª (Ø¹Ù‚ÙˆØ¯ ÙŠÙˆÙ…ÙŠØ©)', en: 'Service Transfer (Daily)' },
      viewDetails: { ar: 'Ø¹Ø±Ø¶ Ø§Ù„ØªÙØ§ØµÙŠÙ„', en: 'View Details' },
      all: { ar: 'Ø§Ù„ÙƒÙ„', en: 'All' },
      allBranches: { ar: 'ÙƒÙ„ Ø§Ù„ÙØ±ÙˆØ¹', en: 'All Branches' },
      search: { ar: 'Ø¨Ø­Ø«', en: 'Search' },
      cancel: { ar: 'Ø¥Ù„ØºØ§Ø¡', en: 'Cancel' },
      refresh: { ar: 'ØªØ­Ø¯ÙŠØ«', en: 'Refresh' },
      noData: { ar: 'Ù„Ø§ ØªÙˆØ¬Ø¯ Ø¹Ø±ÙˆØ¶', en: 'No Offers Found' },
      total: { ar: 'Ø§Ù„Ø¹Ø¯Ø¯', en: 'Total' },
      shown: { ar: 'Ø§Ù„Ù…Ø¹Ø±ÙˆØ¶', en: 'Shown' },
      index: { ar: '#', en: '#' },
    };
    return translations[key]?.[language] || key;
  };

  // Static nationality options (from HTML reference)
  const nationalityOptions = [
    { value: 359, label: { ar: 'Ø§Ù„ÙÙ„Ø¨ÙŠÙ†', en: 'Philippines' } },
    { value: 360, label: { ar: 'ÙƒÙŠÙ†ÙŠØ§', en: 'Kenya' } },
    { value: 361, label: { ar: 'Ø£ÙˆØºÙ†Ø¯Ø§', en: 'Uganda' } },
    { value: 362, label: { ar: 'Ø§Ù„Ù‡Ù†Ø¯', en: 'India' } },
    { value: 363, label: { ar: 'Ø§Ù„Ø³ÙˆØ¯Ø§Ù†', en: 'Sudan' } },
    { value: 364, label: { ar: 'Ù…ØµØ±', en: 'Egypt' } },
    { value: 365, label: { ar: 'Ø¨ÙˆØ±ÙˆÙ†Ø¯ÙŠ', en: 'Burundi' } },
    { value: 366, label: { ar: 'Ø¨Ù†Ø¬Ù„Ø§Ø¯Ø´', en: 'Bangladesh' } },
    { value: 367, label: { ar: 'Ø¨Ø§ÙƒØ³ØªØ§Ù†', en: 'Pakistan' } },
    { value: 482, label: { ar: 'Ø§Ù„Ù…ØºØ±Ø¨', en: 'Morocco' } },
    { value: 701, label: { ar: 'Ø³Ø±ÙŠÙ„Ø§Ù†ÙƒØ§', en: 'Sri Lanka' } },
    { value: 731, label: { ar: 'Ø£Ø«ÙŠÙˆØ¨ÙŠØ§', en: 'Ethiopia' } },
    { value: 771, label: { ar: 'Ø£Ù†Ø¯ÙˆÙ†ÙŠØ³ÙŠØ§', en: 'Indonesia' } },
    { value: 839, label: { ar: 'Ø§Ù„ÙŠÙ…Ù†', en: 'Yemen' } },
  ];

  // Static job options (from HTML reference)
  const jobOptions = [
    { value: 1198, label: { ar: 'Ø¹Ø§Ù…Ù„Ø© Ù…Ù†Ø²Ù„ÙŠØ©', en: 'Housemaid' } },
    { value: 1199, label: { ar: 'Ø³Ø§Ø¦Ù‚ Ø®Ø§Øµ', en: 'Private Driver' } },
    { value: 1210, label: { ar: 'Ø³ÙØ±Ø¬ÙŠ Ù…Ù†Ø²Ù„ÙŠ', en: 'Home Butler' } },
    { value: 1212, label: { ar: 'Ù…Ù…Ø±Ø¶Ù‡ Ù…Ù†Ø²Ù„ÙŠÙ‡', en: 'Home Nurse' } },
    { value: 1246, label: { ar: 'Ø·Ø¨Ø§Ø®', en: 'Cook' } },
    { value: 1293, label: { ar: 'Ø¹Ø§Ù…Ù„ Ù…Ù†Ø²Ù„ÙŠ', en: 'Houseboy' } },
    { value: 1522, label: { ar: 'Ù‚Ù‡ÙˆØ¬ÙŠ Ù…Ù†Ø²Ù„ÙŠ', en: 'Home Coffee Maker' } },
    { value: 1568, label: { ar: 'Ø­Ø§Ø±Ø³ Ù…Ù†Ø²Ù„ÙŠ', en: 'Home Guard' } },
    { value: 1602, label: { ar: 'Ù…Ø²Ø§Ø±Ø¹ Ù…Ù†Ø²Ù„ÙŠ', en: 'Home Farmer' } },
    { value: 1616, label: { ar: 'Ù…Ø¯ÙŠØ± Ù…Ù†Ø²Ù„', en: 'House Manager' } },
  ];

  const getNationalityLabel = (id: number | null | undefined) => {
    if (!id || id === 0) return t('all');
    const nat = nationalityOptions.find((n) => n.value === id);
    return nat ? nat.label[language] : String(id);
  };

  const getJobLabel = (id: number | null | undefined) => {
    if (!id || id === 0) return t('all');
    const job = jobOptions.find((j) => j.value === id);
    return job ? job.label[language] : String(id);
  };

  // Helper to safely extract array from summary data
  const summaryData = useMemo((): EmploymentContractOfferSummary[] => {
    if (!summary) return [];
    // Handle case where summary is already an array
    if (Array.isArray(summary)) return summary;
    // Handle case where summary is an object with data property
    if (typeof summary === 'object' && 'data' in summary && Array.isArray((summary as any).data)) {
      return (summary as any).data;
    }
    // Handle case where summary is an object with items property
    if (
      typeof summary === 'object' &&
      'items' in summary &&
      Array.isArray((summary as any).items)
    ) {
      return (summary as any).items;
    }
    return [];
  }, [summary]);

  // Filter summary data
  const filteredSummary = useMemo(() => {
    return summaryData.filter((item) => {
      const matchesNationality =
        nationalityFilter === 'all' || String(item.nationalityId) === nationalityFilter;
      const matchesJob = jobFilter === 'all' || String(item.jobId) === jobFilter;
      const matchesBranch = branchFilter === 'all' || String(item.branchId) === branchFilter;
      const matchesSearch =
        searchText === '' ||
        (item.nationalityName || '').toLowerCase().includes(searchText.toLowerCase()) ||
        (item.jobName || '').toLowerCase().includes(searchText.toLowerCase()) ||
        (item.branchName || '').toLowerCase().includes(searchText.toLowerCase());
      return matchesNationality && matchesJob && matchesBranch && matchesSearch;
    });
  }, [summaryData, nationalityFilter, jobFilter, branchFilter, searchText]);

  // Table columns
  const columns: TableColumnsType<EmploymentContractOfferSummary> = [
    {
      title: t('index'),
      dataIndex: 'index',
      key: 'index',
      width: 60,
      align: 'center',
      render: (_: any, __: any, index: number) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: t('branchName'),
      dataIndex: 'branchName',
      key: 'branchName',
      render: (text: string) => text || t('allBranches'),
    },
    {
      title: t('nationalities'),
      dataIndex: 'nationalityName',
      key: 'nationalityName',
      render: (text: string, record: EmploymentContractOfferSummary) =>
        text || getNationalityLabel(record.nationalityId),
    },
    {
      title: t('job'),
      dataIndex: 'jobName',
      key: 'jobName',
      render: (text: string, record: EmploymentContractOfferSummary) =>
        text || getJobLabel(record.jobId),
    },
    {
      title: t('availableOffers'),
      dataIndex: 'availableOffersCount',
      key: 'availableOffersCount',
      align: 'center',
      render: (_count: number, record: EmploymentContractOfferSummary) => (
        <Tag color="blue" style={{ fontSize: '14px', padding: '4px 12px' }}>
          {record.availableOffersCount || record.offersCount || 0}
        </Tag>
      ),
    },
    {
      title: '',
      key: 'actions',
      align: 'center',
      width: 80,
      render: (_: any, record: EmploymentContractOfferSummary) => (
        <Tooltip title={t('viewDetails')}>
          <Link
            href={`/contracts/operation/rent-prices-offers/details?nationalityId=${record.nationalityId || 0}&jobId=${record.jobId || 0}&branchId=${record.branchId || 0}`}
          >
            <Button type="link" icon={<EyeOutlined style={{ fontSize: '20px' }} />} />
          </Link>
        </Tooltip>
      ),
    },
  ];

  // Dropdown for add offer types
  const addOfferMenuItems: MenuProps['items'] = [
    {
      key: 'duration-1',
      label: <Link href="/contracts/operation/rent-prices-offers/add?type=1">{t('duration')}</Link>,
    },
    {
      key: 'transfer-3',
      label: <Link href="/contracts/operation/rent-prices-offers/add?type=3">{t('serviceTransfer')}</Link>,
    },
    {
      key: 'daily-duration-5',
      label: <Link href="/contracts/operation/rent-prices-offers/add?type=5">{t('dailyDuration')}</Link>,
    },
    {
      key: 'daily-transfer-3d',
      label: (
        <Link href="/contracts/operation/rent-prices-offers/add?type=3&daily=true">
          {t('dailyServiceTransfer')}
        </Link>
      ),
    },
  ];

  const addSpecialOfferMenuItems: MenuProps['items'] = [
    {
      key: 'special-duration-1',
      label: <Link href="/contracts/operation/rent-prices-offers/add-offer?type=1">{t('duration')}</Link>,
    },
    {
      key: 'special-transfer-3',
      label: (
        <Link href="/contracts/operation/rent-prices-offers/add-offer?type=3">{t('serviceTransfer')}</Link>
      ),
    },
  ];

  const addPackageMenuItems: MenuProps['items'] = [
    {
      key: 'package-duration-1',
      label: <Link href="/contracts/operation/rent-prices-offers/add-package?type=1">{t('duration')}</Link>,
    },
    {
      key: 'package-transfer-3',
      label: (
        <Link href="/contracts/operation/rent-prices-offers/add-package?type=3">{t('serviceTransfer')}</Link>
      ),
    },
  ];

  const resetFilters = () => {
    setNationalityFilter('all');
    setJobFilter('all');
    setBranchFilter('all');
    setSearchText('');
  };

  return (
    <div className={styles.offersPage}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <DollarOutlined className={styles.headerIcon} />
            <div>
              <h1 className={styles.pageTitle}>{t('pageTitle')}</h1>
              <p className={styles.pageSubtitle}>
                {t('totalOffers')}: <strong>{summaryData.length}</strong>
              </p>
            </div>
          </div>
          <div className={styles.headerActions}>
            <Dropdown menu={{ items: addOfferMenuItems }} trigger={['click']}>
              <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                className={styles.addButton}
              >
                {t('addOffer')} <DownOutlined />
              </Button>
            </Dropdown>
            <Dropdown menu={{ items: addSpecialOfferMenuItems }} trigger={['click']}>
              <Button
                size="large"
                icon={<GiftOutlined />}
                className={styles.specialOfferButton}
                style={{ background: '#17a2b8', color: '#fff', border: 'none' }}
              >
                {t('addSpecialOffer')} <DownOutlined />
              </Button>
            </Dropdown>
            <Dropdown menu={{ items: addPackageMenuItems }} trigger={['click']}>
              <Button
                type="primary"
                size="large"
                icon={<AppstoreOutlined />}
                className={styles.packageButton}
              >
                {t('addPackageOffer')} <DownOutlined />
              </Button>
            </Dropdown>
          </div>
        </div>
      </div>

      {/* Search Filters */}
      <Card className={styles.filterPanel}>
        <Collapse
          ghost
          defaultActiveKey={[]}
          items={[
            {
              key: '1',
              label: (
                <Space>
                  <FilterOutlined />
                  {t('searchFilters')}
                </Space>
              ),
              children: (
                <>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={8}>
                      <div style={{ marginBottom: 8, fontWeight: 500 }}>{t('nationality')}</div>
                      <Select
                        mode="multiple"
                        allowClear
                        style={{ width: '100%' }}
                        placeholder={t('nationality')}
                        showSearch
                        optionFilterProp="label"
                        value={nationalityFilter === 'all' ? [] : [nationalityFilter]}
                        onChange={(values) =>
                          setNationalityFilter(
                            values.length > 0 ? values[values.length - 1] : 'all'
                          )
                        }
                        options={nationalityOptions.map((n) => ({
                          value: String(n.value),
                          label: n.label[language],
                        }))}
                      />
                    </Col>
                    <Col xs={24} md={8}>
                      <div style={{ marginBottom: 8, fontWeight: 500 }}>{t('job')}</div>
                      <Select
                        mode="multiple"
                        allowClear
                        style={{ width: '100%' }}
                        placeholder={t('job')}
                        showSearch
                        optionFilterProp="label"
                        value={jobFilter === 'all' ? [] : [jobFilter]}
                        onChange={(values) =>
                          setJobFilter(values.length > 0 ? values[values.length - 1] : 'all')
                        }
                        options={jobOptions.map((j) => ({
                          value: String(j.value),
                          label: j.label[language],
                        }))}
                      />
                    </Col>
                    <Col xs={24} md={8}>
                      <div style={{ marginBottom: 8, fontWeight: 500 }}>{t('branch')}</div>
                      <Select
                        mode="multiple"
                        allowClear
                        style={{ width: '100%' }}
                        placeholder={t('branch')}
                        showSearch
                        optionFilterProp="label"
                        value={branchFilter === 'all' ? [] : [branchFilter]}
                        onChange={(values) =>
                          setBranchFilter(values.length > 0 ? values[values.length - 1] : 'all')
                        }
                        options={(branches || []).map((b) => ({
                          value: String(b.id),
                          label: language === 'ar' ? b.nameAr : b.nameEn,
                        }))}
                      />
                    </Col>
                  </Row>
                  <div className={styles.filterActions}>
                    <Button type="primary" icon={<SearchOutlined />}>
                      {t('search')}
                    </Button>
                    <Button icon={<ReloadOutlined />} onClick={resetFilters}>
                      {t('cancel')}
                    </Button>
                  </div>
                </>
              ),
            },
          ]}
        />
      </Card>

      {/* Stats Row */}
      <Row gutter={[24, 24]} className={styles.statsRow}>
        <Col xs={24} sm={12} md={8}>
          <Card className={styles.statCard}>
            <div className={styles.statContent}>
              <div className={styles.statIcon} style={{ background: '#E3F2FD' }}>
                <FileTextOutlined style={{ color: '#00478C', fontSize: '24px' }} />
              </div>
              <div
                className={styles.statInfo}
                style={{ textAlign: language === 'ar' ? 'right' : 'left' }}
              >
                <p className={styles.statLabel}>{t('totalOffers')}</p>
                <h3 className={styles.statValue}>{summaryData.length}</h3>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card className={styles.statCard}>
            <div className={styles.statContent}>
              <div className={styles.statIcon} style={{ background: '#E8F5E9' }}>
                <GlobalOutlined style={{ color: '#00AA64', fontSize: '24px' }} />
              </div>
              <div
                className={styles.statInfo}
                style={{ textAlign: language === 'ar' ? 'right' : 'left' }}
              >
                <p className={styles.statLabel}>{t('nationalities')}</p>
                <h3 className={styles.statValue}>
                  {new Set(summaryData.map((s) => s.nationalityId).filter(Boolean)).size}
                </h3>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card className={styles.statCard}>
            <div className={styles.statContent}>
              <div className={styles.statIcon} style={{ background: '#FFF3E0' }}>
                <ShopOutlined style={{ color: '#F59E0B', fontSize: '24px' }} />
              </div>
              <div
                className={styles.statInfo}
                style={{ textAlign: language === 'ar' ? 'right' : 'left' }}
              >
                <p className={styles.statLabel}>{t('branch')}</p>
                <h3 className={styles.statValue}>
                  {new Set(summaryData.map((s) => s.branchId).filter(Boolean)).size}
                </h3>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Main Data Table */}
      <Card
        className={styles.tableCard}
        title={t('offersAndPrices')}
        extra={
          <Space>
            <Select
              value={pageSize}
              onChange={(value) => setPageSize(value)}
              style={{ width: 80 }}
              options={[
                { value: 10, label: '10' },
                { value: 15, label: '15' },
                { value: 20, label: '20' },
                { value: 25, label: '25' },
                { value: 50, label: '50' },
                { value: 100, label: '100' },
              ]}
            />
            <Button icon={<ReloadOutlined />} onClick={() => refetchSummary()} type="text" />
          </Space>
        }
      >
        {isSummaryLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <Spin size="large" />
          </div>
        ) : filteredSummary.length > 0 ? (
          <Table
            dataSource={filteredSummary}
            columns={columns}
            rowKey={(record, index) =>
              `${record.nationalityId}-${record.jobId}-${record.branchId}-${index}`
            }
            pagination={{
              current: currentPage,
              pageSize,
              total: filteredSummary.length,
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              },
              showTotal: (total, range) =>
                `${t('total')} ${total} . ${t('shown')} ${range[1] - range[0] + 1}`,
              showSizeChanger: false,
            }}
            bordered
            size="middle"
          />
        ) : (
          <Empty description={t('noData')} />
        )}
      </Card>
    </div>
  );
}

