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
} as const;
