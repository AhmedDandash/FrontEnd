'use client';

import React, { useState, useMemo } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Input,
  Table,
  Tag,
  Modal,
  Form,
  Select,
  Statistic,
  Tabs,
  Space,
  Popconfirm,
  Switch,
  ColorPicker,
  message,
} from 'antd';
import type { TabsProps } from 'antd';
import {
  SettingOutlined,
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  GlobalOutlined,
  UserOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  MessageOutlined,
  MailOutlined,
  ExclamationCircleOutlined,
  BgColorsOutlined,
  OrderedListOutlined,
  CustomerServiceOutlined,
  ManOutlined,
  FileExcelOutlined,
  TeamOutlined,
  FlagOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useAuthStore } from '@/store/authStore';
import styles from './SystemEntities.module.css';

// Entity Types
type EntityType =
  | 'jobs'
  | 'nationalities'
  | 'cities'
  | 'destinations'
  | 'marketers'
  | 'documentTypes'
  | 'ages'
  | 'smsSettings'
  | 'emailSettings'
  | 'complaintStatuses'
  | 'notFollowingColors'
  | 'contractSequence'
  | 'complaintServices';

// Base Entity Interface
interface BaseEntity {
  id: string;
  nameAr: string;
  nameEn: string;
  isActive: boolean;
  createdAt: string;
}

// Specific Entity Interfaces
interface Job extends BaseEntity {
  code?: string;
}

interface Nationality extends BaseEntity {
  authorizationSystem: string;
  authorizationSystemAr: string;
  flagEmoji?: string;
}

interface City extends BaseEntity {
  region?: string;
  regionAr?: string;
}

interface Destination extends BaseEntity {
  code?: string;
}

interface Marketer extends BaseEntity {
  phone?: string;
  commission?: number;
}

interface DocumentType extends BaseEntity {
  category?: string;
  categoryAr?: string;
  isRequired?: boolean;
}

interface AgeRange extends BaseEntity {
  minAge: number;
  maxAge: number;
}

interface ComplaintStatus extends BaseEntity {
  color: string;
  order: number;
}

interface NotFollowingColor extends BaseEntity {
  color: string;
  daysFrom: number;
  daysTo: number;
}

interface ContractSequence extends BaseEntity {
  prefix: string;
  currentNumber: number;
  suffix?: string;
}

interface ComplaintService extends BaseEntity {
  category?: string;
  categoryAr?: string;
}

// Mock Data
const mockJobs: Job[] = [
  { id: '1', nameAr: 'مدير منزل', nameEn: 'House Manager', isActive: true, createdAt: '2024-01-15' },
  { id: '2', nameAr: 'عاملة منزلية', nameEn: 'House Maid', isActive: true, createdAt: '2024-01-10' },
  { id: '3', nameAr: 'سائق خاص', nameEn: 'Private Driver', isActive: true, createdAt: '2024-01-08' },
  { id: '4', nameAr: 'طباخ منزلي', nameEn: 'Home Cook', isActive: true, createdAt: '2024-01-05' },
  { id: '5', nameAr: 'ممرضة منزلية', nameEn: 'Home Nurse', isActive: true, createdAt: '2024-01-03' },
  { id: '6', nameAr: 'حارس منزلي', nameEn: 'House Guard', isActive: false, createdAt: '2024-01-01' },
  { id: '7', nameAr: 'مربية أطفال', nameEn: 'Nanny', isActive: true, createdAt: '2023-12-28' },
  { id: '8', nameAr: 'بستاني', nameEn: 'Gardener', isActive: true, createdAt: '2023-12-25' },
];

