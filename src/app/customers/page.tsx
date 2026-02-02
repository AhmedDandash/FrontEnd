'use client';

import React, { useState, useMemo } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Input,
  Select,
  Spin,
  Empty,
  Modal,
  Form,
  Avatar,
  Dropdown,
} from 'antd';
import type { MenuProps } from 'antd';
import {
  UserOutlined,
  PhoneOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  IdcardOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  TeamOutlined,
  MoreOutlined,
} from '@ant-design/icons';

import { useAuthStore } from '@/store/authStore';
import { useCustomers } from '@/hooks/api/useCustomers';
import type { Customer, CreateCustomerDto, UpdateCustomerDto } from '@/types/api.types';
import styles from './Customers.module.css';

export default function CustomersPage() {
  const language = useAuthStore((state) => state.language);
  const [searchText, setSearchText] = useState('');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [form] = Form.useForm();

  // Use real API
  const {
    customers,
    isLoading,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    isCreating,
    isUpdating,
    isDeleting,
  } = useCustomers();

  const t = (key: string) => {
    const translations: { [key: string]: { ar: string; en: string } } = {
      pageTitle: { ar: 'إدارة العملاء', en: 'Customer Management' },
      totalCustomers: { ar: 'إجمالي العملاء', en: 'Total Customers' },
      addCustomer: { ar: 'إضافة عميل جديد', en: 'Add New Customer' },
      searchPlaceholder: { ar: 'البحث عن عميل...', en: 'Search customer...' },
      name: { ar: 'الاسم', en: 'Name' },
      arabicName: { ar: 'الاسم بالعربي', en: 'Arabic Name' },
      englishName: { ar: 'الاسم بالإنجليزي', en: 'English Name' },
      identityNumber: { ar: 'رقم الهوية', en: 'Identity Number' },
      nationality: { ar: 'الجنسية', en: 'Nationality' },
      mobile: { ar: 'الجوال', en: 'Mobile' },
      city: { ar: 'المدينة', en: 'City' },
      cityAr: { ar: 'المدينة بالعربي', en: 'City (Arabic)' },
      cityEn: { ar: 'المدينة بالإنجليزي', en: 'City (English)' },
      housingType: { ar: 'نوع السكن', en: 'Housing Type' },
      contactInfo: { ar: 'معلومات الاتصال', en: 'Contact Information' },
      personalInfo: { ar: 'المعلومات الشخصية', en: 'Personal Information' },
      actions: { ar: 'الإجراءات', en: 'Actions' },
      edit: { ar: 'تعديل', en: 'Edit' },
      delete: { ar: 'حذف', en: 'Delete' },
      save: { ar: 'حفظ', en: 'Save' },
      cancel: { ar: 'إلغاء', en: 'Cancel' },
      confirmDelete: {
        ar: 'هل أنت متأكد من حذف هذا العميل؟',
        en: 'Are you sure you want to delete this customer?',
      },
      deleteTitle: { ar: 'حذف العميل', en: 'Delete Customer' },
      noCustomers: { ar: 'لا يوجد عملاء', en: 'No Customers Found' },
      allCities: { ar: 'كل المدن', en: 'All Cities' },
      active: { ar: 'نشط', en: 'Active' },
      cities: { ar: 'المدن', en: 'Cities' },
    };
    return translations[key]?.[language] || key;
  };

  // Filter customers
  const filteredCustomers = useMemo(() => {
    if (!customers) return [];

    return customers.filter((customer) => {
      const matchesSearch =
        searchText === '' ||
        (customer.arabicName || '').toLowerCase().includes(searchText.toLowerCase()) ||
        (customer.identityNumber || '').includes(searchText) ||
        (customer.mobile || '').includes(searchText);

      const matchesCity =
        cityFilter === 'all' || customer.cityAr === cityFilter || customer.cityEn === cityFilter;

      return matchesSearch && matchesCity;
    });
  }, [customers, searchText, cityFilter]);

  // Get unique cities for filter
  const cities = useMemo(() => {
    if (!customers) return [];
    const citySet = new Set<string>();
    customers.forEach((c) => {
      if (c.cityAr) citySet.add(c.cityAr);
      if (c.cityEn) citySet.add(c.cityEn);
    });
    return Array.from(citySet);
  }, [customers]);

  // Handler functions
  const handleAddCustomer = () => {
    setEditingCustomer(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    form.setFieldsValue({
      arabicName: customer.arabicName,
      identityNumber: customer.identityNumber,
      nationality: customer.nationality,
      mobile: customer.mobile,
      cityAr: customer.cityAr,
      cityEn: customer.cityEn,
      housingType: customer.housingType,
    });
    setIsModalVisible(true);
  };

  const handleDeleteCustomer = (customer: Customer) => {
    Modal.confirm({
      title: t('deleteTitle'),
      content: t('confirmDelete'),
      okText: t('delete'),
      cancelText: t('cancel'),
      okButtonProps: { danger: true },
      onOk: () => {
        if (customer.id) {
          deleteCustomer(customer.id);
        }
      },
    });
  };

  const handleModalSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingCustomer && editingCustomer.id) {
        // Update existing customer
        await updateCustomer({
          id: editingCustomer.id,
          data: values as UpdateCustomerDto,
        });
      } else {
        // Create new customer
        await createCustomer(values as CreateCustomerDto);
      }

      setIsModalVisible(false);
      form.resetFields();
      setEditingCustomer(null);
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  const getActionMenu = (customer: Customer): MenuProps => ({
    items: [
      {
        key: 'edit',
        label: t('edit'),
        icon: <EditOutlined />,
        onClick: () => handleEditCustomer(customer),
      },
      {
        key: 'delete',
        label: t('delete'),
        icon: <DeleteOutlined />,
        danger: true,
        onClick: () => handleDeleteCustomer(customer),
      },
    ],
  });

  // Housing type mapping
  const getHousingType = (type: string | number | null | undefined) => {
    const housingTypes: { [key: string]: { ar: string; en: string } } = {
      '1': { ar: 'شقة', en: 'Apartment' },
      '2': { ar: 'فيلا', en: 'Villa' },
      '3': { ar: 'منزل', en: 'House' },
      '4': { ar: 'مجمع', en: 'Compound' },
    };
    const typeStr = String(type || '');
    return housingTypes[typeStr]?.[language] || typeStr;
  };

  // Nationality mapping
  const getNationality = (nationality: string | number | null | undefined) => {
    const nationalities: { [key: string]: { ar: string; en: string } } = {
      '1': { ar: 'سعودي', en: 'Saudi' },
      '2': { ar: 'مصري', en: 'Egyptian' },
      '3': { ar: 'هندي', en: 'Indian' },
      '4': { ar: 'باكستاني', en: 'Pakistani' },
      '5': { ar: 'فلبيني', en: 'Filipino' },
      '6': { ar: 'يمني', en: 'Yemeni' },
      '7': { ar: 'سوداني', en: 'Sudanese' },
      '8': { ar: 'بنغلاديشي', en: 'Bangladeshi' },
      '9': { ar: 'إثيوبي', en: 'Ethiopian' },
      '10': { ar: 'إندونيسي', en: 'Indonesian' },
      '11': { ar: 'سريلانكي', en: 'Sri Lankan' },
      '12': { ar: 'نيبالي', en: 'Nepalese' },
    };
    const nationalityStr = String(nationality || '');
    return nationalities[nationalityStr]?.[language] || nationalityStr;
  };

  return (
    <div className={styles.customersPage}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <TeamOutlined className={styles.headerIcon} />
            <div>
              <h1 className={styles.pageTitle}>{t('pageTitle')}</h1>
              <p className={styles.pageSubtitle}>
                {t('totalCustomers')}: <strong>{customers?.length || 0}</strong>
              </p>
            </div>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            className={styles.addButton}
            onClick={handleAddCustomer}
            loading={isCreating}
          >
            {t('addCustomer')}
          </Button>
        </div>
      </div>

      {/* Search Section */}
      <div className={styles.searchSection}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Input
              size="large"
              placeholder={t('searchPlaceholder')}
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className={styles.searchInput}
              allowClear
            />
          </Col>
          <Col xs={24} md={12}>
            <Select
              size="large"
              style={{ width: '100%' }}
              value={cityFilter}
              onChange={setCityFilter}
              placeholder={t('city')}
            >
              <Select.Option value="all">{t('allCities')}</Select.Option>
              {cities.map((city) => (
                <Select.Option key={city} value={city}>
                  {city}
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>
      </div>

      {/* Stats Overview */}
      <Row gutter={[24, 24]} className={styles.statsRow}>
        <Col xs={24} sm={12} md={12}>
          <Card className={styles.statCard}>
            <div className={styles.statContent}>
              <div className={styles.statIcon} style={{ background: '#E3F2FD' }}>
                <TeamOutlined style={{ color: '#00478C', fontSize: '24px' }} />
              </div>
              <div
                className={styles.statInfo}
                style={{ textAlign: language === 'ar' ? 'right' : 'left' }}
              >
                <p className={styles.statLabel}>{t('totalCustomers')}</p>
                <h3 className={styles.statValue}>{customers?.length || 0}</h3>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12}>
          <Card className={styles.statCard}>
            <div className={styles.statContent}>
              <div className={styles.statIcon} style={{ background: '#FFF3E0' }}>
                <EnvironmentOutlined style={{ color: '#F59E0B', fontSize: '24px' }} />
              </div>
              <div
                className={styles.statInfo}
                style={{ textAlign: language === 'ar' ? 'right' : 'left' }}
              >
                <p className={styles.statLabel}>{t('cities')}</p>
                <h3 className={styles.statValue}>{cities.length}</h3>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Customers Grid */}
      {isLoading ? (
        <Card>
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <Spin size="large" />
          </div>
        </Card>
      ) : filteredCustomers.length > 0 ? (
        <Row gutter={[24, 24]} className={styles.customerGrid}>
          {filteredCustomers.map((customer) => (
            <Col xs={24} lg={12} key={customer.id}>
              <Card className={styles.customerCard} hoverable>
                {/* Card Header */}
                <div className={styles.cardHeader}>
                  <div className={styles.customerHeaderLeft}>
                    <Avatar size={64} icon={<UserOutlined />} className={styles.customerAvatar} />
                    <div className={styles.customerNameSection}>
                      <h3 className={styles.customerName}>{customer.arabicName}</h3>
                    </div>
                  </div>
                  <Dropdown menu={getActionMenu(customer)} trigger={['click']}>
                    <Button type="text" icon={<MoreOutlined />} className={styles.actionButton} />
                  </Dropdown>
                </div>

                {/* Card Content */}
                <div className={styles.cardContent}>
                  {/* Identity Number */}
                  {customer.identityNumber && (
                    <div className={styles.infoRow}>
                      <div className={styles.infoIcon}>
                        <IdcardOutlined />
                      </div>
                      <div className={styles.infoContent}>
                        <p className={styles.infoLabel}>{t('identityNumber')}</p>
                        <p className={styles.infoValue}>{customer.identityNumber}</p>
                      </div>
                    </div>
                  )}

                  {/* Contact Information */}
                  {customer.mobile && (
                    <div className={styles.infoRow}>
                      <div className={styles.infoIcon}>
                        <PhoneOutlined />
                      </div>
                      <div className={styles.infoContent}>
                        <p className={styles.infoLabel}>{t('mobile')}</p>
                        <p className={styles.infoValue}>{customer.mobile}</p>
                      </div>
                    </div>
                  )}

                  {/* City */}
                  {(customer.cityAr || customer.cityEn) && (
                    <div className={styles.infoRow}>
                      <div className={styles.infoIcon}>
                        <EnvironmentOutlined />
                      </div>
                      <div className={styles.infoContent}>
                        <p className={styles.infoLabel}>{t('city')}</p>
                        <p className={styles.infoValue}>
                          {language === 'ar' ? customer.cityAr : customer.cityEn}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Housing Type */}
                  {customer.housingType && (
                    <div className={styles.infoRow}>
                      <div className={styles.infoIcon}>
                        <HomeOutlined />
                      </div>
                      <div className={styles.infoContent}>
                        <p className={styles.infoLabel}>{t('housingType')}</p>
                        <p className={styles.infoValue}>{getHousingType(customer.housingType)}</p>
                      </div>
                    </div>
                  )}

                  {/* Nationality */}
                  {customer.nationality && (
                    <div className={styles.infoRow}>
                      <div className={styles.infoIcon}>
                        <IdcardOutlined />
                      </div>
                      <div className={styles.infoContent}>
                        <p className={styles.infoLabel}>{t('nationality')}</p>
                        <p className={styles.infoValue}>{getNationality(customer.nationality)}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className={styles.cardFooter}>
                  <Button
                    type="link"
                    icon={<EditOutlined />}
                    onClick={() => handleEditCustomer(customer)}
                  >
                    {t('edit')}
                  </Button>
                  <Button
                    type="link"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteCustomer(customer)}
                    loading={isDeleting}
                  >
                    {t('delete')}
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Empty description={t('noCustomers')} />
      )}

      {/* Create/Edit Modal */}
      <Modal
        title={editingCustomer ? t('edit') : t('addCustomer')}
        open={isModalVisible}
        onOk={handleModalSubmit}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingCustomer(null);
        }}
        confirmLoading={isCreating || isUpdating}
        okText={t('save')}
        cancelText={t('cancel')}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label={t('arabicName')}
            name="arabicName"
            rules={[{ required: true, message: 'Please enter Arabic name' }]}
          >
            <Input prefix={<UserOutlined />} placeholder={t('arabicName')} />
          </Form.Item>

          <Form.Item
            label={t('identityNumber')}
            name="identityNumber"
            rules={[{ required: true, message: 'Please enter identity number' }]}
          >
            <Input prefix={<IdcardOutlined />} placeholder={t('identityNumber')} />
          </Form.Item>

          <Form.Item
            label={t('nationality')}
            name="nationality"
            rules={[{ required: true, message: 'Please select nationality' }]}
          >
            <Select placeholder={t('nationality')}>
              <Select.Option value={1}>{getNationality(1)}</Select.Option>
              <Select.Option value={2}>{getNationality(2)}</Select.Option>
              <Select.Option value={3}>{getNationality(3)}</Select.Option>
              <Select.Option value={4}>{getNationality(4)}</Select.Option>
              <Select.Option value={5}>{getNationality(5)}</Select.Option>
              <Select.Option value={6}>{getNationality(6)}</Select.Option>
              <Select.Option value={7}>{getNationality(7)}</Select.Option>
              <Select.Option value={8}>{getNationality(8)}</Select.Option>
              <Select.Option value={9}>{getNationality(9)}</Select.Option>
              <Select.Option value={10}>{getNationality(10)}</Select.Option>
              <Select.Option value={11}>{getNationality(11)}</Select.Option>
              <Select.Option value={12}>{getNationality(12)}</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label={t('mobile')}
            name="mobile"
            rules={[{ required: true, message: 'Please enter mobile number' }]}
          >
            <Input prefix={<PhoneOutlined />} placeholder={t('mobile')} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t('cityAr')}
                name="cityAr"
                rules={[{ required: true, message: 'Please enter city in Arabic' }]}
              >
                <Input prefix={<EnvironmentOutlined />} placeholder={t('cityAr')} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t('cityEn')}
                name="cityEn"
                rules={[{ required: true, message: 'Please enter city in English' }]}
              >
                <Input prefix={<EnvironmentOutlined />} placeholder={t('cityEn')} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={t('housingType')}
            name="housingType"
            rules={[{ required: true, message: 'Please select housing type' }]}
          >
            <Select placeholder={t('housingType')}>
              <Select.Option value={1}>{getHousingType(1)}</Select.Option>
              <Select.Option value={2}>{getHousingType(2)}</Select.Option>
              <Select.Option value={3}>{getHousingType(3)}</Select.Option>
              <Select.Option value={4}>{getHousingType(4)}</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
