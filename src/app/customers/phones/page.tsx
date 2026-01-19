'use client';

import React, { useState, useMemo } from 'react';
import {
  Card,
  Row,
  Col,
  Tag,
  Button,
  Input,
  Select,
  Statistic,
  Dropdown,
  message,
  Avatar,
  Tooltip,
  Empty,
  Modal,
  Form,
} from 'antd';
import {
  PhoneOutlined,
  SearchOutlined,
  PlusOutlined,
  WhatsAppOutlined,
  EditOutlined,
  DeleteOutlined,
  PrinterOutlined,
  CopyOutlined,
  UserOutlined,
  MobileOutlined,
  HomeOutlined,
  GlobalOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  MoreOutlined,
  DownloadOutlined,
  UploadOutlined,
  SyncOutlined,
  MessageOutlined,
} from '@ant-design/icons';

import { useAuthStore } from '@/store/authStore';
import styles from './CustomerPhones.module.css';

interface CustomerPhone {
  id: string;
  customerId: string;
  customerName: string;
  customerNameAr: string;
  phoneNumber: string;
  phoneType: 'mobile' | 'landline' | 'work' | 'home';
  isPrimary: boolean;
  isVerified: boolean;
  isWhatsApp: boolean;
  countryCode: string;
  createdAt: string;
  lastContactedAt: string;
  notes: string;
  notesAr: string;
}

// Mock data for customer phones
const mockPhones: CustomerPhone[] = Array.from({ length: 35 }, (_, i) => ({
  id: `phone-${i + 1}`,
  customerId: `cust-${Math.floor(i / 2) + 1}`,
  customerName: [
    'Ahmed Al-Rashid',
    'Fatima Hassan',
    'Mohammed Al-Qahtani',
    'Sara Abdullah',
    'Khalid Ibrahim',
    'Nora Al-Saud',
    'Omar Mansour',
    'Layla Ahmed',
    'Youssef Al-Harbi',
    'Hana Mahmoud',
    'Ali Al-Dosari',
    'Mona Saleh',
    'Hassan Al-Otaibi',
    'Reem Al-Fahad',
    'Ibrahim Nasser',
    'Dina Al-Rasheed',
    'Faisal Al-Mutairi',
    'Amal Khaled',
  ][i % 18],
  customerNameAr: [
    'أحمد الراشد',
    'فاطمة حسن',
    'محمد القحطاني',
    'سارة عبدالله',
    'خالد إبراهيم',
    'نورة آل سعود',
    'عمر منصور',
    'ليلى أحمد',
    'يوسف الحربي',
    'هناء محمود',
    'علي الدوسري',
    'منى صالح',
    'حسن العتيبي',
    'ريم الفهد',
    'إبراهيم ناصر',
    'دينا الرشيد',
    'فيصل المطيري',
    'أمل خالد',
  ][i % 18],
  phoneNumber: `05${Math.floor(Math.random() * 9)}${String(Math.floor(Math.random() * 10000000)).padStart(7, '0')}`,
  phoneType: (['mobile', 'landline', 'work', 'home'] as const)[i % 4],
  isPrimary: i % 3 === 0,
  isVerified: Math.random() > 0.3,
  isWhatsApp: Math.random() > 0.4,
  countryCode: '+966',
  createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
  lastContactedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  notes: 'Contact during business hours',
  notesAr: 'التواصل خلال ساعات العمل',
}));

