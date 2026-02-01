# API Integration Guide

## 📋 Overview

This project uses a production-ready API integration architecture with minimal future code changes required. The system is built on:

- **Type-safe API client** with Axios
- **Service layer** for clean separation
- **React Query** for data fetching and caching
- **Auto-generated TypeScript types** from Swagger
- **Environment-based configuration**

## 🏗️ Architecture

```
src/
├── config/
│   └── api.config.ts          # API endpoints and configuration
├── lib/
│   ├── api/
│   │   └── client.ts          # Axios client with interceptors
│   └── providers/
│       └── ReactQueryProvider.tsx
├── types/
│   └── api.types.ts           # TypeScript types from Swagger
├── services/
│   ├── auth.service.ts        # Auth operations
│   ├── branch.service.ts      # Branch CRUD
│   ├── customer.service.ts    # Customer CRUD
│   ├── document.service.ts    # Document CRUD
│   ├── role.service.ts        # Role CRUD
│   ├── user.service.ts        # User CRUD
│   └── index.ts
└── hooks/
    ├── useAuth.ts             # Auth hook
    └── api/
        ├── useBranches.ts     # Branch operations
        ├── useCustomers.ts    # Customer operations
        └── index.ts
```

## 🚀 Quick Start

### 1. Environment Setup

Already configured in `.env.local` and `.env.production`:

```env
NEXT_PUBLIC_API_BASE_URL=http://sigma26.runasp.net
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_ENV=development
```

### 2. Wrap Your App with Providers

Update `src/app/layout.tsx`:

```tsx
import { ReactQueryProvider } from '@/lib/providers/ReactQueryProvider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
```

### 3. Use in Components

#### Authentication Example

```tsx
'use client';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const { login, isLoggingIn } = useAuth();

  const handleLogin = () => {
    login({
      username: 'admin',
      password: 'password123',
    });
  };

  return (
    <button onClick={handleLogin} disabled={isLoggingIn}>
      {isLoggingIn ? 'Logging in...' : 'Login'}
    </button>
  );
}
```

#### Data Fetching Example (Branches)

```tsx
'use client';
import { useBranches } from '@/hooks/api';

export default function BranchesPage() {
  const { branches, isLoading, createBranch, deleteBranch } = useBranches();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {branches?.map((branch) => (
        <div key={branch.id}>
          <h3>{branch.nameAr}</h3>
          <button onClick={() => deleteBranch(branch.id)}>Delete</button>
        </div>
      ))}

      <button
        onClick={() =>
          createBranch({
            nameAr: 'فرع جديد',
            nameEn: 'New Branch',
            phone: '0123456789',
          })
        }
      >
        Add Branch
      </button>
    </div>
  );
}
```

#### Customer Operations Example

```tsx
'use client';
import { useCustomers } from '@/hooks/api';

export default function CustomersPage() {
  const { customers, isLoading, createCustomer, updateCustomer, deleteCustomer } = useCustomers();

  const handleCreate = () => {
    createCustomer({
      arabicName: 'محمد أحمد',
      englishName: 'Mohammed Ahmed',
      userId: 1,
      nationality: 1,
      identityType: 1,
      maritalStatus: 1,
      housingType: 1,
      familyMembers: 4,
      childrenCount: 2,
      domesticWorkers: 1,
    });
  };

  return (
    <div>
      {customers?.map((customer) => (
        <div key={customer.id}>
          <h3>{customer.arabicName}</h3>
          <p>{customer.mobile}</p>
        </div>
      ))}
    </div>
  );
}
```

## 🔐 Authentication Flow

The system automatically handles authentication:

1. **Login**: Token is stored in `localStorage`
2. **All Requests**: Token is automatically added to headers
3. **401 Response**: User is redirected to login
4. **Logout**: Token and user data are cleared

```tsx
import { AuthService } from '@/services';

// Check if authenticated
if (AuthService.isAuthenticated()) {
  const user = AuthService.getCurrentUser();
}

// Manual logout
await AuthService.logout();
```

## 📝 Available Services

### AuthService

```tsx
import { AuthService } from '@/services';

await AuthService.login({ username, password });
await AuthService.register({ username, password, roles });
await AuthService.logout();
const token = AuthService.getToken();
const isAuth = AuthService.isAuthenticated();
const user = AuthService.getCurrentUser();
```

