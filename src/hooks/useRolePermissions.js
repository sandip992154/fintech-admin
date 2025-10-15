/**
 * Role-based Permissions Hook
 * Provides role-based permission checking and user role utilities
 */

import { useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";
import RoleHierarchyUtils from "../utils/roleHierarchy";

export const useRolePermissions = () => {
  const { user, isAuthenticated } = useAuth();

  // Memoize user role and level
  const userRole = useMemo(() => {
    if (!user?.role_name) return null;
    return user.role_name;
  }, [user?.role_name]);

  const userLevel = useMemo(() => {
    return userRole ? RoleHierarchyUtils.getRoleLevel(userRole) : 999;
  }, [userRole]);

  // Memoize permission checkers
  const permissions = useMemo(() => {
    if (!userRole) {
      return {
        schemes: { create: false, read: false, update: false, delete: false },
        commissions: {
          create: false,
          read: false,
          update: false,
          delete: false,
        },
        editableCommissionFields: [],
        manageableRoles: [],
      };
    }

    // Use commission field rules to determine editable fields
    const commissionFieldRules =
      RoleHierarchyUtils.getCommissionFieldRules(userRole);
    let editableCommissionFields = [];
    if (commissionFieldRules.canEdit) {
      // Superadmin, admin, whitelabel can edit all commission role fields
      if (RoleHierarchyUtils.getRoleLevel(userRole) <= 2) {
        editableCommissionFields = [
          "whitelabel",
          "masterdistributor",
          "distributor",
          "retailer",
          "customer",
        ];
      }
    }

    return {
      schemes: {
        create: RoleHierarchyUtils.hasSchemePermission(userRole, "create"),
        read: RoleHierarchyUtils.hasSchemePermission(userRole, "read"),
        update: RoleHierarchyUtils.hasSchemePermission(userRole, "update"),
        delete: RoleHierarchyUtils.hasSchemePermission(userRole, "delete"),
      },
      commissions: {
        create: RoleHierarchyUtils.hasCommissionPermission(userRole, "create"),
        read: RoleHierarchyUtils.hasCommissionPermission(userRole, "read"),
        update: RoleHierarchyUtils.hasCommissionPermission(userRole, "update"),
        delete: RoleHierarchyUtils.hasCommissionPermission(userRole, "delete"),
      },
      editableCommissionFields,
      manageableRoles: RoleHierarchyUtils.getManageableRoles(userRole),
    };
  }, [userRole]);

  // Permission check functions
  const hasSchemePermission = useMemo(
    () => (action) => {
      return permissions.schemes[action] || false;
    },
    [permissions.schemes]
  );

  const hasCommissionPermission = useMemo(
    () => (action) => {
      return permissions.commissions[action] || false;
    },
    [permissions.commissions]
  );

  const canEditCommissionField = useMemo(
    () => (field) => {
      return permissions.editableCommissionFields.includes(field);
    },
    [permissions.editableCommissionFields]
  );

  const canManageRole = useMemo(
    () => (targetRole) => {
      return RoleHierarchyUtils.canManageRole(userRole, targetRole);
    },
    [userRole]
  );

  const canAccessScheme = useMemo(
    () => (scheme) => {
      return RoleHierarchyUtils.canAccessScheme(user, scheme);
    },
    [user]
  );

  // Filter functions
  const filterAccessibleSchemes = useMemo(
    () => (schemes) => {
      return RoleHierarchyUtils.filterAccessibleSchemes(schemes, user);
    },
    [user]
  );

  const commissionFieldRules = useMemo(() => {
    return RoleHierarchyUtils.getCommissionFieldRules(userRole);
  }, [userRole]);

  // Role display information
  const roleInfo = useMemo(
    () => ({
      name: userRole,
      displayName: RoleHierarchyUtils.getRoleDisplayName(userRole),
      level: userLevel,
      isHighestRole: userLevel === 0,
      isLowestRole: userLevel === 6,
    }),
    [userRole, userLevel]
  );

  return {
    // User info
    user,
    userRole,
    userLevel,
    roleInfo,
    isAuthenticated,

    // Permission objects
    permissions,

    // Permission check functions
    hasSchemePermission,
    hasCommissionPermission,
    canEditCommissionField,
    canManageRole,
    canAccessScheme,

    // Utility functions
    filterAccessibleSchemes,
    commissionFieldRules,
    getCommissionFieldRules: () => commissionFieldRules,
    validateCommissionHierarchy: RoleHierarchyUtils.validateCommissionHierarchy,

    // Role utilities
    getRoleDisplayName: RoleHierarchyUtils.getRoleDisplayName,
    getManageableRoles: () => permissions.manageableRoles,
    getEditableCommissionFields: () => permissions.editableCommissionFields,
  };
};

export default useRolePermissions;
