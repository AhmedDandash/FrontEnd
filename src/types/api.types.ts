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
  id: number;
  date: string;
}

export interface MedicalExaminationDto {
  workerId: number;
  examDate: string;
  medicalStatus: number;
  notes?: string;
}

export interface MedicalExamination extends MedicalExaminationDto {
  id: number;
  createdAt: string;
}

export interface WorkerDto {
  referenceNo?: string | null;
  fullNameAr?: string | null;
  fullNameEn?: string | null;
  workerSatus?: number | null;
  religion?: number | null;
  jobId?: number | null;
  gender?: number | null; // 0 = Male, 1 = Female
  nationalityId?: number | null;
  basicSalary?: number | null;
  agentId?: number | null;
  responsibleUserId?: number | null;
  boxNumber?: string | null;
  borderNumber?: string | null;
  birthDate?: string | null;
  age?: number | null;
  addressAr?: string | null;
  addressEn?: string | null;
  maritalStatus?: number | null; // 0 = Single, 1 = Married
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
  workerType?: number | null;
  uploadimage?: string | null;
}

export interface Worker extends WorkerDto {
  id: number;
  // Read-only fields from GET response
  agentName?: string | null;
  userName?: string | null;
  jobname?: string | null;
  isActive?: boolean;
  workerEscape?: boolean;
  workerRefusedWork?: boolean;
  workerOut?: boolean;
  workerSick?: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
}

