/**
 * Central Enum Configuration
 * Defines all numeric lookup values used across the application
 * with labels in both Arabic and English.
 */

export interface EnumOption {
  value: number;
  labelAr: string;
  labelEn: string;
}

/**
 * Helper to get the label for an enum value based on language
 */
export function getEnumLabel(
  options: readonly EnumOption[],
  value: number | null | undefined,
  language: 'ar' | 'en'
): string {
  if (value === null || value === undefined)
    return language === 'ar' ? 'غير محدد' : 'Not Specified';
  const option = options.find((o) => o.value === value);
  return option ? (language === 'ar' ? option.labelAr : option.labelEn) : `${value}`;
}

/**
 * Helper to convert enum options to Ant Design Select options
 */
export function toSelectOptions(options: readonly EnumOption[], language: 'ar' | 'en') {
  return options.map((o) => ({
    value: o.value,
    label: language === 'ar' ? o.labelAr : o.labelEn,
  }));
}

// ==================== Worker Type ====================
// نوع العامل
export const WORKER_TYPE = [
  { value: 0, labelAr: 'غير معين', labelEn: 'Unassigned' },
  { value: 1, labelAr: 'معين', labelEn: 'Assigned' },
] as const;

// ==================== Religion ====================
// الديانة
export const RELIGION = [
  { value: 0, labelAr: 'غير محدد', labelEn: 'Not Specified' },
  { value: 1, labelAr: 'مسلم', labelEn: 'Muslim' },
  { value: 2, labelAr: 'غير مسلم', labelEn: 'Non-Muslim' },
] as const;

// ==================== Previous Experience ====================
// سبق له العمل
export const PREVIOUS_EXPERIENCE = [
  { value: 0, labelAr: 'غير محدد', labelEn: 'Not Specified' },
  { value: 1, labelAr: 'سبق له العمل', labelEn: 'Has Previous Experience' },
  { value: 2, labelAr: 'لم يسبق له العمل', labelEn: 'No Previous Experience' },
] as const;

// ==================== Complaint Type ====================
// نوع الشكوى
export const COMPLAINT_TYPE = [
  { value: 1, labelAr: 'قضية', labelEn: 'Case' },
  { value: 3, labelAr: 'معاملة', labelEn: 'Transaction' },
] as const;

// ==================== Complaint From ====================
// مصدر الشكوى
export const COMPLAINT_FROM = [
  { value: 5, labelAr: 'من العامل', labelEn: 'From Worker' },
  { value: 2, labelAr: 'من الوكيل', labelEn: 'From Agent' },
  { value: 3, labelAr: 'من السفارة', labelEn: 'From Embassy' },
  { value: 4, labelAr: 'من الوزارة', labelEn: 'From Ministry' },
  { value: 6, labelAr: 'شكوى لعقد', labelEn: 'Contract Complaint' },
] as const;

// ==================== Worker Location ====================
// موقع العامل
export const WORKER_LOCATION = [
  { value: 0, labelAr: 'غير محدد', labelEn: 'Not Specified' },
  { value: 1, labelAr: 'في السكن', labelEn: 'In Accommodation' },
  { value: 2, labelAr: 'عند العميل', labelEn: 'At Customer Home' },
] as const;

// ==================== Contract Type ====================
// نوع العقد
export const CONTRACT_TYPE = [
  { value: 1, labelAr: 'عقد استقدام', labelEn: 'Recruitment Contract' },
  { value: 2, labelAr: 'عقد تأجير', labelEn: 'Rent Contract' },
  { value: 3, labelAr: 'نقل كفالة', labelEn: 'Sponsorship Transfer' },
] as const;

// ==================== Authorization System ====================
// نظام التفويض
export const AUTHORIZATION_SYSTEM = [
  { value: 0, labelAr: 'غير محدد', labelEn: 'Not Specified' },
  { value: 1, labelAr: 'مساند', labelEn: 'Musaned' },
  { value: 2, labelAr: 'يدوي', labelEn: 'Manual' },
] as const;

// ==================== Gender ====================
// الجنس
export const GENDER = [
  { value: 0, labelAr: 'ذكر', labelEn: 'Male' },
  { value: 1, labelAr: 'أنثى', labelEn: 'Female' },
] as const;

// ==================== Marital Status ====================
// الحالة الاجتماعية
export const MARITAL_STATUS = [
  { value: 0, labelAr: 'أعزب', labelEn: 'Single' },
  { value: 1, labelAr: 'متزوج', labelEn: 'Married' },
  { value: 2, labelAr: 'مطلق', labelEn: 'Divorced' },
  { value: 3, labelAr: 'أرمل', labelEn: 'Widowed' },
] as const;

// ==================== Identity Type ====================
// نوع الهوية
export const IDENTITY_TYPE = [
  { value: 1, labelAr: 'هوية وطنية', labelEn: 'National ID' },
  { value: 2, labelAr: 'إقامة', labelEn: 'Residency' },
  { value: 3, labelAr: 'جواز سفر', labelEn: 'Passport' },
] as const;

