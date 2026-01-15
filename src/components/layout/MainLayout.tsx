'use client';

import React, { useState } from 'react';
import { Layout } from 'antd';
import Sidebar from './Sidebar';
import Header from './Header';
import Breadcrumbs from './Breadcrumbs';
import { usePathname } from 'next/navigation';
import styles from './MainLayout.module.css';

const { Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);
  const pathname = usePathname();

  // Don't show layout on login page
  if (pathname === '/login') {
    return <>{children}</>;
  }

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileDrawer = () => {
    setMobileDrawerVisible(!mobileDrawerVisible);
  };

  return (
    <Layout className={styles.mainLayout} hasSider>
      <Sidebar
        collapsed={collapsed}
        mobileDrawerVisible={mobileDrawerVisible}
        onMobileDrawerClose={() => setMobileDrawerVisible(false)}
      />

      <Layout
        className={`${styles.contentLayout} ${collapsed ? styles.contentLayoutCollapsed : ''}`}
      >
        <Header
          collapsed={collapsed}
          onToggleSidebar={toggleSidebar}
          onToggleMobileDrawer={toggleMobileDrawer}
        />

        <Content className={styles.content}>
          <Breadcrumbs />
          <div className={styles.pageContent}>{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
}
