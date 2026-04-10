/**
 * HR Module – Enum Definitions
 * Bilingual (Arabic / English) options for all HR select fields.
 * Use with getEnumLabel() and toSelectOptions() from ./enums.ts
 */

import type { EnumOption } from './enums';

// ─────────────────────────────────────────────
// Request Result (نتيجة الطلب)
// ─────────────────────────────────────────────
export const HR_REQUEST_RESULT: readonly EnumOption[] = [
  { value: 0, labelAr: 'غير محدد', labelEn: 'Unspecified' },
  { value: 1, labelAr: 'موافق', labelEn: 'Approved' },
  { value: 2, labelAr: 'مرفوض', labelEn: 'Rejected' },
  { value: 3, labelAr: 'قيد الانتظار', labelEn: 'Pending' },
] as const;

// ─────────────────────────────────────────────
// Process State / Request Type (نوع الطلب)
// ─────────────────────────────────────────────
export const HR_PROCESS_STATE: readonly EnumOption[] = [
  { value: 1, labelAr: 'إجازة', labelEn: 'Vacation' },
  { value: 2, labelAr: 'إذن', labelEn: 'Permission' },
  { value: 4, labelAr: 'عهدة', labelEn: 'Custody' },
  { value: 5, labelAr: 'تعديل وظيفي', labelEn: 'Job Modification' },
  { value: 6, labelAr: 'استقالة', labelEn: 'Resignation' },
  { value: 7, labelAr: 'مستحقات', labelEn: 'Entitlements' },
  { value: 8, labelAr: 'قرض', labelEn: 'Loan' },
  { value: 9, labelAr: 'أخرى', labelEn: 'Other' },
] as const;

// ─────────────────────────────────────────────
// Vacation Type (نوع الإجازة)
// Values map to backend enum IDs from legacy HTML
// ─────────────────────────────────────────────
export const HR_VACATION_TYPE: readonly EnumOption[] = [
  { value: 81, labelAr: 'إجازة سنوية', labelEn: 'Annual Leave' },
  { value: 72, labelAr: 'إجازة مرضية', labelEn: 'Sick Leave' },
  { value: 77, labelAr: 'إجازة بدون راتب', labelEn: 'Unpaid Leave' },
  { value: 78, labelAr: 'إجازة وضع', labelEn: 'Maternity Leave' },
  { value: 79, labelAr: 'إجازة عارضة', labelEn: 'Casual Leave' },
  { value: 84, labelAr: 'إجازة حج', labelEn: 'Hajj Leave' },
  { value: 80, labelAr: 'إجازة زواج', labelEn: 'Marriage Leave' },
  { value: 73, labelAr: 'إجازة وفاة', labelEn: 'Bereavement Leave' },
  { value: 82, labelAr: 'إجازة اضطرارية', labelEn: 'Emergency Leave' },
  { value: 83, labelAr: 'إجازة رياضية', labelEn: 'Sports Leave' },
] as const;

// ─────────────────────────────────────────────
// Permission Type (نوع الإذن)
// ─────────────────────────────────────────────
export const HR_PERMISSION_TYPE: readonly EnumOption[] = [
  { value: 1, labelAr: 'تأخر', labelEn: 'Come Late' },
  { value: 2, labelAr: 'دوام جزئي', labelEn: 'Part Time' },
  { value: 3, labelAr: 'انصراف مبكر', labelEn: 'Out Early' },
] as const;

// ─────────────────────────────────────────────
// Permission Nature (طبيعة الإذن)
// ─────────────────────────────────────────────
export const HR_PERMISSION_NATURE: readonly EnumOption[] = [
  { value: 1, labelAr: 'رسمي', labelEn: 'Official' },
  { value: 2, labelAr: 'شخصي', labelEn: 'Personal' },
] as const;

// ─────────────────────────────────────────────
// Entitlement Type (نوع المستحقات)
// ─────────────────────────────────────────────
export const HR_ENTITLEMENT_TYPE: readonly EnumOption[] = [
  { value: 1, labelAr: 'بدل سكن', labelEn: 'Housing Allowance' },
  { value: 2, labelAr: 'بدل مواصلات', labelEn: 'Transportation Allowance' },
  { value: 3, labelAr: 'بدل هاتف', labelEn: 'Phone Allowance' },
  { value: 4, labelAr: 'بدل طبي', labelEn: 'Medical Allowance' },
  { value: 5, labelAr: 'أخرى', labelEn: 'Other' },
] as const;

// ─────────────────────────────────────────────
// Attendance Status (حالة الحضور)
// ─────────────────────────────────────────────
export const HR_ATTENDANCE_STATUS: readonly EnumOption[] = [
  { value: 0, labelAr: 'غير محدد', labelEn: 'Unknown' },
  { value: 1, labelAr: 'حاضر', labelEn: 'Present' },
  { value: 2, labelAr: 'غائب', labelEn: 'Absent' },
  { value: 3, labelAr: 'متأخر', labelEn: 'Late' },
] as const;

// ─────────────────────────────────────────────
// HR Complaint Status (حالة الشكوى الوظيفية)
// ─────────────────────────────────────────────
export const HR_COMPLAINT_STATUS: readonly EnumOption[] = [
  { value: 1, labelAr: 'مفتوحة', labelEn: 'Open' },
  { value: 2, labelAr: 'محلولة', labelEn: 'Resolved' },
  { value: 3, labelAr: 'مغلقة', labelEn: 'Closed' },
] as const;

// ─────────────────────────────────────────────
// Commission Type (نوع العمولة)
// ─────────────────────────────────────────────
export const HR_COMMISSION_TYPE: readonly EnumOption[] = [
  { value: 1, labelAr: 'مكافأة', labelEn: 'Bonus' },
  { value: 2, labelAr: 'عمولة مبيعات', labelEn: 'Sales Commission' },
  { value: 3, labelAr: 'حوافز', labelEn: 'Incentive' },
  { value: 4, labelAr: 'أخرى', labelEn: 'Other' },
] as const;
