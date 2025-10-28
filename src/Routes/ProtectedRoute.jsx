import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useRolePermissions } from "../hooks/useRolePermissions";

export const ProtectedRoute = ({
  children,
  requiredRole = null,
  requiredPermission = null,
  requiredAction = null,
  fallbackPath = "/signin",
}) => {
  const { isAuthenticated, loading, user } = useAuth();
  const { canManageRole, hasSchemePermission, hasCommissionPermission } =
    useRolePermissions();
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check role-based access if required
  if (
    requiredRole &&
    !canManageRole(requiredRole) &&
    user?.role_name !== requiredRole
  ) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600">
            You don't have permission to access this page.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Required role: {requiredRole} | Your role:{" "}
            {user?.role_name || user?.role?.name || "Unknown"}
          </p>
        </div>
      </div>
    );
  }

  // Check permission-based access
  if (requiredPermission && requiredAction) {
    let hasPermission = false;

    if (requiredPermission === "scheme") {
      hasPermission = hasSchemePermission(requiredAction);
    } else if (requiredPermission === "commission") {
      hasPermission = hasCommissionPermission(requiredAction);
    }

    if (!hasPermission) {
      return (
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">
              Permission Required
            </h2>
            <p className="text-gray-600">
              You don't have the required permission to access this feature.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Required: {requiredPermission} - {requiredAction}
            </p>
          </div>
        </div>
      );
    }
  }

  return children;
};
