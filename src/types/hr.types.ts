/**
 * HR Module - TypeScript Type Definitions
 * Aligned with backend API contract.
 * All IDs use number. Dates are ISO-8601 strings.
 */

// ─────────────────────────────────────────────
// Shared / Lookup
// ─────────────────────────────────────────────

export interface HREmployee {
  id: string; // GUID
  employeeNumber: string;
  nameAr: string;
  nameEn: string;
  jobName: string;
  departmentId: number;
  departmentName: string;
  nationalityName: string;
  idNumber: string;
  mobileNumber?: string;
  hiringDate?: string;
  basicSalary?: number;
  housingAllowance?: number;
  mobilityAllowance?: number;
  otherAllowances?: number;
  totalSalary?: number;
}

export interface HRLookupItem {
  id: number;
  nameAr: string;
  nameEn: string;
}

// ─────────────────────────────────────────────
// Request – Base
// ─────────────────────────────────────────────

export interface HRRequestBase {
  id: number;
  createdTo: string; // employee GUID
  employeeName: string;
  employeeNumber: string;
  departmentName: string;
  jobName: string;
  screenId: string;
  result: HRRequestResult;
  processState: HRProcessState;
  reasons?: string;
  assigneeEmp?: string;
  assignNote?: string;
  rejectedReason?: string;
  createdAt: string;
  updatedAt?: string;
}

// ─────────────────────────────────────────────
// 1. Vacation Request
// ─────────────────────────────────────────────

export interface VacationRequest extends HRRequestBase {
  vacationType: number;
  vacationDays: number;
  vacationDate: string;
  finalizeDate: string;
  comeBackDate: string;
  substituteId?: string;
  substituteJobName?: string;
  mobileNumber?: string;
  minRange?: number;
  maxRange?: number;
  exhausted?: number;
  available?: number;
  attachmentUrl?: string;
}

export interface CreateVacationRequestDto {
  createdTo: string;
  vacationType: number;
  vacationDays: number;
  vacationDate: string;
  finalizeDate: string;
  substituteId?: string;
  mobileNumber?: string;
  reasons: string;
  attachmentFile?: File;
}

// ─────────────────────────────────────────────
// 2. Permission Request
// ─────────────────────────────────────────────

export interface PermissionRequest extends HRRequestBase {
  permissionDate: string;
  permissionType: HRPermissionType;
  permissionNature: number;
  comeLateTime?: string; // "HH:mm"
  partTimeStart?: string;
  partTimeFinish?: string;
  outEarlyTime?: string;
}

export interface CreatePermissionRequestDto {
  createdTo: string;
  permissionDate: string;
  permissionType: HRPermissionType;
  permissionNature: number;
  comeLateTime?: string;
  partTimeStart?: string;
  partTimeFinish?: string;
  outEarlyTime?: string;
  reasons: string;
}

// ─────────────────────────────────────────────
// 3. Custody Request
// ─────────────────────────────────────────────

export interface CustodyItem {
  custodyId: number;
  custodyName?: string;
  quantity: number;
  deliveryDate: string;
  temporal: boolean;
  shortNote?: string;
}

export interface CustodyRequest extends HRRequestBase {
  details?: string;
  custodyItems: CustodyItem[];
}

export interface CreateCustodyRequestDto {
  createdTo: string;
  details?: string;
  reasons?: string;
  custodyItems: Omit<CustodyItem, 'custodyName'>[];
}

// ─────────────────────────────────────────────
// 4. Job Modification Request
// ─────────────────────────────────────────────

export interface JobModificationRequest extends HRRequestBase {
  oldDepartmentName: string;
  oldSalaryScaleName: string;
  oldTotalSalary: number;
  newDepartmentId: number;
  newDepartmentName: string;
  newSalaryScaleId: number;
  newSalaryScaleName: string;
  newTotalSalary: number;
}

export interface CreateJobModificationRequestDto {
  createdTo: string;
  newDepartmentId: number;
  newSalaryScaleId: number;
  newTotalSalary: number;
  reasons: string;
}

// ─────────────────────────────────────────────
// 5. Resignation Request
// ─────────────────────────────────────────────

export interface ResignationRequest extends HRRequestBase {
  resignationDate: string;
  endDate: string;
}

export interface CreateResignationRequestDto {
  createdTo: string;
  resignationDate: string;
  endDate: string;
  reasons: string;
}

// ─────────────────────────────────────────────
// 6. Entitlements Request
// ─────────────────────────────────────────────

export interface EntitlementsRequest extends HRRequestBase {
  entitlementType: number;
  notes?: string;
}

export interface CreateEntitlementsRequestDto {
  createdTo: string;
  entitlementType: number;
  notes?: string;
  reasons: string;
}

// ─────────────────────────────────────────────
// 7. Loans Request
// ─────────────────────────────────────────────

export interface LoanRequest extends HRRequestBase {
  loanAmount: number;
  basicSalary: number;
  housingAllowance: number;
  mobilityAllowance: number;
  otherAllowances: number;
  totalSalary: number;
  hiringDate: string;
}

