'use client';

import React, { useState, useMemo } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Input,
  Select,
  Switch,
  Form,
  Divider,
  Space,
  message,
  Spin,
  Empty,
} from 'antd';
import {
  SaveOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  AppstoreOutlined,
  CalculatorOutlined,
} from '@ant-design/icons';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useEmploymentContractOffers } from '@/hooks/api/useEmploymentContractOffers';
import { useBranches } from '@/hooks/api/useBranches';
import { useJobs } from '@/hooks/api/useJobs';
import styles from '../RentPricesOffers.module.css';

// Period types with months count
const periodTypes = [
  { id: 46, monthsCount: 1, label: { ar: 'Ø´Ù‡Ø±ÙŠ', en: 'Monthly' } },
  { id: 52, monthsCount: 3, label: { ar: 'Ø±Ø¨Ø¹ Ø³Ù†ÙˆÙŠ', en: 'Quarterly' } },
  { id: 53, monthsCount: 6, label: { ar: 'Ù†ØµÙ Ø³Ù†ÙˆÙŠ', en: 'Semi-Annual' } },
  { id: 189, monthsCount: 12, label: { ar: 'Ø³Ù†ÙˆÙŠ', en: 'Annual' } },
  { id: 190, monthsCount: 1, label: { ar: 'Ø§Ø«ÙŠÙˆØ¨ÙŠØ§', en: 'Ethiopia' } },
];

