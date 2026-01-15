'use client';

import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import {
  UserOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/store/authStore';

export default function DashboardPage() {
  const language = useAuthStore((state) => state.language);

  return (
    <div>
      <h1 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600 }}>
        {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
      </h1>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={language === 'ar' ? 'إجمالي العملاء' : 'Total Customers'}
              value={1248}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#003366' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={language === 'ar' ? 'العقود النشطة' : 'Active Contracts'}
              value={356}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#00478C' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={language === 'ar' ? 'العقود المكتملة' : 'Completed Contracts'}
              value={892}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#00AA64' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={language === 'ar' ? 'قيد المعالجة' : 'Pending'}
              value={45}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Card title={language === 'ar' ? 'الأنشطة الأخيرة' : 'Recent Activities'}>
            <p>{language === 'ar' ? 'لا توجد أنشطة حديثة' : 'No recent activities'}</p>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title={language === 'ar' ? 'الإشعارات' : 'Notifications'}>
            <p>{language === 'ar' ? 'لا توجد إشعارات جديدة' : 'No new notifications'}</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