// ==================== Agent Types ====================
export interface Agent {
  id: number;
  agentNameAr?: string | null;
  agentNameEn?: string | null;
  username?: string | null;
  nationalityId?: number | null;
  nationalityNameAr?: string | null;
  nationalityNameEn?: string | null;
  agentLicense?: string | null;
  contractType?: number | null;
  phone?: string | null;
  mobile?: string | null;
  email?: string | null;
  addressAr?: string | null;
  addressEn?: string | null;
  companyNameAr?: string | null;
  companyNameEn?: string | null;
  followUpEmails?: string | null;
  warrantyEmails?: string | null;
  accountingEmails?: string | null;
  sendAllEmails?: boolean;
  isActive?: boolean;
  contractsCount?: number;
  filesCount?: number;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface CreateAgentDto {
  agentNameAr?: string | null;
  agentNameEn?: string | null;
  username?: string | null;
  nationalityId?: number | null;
  agentLicense?: string | null;
  contractType?: number | null;
  phone?: string | null;
  mobile?: string | null;
  email?: string | null;
  addressAr?: string | null;
  addressEn?: string | null;
  companyNameAr?: string | null;
  companyNameEn?: string | null;
  followUpEmails?: string | null;
  warrantyEmails?: string | null;
  accountingEmails?: string | null;
  sendAllEmails?: boolean;
  isActive?: boolean;
}

export interface UpdateAgentDto {
  agentNameAr?: string | null;
  agentNameEn?: string | null;
  username?: string | null;
  nationalityId?: number | null;
  agentLicense?: string | null;
  contractType?: number | null;
  phone?: string | null;
  mobile?: string | null;
  email?: string | null;
  addressAr?: string | null;
  addressEn?: string | null;
  companyNameAr?: string | null;
  companyNameEn?: string | null;
  followUpEmails?: string | null;
  warrantyEmails?: string | null;
  accountingEmails?: string | null;
  sendAllEmails?: boolean;
  isActive?: boolean;
}

// ==================== Job Types ====================
export interface Job {
  id: number;
  jobNameAr?: string | null;
  jobNameEn?: string | null;
  hasWorkCard?: boolean;
  workCardFees?: number | null;
  isActive?: boolean;
}

export interface CreateJobDto {
  jobNameAr?: string | null;
  jobNameEn?: string | null;
  hasWorkCard?: boolean;
  workCardFees?: number | null;
  isActive?: boolean;
}

export interface UpdateJobDto {
  jobNameAr?: string | null;
  jobNameEn?: string | null;
  hasWorkCard?: boolean;
  workCardFees?: number | null;
  isActive?: boolean;
}

// ==================== Nationality Types ====================
export interface Nationality {
  id: number;
  nationalityNameAr?: string | null;
  nationalityNameEn?: string | null;
  isActive?: boolean;
}

// ==================== Recruitment Request Types ====================
export interface RecruitmentRequest {
  id: number;
  requestCode?: string | null;
  customerName?: string | null;
  customerPhone?: string | null;
  customerEmail?: string | null;
  workerAge?: number | null;
  customerId?: number | null;
  workerName?: string | null;
  workerReligion?: number | null; // 1 = Muslim, 2 = Non-Muslim
  nationalityId?: number | null;
  jobName?: string | null;
  jobId?: number | null;
  requestType?: number | null; // 0 = Pending, 1 = Review, 2 = Accepted, etc.
  requestStats?: number | null;
  specialSpecifications?: string | null;
  createdAt?: string | null;
  workerId?: number | null;
}

export interface CreateRecruitmentRequestDto {
  requestCode?: string | null;
  customerName?: string | null;
  customerPhone?: string | null;
  customerEmail?: string | null;
  customerNationalId?: string | null;
  workerAge?: number | null;
  workerReligion?: number | null;
  workerNationalityId?: number | null;
  jobId?: number | null;
  specialSpecifications?: string | null;
}

export interface ChoiceCustomerDto {
  customerId: number;
  requestId: number;
}

export interface ChoiceWorkerDto {
  workerId: number;
  requestId: number;
}

export interface RequestActionDto {
  // `type` historically used; some endpoints use `requestStats` now.
  // Keep both to accept either shape from callers.
  type?: number;
  requestStats?: number;
  requestId: number;
}

// ==================== Employment Contract Offer Types ====================
export interface EmploymentContractOffer {
  id: number;
  offerType?: number | null;
  offerContractType?: number | null;
  offerTitle?: string | null;
  numberOfDays?: number | null;
  nationalityId?: number | null;
  nationalityName?: string | null;
  jobId?: number | null;
  jobName?: string | null;
  duration?: number | null;
  dateFrom?: string | null;
  dateTo?: string | null;
  showForExternalCustomers?: boolean;
  showForReception?: boolean;
  isActive?: boolean;
  cost?: number | null;
  costTax?: number | null;
  promissoryNoteAmount?: number | null;
  insurance?: number | null;
  previousExperience?: number | null;
  dailyPriceWithoutTax?: number | null;
  workerSalary?: number | null;
  totalCostWithTax?: number | null;
  branchId?: number | null;
  branchName?: string | null;
  offersCount?: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface CreateEmploymentContractOfferDto {
  offerType?: number | null;
  offerContractType?: number | null;
  offerTitle?: string | null;
  numberOfDays?: number | null;
  nationalityId?: number | null;
  jobId?: number | null;
  duration?: number | null;
  dateFrom?: string | null;
  dateTo?: string | null;
  showForExternalCustomers?: boolean;
  showForReception?: boolean;
  isActive?: boolean;
  cost?: number | null;
  costTax?: number | null;
  promissoryNoteAmount?: number | null;
  insurance?: number | null;
  previousExperience?: number | null;
  dailyPriceWithoutTax?: number | null;
  workerSalary?: number | null;
  totalCostWithTax?: number | null;
  branchId?: number | null;
  // Additional fields for special offers and packages
  isOffer?: boolean;
  isPremium?: boolean;
  offersCount?: number | null;
}

export interface UpdateEmploymentContractOfferDto {
  offerType?: number | null;
  offerContractType?: number | null;
  offerTitle?: string | null;
  numberOfDays?: number | null;
  nationalityId?: number | null;
  jobId?: number | null;
  duration?: number | null;
  dateFrom?: string | null;
  dateTo?: string | null;
  showForExternalCustomers?: boolean;
  showForReception?: boolean;
  isActive?: boolean;
  cost?: number | null;
  costTax?: number | null;
  promissoryNoteAmount?: number | null;
  insurance?: number | null;
  previousExperience?: number | null;
  dailyPriceWithoutTax?: number | null;
  workerSalary?: number | null;
  totalCostWithTax?: number | null;
  branchId?: number | null;
}

export interface EmploymentContractOfferSummary {
  nationalityId?: number | null;
  nationalityName?: string | null;
  jobId?: number | null;
  jobName?: string | null;
  branchId?: number | null;
  branchName?: string | null;
  availableOffersCount?: number | null;
  offersCount?: number | null; // Legacy field
}

// ==================== Employment Operating Contract Types ====================
export interface EmploymentOperatingContract {
  id: number;
  createdBy?: number | null;
  createdAt?: string | null;
  customerId?: number | null;
  customerNameAr?: string | null;
  mobile?: string | null;
  customerIdentiy?: string | null;
  offerContractType?: number | null;
  offerType?: number | null;
  nationalityId?: number | null;
  jobId?: number | null;
  jobName?: string | null;
  duration?: number | null;
  contractStartDate?: string | null;
  contractEndDate?: string | null;
  customerAddress?: string | null;
  cost?: number | null;
  costTax?: number | null;
  totalCostWithTax?: number | null;
  isFinish?: boolean | null;
  finishBy?: number | null;
  finishDate?: string | null;
  noteFinish?: string | null;
}

export interface CreateEmploymentOperatingContractDto {
  customerId?: number | null;
  marketerId?: number | null;
  contractCategory?: number | null;
  offerId?: number | null;
  operationType?: number | null;
  paymentMethod?: number | null;
  nationalityId?: number | null;
  jobId?: number | null;
  duration?: number | null;
  contractStartDate?: string | null;
  contractEndDate?: string | null;
  previousExperience?: number | null;
  offerPrice?: number | null;
  laborManagement?: number | null;
  workerNameEn?: string | null;
  workerNameAr?: string | null;
  workerPhone?: string | null;
  workersCount?: number | null;
  cost?: number | null;
  insurance?: number | null;
  customerAddress?: string | null;
}

export interface UpdateEmploymentOperatingContractDto {
  customerId?: number | null;
  marketerId?: number | null;
  contractCategory?: number | null;
  offerId?: number | null;
  operationType?: number | null;
  paymentMethod?: number | null;
  nationalityId?: number | null;
  jobId?: number | null;
  duration?: number | null;
  contractStartDate?: string | null;
  contractEndDate?: string | null;
  previousExperience?: number | null;
  offerPrice?: number | null;
  laborManagement?: number | null;
  workerNameEn?: string | null;
  workerNameAr?: string | null;
  workerPhone?: string | null;
  workersCount?: number | null;
  cost?: number | null;
  insurance?: number | null;
  customerAddress?: string | null;
}

export interface EndContractDto {
  contractId: number;
  endDate?: string | null;
  reason?: string | null;
}
