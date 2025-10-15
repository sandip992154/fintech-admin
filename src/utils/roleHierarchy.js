/**
 * Role Hierarchy Utilities for Admin Application
 * Simplified role management based on superadmin system
 *
 * Features:
 * - Role level management (0-6 hierarchy)
 * - Permission checking for schemes and commissions
 * - Access control for resources
 * - Commission field editing rules
 * - Validation for role-based operations
 *
 * Updated: Added missing functions for useRolePermissions hook compatibility
 */

// Role hierarchy mapping
export const ROLE_HIERARCHY = {
  super_admin: 0,
  superadmin: 0, // Alias for super_admin
  admin: 1,
  whitelabel: 2,
  mds: 3,
  masterdistributor: 3, // Alias for mds
  distributor: 4,
  retailer: 5,
  customer: 6,
};

// Role display names
export const ROLE_DISPLAY_NAMES = {
  super_admin: "Super Admin",
  superadmin: "Super Admin",
  admin: "Admin",
  whitelabel: "Whitelabel",
  mds: "Master Distributor",
  masterdistributor: "Master Distributor",
  distributor: "Distributor",
  retailer: "Retailer",
  customer: "Customer",
};

export class RoleHierarchyUtils {
  /**
   * Get role level from hierarchy
   * @param {string} role - Role name
   * @returns {number} Role level (0 = highest, 6 = lowest)
   */
  static getRoleLevel(role) {
    const normalizedRole = role?.toLowerCase();
    return ROLE_HIERARCHY[normalizedRole] ?? 999;
  }

  /**
   * Check if user role can manage target role
   * @param {string} userRole - User's role
   * @param {string} targetRole - Target role to manage
   * @returns {boolean} True if user can manage target role
   */
  static canManageRole(userRole, targetRole) {
    const userLevel = this.getRoleLevel(userRole);
    const targetLevel = this.getRoleLevel(targetRole);
    // Child cannot operate on parent or same level
    return userLevel < targetLevel;
  }

  /**
   * Get roles that user can manage (downstream roles)
   * @param {string} userRole - User's role
   * @returns {string[]} Array of manageable roles
   */
  static getManageableRoles(userRole) {
    const userLevel = this.getRoleLevel(userRole);
    return Object.keys(ROLE_HIERARCHY).filter(
      (role) => ROLE_HIERARCHY[role] > userLevel
    );
  }

  /**
   * Check if user has admin permissions
   * @param {string} userRole - User's role
   * @param {string} action - Action (create, read, update, delete)
   * @returns {boolean} True if user has permission
   */
  static hasAdminPermission(userRole, action) {
    const userLevel = this.getRoleLevel(userRole);

    switch (action) {
      case "create":
      case "update":
      case "delete":
        return userLevel <= 1; // super_admin, admin only
      case "read":
        return userLevel <= 2; // super_admin, admin, whitelabel
      default:
        return false;
    }
  }

  /**
   * Get role display name
   * @param {string} role - Role name
   * @returns {string} Display name for role
   */
  static getRoleDisplayName(role) {
    const normalizedRole = role?.toLowerCase();
    return ROLE_DISPLAY_NAMES[normalizedRole] || role;
  }

  /**
   * Check if user can access resource based on role hierarchy
   * @param {Object} user - User object with role
   * @param {string} requiredRole - Minimum required role
   * @returns {boolean} True if user can access resource
   */
  static canAccessResource(user, requiredRole) {
    if (!user?.role) return false;

    const userLevel = this.getRoleLevel(user.role_name || user.role);
    const requiredLevel = this.getRoleLevel(requiredRole);

    return userLevel <= requiredLevel;
  }

  /**
   * Check if user has scheme management permissions
   * @param {string} userRole - User's role
   * @param {string} action - Action (create, read, update, delete)
   * @returns {boolean} True if user has scheme permission
   */
  static hasSchemePermission(userRole, action) {
    const userLevel = this.getRoleLevel(userRole);
    // superadmin, admin, whitelabel (levels 0,1,2) have full access
    switch (action) {
      case "create":
      case "update":
      case "delete":
      case "read":
        return userLevel <= 2;
      default:
        return false;
    }
  }

  /**
   * Check if user has commission management permissions
   * @param {string} userRole - User's role
   * @param {string} action - Action (create, read, update, delete)
   * @returns {boolean} True if user has commission permission
   */
  static hasCommissionPermission(userRole, action) {
    const userLevel = this.getRoleLevel(userRole);
    // superadmin, admin, whitelabel (levels 0,1,2) have full access
    switch (action) {
      case "create":
      case "update":
      case "delete":
      case "read":
        return userLevel <= 2;
      default:
        return false;
    }
  }

