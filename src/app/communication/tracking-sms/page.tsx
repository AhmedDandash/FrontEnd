'use client';

import React, { useState } from 'react';
import {
  Card,
  Button,
  Input,
  Switch,
  Tag,
  Tabs,
  Modal,
  Empty,
  Row,
  Col,
  Tooltip,
  message,
  Divider,
  Alert,
  Statistic,
} from 'antd';
import {
  SearchOutlined,
  SaveOutlined,
  MessageOutlined,
  SendOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  TagOutlined,
  FileTextOutlined,
  GlobalOutlined,
  BellOutlined,
  ThunderboltOutlined,
  UserOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  NumberOutlined,
  PhoneOutlined,
  MobileOutlined,
  LinkOutlined,
  AimOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import styles from './TrackingSMS.module.css';

const { TextArea } = Input;
const { TabPane } = Tabs;

interface SMSTemplate {
  id: string;
  contractStatusId: number;
  actionName: string;
  actionNameAr: string;
  isEnabled: boolean;
  messageAr: string;
  messageEn: string;
  category: 'process' | 'medical' | 'training' | 'certification' | 'travel' | 'other';
  icon: React.ReactNode;
}

interface TagVariable {
  key: string;
  labelEn: string;
  labelAr: string;
  icon: React.ReactNode;
  color: string;
}

const tagVariables: TagVariable[] = [
  {
    key: '{applicant_name}',
    labelEn: 'Applicant Name',
    labelAr: 'اسم العامل',
    icon: <UserOutlined />,
    color: 'blue',
  },
  {
    key: '{customer_name}',
    labelEn: 'Customer Name',
    labelAr: 'اسم العميل',
    icon: <UserOutlined />,
    color: 'cyan',
  },
  {
    key: '{arrival_date}',
    labelEn: 'Arrival Date',
    labelAr: 'تاريخ الوصول',
    icon: <CalendarOutlined />,
    color: 'green',
  },
  {
    key: '{arrival_confirm_date}',
    labelEn: 'Arrival Confirm Date',
    labelAr: 'تاريخ تأكيد الوصول',
    icon: <CheckCircleOutlined />,
    color: 'lime',
  },
  {
    key: '{arrival_place}',
    labelEn: 'Arrival Place',
    labelAr: 'مدينة الوصول',
    icon: <EnvironmentOutlined />,
    color: 'orange',
  },
  {
    key: '{contract_id}',
    labelEn: 'Contract Id',
    labelAr: 'رقم العقد',
    icon: <NumberOutlined />,
    color: 'purple',
  },
  {
    key: '{flight_number}',
    labelEn: 'Flight Number',
    labelAr: 'رقم الرحلة',
    icon: <AimOutlined />,
    color: 'magenta',
  },
  {
    key: '{branch_name}',
    labelEn: 'Branch Name',
    labelAr: 'اسم الفرع',
    icon: <EnvironmentOutlined />,
    color: 'geekblue',
  },
  {
    key: '{telephone}',
    labelEn: 'Telephone',
    labelAr: 'الهاتف',
    icon: <PhoneOutlined />,
    color: 'volcano',
  },
  {
    key: '{mobile}',
    labelEn: 'Mobile',
    labelAr: 'الجوال',
    icon: <MobileOutlined />,
    color: 'gold',
  },
  {
    key: '{app_url}',
    labelEn: 'Application URL',
    labelAr: 'لينك التطبيق',
    icon: <LinkOutlined />,
    color: 'default',
  },
];

// Mock data for SMS templates
const generateMockTemplates = (): SMSTemplate[] => [
  {
    id: '1',
    contractStatusId: 20,
    actionName: 'Medical Test',
    actionNameAr: 'الفحص الطبي',
    isEnabled: true,
    messageAr:
      'عزيزنا العميل {customer_name}، تم إجراء الفحص الطبي للعامل {applicant_name} بنجاح. رقم العقد: {contract_id}',
    messageEn:
      'Dear {customer_name}, medical test for {applicant_name} has been completed successfully. Contract: {contract_id}',
    category: 'medical',
    icon: <ThunderboltOutlined />,
  },
  {
    id: '2',
    contractStatusId: 21,
    actionName: 'Training',
    actionNameAr: 'التدريب',
    isEnabled: true,
    messageAr:
      'عزيزنا العميل {customer_name}، بدأ العامل {applicant_name} برنامج التدريب. رقم العقد: {contract_id}',
    messageEn:
      'Dear {customer_name}, {applicant_name} has started the training program. Contract: {contract_id}',
    category: 'training',
    icon: <FileTextOutlined />,
  },
  {
    id: '3',
    contractStatusId: 22,
    actionName: 'Visa Stamping',
    actionNameAr: 'ختم التأشيرة',
    isEnabled: false,
    messageAr:
      'عزيزنا العميل {customer_name}، تم ختم تأشيرة العامل {applicant_name}. رقم العقد: {contract_id}',
    messageEn:
      'Dear {customer_name}, visa stamping for {applicant_name} is complete. Contract: {contract_id}',
    category: 'process',
    icon: <FileTextOutlined />,
  },
  {
    id: '4',
    contractStatusId: 23,
    actionName: 'Travel Clearance',
    actionNameAr: 'تصريح السفر',
    isEnabled: true,
    messageAr:
      'عزيزنا العميل {customer_name}، حصل العامل {applicant_name} على تصريح السفر. موعد الوصول: {arrival_date}. رقم العقد: {contract_id}',
    messageEn:
      'Dear {customer_name}, {applicant_name} has received travel clearance. Arrival: {arrival_date}. Contract: {contract_id}',
    category: 'travel',
    icon: <AimOutlined />,
  },
  {
    id: '5',
    contractStatusId: 24,
    actionName: 'Booked Ticket',
    actionNameAr: 'حجز التذكرة',
    isEnabled: true,
    messageAr:
      'عزيزنا العميل {customer_name}، تم حجز تذكرة العامل {applicant_name}. تاريخ الوصول: {arrival_date}، مدينة الوصول: {arrival_place}. رقم الرحلة: {flight_number}',
    messageEn:
      'Dear {customer_name}, ticket booked for {applicant_name}. Arrival: {arrival_date} at {arrival_place}. Flight: {flight_number}',
    category: 'travel',
    icon: <AimOutlined />,
  },
  {
    id: '6',
    contractStatusId: 25,
    actionName: 'OWWA',
    actionNameAr: 'OWWA',
    isEnabled: false,
    messageAr:
      'عزيزنا العميل {customer_name}، تم استكمال إجراءات OWWA للعامل {applicant_name}. رقم العقد: {contract_id}',
    messageEn:
      'Dear {customer_name}, OWWA procedures for {applicant_name} are complete. Contract: {contract_id}',
    category: 'certification',
    icon: <FileTextOutlined />,
  },
  {
    id: '7',
    contractStatusId: 26,
    actionName: 'TESDA',
    actionNameAr: 'TESDA',
    isEnabled: false,
    messageAr:
      'عزيزنا العميل {customer_name}، تم استكمال شهادة TESDA للعامل {applicant_name}. رقم العقد: {contract_id}',
    messageEn:
      'Dear {customer_name}, TESDA certification for {applicant_name} is complete. Contract: {contract_id}',
    category: 'certification',
    icon: <FileTextOutlined />,
  },
  {
    id: '8',
    contractStatusId: 27,
    actionName: 'Travel Clearance Rejected',
    actionNameAr: 'رفض تصريح السفر',
    isEnabled: true,
    messageAr:
      'عزيزنا العميل {customer_name}، نأسف لإبلاغكم برفض تصريح السفر للعامل {applicant_name}. سنتواصل معكم قريباً. رقم العقد: {contract_id}',
    messageEn:
      'Dear {customer_name}, we regret to inform you that travel clearance for {applicant_name} was rejected. We will contact you soon. Contract: {contract_id}',
    category: 'travel',
    icon: <CloseCircleOutlined />,
  },
  {
    id: '9',
    contractStatusId: 28,
    actionName: 'Security Examination',
    actionNameAr: 'الفحص الأمني',
    isEnabled: true,
    messageAr:
      'عزيزنا العميل {customer_name}، اجتاز العامل {applicant_name} الفحص الأمني بنجاح. رقم العقد: {contract_id}',
    messageEn:
      'Dear {customer_name}, {applicant_name} has passed the security examination. Contract: {contract_id}',
    category: 'process',
    icon: <CheckCircleOutlined />,
  },
  {
    id: '10',
    contractStatusId: 50,
    actionName: 'Contract Shipment',
    actionNameAr: 'شحن العقد',
    isEnabled: false,
    messageAr:
      'عزيزنا العميل {customer_name}، تم شحن العقد للعامل {applicant_name}. رقم العقد: {contract_id}',
    messageEn:
      'Dear {customer_name}, contract has been shipped for {applicant_name}. Contract: {contract_id}',
    category: 'process',
    icon: <SendOutlined />,
  },
  {
    id: '11',
    contractStatusId: 51,
    actionName: 'Contract ReShipment',
    actionNameAr: 'إعادة شحن العقد',
    isEnabled: false,
    messageAr:
      'عزيزنا العميل {customer_name}، تم إعادة شحن العقد للعامل {applicant_name}. رقم العقد: {contract_id}',
    messageEn:
      'Dear {customer_name}, contract has been reshipped for {applicant_name}. Contract: {contract_id}',
    category: 'process',
    icon: <ReloadOutlined />,
  },
  {
    id: '12',
    contractStatusId: 52,
    actionName: 'Contract Received',
    actionNameAr: 'استلام العقد',
    isEnabled: true,
    messageAr:
      'عزيزنا العميل {customer_name}، تم استلام العقد للعامل {applicant_name}. رقم العقد: {contract_id}',
    messageEn:
      'Dear {customer_name}, contract has been received for {applicant_name}. Contract: {contract_id}',
    category: 'process',
    icon: <CheckCircleOutlined />,
  },
  {
    id: '13',
    contractStatusId: 53,
    actionName: 'Medical OG',
    actionNameAr: 'فحص طبي أولي',
    isEnabled: false,
    messageAr:
      'عزيزنا العميل {customer_name}، بدأ العامل {applicant_name} الفحص الطبي الأولي. رقم العقد: {contract_id}',
    messageEn:
      'Dear {customer_name}, {applicant_name} has started the initial medical examination. Contract: {contract_id}',
    category: 'medical',
    icon: <ClockCircleOutlined />,
  },
  {
    id: '14',
    contractStatusId: 54,
    actionName: 'Medical Done',
    actionNameAr: 'اكتمال الفحص الطبي',
    isEnabled: true,
    messageAr:
      'عزيزنا العميل {customer_name}، اكتمل الفحص الطبي للعامل {applicant_name} بنجاح. رقم العقد: {contract_id}',
    messageEn:
      'Dear {customer_name}, medical examination for {applicant_name} is complete. Contract: {contract_id}',
    category: 'medical',
    icon: <CheckCircleOutlined />,
  },
  {
    id: '15',
    contractStatusId: 55,
    actionName: 'Unfit',
    actionNameAr: 'غير لائق طبياً',
    isEnabled: true,
    messageAr:
      'عزيزنا العميل {customer_name}، نأسف لإبلاغكم بأن العامل {applicant_name} غير لائق طبياً. سنتواصل معكم للبدائل. رقم العقد: {contract_id}',
    messageEn:
      'Dear {customer_name}, we regret to inform you that {applicant_name} is medically unfit. We will contact you for alternatives. Contract: {contract_id}',
    category: 'medical',
    icon: <CloseCircleOutlined />,
  },
  {
    id: '16',
    contractStatusId: 56,
    actionName: 'Pregnant',
    actionNameAr: 'حامل',
    isEnabled: true,
    messageAr:
      'عزيزنا العميل {customer_name}، تبين أن العاملة {applicant_name} حامل. سنتواصل معكم للبدائل. رقم العقد: {contract_id}',
    messageEn:
      'Dear {customer_name}, it has been found that {applicant_name} is pregnant. We will contact you for alternatives. Contract: {contract_id}',
    category: 'medical',
    icon: <InfoCircleOutlined />,
  },
  {
    id: '17',
    contractStatusId: 57,
    actionName: 'Under M',
    actionNameAr: 'تحت الفحص',
    isEnabled: false,
    messageAr:
      'عزيزنا العميل {customer_name}، العامل {applicant_name} تحت الفحص الطبي. سنوافيكم بالنتائج قريباً. رقم العقد: {contract_id}',
    messageEn:
      'Dear {customer_name}, {applicant_name} is under medical examination. We will update you soon. Contract: {contract_id}',
    category: 'medical',
    icon: <ClockCircleOutlined />,
  },
  {
    id: '18',
    contractStatusId: 58,
    actionName: 'Training SCH',
    actionNameAr: 'جدولة التدريب',
    isEnabled: false,
    messageAr:
      'عزيزنا العميل {customer_name}، تم جدولة تدريب العامل {applicant_name}. رقم العقد: {contract_id}',
    messageEn:
      'Dear {customer_name}, training has been scheduled for {applicant_name}. Contract: {contract_id}',
    category: 'training',
    icon: <CalendarOutlined />,
  },
  {
    id: '19',
    contractStatusId: 59,
    actionName: 'Training OG',
    actionNameAr: 'بدء التدريب',
    isEnabled: false,
    messageAr:
      'عزيزنا العميل {customer_name}، بدأ العامل {applicant_name} برنامج التدريب. رقم العقد: {contract_id}',
    messageEn:
      'Dear {customer_name}, {applicant_name} has started the training program. Contract: {contract_id}',
    category: 'training',
    icon: <ClockCircleOutlined />,
  },
  {
    id: '20',
    contractStatusId: 60,
    actionName: 'Training Done',
    actionNameAr: 'اكتمال التدريب',
    isEnabled: true,
    messageAr:
      'عزيزنا العميل {customer_name}، أكمل العامل {applicant_name} برنامج التدريب بنجاح. رقم العقد: {contract_id}',
    messageEn:
      'Dear {customer_name}, {applicant_name} has completed the training program successfully. Contract: {contract_id}',
    category: 'training',
    icon: <CheckCircleOutlined />,
  },
  {
    id: '21',
    contractStatusId: 67,
    actionName: 'Biometric',
    actionNameAr: 'البصمة البيومترية',
    isEnabled: true,
    messageAr:
      'عزيزنا العميل {customer_name}، تم أخذ البصمة البيومترية للعامل {applicant_name}. رقم العقد: {contract_id}',
    messageEn:
      'Dear {customer_name}, biometric data for {applicant_name} has been collected. Contract: {contract_id}',
    category: 'process',
    icon: <UserOutlined />,
  },
  {
    id: '22',
    contractStatusId: 68,
    actionName: 'Biometric SCH',
    actionNameAr: 'جدولة البصمة',
    isEnabled: false,
    messageAr:
      'عزيزنا العميل {customer_name}، تم جدولة موعد البصمة البيومترية للعامل {applicant_name}. رقم العقد: {contract_id}',
    messageEn:
      'Dear {customer_name}, biometric appointment has been scheduled for {applicant_name}. Contract: {contract_id}',
    category: 'process',
    icon: <CalendarOutlined />,
  },
  {
    id: '23',
    contractStatusId: 69,
    actionName: 'Biometric Done',
    actionNameAr: 'اكتمال البصمة',
    isEnabled: true,
    messageAr:
      'عزيزنا العميل {customer_name}، تم الانتهاء من البصمة البيومترية للعامل {applicant_name}. رقم العقد: {contract_id}',
    messageEn:
      'Dear {customer_name}, biometric process for {applicant_name} is complete. Contract: {contract_id}',
    category: 'process',
    icon: <CheckCircleOutlined />,
  },
  {
    id: '24',
    contractStatusId: 70,
    actionName: 'Arrived',
    actionNameAr: 'وصل',
    isEnabled: true,
    messageAr:
      'عزيزنا العميل {customer_name}، وصل العامل {applicant_name} إلى {arrival_place}. يرجى التواصل مع فرعنا: {branch_name}. رقم العقد: {contract_id}',
    messageEn:
      'Dear {customer_name}, {applicant_name} has arrived at {arrival_place}. Please contact our branch: {branch_name}. Contract: {contract_id}',
    category: 'travel',
    icon: <CheckCircleOutlined />,
  },
];

export default function TrackingSMSPage() {
  const language = useAuthStore((state) => state.language);
  const router = useRouter();
  const isRTL = language === 'ar';

  const [templates, setTemplates] = useState<SMSTemplate[]>(generateMockTemplates());
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('tracking');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [previewTemplate, setPreviewTemplate] = useState<SMSTemplate | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const categories = [
    { key: 'all', label: isRTL ? 'الكل' : 'All', color: 'default' },
    { key: 'process', label: isRTL ? 'الإجراءات' : 'Process', color: 'blue' },
    { key: 'medical', label: isRTL ? 'الطبي' : 'Medical', color: 'red' },
    { key: 'training', label: isRTL ? 'التدريب' : 'Training', color: 'green' },
    { key: 'certification', label: isRTL ? 'الشهادات' : 'Certification', color: 'purple' },
    { key: 'travel', label: isRTL ? 'السفر' : 'Travel', color: 'orange' },
  ];

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.actionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.actionNameAr.includes(searchTerm);
    const matchesCategory = filterCategory === 'all' || template.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    total: templates.length,
    enabled: templates.filter((t) => t.isEnabled).length,
    disabled: templates.filter((t) => !t.isEnabled).length,
    categories: categories.filter((c) => c.key !== 'all').length,
  };

  const handleToggleTemplate = (id: string) => {
    setTemplates((prev) => prev.map((t) => (t.id === id ? { ...t, isEnabled: !t.isEnabled } : t)));
    setHasChanges(true);
  };

  const handleUpdateMessage = (id: string, field: 'messageAr' | 'messageEn', value: string) => {
    setTemplates((prev) => prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
    setHasChanges(true);
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
    setHasChanges(false);
    message.success(isRTL ? 'تم حفظ جميع القوالب بنجاح' : 'All templates saved successfully');
  };

  const getPreviewMessage = (message: string): string => {
    return message
      .replace(/{applicant_name}/g, 'محمد أحمد')
      .replace(/{customer_name}/g, 'سعد المحمد')
      .replace(/{arrival_date}/g, '2026-01-15')
      .replace(/{arrival_confirm_date}/g, '2026-01-14')
      .replace(/{arrival_place}/g, 'الرياض')
      .replace(/{contract_id}/g, '123456')
      .replace(/{flight_number}/g, 'SV123')
      .replace(/{branch_name}/g, 'فرع الرياض')
      .replace(/{telephone}/g, '0112223344')
      .replace(/{mobile}/g, '0501234567')
      .replace(/{app_url}/g, 'https://app.example.com');
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    if (key === 'arrival') {
      router.push('/communication/templates-sms');
    } else if (key === 'general') {
      router.push('/communication/sms');
    }
  };

  return (
    <div className={styles.container} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerTitle}>
            <div className={styles.headerIcon}>
              <MessageOutlined />
            </div>
            <div>
              <h1>{isRTL ? 'رسائل التتبع التلقائية' : 'Automatic Tracking SMS'}</h1>
              <p className={styles.headerSubtitle}>
                {isRTL
                  ? 'إدارة قوالب الرسائل النصية للتنبيهات التلقائية'
                  : 'Manage SMS templates for automatic notifications'}
              </p>
            </div>
          </div>
          <div className={styles.headerActions}>
            <Button
              icon={<ReloadOutlined />}
              className={styles.secondaryBtn}
              onClick={() => setTemplates(generateMockTemplates())}
            >
              {isRTL ? 'إعادة تعيين' : 'Reset'}
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={isSaving}
              disabled={!hasChanges}
              onClick={handleSaveAll}
              className={styles.primaryBtn}
            >
              {isRTL ? 'حفظ الكل' : 'Save All'}
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Card className={styles.tabsCard}>
        <Tabs activeKey={activeTab} onChange={handleTabChange} className={styles.navTabs}>
          <TabPane
            tab={
              <span className={styles.tabLabel}>
                <ThunderboltOutlined />
                {isRTL ? 'رسائل التتبع التلقائية' : 'Automatic Tracking SMS'}
              </span>
            }
            key="tracking"
          />
          <TabPane
            tab={
              <span className={styles.tabLabel}>
                <BellOutlined />
                {isRTL ? 'رسائل بعد الوصول' : 'SMS After Applicant Arrival'}
              </span>
            }
            key="arrival"
          />
          <TabPane
            tab={
              <span className={styles.tabLabel}>
                <FileTextOutlined />
                {isRTL ? 'قوالب الرسائل' : 'SMS Templates'}
              </span>
            }
            key="general"
          />
        </Tabs>
      </Card>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} className={styles.statsRow}>
        <Col xs={12} sm={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={isRTL ? 'إجمالي القوالب' : 'Total Templates'}
              value={stats.total}
              prefix={<FileTextOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={isRTL ? 'مفعّلة' : 'Enabled'}
              value={stats.enabled}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={isRTL ? 'معطّلة' : 'Disabled'}
              value={stats.disabled}
              prefix={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={isRTL ? 'الفئات' : 'Categories'}
              value={stats.categories}
              prefix={<TagOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Important Note */}
      <Alert
        message={isRTL ? 'ملاحظة هامة' : 'Important Note'}
        description={
          isRTL
            ? 'عند إضافة متغير داخل النص، يجب عدم تعديله بزيادة مسافة أو حرف لتجنب إرسال الرسالة بشكل خاطئ'
            : 'When adding a variable within the text, do not modify it by adding a space or character to avoid sending the message incorrectly'
        }
        type="warning"
        showIcon
        className={styles.alertNote}
      />

      {/* Filter Section */}
      <Card className={styles.filterCard}>
        <div className={styles.filterContent}>
          <div className={styles.searchBox}>
            <Input
              placeholder={isRTL ? 'البحث في القوالب...' : 'Search templates...'}
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
              allowClear
            />
          </div>
          <div className={styles.categoryFilters}>
            {categories.map((cat) => (
              <Tag
                key={cat.key}
                color={filterCategory === cat.key ? cat.color : 'default'}
                className={`${styles.categoryTag} ${filterCategory === cat.key ? styles.activeTag : ''}`}
                onClick={() => setFilterCategory(cat.key)}
              >
                {cat.label}
              </Tag>
            ))}
          </div>
        </div>
      </Card>

      {/* Available Tags Reference */}
      <Card className={styles.tagsReferenceCard} size="small">
        <div className={styles.tagsReferenceHeader}>
          <TagOutlined />
          <span>{isRTL ? 'المتغيرات المتاحة' : 'Available Variables'}</span>
        </div>
        <div className={styles.tagsGrid}>
          {tagVariables.map((tag) => (
            <Tooltip key={tag.key} title={isRTL ? tag.labelAr : tag.labelEn}>
              <Tag icon={tag.icon} color={tag.color} className={styles.referenceTag}>
                {tag.key}
              </Tag>
            </Tooltip>
          ))}
        </div>
      </Card>

      {/* Templates Grid */}
      <div className={styles.templatesGrid}>
        {filteredTemplates.length === 0 ? (
          <Card className={styles.emptyCard}>
            <Empty description={isRTL ? 'لا توجد قوالب مطابقة' : 'No matching templates'} />
          </Card>
        ) : (
          filteredTemplates.map((template) => (
            <Card
              key={template.id}
              className={`${styles.templateCard} ${template.isEnabled ? styles.enabledCard : styles.disabledCard}`}
            >
              <div className={styles.cardHeader}>
                <div className={styles.cardTitleSection}>
                  <div className={`${styles.cardIcon} ${styles[template.category]}`}>
                    {template.icon}
                  </div>
                  <div className={styles.cardTitles}>
                    <h3 className={styles.cardTitle}>
                      {isRTL ? template.actionNameAr : template.actionName}
                    </h3>
                    <span className={styles.cardSubtitle}>
                      {isRTL ? template.actionName : template.actionNameAr}
                    </span>
                  </div>
                </div>
                <div className={styles.cardActions}>
                  <Tooltip title={isRTL ? 'معاينة' : 'Preview'}>
                    <Button
                      type="text"
                      icon={<EyeOutlined />}
                      onClick={() => setPreviewTemplate(template)}
                      className={styles.actionBtn}
                    />
                  </Tooltip>
                  <Switch
                    checked={template.isEnabled}
                    onChange={() => handleToggleTemplate(template.id)}
                    checkedChildren={isRTL ? 'مفعّل' : 'ON'}
                    unCheckedChildren={isRTL ? 'معطّل' : 'OFF'}
                  />
                </div>
              </div>

              <Divider className={styles.cardDivider} />

              <div className={styles.messageSection}>
                <div className={styles.messageBlock}>
                  <div className={styles.messageLabel}>
                    <GlobalOutlined />
                    <span>{isRTL ? 'الرسالة العربية' : 'Arabic Message'}</span>
                  </div>
                  <TextArea
                    id={`${template.id}_ar`}
                    value={template.messageAr}
                    onChange={(e) => handleUpdateMessage(template.id, 'messageAr', e.target.value)}
                    rows={3}
                    className={styles.messageTextarea}
                    dir="rtl"
                    placeholder={isRTL ? 'أدخل الرسالة العربية...' : 'Enter Arabic message...'}
                  />
                </div>

                <div className={styles.messageBlock}>
                  <div className={styles.messageLabel}>
                    <GlobalOutlined />
                    <span>{isRTL ? 'الرسالة الإنجليزية' : 'English Message'}</span>
                  </div>
                  <TextArea
                    id={`${template.id}_en`}
                    value={template.messageEn}
                    onChange={(e) => handleUpdateMessage(template.id, 'messageEn', e.target.value)}
                    rows={3}
                    className={styles.messageTextarea}
                    dir="ltr"
                    placeholder={isRTL ? 'أدخل الرسالة الإنجليزية...' : 'Enter English message...'}
                  />
                </div>
              </div>

              <div className={styles.cardFooter}>
                <Tag color={categories.find((c) => c.key === template.category)?.color}>
                  {categories.find((c) => c.key === template.category)?.label}
                </Tag>
                <span className={styles.statusId}>ID: {template.contractStatusId}</span>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Preview Modal */}
      <Modal
        title={
          <div className={styles.previewModalTitle}>
            <EyeOutlined />
            <span>{isRTL ? 'معاينة الرسالة' : 'Message Preview'}</span>
          </div>
        }
        open={!!previewTemplate}
        onCancel={() => setPreviewTemplate(null)}
        footer={[
          <Button key="close" onClick={() => setPreviewTemplate(null)}>
            {isRTL ? 'إغلاق' : 'Close'}
          </Button>,
        ]}
        width={600}
        className={styles.previewModal}
      >
        {previewTemplate && (
          <div className={styles.previewContent}>
            <Alert
              message={
                isRTL ? 'هذه معاينة باستخدام بيانات تجريبية' : 'This is a preview using sample data'
              }
              type="info"
              showIcon
              className={styles.previewAlert}
            />

            <div className={styles.previewSection}>
              <h4 className={styles.previewLabel}>
                <GlobalOutlined /> {isRTL ? 'الرسالة العربية' : 'Arabic Message'}
              </h4>
              <div className={styles.previewMessage} dir="rtl">
                {getPreviewMessage(previewTemplate.messageAr)}
              </div>
            </div>

            <Divider />

            <div className={styles.previewSection}>
              <h4 className={styles.previewLabel}>
                <GlobalOutlined /> {isRTL ? 'الرسالة الإنجليزية' : 'English Message'}
              </h4>
              <div className={styles.previewMessage} dir="ltr">
                {getPreviewMessage(previewTemplate.messageEn)}
              </div>
            </div>

            <Divider />

            <div className={styles.previewMeta}>
              <Tag color={previewTemplate.isEnabled ? 'green' : 'red'}>
                {previewTemplate.isEnabled
                  ? isRTL
                    ? 'مفعّل'
                    : 'Enabled'
                  : isRTL
                    ? 'معطّل'
                    : 'Disabled'}
              </Tag>
              <Tag color={categories.find((c) => c.key === previewTemplate.category)?.color}>
                {categories.find((c) => c.key === previewTemplate.category)?.label}
              </Tag>
            </div>
          </div>
        )}
      </Modal>

      {/* Floating Save Button for Mobile */}
      {hasChanges && (
        <div className={styles.floatingSave}>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            loading={isSaving}
            onClick={handleSaveAll}
            size="large"
            shape="round"
          >
            {isRTL ? 'حفظ التغييرات' : 'Save Changes'}
          </Button>
        </div>
      )}
    </div>
  );
}
