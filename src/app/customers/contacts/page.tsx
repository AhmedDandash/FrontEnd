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
  Avatar,
  Tooltip,
  Empty,
  Modal,
  Form,
  DatePicker,
  Timeline,
  Pagination,
} from 'antd';
import {
  PhoneOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  PrinterOutlined,
  UserOutlined,
  FileTextOutlined,
  CalendarOutlined,
  MessageOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
  EyeOutlined,
  CommentOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  HistoryOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';

import { useAuthStore } from '@/store/authStore';
import styles from './CustomerContacts.module.css';

interface CustomerContact {
  id: string;
  customerId: string;
  customerName: string;
  customerNameAr: string;
  contractId: string;
  contractNumber: string;
  contractType: 'mediation' | 'operation' | 'sponsorship' | 'rent';
  branch: string;
  branchAr: string;
  notes: string;
  notesAr: string;
  contactedBy: string;
  contactedByAr: string;
  contactDate: string;
  contactMethod: 'phone' | 'email' | 'whatsapp' | 'visit' | 'sms';
  status: 'completed' | 'pending' | 'follow-up';
}

// Mock data for customer contacts
const mockContacts: CustomerContact[] = Array.from({ length: 50 }, (_, i) => ({
  id: `contact-${i + 1}`,
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
    'Tariq Al-Zahrani',
    'Nouf Al-Qahtani',
  ][i % 20],
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
    'طارق الزهراني',
    'نوف القحطاني',
  ][i % 20],
  contractId: `contract-${100 + i}`,
  contractNumber: `${500 + i}`,
  contractType: (['mediation', 'operation', 'sponsorship', 'rent'] as const)[i % 4],
  branch: 'Sigma Recruitment Office',
  branchAr: 'سيجما الكفاءات للاستقدام',
  notes: [
    'Customer confirmed payment schedule',
    'Follow up on contract renewal',
    'Discussed service options',
    'Scheduled delivery date confirmed',
    'Customer requested extension',
    'Payment received confirmation',
    'Contract terms explained',
    'Customer satisfied with service',
  ][i % 8],
  notesAr: [
    'تأكيد جدول الدفع مع العميل',
    'متابعة تجديد العقد',
    'مsaddasdadsadsdناقشة خيارات الخدمة',
    'تأكيد موعد التسليم',
    'طلب العميل تمديد العقد',
    'تأكيد استلام الدفعة',
    'شرح شروط العقد',
    'العميل راضٍ عن الخدمة',
  ][i % 8],
  contactedBy: ['Siham Abdullah Al-Harbi', 'Mohammed Al-Otaibi', 'Sara Al-Dosari'][i % 3],
  contactedByAr: ['سهام عبدالله الحربي', 'محمد العتيبي', 'سارة الدوسري'][i % 3],
  contactDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
  contactMethod: (['phone', 'email', 'whatsapp', 'visit', 'sms'] as const)[i % 5],
  status: (['completed', 'pending', 'follow-up'] as const)[i % 3],
}));