  /**
   * Get editable commission fields based on user role
   * @param {string} userRole - User's role
   * @returns {string[]} Array of editable commission field names
   */
  static getEditableCommissionFields(userRole) {
    const userLevel = this.getRoleLevel(userRole);
    if (userLevel <= 2) {
      // Superadmin, admin, whitelabel can edit all fields
      return [
        "commission_percentage",
        "min_commission",
        "max_commission",
        "flat_commission",
        "commission_type",
        "status",
      ];
    } else {
      // Others can only view, no edit permissions
      return [];
    }
  }
  /**
   * Check if user can manage specific member type
   * @param {string} userRole - User's role
   * @param {string} memberType - Member type to manage
   * @returns {boolean} True if user can manage the member type
   */
  static canManageMemberType(userRole, memberType) {
    return this.canManageRole(userRole, memberType);
  }

  /**
   * Check if user can access a specific scheme
   * @param {Object} user - User object with role
   * @param {Object} scheme - Scheme object
   * @returns {boolean} True if user can access the scheme
   */
  static canAccessScheme(user, scheme) {
    if (!user?.role_name || !scheme) return false;

    const userLevel = this.getRoleLevel(user.role_name);

    // Superadmin, admin, whitelabel can access all schemes
    if (userLevel <= 2) return true;

    // Others can only access schemes assigned to them
    if (scheme.accessible_roles) {
      return scheme.accessible_roles.includes(user.role_name);
    }

    return false;
  }

  /**
   * Filter schemes accessible to user
   * @param {Array} schemes - Array of scheme objects
   * @param {Object} user - User object
   * @returns {Array} Filtered schemes accessible to user
   */
  static filterAccessibleSchemes(schemes, user) {
    if (!schemes || !Array.isArray(schemes)) return [];
    if (!user?.role_name) return [];

    const userLevel = this.getRoleLevel(user.role_name);

    // Superadmin, admin, whitelabel can access all schemes
    if (userLevel <= 2) return schemes;

    // Filter schemes for other roles
    return schemes.filter((scheme) => this.canAccessScheme(user, scheme));
  }

  /**
   * Get commission field rules based on user role
   * @param {string} userRole - User's role
   * @returns {Object} Commission field rules and restrictions
   */
  static getCommissionFieldRules(userRole) {
    const userLevel = this.getRoleLevel(userRole);
    if (userLevel <= 2) {
      // Superadmin, admin, whitelabel have full access
      return {
        canEdit: true,
        canSetRates: true,
        canCreateNew: true,
        canDelete: true,
        maxCommissionPercentage: 100,
        minCommissionPercentage: 0,
        restrictions: [],
      };
    } else {
      // Others have read-only access
      return {
        canEdit: false,
        canSetRates: false,
        canCreateNew: false,
        canDelete: false,
        maxCommissionPercentage: 0,
        minCommissionPercentage: 0,
        restrictions: ["Read-only access"],
      };
    }
  }

  /**
   * Validate commission hierarchy rules
   * @param {Object} commissionData - Commission data to validate
   * @param {string} userRole - User's role
   * @param {string} targetRole - Target role for commission
   * @returns {Object} Validation result with success flag and messages
   */
  static validateCommissionHierarchy(commissionData, userRole, targetRole) {
    const userLevel = this.getRoleLevel(userRole);
    const targetLevel = this.getRoleLevel(targetRole);
    const rules = this.getCommissionFieldRules(userRole);

    const errors = [];
    const warnings = [];

    // Check if user can set commission for target role
    // Child cannot set commission for parent or same level
    if (userLevel >= targetLevel) {
      errors.push(
        "Cannot set commission for role equal to or higher than your role"
      );
    }

    // Check commission percentage limits
    if (commissionData.commission_percentage !== undefined) {
      if (
        commissionData.commission_percentage > rules.maxCommissionPercentage
      ) {
        errors.push(
          `Commission percentage cannot exceed ${rules.maxCommissionPercentage}%`
        );
      }
      if (
        commissionData.commission_percentage < rules.minCommissionPercentage
      ) {
        errors.push(
          `Commission percentage cannot be less than ${rules.minCommissionPercentage}%`
        );
      }
    }

    // Check edit permissions
    if (!rules.canEdit && Object.keys(commissionData).length > 0) {
      errors.push("You do not have permission to edit commission data");
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      canProceed: errors.length === 0,
    };
  }
}

export default RoleHierarchyUtils;