// ==================== Housing Type ====================
// نوع السكن
export const HOUSING_TYPE = [
  { value: 1, labelAr: 'شقة', labelEn: 'Apartment' },
  { value: 2, labelAr: 'فيلا', labelEn: 'Villa' },
  { value: 3, labelAr: 'دور', labelEn: 'Floor' },
] as const;

// ==================== Worker Status ====================
// حالة العامل
export const WORKER_STATUS = [
  { value: 0, labelAr: 'غير محدد', labelEn: 'Unknown' },
  { value: 1, labelAr: 'متاح', labelEn: 'Available' },
  { value: 2, labelAr: 'مخصص', labelEn: 'Assigned' },
  { value: 3, labelAr: 'في عقد', labelEn: 'In Contract' },
] as const;

// ==================== Offer Type ====================
// نوع العرض
export const OFFER_TYPE = [
  { value: 1, labelAr: 'عرض عادي', labelEn: 'Normal Offer' },
  { value: 2, labelAr: 'عرض خاص', labelEn: 'Special Offer' },
] as const;

// ==================== Offer Contract Type ====================
// نوع عقد العرض
export const OFFER_CONTRACT_TYPE = [
  { value: 1, labelAr: 'توسط', labelEn: 'Mediation' },
  { value: 2, labelAr: 'تشغيل', labelEn: 'Operation' },
] as const;

// ==================== Issue State (Complaints) ====================
// حالة القضية
export const ISSUE_STATE = [
  { value: 1, labelAr: 'اللجان العمالية', labelEn: 'Labor Committees' },
  { value: 2, labelAr: 'وحدة الدعم والحماية', labelEn: 'Support & Protection Unit' },
] as const;

// ==================== Request Type ====================
// حالة الطلب
export const REQUEST_TYPE = [
  { value: 0, labelAr: 'معلق', labelEn: 'Pending' },
  { value: 1, labelAr: 'مراجعة', labelEn: 'Under Review' },
  { value: 2, labelAr: 'مقبول', labelEn: 'Accepted' },
  { value: 3, labelAr: 'مرفوض', labelEn: 'Refused' },
] as const;

// ==================== Privilege Type ====================
// نوع الصلاحية
export const PRIVILEGE_TYPE = [
  { value: 0, labelAr: 'موظف', labelEn: 'Employee' },
  { value: 1, labelAr: 'وكيل', labelEn: 'Agent' },
] as const;

// ==================== Agent Contract Type ====================
// نوع عقد الوكيل
export const AGENT_CONTRACT_TYPE = [
  { value: 0, labelAr: 'غير محدد', labelEn: 'Not Specified' },
  { value: 1, labelAr: 'حصري', labelEn: 'Exclusive' },
  { value: 2, labelAr: 'غير حصري', labelEn: 'Non-Exclusive' },
] as const;

// ==================== Organization Type ====================
// نوع المنظمة
export const ORGANIZATION_TYPE = [
  { value: 1, labelAr: 'فردية', labelEn: 'Individual' },
  { value: 2, labelAr: 'شراكة', labelEn: 'Partnership' },
  { value: 3, labelAr: 'شركة', labelEn: 'Company' },
] as const;

// ==================== Document Type ====================
// نوع المستند
export const DOCUMENT_TYPE = [
  { value: 1, labelAr: 'جواز سفر', labelEn: 'Passport' },
  { value: 2, labelAr: 'تأشيرة', labelEn: 'Visa' },
  { value: 3, labelAr: 'عقد', labelEn: 'Contract' },
  { value: 4, labelAr: 'أخرى', labelEn: 'Other' },
] as const;

// ==================== Date Type ====================
// نوع التاريخ
export const DATE_TYPE = [
  { value: 1, labelAr: 'ميلادي', labelEn: 'Gregorian' },
  { value: 2, labelAr: 'هجري', labelEn: 'Hijri' },
] as const;

// ==================== Nationalities ====================
// الجنسيات
export const NATIONALITIES = [
  { value: 359, labelAr: 'الفلبين', labelEn: 'Philippines' },
  { value: 360, labelAr: 'كينيا', labelEn: 'Kenya' },
  { value: 361, labelAr: 'أوغندا', labelEn: 'Uganda' },
  { value: 362, labelAr: 'الهند', labelEn: 'India' },
  { value: 363, labelAr: 'السودان', labelEn: 'Sudan' },
  { value: 364, labelAr: 'مصر', labelEn: 'Egypt' },
  { value: 365, labelAr: 'بوروندي', labelEn: 'Burundi' },
  { value: 366, labelAr: 'بنجلادش', labelEn: 'Bangladesh' },
  { value: 367, labelAr: 'باكستان', labelEn: 'Pakistan' },
  { value: 482, labelAr: 'المغرب', labelEn: 'Morocco' },
  { value: 701, labelAr: 'سريلانكا', labelEn: 'Sri Lanka' },
  { value: 731, labelAr: 'أثيوبيا', labelEn: 'Ethiopia' },
  { value: 771, labelAr: 'أندونيسيا', labelEn: 'Indonesia' },
  { value: 839, labelAr: 'اليمن', labelEn: 'Yemen' },
] as const;
