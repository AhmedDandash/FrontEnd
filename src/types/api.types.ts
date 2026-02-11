/**
 * API Type Definitions
 * Auto-generated TypeScript types from Swagger specification
 */

// ==================== Auth Types ====================
export interface LoginDto {
  username?: string | null;
  password?: string | null;
}

export interface RegisterDto {
  username?: string | null;
  password?: string | null;
  roles?: number[] | null;
}

export interface AuthResponse {
  token?: string;
  accessToken?: string;
  user?: User;
  message?: string;
}

// ==================== Branch Types ====================
export interface Branch {
  id: number;
  nameAr?: string | null;
  nameEn?: string | null;
  organizationTypeAr?: number | null;
  addressAr?: string | null;
  addressEn?: string | null;
  cityAr?: number | null;
  phone?: string | null;
  mobile?: string | null;
  email?: string | null;
  branchLicense?: string | null;
  commercialRegistrationNumber?: string | null;
  commercialRegistrationDate?: string | null;
  commercialRegistrationIssuedByAr?: string | null;
  laborLicenseNumber?: string | null;
  laborLicenseDate?: string | null;
  poBox?: string | null;
  postalCode?: string | null;
  managerNameAr?: string | null;
  EmbassyBranch?: string | null;
  whatsAppWelcomeTemplate?: string | null;
  mainBranch?: number | null;
  taxNumber?: string | null;
  domain?: string | null;
  appUrl?: string | null;
  zaka_RegistrationNameAr?: string | null;
  zaka_Commercial_Registration_Number?: string | null;
  zaka_TaxNumber?: string | null;
  zaka_Postal_Zone?: string | null;
  zaka_City_Name?: string | null;
  zaka_DistrictAr?: string | null;
  zaka_BuildingNumber?: string | null;
  zaka_StreetAr?: string | null;
  createdAt?: string | null;
}

export interface BranchDto {
  nameAr?: string | null;
  nameEn?: string | null;
  organizationTypeAr?: number | null;
  addressAr?: string | null;
  addressEn?: string | null;
  cityAr?: number | null;
  phone?: string | null;
  mobile?: string | null;
  email?: string | null;
  branchLicense?: string | null;
  commercialRegistrationNumber?: string | null;
  commercialRegistrationDate?: string | null;
  commercialRegistrationIssuedByAr?: string | null;
  laborLicenseNumber?: string | null;
  laborLicenseDate?: string | null;
  poBox?: string | null;
  postalCode?: string | null;
  managerNameAr?: string | null;
  EmbassyBranch?: string | null;
  whatsAppWelcomeTemplate?: string | null;
  mainBranch?: number | null;
  taxNumber?: string | null;
  domain?: string | null;
  appUrl?: string | null;
  zaka_RegistrationNameAr?: string | null;
  zaka_Commercial_Registration_Number?: string | null;
  zaka_TaxNumber?: string | null;
  zaka_Postal_Zone?: string | null;
  zaka_City_Name?: string | null;
  zaka_DistrictAr?: string | null;
  zaka_BuildingNumber?: string | null;
  zaka_StreetAr?: string | null;
}

