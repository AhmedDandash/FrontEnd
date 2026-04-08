'use client';

import React, { useState, useMemo } from 'react';
import {
  Card,
  Statistic,
  Row,
  Col,
  Tabs,
  Input,
  Select,
  Button,
  Space,
  Tag,
  Badge,
  message,
  Upload,
  Checkbox,
  //   DatePicker,
  Progress,
} from 'antd';
import {
  MailOutlined,
  SendOutlined,
  TeamOutlined,
  FileTextOutlined,
  HistoryOutlined,
  UserAddOutlined,
  PaperClipOutlined,
  ClearOutlined,
  InboxOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/store/authStore';
import type { TabsProps, UploadProps } from 'antd';
import styles from './Email.module.css';

const { TextArea } = Input;
const { Option } = Select;
const { Dragger } = Upload;
// const { RangePicker } = DatePicker;

// Mock data for customers
const mockCustomers = [
  {
    id: 1,
    name: 'Ahmed Mohamed',
    nameAr: 'أحمد محمد',
    email: 'ahmed.mohamed@example.com',
    nationality: 'Egypt',
    nationalityAr: 'مصر',
    contractType: 'Mediation',
    contractTypeAr: 'وساطة',
    branch: 'Riyadh',
    branchAr: 'الرياض',
  },
  {
    id: 2,
    name: 'Fatima Ali',
    nameAr: 'فاطمة علي',
    email: 'fatima.ali@example.com',
    nationality: 'Philippines',
    nationalityAr: 'الفلبين',
    contractType: 'Rent',
    contractTypeAr: 'إيجار',
    branch: 'Jeddah',
    branchAr: 'جدة',
  },
  {
    id: 3,
    name: 'Mohammed Hassan',
    nameAr: 'محمد حسن',
    email: 'mohammed.hassan@example.com',
    nationality: 'Sudan',
    nationalityAr: 'السودان',
    contractType: 'Mediation',
    contractTypeAr: 'وساطة',
    branch: 'Riyadh',
    branchAr: 'الرياض',
  },
  {
    id: 4,
    name: 'Sara Abdullah',
    nameAr: 'سارة عبدالله',
    email: 'sara.abdullah@example.com',
    nationality: 'Kenya',
    nationalityAr: 'كينيا',
    contractType: 'Rent',
    contractTypeAr: 'إيجار',
    branch: 'Dammam',
    branchAr: 'الدمام',
  },
  {
    id: 5,
    name: 'Khalid Ibrahim',
    nameAr: 'خالد إبراهيم',
    email: 'khalid.ibrahim@example.com',
    nationality: 'India',
    nationalityAr: 'الهند',
    contractType: 'Mediation',
    contractTypeAr: 'وساطة',
    branch: 'Riyadh',
    branchAr: 'الرياض',
  },
];

// Mock email templates
const emailTemplates = [
  {
    id: 1,
    name: 'Welcome Email',
    nameAr: 'بريد الترحيب',
    category: 'General',
    categoryAr: 'عام',
    subject: 'Welcome to Our Service',
    subjectAr: 'مرحباً بك في خدمتنا',
    body: 'Dear Customer,\n\nWelcome to our recruitment services. We are pleased to serve you.\n\nBest regards,\nRecruitment Team',
    bodyAr:
      'عزيزي العميل،\n\nنرحب بك في خدمات التوظيف لدينا. يسعدنا خدمتك.\n\nمع أطيب التحيات،\nفريق التوظيف',
  },
  {
    id: 2,
    name: 'Contract Reminder',
    nameAr: 'تذكير العقد',
    category: 'Reminder',
    categoryAr: 'تذكير',
    subject: 'Contract Renewal Reminder',
    subjectAr: 'تذكير بتجديد العقد',
    body: 'Dear Customer,\n\nThis is a reminder that your contract is due for renewal.\n\nPlease contact us at your earliest convenience.\n\nBest regards,\nRecruitment Team',
    bodyAr:
      'عزيزي العميل،\n\nهذا تذكير بأن عقدك مستحق للتجديد.\n\nيرجى الاتصال بنا في أقرب وقت ممكن.\n\nمع أطيب التحيات،\nفريق التوظيف',
  },
  {
    id: 3,
    name: 'Payment Reminder',
    nameAr: 'تذكير بالدفع',
    category: 'Payment',
    categoryAr: 'دفع',
    subject: 'Payment Due Notification',
    subjectAr: 'إشعار استحقاق الدفع',
    body: 'Dear Customer,\n\nThis is a friendly reminder that your payment is due.\n\nPlease make the payment at your earliest convenience.\n\nBest regards,\nFinance Team',
    bodyAr:
      'عزيزي العميل،\n\nهذا تذكير ودي بأن دفعتك مستحقة.\n\nيرجى إجراء الدفع في أقرب وقت ممكن.\n\nمع أطيب التحيات،\nفريق المالية',
  },
  {
    id: 4,
    name: 'Document Request',
    nameAr: 'طلب مستندات',
    category: 'Request',
    categoryAr: 'طلب',
    subject: 'Document Submission Request',
    subjectAr: 'طلب تقديم المستندات',
    body: 'Dear Customer,\n\nWe kindly request you to submit the required documents.\n\nPlease upload them through our portal.\n\nBest regards,\nOperations Team',
    bodyAr:
      'عزيزي العميل،\n\nنطلب منك تقديم المستندات المطلوبة.\n\nيرجى تحميلها عبر بوابتنا.\n\nمع أطيب التحيات،\nفريق العمليات',
  },
  {
    id: 5,
    name: 'Follow-up Email',
    nameAr: 'بريد المتابعة',
    category: 'Follow-up',
    categoryAr: 'متابعة',
    subject: 'Follow-up on Your Request',
    subjectAr: 'متابعة طلبك',
    body: 'Dear Customer,\n\nWe are following up on your recent request.\n\nIf you have any questions, please feel free to contact us.\n\nBest regards,\nCustomer Service',
    bodyAr:
      'عزيزي العميل،\n\nنتابع طلبك الأخير.\n\nإذا كان لديك أي أسئلة، لا تتردد في الاتصال بنا.\n\nمع أطيب التحيات،\nخدمة العملاء',
  },
];

// Mock sent emails history
const sentEmails = [
  {
    id: 1,
    subject: 'Welcome to Our Service',
    subjectAr: 'مرحباً بك في خدمتنا',
    recipients: 15,
    sentDate: '2026-01-15 10:30 AM',
    status: 'Delivered',
    statusAr: 'تم التسليم',
    attachments: 1,
  },
  {
    id: 2,
    subject: 'Contract Renewal Reminder',
    subjectAr: 'تذكير بتجديد العقد',
    recipients: 8,
    sentDate: '2026-01-14 02:15 PM',
    status: 'Delivered',
    statusAr: 'تم التسليم',
    attachments: 2,
  },
  {
    id: 3,
    subject: 'Payment Due Notification',
    subjectAr: 'إشعار استحقاق الدفع',
    recipients: 22,
    sentDate: '2026-01-13 09:00 AM',
    status: 'Delivered',
    statusAr: 'تم التسليم',
    attachments: 0,
  },
  {
    id: 4,
    subject: 'Document Submission Request',
    subjectAr: 'طلب تقديم المستندات',
    recipients: 12,
    sentDate: '2026-01-12 11:45 AM',
    status: 'Pending',
    statusAr: 'قيد الانتظار',
    attachments: 3,
  },
  {
    id: 5,
    subject: 'Follow-up on Your Request',
    subjectAr: 'متابعة طلبك',
    recipients: 5,
    sentDate: '2026-01-11 03:30 PM',
    status: 'Delivered',
    statusAr: 'تم التسليم',
    attachments: 0,
  },
];

export default function SendEmailPage() {
  const language = useAuthStore((state) => state.language);
  const [activeTab, setActiveTab] = useState('compose');

  // Compose tab states
  const [sendToType, setSendToType] = useState<'customers' | 'manual'>('customers');
  const [selectedCustomers, setSelectedCustomers] = useState<number[]>([]);
  const [manualEmails, setManualEmails] = useState<string>('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [attachments, setAttachments] = useState<any[]>([]);

  // Filter states
  const [nationalityFilter, setNationalityFilter] = useState<string[]>([]);
  const [contractTypeFilter, setContractTypeFilter] = useState<string[]>([]);
  const [branchFilter, setBranchFilter] = useState<string[]>([]);

  // Statistics
  const statistics = {
    totalSent: 2548,
    todaySent: 42,
    pending: 8,
    deliveryRate: 98.5,
  };

  // Filter customers based on selected filters
  const filteredCustomers = useMemo(() => {
    return mockCustomers.filter((customer) => {
      const matchesNationality =
        nationalityFilter.length === 0 ||
        nationalityFilter.includes(
          language === 'ar' ? customer.nationalityAr : customer.nationality
        );
      const matchesContractType =
        contractTypeFilter.length === 0 ||
        contractTypeFilter.includes(
          language === 'ar' ? customer.contractTypeAr : customer.contractType
        );
      const matchesBranch =
        branchFilter.length === 0 ||
        branchFilter.includes(language === 'ar' ? customer.branchAr : customer.branch);

      return matchesNationality && matchesContractType && matchesBranch;
    });
  }, [nationalityFilter, contractTypeFilter, branchFilter, language]);

  // Handle template selection
  const handleTemplateSelect = (templateId: number) => {
    const template = emailTemplates.find((t) => t.id === templateId);
    if (template) {
      setEmailSubject(language === 'ar' ? template.subjectAr : template.subject);
      setEmailBody(language === 'ar' ? template.bodyAr : template.body);
      setSelectedTemplate(templateId);
      message.success(language === 'ar' ? 'تم تطبيق القالب' : 'Template applied');
    }
  };

  // Handle send email
  const handleSendEmail = () => {
    const recipientCount =
      sendToType === 'customers'
        ? selectedCustomers.length
        : manualEmails.split(',').filter((e) => e.trim()).length;

    if (recipientCount === 0) {
      message.error(language === 'ar' ? 'يرجى تحديد المستلمين' : 'Please select recipients');
      return;
    }

    if (!emailSubject.trim()) {
      message.error(
        language === 'ar' ? 'يرجى إدخال موضوع البريد الإلكتروني' : 'Please enter email subject'
      );
      return;
    }

    if (!emailBody.trim()) {
      message.error(
        language === 'ar' ? 'يرجى إدخال محتوى البريد الإلكتروني' : 'Please enter email body'
      );
      return;
    }

    message.success(
      language === 'ar'
        ? `تم إرسال البريد الإلكتروني إلى ${recipientCount} مستلم`
        : `Email sent to ${recipientCount} recipients`
    );

    // Reset form
    handleClearForm();
  };

  // Handle clear form
  const handleClearForm = () => {
    setSelectedCustomers([]);
    setManualEmails('');
    setEmailSubject('');
    setEmailBody('');
    setSelectedTemplate(null);
    setAttachments([]);
  };

  // Upload configuration
  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    beforeUpload: (file) => {
      setAttachments((prev) => [...prev, file]);
      return false;
    },
    onRemove: (file) => {
      setAttachments((prev) => prev.filter((f) => f.uid !== file.uid));
    },
    fileList: attachments,
  };

  // Compose Tab Content
  const ComposeTab = (
    <div className={styles.composeContainer}>
      {/* Send To Type Selection */}
      <Card className={styles.sectionCard}>
        <div className={styles.cardHeader}>
          <h3>
            <UserAddOutlined />
            <span>{language === 'ar' ? 'المستلمون' : 'Recipients'}</span>
          </h3>
        </div>

        <Space vertical style={{ width: '100%' }} size="large">
          {/* Radio Selection */}
          <div className={styles.radioGroup}>
            <Button
              type={sendToType === 'customers' ? 'primary' : 'default'}
              onClick={() => setSendToType('customers')}
              icon={<TeamOutlined />}
            >
              {language === 'ar' ? 'إرسال للعملاء' : 'Send to Customers'}
            </Button>
            <Button
              type={sendToType === 'manual' ? 'primary' : 'default'}
              onClick={() => setSendToType('manual')}
              icon={<MailOutlined />}
            >
              {language === 'ar' ? 'إدخال يدوي' : 'Manual Entry'}
            </Button>
          </div>

          {/* Customer Selection */}
          {sendToType === 'customers' && (
            <>
              {/* Filters */}
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={8}>
                  <label className={styles.label}>
                    {language === 'ar' ? 'الجنسية' : 'Nationality'}
                  </label>
                  <Select
                    mode="multiple"
                    placeholder={language === 'ar' ? 'اختر الجنسية' : 'Select Nationality'}
                    style={{ width: '100%' }}
                    value={nationalityFilter}
                    onChange={setNationalityFilter}
                  >
                    <Option value="Egypt">{language === 'ar' ? 'مصر' : 'Egypt'}</Option>
                    <Option value="Philippines">
                      {language === 'ar' ? 'الفلبين' : 'Philippines'}
                    </Option>
                    <Option value="Sudan">{language === 'ar' ? 'السودان' : 'Sudan'}</Option>
                    <Option value="Kenya">{language === 'ar' ? 'كينيا' : 'Kenya'}</Option>
                    <Option value="India">{language === 'ar' ? 'الهند' : 'India'}</Option>
                  </Select>
                </Col>

                <Col xs={24} sm={12} lg={8}>
                  <label className={styles.label}>
                    {language === 'ar' ? 'نوع العقد' : 'Contract Type'}
                  </label>
                  <Select
                    mode="multiple"
                    placeholder={language === 'ar' ? 'اختر نوع العقد' : 'Select Contract Type'}
                    style={{ width: '100%' }}
                    value={contractTypeFilter}
                    onChange={setContractTypeFilter}
                  >
                    <Option value="Mediation">{language === 'ar' ? 'وساطة' : 'Mediation'}</Option>
                    <Option value="Rent">{language === 'ar' ? 'إيجار' : 'Rent'}</Option>
                  </Select>
                </Col>

                <Col xs={24} sm={12} lg={8}>
                  <label className={styles.label}>{language === 'ar' ? 'الفرع' : 'Branch'}</label>
                  <Select
                    mode="multiple"
                    placeholder={language === 'ar' ? 'اختر الفرع' : 'Select Branch'}
                    style={{ width: '100%' }}
                    value={branchFilter}
                    onChange={setBranchFilter}
                  >
                    <Option value="Riyadh">{language === 'ar' ? 'الرياض' : 'Riyadh'}</Option>
                    <Option value="Jeddah">{language === 'ar' ? 'جدة' : 'Jeddah'}</Option>
                    <Option value="Dammam">{language === 'ar' ? 'الدمام' : 'Dammam'}</Option>
                  </Select>
                </Col>
              </Row>

              {/* Customer List */}
              <div className={styles.customerList}>
                <div className={styles.listHeader}>
                  <Checkbox
                    checked={
                      selectedCustomers.length === filteredCustomers.length &&
                      filteredCustomers.length > 0
                    }
                    indeterminate={
                      selectedCustomers.length > 0 &&
                      selectedCustomers.length < filteredCustomers.length
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCustomers(filteredCustomers.map((c) => c.id));
                      } else {
                        setSelectedCustomers([]);
                      }
                    }}
                  >
                    <strong>
                      {language === 'ar' ? 'تحديد الكل' : 'Select All'} ({filteredCustomers.length})
                    </strong>
                  </Checkbox>
                </div>
                <div className={styles.customerGrid}>
                  {filteredCustomers.map((customer) => (
                    <div key={customer.id} className={styles.customerCard}>
                      <Checkbox
                        checked={selectedCustomers.includes(customer.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCustomers([...selectedCustomers, customer.id]);
                          } else {
                            setSelectedCustomers(
                              selectedCustomers.filter((id) => id !== customer.id)
                            );
                          }
                        }}
                      >
                        <div className={styles.customerInfo}>
                          <div className={styles.customerName}>
                            {language === 'ar' ? customer.nameAr : customer.name}
                          </div>
                          <div className={styles.customerEmail}>{customer.email}</div>
                          {/* <div className={styles.customerTags}>
                            <Tag color="blue">
                              {language === 'ar' ? customer.nationalityAr : customer.nationality}
                            </Tag>
                          </div> */}
                        </div>
                      </Checkbox>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Manual Email Entry */}
          {sendToType === 'manual' && (
            <div>
              <label className={styles.label}>
                {language === 'ar'
                  ? 'عناوين البريد الإلكتروني (مفصولة بفاصلة)'
                  : 'Email Addresses (comma-separated)'}
              </label>
              <TextArea
                rows={4}
                placeholder={
                  language === 'ar'
                    ? 'example1@email.com, example2@email.com'
                    : 'example1@email.com, example2@email.com'
                }
                value={manualEmails}
                onChange={(e) => setManualEmails(e.target.value)}
              />
              <div className={styles.helperText}>
                {language === 'ar'
                  ? `عدد العناوين: ${manualEmails.split(',').filter((e) => e.trim()).length}`
                  : `Email count: ${manualEmails.split(',').filter((e) => e.trim()).length}`}
              </div>
            </div>
          )}
        </Space>
      </Card>

      {/* Email Content */}
      <Card className={styles.sectionCard}>
        <div className={styles.cardHeader}>
          <h3>
            <FileTextOutlined />
            <span>{language === 'ar' ? 'محتوى البريد الإلكتروني' : 'Email Content'}</span>
          </h3>
        </div>

        <Space vertical style={{ width: '100%' }} size="large">
          {/* Template Selector */}
          <div>
            <label className={styles.label}>
              {language === 'ar' ? 'استخدام قالب' : 'Use Template'}
            </label>
            <Select
              placeholder={language === 'ar' ? 'اختر قالب' : 'Select Template'}
              style={{ width: '100%' }}
              value={selectedTemplate}
              onChange={handleTemplateSelect}
              allowClear
            >
              {emailTemplates.map((template) => (
                <Option key={template.id} value={template.id}>
                  <div>
                    <strong>{language === 'ar' ? template.nameAr : template.name}</strong>
                    <Tag color="blue" style={{ marginLeft: 8 }}>
                      {language === 'ar' ? template.categoryAr : template.category}
                    </Tag>
                  </div>
                </Option>
              ))}
            </Select>
          </div>

          {/* Subject */}
          <div>
            <label className={styles.label}>
              {language === 'ar' ? 'موضوع البريد الإلكتروني' : 'Email Subject'}
            </label>
            <Input
              placeholder={
                language === 'ar' ? 'أدخل موضوع البريد الإلكتروني' : 'Enter email subject'
              }
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              size="large"
            />
          </div>

          {/* Body */}
          <div>
            <label className={styles.label}>
              {language === 'ar' ? 'محتوى البريد الإلكتروني' : 'Email Body'}
            </label>
            <TextArea
              rows={10}
              placeholder={language === 'ar' ? 'أدخل محتوى البريد الإلكتروني' : 'Enter email body'}
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
            />
          </div>

          {/* Attachments */}
          <div>
            <label className={styles.label}>{language === 'ar' ? 'المرفقات' : 'Attachments'}</label>
            <Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                {language === 'ar'
                  ? 'انقر أو اسحب الملفات إلى هذه المنطقة للتحميل'
                  : 'Click or drag files to this area to upload'}
              </p>
              <p className="ant-upload-hint">
                {language === 'ar'
                  ? 'يدعم التحميل المفرد أو المتعدد'
                  : 'Support for single or bulk upload'}
              </p>
            </Dragger>
          </div>

          {/* Action Buttons */}
          <div className={styles.actionButtons}>
            <Button type="primary" size="large" icon={<SendOutlined />} onClick={handleSendEmail}>
              {language === 'ar' ? 'إرسال' : 'Send Email'}
            </Button>
            <Button size="large" icon={<ClearOutlined />} onClick={handleClearForm}>
              {language === 'ar' ? 'مسح' : 'Clear'}
            </Button>
          </div>
        </Space>
      </Card>
    </div>
  );

  // Templates Tab Content
  const TemplatesTab = (
    <div className={styles.templatesContainer}>
      <Row gutter={[16, 16]}>
        {emailTemplates.map((template) => (
          <Col key={template.id} xs={24} sm={12} lg={8}>
            <Card
              className={styles.templateCard}
              hoverable
              onClick={() => {
                setActiveTab('compose');
                handleTemplateSelect(template.id);
              }}
            >
              <div className={styles.templateHeader}>
                <h3>{language === 'ar' ? template.nameAr : template.name}</h3>
                <Tag color="blue">
                  {language === 'ar' ? template.categoryAr : template.category}
                </Tag>
              </div>
              <div className={styles.templateSubject}>
                <strong>{language === 'ar' ? 'الموضوع:' : 'Subject:'}</strong>
                <p>{language === 'ar' ? template.subjectAr : template.subject}</p>
              </div>
              <div className={styles.templateBody}>
                <strong>{language === 'ar' ? 'المحتوى:' : 'Content:'}</strong>
                <p>{(language === 'ar' ? template.bodyAr : template.body).substring(0, 100)}...</p>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );

  // History Tab Content
  const HistoryTab = (
    <div className={styles.historyContainer}>
      <Space vertical style={{ width: '100%' }} size="middle">
        {sentEmails.map((email) => (
          <Card key={email.id} className={styles.historyCard}>
            <Row gutter={16} align="middle">
              <Col xs={24} sm={12} md={10}>
                <div className={styles.historySubject}>
                  <MailOutlined />
                  <span>{language === 'ar' ? email.subjectAr : email.subject}</span>
                </div>
              </Col>
              <Col xs={12} sm={6} md={4}>
                <div className={styles.historyInfo}>
                  <TeamOutlined />
                  <span>
                    {email.recipients} {language === 'ar' ? 'مستلم' : 'recipients'}
                  </span>
                </div>
              </Col>
              <Col xs={12} sm={6} md={4}>
                <div className={styles.historyInfo}>
                  <PaperClipOutlined />
                  <span>
                    {email.attachments} {language === 'ar' ? 'مرفق' : 'attachments'}
                  </span>
                </div>
              </Col>
              <Col xs={12} sm={6} md={3}>
                <Badge
                  status={email.status === 'Delivered' ? 'success' : 'processing'}
                  text={language === 'ar' ? email.statusAr : email.status}
                />
              </Col>
              <Col xs={12} sm={6} md={3}>
                <div className={styles.historyDate}>
                  <ClockCircleOutlined />
                  <span>{email.sentDate}</span>
                </div>
              </Col>
            </Row>
          </Card>
        ))}
      </Space>
    </div>
  );

  // Tab items
  const tabItems: TabsProps['items'] = [
    {
      key: 'compose',
      label: (
        <span>
          <MailOutlined />
          {language === 'ar' ? 'إنشاء بريد' : 'Compose'}
        </span>
      ),
      children: ComposeTab,
    },
    {
      key: 'templates',
      label: (
        <span>
          <FileTextOutlined />
          {language === 'ar' ? 'القوالب' : 'Templates'}
        </span>
      ),
      children: TemplatesTab,
    },
    {
      key: 'history',
      label: (
        <span>
          <HistoryOutlined />
          {language === 'ar' ? 'السجل' : 'History'}
        </span>
      ),
      children: HistoryTab,
    },
  ];

  return (
    <div className={styles.pageContainer}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <h1>
          <MailOutlined />
          <span>{language === 'ar' ? 'إرسال البريد الإلكتروني' : 'Send Email'}</span>
        </h1>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className={styles.statsRow}>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={language === 'ar' ? 'إجمالي المرسل' : 'Total Sent'}
              value={statistics.totalSent}
              prefix={<MailOutlined />}
              valueStyle={{ color: '#003366' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={language === 'ar' ? 'اليوم' : 'Today'}
              value={statistics.todaySent}
              prefix={<SendOutlined />}
              valueStyle={{ color: '#00AA64' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <Statistic
              title={language === 'ar' ? 'قيد الانتظار' : 'Pending'}
              value={statistics.pending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <div>
              <div className={styles.statTitle}>
                {language === 'ar' ? 'معدل التسليم' : 'Delivery Rate'}
              </div>
              <div className={styles.progressValue}>{statistics.deliveryRate}%</div>
              <Progress percent={statistics.deliveryRate} strokeColor="#00AA64" showInfo={false} />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Main Content Card */}
      <Card className={styles.mainCard}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          className={styles.tabs}
          size="large"
        />
      </Card>
    </div>
  );
}