export default function CustomerPhonesPage() {
  const language = useAuthStore((state) => state.language);
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [verifiedFilter, setVerifiedFilter] = useState<string>('all');
  const [whatsappFilter, setWhatsappFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [form] = Form.useForm();

  // Translations
  const t = {
    pageTitle: language === 'ar' ? 'أرقام العملاء' : 'Customer Phone Numbers',
    pageSubtitle: language === 'ar' ? 'إدارة أرقام هواتف العملاء' : 'Manage customer phone numbers',
    addPhone: language === 'ar' ? 'إضافة رقم' : 'Add Phone',
    addFromExcel: language === 'ar' ? 'إضافة من إكسل' : 'Add from Excel',
    exportExcel: language === 'ar' ? 'تصدير إكسل' : 'Export Excel',
    print: language === 'ar' ? 'طباعة' : 'Print',
    search:
      language === 'ar'
        ? 'بحث برقم الهاتف أو اسم العميل...'
        : 'Search by phone or customer name...',
    allTypes: language === 'ar' ? 'جميع الأنواع' : 'All Types',
    mobile: language === 'ar' ? 'جوال' : 'Mobile',
    landline: language === 'ar' ? 'أرضي' : 'Landline',
    work: language === 'ar' ? 'عمل' : 'Work',
    home: language === 'ar' ? 'منزل' : 'Home',
    allVerification: language === 'ar' ? 'جميع الحالات' : 'All Status',
    verified: language === 'ar' ? 'موثق' : 'Verified',
    notVerified: language === 'ar' ? 'غير موثق' : 'Not Verified',
    allWhatsapp: language === 'ar' ? 'الكل' : 'All',
    hasWhatsapp: language === 'ar' ? 'لديه واتساب' : 'Has WhatsApp',
    noWhatsapp: language === 'ar' ? 'بدون واتساب' : 'No WhatsApp',
    totalPhones: language === 'ar' ? 'إجمالي الأرقام' : 'Total Numbers',
    verifiedPhones: language === 'ar' ? 'أرقام موثقة' : 'Verified Numbers',
    whatsappPhones: language === 'ar' ? 'أرقام واتساب' : 'WhatsApp Numbers',
    primaryPhones: language === 'ar' ? 'أرقام أساسية' : 'Primary Numbers',
    copy: language === 'ar' ? 'نسخ' : 'Copy',
    copied: language === 'ar' ? 'تم النسخ' : 'Copied',
    edit: language === 'ar' ? 'تعديل' : 'Edit',
    delete: language === 'ar' ? 'حذف' : 'Delete',
    sendSMS: language === 'ar' ? 'إرسال رسالة' : 'Send SMS',
    call: language === 'ar' ? 'اتصال' : 'Call',
    whatsapp: language === 'ar' ? 'واتساب' : 'WhatsApp',
    primary: language === 'ar' ? 'أساسي' : 'Primary',
    lastContact: language === 'ar' ? 'آخر تواصل' : 'Last Contact',
    noResults: language === 'ar' ? 'لا توجد نتائج' : 'No results found',
    deleteConfirm:
      language === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete?',
  };

  // Filter phones
  const filteredPhones = useMemo(() => {
    return mockPhones.filter((phone) => {
      const searchLower = searchText.toLowerCase();
      const matchesSearch =
        !searchText ||
        phone.phoneNumber.includes(searchText) ||
        phone.customerName.toLowerCase().includes(searchLower) ||
        phone.customerNameAr.includes(searchText);

      const matchesType = typeFilter === 'all' || phone.phoneType === typeFilter;
      const matchesVerified =
        verifiedFilter === 'all' ||
        (verifiedFilter === 'verified' && phone.isVerified) ||
        (verifiedFilter === 'not-verified' && !phone.isVerified);
      const matchesWhatsapp =
        whatsappFilter === 'all' ||
        (whatsappFilter === 'has' && phone.isWhatsApp) ||
        (whatsappFilter === 'no' && !phone.isWhatsApp);

      return matchesSearch && matchesType && matchesVerified && matchesWhatsapp;
    });
  }, [searchText, typeFilter, verifiedFilter, whatsappFilter]);

  // Statistics
  const stats = useMemo(
    () => ({
      total: mockPhones.length,
      verified: mockPhones.filter((p) => p.isVerified).length,
      whatsapp: mockPhones.filter((p) => p.isWhatsApp).length,
      primary: mockPhones.filter((p) => p.isPrimary).length,
    }),
    []
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success(t.copied);
  };

  const getPhoneTypeIcon = (type: string) => {
    switch (type) {
      case 'mobile':
        return <MobileOutlined />;
      case 'landline':
        return <HomeOutlined />;
      case 'work':
        return <GlobalOutlined />;
      case 'home':
        return <HomeOutlined />;
      default:
        return <PhoneOutlined />;
    }
  };

  const getPhoneTypeLabel = (type: string) => {
    switch (type) {
      case 'mobile':
        return t.mobile;
      case 'landline':
        return t.landline;
      case 'work':
        return t.work;
      case 'home':
        return t.home;
      default:
        return type;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDelete = (_id: string) => {
    // TODO: Implement API call
    message.success(language === 'ar' ? 'تم الحذف بنجاح' : 'Deleted successfully');
  };

  const renderPhoneCard = (phone: CustomerPhone) => (
    <Col xs={24} sm={12} lg={8} xl={6} key={phone.id}>
      <Card className={styles.phoneCard} hoverable>
        {/* Card Header */}
        <div className={styles.cardHeader}>
          <div className={styles.customerInfo}>
            <Avatar size={44} icon={<UserOutlined />} className={styles.customerAvatar} />
            <div className={styles.customerDetails}>
              <span className={styles.customerName}>
                {language === 'ar' ? phone.customerNameAr : phone.customerName}
              </span>
              {phone.isPrimary && (
                <Tag color="gold" className={styles.primaryTag}>
                  {t.primary}
                </Tag>
              )}
            </div>
          </div>
          <Dropdown
            menu={{
              items: [
                { key: 'edit', label: t.edit, icon: <EditOutlined /> },
                { key: 'sms', label: t.sendSMS, icon: <MessageOutlined /> },
                { type: 'divider' as const },
                { key: 'delete', label: t.delete, icon: <DeleteOutlined />, danger: true },
              ],
              onClick: ({ key }) => {
                if (key === 'delete') handleDelete(phone.id);
              },
            }}
            trigger={['click']}
          >
            <Button type="text" icon={<MoreOutlined />} className={styles.moreBtn} />
          </Dropdown>
        </div>

        {/* Phone Number */}
        <div className={styles.phoneSection}>
          <div className={styles.phoneNumber}>
            <span className={styles.countryCode}>{phone.countryCode}</span>
            <span className={styles.number} dir="ltr">
              {phone.phoneNumber}
            </span>
            <Tooltip title={t.copy}>
              <Button
                type="text"
                size="small"
                icon={<CopyOutlined />}
                onClick={() => copyToClipboard(`${phone.countryCode}${phone.phoneNumber}`)}
                className={styles.copyBtn}
              />
            </Tooltip>
          </div>
          <div className={styles.phoneType}>
            {getPhoneTypeIcon(phone.phoneType)}
            <span>{getPhoneTypeLabel(phone.phoneType)}</span>
          </div>
        </div>

        {/* Status Badges */}
        <div className={styles.statusBadges}>
          {phone.isVerified ? (
            <Tag icon={<CheckCircleOutlined />} color="success">
              {t.verified}
            </Tag>
          ) : (
            <Tag icon={<CloseCircleOutlined />} color="default">
              {t.notVerified}
            </Tag>
          )}
          {phone.isWhatsApp && (
            <Tag icon={<WhatsAppOutlined />} color="green">
              WhatsApp
            </Tag>
          )}
        </div>

        {/* Last Contact */}
        <div className={styles.lastContact}>
          <span className={styles.lastContactLabel}>{t.lastContact}:</span>
          <span className={styles.lastContactDate}>{formatDate(phone.lastContactedAt)}</span>
        </div>

        {/* Action Buttons */}
        <div className={styles.cardActions}>
          <Tooltip title={t.call}>
            <Button
              type="primary"
              shape="circle"
              icon={<PhoneOutlined />}
              href={`tel:${phone.countryCode}${phone.phoneNumber}`}
              className={styles.actionBtn}
            />
          </Tooltip>
          {phone.isWhatsApp && (
            <Tooltip title={t.whatsapp}>
              <Button
                shape="circle"
                icon={<WhatsAppOutlined />}
                href={`https://wa.me/${phone.countryCode.replace('+', '')}${phone.phoneNumber}`}
                target="_blank"
                className={styles.whatsappBtn}
              />
            </Tooltip>
          )}
          <Tooltip title={t.sendSMS}>
            <Button
              shape="circle"
              icon={<MessageOutlined />}
              href={`sms:${phone.countryCode}${phone.phoneNumber}`}
              className={styles.smsBtn}
            />
          </Tooltip>
          <Tooltip title={t.edit}>
            <Button shape="circle" icon={<EditOutlined />} className={styles.editBtn} />
          </Tooltip>
        </div>
      </Card>
    </Col>
  );

  return (
    <div className={styles.phonesPage}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerTitle}>
            <PhoneOutlined className={styles.headerIcon} />
            <div>
              <h1>{t.pageTitle}</h1>
              <p className={styles.headerSubtitle}>{t.pageSubtitle}</p>
            </div>
          </div>
          <div className={styles.headerActions}>
            <Button icon={<UploadOutlined />} className={styles.secondaryBtn}>
              {t.addFromExcel}
            </Button>
            <Button icon={<DownloadOutlined />} className={styles.secondaryBtn}>
              {t.exportExcel}
            </Button>
            <Button icon={<PrinterOutlined />} className={styles.secondaryBtn}>
              {t.print}
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setShowAddModal(true)}
              className={styles.primaryBtn}
            >
              {t.addPhone}
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className={styles.statisticsRow}>
        <Col xs={12} sm={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={t.totalPhones}
              value={stats.total}
              prefix={<PhoneOutlined style={{ color: '#003366' }} />}
              valueStyle={{ color: '#003366' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={t.verifiedPhones}
              value={stats.verified}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={t.whatsappPhones}
              value={stats.whatsapp}
              prefix={<WhatsAppOutlined style={{ color: '#25D366' }} />}
              valueStyle={{ color: '#25D366' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={t.primaryPhones}
              value={stats.primary}
              prefix={<MobileOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className={styles.filterCard}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <Input
              placeholder={t.search}
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              size="large"
              className={styles.searchInput}
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              value={typeFilter}
              onChange={setTypeFilter}
              style={{ width: '100%' }}
              size="large"
              options={[
                { value: 'all', label: t.allTypes },
                { value: 'mobile', label: t.mobile },
                { value: 'landline', label: t.landline },
                { value: 'work', label: t.work },
                { value: 'home', label: t.home },
              ]}
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              value={verifiedFilter}
              onChange={setVerifiedFilter}
              style={{ width: '100%' }}
              size="large"
              options={[
                { value: 'all', label: t.allVerification },
                { value: 'verified', label: t.verified },
                { value: 'not-verified', label: t.notVerified },
              ]}
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              value={whatsappFilter}
              onChange={setWhatsappFilter}
              style={{ width: '100%' }}
              size="large"
              options={[
                { value: 'all', label: t.allWhatsapp },
                { value: 'has', label: t.hasWhatsapp },
                { value: 'no', label: t.noWhatsapp },
              ]}
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Button icon={<SyncOutlined />} size="large" block>
              {language === 'ar' ? 'تحديث' : 'Refresh'}
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Results Count */}
      <div className={styles.resultsInfo}>
        <span>
          {language === 'ar'
            ? `عرض ${filteredPhones.length} من ${mockPhones.length} رقم`
            : `Showing ${filteredPhones.length} of ${mockPhones.length} numbers`}
        </span>
      </div>

      {/* Phone Cards Grid */}
      {filteredPhones.length > 0 ? (
        <Row gutter={[16, 16]} className={styles.phonesGrid}>
          {filteredPhones.map(renderPhoneCard)}
        </Row>
      ) : (
        <Card className={styles.emptyCard}>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t.noResults} />
        </Card>
      )}

      {/* Add Phone Modal */}
      <Modal
        title={t.addPhone}
        open={showAddModal}
        onCancel={() => setShowAddModal(false)}
        footer={null}
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label={language === 'ar' ? 'العميل' : 'Customer'}
            name="customerId"
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              placeholder={language === 'ar' ? 'اختر العميل' : 'Select customer'}
              options={[
                { value: 'cust-1', label: 'Ahmed Al-Rashid' },
                { value: 'cust-2', label: 'Fatima Hassan' },
              ]}
            />
          </Form.Item>
          <Form.Item
            label={language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
            name="phoneNumber"
            rules={[{ required: true }]}
          >
            <Input prefix="+966" placeholder="5XXXXXXXX" dir="ltr" />
          </Form.Item>
          <Form.Item
            label={language === 'ar' ? 'نوع الرقم' : 'Phone Type'}
            name="phoneType"
            rules={[{ required: true }]}
          >
            <Select
              options={[
                { value: 'mobile', label: t.mobile },
                { value: 'landline', label: t.landline },
                { value: 'work', label: t.work },
                { value: 'home', label: t.home },
              ]}
            />
          </Form.Item>
          <Form.Item label={language === 'ar' ? 'ملاحظات' : 'Notes'} name="notes">
            <Input.TextArea rows={3} />
          </Form.Item>
          <div className={styles.modalActions}>
            <Button onClick={() => setShowAddModal(false)}>
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button type="primary">{language === 'ar' ? 'حفظ' : 'Save'}</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