const mockNationalities: Nationality[] = [
  { id: '1', nameAr: 'الفلبين', nameEn: 'Philippines', authorizationSystem: 'Musaned', authorizationSystemAr: 'مساند', flagEmoji: '🇵🇭', isActive: true, createdAt: '2024-01-15' },
  { id: '2', nameAr: 'إندونيسيا', nameEn: 'Indonesia', authorizationSystem: 'Enjaz', authorizationSystemAr: 'إنجاز', flagEmoji: '🇮🇩', isActive: true, createdAt: '2024-01-10' },
  { id: '3', nameAr: 'بنغلاديش', nameEn: 'Bangladesh', authorizationSystem: 'Musaned', authorizationSystemAr: 'مساند', flagEmoji: '🇧🇩', isActive: true, createdAt: '2024-01-08' },
  { id: '4', nameAr: 'الهند', nameEn: 'India', authorizationSystem: 'Musaned', authorizationSystemAr: 'مساند', flagEmoji: '🇮🇳', isActive: true, createdAt: '2024-01-05' },
  { id: '5', nameAr: 'سريلانكا', nameEn: 'Sri Lanka', authorizationSystem: 'Musaned', authorizationSystemAr: 'مساند', flagEmoji: '🇱🇰', isActive: true, createdAt: '2024-01-03' },
  { id: '6', nameAr: 'إثيوبيا', nameEn: 'Ethiopia', authorizationSystem: 'Musaned', authorizationSystemAr: 'مساند', flagEmoji: '🇪🇹', isActive: true, createdAt: '2024-01-01' },
  { id: '7', nameAr: 'كينيا', nameEn: 'Kenya', authorizationSystem: 'Musaned', authorizationSystemAr: 'مساند', flagEmoji: '🇰🇪', isActive: true, createdAt: '2023-12-28' },
  { id: '8', nameAr: 'أوغندا', nameEn: 'Uganda', authorizationSystem: 'Musaned', authorizationSystemAr: 'مساند', flagEmoji: '🇺🇬', isActive: true, createdAt: '2023-12-25' },
];

const mockCities: City[] = [
  { id: '1', nameAr: 'الرياض', nameEn: 'Riyadh', region: 'Central', regionAr: 'الوسطى', isActive: true, createdAt: '2024-01-15' },
  { id: '2', nameAr: 'جدة', nameEn: 'Jeddah', region: 'Western', regionAr: 'الغربية', isActive: true, createdAt: '2024-01-10' },
  { id: '3', nameAr: 'الدمام', nameEn: 'Dammam', region: 'Eastern', regionAr: 'الشرقية', isActive: true, createdAt: '2024-01-08' },
  { id: '4', nameAr: 'مكة المكرمة', nameEn: 'Makkah', region: 'Western', regionAr: 'الغربية', isActive: true, createdAt: '2024-01-05' },
  { id: '5', nameAr: 'المدينة المنورة', nameEn: 'Madinah', region: 'Western', regionAr: 'الغربية', isActive: true, createdAt: '2024-01-03' },
];

const mockDestinations: Destination[] = [
  { id: '1', nameAr: 'مطار الملك خالد الدولي', nameEn: 'King Khalid International Airport', code: 'RUH', isActive: true, createdAt: '2024-01-15' },
  { id: '2', nameAr: 'مطار الملك عبدالعزيز الدولي', nameEn: 'King Abdulaziz International Airport', code: 'JED', isActive: true, createdAt: '2024-01-10' },
  { id: '3', nameAr: 'مطار الملك فهد الدولي', nameEn: 'King Fahd International Airport', code: 'DMM', isActive: true, createdAt: '2024-01-08' },
];

const mockMarketers: Marketer[] = [
  { id: '1', nameAr: 'أحمد محمد', nameEn: 'Ahmed Mohammed', phone: '0501234567', commission: 5, isActive: true, createdAt: '2024-01-15' },
  { id: '2', nameAr: 'سارة علي', nameEn: 'Sara Ali', phone: '0559876543', commission: 7, isActive: true, createdAt: '2024-01-10' },
  { id: '3', nameAr: 'خالد عبدالله', nameEn: 'Khaled Abdullah', phone: '0541112233', commission: 6, isActive: false, createdAt: '2024-01-08' },
];

const mockDocumentTypes: DocumentType[] = [
  { id: '1', nameAr: 'جواز السفر', nameEn: 'Passport', category: 'Identity', categoryAr: 'هوية', isRequired: true, isActive: true, createdAt: '2024-01-15' },
  { id: '2', nameAr: 'تأشيرة العمل', nameEn: 'Work Visa', category: 'Visa', categoryAr: 'تأشيرة', isRequired: true, isActive: true, createdAt: '2024-01-10' },
  { id: '3', nameAr: 'شهادة صحية', nameEn: 'Health Certificate', category: 'Medical', categoryAr: 'طبي', isRequired: true, isActive: true, createdAt: '2024-01-08' },
  { id: '4', nameAr: 'عقد العمل', nameEn: 'Employment Contract', category: 'Contract', categoryAr: 'عقد', isRequired: true, isActive: true, createdAt: '2024-01-05' },
];