export default function CustomerContactsPage() {
  const language = useAuthStore((state) => state.language);
  const [searchText, setSearchText] = useState('');
  const [contractTypeFilter, setContractTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<CustomerContact | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'timeline'>('cards');
  const [form] = Form.useForm();
  const pageSize = 12;

  const handleViewDetails = (contact: CustomerContact) => {
    setSelectedContact(contact);
    setShowDetailsModal(true);
  };

  // Translations
  const t = {
    pageTitle: language === 'ar' ? 'جهات الاتصال' : 'Customer Contacts',
    pageSubtitle: language === 'ar' ? 'سجل التواصل مع العملاء' : 'Customer communication history',
    addContact: language === 'ar' ? 'إضافة تواصل' : 'Add Contact',
    exportExcel: language === 'ar' ? 'تصدير إكسل' : 'Export Excel',
    print: language === 'ar' ? 'طباعة' : 'Print',
    search: language === 'ar' ? 'بحث بالعميل أو رقم العقد...' : 'Search by customer or contract...',
    allTypes: language === 'ar' ? 'جميع العقود' : 'All Contracts',
    mediation: language === 'ar' ? 'وساطة' : 'Mediation',
    operation: language === 'ar' ? 'تشغيل' : 'Operation',
    sponsorship: language === 'ar' ? 'كفالة' : 'Sponsorship',
    rent: language === 'ar' ? 'إيجار' : 'Rent',
    allStatuses: language === 'ar' ? 'جميع الحالات' : 'All Statuses',
    completed: language === 'ar' ? 'مكتمل' : 'Completed',
    pending: language === 'ar' ? 'معلق' : 'Pending',
    followUp: language === 'ar' ? 'متابعة' : 'Follow-up',
    allMethods: language === 'ar' ? 'جميع الطرق' : 'All Methods',
    phone: language === 'ar' ? 'هاتف' : 'Phone',
    email: language === 'ar' ? 'بريد' : 'Email',
    whatsapp: language === 'ar' ? 'واتساب' : 'WhatsApp',
    visit: language === 'ar' ? 'زيارة' : 'Visit',
    sms: language === 'ar' ? 'رسالة' : 'SMS',
    totalContacts: language === 'ar' ? 'إجمالي التواصل' : 'Total Contacts',
    todayContacts: language === 'ar' ? 'تواصل اليوم' : "Today's Contacts",
    pendingFollowups: language === 'ar' ? 'متابعات معلقة' : 'Pending Follow-ups',
    completedToday: language === 'ar' ? 'مكتمل اليوم' : 'Completed Today',
    contract: language === 'ar' ? 'العقد' : 'Contract',
    contactedBy: language === 'ar' ? 'بواسطة' : 'By',
    viewDetails: language === 'ar' ? 'عرض التفاصيل' : 'View Details',
    edit: language === 'ar' ? 'تعديل' : 'Edit',
    noResults: language === 'ar' ? 'لا توجد نتائج' : 'No results found',
    cardsView: language === 'ar' ? 'عرض البطاقات' : 'Cards View',
    timelineView: language === 'ar' ? 'عرض الجدول الزمني' : 'Timeline View',
    customer: language === 'ar' ? 'العميل' : 'Customer',
    notes: language === 'ar' ? 'الملاحظات' : 'Notes',
    date: language === 'ar' ? 'التاريخ' : 'Date',
    branch: language === 'ar' ? 'الفرع' : 'Branch',
  };

  // Filter contacts
  const filteredContacts = useMemo(() => {
    return mockContacts.filter((contact) => {
      const searchLower = searchText.toLowerCase();
      const matchesSearch =
        !searchText ||
        contact.customerName.toLowerCase().includes(searchLower) ||
        contact.customerNameAr.includes(searchText) ||
        contact.contractNumber.includes(searchText);

      const matchesType =
        contractTypeFilter === 'all' || contact.contractType === contractTypeFilter;
      const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
      const matchesMethod = methodFilter === 'all' || contact.contactMethod === methodFilter;

      return matchesSearch && matchesType && matchesStatus && matchesMethod;
    });
  }, [searchText, contractTypeFilter, statusFilter, methodFilter]);

  // Paginated contacts
  const paginatedContacts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredContacts.slice(start, start + pageSize);
  }, [filteredContacts, currentPage]);

  // Statistics
  const stats = useMemo(() => {
    const today = new Date().toDateString();
    return {
      total: mockContacts.length,
      today: mockContacts.filter((c) => new Date(c.contactDate).toDateString() === today).length,
      pending: mockContacts.filter((c) => c.status === 'pending' || c.status === 'follow-up')
        .length,
      completedToday: mockContacts.filter(
        (c) => c.status === 'completed' && new Date(c.contactDate).toDateString() === today
      ).length,
    };
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getContractTypeTag = (type: string) => {
    const config: Record<string, { color: string; label: string }> = {
      mediation: { color: 'blue', label: t.mediation },
      operation: { color: 'green', label: t.operation },
      sponsorship: { color: 'purple', label: t.sponsorship },
      rent: { color: 'orange', label: t.rent },
    };
    return config[type] || { color: 'default', label: type };
  };

  const getMethodIcon = (method: string) => {
    const icons: Record<string, React.ReactNode> = {
      phone: <PhoneOutlined />,
      email: <MessageOutlined />,
      whatsapp: <MessageOutlined style={{ color: '#25D366' }} />,
      visit: <UserOutlined />,
      sms: <CommentOutlined />,
    };
    return icons[method] || <MessageOutlined />;
  };

  const getMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      phone: t.phone,
      email: t.email,
      whatsapp: t.whatsapp,
      visit: t.visit,
      sms: t.sms,
    };
    return labels[method] || method;
  };

  const renderContactCard = (contact: CustomerContact) => (
    <Col xs={24} sm={12} lg={8} xl={6} key={contact.id}>
      <Card className={styles.contactCard} hoverable>
        {/* Card Header */}
        <div className={styles.cardHeader}>
          <div className={styles.customerInfo}>
            <Avatar size={48} icon={<UserOutlined />} className={styles.customerAvatar} />
            <div className={styles.customerDetails}>
              <span className={styles.customerName}>
                {language === 'ar' ? contact.customerNameAr : contact.customerName}
              </span>
              <div className={styles.contractInfo}>
                <FileTextOutlined />
                <span>#{contact.contractNumber}</span>
                <Tag
                  color={getContractTypeTag(contact.contractType).color}
                  className={styles.typeTag}
                >
                  {getContractTypeTag(contact.contractType).label}
                </Tag>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Notes */}
        <div className={styles.notesSection}>
          <div className={styles.notesIcon}>
            <CommentOutlined />
          </div>
          <p className={styles.notesText}>{language === 'ar' ? contact.notesAr : contact.notes}</p>
        </div>

        {/* Contact Method & Date */}
        <div className={styles.metaSection}>
          <div className={styles.metaItem}>
            {getMethodIcon(contact.contactMethod)}
            <span>{getMethodLabel(contact.contactMethod)}</span>
          </div>
          <div className={styles.metaItem}>
            <CalendarOutlined />
            <span>{formatDate(contact.contactDate)}</span>
          </div>
          <div className={styles.metaItem}>
            <ClockCircleOutlined />
            <span>{formatTime(contact.contactDate)}</span>
          </div>
        </div>

        {/* Contacted By */}
        <div className={styles.contactedBy}>
          <Avatar size={24} icon={<UserOutlined />} className={styles.agentAvatar} />
          <span className={styles.agentName}>
            {language === 'ar' ? contact.contactedByAr : contact.contactedBy}
          </span>
        </div>

        {/* Actions */}
        <div className={styles.cardActions}>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            className={styles.viewBtn}
            onClick={() => handleViewDetails(contact)}
          >
            {t.viewDetails}
          </Button>
          <Tooltip title={t.edit}>
            <Button icon={<EditOutlined />} className={styles.editBtn} />
          </Tooltip>
        </div>
      </Card>
    </Col>
  );

  const renderTimeline = () => (
    <Card className={styles.timelineCard}>
      <Timeline
        mode={language === 'ar' ? 'right' : 'left'}
        items={paginatedContacts.map((contact) => ({
          color:
            contact.status === 'completed'
              ? 'green'
              : contact.status === 'pending'
                ? 'orange'
                : 'blue',
          dot: getMethodIcon(contact.contactMethod),
          children: (
            <div className={styles.timelineItem}>
              <div className={styles.timelineHeader}>
                <span className={styles.timelineCustomer}>
                  {language === 'ar' ? contact.customerNameAr : contact.customerName}
                </span>
                <Tag color={getContractTypeTag(contact.contractType).color}>
                  #{contact.contractNumber}
                </Tag>
              </div>
              <p className={styles.timelineNotes}>
                {language === 'ar' ? contact.notesAr : contact.notes}
              </p>
              <div className={styles.timelineMeta}>
                <span>
                  <UserOutlined /> {language === 'ar' ? contact.contactedByAr : contact.contactedBy}
                </span>
                <span>
                  <CalendarOutlined /> {formatDate(contact.contactDate)} -{' '}
                  {formatTime(contact.contactDate)}
                </span>
              </div>
            </div>
          ),
        }))}
      />
    </Card>
  );

  return (
    <div className={styles.contactsPage}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerTitle}>
            <TeamOutlined className={styles.headerIcon} />
            <div>
              <h1>{t.pageTitle}</h1>
              <p className={styles.headerSubtitle}>{t.pageSubtitle}</p>
            </div>
          </div>
          <div className={styles.headerActions}>
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
              {t.addContact}
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className={styles.statisticsRow}>
        <Col xs={12} sm={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={t.totalContacts}
              value={stats.total}
              prefix={<MessageOutlined style={{ color: '#003366' }} />}
              valueStyle={{ color: '#003366' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={t.todayContacts}
              value={stats.today}
              prefix={<CalendarOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={t.pendingFollowups}
              value={stats.pending}
              prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={t.completedToday}
              value={stats.completedToday}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className={styles.filterCard}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={6}>
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
              value={contractTypeFilter}
              onChange={setContractTypeFilter}
              style={{ width: '100%' }}
              size="large"
              options={[
                { value: 'all', label: t.allTypes },
                { value: 'mediation', label: t.mediation },
                { value: 'operation', label: t.operation },
                { value: 'sponsorship', label: t.sponsorship },
                { value: 'rent', label: t.rent },
              ]}
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: '100%' }}
              size="large"
              options={[
                { value: 'all', label: t.allStatuses },
                { value: 'completed', label: t.completed },
                { value: 'pending', label: t.pending },
                { value: 'follow-up', label: t.followUp },
              ]}
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              value={methodFilter}
              onChange={setMethodFilter}
              style={{ width: '100%' }}
              size="large"
              options={[
                { value: 'all', label: t.allMethods },
                { value: 'phone', label: t.phone },
                { value: 'email', label: t.email },
                { value: 'whatsapp', label: t.whatsapp },
                { value: 'visit', label: t.visit },
                { value: 'sms', label: t.sms },
              ]}
            />
          </Col>
          <Col xs={12} sm={6} md={3}>
            <Button.Group size="large" style={{ width: '100%', display: 'flex' }}>
              <Tooltip title={t.cardsView}>
                <Button
                  type={viewMode === 'cards' ? 'primary' : 'default'}
                  onClick={() => setViewMode('cards')}
                  icon={<AppstoreOutlined />}
                  style={{ flex: 1 }}
                />
              </Tooltip>
              <Tooltip title={t.timelineView}>
                <Button
                  type={viewMode === 'timeline' ? 'primary' : 'default'}
                  onClick={() => setViewMode('timeline')}
                  icon={<HistoryOutlined />}
                  style={{ flex: 1 }}
                />
              </Tooltip>
            </Button.Group>
          </Col>
        </Row>
      </Card>

      {/* Results Count */}
      <div className={styles.resultsInfo}>
        <span>
          {language === 'ar'
            ? `عرض ${paginatedContacts.length} من ${filteredContacts.length} سجل`
            : `Showing ${paginatedContacts.length} of ${filteredContacts.length} records`}
        </span>
      </div>

      {/* Contacts Display */}
      {filteredContacts.length > 0 ? (
        <>
          {viewMode === 'cards' ? (
            <Row gutter={[16, 16]} className={styles.contactsGrid}>
              {paginatedContacts.map(renderContactCard)}
            </Row>
          ) : (
            renderTimeline()
          )}

          {/* Pagination */}
          <div className={styles.paginationWrapper}>
            <Pagination
              current={currentPage}
              total={filteredContacts.length}
              pageSize={pageSize}
              onChange={setCurrentPage}
              showSizeChanger={false}
              showQuickJumper
              showTotal={(total) =>
                language === 'ar' ? `إجمالي ${total} سجل` : `Total ${total} records`
              }
            />
          </div>
        </>
      ) : (
        <Card className={styles.emptyCard}>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t.noResults} />
        </Card>
      )}

      {/* Add Contact Modal */}
      <Modal
        title={t.addContact}
        open={showAddModal}
        onCancel={() => setShowAddModal(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={t.customer} name="customerId" rules={[{ required: true }]}>
                <Select
                  showSearch
                  placeholder={language === 'ar' ? 'اختر العميل' : 'Select customer'}
                  options={[
                    { value: 'cust-1', label: 'Ahmed Al-Rashid' },
                    { value: 'cust-2', label: 'Fatima Hassan' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={t.contract} name="contractId" rules={[{ required: true }]}>
                <Select
                  showSearch
                  placeholder={language === 'ar' ? 'اختر العقد' : 'Select contract'}
                  options={[
                    { value: 'contract-1', label: '#500 - Mediation' },
                    { value: 'contract-2', label: '#501 - Operation' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={language === 'ar' ? 'طريقة التواصل' : 'Contact Method'}
                name="contactMethod"
                rules={[{ required: true }]}
              >
                <Select
                  options={[
                    { value: 'phone', label: t.phone },
                    { value: 'email', label: t.email },
                    { value: 'whatsapp', label: t.whatsapp },
                    { value: 'visit', label: t.visit },
                    { value: 'sms', label: t.sms },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={t.date} name="contactDate" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} showTime />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label={t.notes} name="notes" rules={[{ required: true }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
          <div className={styles.modalActions}>
            <Button onClick={() => setShowAddModal(false)}>
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button type="primary">{language === 'ar' ? 'حفظ' : 'Save'}</Button>
          </div>
        </Form>
      </Modal>

      {/* View Details Modal */}
      <Modal
        title={language === 'ar' ? 'تفاصيل التواصل' : 'Contact Details'}
        open={showDetailsModal}
        onCancel={() => {
          setShowDetailsModal(false);
          setSelectedContact(null);
        }}
        footer={
          <Button type="primary" onClick={() => setShowDetailsModal(false)}>
            {language === 'ar' ? 'إغلاق' : 'Close'}
          </Button>
        }
        width={500}
      >
        {selectedContact && (
          <div className={styles.detailsModal}>
            {/* Customer Info */}
            <div className={styles.detailsHeader}>
              <Avatar size={56} icon={<UserOutlined />} className={styles.detailsAvatar} />
              <div className={styles.detailsCustomer}>
                <h3>
                  {language === 'ar'
                    ? selectedContact.customerNameAr
                    : selectedContact.customerName}
                </h3>
                <Tag color={getContractTypeTag(selectedContact.contractType).color}>
                  {t.contract} #{selectedContact.contractNumber}
                </Tag>
              </div>
            </div>

            {/* Notes Section */}
            <div className={styles.detailsNotesSection}>
              <h4>{t.notes}</h4>
              <div className={styles.detailsNotesContent}>
                {language === 'ar' ? selectedContact.notesAr : selectedContact.notes}
              </div>
            </div>

            {/* Contact Info */}
            <div className={styles.detailsInfo}>
              <div className={styles.detailsInfoItem}>
                <span className={styles.detailsLabel}>
                  {language === 'ar' ? 'طريقة التواصل' : 'Contact Method'}
                </span>
                <span className={styles.detailsValue}>
                  {getMethodIcon(selectedContact.contactMethod)}{' '}
                  {getMethodLabel(selectedContact.contactMethod)}
                </span>
              </div>
              <div className={styles.detailsInfoItem}>
                <span className={styles.detailsLabel}>{t.date}</span>
                <span className={styles.detailsValue}>
                  {formatDate(selectedContact.contactDate)} -{' '}
                  {formatTime(selectedContact.contactDate)}
                </span>
              </div>
              <div className={styles.detailsInfoItem}>
                <span className={styles.detailsLabel}>{t.contactedBy}</span>
                <span className={styles.detailsValue}>
                  {language === 'ar' ? selectedContact.contactedByAr : selectedContact.contactedBy}
                </span>
              </div>
              <div className={styles.detailsInfoItem}>
                <span className={styles.detailsLabel}>{t.branch}</span>
                <span className={styles.detailsValue}>
                  {language === 'ar' ? selectedContact.branchAr : selectedContact.branch}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
