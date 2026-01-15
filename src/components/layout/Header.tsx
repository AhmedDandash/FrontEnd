'use client';

import React from 'react';
import { Layout, Badge, Dropdown, Avatar, Button } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';
import styles from './Header.module.css';

const { Header: AntHeader } = Layout;

interface HeaderProps {
  collapsed: boolean;
  onToggleSidebar: () => void;
  onToggleMobileDrawer: () => void;
}

export default function Header({ collapsed, onToggleSidebar, onToggleMobileDrawer }: HeaderProps) {
  const router = useRouter();
  const language = useAuthStore((state) => state.language);
  const setLanguage = useAuthStore((state) => state.setLanguage);

  const handleLanguageChange = (lang: 'ar' | 'en') => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/login');
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: language === 'ar' ? 'الملف الشخصي' : 'Profile',
      onClick: () => router.push('/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: language === 'ar' ? 'الإعدادات' : 'Settings',
      onClick: () => router.push('/settings'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: language === 'ar' ? 'تسجيل الخروج' : 'Logout',
      danger: true,
      onClick: handleLogout,
    },
  ];

  const notificationItems: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div className={styles.notificationItem}>
          <div className={styles.notificationTitle}>
            {language === 'ar' ? 'عقد جديد' : 'New Contract'}
          </div>
          <div className={styles.notificationDesc}>
            {language === 'ar' ? 'تم إضافة عقد جديد #12345' : 'New contract #12345 added'}
          </div>
          <div className={styles.notificationTime}>
            {language === 'ar' ? 'منذ 5 دقائق' : '5 minutes ago'}
          </div>
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <div className={styles.notificationItem}>
          <div className={styles.notificationTitle}>
            {language === 'ar' ? 'شكوى جديدة' : 'New Complaint'}
          </div>
          <div className={styles.notificationDesc}>
            {language === 'ar' ? 'شكوى عميل تحتاج إلى مراجعة' : 'Customer complaint needs review'}
          </div>
          <div className={styles.notificationTime}>
            {language === 'ar' ? 'منذ ساعة' : '1 hour ago'}
          </div>
        </div>
      ),
    },
    {
      key: '3',
      label: (
        <div className={styles.notificationItem}>
          <div className={styles.notificationTitle}>{language === 'ar' ? 'تذكير' : 'Reminder'}</div>
          <div className={styles.notificationDesc}>
            {language === 'ar' ? 'موعد متابعة مع العميل اليوم' : 'Follow-up meeting today'}
          </div>
          <div className={styles.notificationTime}>
            {language === 'ar' ? 'منذ 3 ساعات' : '3 hours ago'}
          </div>
        </div>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: 'view-all',
      label: (
        <div className={styles.viewAllNotifications}>
          {language === 'ar' ? 'عرض جميع الإشعارات' : 'View all notifications'}
        </div>
      ),
    },
  ];

  return (
    <AntHeader className={styles.header}>
      <div className={styles.headerLeft}>
        {/* Desktop Toggle */}
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggleSidebar}
          className={`${styles.toggleBtn} ${styles.desktopOnly}`}
        />

        {/* Mobile Toggle */}
        <Button
          type="text"
          icon={<MenuUnfoldOutlined />}
          onClick={onToggleMobileDrawer}
          className={`${styles.toggleBtn} ${styles.mobileOnly}`}
        />

        {/* Mobile Logo */}
        <div className={`${styles.mobileLogo} ${styles.mobileOnly}`}>
          <Image src="/images/logo.png" alt="Logo" width={32} height={32} />
        </div>
      </div>

      <div className={styles.headerRight}>
        {/* Language Switcher */}
        <div className={styles.langSwitcher}>
          <Button
            type="text"
            icon={<GlobalOutlined />}
            onClick={() => handleLanguageChange(language === 'ar' ? 'en' : 'ar')}
            className={styles.langBtn}
          >
            <span className={styles.desktopOnly}>{language === 'ar' ? 'EN' : 'عربي'}</span>
          </Button>
        </div>

        {/* Notifications */}
        <Dropdown
          menu={{ items: notificationItems }}
          placement="bottomRight"
          trigger={['click']}
          classNames={{ root: styles.notificationDropdown }}
        >
          <Badge count={5} overflowCount={99} className={styles.notificationBadge}>
            <Button type="text" icon={<BellOutlined />} className={styles.iconBtn} />
          </Badge>
        </Dropdown>

        {/* User Menu */}
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
          <div className={styles.userInfo}>
            <Avatar icon={<UserOutlined />} className={styles.avatar} />
            <span className={`${styles.userName} ${styles.desktopOnly}`}>
              {language === 'ar' ? 'أحمد محمد' : 'Ahmed Mohamed'}
            </span>
          </div>
        </Dropdown>
      </div>
    </AntHeader>
  );
}
