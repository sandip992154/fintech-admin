import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useRolePermissions } from "../hooks/useRolePermissions";
import { getUserStatus, shouldRedirectToKYC } from "../utils/userStatus";
import { getUserData, isAuthenticated } from "../utils/auth";

/**
 * Enhanced Authentication Guard Component
 * Handles KYC-first login flow, route protection, and role-based access
 */
const AuthGuard = ({
  children,
  requireKYC = true,
  requiredRole = null,
  requiredPermission = null,
  requiredAction = null,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    user,
    isAuthenticated: authContextAuthenticated,
    loading: authLoading,
  } = useAuth();
  const { canManageRole, hasSchemePermission, hasCommissionPermission } =
    useRolePermissions();
  const [loading, setLoading] = useState(true);
  const [userStatus, setUserStatus] = useState(null);

  // Routes that should bypass KYC check
  const kycBypassRoutes = [
    "/kyc-submission",
    "/mpin-setup",
    "/signin",
    "/login",
    "/signup",
    "/register",
  ];

  useEffect(() => {
    const checkAuthAndKYC = async () => {
      try {
        setLoading(true);

        // Wait for auth context to finish loading
        if (authLoading) {
          return;
        }

        // Check if user is authenticated (use context first, fallback to utils)
        const isUserAuthenticated =
          authContextAuthenticated || isAuthenticated();

        if (!isUserAuthenticated) {
          navigate("/signin", { replace: true });
          return;
        }

        // Get user data (prefer context, fallback to utils)
        const userData = user || getUserData();
        if (!userData) {
          navigate("/signin", { replace: true });
          return;
        }

        // Check role-based access
        if (
          requiredRole &&
          !canManageRole(requiredRole) &&
          userData.role_name !== requiredRole
        ) {
          navigate("/unauthorized", { replace: true });
          return;
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
            navigate("/unauthorized", { replace: true });
            return;
          }
        }

        // Skip KYC check for bypass routes
        if (kycBypassRoutes.includes(location.pathname)) {
          setLoading(false);
          return;
        }

        // Get user status (KYC + MPIN)
        const status = await getUserStatus();
        setUserStatus(status);

        // Check if KYC is required and not completed
        if (requireKYC && shouldRedirectToKYC(userData.role, status)) {
          // Redirect to KYC submission page
          navigate("/kyc-submission", { replace: true });
          return;
        }

        setLoading(false);
      } catch (error) {
        console.error("Error in AuthGuard:", error);
        navigate("/signin", { replace: true });
      }
    };

    checkAuthAndKYC();
  }, [navigate, location.pathname, requireKYC]);

  // Show loading spinner while checking
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying account status...</p>
        </div>
      </div>
    );
  }

  return children;
};

export default AuthGuard;