const nationalityOptions = [
  { value: 0, label: { ar: 'Ø§Ù„ÙƒÙ„', en: 'All' } },
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

const experienceOptions = [
  { value: 0, label: { ar: 'Ø§Ù„ÙƒÙ„', en: 'All' } },
  { value: 1, label: { ar: 'Ø³Ø¨Ù‚ Ù„Ù‡ Ø§Ù„Ø¹Ù…Ù„', en: 'Has Experience' } },
  { value: 2, label: { ar: 'Ù„Ù… ÙŠØ³Ø¨Ù‚ Ù„Ù‡ Ø§Ù„Ø¹Ù…Ù„', en: 'No Experience' } },
];

export default function AddPackageOfferPage() {
  const language = useAuthStore((state) => state.language);
  const router = useRouter();
  const searchParams = useSearchParams();
  const offerType = searchParams.get('type') || '1';
  const [form] = Form.useForm();

  const { createOfferAsync } = useEmploymentContractOffers();
  const { branches } = useBranches();
  const { data: jobsData, isLoading: isLoadingJobs } = useJobs();

  // Safely extract jobs array from API response and filter active jobs only
  const jobs = useMemo(() => {
    if (!jobsData) return [];
    let jobsArray: any[] = [];

    if (Array.isArray(jobsData)) {
      jobsArray = jobsData;
    } else if (
      typeof jobsData === 'object' &&
      'data' in jobsData &&
      Array.isArray((jobsData as any).data)
    ) {
      jobsArray = (jobsData as any).data;
    }

    // Filter to only include active jobs
    return jobsArray.filter((job: any) => job.isActive === true);
  }, [jobsData]);

  // Form state for live calculation
  const [cost, setCost] = useState<number>(0);
  const [insurance, setInsurance] = useState<number>(0);
  const [applicantSalary, setApplicantSalary] = useState<number>(0);
  const [selectedPeriodId, setSelectedPeriodId] = useState<number>(periodTypes[0].id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = (key: string) => {
    const translations: { [key: string]: { ar: string; en: string } } = {
      pageTitle: { ar: 'Ø¥Ø¶Ø§ÙØ© Ø¹Ø±Ø¶ Ø¨Ø§Ù‚Ø§Øª', en: 'Add Package Offer' },
      typeDuration: { ar: 'Ø¹Ø±Ø¶ Ø¨Ø§Ù‚Ø§Øª - Ù…Ø¯Ø©', en: 'Package Offer - Duration' },
      typeServiceTransfer: {
        ar: 'Ø¹Ø±Ø¶ Ø¨Ø§Ù‚Ø§Øª - Ù†Ù‚Ù„ Ø®Ø¯Ù…Ø§Øª',
        en: 'Package Offer - Service Transfer',
      },
      offerTitle: { ar: 'Ø¹Ù†ÙˆØ§Ù† Ø§Ù„Ø¹Ø±Ø¶', en: 'Offer Title' },
      offerTitleRequired: { ar: 'Ø¹Ù†ÙˆØ§Ù† Ø§Ù„Ø¹Ø±Ø¶ Ù…Ø·Ù„ÙˆØ¨', en: 'Offer title is required' },
      nationality: { ar: 'Ø§Ù„Ø¬Ù†Ø³ÙŠØ©', en: 'Nationality' },
      nationalityRequired: { ar: 'Ø§Ù„Ø¬Ù†Ø³ÙŠØ© Ù…Ø·Ù„ÙˆØ¨Ø©', en: 'Nationality is required' },
      job: { ar: 'Ø§Ù„ÙˆØ¸ÙŠÙØ©', en: 'Job' },
      jobRequired: { ar: 'Ø§Ù„ÙˆØ¸ÙŠÙØ© Ù…Ø·Ù„ÙˆØ¨Ø©', en: 'Job is required' },
      branch: { ar: 'Ø§Ù„ÙØ±Ø¹', en: 'Branch' },
      allBranches: { ar: 'Ø¬Ù…ÙŠØ¹ Ø§Ù„ÙØ±ÙˆØ¹', en: 'All Branches' },
      duration: { ar: 'Ø§Ù„Ù…Ø¯Ø©', en: 'Duration' },
      durationRequired: { ar: 'Ø§Ù„Ù…Ø¯Ø© Ù…Ø·Ù„ÙˆØ¨Ø©', en: 'Duration is required' },
      showForExternalCustomers: {
        ar: 'Ø¥Ø¸Ù‡Ø§Ø± Ù„Ù„Ø¹Ù…Ù„Ø§Ø¡ Ø§Ù„Ø®Ø§Ø±Ø¬ÙŠÙŠÙ†',
        en: 'Show for External Customers',
      },
      showForReception: { ar: 'ÙŠØ¸Ù‡Ø± Ù„Ù„Ø§Ø³ØªÙ‚Ø¨Ø§Ù„', en: 'Show for Reception' },
      activate: { ar: 'ØªÙØ¹ÙŠÙ„', en: 'Activate' },
      officeCost: { ar: 'ØªÙƒÙ„ÙØ© Ø§Ù„Ù…ÙƒØªØ¨', en: 'Office Cost' },
      costLabel: { ar: 'Ø§Ù„ØªÙƒÙ„ÙØ©', en: 'Cost' },
      costDescription: {
        ar: 'ÙŠÙ‚ØµØ¯ Ø¨Ø§Ù„ØªÙƒØ§Ù„ÙŠÙ Ø§Ù„Ù…Ø­Ù„ÙŠØ© Ù„Ù„ØªØ´ØºÙŠÙ„ (ØªÙƒØ§Ù„ÙŠÙ Ø§Ø¯Ø§Ø±Ø© Ø§Ù„Ù…ÙƒØªØ¨ . Ø§Ù„Ø§Ø±Ø¨Ø§Ø­)',
        en: 'Local operating costs (office management costs, profits)',
      },
      excludingTaxAndSalary: {
        ar: 'ØºÙŠØ± Ø´Ø§Ù…Ù„ Ø±Ø§ØªØ¨ Ø§Ù„Ø¹Ø§Ù…Ù„ Ùˆ ØºÙŠØ± Ø´Ø§Ù…Ù„ Ø§Ù„Ø¶Ø±ÙŠØ¨Ø©',
        en: 'Excluding worker salary and tax',
      },
      excludingTax: { ar: 'ØºÙŠØ± Ø´Ø§Ù…Ù„ Ø§Ù„Ø¶Ø±ÙŠØ¨Ø©', en: 'Excluding tax' },
      costTax: { ar: 'Ø¶Ø±ÙŠØ¨Ø© Ø§Ù„ØªÙƒØ§Ù„ÙŠÙ', en: 'Cost Tax' },
      insuranceLabel: { ar: 'Ø§Ù„ØªØ£Ù…ÙŠÙ†', en: 'Insurance' },
      previousExperience: { ar: 'Ø³Ø¨Ù‚ Ù„Ù‡ Ø§Ù„Ø¹Ù…Ù„', en: 'Previous Experience' },
      salarySection: { ar: 'Ø§Ù„Ø±ÙˆØ§ØªØ¨', en: 'Salaries' },
      workerSalary: { ar: 'Ø±Ø§ØªØ¨ Ø§Ù„Ø¹Ø§Ù…Ù„Ø©', en: 'Worker Salary' },
      monthlySalary: { ar: 'Ø±Ø§ØªØ¨ Ø§Ù„Ø¹Ø§Ù…Ù„Ø© Ø§Ù„Ø´Ù‡Ø±ÙŠ', en: "Worker's monthly salary" },
      totalCostWithTax: { ar: 'Ø§Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„ØªÙƒØ§Ù„ÙŠÙ Ø´Ø§Ù…Ù„ Ø§Ù„Ø¶Ø±ÙŠØ¨Ø©', en: 'Total Cost Including Tax' },
      offerSummary: { ar: 'Ø§Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ø¹Ø±Ø¶', en: 'Offer Summary' },
      officeCostSummary: { ar: 'ØªÙƒÙ„ÙØ© Ø§Ù„Ù…ÙƒØªØ¨', en: 'Office Cost' },
      costTaxSummary: { ar: 'Ø¶Ø±ÙŠØ¨Ø© Ø§Ù„ØªÙƒÙ„ÙØ©', en: 'Cost Tax' },
      insuranceAmount: { ar: 'Ù…Ø¨Ù„Øº Ø§Ù„ØªØ£Ù…ÙŠÙ†', en: 'Insurance Amount' },
      workerSalarySummary: { ar: 'Ø±Ø§ØªØ¨ Ø§Ù„Ø¹Ø§Ù…Ù„', en: 'Worker Salary' },
      save: { ar: 'Ø­ÙØ¸', en: 'Save' },
      back: { ar: 'Ø±Ø¬ÙˆØ¹', en: 'Back' },
      choose: { ar: 'Ø§Ø®ØªØ±', en: 'Choose' },
      createSuccess: {
        ar: 'ØªÙ… Ø¥Ù†Ø´Ø§Ø¡ Ø¹Ø±Ø¶ Ø§Ù„Ø¨Ø§Ù‚Ø§Øª Ø¨Ù†Ø¬Ø§Ø­',
        en: 'Package offer created successfully',
      },
      createError: { ar: 'Ø­Ø¯Ø« Ø®Ø·Ø£ Ø£Ø«Ù†Ø§Ø¡ Ø§Ù„Ø¥Ù†Ø´Ø§Ø¡', en: 'Error creating package offer' },
      offersCount: { ar: 'Ø¹Ø¯Ø¯ Ø§Ù„Ø¹Ø±ÙˆØ¶', en: 'Offers Count' },
      packageCount: { ar: 'Ø¹Ø¯Ø¯ Ø§Ù„Ø¨Ø§Ù‚Ø§Øª', en: 'Package Count' },
    };
    return translations[key]?.[language] || key;
  };

  const getOfferTypeLabel = () => {
    if (offerType === '1') return t('typeDuration');
    if (offerType === '3') return t('typeServiceTransfer');
    return t('typeDuration');
  };

  // Calculate price
  const selectedPeriod = periodTypes.find((p) => p.id === selectedPeriodId);
  const monthsCount = offerType === '1' ? selectedPeriod?.monthsCount || 1 : 1;

  const calculation = useMemo(() => {
    const taxAmount = cost * 0.15;
    const totalAmountBeforeSalary = Math.round(cost + taxAmount);
    const adjustedTax = totalAmountBeforeSalary - cost;
    const salaryTotal = applicantSalary * monthsCount;
    const total = totalAmountBeforeSalary + salaryTotal + insurance;
    return {
      cost,
      taxAmount: adjustedTax,
      insurance,
      salaryTotal,
      total,
    };
  }, [cost, insurance, applicantSalary, monthsCount]);

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      await createOfferAsync({
        offerType: parseInt(offerType),
        offerContractType: 1, // Standard contract
        offerTitle: values.offerTitle,
        nationalityId: values.nationalityId,
        jobId: values.jobId,
        branchId: values.branchId || null,
        duration: offerType === '1' ? selectedPeriodId : 0,
        cost: cost,
        costTax: calculation.taxAmount,
        insurance: insurance,
        workerSalary: applicantSalary,
        totalCostWithTax: calculation.total,
        showForExternalCustomers: values.showForExternalCustomers || false,
        showForReception: values.showForReception || false,
        isActive: values.isActive || false,
        previousExperience: values.experienceIndicator || 0,
        offersCount: values.offersCount || 1,
        isPremium: true, // Package/Premium offer flag
      });
      message.success(t('createSuccess'));
      router.push('/contracts/operation/rent-prices-offers');
    } catch {
      message.error(t('createError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDurationType = offerType === '1';

  return (
    <div className={styles.offersPage}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <AppstoreOutlined className={styles.headerIcon} />
            <div>
              <h1 className={styles.pageTitle}>{t('pageTitle')}</h1>
              <p className={styles.pageSubtitle}>{getOfferTypeLabel()}</p>
            </div>
          </div>
        </div>
      </div>

      <Card className={styles.formSection}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            nationalityId: 0,
            jobId: 0,
            branchId: null,
            rentPeriodTypeId: periodTypes[0].id,
            experienceIndicator: 0,
            showForExternalCustomers: false,
            showForReception: false,
            isActive: false,
            offersCount: 1,
          }}
        >
          <Row gutter={[32, 16]}>
            {/* Left Column - Selection & Toggles */}
            <Col xs={24} md={12}>
              <Form.Item
                label={t('offerTitle')}
                name="offerTitle"
                rules={[{ required: true, message: t('offerTitleRequired') }]}
              >
                <Input size="large" placeholder={t('offerTitle')} />
              </Form.Item>

              <Form.Item
                label={t('nationality')}
                name="nationalityId"
                rules={[{ required: true, message: t('nationalityRequired') }]}
              >
                <Select
                  showSearch
                  optionFilterProp="label"
                  placeholder={t('choose')}
                  options={nationalityOptions.map((n) => ({
                    value: n.value,
                    label: n.label[language],
                  }))}
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label={t('job')}
                name="jobId"
                rules={[{ required: true, message: t('jobRequired') }]}
              >
                <Select
                  showSearch
                  loading={isLoadingJobs}
                  placeholder={t('choose')}
                  optionFilterProp="children"
                  filterOption={(input, option) => {
                    const label = String(option?.label ?? '');
                    return label.toLowerCase().includes(input.toLowerCase());
                  }}
                  options={[
                    { value: 0, label: language === 'ar' ? 'Ø§Ù„ÙƒÙ„' : 'All' },
                    ...jobs.map((job: any) => ({
                      value: job.id,
                      label:
                        language === 'ar'
                          ? job.jobNameAr || job.jobNameEn || `Job ${job.id}`
                          : job.jobNameEn || job.jobNameAr || `Job ${job.id}`,
                    })),
                  ]}
                  notFoundContent={
                    isLoadingJobs ? (
                      <Spin size="small" />
                    ) : (
                      <Empty
                        description={language === 'ar' ? 'Ù„Ø§ ØªÙˆØ¬Ø¯ Ù…Ù‡Ù†' : 'No jobs available'}
                      />
                    )
                  }
                  size="large"
                />
              </Form.Item>

              <Form.Item label={t('branch')} name="branchId">
                <Select
                  showSearch
                  optionFilterProp="label"
                  placeholder={t('allBranches')}
                  allowClear
                  options={[
                    { value: null, label: t('allBranches') },
                    ...(branches || []).map((b) => ({
                      value: b.id,
                      label: language === 'ar' ? b.nameAr : b.nameEn,
                    })),
                  ]}
                  size="large"
                />
              </Form.Item>

              {isDurationType && (
                <Form.Item
                  label={t('duration')}
                  name="rentPeriodTypeId"
                  rules={[{ required: true, message: t('durationRequired') }]}
                >
                  <Select
                    size="large"
                    onChange={(value) => setSelectedPeriodId(value)}
                    options={periodTypes.map((p) => ({
                      value: p.id,
                      label: p.label[language],
                    }))}
                  />
                </Form.Item>
              )}

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label={t('offersCount')} name="offersCount">
                    <Input type="number" size="large" min={1} defaultValue={1} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={t('packageCount')} name="packageCount">
                    <Input type="number" size="large" min={1} defaultValue={1} />
                  </Form.Item>
                </Col>
              </Row>

              <Divider />

              <Form.Item
                label={t('showForExternalCustomers')}
                name="showForExternalCustomers"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                label={t('showForReception')}
                name="showForReception"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item label={t('activate')} name="isActive" valuePropName="checked">
                <Switch />
              </Form.Item>

              <Divider />

              {/* Offer Summary */}
              <div className={styles.priceDisplay}>
                <h3 style={{ textAlign: 'center', marginBottom: 16 }}>
                  <CalculatorOutlined /> {t('offerSummary')}
                </h3>
                <div className={styles.priceBreakdown}>
                  <div className={styles.priceRow}>
                    <span>{t('officeCostSummary')}</span>
                    <strong>{calculation.cost.toFixed(2)}</strong>
                  </div>
                  <div className={styles.priceRow}>
                    <span>{t('costTaxSummary')}</span>
                    <strong>{calculation.taxAmount.toFixed(2)}</strong>
                  </div>
                  <div className={styles.priceRow}>
                    <span>{t('insuranceAmount')}</span>
                    <strong>{calculation.insurance.toFixed(2)}</strong>
                  </div>
                  <div className={styles.priceRow}>
                    <span>{t('workerSalarySummary')}</span>
                    <strong>{calculation.salaryTotal.toFixed(2)}</strong>
                  </div>
                  <Divider style={{ margin: '8px 0' }} />
                  <div className={styles.priceRow}>
                    <span style={{ fontSize: 18, fontWeight: 700 }}>{t('totalCostWithTax')}</span>
                    <strong
                      style={{
                        fontSize: 24,
                        color: '#00478C',
                      }}
                    >
                      {calculation.total.toFixed(2)}
                    </strong>
                  </div>
                </div>
              </div>
            </Col>

            {/* Right Column - Pricing */}
            <Col xs={24} md={12}>
              <Card
                type="inner"
                title={
                  <span>
                    <AppstoreOutlined /> {t('officeCost')}
                  </span>
                }
                style={{ marginBottom: 16 }}
              >
                <p style={{ marginBottom: 4, fontWeight: 500 }}>
                  <strong>{t('costLabel')}</strong> ({t('costDescription')})
                </p>
                <p style={{ color: '#ef4444', marginBottom: 8, fontSize: 12 }}>
                  {t('excludingTaxAndSalary')}
                </p>
                <Form.Item name="cost" rules={[{ required: true }]}>
                  <Input
                    type="number"
                    size="large"
                    min={0}
                    value={cost}
                    onChange={(e) => setCost(parseFloat(e.target.value) || 0)}
                    addonAfter={language === 'ar' ? 'Ø±ÙŠØ§Ù„' : 'SAR'}
                  />
                </Form.Item>
                <p style={{ color: '#22c55e', fontSize: 12 }}>{t('excludingTax')}</p>
              </Card>

              <Form.Item label={t('costTax')}>
                <Input
                  type="number"
                  size="large"
                  readOnly
                  value={calculation.taxAmount.toFixed(2)}
                  addonAfter={language === 'ar' ? 'Ø±ÙŠØ§Ù„' : 'SAR'}
                  style={{ background: '#f5f5f5' }}
                />
              </Form.Item>

              <Form.Item label={t('insuranceLabel')} name="insurance">
                <Input
                  type="number"
                  size="large"
                  min={0}
                  value={insurance}
                  onChange={(e) => setInsurance(parseFloat(e.target.value) || 0)}
                  addonAfter={language === 'ar' ? 'Ø±ÙŠØ§Ù„' : 'SAR'}
                />
              </Form.Item>
              <p style={{ color: '#22c55e', fontSize: 12, marginTop: -16, marginBottom: 16 }}>
                {t('excludingTax')}
              </p>

              <Form.Item label={t('previousExperience')} name="experienceIndicator">
                <Select
                  size="large"
                  options={experienceOptions.map((e) => ({
                    value: e.value,
                    label: e.label[language],
                  }))}
                />
              </Form.Item>

              <Card
                type="inner"
                title={
                  <span>
                    <AppstoreOutlined /> {t('salarySection')}
                  </span>
                }
                style={{ marginBottom: 16 }}
              >
                <p style={{ marginBottom: 8 }}>
                  <strong>{t('workerSalary')}</strong> ({t('monthlySalary')})
                </p>
                <Form.Item name="applicantSalary" rules={[{ required: true }]}>
                  <Input
                    type="number"
                    size="large"
                    min={0}
                    value={applicantSalary}
                    onChange={(e) => setApplicantSalary(parseFloat(e.target.value) || 0)}
                    addonAfter={language === 'ar' ? 'Ø±ÙŠØ§Ù„' : 'SAR'}
                  />
                </Form.Item>
                <p style={{ color: '#22c55e', fontSize: 12 }}>{t('excludingTax')}</p>
              </Card>

              <Form.Item label={t('totalCostWithTax')}>
                <Input
                  type="number"
                  size="large"
                  readOnly
                  value={calculation.total.toFixed(2)}
                  addonAfter={language === 'ar' ? 'Ø±ÙŠØ§Ù„' : 'SAR'}
                  style={{
                    background: '#f0f9ff',
                    fontWeight: 700,
                    fontSize: 18,
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Action Buttons */}
          <Divider />
          <div style={{ textAlign: 'center' }}>
            <Space size="large">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                icon={<SaveOutlined />}
                loading={isSubmitting}
                style={{ minWidth: 150, background: '#00478C' }}
              >
                {t('save')}
              </Button>
              <Button
                size="large"
                icon={language === 'ar' ? <ArrowRightOutlined /> : <ArrowLeftOutlined />}
                onClick={() => router.push('/contracts/operation/rent-prices-offers')}
                style={{ minWidth: 150 }}
              >
                {t('back')}
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
}

