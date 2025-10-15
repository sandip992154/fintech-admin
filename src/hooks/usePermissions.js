import { useAuth } from "../contexts/AuthContext";
import RoleHierarchyUtils from "../utils/roleHierarchy";

/**
 * Custom hook for role-based permissions
 * @returns {Object} Permission checking functions
 */
export const usePermissions = () => {
  const { user } = useAuth();

  /**
   * Check if user has specific permission
   * @param {string} action - Action to check (create, read, update, delete)
   * @param {string} resource - Resource type (optional)
   * @returns {boolean} True if user has permission
   */
  const hasPermission = (action, resource = "admin") => {
    if (!user?.role) return false;

    const userRole = user.role_name || user.role;

    switch (resource) {
      case "admin":
        return RoleHierarchyUtils.hasAdminPermission(userRole, action);
      default:
        return RoleHierarchyUtils.hasAdminPermission(userRole, action);
    }
  };

  /**
   * Check if user can manage another role
   * @param {string} targetRole - Target role to manage
   * @returns {boolean} True if user can manage target role
   */
  const canManageRole = (targetRole) => {
    if (!user?.role) return false;

    const userRole = user.role_name || user.role;
    return RoleHierarchyUtils.canManageRole(userRole, targetRole);
  };

  /**
   * Get roles that user can manage
   * @returns {string[]} Array of manageable roles
   */
  const getManageableRoles = () => {
    if (!user?.role) return [];

    const userRole = user.role_name || user.role;
    return RoleHierarchyUtils.getManageableRoles(userRole);
  };

  /**
   * Check if user can access resource
   * @param {string} requiredRole - Minimum required role
   * @returns {boolean} True if user can access resource
   */
  const canAccessResource = (requiredRole) => {
    return RoleHierarchyUtils.canAccessResource(user, requiredRole);
  };

  /**
   * Get user's role display name
   * @returns {string} Role display name
   */
  const getRoleDisplayName = () => {
    if (!user?.role) return "";

    const userRole = user.role_name || user.role;
    return RoleHierarchyUtils.getRoleDisplayName(userRole);
  };

  /**
   * Check if user is admin or higher
   * @returns {boolean} True if user is admin or higher
   */
  const isAdmin = () => {
    if (!user?.role) return false;

    const userRole = user.role_name || user.role;
    const userLevel = RoleHierarchyUtils.getRoleLevel(userRole);
    return userLevel <= 1; // admin or super_admin
  };

  /**
   * Check if user is super admin
   * @returns {boolean} True if user is super admin
   */
  const isSuperAdmin = () => {
    if (!user?.role) return false;

    const userRole = user.role_name || user.role;
    const userLevel = RoleHierarchyUtils.getRoleLevel(userRole);
    return userLevel === 0; // super_admin only
  };

  return {
    hasPermission,
    canManageRole,
    getManageableRoles,
    canAccessResource,
    getRoleDisplayName,
    isAdmin,
    isSuperAdmin,
    user,
  };
};
