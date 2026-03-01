/**
 * API Configuration
 * Centralized configuration for API endpoints and settings
 */

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
  TIMEOUT: Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/api/Auth/login',
    REGISTER: '/api/Auth/register',
    LOGOUT: '/api/Auth/logout',
    REFRESH: '/api/Auth/refresh',
  },

  // Branch
  BRANCH: {
    GET_ALL: '/api/Branch/GetAllBranch',
    GET_BY_ID: (id: number) => `/api/Branch/GetBranchById/${id}`,
    CREATE: '/api/Branch/CreateBranch',
    UPDATE: (id: number) => `/api/Branch/UpdateBranch/${id}`,
    DELETE: (id: number) => `/api/Branch/DeleteBranch/${id}`,
  },

  // Customers
  CUSTOMERS: {
    GET_ALL: '/api/Customers/GetAllCustomer',
    GET_BY_ID: (id: number) => `/api/Customers/GetCustomerById/${id}`,
    CREATE: '/api/Customers/CreateCustomer',
    UPDATE: (id: number) => `/api/Customers/UpdateCustomer/${id}`,
    DELETE: (id: number) => `/api/Customers/DeleteCustomer/${id}`,
    // GET_ALL_PHONES: '/api/Customers/GetAllCustomerPhone',
    CREATE_PHONE: '/api/Customers/CreateCustomerPhone',
  },

  // Document
  DOCUMENT: {
    GET_ALL: '/api/Document/GetAllDocument',
    GET_BY_ID: (id: number) => `/api/Document/GetDocumentById/${id}`,
    CREATE: '/api/Document/CreateDocument',
    UPDATE: (id: number) => `/api/Document/UpdateDocument/${id}`,
    DELETE: (id: number) => `/api/Document/DeleteDocument/${id}`,
  },

  // Roles
  ROLES: {
    GET_ALL: '/api/Roles/GetAllRoles',
    GET_BY_ID: (id: number) => `/api/Roles/GetRoleById/${id}`,
    CREATE: '/api/Roles/Create',
    UPDATE: (id: number) => `/api/Roles/Update/${id}`,
    DELETE: (id: number) => `/api/Roles/Delete/${id}`,
  },

  // Users
  USERS: {
    GET_BY_ID: (id: number) => `/api/Users/GetUserById/${id}`,
    GET_ALL: '/api/Users/GetAllUsers',
    CREATE: '/api/Auth/register',
    UPDATE: (id: number) => `/api/Users/UpdateUserById/${id}`,
    DELETE: (id: number) => `/api/Users/DeleteUserById/${id}`,
  },

  // Agent
  AGENT: {
    GET_ALL: '/api/Agent',
    GET_BY_ID: (id: number) => `/api/Agent/${id}`,
    CREATE: '/api/Agent',
    UPDATE: (id: number) => `/api/Agent/${id}`,
    DELETE: (id: number) => `/api/Agent/${id}`,
  },

  // General Options - Jobs
  JOB: {
    GET_ALL: '/api/GeneralOptions/Job',
    GET_BY_ID: (id: number) => `/api/GeneralOptions/Job/${id}`,
    CREATE: '/api/GeneralOptions/Job',
    UPDATE: (id: number) => `/api/GeneralOptions/Job/${id}`,
    DELETE: (id: number) => `/api/GeneralOptions/Job/${id}`,
  },

  // Workers
  WORKERS: {
    GET_ALL: '/api/Worker',
    GET_BY_ID: (id: number) => `/api/Worker/${id}`,
  },

  // Recruitment Request
  RECRUITMENT_REQUEST: {
    GET_ALL: '/api/RecruitmentRequest',
    CREATE: '/api/RecruitmentRequest',
    CHOICE_CUSTOMER: '/api/RecruitmentRequest/ChoiceCusomer',
    CHOICE_WORKER: '/api/RecruitmentRequest/ChoiceWorker',
    DELETE_WORKER: (requestId: number) => `/api/RecruitmentRequest/DeleteWorker/${requestId}`,
    REVIEW_REQUEST: '/api/RecruitmentRequest/ReviewRequest',
    REFUSED_REQUEST: '/api/RecruitmentRequest/RefusedRequest',
    ACCEPT_REQUEST: '/api/RecruitmentRequest/AcceptRequest',
  },

  // Employment Contract Offers
  EMPLOYMENT_CONTRACT_OFFERS: {
    SUMMARY: '/api/EmploymentContractOffers/summary',
    GET_ALL: '/api/EmploymentContractOffers',
    CREATE: '/api/EmploymentContractOffers',
    GET_BY_ID: (id: number) => `/api/EmploymentContractOffers/${id}`,
    UPDATE: (id: number) => `/api/EmploymentContractOffers/${id}`,
    DELETE: (id: number) => `/api/EmploymentContractOffers/${id}`,
  },

  // Employment Operating Contract
  EMPLOYMENT_OPERATING_CONTRACT: {
    GET_ALL: '/api/EmploymentOperatingContract',
    CREATE: '/api/EmploymentOperatingContract',
    GET_BY_ID: (id: number) => `/api/EmploymentOperatingContract/${id}`,
    UPDATE: (id: number) => `/api/EmploymentOperatingContract/${id}`,
    DELETE: (id: number) => `/api/EmploymentOperatingContract/${id}`,
    END_CONTRACT: '/api/EmploymentOperatingContract/EndContract',
  },

  // Complaint
  COMPLAINT: {
    GET_ALL: '/api/Complaint',
    GET_BY_ID: (id: number) => `/api/Complaint/${id}`,
    CREATE: '/api/Complaint',
    UPDATE: (id: number) => `/api/Complaint/${id}`,
    DELETE: (id: number) => `/api/Complaint/${id}`,
    FINISH: '/api/Complaint/FinishComplaint',
    HOLD: (id: number) => `/api/Complaint/HoldComplaint/${id}`,
    ADD_ISSUE: '/api/Complaint/AddIssue',
    GET_ISSUE: (id: number) => `/api/Complaint/GetIssueById/${id}`,
  },

  // Nationality (General Options)
  NATIONALITY: {
    GET_ALL: '/api/Nationality/GetAllNationality',
    GET_BY_ID: (id: number) => `/api/Nationality/GetByIdNationality/${id}`,
    CREATE: '/api/Nationality/CreateNationality',
    UPDATE: (id: number) => `/api/Nationality/UpdateNationality/${id}`,
    DELETE: (id: number) => `/api/Nationality/DeleteNationality/${id}`,
  },

  // Mediation Contract Offer
  MEDIATION_CONTRACT_OFFER: {
    GET_SUMMARY: '/api/MediationContractOffer/GetSummeryOffer',
    GET_ALL: '/api/MediationContractOffer/GetAllOffer',
    GET_BY_ID: (id: number) => `/api/MediationContractOffer/GetOfferById/${id}`,
    CREATE: '/api/MediationContractOffer/CreateOffer',
    UPDATE: (id: number) => `/api/MediationContractOffer/UpdateOffer/${id}`,
    DELETE: (id: number) => `/api/MediationContractOffer/DeleteOffer/${id}`,
  },

  // Mediation Contract
  MEDIATION_CONTRACT: {
    GET_ALL: '/api/MediationContract',
    CREATE: '/api/MediationContract',
    GET_BY_ID: (id: number) => `/api/MediationContract/${id}`,
    UPDATE: (id: number) => `/api/MediationContract/${id}`,
    DELETE: (id: number) => `/api/MediationContract/${id}`,
    ADD_NOTE: '/api/MediationContract/AddNote',
    ALL_NOTES: '/api/MediationContract/AllNotes',
    ADD_DOMESTIC_WORKER: '/api/MediationContract/Addingdomesticworker',
    CONTRACT_TYPE_CHANGE: '/api/MediationContract/ContractTypeChange',
    CONTRACT_CANCEL: '/api/MediationContract/ContractCancel',
    GET_INVOICE_BY_ID: (id: number) => `/api/MediationContract/GetInvoiceById/${id}`,
    CREATE_INVOICE: '/api/MediationContract/CreateInvoice',
  },

  // Contract Creation Requirements
  CONTRACT_CREATION_REQUIREMENTS: {
    GET_ALL: '/api/ContractCreationRequirements',
    CREATE: '/api/ContractCreationRequirements',
    GET_BY_ID: (id: number) => `/api/ContractCreationRequirements/${id}`,
    UPDATE: (id: number) => `/api/ContractCreationRequirements/${id}`,
    DELETE: (id: number) => `/api/ContractCreationRequirements/${id}`,
    GET_REQUIREMENT: '/api/ContractCreationRequirements/GetRequirement',
  },

  // Mediation Follow-Up Statuses
  MEDIATION_FOLLOWUP_STATUSES: {
    GET_ALL_PARENTS: '/api/MediationFollowUpStatuses/GetAllFollowUpStatuses',
    CREATE_PARENT: '/api/MediationFollowUpStatuses/CreateFollowUpStatuses',
    GET_SUB_STATUSES: (parentId: number) =>
      `/api/MediationFollowUpStatuses/GetAllSubFollowUpStatus/${parentId}`,
    CREATE_SUB: '/api/MediationFollowUpStatuses/CreateSubFollowUpStatus',
    UPDATE_SUB: (id: number) => `/api/MediationFollowUpStatuses/UpdateSubFollowUpStatus/${id}`,
    TOGGLE_ACTIVE: '/api/MediationFollowUpStatuses/SubFollowUpStatusIsActive',
    TOGGLE_FINISH: '/api/MediationFollowUpStatuses/SubFollowUpStatusIsActionFinish',
    UPDATE_CASE_ORDER: '/api/MediationFollowUpStatuses/SubFollowUpStatusCaseOrder',
  },

  // Mediation Contract Follow-Up
  MEDIATION_CONTRACT_FOLLOWUP: {
    GET_BY_CONTRACT: '/api/MediationContractFollowUp/GetByContract',
    CREATE: '/api/MediationContractFollowUp/Create',
  },

  // Mediation Contract Messages
  MEDIATION_CONTRACT_MESSAGES: {
    GET_BY_CONTRACT: (contractId: number) =>
      `/api/MediationContractMessages/ByContract/${contractId}`,
    CREATE: '/api/MediationContractMessages',
    DELETE: (id: number) => `/api/MediationContractMessages/${id}`,
  },

  // Nationality Follow-Up Status
  NATIONALITY_FOLLOWUP: {
    GET_ALL: '/api/Nationality/GetAllNationalityFollowUpStatus',
    CREATE: '/api/Nationality/CreateNationalityFollowUpStatus',
    UPDATE: (id: number) => `/api/Nationality/UpdateNationalityFollowUpStatus/${id}`,
    TOGGLE_ACTIVE: (id: number) => `/api/Nationality/NationalityFollowUpStatusIsActive/${id}`,
    DELETE: (id: number) => `/api/Nationality/DeleteNationalityFollowUpStatus/${id}`,
  },
} as const;
