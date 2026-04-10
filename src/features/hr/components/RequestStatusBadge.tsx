'use client';

import React from 'react';
import { Tag } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/store/authStore';
import type { HRRequestResult } from '@/types/hr.types';

interface RequestStatusBadgeProps {
  result: HRRequestResult;
}

const STATUS_CONFIG: Record<
  HRRequestResult,
  { color: string; icon: React.ReactNode; labelAr: string; labelEn: string }
> = {
  0: { color: 'default', icon: <QuestionCircleOutlined />, labelAr: 'غير محدد', labelEn: 'Unspecified' },
  1: { color: 'success', icon: <CheckCircleOutlined />, labelAr: 'موافق', labelEn: 'Approved' },
  2: { color: 'error', icon: <CloseCircleOutlined />, labelAr: 'مرفوض', labelEn: 'Rejected' },
  3: { color: 'processing', icon: <ClockCircleOutlined />, labelAr: 'قيد الانتظار', labelEn: 'Pending' },
};

export default function RequestStatusBadge({ result }: RequestStatusBadgeProps) {
  const language = useAuthStore((s) => s.language);
  const config = STATUS_CONFIG[result] ?? STATUS_CONFIG[0];
  return (
    <Tag color={config.color} icon={config.icon}>
      {language === 'ar' ? config.labelAr : config.labelEn}
    </Tag>
  );
}
