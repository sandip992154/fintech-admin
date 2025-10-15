/**
 * Role-based Permission Components
 * Reusable components for displaying role information and permissions
 */

import React from "react";
import {
  FaUser,
  FaLock,
  FaUnlock,
  FaEye,
  FaEdit,
  FaShield,
} from "react-icons/fa";
import { useRolePermissions } from "../../hooks/useRolePermissions";

// Role Badge Component
export const RoleBadge = ({ role, size = "sm", showIcon = true }) => {
  const { getRoleDisplayName } = useRolePermissions();

  const sizeClasses = {
    xs: "px-2 py-1 text-xs",
    sm: "px-2 py-1 text-sm",
    md: "px-3 py-1 text-base",
    lg: "px-4 py-2 text-lg",
  };

  const getRoleColor = (role) => {
    const normalizedRole = role?.toLowerCase();
    switch (normalizedRole) {
      case "super_admin":
      case "superadmin":
        return "bg-red-100 text-red-800 border-red-200";
      case "admin":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "whitelabel":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "mds":
      case "masterdistributor":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "distributor":
        return "bg-green-100 text-green-800 border-green-200";
      case "retailer":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "customer":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <span
      className={`inline-flex items-center border rounded-full font-medium ${
        sizeClasses[size]
      } ${getRoleColor(role)}`}
    >
      {showIcon && <FaShield className="mr-1" />}
      {getRoleDisplayName(role)}
    </span>
  );
};

// Permission Status Component
export const PermissionStatus = ({ permission, action, size = "sm" }) => {
  const { hasSchemePermission, hasCommissionPermission } = useRolePermissions();

  const hasPermission =
    permission === "scheme"
      ? hasSchemePermission(action)
      : hasCommissionPermission(action);

  const getActionIcon = (action) => {
    switch (action) {
      case "read":
        return FaEye;
      case "create":
        return FaEdit;
      case "update":
        return FaEdit;
      case "delete":
        return FaEdit;
      default:
        return FaLock;
    }
  };

  const Icon = getActionIcon(action);
  const iconClasses = size === "sm" ? "w-3 h-3" : "w-4 h-4";

  return (
    <span
      className={`inline-flex items-center ${
        size === "sm" ? "text-xs" : "text-sm"
      }`}
    >
      <Icon
        className={`mr-1 ${iconClasses} ${
          hasPermission ? "text-green-500" : "text-red-500"
        }`}
      />
      <span className={hasPermission ? "text-green-600" : "text-red-600"}>
        {hasPermission ? "Allowed" : "Denied"}
      </span>
    </span>
  );
};

// Permissions Summary Card
export const PermissionsSummary = ({ showTitle = true, className = "" }) => {
  const { roleInfo, permissions } = useRolePermissions();

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 ${className}`}
    >
      {showTitle && (
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <FaShield className="mr-2" />
          Your Permissions
        </h3>
      )}

      <div className="space-y-3">
        {/* Role Information */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Current Role:
          </span>
          <RoleBadge role={roleInfo.name} />
        </div>

        {/* Scheme Permissions */}
        <div>
          <h4 className="text-sm font-medium mb-2">Scheme Management</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">View:</span>
              <PermissionStatus permission="scheme" action="read" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Create:</span>
              <PermissionStatus permission="scheme" action="create" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Edit:</span>
              <PermissionStatus permission="scheme" action="update" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Delete:</span>
              <PermissionStatus permission="scheme" action="delete" />
            </div>
          </div>
        </div>

        {/* Commission Permissions */}
        <div>
          <h4 className="text-sm font-medium mb-2">Commission Management</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">View:</span>
              <PermissionStatus permission="commission" action="read" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Create:</span>
              <PermissionStatus permission="commission" action="create" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Edit:</span>
              <PermissionStatus permission="commission" action="update" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Delete:</span>
              <PermissionStatus permission="commission" action="delete" />
            </div>
          </div>
        </div>

        {/* Editable Commission Fields */}
        <div>
          <h4 className="text-sm font-medium mb-2">Commission Fields Access</h4>
          <div className="text-xs text-gray-600">
            You can edit: {permissions.editableCommissionFields.length} fields
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {permissions.editableCommissionFields.map((field) => (
              <span
                key={field}
                className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs"
              >
                {field}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Access Denied Component
export const AccessDenied = ({ action, resource, className = "" }) => {
  return (
    <div className={`text-center py-8 ${className}`}>
      <FaLock className="mx-auto h-12 w-12 text-red-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        Access Denied
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        You don't have permission to {action} {resource}.
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
        Contact your administrator if you need access.
      </p>
    </div>
  );
};

// Ownership Badge
export const OwnershipBadge = ({ isOwner, isShared, className = "" }) => {
  if (isOwner) {
    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ${className}`}
      >
        <FaUser className="mr-1" />
        Owner
      </span>
    );
  }

  if (isShared) {
    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 ${className}`}
      >
        <FaUnlock className="mr-1" />
        Shared
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 ${className}`}
    >
      <FaEye className="mr-1" />
      View Only
    </span>
  );
};

// Role Guard Component
export const RoleGuard = ({
  children,
  requiredPermission,
  action,
  fallback = null,
  showAccessDenied = true,
}) => {
  const { hasSchemePermission, hasCommissionPermission } = useRolePermissions();

  const hasPermission =
    requiredPermission === "scheme"
      ? hasSchemePermission(action)
      : hasCommissionPermission(action);

  if (!hasPermission) {
    if (showAccessDenied) {
      return (
        fallback || (
          <AccessDenied action={action} resource={requiredPermission} />
        )
      );
    }
    return fallback;
  }

  return children;
};

export default {
  RoleBadge,
  PermissionStatus,
  PermissionsSummary,
  AccessDenied,
  OwnershipBadge,
  RoleGuard,
};