const mockAges: AgeRange[] = [
  { id: '1', nameAr: '21-25 سنة', nameEn: '21-25 years', minAge: 21, maxAge: 25, isActive: true, createdAt: '2024-01-15' },
  { id: '2', nameAr: '26-30 سنة', nameEn: '26-30 years', minAge: 26, maxAge: 30, isActive: true, createdAt: '2024-01-10' },
  { id: '3', nameAr: '31-35 سنة', nameEn: '31-35 years', minAge: 31, maxAge: 35, isActive: true, createdAt: '2024-01-08' },
  { id: '4', nameAr: '36-40 سنة', nameEn: '36-40 years', minAge: 36, maxAge: 40, isActive: true, createdAt: '2024-01-05' },
  { id: '5', nameAr: '41-45 سنة', nameEn: '41-45 years', minAge: 41, maxAge: 45, isActive: true, createdAt: '2024-01-03' },
];

const mockComplaintStatuses: ComplaintStatus[] = [
  { id: '1', nameAr: 'جديدة', nameEn: 'New', color: '#1890ff', order: 1, isActive: true, createdAt: '2024-01-15' },
  { id: '2', nameAr: 'قيد المراجعة', nameEn: 'Under Review', color: '#faad14', order: 2, isActive: true, createdAt: '2024-01-10' },
  { id: '3', nameAr: 'قيد المعالجة', nameEn: 'In Progress', color: '#722ed1', order: 3, isActive: true, createdAt: '2024-01-08' },
  { id: '4', nameAr: 'تم الحل', nameEn: 'Resolved', color: '#52c41a', order: 4, isActive: true, createdAt: '2024-01-05' },
  { id: '5', nameAr: 'مغلقة', nameEn: 'Closed', color: '#8c8c8c', order: 5, isActive: true, createdAt: '2024-01-03' },
  { id: '6', nameAr: 'مرفوضة', nameEn: 'Rejected', color: '#ff4d4f', order: 6, isActive: true, createdAt: '2024-01-01' },
];

const mockNotFollowingColors: NotFollowingColor[] = [
  { id: '1', nameAr: 'تأخر بسيط', nameEn: 'Slight Delay', color: '#fffbe6', daysFrom: 1, daysTo: 3, isActive: true, createdAt: '2024-01-15' },
  { id: '2', nameAr: 'تأخر متوسط', nameEn: 'Moderate Delay', color: '#fff7e6', daysFrom: 4, daysTo: 7, isActive: true, createdAt: '2024-01-10' },
  { id: '3', nameAr: 'تأخر كبير', nameEn: 'Significant Delay', color: '#fff1f0', daysFrom: 8, daysTo: 14, isActive: true, createdAt: '2024-01-08' },
  { id: '4', nameAr: 'تأخر حرج', nameEn: 'Critical Delay', color: '#ff4d4f', daysFrom: 15, daysTo: 999, isActive: true, createdAt: '2024-01-05' },
];

const mockContractSequence: ContractSequence[] = [
  { id: '1', nameAr: 'عقود التوسط', nameEn: 'Mediation Contracts', prefix: 'MED', currentNumber: 6750, isActive: true, createdAt: '2024-01-15' },
  { id: '2', nameAr: 'عقود الإيجار', nameEn: 'Rent Contracts', prefix: 'RNT', currentNumber: 1250, isActive: true, createdAt: '2024-01-10' },
  { id: '3', nameAr: 'عقود التشغيل', nameEn: 'Operation Contracts', prefix: 'OPR', currentNumber: 890, isActive: true, createdAt: '2024-01-08' },
];

const mockComplaintServices: ComplaintService[] = [
  { id: '1', nameAr: 'إرجاع العاملة', nameEn: 'Worker Return', category: 'Return', categoryAr: 'إرجاع', isActive: true, createdAt: '2024-01-15' },
  { id: '2', nameAr: 'استبدال العاملة', nameEn: 'Worker Replacement', category: 'Replacement', categoryAr: 'استبدال', isActive: true, createdAt: '2024-01-10' },
  { id: '3', nameAr: 'استرداد المبلغ', nameEn: 'Refund', category: 'Financial', categoryAr: 'مالي', isActive: true, createdAt: '2024-01-08' },
  { id: '4', nameAr: 'تمديد الضمان', nameEn: 'Warranty Extension', category: 'Warranty', categoryAr: 'ضمان', isActive: true, createdAt: '2024-01-05' },
];

// Entity Stats
interface EntityStats {
  jobs: number;
  nationalities: number;
  cities: number;
  destinations: number;
  marketers: number;
  documentTypes: number;
  ages: number;
  complaintStatuses: number;
  notFollowingColors: number;
  contractSequence: number;
  complaintServices: number;
}

