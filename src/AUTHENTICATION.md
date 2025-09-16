# Authentication Implementation Documentation

## Overview
This implementation provides a complete authentication system for the admin panel with:
- Token-based authentication with automatic refresh
- Role-based access control (RBAC)
- Permission-based authorization
- Integration with backend API endpoints
- URL parameter handling and automatic redirections

## API Integration

### Backend Endpoints Used:
- `POST /auth/login` - User login
- `POST /auth/login-json` - JSON-based login
- `POST /auth/register` - User registration
- `GET /auth/me` - Get current user info
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Server-side logout
- `GET /auth/roles` - Get all roles
- `POST /auth/roles` - Create role
- `GET /auth/roles/{role_id}` - Get specific role
- `PUT /auth/roles/{role_id}` - Update role
- `DELETE /auth/roles/{role_id}` - Delete role
- `GET /auth/user/roles` - Get user's roles
- `POST /auth/user/roles` - Assign role to user
- `DELETE /auth/user/roles/{role_id}` - Remove role from user
- `GET /auth/user/permissions` - Get user's permissions

### Environment Configuration:
Create a `.env` file in your project root:
```env
VITE_API_BASE_URL=https://your-api-domain.com
```

## Features Implemented

### 1. **API Service** (`src/services/authService.js`)
- Complete HTTP client with automatic token handling
- Automatic 401 error handling and token refresh
- All authentication and role management endpoints
- Error handling and logging

### 2. **Enhanced Authentication Utils** (`src/utils/auth.js`)
- Token validation with server
- Automatic token refresh functionality
- User data caching in sessionStorage
- Server-side logout integration

### 3. **Enhanced Authentication Context** (`src/contexts/AuthContext.jsx`)
- Real user data from API
- User roles and permissions fetching
- Automatic token refresh every 45 minutes
- Role-based access control helpers

### 4. **Role-Based Access Control** (`src/components/auth/RoleBasedAccess.jsx`)
- `RequireRole` - Show content based on user roles
- `RequirePermission` - Show content based on permissions
- `RequireRoleAndPermission` - Require both role AND permission
- `RequireRoleOrPermission` - Require role OR permission
- HOCs for component-level protection

### 5. **Enhanced Dashboard** (`src/pages/Dashboard.jsx`)
- Real user information display
- User roles and permissions visualization
- Token information for debugging

## How It Works

### On App Load:
1. `AuthProvider` initializes and calls `initializeAuth()`
2. Checks sessionStorage for existing `accessToken` and user data
3. If no token found, checks URL for `?token=` parameter
4. If URL token exists:
   - Saves token to sessionStorage
   - Removes token from URL using `history.replaceState`
   - Validates token with server via `GET /auth/me`
   - Fetches user roles and permissions
   - Sets user as authenticated
5. If token exists but no user data, validates with server
6. If no token anywhere, user will be redirected to login

### Authentication Flow:
1. **Login**: User logs in via external login page
2. **Redirect**: After login, redirected to admin with `?token=` parameter
3. **Validation**: Token validated with `GET /auth/me` endpoint
4. **Roles/Permissions**: Fetched via `GET /auth/user/roles` and `GET /auth/user/permissions`
5. **Access Control**: Components render based on user's roles and permissions

### Auto Token Refresh:
- Automatic token refresh every 45 minutes using `POST /auth/refresh`
- If refresh fails, user is automatically logged out
- Refresh token stored alongside access token

### Role-Based Access Control:
```jsx
// Show content only to admins
<RequireRole roles="admin">
  <AdminPanel />
</RequireRole>

// Show content to multiple roles
<RequireRole roles={['admin', 'manager']}>
  <ManagementFeatures />
</RequireRole>

// Show content based on permission
<RequirePermission permissions="manage_users">
  <UserManagement />
</RequirePermission>

// Require both role AND permission
<RequireRoleAndPermission roles="admin" permissions="manage_billing">
  <BillingManagement />
</RequireRoleAndPermission>

// Programmatic checks
const { hasRole, hasPermission } = useAuth();
if (hasRole('admin') && hasPermission('view_reports')) {
  // Show admin reports
}
```

### Logout Process:
1. Call `POST /auth/logout` endpoint
2. Clear sessionStorage and localStorage
3. Reset auth context state
4. Redirect to login page

## API Integration Examples

### Making Authenticated API Calls:
```javascript
import apiClient from '../services/authService';

// The client automatically includes the Bearer token
const userData = await apiClient.get('/users');
const newUser = await apiClient.post('/users', userData);
```

### Handling 401 Errors:
The API client automatically handles 401 responses by:
1. Clearing stored tokens
2. Redirecting to login page
3. Preventing further API calls

### Role Management:
```javascript
import { rolesApi } from '../services/authService';

// Get all roles
const roles = await rolesApi.getRoles();

// Create new role
const newRole = await rolesApi.createRole({
  name: 'Editor',
  permissions: ['edit_content', 'view_reports']
});

// Update role
await rolesApi.updateRole(roleId, { name: 'Senior Editor' });
```

## Usage Examples

