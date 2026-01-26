'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import {
  Card,
  Collapse,
  Table,
  Button,
  Modal,
  Form,
  Select,
  Input,
  message,
  Row,
  Col,
  Statistic,
  Tag,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined, FileTextOutlined } from '@ant-design/icons';
import styles from './ReportGenerator.module.css';

const mockGroupsAr = [
  {
    id: 1,
    screenNumber: 3,
    screenName: 'التوسط',
    reportCount: 2,
    reports: [
      { id: 2818, name: 'وكلاء', title: 'وكلاء' },
      { id: 2832, name: 'تقرير عام الوكلاء', title: 'تقرير عام الوكلاء' },
    ],
  },
  {
    id: 2,
    screenNumber: 6,
    screenName: 'تقرير الوصول',
    reportCount: 7,
    reports: [
      { id: 253, name: 'وصول', title: 'وصول' },
      { id: 360, name: 'عقود التوسط', title: 'عقود التوسط' },
      { id: 507, name: 'تقرير عمالة أوغندية', title: 'تقرير عمالة أوغندية' },
      { id: 1649, name: 'احصائية المدن', title: 'احصائية المدن' },
      { id: 1664, name: 'تقرير حالة ووصول العمالة الفلبينية', title: 'arrival' },
      { id: 2862, name: 'تقرير وصول مع المدة الإستقدام', title: 'تقرير وصول مع المدة الإستقدام' },
      { id: 3267, name: 'تقرير وصول الرياض', title: 'تقرير وصول الرياض' },
    ],
  },
];

const mockGroupsEn = [
  {
    id: 1,
    screenNumber: 3,
    screenName: 'Mediation',
    reportCount: 2,
    reports: [
      { id: 2818, name: 'Agents', title: 'Agents' },
      { id: 2832, name: 'General Agents Report', title: 'General Agents Report' },
    ],
  },
  {
    id: 2,
    screenNumber: 6,
    screenName: 'Arrival Report',
    reportCount: 7,
    reports: [
      { id: 253, name: 'Arrival', title: 'Arrival' },
      { id: 360, name: 'Mediation Contracts', title: 'Mediation Contracts' },
      { id: 507, name: 'Ugandan Labor Report', title: 'Ugandan Labor Report' },
      { id: 1649, name: 'Cities Statistics', title: 'Cities Statistics' },
      { id: 1664, name: 'Philippines Labor Status & Arrival', title: 'Arrival' },
      {
        id: 2862,
        name: 'Arrival with Recruitment Duration',
        title: 'Arrival with Recruitment Duration',
      },
      { id: 3267, name: 'Riyadh Arrival Report', title: 'Riyadh Arrival Report' },
    ],
  },
];

const parentOptionsAr = [
  { value: 0, label: 'اختر شيئ' },
  { value: 1, label: 'التوسط' },
  { value: 2, label: 'التشغيل' },
  { value: 7, label: 'الزيارات' },
  { value: 18, label: 'طلبات الاستقدام' },
];
const parentOptionsEn = [
  { value: 0, label: 'Select' },
  { value: 1, label: 'Mediation' },
  { value: 2, label: 'Operation' },
  { value: 7, label: 'Visits' },
  { value: 18, label: 'Recruitment Requests' },
];

const reportTypeOptionsAr: Record<string, { value: number; label: string }[]> = {
  '1': [
    { value: 1, label: 'الوكلاء' },
    { value: 6, label: 'العملاء' },
    { value: 3, label: 'الشكاوى' },
    { value: 4, label: 'طلبات التاشيرات' },
    { value: 5, label: 'عقود التوسط' },
    { value: 7, label: 'الحسابات' },
    { value: 13, label: 'ادارة العمالة' },
  ],
  '2': [{ value: 9, label: 'عقود التشغيل' }],
  '7': [
    { value: 10, label: 'عقود الزيارات' },
    { value: 11, label: 'متابعة الزيارات' },
    { value: 12, label: 'تقرير عمالة الزيارات' },
  ],
  '18': [{ value: 15, label: 'طلبات الاستقدام' }],
};
const reportTypeOptionsEn: Record<string, { value: number; label: string }[]> = {
  '1': [
    { value: 1, label: 'Agents' },
    { value: 6, label: 'Clients' },
    { value: 3, label: 'Complaints' },
    { value: 4, label: 'Visa Requests' },
    { value: 5, label: 'Mediation Contracts' },
    { value: 7, label: 'Accounts' },
    { value: 13, label: 'Labor Management' },
  ],
  '2': [{ value: 9, label: 'Operation Contracts' }],
  '7': [
    { value: 10, label: 'Visit Contracts' },
    { value: 11, label: 'Visit Follow-up' },
    { value: 12, label: 'Visit Labor Report' },
  ],
  '18': [{ value: 15, label: 'Recruitment Requests' }],
};

