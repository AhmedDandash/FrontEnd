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
} as const;
