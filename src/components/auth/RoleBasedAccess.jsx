import { useAuth } from '../hooks/useAuth';

/**
 * Role-based Access Control Component
 * Conditionally renders children based on user roles and permissions
 */

/**
 * Renders children only if user has specified role(s)
 */
export const RequireRole = ({ roles, children, fallback = null }) => {
  const { hasRole, hasAnyRole } = useAuth();
  
  if (!roles) return children;
  
  const roleList = Array.isArray(roles) ? roles : [roles];
  const hasAccess = roleList.length === 1 ? hasRole(roleList[0]) : hasAnyRole(roleList);
  
  return hasAccess ? children : fallback;
};

/**
 * Renders children only if user has specified permission(s)
 */
export const RequirePermission = ({ permissions, children, fallback = null }) => {
  const { hasPermission, hasAnyPermission } = useAuth();
  
  if (!permissions) return children;
  
  const permissionList = Array.isArray(permissions) ? permissions : [permissions];
  const hasAccess = permissionList.length === 1 
    ? hasPermission(permissionList[0]) 
    : hasAnyPermission(permissionList);
  
  return hasAccess ? children : fallback;
};

/**
 * Renders children only if user has both role(s) AND permission(s)
 */
export const RequireRoleAndPermission = ({ roles, permissions, children, fallback = null }) => {
  const { hasRole, hasAnyRole, hasPermission, hasAnyPermission } = useAuth();
  
  let hasRoleAccess = true;
  let hasPermissionAccess = true;
  
  if (roles) {
    const roleList = Array.isArray(roles) ? roles : [roles];
    hasRoleAccess = roleList.length === 1 ? hasRole(roleList[0]) : hasAnyRole(roleList);
  }
  
  if (permissions) {
    const permissionList = Array.isArray(permissions) ? permissions : [permissions];
    hasPermissionAccess = permissionList.length === 1 
      ? hasPermission(permissionList[0]) 
      : hasAnyPermission(permissionList);
  }
  
  return (hasRoleAccess && hasPermissionAccess) ? children : fallback;
};

/**
 * Renders children only if user has role(s) OR permission(s)
 */
export const RequireRoleOrPermission = ({ roles, permissions, children, fallback = null }) => {
  const { hasRole, hasAnyRole, hasPermission, hasAnyPermission } = useAuth();
  
  let hasRoleAccess = false;
  let hasPermissionAccess = false;
  
  if (roles) {
    const roleList = Array.isArray(roles) ? roles : [roles];
    hasRoleAccess = roleList.length === 1 ? hasRole(roleList[0]) : hasAnyRole(roleList);
  }
  
  if (permissions) {
    const permissionList = Array.isArray(permissions) ? permissions : [permissions];
    hasPermissionAccess = permissionList.length === 1 
      ? hasPermission(permissionList[0]) 
      : hasAnyPermission(permissionList);
  }
  
  return (hasRoleAccess || hasPermissionAccess) ? children : fallback;
};

/**
 * Higher-order component for role-based access control
 */
export const withRoleAccess = (WrappedComponent, requiredRoles = []) => {
  return function RoleProtectedComponent(props) {
    const { hasAnyRole } = useAuth();
    
    if (requiredRoles.length === 0 || hasAnyRole(requiredRoles)) {
      return <WrappedComponent {...props} />;
    }
    
    return (
      <div className="flex items-center justify-center min-h-[200px] bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">🚫</div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Access Denied
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            You don't have permission to access this feature.
          </p>
        </div>
      </div>
    );
  };
};

/**
 * Higher-order component for permission-based access control
 */
export const withPermissionAccess = (WrappedComponent, requiredPermissions = []) => {
  return function PermissionProtectedComponent(props) {
    const { hasAnyPermission } = useAuth();
    
    if (requiredPermissions.length === 0 || hasAnyPermission(requiredPermissions)) {
      return <WrappedComponent {...props} />;
    }
    
    return (
      <div className="flex items-center justify-center min-h-[200px] bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">🔒</div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Permission Required
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            You don't have the required permissions to access this feature.
          </p>
        </div>
      </div>
    );
  };
};