interface ReportRow {
  id: number;
  name: string;
  title: string;
}

const ReportGeneratorPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [selectedParent, setSelectedParent] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const language = useAuthStore((state) => state.language);

  // Table columns
  const columns: ColumnsType<ReportRow> = [
    {
      title: language === 'ar' ? 'رقم التقرير' : 'Report ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: 120,
      render: (id: number) => <Tag color="blue">{id}</Tag>,
    },
    {
      title: language === 'ar' ? 'اسم التقرير' : 'Report Name',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: language === 'ar' ? 'عنوان التقرير عربى' : 'Report Title',
      dataIndex: 'title',
      key: 'title',
      align: 'center',
    },
    {
      title: language === 'ar' ? 'الإجراءات' : 'Actions',
      key: 'actions',
      align: 'center',
      render: (_: unknown, record: ReportRow) => (
        <>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() =>
              message.info(
                language === 'ar' ? `تعديل التقرير ${record.id}` : `Edit report ${record.id}`
              )
            }
            style={{ marginInlineEnd: 8 }}
          >
            {language === 'ar' ? 'تعديل' : 'Edit'}
          </Button>
          <Button
            type="link"
            icon={<DeleteOutlined />}
            danger
            onClick={() =>
              message.info(
                language === 'ar' ? `حذف التقرير ${record.id}` : `Delete report ${record.id}`
              )
            }
          >
            {language === 'ar' ? 'حذف' : 'Delete'}
          </Button>
        </>
      ),
    },
  ];

  // Modal handlers
  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
    form.resetFields();
    setSelectedParent(0);
  };
  const handleParentChange = (value: number) => {
    setSelectedParent(value);
    form.setFieldsValue({ reportType: undefined });
  };
  const handleAddReport = (_values: any) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success('تمت إضافة التقرير بنجاح (وهمية)');
      closeModal();
    }, 1000);
  };

  return (
    <div className={styles.pageContainer} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerIcon}>
            <FileTextOutlined />
          </div>
          <div className={styles.headerText}>
            <h1 className={styles.headerTitle}>
              {language === 'ar' ? 'انشاء تقارير' : 'Report Generator'}
            </h1>
            <div className={styles.headerSubtitle}>
              {language === 'ar'
                ? 'قم بإدارة وإنشاء تقارير النظام بسهولة من هنا'
                : 'Easily manage and create system reports here'}
            </div>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className={styles.addBtn}
            onClick={openModal}
            size="large"
          >
            {language === 'ar' ? 'إضافة تقرير' : 'Add Report'}
          </Button>
        </div>
      </div>

      <Row gutter={[16, 16]} className={styles.statsRow}>
        {(language === 'ar' ? mockGroupsAr : mockGroupsEn).map((group) => (
          <Col xs={24} sm={12} md={8} lg={6} key={group.id}>
            <Card className={styles.statCard} bordered={false}>
              <Statistic
                title={<span style={{ fontWeight: 600 }}>{group.screenName}</span>}
                value={group.reportCount}
                valueStyle={{ color: '#003366', fontWeight: 700 }}
                prefix={<FileTextOutlined style={{ color: '#00478c' }} />}
                suffix={
                  <span style={{ fontSize: 14 }}>{language === 'ar' ? 'تقارير' : 'Reports'}</span>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Card className={styles.mainCard} bordered={false}>
        <Collapse
          accordion
          className={styles.collapse}
          expandIconPosition={language === 'ar' ? 'end' : 'start'}
          style={{ background: 'transparent' }}
        >
          {(language === 'ar' ? mockGroupsAr : mockGroupsEn).map((group) => (
            <Collapse.Panel
              header={
                <div className={styles.groupHeader}>
                  <span className={styles.groupScreenNumber}>{group.screenNumber}</span>
                  <span className={styles.groupScreenName}>{group.screenName}</span>
                  <span className={styles.groupReportCount}>
                    <Tag color="blue">
                      {group.reportCount} {language === 'ar' ? 'تقارير' : 'Reports'}
                    </Tag>
                  </span>
                </div>
              }
              key={group.id}
              className={styles.groupPanel}
            >
              <Table
                className={styles.dataTable}
                columns={columns}
                dataSource={group.reports}
                rowKey="id"
                pagination={false}
                scroll={{ x: true }}
                bordered
              />
            </Collapse.Panel>
          ))}
        </Collapse>
      </Card>

      <Modal
        open={modalOpen}
        onCancel={closeModal}
        title={
          <span style={{ fontWeight: 700 }}>
            {language === 'ar' ? 'إضافة تقرير جديد' : 'Add New Report'}
          </span>
        }
        className={styles.entityModal}
        footer={null}
        centered
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddReport}
          className={styles.entityForm}
        >
          <Form.Item
            name="parent"
            label={language === 'ar' ? 'نوع الشاشة' : 'Screen Type'}
            rules={[
              {
                required: true,
                message:
                  language === 'ar' ? 'يرجى اختيار نوع الشاشة' : 'Please select a screen type',
              },
            ]}
          >
            <Select
              options={language === 'ar' ? parentOptionsAr : parentOptionsEn}
              onChange={handleParentChange}
              placeholder={language === 'ar' ? 'اختر نوع الشاشة' : 'Select screen type'}
              size="large"
              showSearch
              optionFilterProp="label"
            />
          </Form.Item>
          <Form.Item
            name="reportType"
            label={language === 'ar' ? 'نوع التقرير' : 'Report Type'}
            rules={[
              {
                required: true,
                message:
                  language === 'ar' ? 'يرجى اختيار نوع التقرير' : 'Please select a report type',
              },
            ]}
          >
            <Select
              options={
                language === 'ar'
                  ? reportTypeOptionsAr[String(selectedParent)] || []
                  : reportTypeOptionsEn[String(selectedParent)] || []
              }
              placeholder={language === 'ar' ? 'اختر نوع التقرير' : 'Select report type'}
              size="large"
              showSearch
              optionFilterProp="label"
              disabled={!selectedParent || selectedParent === 0}
            />
          </Form.Item>
          <Form.Item
            name="reportName"
            label={language === 'ar' ? 'اسم التقرير' : 'Report Name'}
            rules={[
              {
                required: true,
                message: language === 'ar' ? 'يرجى إدخال اسم التقرير' : 'Please enter report name',
              },
            ]}
          >
            <Input size="large" placeholder={language === 'ar' ? 'اسم التقرير' : 'Report Name'} />
          </Form.Item>
          <Form.Item
            name="reportTitle"
            label={language === 'ar' ? 'عنوان التقرير عربى' : 'Report Title'}
            rules={[
              {
                required: true,
                message:
                  language === 'ar' ? 'يرجى إدخال عنوان التقرير' : 'Please enter report title',
              },
            ]}
          >
            <Input
              size="large"
              placeholder={language === 'ar' ? 'عنوان التقرير عربى' : 'Report Title'}
            />
          </Form.Item>
          <Form.Item style={{ textAlign: language === 'ar' ? 'left' : 'right' }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ minWidth: 120, marginInlineEnd: 8 }}
            >
              {language === 'ar' ? 'إضافة' : 'Add'}
            </Button>
            <Button onClick={closeModal} style={{ minWidth: 100 }}>
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ReportGeneratorPage;