export default function SystemEntitiesPage() {
  const language = useAuthStore((state) => state.language);
  const isRTL = language === 'ar';

  const [activeTab, setActiveTab] = useState<EntityType>('jobs');
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState<BaseEntity | null>(null);
  const [form] = Form.useForm();

  // Translations
  const t = {
    pageTitle: isRTL ? 'كيانات النظام' : 'System Entities',
    pageSubtitle: isRTL ? 'إدارة جميع الكيانات والإعدادات الأساسية للنظام' : 'Manage all system entities and basic settings',
    search: isRTL ? 'بحث...' : 'Search...',
    add: isRTL ? 'إضافة' : 'Add',
    edit: isRTL ? 'تعديل' : 'Edit',
    delete: isRTL ? 'حذف' : 'Delete',
    save: isRTL ? 'حفظ' : 'Save',
    cancel: isRTL ? 'إلغاء' : 'Cancel',
    nameAr: isRTL ? 'الاسم بالعربية' : 'Arabic Name',
    nameEn: isRTL ? 'الاسم بالإنجليزية' : 'English Name',
    status: isRTL ? 'الحالة' : 'Status',
    active: isRTL ? 'نشط' : 'Active',
    inactive: isRTL ? 'غير نشط' : 'Inactive',
    actions: isRTL ? 'الإجراءات' : 'Actions',
    exportExcel: isRTL ? 'تصدير Excel' : 'Export Excel',
    deleteConfirm: isRTL ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete?',
    // Tab labels
    jobs: isRTL ? 'الوظائف' : 'Jobs',
    nationalities: isRTL ? 'الجنسيات' : 'Nationalities',
    cities: isRTL ? 'المدن' : 'Cities',
    destinations: isRTL ? 'جهات القدوم' : 'Destinations',
    marketers: isRTL ? 'المسوقين' : 'Marketers',
    documentTypes: isRTL ? 'أنواع المستندات' : 'Document Types',
    ages: isRTL ? 'الفئات العمرية' : 'Age Ranges',
    smsSettings: isRTL ? 'إعدادات الرسائل' : 'SMS Settings',
    emailSettings: isRTL ? 'إعدادات البريد' : 'Email Settings',
    complaintStatuses: isRTL ? 'حالات الشكاوى' : 'Complaint Statuses',
    notFollowingColors: isRTL ? 'ألوان عدم المتابعة' : 'Not Following Colors',
    contractSequence: isRTL ? 'تسلسل العقود' : 'Contract Sequence',
    complaintServices: isRTL ? 'خدمات الشكاوى' : 'Complaint Services',
    // Form labels
    authSystem: isRTL ? 'نظام التفويض' : 'Authorization System',
    region: isRTL ? 'المنطقة' : 'Region',
    code: isRTL ? 'الرمز' : 'Code',
    phone: isRTL ? 'الهاتف' : 'Phone',
    commission: isRTL ? 'العمولة %' : 'Commission %',
    category: isRTL ? 'التصنيف' : 'Category',
    required: isRTL ? 'مطلوب' : 'Required',
    color: isRTL ? 'اللون' : 'Color',
    order: isRTL ? 'الترتيب' : 'Order',
    minAge: isRTL ? 'الحد الأدنى' : 'Min Age',
    maxAge: isRTL ? 'الحد الأقصى' : 'Max Age',
    daysFrom: isRTL ? 'من يوم' : 'Days From',
    daysTo: isRTL ? 'إلى يوم' : 'Days To',
    prefix: isRTL ? 'البادئة' : 'Prefix',
    currentNumber: isRTL ? 'الرقم الحالي' : 'Current Number',
  };

  // Stats calculation
  const stats: EntityStats = useMemo(
    () => ({
      jobs: mockJobs.length,
      nationalities: mockNationalities.length,
      cities: mockCities.length,
      destinations: mockDestinations.length,
      marketers: mockMarketers.length,
      documentTypes: mockDocumentTypes.length,
      ages: mockAges.length,
      complaintStatuses: mockComplaintStatuses.length,
      notFollowingColors: mockNotFollowingColors.length,
      contractSequence: mockContractSequence.length,
      complaintServices: mockComplaintServices.length,
    }),
    []
  );

  // Get icon for entity type
  const getEntityIcon = (type: EntityType) => {
    const icons: Record<EntityType, React.ReactNode> = {
      jobs: <UserOutlined />,
      nationalities: <FlagOutlined />,
      cities: <EnvironmentOutlined />,
      destinations: <GlobalOutlined />,
      marketers: <TeamOutlined />,
      documentTypes: <FileTextOutlined />,
      ages: <ManOutlined />,
      smsSettings: <MessageOutlined />,
      emailSettings: <MailOutlined />,
      complaintStatuses: <ExclamationCircleOutlined />,
      notFollowingColors: <BgColorsOutlined />,
      contractSequence: <OrderedListOutlined />,
      complaintServices: <CustomerServiceOutlined />,
    };
    return icons[type];
  };

  // Filter data based on search
  const getFilteredData = (data: BaseEntity[]) => {
    if (!searchText) return data;
    const search = searchText.toLowerCase();
    return data.filter(
      (item) =>
        item.nameAr.toLowerCase().includes(search) ||
        item.nameEn.toLowerCase().includes(search)
    );
  };

  // Handle add/edit
  const handleAdd = () => {
    setEditingEntity(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record: BaseEntity) => {
    setEditingEntity(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = (_id: string) => {
    // TODO: API call to delete entity
    message.success(isRTL ? 'تم الحذف بنجاح' : 'Deleted successfully');
  };

  const handleSave = () => {
    form.validateFields().then((_values) => {
      // TODO: API call to save entity
      message.success(
        editingEntity
          ? isRTL
            ? 'تم التعديل بنجاح'
            : 'Updated successfully'
          : isRTL
          ? 'تمت الإضافة بنجاح'
          : 'Added successfully'
      );
      setIsModalOpen(false);
      form.resetFields();
    });
  };

  // Base columns for all entities
  const baseColumns: ColumnsType<BaseEntity> = [
    {
      title: t.nameAr,
      dataIndex: 'nameAr',
      key: 'nameAr',
      sorter: (a, b) => a.nameAr.localeCompare(b.nameAr),
    },
    {
      title: t.nameEn,
      dataIndex: 'nameEn',
      key: 'nameEn',
      sorter: (a, b) => a.nameEn.localeCompare(b.nameEn),
    },
    {
      title: t.status,
      dataIndex: 'isActive',
      key: 'isActive',
      width: 120,
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'success' : 'default'}>
          {isActive ? t.active : t.inactive}
        </Tag>
      ),
    },
    {
      title: t.actions,
      key: 'actions',
      width: 120,
      render: (_: unknown, record: BaseEntity) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className={styles.actionBtn}
          />
          <Popconfirm
            title={t.deleteConfirm}
            onConfirm={() => handleDelete(record.id)}
            okText={t.delete}
            cancelText={t.cancel}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              className={styles.actionBtn}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Nationality columns
  const nationalityColumns: ColumnsType<Nationality> = [
    {
      title: t.nameAr,
      dataIndex: 'nameAr',
      key: 'nameAr',
      render: (text: string, record: Nationality) => (
        <span>
          {record.flagEmoji} {text}
        </span>
      ),
    },
    {
      title: t.nameEn,
      dataIndex: 'nameEn',
      key: 'nameEn',
    },
    {
      title: t.authSystem,
      dataIndex: isRTL ? 'authorizationSystemAr' : 'authorizationSystem',
      key: 'authSystem',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: t.status,
      dataIndex: 'isActive',
      key: 'isActive',
      width: 120,
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'success' : 'default'}>
          {isActive ? t.active : t.inactive}
        </Tag>
      ),
    },
    {
      title: t.actions,
      key: 'actions',
      width: 120,
      render: (_: unknown, record: Nationality) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className={styles.actionBtn}
          />
          <Popconfirm
            title={t.deleteConfirm}
            onConfirm={() => handleDelete(record.id)}
            okText={t.delete}
            cancelText={t.cancel}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              className={styles.actionBtn}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Complaint Status columns
  const complaintStatusColumns: ColumnsType<ComplaintStatus> = [
    {
      title: t.color,
      dataIndex: 'color',
      key: 'color',
      width: 80,
      render: (color: string) => (
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: 4,
            backgroundColor: color,
            border: '1px solid #d9d9d9',
          }}
        />
      ),
    },
    {
      title: t.nameAr,
      dataIndex: 'nameAr',
      key: 'nameAr',
    },
    {
      title: t.nameEn,
      dataIndex: 'nameEn',
      key: 'nameEn',
    },
    {
      title: t.order,
      dataIndex: 'order',
      key: 'order',
      width: 100,
      sorter: (a, b) => a.order - b.order,
    },
    {
      title: t.status,
      dataIndex: 'isActive',
      key: 'isActive',
      width: 120,
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'success' : 'default'}>
          {isActive ? t.active : t.inactive}
        </Tag>
      ),
    },
    {
      title: t.actions,
      key: 'actions',
      width: 120,
      render: (_: unknown, record: ComplaintStatus) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className={styles.actionBtn}
          />
          <Popconfirm
            title={t.deleteConfirm}
            onConfirm={() => handleDelete(record.id)}
            okText={t.delete}
            cancelText={t.cancel}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              className={styles.actionBtn}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Not Following Colors columns
  const notFollowingColorsColumns: ColumnsType<NotFollowingColor> = [
    {
      title: t.color,
      dataIndex: 'color',
      key: 'color',
      width: 80,
      render: (color: string) => (
        <div
          style={{
            width: 40,
            height: 24,
            borderRadius: 4,
            backgroundColor: color,
            border: '1px solid #d9d9d9',
          }}
        />
      ),
    },
    {
      title: t.nameAr,
      dataIndex: 'nameAr',
      key: 'nameAr',
    },
    {
      title: t.nameEn,
      dataIndex: 'nameEn',
      key: 'nameEn',
    },
    {
      title: t.daysFrom,
      dataIndex: 'daysFrom',
      key: 'daysFrom',
      width: 100,
    },
    {
      title: t.daysTo,
      dataIndex: 'daysTo',
      key: 'daysTo',
      width: 100,
      render: (val: number) => (val >= 999 ? '∞' : val),
    },
    {
      title: t.actions,
      key: 'actions',
      width: 120,
      render: (_: unknown, record: NotFollowingColor) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className={styles.actionBtn}
          />
          <Popconfirm
            title={t.deleteConfirm}
            onConfirm={() => handleDelete(record.id)}
            okText={t.delete}
            cancelText={t.cancel}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              className={styles.actionBtn}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Age Range columns
  const ageColumns: ColumnsType<AgeRange> = [
    {
      title: t.nameAr,
      dataIndex: 'nameAr',
      key: 'nameAr',
    },
    {
      title: t.nameEn,
      dataIndex: 'nameEn',
      key: 'nameEn',
    },
    {
      title: t.minAge,
      dataIndex: 'minAge',
      key: 'minAge',
      width: 100,
    },
    {
      title: t.maxAge,
      dataIndex: 'maxAge',
      key: 'maxAge',
      width: 100,
    },
    {
      title: t.status,
      dataIndex: 'isActive',
      key: 'isActive',
      width: 120,
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'success' : 'default'}>
          {isActive ? t.active : t.inactive}
        </Tag>
      ),
    },
    {
      title: t.actions,
      key: 'actions',
      width: 120,
      render: (_: unknown, record: AgeRange) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className={styles.actionBtn}
          />
          <Popconfirm
            title={t.deleteConfirm}
            onConfirm={() => handleDelete(record.id)}
            okText={t.delete}
            cancelText={t.cancel}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              className={styles.actionBtn}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Contract Sequence columns
  const sequenceColumns: ColumnsType<ContractSequence> = [
    {
      title: t.nameAr,
      dataIndex: 'nameAr',
      key: 'nameAr',
    },
    {
      title: t.nameEn,
      dataIndex: 'nameEn',
      key: 'nameEn',
    },
    {
      title: t.prefix,
      dataIndex: 'prefix',
      key: 'prefix',
      width: 100,
      render: (text: string) => <Tag color="purple">{text}</Tag>,
    },
    {
      title: t.currentNumber,
      dataIndex: 'currentNumber',
      key: 'currentNumber',
      width: 150,
      render: (num: number) => <strong>{num.toLocaleString()}</strong>,
    },
    {
      title: t.actions,
      key: 'actions',
      width: 120,
      render: (_: unknown, record: ContractSequence) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className={styles.actionBtn}
          />
        </Space>
      ),
    },
  ];

  // Render table based on active tab
  const renderTable = () => {
    switch (activeTab) {
      case 'jobs':
        return (
          <Table
            columns={baseColumns}
            dataSource={getFilteredData(mockJobs)}
            rowKey="id"
            pagination={{ pageSize: 10, showSizeChanger: true }}
            className={styles.dataTable}
          />
        );
      case 'nationalities':
        return (
          <Table
            columns={nationalityColumns}
            dataSource={getFilteredData(mockNationalities) as Nationality[]}
            rowKey="id"
            pagination={{ pageSize: 10, showSizeChanger: true }}
            className={styles.dataTable}
          />
        );
      case 'cities':
        return (
          <Table
            columns={baseColumns}
            dataSource={getFilteredData(mockCities)}
            rowKey="id"
            pagination={{ pageSize: 10, showSizeChanger: true }}
            className={styles.dataTable}
          />
        );
      case 'destinations':
        return (
          <Table
            columns={baseColumns}
            dataSource={getFilteredData(mockDestinations)}
            rowKey="id"
            pagination={{ pageSize: 10, showSizeChanger: true }}
            className={styles.dataTable}
          />
        );
      case 'marketers':
        return (
          <Table
            columns={baseColumns}
            dataSource={getFilteredData(mockMarketers)}
            rowKey="id"
            pagination={{ pageSize: 10, showSizeChanger: true }}
            className={styles.dataTable}
          />
        );
      case 'documentTypes':
        return (
          <Table
            columns={baseColumns}
            dataSource={getFilteredData(mockDocumentTypes)}
            rowKey="id"
            pagination={{ pageSize: 10, showSizeChanger: true }}
            className={styles.dataTable}
          />
        );
      case 'ages':
        return (
          <Table
            columns={ageColumns}
            dataSource={getFilteredData(mockAges) as AgeRange[]}
            rowKey="id"
            pagination={{ pageSize: 10, showSizeChanger: true }}
            className={styles.dataTable}
          />
        );
      case 'complaintStatuses':
        return (
          <Table
            columns={complaintStatusColumns}
            dataSource={getFilteredData(mockComplaintStatuses) as ComplaintStatus[]}
            rowKey="id"
            pagination={{ pageSize: 10, showSizeChanger: true }}
            className={styles.dataTable}
          />
        );
      case 'notFollowingColors':
        return (
          <Table
            columns={notFollowingColorsColumns}
            dataSource={getFilteredData(mockNotFollowingColors) as NotFollowingColor[]}
            rowKey="id"
            pagination={{ pageSize: 10, showSizeChanger: true }}
            className={styles.dataTable}
          />
        );
      case 'contractSequence':
        return (
          <Table
            columns={sequenceColumns}
            dataSource={getFilteredData(mockContractSequence) as ContractSequence[]}
            rowKey="id"
            pagination={{ pageSize: 10, showSizeChanger: true }}
            className={styles.dataTable}
          />
        );
      case 'complaintServices':
        return (
          <Table
            columns={baseColumns}
            dataSource={getFilteredData(mockComplaintServices)}
            rowKey="id"
            pagination={{ pageSize: 10, showSizeChanger: true }}
            className={styles.dataTable}
          />
        );
      default:
        return null;
    }
  };

  // Render form fields based on active tab
  const renderFormFields = () => {
    const commonFields = (
      <>
        <Form.Item
          name="nameAr"
          label={t.nameAr}
          rules={[{ required: true, message: isRTL ? 'مطلوب' : 'Required' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="nameEn"
          label={t.nameEn}
          rules={[{ required: true, message: isRTL ? 'مطلوب' : 'Required' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="isActive" label={t.status} valuePropName="checked">
          <Switch checkedChildren={t.active} unCheckedChildren={t.inactive} />
        </Form.Item>
      </>
    );

    switch (activeTab) {
      case 'nationalities':
        return (
          <>
            {commonFields}
            <Form.Item name="authorizationSystem" label={t.authSystem}>
              <Select>
                <Select.Option value="Musaned">
                  {isRTL ? 'مساند' : 'Musaned'}
                </Select.Option>
                <Select.Option value="Enjaz">
                  {isRTL ? 'إنجاز' : 'Enjaz'}
                </Select.Option>
              </Select>
            </Form.Item>
          </>
        );
      case 'ages':
        return (
          <>
            {commonFields}
            <Form.Item
              name="minAge"
              label={t.minAge}
              rules={[{ required: true }]}
            >
              <Input type="number" min={18} max={65} />
            </Form.Item>
            <Form.Item
              name="maxAge"
              label={t.maxAge}
              rules={[{ required: true }]}
            >
              <Input type="number" min={18} max={65} />
            </Form.Item>
          </>
        );
      case 'complaintStatuses':
        return (
          <>
            {commonFields}
            <Form.Item name="color" label={t.color}>
              <ColorPicker />
            </Form.Item>
            <Form.Item name="order" label={t.order}>
              <Input type="number" min={1} />
            </Form.Item>
          </>
        );
      case 'notFollowingColors':
        return (
          <>
            {commonFields}
            <Form.Item name="color" label={t.color}>
              <ColorPicker />
            </Form.Item>
            <Form.Item name="daysFrom" label={t.daysFrom}>
              <Input type="number" min={1} />
            </Form.Item>
            <Form.Item name="daysTo" label={t.daysTo}>
              <Input type="number" min={1} />
            </Form.Item>
          </>
        );
      case 'contractSequence':
        return (
          <>
            {commonFields}
            <Form.Item name="prefix" label={t.prefix}>
              <Input maxLength={5} />
            </Form.Item>
            <Form.Item name="currentNumber" label={t.currentNumber}>
              <Input type="number" min={1} />
            </Form.Item>
          </>
        );
      default:
        return commonFields;
    }
  };

  // Get tab label with count
  const getTabLabel = (type: EntityType, label: string, count: number) => (
    <span className={styles.tabLabel}>
      {getEntityIcon(type)}
      <span className={styles.tabText}>{label}</span>
      <Tag className={styles.tabCount}>{count}</Tag>
    </span>
  );

  // Tab items
  const tabItems: TabsProps['items'] = [
    {
      key: 'jobs',
      label: getTabLabel('jobs', t.jobs, stats.jobs),
    },
    {
      key: 'nationalities',
      label: getTabLabel('nationalities', t.nationalities, stats.nationalities),
    },
    {
      key: 'cities',
      label: getTabLabel('cities', t.cities, stats.cities),
    },
    {
      key: 'destinations',
      label: getTabLabel('destinations', t.destinations, stats.destinations),
    },
    {
      key: 'marketers',
      label: getTabLabel('marketers', t.marketers, stats.marketers),
    },
    {
      key: 'documentTypes',
      label: getTabLabel('documentTypes', t.documentTypes, stats.documentTypes),
    },
    {
      key: 'ages',
      label: getTabLabel('ages', t.ages, stats.ages),
    },
    {
      key: 'complaintStatuses',
      label: getTabLabel('complaintStatuses', t.complaintStatuses, stats.complaintStatuses),
    },
    {
      key: 'notFollowingColors',
      label: getTabLabel('notFollowingColors', t.notFollowingColors, stats.notFollowingColors),
    },
    {
      key: 'contractSequence',
      label: getTabLabel('contractSequence', t.contractSequence, stats.contractSequence),
    },
    {
      key: 'complaintServices',
      label: getTabLabel('complaintServices', t.complaintServices, stats.complaintServices),
    },
  ];

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerIcon}>
            <SettingOutlined />
          </div>
          <div className={styles.headerText}>
            <h1 className={styles.headerTitle}>{t.pageTitle}</h1>
            <p className={styles.headerSubtitle}>{t.pageSubtitle}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} className={styles.statsRow}>
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card className={styles.statCard}>
            <Statistic
              title={t.jobs}
              value={stats.jobs}
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card className={styles.statCard}>
            <Statistic
              title={t.nationalities}
              value={stats.nationalities}
              prefix={<FlagOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card className={styles.statCard}>
            <Statistic
              title={t.cities}
              value={stats.cities}
              prefix={<EnvironmentOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card className={styles.statCard}>
            <Statistic
              title={t.documentTypes}
              value={stats.documentTypes}
              prefix={<FileTextOutlined style={{ color: '#fa8c16' }} />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card className={styles.statCard}>
            <Statistic
              title={t.marketers}
              value={stats.marketers}
              prefix={<TeamOutlined style={{ color: '#13c2c2' }} />}
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card className={styles.statCard}>
            <Statistic
              title={t.complaintStatuses}
              value={stats.complaintStatuses}
              prefix={<ExclamationCircleOutlined style={{ color: '#eb2f96' }} />}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content Card */}
      <Card className={styles.mainCard}>
        {/* Tabs */}
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as EntityType)}
          items={tabItems}
          className={styles.entityTabs}
          tabPosition="top"
        />

        {/* Toolbar */}
        <div className={styles.toolbar}>
          <Input
            placeholder={t.search}
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            className={styles.searchInput}
          />
          <Space>
            <Button icon={<FileExcelOutlined />} className={styles.exportBtn}>
              {t.exportExcel}
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              className={styles.addBtn}
            >
              {t.add}
            </Button>
          </Space>
        </div>

        {/* Table */}
        {renderTable()}
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        title={
          editingEntity
            ? `${t.edit} - ${isRTL ? editingEntity.nameAr : editingEntity.nameEn}`
            : t.add
        }
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        okText={t.save}
        cancelText={t.cancel}
        className={styles.entityModal}
        destroyOnClose
      >
        <Form form={form} layout="vertical" className={styles.entityForm}>
          {renderFormFields()}
        </Form>
      </Modal>
    </div>
  );
}
