'use client';

import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Input,
  Tag,
  Avatar,
  Space,
  Dropdown,
  Badge,
  Empty,
  Tooltip,
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
  EnvironmentOutlined,
  SafetyCertificateOutlined,
  BankOutlined,
  FileProtectOutlined,
  ShopOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/store/authStore';
import styles from './Branch.module.css';

interface BranchData {
  id: number;
  name: string;
  nameAr: string;
  address: string;
  addressAr: string;
  phone?: string;
  mobile?: string;
  licenseId: string;
  tradingId: string;
  taxNumber: string;
  logoUrl?: string;
  isActive: boolean;
  branchType: string;
}

export default function BranchPage() {
  const language = useAuthStore((state) => state.language);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data based on HTML
  const branches: BranchData[] = [
    {
      id: 120,
      name: 'SIGMA',
      nameAr: 'مكتب سيجما للاستقدام',
      address: 'Jeddah - Sari Street - Al Bawadi District - Saudi Arabia',
      addressAr: 'جده - شارع صاري - حي البوادي - المملكة العربية السعودية',
      phone: '',
      mobile: '',
      licenseId: '41092024',
      tradingId: '4030365803',
      taxNumber: '312957255600003',
      logoUrl: '/images/logo.png',
      isActive: true,
      branchType: 'main',
    },
    {
      id: 107,
      name: 'Sigma Competences Recruitment Office',
      nameAr: 'سيجما الكفاءات للاستقدام',
      address: 'Saudi Arabia - Jeddah - Sari Street',
      addressAr: 'المملكة العربية السعودية - جدة - شارع صاري',
      phone: '920003692',
      mobile: '0556619911',
      licenseId: '3709201',
      tradingId: '4030287427',
      taxNumber: '312960652200003',
      logoUrl: '/images/logo.png',
      isActive: true,
      branchType: 'branch',
    },
  ];

  const t = (key: string) => {
    const translations: { [key: string]: { ar: string; en: string } } = {
      pageTitle: { ar: 'إدارة الفروع', en: 'Branch Management' },
      addBranch: { ar: 'إضافة فرع جديد', en: 'Add New Branch' },
      searchPlaceholder: { ar: 'البحث عن فرع...', en: 'Search branch...' },
      branchName: { ar: 'اسم الفرع', en: 'Branch Name' },
      address: { ar: 'العنوان', en: 'Address' },
      contactInfo: { ar: 'معلومات الاتصال', en: 'Contact Information' },
      phone: { ar: 'الهاتف', en: 'Phone' },
      mobile: { ar: 'الجوال', en: 'Mobile' },
      licenseId: { ar: 'رقم الترخيص', en: 'License ID' },
      tradingId: { ar: 'السجل التجاري', en: 'Trading ID' },
      taxNumber: { ar: 'الرقم الضريبي', en: 'Tax Number' },
      view: { ar: 'عرض', en: 'View' },
      edit: { ar: 'تعديل', en: 'Edit' },
      delete: { ar: 'حذف', en: 'Delete' },
      actions: { ar: 'الإجراءات', en: 'Actions' },
      active: { ar: 'نشط', en: 'Active' },
      mainBranch: { ar: 'الفرع الرئيسي', en: 'Main Branch' },
      subBranch: { ar: 'فرع', en: 'Branch' },
      noBranches: { ar: 'لا توجد فروع', en: 'No Branches Found' },
      totalBranches: { ar: 'إجمالي الفروع', en: 'Total Branches' },
    };
    return translations[key]?.[language] || key;
  };

  const filteredBranches = branches.filter((branch) => {
    const searchLower = searchTerm.toLowerCase();
    const name = language === 'ar' ? branch.nameAr : branch.name;
    const address = language === 'ar' ? branch.addressAr : branch.address;
    return (
      name.toLowerCase().includes(searchLower) ||
      address.toLowerCase().includes(searchLower) ||
      branch.licenseId.includes(searchLower) ||
      branch.taxNumber.includes(searchLower)
    );
  });

  const getActionMenu = (branch: BranchData): MenuProps => ({
    items: [
      {
        key: 'view',
        label: t('view'),
        icon: <EyeOutlined />,
        onClick: () => console.log('View', branch.id),
      },
      {
        key: 'edit',
        label: t('edit'),
        icon: <EditOutlined />,
        onClick: () => console.log('Edit', branch.id),
      },
      {
        type: 'divider',
      },
      {
        key: 'delete',
        label: t('delete'),
        icon: <DeleteOutlined />,
        danger: true,
        onClick: () => console.log('Delete', branch.id),
      },
    ],
  });

  return (
    <div className={styles.branchPage}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <ShopOutlined className={styles.headerIcon} />
            <div>
              <h1 className={styles.pageTitle}>{t('pageTitle')}</h1>
              <p className={styles.pageSubtitle}>
                {t('totalBranches')}: <strong>{branches.length}</strong>
              </p>
            </div>
          </div>
          <Button type="primary" size="large" icon={<PlusOutlined />} className={styles.addButton}>
            {t('addBranch')}
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className={styles.searchSection}>
        <Input
          size="large"
          placeholder={t('searchPlaceholder')}
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
          allowClear
        />
      </div>

      {/* Stats Overview */}
      <Row gutter={[24, 24]} className={styles.statsRow}>
        <Col xs={24} sm={12} md={8}>
          <Card className={styles.statCard}>
            <div className={styles.statContent}>
              <div className={styles.statIcon} style={{ background: '#E3F2FD' }}>
                <ShopOutlined style={{ color: '#00478C', fontSize: '24px' }} />
              </div>
              <div className={styles.statInfo}>
                <p className={styles.statLabel}>{t('totalBranches')}</p>
                <h3 className={styles.statValue}>{branches.length}</h3>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card className={styles.statCard}>
            <div className={styles.statContent}>
              <div className={styles.statIcon} style={{ background: '#E8F5E9' }}>
                <CheckCircleOutlined style={{ color: '#00AA64', fontSize: '24px' }} />
              </div>
              <div className={styles.statInfo}>
                <p className={styles.statLabel}>{t('active')}</p>
                <h3 className={styles.statValue}>{branches.filter((b) => b.isActive).length}</h3>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card className={styles.statCard}>
            <div className={styles.statContent}>
              <div className={styles.statIcon} style={{ background: '#FFF3E0' }}>
                <BankOutlined style={{ color: '#F59E0B', fontSize: '24px' }} />
              </div>
              <div className={styles.statInfo}>
                <p className={styles.statLabel}>{t('mainBranch')}</p>
                <h3 className={styles.statValue}>
                  {branches.filter((b) => b.branchType === 'main').length}
                </h3>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Branch Cards Grid */}
      {filteredBranches.length > 0 ? (
        <Row gutter={[24, 24]} className={styles.branchGrid}>
          {filteredBranches.map((branch) => (
            <Col xs={24} lg={12} key={branch.id}>
              <Card className={styles.branchCard} hoverable>
                {/* Card Header */}
                <div className={styles.cardHeader}>
                  <div className={styles.branchHeaderLeft}>
                    <Avatar
                      size={64}
                      src={branch.logoUrl}
                      icon={<ShopOutlined />}
                      className={styles.branchAvatar}
                    />
                    <div className={styles.branchNameSection}>
                      <h3 className={styles.branchName}>
                        {language === 'ar' ? branch.nameAr : branch.name}
                      </h3>
                      <Space size={8}>
                        {branch.isActive && <Badge status="success" text={t('active')} />}
                        <Tag
                          color={branch.branchType === 'main' ? 'blue' : 'default'}
                          className={styles.branchTag}
                        >
                          {branch.branchType === 'main' ? t('mainBranch') : t('subBranch')}
                        </Tag>
                      </Space>
                    </div>
                  </div>
                  <Dropdown menu={getActionMenu(branch)} trigger={['click']}>
                    <Button type="text" icon={<MoreOutlined />} className={styles.actionButton} />
                  </Dropdown>
                </div>

                {/* Card Content */}
                <div className={styles.cardContent}>
                  {/* Address */}
                  <div className={styles.infoRow}>
                    <div className={styles.infoIcon}>
                      <EnvironmentOutlined />
                    </div>
                    <div className={styles.infoContent}>
                      <p className={styles.infoLabel}>{t('address')}</p>
                      <p className={styles.infoValue}>
                        {language === 'ar' ? branch.addressAr : branch.address}
                      </p>
                    </div>
                  </div>

                  {/* Contact Information */}
                  {(branch.phone || branch.mobile) && (
                    <div className={styles.infoRow}>
                      <div className={styles.infoIcon}>
                        <PhoneOutlined />
                      </div>
                      <div className={styles.infoContent}>
                        <p className={styles.infoLabel}>{t('contactInfo')}</p>
                        <Space direction="vertical" size={4}>
                          {branch.phone && (
                            <p className={styles.infoValue}>
                              {t('phone')}: {branch.phone}
                            </p>
                          )}
                          {branch.mobile && (
                            <p className={styles.infoValue}>
                              {t('mobile')}: {branch.mobile}
                            </p>
                          )}
                        </Space>
                      </div>
                    </div>
                  )}

                  {/* Official Documents */}
                  <div className={styles.documentsSection}>
                    <Row gutter={[12, 12]}>
                      <Col span={24}>
                        <Tooltip title={t('licenseId')}>
                          <div className={styles.documentItem}>
                            <SafetyCertificateOutlined className={styles.docIcon} />
                            <div>
                              <p className={styles.docLabel}>{t('licenseId')}</p>
                              <p className={styles.docValue}>{branch.licenseId}</p>
                            </div>
                          </div>
                        </Tooltip>
                      </Col>
                      <Col span={24}>
                        <Tooltip title={t('tradingId')}>
                          <div className={styles.documentItem}>
                            <BankOutlined className={styles.docIcon} />
                            <div>
                              <p className={styles.docLabel}>{t('tradingId')}</p>
                              <p className={styles.docValue}>{branch.tradingId}</p>
                            </div>
                          </div>
                        </Tooltip>
                      </Col>
                      <Col span={24}>
                        <Tooltip title={t('taxNumber')}>
                          <div className={styles.documentItem}>
                            <FileProtectOutlined className={styles.docIcon} />
                            <div>
                              <p className={styles.docLabel}>{t('taxNumber')}</p>
                              <p className={styles.docValue}>{branch.taxNumber}</p>
                            </div>
                          </div>
                        </Tooltip>
                      </Col>
                    </Row>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className={styles.cardFooter}>
                  <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() => console.log('View', branch.id)}
                  >
                    {t('view')}
                  </Button>
                  <Button
                    type="link"
                    icon={<EditOutlined />}
                    onClick={() => console.log('Edit', branch.id)}
                  >
                    {t('edit')}
                  </Button>
                  <Button
                    type="link"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => console.log('Delete', branch.id)}
                  >
                    {t('delete')}
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Card>
          <Empty description={t('noBranches')} />
        </Card>
      )}
    </div>
  );
}