### BranchService

```tsx
import { BranchService } from '@/services';

const branches = await BranchService.getAll();
const branch = await BranchService.getById(1);
const newBranch = await BranchService.create(data);
await BranchService.update(1, data);
await BranchService.delete(1);
```

### CustomerService

```tsx
import { CustomerService } from '@/services';

const customers = await CustomerService.getAll();
const customer = await CustomerService.getById(1);
const newCustomer = await CustomerService.create(data);
await CustomerService.update(1, data);
await CustomerService.delete(1);
const phones = await CustomerService.getAllPhones();
await CustomerService.createPhone({ customerName, phoneNumber });
```

### DocumentService, RoleService, UserService

Similar pattern to above services.

## 🎯 Best Practices

### 1. Use Hooks for Components

```tsx
// ✅ Good
const { branches, isLoading } = useBranches();

// ❌ Avoid in components
const branches = await BranchService.getAll();
```

### 2. Use Services for Server-Side

```tsx
// In server components or API routes
import { BranchService } from '@/services';

const branches = await BranchService.getAll();
```

### 3. Handle Loading and Error States

```tsx
const { data, isLoading, error } = useBranches();

if (isLoading) return <Spinner />;
if (error) return <Error message={error.message} />;
return <DataTable data={data} />;
```

### 4. Optimistic Updates

```tsx
const { updateBranch } = useBranches();

// Mutation automatically refetches data
updateBranch({ id: 1, data: { nameAr: 'New Name' } });
```

## 🔄 Adding New Endpoints

When the backend adds new endpoints:

### 1. Update `api.config.ts`

```tsx
export const API_ENDPOINTS = {
  // ... existing
  NEW_ENTITY: {
    GET_ALL: '/api/NewEntity/GetAll',
    GET_BY_ID: (id: number) => `/api/NewEntity/GetById/${id}`,
    CREATE: '/api/NewEntity/Create',
    UPDATE: (id: number) => `/api/NewEntity/Update/${id}`,
    DELETE: (id: number) => `/api/NewEntity/Delete/${id}`,
  },
};
```

### 2. Add Types to `api.types.ts`

```tsx
export interface NewEntity {
  id: number;
  name?: string | null;
  // ... other fields
}

export interface NewEntityDto {
  name?: string | null;
  // ... other fields
}
```

### 3. Create Service

```tsx
// src/services/newEntity.service.ts
import { api } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/config/api.config';
import type { NewEntity, NewEntityDto } from '@/types/api.types';

export class NewEntityService {
  static async getAll(): Promise<NewEntity[]> {
    const response = await api.get<NewEntity[]>(API_ENDPOINTS.NEW_ENTITY.GET_ALL);
    return response.data;
  }

  static async create(data: NewEntityDto): Promise<NewEntity> {
    const response = await api.post<NewEntity>(API_ENDPOINTS.NEW_ENTITY.CREATE, data);
    return response.data;
  }

  // ... other methods
}
```

### 4. Create Hook (Optional)

```tsx
// src/hooks/api/useNewEntity.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NewEntityService } from '@/services';

export function useNewEntity() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['newEntity'],
    queryFn: () => NewEntityService.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => NewEntityService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newEntity'] });
    },
  });

  return {
    data,
    isLoading,
    create: createMutation.mutate,
  };
}
```

## 🛠️ Troubleshooting

### CORS Issues

If you encounter CORS errors, the backend needs to add your domain to allowed origins.

### Token Not Persisting

Check that localStorage is accessible (not in SSR context).

### Type Errors

Re-check the Swagger JSON and update types in `api.types.ts`.

## 📚 Additional Resources

- [React Query Documentation](https://tanstack.com/query/latest)
- [Axios Documentation](https://axios-http.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🎉 Summary

✅ **Minimal Future Changes**: Add endpoint → Update config → Use in components
✅ **Type Safety**: Full TypeScript support
✅ **Auto Authentication**: Token handling is automatic
✅ **Error Handling**: Built-in error interceptors
✅ **Caching**: React Query handles data caching
✅ **Production Ready**: Environment-based configuration