// ==================== Privilege/Role Types ====================
export interface Privilege {
  id: number;
  name?: string | null;
  nameAr?: string | null;
  nameEn?: string | null;
  type?: number | null; // 0 = Employee, 1 = Agent
  typeName?: string | null;
  permissions?: string[] | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface UpdateRoleDto {
  name?: string | null;
  relatedTp?: number | null;
  nameEn?: string | null;
  type?: number | null;
  permissions?: string[] | null;
}

// ==================== Customer Types ====================
export interface Customer {
  id: number;
  arabicName?: string | null;
  englishName?: string | null;
  userId?: number | null;
  nationality?: number | null;
  identityType?: number | null;
  identityNumber?: string | null;
  identityIssueDate?: string | null;
  birthDate?: string | null;
  maritalStatus?: number | null;
  housingType?: number | null;
  mobile?: string | null;
  mobile2?: string | null;
  homePhone?: string | null;
  workPhone?: string | null;
  email?: string | null;
  fax?: string | null;
  poBox?: string | null;
  districtAr?: string | null;
  districtEn?: string | null;
  addressAr?: string | null;
  addressEn?: string | null;
  cityAr?: string | null;
  cityEn?: string | null;
  streetAr?: string | null;
  streetEn?: string | null;
  buildingNumber?: string | null;
  additionalNumber?: string | null;
  postalCode?: string | null;
  familyMembers?: number | null;
  childrenCount?: number | null;
  domesticWorkers?: number | null;
  floorsCount?: number | null;
  roomsPerFloor?: number | null;
  bathroomsCount?: number | null;
  emergencyContactNameAr?: string | null;
  emergencyContactNameEn?: string | null;
  emergencyContactMobile?: string | null;
  emergencyJobTitle?: string | null;
  emergencyCity?: string | null;
  emergencyCompany?: string | null;
  monthlyIncome?: number | null;
  accountOwnerName?: string | null;
  bankName?: string | null;
  iban?: string | null;
  bankAccountNumber?: string | null;
  taxNumber?: string | null;
}

export interface CreateCustomerDto {
  arabicName?: string | null;
  englishName?: string | null;
  userId: number;
  nationality: number;
  identityType: number;
  identityNumber?: string | null;
  identityIssueDate?: string | null;
  birthDate?: string | null;
  maritalStatus: number;
  housingType: number;
  mobile?: string | null;
  mobile2?: string | null;
  homePhone?: string | null;
  workPhone?: string | null;
  email?: string | null;
  districtAr?: string | null;
  districtEn?: string | null;
  addressAr?: string | null;
  addressEn?: string | null;
  cityAr?: string | null;
  cityEn?: string | null;
  familyMembers: number;
  childrenCount: number;
  domesticWorkers: number;
  monthlyIncome?: number | null;
}

export interface UpdateCustomerDto {
  arabicName?: string | null;
  englishName?: string | null;
  userId?: number | null;
  nationality?: number | null;
  identityType?: number | null;
  identityNumber?: string | null;
  identityIssueDate?: string | null;
  birthDate?: string | null;
  maritalStatus?: number | null;
  housingType?: number | null;
  mobile?: string | null;
  mobile2?: string | null;
  homePhone?: string | null;
  workPhone?: string | null;
  email?: string | null;
  districtAr?: string | null;
  districtEn?: string | null;
  addressAr?: string | null;
  addressEn?: string | null;
  cityAr?: string | null;
  cityEn?: string | null;
  familyMembers?: number | null;
  childrenCount?: number | null;
  domesticWorkers?: number | null;
  monthlyIncome?: number | null;
}

export interface CustomerPhoneDto {
  customerName?: string | null;
  phoneNumber?: string | null;
}

// ==================== Document Types ====================
export interface Document {
  id: number;
  documentNameAr?: string | null;
  documentNameEn?: string | null;
  documentTypeId?: number | null;
  dateType?: number | null;
  issueDate?: string | null;
  expiryDate?: string | null;
  reminderPeriodMonths?: number | null;
  fileNameAr?: string | null;
  fileNameEn?: string | null;
  filePath?: string | null;
}

export interface DocumentDto {
  documentNameAr?: string | null;
  documentNameEn?: string | null;
  documentTypeId?: number | null;
  dateType?: number | null;
  issueDate?: string | null;
  expiryDate?: string | null;
  reminderPeriodMonths?: number | null;
  fileNameAr?: string | null;
  fileNameEn?: string | null;
  filePath?: string | null;
}

// ==================== Role Types ====================
export interface Role {
  id: number;
  name?: string | null;
  relatedTo?: number | null;
}

export interface CreateRoleDto {
  name?: string | null;
  relatedTo?: number | null;
}

export interface UpdateRoleDto {
  name?: string | null;
  relatedTo?: number | null;
}

// ==================== User Types ====================
export interface User {
  id: number;
  username?: string | null;
  isActive?: boolean;
  roles?: string[] | null;
}

export interface UpdateUserDto {
  username?: string | null;
  isActive: boolean;
  roleIds?: number[] | null;
}

// ==================== Common Response Types ====================
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  success?: boolean;
  errors?: string[];
}

export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

// ==================== Worker/Applicant Types ====================
export interface WorkerActionDto {
  id: string;
  date: string;
}

export interface WorkerDto {
  referenceNo?: string | null;
  fullNameAr?: string | null;
  fullNameEn?: string | null;
  workerStatus?: string | null;
  religion?: string | null;
  jobId?: string | null;
  gender?: string | null;
  nationalityId?: string | null;
  basicSalary?: number | null;
  agentId?: string | null;
  responsibleUserId?: string | null;
  boxNumber?: string | null;
  borderNumber?: string | null;
  birthDate?: string | null;
  age?: number | null;
  addressAr?: string | null;
  addressEn?: string | null;
  maritalStatus?: string | null;
  childrenCount?: number | null;
  weight?: number | null;
  height?: number | null;
  educationLevelAr?: string | null;
  educationLevelEn?: string | null;
  mobile?: string | null;
  phone?: string | null;
  nationalId?: string | null;
  passportNo?: string | null;
  passportIssueDate?: string | null;
  passportExpiryDate?: string | null;
  passportIssuePlaceAr?: string | null;
  passportIssuePlaceEn?: string | null;
  hasExperience?: boolean;
  skills?: string[] | null;
}

export interface Worker extends WorkerDto {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}
