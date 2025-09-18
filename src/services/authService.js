/**
 * API service for authentication endpoints
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://api.mydomain.com";

/**
 * HTTP client with automatic token inclusion
 */
class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = sessionStorage.getItem("accessToken");

    // Skip API calls if using default placeholder URL (development mode)
    if (this.baseURL === "https://api.mydomain.com") {
      console.log("⚡ Development mode: API call skipped for", endpoint);
      throw new Error("API not configured - using development mode");
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      // Handle 401 Unauthorized - token expired or invalid
      if (response.status === 401) {
        console.log("🚫 Token expired or invalid, redirecting to login");
        sessionStorage.clear();
        localStorage.clear();
        window.location.href = import.meta.env.VITE_API_SIGNIN_URL;
        return null;
      }

      // Handle other error statuses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("🚨 API Request failed:", error);
      throw error;
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { method: "GET", ...options });
  }

  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
      ...options,
    });
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
      ...options,
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { method: "DELETE", ...options });
  }
}

const apiClient = new ApiClient();

/**
 * Authentication API Service
 */
export const authApi = {
  /**
   * Login with credentials
   * @param {Object} credentials - { email, password }
   * @returns {Promise<Object>} User data and token
   */
  login: async (credentials) => {
    // console.log('🔐 Attempting login...');
    const response = await apiClient.post("/auth/login", credentials);
    console.log("✅ Login successful");
    return response;
  },

  /**
   * Login with JSON payload
   * @param {Object} credentials - { email, password }
   * @returns {Promise<Object>} User data and token
   */
  loginJson: async (credentials) => {
    // console.log('🔐 Attempting JSON login...');
    const response = await apiClient.post("/auth/login-json", credentials);
    console.log("✅ JSON login successful");
    return response;
  },

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} User data and token
   */
  register: async (userData) => {
    // console.log("📝 Attempting registration...");
    const response = await apiClient.post("/auth/register", userData);
    console.log("✅ Registration successful");
    return response;
  },

  /**
   * Get current user information
   * @returns {Promise<Object>} Current user data
   */
  getCurrentUser: async () => {
    // console.log("👤 Fetching current user info...");
    const response = await apiClient.get("/auth/me");
    console.log("✅ User info retrieved");
    return response;
  },

  /**
   * Refresh access token
   * @returns {Promise<Object>} New token data
   */
  refreshToken: async () => {
    // console.log("🔄 Refreshing token...");
    const response = await apiClient.post("/auth/refresh");
    console.log("✅ Token refreshed");
    return response;
  },

  /**
   * Logout user
   * @returns {Promise<Object>} Logout confirmation
   */
  logout: async () => {
    // console.log("🚪 Logging out...");
    try {
      const response = await apiClient.post("/auth/logout");
      console.log("✅ Server logout successful");
      return response;
    } catch (error) {
      console.warn("⚠️ Server logout failed, proceeding with client logout");
      throw error;
    }
  },
};

/**
 * Roles API Service
 */
export const rolesApi = {
  /**
   * Get all roles
   * @returns {Promise<Array>} List of roles
   */
  getRoles: async () => {
    // console.log("📋 Fetching roles...");
    const response = await apiClient.get("/auth/roles");
    console.log("✅ Roles retrieved");
    return response;
  },

  /**
   * Create new role
   * @param {Object} roleData - Role information
   * @returns {Promise<Object>} Created role
   */
  createRole: async (roleData) => {
    // console.log("➕ Creating role...");
    const response = await apiClient.post("/auth/roles", roleData);
    console.log("✅ Role created");
    return response;
  },

  /**
   * Get specific role by ID
   * @param {string} roleId - Role identifier
   * @returns {Promise<Object>} Role data
   */
  getRole: async (roleId) => {
    // console.log(`📋 Fetching role ${roleId}...`);
    const response = await apiClient.get(`/auth/roles/${roleId}`);
    // console.log("✅ Role retrieved");
    return response;
  },

  /**
   * Update role
   * @param {string} roleId - Role identifier
   * @param {Object} roleData - Updated role data
   * @returns {Promise<Object>} Updated role
   */
  updateRole: async (roleId, roleData) => {
    // console.log(`✏️ Updating role ${roleId}...`);
    const response = await apiClient.put(`/auth/roles/${roleId}`, roleData);
    // console.log("✅ Role updated");
    return response;
  },

  /**
   * Delete role
   * @param {string} roleId - Role identifier
   * @returns {Promise<Object>} Deletion confirmation
   */
  deleteRole: async (roleId) => {
    // console.log(`🗑️ Deleting role ${roleId}...`);
    const response = await apiClient.delete(`/auth/roles/${roleId}`);
    // console.log("✅ Role deleted");
    return response;
  },
};

/**
 * User Roles API Service
 */
export const userRolesApi = {
  /**
   * Get current user's roles
   * @returns {Promise<Array>} User's roles
   */
  getUserRoles: async () => {
    // console.log("👤 Fetching user roles...");
    const response = await apiClient.get("/auth/user/roles");
    // console.log("✅ User roles retrieved");
    return response;
  },

  /**
   * Assign role to current user
   * @param {Object} roleData - Role assignment data
   * @returns {Promise<Object>} Assignment confirmation
   */
  assignRole: async (roleData) => {
    // console.log("➕ Assigning role to user...");
    const response = await apiClient.post("/auth/user/roles", roleData);
    // console.log("✅ Role assigned");
    return response;
  },

  /**
   * Remove role from current user
   * @param {string} roleId - Role identifier to remove
   * @returns {Promise<Object>} Removal confirmation
   */
  removeRole: async (roleId) => {
    // console.log(`➖ Removing role ${roleId} from user...`);
    const response = await apiClient.delete(`/auth/user/roles/${roleId}`);
    // console.log("✅ Role removed");
    return response;
  },

  /**
   * Get current user's permissions
   * @returns {Promise<Array>} User's permissions
   */
  getUserPermissions: async () => {
    // console.log("🔑 Fetching user permissions...");
    const response = await apiClient.get("/auth/user/permissions");
    // console.log("✅ User permissions retrieved");
    return response;
  },
};

export default apiClient;
