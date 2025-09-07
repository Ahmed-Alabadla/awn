# Authentication Implementation with Cookies and React Query

## Overview

This implementation provides a complete authentication system using cookies for token storage and React Query for state management.

## Features Implemented

### 1. Token Storage with Cookies

- **cookies-next** library for secure cookie management
- Access tokens stored with 15-minute expiration
- Refresh tokens stored with 7-day expiration
- Secure cookies in production (HTTPS only)
- SameSite strict policy for CSRF protection

### 2. React Query Integration

- **@tanstack/react-query** for data fetching and caching
- Authentication state management
- User data caching with 10-minute stale time
- Automatic query invalidation on login/logout

### 3. Automatic Token Management

- Axios request interceptor adds access tokens automatically
- Axios response interceptor handles token refresh
- Automatic redirect to login on authentication failure
- Seamless token refresh without user interruption

### 4. Custom Hooks and Services

#### `useAuth` Hook

```typescript
const {
  isAuthenticated,
  isLoading,
  user,
  login,
  logout,
  getTokens,
  isLoginPending,
  isLogoutPending,
} = useAuth();
```

#### `authService` Methods

- `login(credentials)` - Authenticate user and store tokens
- `logout()` - Clear tokens from cookies
- `getCurrentUser()` - Fetch current user data
- `getTokens()` - Retrieve tokens from cookies
- `isAuthenticated()` - Check authentication status

### 5. Protected Routes

- `RouteGuard` component for protecting routes with flexible authentication requirements
- Automatic redirect to login for unauthenticated users
- Loading states during authentication checks

### 6. Enhanced Components

- **LoginForm**: Integrated with useAuth hook
- **UserMenu**: Real user data display with logout functionality
- Loading states and error handling

## Usage Examples

### Protecting a Route

```tsx
import RouteGuard from "@/components/RouteGuard";

export default function ProtectedPage() {
  return (
    <RouteGuard requireAuth={true} redirectTo="/login">
      <YourProtectedContent />
    </RouteGuard>
  );
}
```

### Using Authentication in Components

```tsx
function MyComponent() {
  const { isAuthenticated, user, logout } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div>
      <h1>Welcome {user?.name}!</h1>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}
```

### Manual API Calls

```typescript
// Tokens are automatically added to all API requests
const response = await api.get("/protected-endpoint");
```

## Security Features

- **HTTPS Only** cookies in production
- **HttpOnly** option available for enhanced security
- **SameSite** strict policy
- **Automatic token refresh** on expiration
- **Secure cookie deletion** on logout

## Configuration

### Environment Variables

```env
NEXT_PUBLIC_API_URL=https://your-api-url.com
NODE_ENV=production # for secure cookies
```

### Cookie Configuration

Tokens are stored with the following security settings:

- `secure: true` in production
- `sameSite: 'strict'`
- `httpOnly: false` (allows client-side access for API calls)

## Files Modified/Created

1. **services/auth.service.ts** - Authentication service methods
2. **hooks/useAuth.ts** - React Query authentication hook
3. **lib/axios.ts** - HTTP client with token interceptors
4. **lib/types.ts** - TypeScript interfaces
5. **components/RouteGuard.tsx** - Flexible route protection component
6. **components/shared/LoginForm.tsx** - Enhanced login form
7. **components/shared/UserMenu.tsx** - User menu with logout
8. **lib/route-protection.ts** - Route configuration utilities
9. **middleware.ts** - Server-side route protection

## Benefits

- **Persistent Authentication** across browser sessions
- **Automatic Token Management** - no manual token handling
- **Optimized API Calls** with React Query caching
- **Type Safety** with TypeScript interfaces
- **Security Best Practices** implemented
- **User Experience** - seamless authentication flow

## Next Steps

1. Add refresh token rotation for enhanced security
2. Implement role-based access control
3. Add password reset functionality
4. Implement remember me functionality
5. Add multi-factor authentication support

## Route Protection System

### Overview

The route protection system provides multiple layers of security:

1. **Middleware-level protection** - Server-side route protection using Next.js middleware
2. **Component-level protection** - Client-side route guards using React components
3. **Authentication hooks** - Centralized authentication state management

### RouteGuard Component

The flexible route protection component that handles both protected and guest-only routes:

```tsx
import RouteGuard from "@/components/RouteGuard";

// For protected routes (requires authentication)
<RouteGuard requireAuth={true} redirectTo="/login">
  <YourProtectedComponent />
</RouteGuard>

// For guest-only routes (redirects authenticated users)
<RouteGuard requireAuth={false} redirectTo="/">
  <YourGuestOnlyComponent />
</RouteGuard>
```

### Route Configuration

Configure routes in `lib/route-protection.ts`:

```typescript
// Routes that require authentication
export const PROTECTED_ROUTES = [
  "/profile",
  "/announcements/[id]",
  "/organizations/[id]",
] as const;

// Routes that should only be accessible to non-authenticated users
export const GUEST_ONLY_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
] as const;
```

### Middleware Protection

The middleware provides server-side protection with automatic redirects and URL preservation for post-login navigation.

### Current Implementation

**Protected Routes (Require Authentication):**

- `/profile` - User profile page
- `/announcements/[id]` - Individual announcement details
- `/organizations/[id]` - Individual organization details

**Guest-Only Routes (Redirect authenticated users):**

- `/login`, `/register`, `/forgot-password`, `/reset-password`
