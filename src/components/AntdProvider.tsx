'use client';

import React from 'react';
import { ConfigProvider } from 'antd';
import { useAuthStore } from '@/store/authStore';

export function AntdProvider({ children }: { children: React.ReactNode }) {
  const language = useAuthStore((state) => state.language);
  const direction = language === 'ar' ? 'rtl' : 'ltr';

  return <ConfigProvider direction={direction}>{children}</ConfigProvider>;
}
