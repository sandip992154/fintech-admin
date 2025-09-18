import { createContext, useEffect, useState } from "react";
import {
  initializeAuth,
  isAuthenticated,
  getAccessToken,
  getUserData,
  logout as logoutUser,
  refreshAccessToken,
} from "../utils/auth";
import { userRolesApi } from "../services/authService";

const AuthContext = createContext();

export { AuthContext };

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [userPermissions, setUserPermissions] = useState([]);

  // Fetch user roles and permissions
  const fetchUserRolesAndPermissions = async () => {
    try {
      // console.log('🔑 Fetching user roles and permissions...');

      // For development: if no API base URL is set, use simulated data
      if (
        !import.meta.env.VITE_API_BASE_URL ||
        import.meta.env.VITE_API_BASE_URL === "https://api.mydomain.com"
      ) {
        // console.log('⚡ Development mode: Using simulated roles and permissions');

        const simulatedRoles = [
          {
            id: 1,
            name: "Admin",
            slug: "admin",
            description: "Administrator role",
          },
          {
            id: 2,
            name: "Super Admin",
            slug: "super_admin",
            description: "Super administrator role",
          },
        ];

        const simulatedPermissions = [
          {
            id: 1,
            name: "Manage Users",
            slug: "manage_users",
            description: "Can create, edit, and delete users",
          },
          {
            id: 2,
            name: "View Reports",
            slug: "view_reports",
            description: "Can access reporting features",
          },
          {
            id: 3,
            name: "Manage Billing",
            slug: "manage_billing",
            description: "Can manage billing operations",
          },
          {
            id: 4,
            name: "System Settings",
            slug: "system_settings",
            description: "Can modify system settings",
          },
        ];

        setUserRoles(simulatedRoles);
        setUserPermissions(simulatedPermissions);
        // console.log('✅ Simulated roles and permissions loaded');
        return;
      }

      // Production: Fetch from API
      const [roles, permissions] = await Promise.all([
        userRolesApi.getUserRoles(),
        userRolesApi.getUserPermissions(),
      ]);

      setUserRoles(roles || []);
      setUserPermissions(permissions || []);
      // console.log('✅ User roles and permissions loaded from API');
    } catch (error) {
      console.error("❌ Failed to fetch user roles/permissions:", error);
      setUserRoles([]);
      setUserPermissions([]);
    }
  };

  useEffect(() => {
    // Initialize authentication on app load
    const initAuth = async () => {
      // console.log("🔄 Initializing authentication...");

      try {
        const authData = await initializeAuth();

        if (authData && authData.token && authData.userData) {
          setToken(authData.token);
          setUser(authData.userData);

          // Fetch roles and permissions for authenticated user
          await fetchUserRolesAndPermissions();

          // console.log("✅ Authentication successful");
        } else {
          console.log("❌ No valid authentication found");
          setToken(null);
          setUser(null);
          setUserRoles([]);
          setUserPermissions([]);
        }
      } catch (error) {
        console.error("❌ Authentication initialization failed:", error);
        setToken(null);
        setUser(null);
        setUserRoles([]);
        setUserPermissions([]);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Auto-refresh token every 45 minutes
  useEffect(() => {
    if (!token) return;

    const refreshInterval = setInterval(async () => {
      // console.log("🔄 Auto-refreshing token...");
      const refreshed = await refreshAccessToken();

      if (!refreshed) {
        console.log("❌ Auto-refresh failed, logging out");
        logout();
      }
    }, 45 * 60 * 1000); // 45 minutes

    return () => clearInterval(refreshInterval);
  }, [token]);

  const logout = async () => {
    setToken(null);
    setUser(null);
    setUserRoles([]);
    setUserPermissions([]);
    await logoutUser();
  };

  // Role-based access control helpers
  const hasRole = (roleName) => {
    return userRoles.some(
      (role) => role.name === roleName || role.slug === roleName
    );
  };

  const hasPermission = (permissionName) => {
    return userPermissions.some(
      (permission) =>
        permission.name === permissionName || permission.slug === permissionName
    );
  };

  const hasAnyRole = (roleNames) => {
    return roleNames.some((roleName) => hasRole(roleName));
  };

  const hasAnyPermission = (permissionNames) => {
    return permissionNames.some((permissionName) =>
      hasPermission(permissionName)
    );
  };

  const value = {
    user,
    token,
    userRoles,
    userPermissions,
    isLoading,
    isAuthenticated: isAuthenticated(),
    logout,
    getAccessToken,
    // Role-based access control
    hasRole,
    hasPermission,
    hasAnyRole,
    hasAnyPermission,
    // Refresh functions
    refreshUserData: fetchUserRolesAndPermissions,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
