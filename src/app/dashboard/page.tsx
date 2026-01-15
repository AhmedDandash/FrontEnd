'use client';

import React from 'react';
import { Card, Row, Col, Badge, Progress, Avatar, Table, Tag } from 'antd';
import {
  UserOutlined,
  FileTextOutlined,
  TeamOutlined,
  RiseOutlined,
  FallOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  GlobalOutlined,
  TrophyOutlined,
  RocketOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/store/authStore';
import styles from './Dashboard.module.css';

export default function DashboardPage() {
  const language = useAuthStore((state) => state.language);

  // Mock data based on old dashboard
  const branchInfo = {
    name: language === 'ar' ? 'سيجما الكفاءات للاستقدام' : 'Sigma Competencies Recruitment',
    branches: 2,
    phone: '0556619911',
    license: '3709201',
  };

  const statsCards = [
    {
      title: language === 'ar' ? 'إجمالي العملاء' : 'Total Customers',
      value: 11281,
      change: +12.5,
      icon: <TeamOutlined />,
      color: '#00478C',
      bgGradient: 'linear-gradient(135deg, #00478C 0%, #0056A3 100%)',
    },
    {
      title: language === 'ar' ? 'عقود التوسط' : 'Mediation Contracts',
      value: 6888,
      change: +8.3,
      icon: <FileTextOutlined />,
      color: '#00AA64',
      bgGradient: 'linear-gradient(135deg, #00AA64 0%, #00B478 100%)',
    },
    {
      title: language === 'ar' ? 'معدل النجاح' : 'Success Rate',
      value: 94.2,
      suffix: '%',
      change: +2.1,
      icon: <TrophyOutlined />,
      color: '#F59E0B',
      bgGradient: 'linear-gradient(135deg, #F59E0B 0%, #F9B234 100%)',
    },
    {
      title: language === 'ar' ? 'العقود النشطة' : 'Active Contracts',
      value: 4846,
      change: -1.2,
      icon: <RocketOutlined />,
      color: '#003366',
      bgGradient: 'linear-gradient(135deg, #003366 0%, #004080 100%)',
    },
  ];

  const contractsStatus = [
    { label: language === 'ar' ? 'بدون توقيع' : 'Without Signature', value: 42, color: '#F59E0B' },
    { label: language === 'ar' ? 'بدون عمالة' : 'Without Workers', value: 6, color: '#EF4444' },
    {
      label: language === 'ar' ? 'بدون ارساليات' : 'Without Shipments',
      value: 6,
      color: '#EF4444',
    },
    {
      label: language === 'ar' ? 'عقود ملغية' : 'Cancelled Contracts',
      value: 2000,
      color: '#6B7280',
    },
  ];

  const recentContracts = [
    {
      id: 6888,
      customer: language === 'ar' ? 'خليف بن براهيم الرشيدي' : 'Khalif Al-Rashidi',
      phone: '0552479901',
      worker: '',
      nationality: language === 'ar' ? 'باكستان' : 'Pakistan',
      status: 'new',
    },
    {
      id: 6887,
      customer: language === 'ar' ? 'نداء خالد احمد طاهر' : 'Nidaa Ahmad Taher',
      phone: '0550021702',
      worker: 'MARIA IVY RUFO MORENO',
      nationality: language === 'ar' ? 'الفلبين' : 'Philippines',
      status: 'new',
    },
    {
      id: 6886,
      customer: language === 'ar' ? 'نداء خالد احمد طاهر' : 'Nidaa Ahmad Taher',
      phone: '0550021702',
      worker: 'NASEEM (SECTOR-OPEN)',
      nationality: language === 'ar' ? 'الهند' : 'India',
      status: 'new',
    },
    {
      id: 6885,
      customer: language === 'ar' ? 'دانيه عبدالله ضياء' : 'Dania Abdullah',
      phone: '553558281',
      worker: 'SYLVIE RIA DEL PRADO',
      nationality: language === 'ar' ? 'الفلبين' : 'Philippines',
      status: 'processing',
    },
    {
      id: 6884,
      customer: language === 'ar' ? 'ابتسام ظاهر الحربي' : 'Ibtisam Al-Harbi',
      phone: '0544657672',
      worker: 'ZEBIBA WERKU TEGEGNE',
      nationality: language === 'ar' ? 'أثيوبيا' : 'Ethiopia',
      status: 'processing',
    },
  ];

  const upcomingArrivals = [
    {
      contract: 6489,
      worker: 'SINKNESH GONFA WOKENE',
      profession: language === 'ar' ? 'عاملة منزلية' : 'Domestic Worker',
      passport: 'EP6798439',
      arrival: '2026/1/21',
    },
    {
      contract: 6451,
      worker: 'TEMRE WUSSEN BEKELE',
      profession: language === 'ar' ? 'عاملة منزلية' : 'Domestic Worker',
      passport: 'EQ1577199',
      arrival: '2026/1/18',
    },
    {
      contract: 6452,
      worker: 'GETE HAILU TADESSE',
      profession: language === 'ar' ? 'عاملة منزلية' : 'Domestic Worker',
      passport: 'EP9259820',
      arrival: '2026/1/18',
    },
    {
      contract: 6518,
      worker: 'NEJAT AHMED SIRAJ',
      profession: language === 'ar' ? 'عاملة منزلية' : 'Domestic Worker',
      passport: 'EQ2818177',
      arrival: '2026/1/18',
    },
  ];

  const externalUpdates = [
    {
      contract: 6644,
      employee: language === 'ar' ? 'عمر محمد بوبكر' : 'Omar M. Boubker',
      status: language === 'ar' ? 'تم التأشير' : 'Visa Approved',
      time: '14/01/2026 04:59 PM',
    },
    {
      contract: 6654,
      employee: language === 'ar' ? 'مهند احمد المحضار' : 'Muhannad A. Al-Mihdhar',
      status: language === 'ar' ? 'تم حجز التذكرة' : 'Ticket Booked',
      time: '14/01/2026 04:43 PM',
    },
    {
      contract: 6540,
      employee: language === 'ar' ? 'مهند احمد المحضار' : 'Muhannad A. Al-Mihdhar',
      status: language === 'ar' ? 'تم التأشير' : 'Visa Approved',
      time: '14/01/2026 04:42 PM',
    },
  ];

  const getStatusTag = (status: string) => {
    const statusConfig: { [key: string]: { color: string; text: string } } = {
      new: { color: '#00AA64', text: language === 'ar' ? 'جديد' : 'New' },
      processing: { color: '#F59E0B', text: language === 'ar' ? 'قيد المعالجة' : 'Processing' },
      completed: { color: '#00478C', text: language === 'ar' ? 'مكتمل' : 'Completed' },
    };
    const config = statusConfig[status] || statusConfig.new;
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const contractColumns = [
    {
      title: language === 'ar' ? 'رقم العقد' : 'Contract #',
      dataIndex: 'id',
      key: 'id',
      render: (id: number) => <a className={styles.link}>#{id}</a>,
    },
    {
      title: language === 'ar' ? 'العميل' : 'Customer',
      dataIndex: 'customer',
      key: 'customer',
      render: (name: string) => <span className={styles.customerName}>{name}</span>,
    },
    {
      title: language === 'ar' ? 'الجوال' : 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: language === 'ar' ? 'اسم العامل' : 'Worker Name',
      dataIndex: 'worker',
      key: 'worker',
      render: (worker: string) => worker || <span style={{ color: '#9CA3AF' }}>—</span>,
    },
    {
      title: language === 'ar' ? 'الجنسية' : 'Nationality',
      dataIndex: 'nationality',
      key: 'nationality',
      render: (nationality: string) => (
        <Tag icon={<GlobalOutlined />} color="blue">
          {nationality}
        </Tag>
      ),
    },
    {
      title: language === 'ar' ? 'الحالة' : 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
  ];

  return (
    <div className={styles.dashboard}>
      {/* Stats Cards */}
      <Row gutter={[24, 24]} className={styles.statsRow}>
        {statsCards.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card className={styles.statCard} variant="borderless">
              <div className={styles.statCardContent}>
                <div className={styles.statIcon} style={{ background: stat.bgGradient }}>
                  {stat.icon}
                </div>
                <div className={styles.statDetails}>
                  <div className={styles.statTitle}>{stat.title}</div>
                  <div className={styles.statValue}>
                    {stat.value.toLocaleString()}
                    {stat.suffix && <span className={styles.statSuffix}>{stat.suffix}</span>}
                  </div>
                  <div className={styles.statChange}>
                    {stat.change > 0 ? (
                      <>
                        <RiseOutlined style={{ color: '#00AA64' }} />
                        <span style={{ color: '#00AA64' }}>+{stat.change}%</span>
                      </>
                    ) : (
                      <>
                        <FallOutlined style={{ color: '#EF4444' }} />
                        <span style={{ color: '#EF4444' }}>{stat.change}%</span>
                      </>
                    )}
                    <span className={styles.statPeriod}>
                      {language === 'ar' ? 'هذا الشهر' : 'This month'}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]} className={styles.contentRow}>
        {/* Branch Info & Contract Status */}
        <Col xs={24} lg={8}>
          <Card
            className={styles.infoCard}
            title={language === 'ar' ? 'معلومات الفرع' : 'Branch Information'}
            variant="borderless"
          >
            <div className={styles.branchHeader}>
              <Avatar size={64} icon={<UserOutlined />} className={styles.branchAvatar} />
              <div className={styles.branchDetails}>
                <h3>{branchInfo.name}</h3>
                <div className={styles.branchMeta}>
                  <Badge count={branchInfo.branches} style={{ backgroundColor: '#00AA64' }} />
                  <span>{language === 'ar' ? 'فرع نشط' : 'Active Branches'}</span>
                </div>
              </div>
            </div>
            <div className={styles.branchInfo}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>{language === 'ar' ? 'الجوال:' : 'Phone:'}</span>
                <span className={styles.infoValue}>{branchInfo.phone}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>
                  {language === 'ar' ? 'رخصة الفرع:' : 'License:'}
                </span>
                <span className={styles.infoValue}>{branchInfo.license}</span>
              </div>
            </div>
          </Card>

          <Card
            className={styles.statusCard}
            title={language === 'ar' ? 'حالة العقود' : 'Contracts Status'}
            variant="borderless"
            style={{ marginTop: 24 }}
          >
            {contractsStatus.map((item, index) => (
              <div key={index} className={styles.statusItem}>
                <div className={styles.statusHeader}>
                  <span className={styles.statusLabel}>{item.label}</span>
                  <span className={styles.statusValue} style={{ color: item.color }}>
                    {item.value}
                  </span>
                </div>
                <Progress
                  percent={(item.value / 6888) * 100}
                  strokeColor={item.color}
                  showInfo={false}
                  className={styles.statusProgress}
                />
              </div>
            ))}
          </Card>
        </Col>

        {/* Recent Contracts */}
        <Col xs={24} lg={16}>
          <Card
            className={styles.tableCard}
            title={
              <div className={styles.cardHeader}>
                <span>{language === 'ar' ? 'عقود جديدة' : 'New Contracts'}</span>
                <Badge count={recentContracts.length} style={{ backgroundColor: '#00AA64' }} />
              </div>
            }
            variant="borderless"
          >
            <Table
              dataSource={recentContracts}
              columns={contractColumns}
              pagination={false}
              rowKey="id"
              className={styles.modernTable}
              size="middle"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} className={styles.contentRow}>
        {/* Upcoming Arrivals */}
        <Col xs={24} lg={12}>
          <Card
            className={styles.tableCard}
            title={
              <div className={styles.cardHeader}>
                <span>{language === 'ar' ? 'عمالة سوف تصل قريبا' : 'Upcoming Arrivals'}</span>
                <Badge
                  count={upcomingArrivals.length}
                  showZero
                  style={{ backgroundColor: '#00478C' }}
                />
              </div>
            }
            variant="borderless"
          >
            <div className={styles.arrivalsList}>
              {upcomingArrivals.map((item, index) => (
                <div key={index} className={styles.arrivalItem}>
                  <div className={styles.arrivalHeader}>
                    <a className={styles.link}>#{item.contract}</a>
                    <Tag color="orange">{item.arrival}</Tag>
                  </div>
                  <div className={styles.arrivalWorker}>{item.worker}</div>
                  <div className={styles.arrivalMeta}>
                    <span>{item.profession}</span>
                    <span className={styles.separator}>•</span>
                    <span>{item.passport}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* External Updates */}
        <Col xs={24} lg={12}>
          <Card
            className={styles.tableCard}
            title={
              <div className={styles.cardHeader}>
                <span>
                  {language === 'ar' ? 'آخر التحديثات الخارجية' : 'Recent External Updates'}
                </span>
                <CheckCircleOutlined style={{ color: '#00AA64' }} />
              </div>
            }
            variant="borderless"
          >
            <div className={styles.updatesList}>
              {externalUpdates.map((item, index) => (
                <div key={index} className={styles.updateItem}>
                  <div className={styles.updateIcon}>
                    <CheckCircleOutlined />
                  </div>
                  <div className={styles.updateContent}>
                    <div className={styles.updateHeader}>
                      <a className={styles.link}>#{item.contract}</a>
                      <span className={styles.updateEmployee}>{item.employee}</span>
                    </div>
                    <div className={styles.updateStatus}>{item.status}</div>
                    <div className={styles.updateTime}>
                      <ClockCircleOutlined /> {item.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