export interface CreateLoanRequestDto {
  createdTo: string;
  loanAmount: number;
  reasons?: string;
}

// ─────────────────────────────────────────────
// Follow-up – Inbox / Outbox
// ─────────────────────────────────────────────

export interface HRRequestSummary {
  id: number;
  screenId: string;
  processState: HRProcessState;
  processGroup: number;
  result: HRRequestResult;
  employeeName: string;
  employeeNumber: string;
  departmentName: string;
  createdAt: string;
  updatedAt?: string;
  assigneeEmpName?: string;
}

export interface HRRequestsFilterDto {
  processState?: HRProcessState;
  processGroups?: number[];
  processResults?: HRRequestResult[];
  startsDate?: string;
  endingDate?: string;
}

// ─────────────────────────────────────────────
// Employees
// ─────────────────────────────────────────────

export interface Employee {
  id: string;
  employeeNumber: string;
  nameAr: string;
  nameEn: string;
  email?: string;
  loginName?: string;
  jobId: number;
  jobName: string;
  departmentId: number;
  departmentName: string;
  nationalityId: number;
  nationalityName: string;
  idNumber: string;
  mobileNumber?: string;
  hiringDate?: string;
  isActive: boolean;
}

export interface EmployeesFilterDto {
  nameAr?: string;
  loginName?: string;
  email?: string;
}

// ─────────────────────────────────────────────
// Employee Commission
// ─────────────────────────────────────────────

export interface EmployeeCommission {
  id: number;
  empId: string;
  employeeName: string;
  comDate: string;
  comDateTo: string;
  typeId: number;
  typeName: string;
  amount: number;
  isTaxable: boolean;
  bankFees: number;
  bankFeesTax: number;
  taxValue: number;
  accountId: number;
}

export interface CommissionFilterDto {
  empId?: string;
  comDate?: string;
  comDateTo?: string;
}

// ─────────────────────────────────────────────
// Commission Slices
// ─────────────────────────────────────────────

export interface CommissionSlice {
  id: number;
  commissionName: string;
  commissionTypeId: number;
  commissionTypeName: string;
  commissionId: number;
  amount: number;
  isPercent: boolean;
  includeTax: boolean;
  withDetails: boolean;
}

export interface CreateCommissionSliceDto {
  commissionName: string;
  commissionTypeId: number;
  commissionId: number;
  amount: number;
  isPercent: boolean;
  includeTax: boolean;
  withDetails: boolean;
}

// ─────────────────────────────────────────────
// Attendance / Check In-Out
// ─────────────────────────────────────────────

export interface AttendanceRecord {
  id: number;
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  attendanceDay: string; // ISO date
  checkInTime?: string; // "HH:mm"
  checkOutTime?: string;
  status: AttendanceStatus;
  screenId?: string;
}

export interface AttendanceFilterDto {
  employeeId?: string;
  attendanceDay?: string;
  month?: number;
  year?: number;
}

// ─────────────────────────────────────────────
// Leave Balance
// ─────────────────────────────────────────────

export interface LeaveBalance {
  employeeId: string;
  employeeName: string;
  year: number;
  annualBalance: number;
  usedBalance: number;
  remainingBalance: number;
  sickBalance: number;
  usedSickBalance: number;
  remainingSickBalance: number;
}

export interface LeaveBalanceFilterDto {
  employeeId?: string;
  year?: number;
}

// ─────────────────────────────────────────────
// HR Complaints
// ─────────────────────────────────────────────

export interface HRComplaint {
  id: number;
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  complaintId: number;
  complaintNotes: string;
  replyNotes?: string;
  sendTheComplaintTo: string;
  sendReplyTo?: string;
  status: HRComplaintStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateHRComplaintDto {
  employeeId: string;
  complaintNotes: string;
  sendTheComplaintTo: string;
}

export interface ReplyHRComplaintDto {
  id: number;
  replyNotes: string;
  sendReplyTo?: string;
}

// ─────────────────────────────────────────────
// Enums (numeric mirrors of hr.enums.ts constants)
// ─────────────────────────────────────────────

export type HRRequestResult = 0 | 1 | 2 | 3;
// 0 = Unspecified, 1 = Approved, 2 = Rejected, 3 = Pending

export type HRProcessState = 1 | 2 | 4 | 5 | 6 | 7 | 8 | 9;
// 1=Vacation, 2=Permission, 4=Custody, 5=JobModification, 6=Resignation, 7=Entitlements, 8=Loans, 9=Other

export type HRPermissionType = 1 | 2 | 3;
// 1=ComeLate, 2=PartTime, 3=OutEarly

export type AttendanceStatus = 0 | 1 | 2 | 3;
// 0=Unknown, 1=Present, 2=Absent, 3=Late

export type HRComplaintStatus = 1 | 2 | 3;
// 1=Open, 2=Resolved, 3=Closed
