/**
 * Example usage of Role-Based Access Control (RBAC) components
 * This file demonstrates how to use the authentication system with role and permission checks
 */

import { useAuth } from '../hooks/useAuth';
import { 
  RequireRole, 
  RequirePermission, 
  RequireRoleAndPermission,
  RequireRoleOrPermission 
} from '../components/auth/RoleBasedAccess';

const ExampleUsage = () => {
  const { user, userRoles, userPermissions, hasRole, hasPermission } = useAuth();

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Role-Based Access Control Examples</h2>
      
      {/* Basic Role Check */}
      <RequireRole roles="admin">
        <div className="p-4 bg-green-100 rounded-lg">
          <h3 className="font-semibold">Admin Only Content</h3>
          <p>This content is only visible to users with 'admin' role.</p>
        </div>
      </RequireRole>

      {/* Multiple Roles Check (OR logic) */}
      <RequireRole roles={['admin', 'manager', 'super_admin']}>
        <div className="p-4 bg-blue-100 rounded-lg">
          <h3 className="font-semibold">Management Content</h3>
          <p>This content is visible to admins, managers, or super admins.</p>
        </div>
      </RequireRole>

      {/* Permission Check */}
      <RequirePermission permissions="manage_users">
        <div className="p-4 bg-purple-100 rounded-lg">
          <h3 className="font-semibold">User Management</h3>
          <p>This content requires 'manage_users' permission.</p>
        </div>
      </RequirePermission>

      {/* Role AND Permission Check */}
      <RequireRoleAndPermission 
        roles="admin" 
        permissions={['manage_users', 'view_reports']}
      >
        <div className="p-4 bg-yellow-100 rounded-lg">
          <h3 className="font-semibold">Advanced Admin Features</h3>
          <p>Requires admin role AND both manage_users and view_reports permissions.</p>
        </div>
      </RequireRoleAndPermission>

      {/* Role OR Permission Check */}
      <RequireRoleOrPermission 
        roles="moderator" 
        permissions="moderate_content"
      >
        <div className="p-4 bg-pink-100 rounded-lg">
          <h3 className="font-semibold">Content Moderation</h3>
          <p>Visible to moderators OR users with moderate_content permission.</p>
        </div>
      </RequireRoleOrPermission>

      {/* Fallback Content */}
      <RequireRole 
        roles="super_admin"
        fallback={
          <div className="p-4 bg-red-100 rounded-lg">
            <h3 className="font-semibold">Access Denied</h3>
            <p>You need super admin access to view this content.</p>
          </div>
        }
      >
        <div className="p-4 bg-green-100 rounded-lg">
          <h3 className="font-semibold">Super Admin Panel</h3>
          <p>Ultra-secure content for super admins only.</p>
        </div>
      </RequireRole>

      {/* Programmatic Checks */}
      <div className="p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold">Programmatic Access Checks</h3>
        <div className="space-y-2 text-sm">
          <p>Is Admin: {hasRole('admin') ? '✅' : '❌'}</p>
          <p>Can Manage Users: {hasPermission('manage_users') ? '✅' : '❌'}</p>
          <p>Current User: {user?.name || 'Unknown'}</p>
          <p>User Roles: {userRoles.map(r => r.name).join(', ') || 'None'}</p>
          <p>User Permissions: {userPermissions.length} permissions</p>
        </div>
      </div>

      {/* Navigation Menu Example */}
      <div className="p-4 bg-white rounded-lg border">
        <h3 className="font-semibold mb-3">Dynamic Navigation Menu</h3>
        <nav className="space-y-2">
          <a href="/dashboard" className="block text-blue-600 hover:underline">
            Dashboard (Everyone)
          </a>
          
          <RequirePermission permissions="view_reports">
            <a href="/reports" className="block text-blue-600 hover:underline">
              Reports
            </a>
          </RequirePermission>
          
          <RequireRole roles={['admin', 'manager']}>
            <a href="/users" className="block text-blue-600 hover:underline">
              User Management
            </a>
          </RequireRole>
          
          <RequireRole roles="admin">
            <a href="/settings" className="block text-blue-600 hover:underline">
              System Settings
            </a>
          </RequireRole>
          
          <RequirePermission permissions="manage_billing">
            <a href="/billing" className="block text-blue-600 hover:underline">
              Billing Management
            </a>
          </RequirePermission>
        </nav>
      </div>
    </div>
  );
};

export default ExampleUsage;
