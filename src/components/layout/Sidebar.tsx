'use client';

import React, { useState, useEffect } from 'react';
import { Layout, Menu, Drawer, Badge } from 'antd';
import {
  DashboardOutlined,
  BarChartOutlined,
  TeamOutlined,
  FileTextOutlined,
  UserAddOutlined,
  CalendarOutlined,
  FileSearchOutlined,
  GiftOutlined,
  MessageOutlined,
  UserOutlined,
  IdcardOutlined,
  WarningOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';
import styles from './Sidebar.module.css';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  mobileDrawerVisible: boolean;
  onMobileDrawerClose: () => void;
}

type MenuItem = Required<MenuProps>['items'][number];

export default function Sidebar({
  collapsed,
  mobileDrawerVisible,
  onMobileDrawerClose,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const language = useAuthStore((state) => state.language);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  useEffect(() => {
    // Set selected and open keys based on current path
    const pathParts = pathname.split('/').filter(Boolean);
    if (pathParts.length > 0) {
      setSelectedKeys([pathname]);
      if (pathParts.length > 1) {
        setOpenKeys([pathParts[0]]);
      }
    }
  }, [pathname]);

  const menuItems: MenuItem[] = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: language === 'ar' ? 'لوحة التحكم' : 'Dashboard',
      onClick: () => router.push('/dashboard'),
    },
    {
      key: 'statistics',
      icon: <BarChartOutlined />,
      label: language === 'ar' ? 'الإحصائيات' : 'Statistics',
      children: [
        {
          key: '/statistics/agent-productivity',
          label: language === 'ar' ? 'إنتاجية الوكلاء' : 'Agent Productivity',
        },
        {
          key: '/statistics/office-productivity',
          label: language === 'ar' ? 'إنتاجية المكتب' : 'Office Productivity',
        },
        {
          key: '/statistics/followup',
          label: language === 'ar' ? 'إحصائيات المتابعة' : 'Follow-up Stats',
        },
        {
          key: '/statistics/applicants',
          label: language === 'ar' ? 'إحصائيات المتقدمين' : 'Applicant Stats',
        },
        {
          key: '/statistics/visas',
          label: language === 'ar' ? 'إحصائيات التأشيرات' : 'Visa Stats',
        },
      ],
    },
    {
      key: 'customers',
      icon: <TeamOutlined />,
      label: language === 'ar' ? 'العملاء' : 'Customers',
      children: [
        { key: '/customers', label: language === 'ar' ? 'جميع العملاء' : 'All Customers' },
        { key: '/customers/contacts', label: language === 'ar' ? 'جهات الاتصال' : 'Contacts' },
        { key: '/customers/phones', label: language === 'ar' ? 'أرقام العملاء' : 'Phone Numbers' },
      ],
    },
    {
      key: 'contracts',
      icon: <FileTextOutlined />,
      label: language === 'ar' ? 'العقود' : 'Contracts',
      children: [
        {
          key: '/contracts',
          label: (
            <Badge count={5} offset={[10, 0]} size="small">
              {language === 'ar' ? 'جميع العقود' : 'All Contracts'}
            </Badge>
          ),
        },
        { key: '/contracts/rent', label: language === 'ar' ? 'عقود الإيجار' : 'Rent Contracts' },
        { key: '/contracts/delegates', label: language === 'ar' ? 'مندوبو العقود' : 'Delegates' },
        { key: '/contracts/penalties', label: language === 'ar' ? 'غرامات العقود' : 'Penalties' },
        { key: '/contracts/transmital', label: language === 'ar' ? 'نقل العقود' : 'Transfer' },
        {
          key: '/contracts/cancellation',
          label: language === 'ar' ? 'إلغاء العقود' : 'Cancellation',
        },
      ],
    },
    {
      key: 'recruitment',
      icon: <UserAddOutlined />,
      label: language === 'ar' ? 'التوظيف' : 'Recruitment',
      children: [
        { key: '/recruitment/requests', label: language === 'ar' ? 'طلبات التوظيف' : 'Requests' },
        {
          key: '/recruitment/applicants',
          label: language === 'ar' ? 'المتقدمون المتاحون' : 'Available Applicants',
        },
        {
          key: '/recruitment/visas',
          label: language === 'ar' ? 'إدارة التأشيرات' : 'Visa Management',
        },
      ],
    },
    {
      key: 'followup',
      icon: <CalendarOutlined />,
      label: language === 'ar' ? 'المتابعة' : 'Follow-up',
      children: [
        {
          key: '/followup/automatic',
          label: language === 'ar' ? 'المتابعة التلقائية' : 'Automatic Follow-up',
        },
        { key: '/followup/none', label: language === 'ar' ? 'بدون متابعة' : 'No Follow-up' },
        { key: '/followup/warranty', label: language === 'ar' ? 'الضمان' : 'Warranty' },
      ],
    },
    {
      key: 'reports',
      icon: <FileSearchOutlined />,
      label: language === 'ar' ? 'التقارير' : 'Reports',
      children: [
        { key: '/reports/arrival', label: language === 'ar' ? 'تقرير الوصول' : 'Arrival Report' },
        {
          key: '/reports/alternatives',
          label: language === 'ar' ? 'تقرير البدائل' : 'Alternatives Report',
        },
        {
          key: '/reports/employees-productivity',
          label: language === 'ar' ? 'إنتاجية الموظفين' : 'Employee Productivity',
        },
      ],
    },
    {
      key: 'offers',
      icon: <GiftOutlined />,
      label: language === 'ar' ? 'العروض' : 'Offers',
      children: [
        {
          key: '/offers/mediation',
          label: language === 'ar' ? 'عروض الوساطة' : 'Mediation Offers',
        },
        { key: '/offers/rent', label: language === 'ar' ? 'عروض الإيجار' : 'Rent Offers' },
        {
          key: '/offers/rent-prices',
          label: language === 'ar' ? 'عروض أسعار الإيجار' : 'Rent Price Offers',
        },
      ],
    },
    {
      key: 'communication',
      icon: <MessageOutlined />,
      label: language === 'ar' ? 'التواصل' : 'Communication',
      children: [
        { key: '/communication/sms', label: language === 'ar' ? 'رسائل العملاء' : 'Customer SMS' },
        {
          key: '/communication/email',
          label: language === 'ar' ? 'إرسال بريد إلكتروني' : 'Send Email',
        },
        {
          key: '/communication/auto-sms',
          label: language === 'ar' ? 'الرسائل التلقائية' : 'Automatic SMS',
        },
        {
          key: '/communication/tracking-sms',
          label: language === 'ar' ? 'رسائل التتبع' : 'Tracking SMS',
        },
      ],
    },
    {
      key: 'agents',
      icon: <UserOutlined />,
      label: language === 'ar' ? 'الوكلاء' : 'Agents',
      children: [
        { key: '/agents', label: language === 'ar' ? 'جميع الوكلاء' : 'All Agents' },
        { key: '/agents/assignment', label: language === 'ar' ? 'تعيين الوكلاء' : 'Assignment' },
        {
          key: '/agents/sponsorship-transfer',
          label: language === 'ar' ? 'نقل الكفالة' : 'Sponsorship Transfer',
        },
      ],
    },
    {
      key: 'hr',
      icon: <IdcardOutlined />,
      label: language === 'ar' ? 'الموارد البشرية' : 'Human Resources',
      children: [
        { key: '/hr/departments', label: language === 'ar' ? 'الأقسام' : 'Departments' },
        {
          key: '/hr/requests-archive',
          label: language === 'ar' ? 'أرشيف الطلبات' : 'Requests Archive',
        },
      ],
    },
    {
      key: '/complaints',
      icon: <WarningOutlined />,
      label: (
        <Badge count={3} offset={[10, 0]} size="small">
          {language === 'ar' ? 'الشكاوى' : 'Complaints'}
        </Badge>
      ),
      onClick: () => router.push('/complaints'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: language === 'ar' ? 'الإعدادات' : 'Settings',
      children: [
        { key: '/settings/branch', label: language === 'ar' ? 'الفرع' : 'Branch' },
        { key: '/settings/documents', label: language === 'ar' ? 'المستندات' : 'Documents' },
        { key: '/settings/rules', label: language === 'ar' ? 'إدارة القواعد' : 'Rules Management' },
        { key: '/settings/themes', label: language === 'ar' ? 'المظهر' : 'Themes' },
        {
          key: '/settings/webpage',
          label: language === 'ar' ? 'إعدادات الموقع' : 'Webpage Settings',
        },
        { key: '/settings/sms', label: language === 'ar' ? 'إعدادات الرسائل' : 'SMS Settings' },
      ],
    },
  ];

  const handleMenuClick = (e: { key: string }) => {
    router.push(e.key);
    // Close mobile drawer on navigation
    onMobileDrawerClose();
  };

  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  const menuContent = (
    <>
      <div className={styles.logoContainer}>
        <Image
          src="/images/logo.png"
          alt="Logo"
          fill
          className={styles.logoImage}
          sizes={collapsed ? '60px' : '200px'}
        />
      </div>

      <Menu
        mode="inline"
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onOpenChange={handleOpenChange}
        items={menuItems}
        onClick={handleMenuClick}
        className={styles.menu}
        inlineCollapsed={collapsed}
      />
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className={`${styles.sidebar} ${styles.desktopSidebar}`}
        width={260}
        collapsedWidth={80}
      >
        {menuContent}
      </Sider>

      {/* Mobile Drawer */}
      <Drawer
        placement={language === 'ar' ? 'right' : 'left'}
        onClose={onMobileDrawerClose}
        open={mobileDrawerVisible}
        className={styles.mobileDrawer}
        width={260}
        closeIcon={null}
        styles={{ body: { padding: 0 } }}
      >
        <div className={styles.mobileSidebarContent}>{menuContent}</div>
      </Drawer>
    </>
  );
}
