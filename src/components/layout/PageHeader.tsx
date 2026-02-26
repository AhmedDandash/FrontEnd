'use client';

import React from 'react';
import styles from './PageHeader.module.css';

interface PageHeaderProps {
  /** Page title */
  title: string;
  /** Optional subtitle (e.g. record count) */
  subtitle?: string;
  /** Ant Design icon component */
  icon?: React.ReactNode;
  /** Action buttons / controls rendered on the right side */
  actions?: React.ReactNode;
}

/**
 * Standardized page header component used across all pages.
 * Provides consistent layout: icon + title on the left, action buttons on the right.
 */
export default function PageHeader({ title, subtitle, icon, actions }: PageHeaderProps) {
  return (
    <div className={styles.pageHeader}>
      <div className={styles.headerContent}>
        <div className={styles.headerLeft}>
          {icon && <span className={styles.headerIcon}>{icon}</span>}
          <div className={styles.headerText}>
            <h1 className={styles.headerTitle}>{title}</h1>
            {subtitle && <p className={styles.headerSubtitle}>{subtitle}</p>}
          </div>
        </div>
        {actions && <div className={styles.headerActions}>{actions}</div>}
      </div>
    </div>
  );
}