### Authentication Hook:
```javascript
import { useAuth } from '../hooks/useAuth';

const MyComponent = () => {
  const { 
    user, 
    token, 
    userRoles, 
    userPermissions,
    isLoading,
    hasRole,
    hasPermission,
    logout 
  } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <p>Roles: {userRoles.map(r => r.name).join(', ')}</p>
      
      {hasRole('admin') && (
        <button>Admin Only Button</button>
      )}
      
      {hasPermission('manage_users') && (
        <UserManagementPanel />
      )}
      
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

### Normal Login Flow:
1. User visits: `https://mydomain.com/login`
2. After login, redirect to: `http://localhost:5176/?token=abc123xyz`
3. App validates token with server via `GET /auth/me`
4. Fetches user roles and permissions
5. User sees dashboard with role-based content

### Direct Access:
1. User visits: `http://localhost:5176/` (no token)
2. Automatically redirected to: `https://mydomain.com/login`

### Token in Storage:
1. User returns to app with existing sessionStorage token
2. Token validated with server
3. User data and permissions loaded
4. Immediately authenticated and shown dashboard

## Development Features

### API Response Examples:

#### GET /auth/me Response:
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "created_at": "2023-01-01T00:00:00Z"
}
```

#### GET /auth/user/roles Response:
```json
[
  {
    "id": 1,
    "name": "Admin",
    "slug": "admin",
    "description": "Administrator role"
  },
  {
    "id": 2,
    "name": "Manager",
    "slug": "manager",
    "description": "Manager role"
  }
]
```

#### GET /auth/user/permissions Response:
```json
[
  {
    "id": 1,
    "name": "Manage Users",
    "slug": "manage_users",
    "description": "Can create, edit, and delete users"
  },
  {
    "id": 2,
    "name": "View Reports",
    "slug": "view_reports",
    "description": "Can access reporting features"
  }
]
```

### Token Debugging:
- Current token displayed in dashboard for development
- Console logging of authentication events
- User roles and permissions displayed visually
- API request/response logging

### Test URLs:
- **With Token**: `http://localhost:5176/?token=your-jwt-token-here`
- **Without Token**: `http://localhost:5176/` (will redirect)

## Error Handling

### Token Expiration:
- Automatic token refresh every 45 minutes
- If refresh fails, user logged out automatically
- 401 responses trigger immediate logout

### Network Errors:
- API failures logged to console
- Graceful degradation for role/permission checks
- Retry mechanisms for critical operations

### Invalid Tokens:
- Server validation on app load
- Invalid tokens automatically cleared
- User redirected to login for re-authentication

## Security Notes

- Tokens stored in sessionStorage (cleared on tab close)
- localStorage also cleared on logout for security
- All routes protected by default
- URL token parameters automatically cleaned after extraction
- Automatic token refresh prevents session expiration
- Server-side validation for all token operations
- 401 responses trigger immediate cleanup and redirect

## Files Modified/Created

### New Files:
- `src/services/authService.js` - Complete API service for authentication
- `src/utils/auth.js` - Enhanced authentication utilities with API integration
- `src/contexts/AuthContext.jsx` - Auth context with roles and permissions
- `src/hooks/useAuth.jsx` - Authentication hook
- `src/components/ProtectedRoute.jsx` - Route protection component
- `src/components/auth/RoleBasedAccess.jsx` - RBAC components
- `src/components/auth/ExampleUsage.jsx` - Usage examples

### Modified Files:
- `src/main.jsx` - Added AuthProvider wrapper
- `src/App.jsx` - Wrapped routes with ProtectedRoute
- `src/pages/Dashboard.jsx` - Added role/permission info display
- `src/components/UserDropDown.jsx` - Added logout functionality

## Common Role/Permission Patterns

### Typical Admin Roles:
- `super_admin` - Full system access
- `admin` - General administrative access
- `manager` - Management-level access
- `editor` - Content editing access
- `viewer` - Read-only access

### Common Permissions:
- `manage_users` - User CRUD operations
- `manage_roles` - Role management
- `view_reports` - Access to reports
- `manage_billing` - Billing operations
- `manage_settings` - System configuration
- `moderate_content` - Content moderation

## Best Practices

### Component Organization:
```jsx
// Wrap entire features with role checks
<RequireRole roles="admin">
  <AdminDashboard />
</RequireRole>

// Use granular permission checks for actions
<RequirePermission permissions="delete_users">
  <DeleteButton />
</RequirePermission>

// Combine multiple checks for complex scenarios
<RequireRoleAndPermission roles={['admin', 'manager']} permissions="view_analytics">
  <AnalyticsPanel />
</RequireRoleAndPermission>
```

### API Integration:
```javascript
// Always use the configured API client
import apiClient from '../services/authService';

// Client handles authentication automatically
const response = await apiClient.get('/protected-endpoint');
```

### Error Boundaries:
Implement error boundaries around authentication-critical components to handle API failures gracefully.

## Running the Application

```bash
# Install dependencies
npm install

# Create environment file
echo "VITE_API_BASE_URL=https://your-api-domain.com" > .env

# Start development server
npm run dev
```

The app will be available at: `http://localhost:5176/`

**Test with token**: `http://localhost:5176/?token=your-jwt-token`

## Troubleshooting

### Common Issues:

1. **401 Errors**: Check if your API base URL is correct in `.env`
2. **CORS Issues**: Ensure your backend allows requests from `localhost:5176`
3. **Token Format**: Verify your backend sends JWT tokens in the expected format
4. **Role/Permission Mismatch**: Check that role and permission names match between frontend and backend
5. **Network Errors**: Verify API endpoints are accessible and returning expected JSON responses

### Debug Mode:
Enable detailed logging by checking the browser console for authentication events marked with emojis (🔐, ✅, ❌, etc.).
