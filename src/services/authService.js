import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Create API instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  // timeout: 20000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper function for auth cleanup
function clearAuthAndRedirect() {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = "/signin";
}

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error("API Error:", {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url,
    });

    // Handle validation errors
    if (error.response?.status === 422) {
      const validationErrors = error.response.data?.detail;
      if (validationErrors) {
        throw new Error(validationErrors);
      }
    }

    // Handle authentication errors
    if (error.response?.status === 401) {
      const originalRequest = error.config;

      // Don't try token refresh for login endpoints - pass the error directly
      if (
        originalRequest.url?.includes("/auth/login") ||
        originalRequest.url?.includes("/auth/login-otp-verify")
      ) {
        // For login endpoints, extract and throw the actual error message
        const errorMessage =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          "Authentication failed";
        throw new Error(errorMessage);
      }

      const refreshToken = localStorage.getItem("refresh_token");

      // Try token refresh if we have a refresh token and haven't tried yet
      if (refreshToken && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const response = await api.post("/auth/refresh", {
            refresh_token: refreshToken,
          });
          const { access_token } = response.data;
          localStorage.setItem("token", access_token);
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        } catch (refreshError) {
          clearAuthAndRedirect();
          return Promise.reject(
            new Error("Session expired. Please login again.")
          );
        }
      }
      clearAuthAndRedirect();
      return Promise.reject(new Error("Session expired. Please login again."));
    }
    return Promise.reject(error);
  }
);

// Superadmin authentication service
const authService = {
  // Login with credentials
  login: async (formData) => {
    try {
      console.log("SuperAdminAuthService: Starting login request");
      const response = await api.post("/auth/login", formData, {
        headers: {
          // Remove default Content-Type as browser will set it with boundary for FormData
          "Content-Type": undefined,
        },
      });
      return response.data;
    } catch (error) {
      console.error("SuperAdminAuthService: Login error:", error);

      // Handle different error types
      if (error.response?.status === 401) {
        const errorMessage =
          error.response?.data?.detail || "Invalid credentials";
        throw new Error(errorMessage);
      } else if (error.response?.status === 403) {
        const errorMessage =
          error.response?.data?.detail || "Account access denied";
        throw new Error(errorMessage);
      } else if (error.response?.status === 422) {
        const errorMessage = Array.isArray(error.response.data.detail)
          ? error.response.data.detail.join(", ")
          : error.response.data.detail || "Validation error";
        throw new Error(errorMessage);
      } else if (error.response?.data?.detail) {
        throw new Error(
          Array.isArray(error.response.data.detail)
            ? error.response.data.detail.join(", ")
            : error.response.data.detail
        );
      } else if (error.message) {
        throw new Error(error.message);
      }

      throw new Error("An unexpected error occurred during login");
    }
  },

  verifyOtp: async (data) => {
    try {
      console.log("SuperAdminAuthService: Starting OTP verification");
      const response = await api.post("/auth/login-otp-verify", data);

      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        if (response.data.refresh_token) {
          localStorage.setItem("refresh_token", response.data.refresh_token);
        }
      }

      return response.data;
    } catch (error) {
      console.error("SuperAdminAuthService: OTP verification error:", error);
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw error;
    }
  },

  // Login with form URL encoded data
  loginWithJson: async (data) => {
    const formData = new URLSearchParams();
    formData.append("username", data.identifier);
    formData.append("password", data.password);

    try {
      const response = await api.post("/auth/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      return response.data;
    } catch (error) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw error;
    }
  },

  // Verify OTP
  verifyOtp: async (data) => {
    try {
      console.log("SuperAdminAuthService: Starting OTP verification");
      const response = await api.post("/auth/login-otp-verify", {
        otp: data.otp,
        identifier: data.identifier,
      });

      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        if (response.data.refresh_token) {
          localStorage.setItem("refresh_token", response.data.refresh_token);
        }
        localStorage.setItem("user_role", "super_admin");
        localStorage.setItem("userData", JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error("SuperAdminAuthService: OTP verification error:", error);
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw error;
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Validate token
  validateToken: async () => {
    try {
      const response = await api.get("/auth/verify");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Password reset request - sends email with reset link
  forgotPassword: async (email, baseUrl = window.location.origin) => {
    try {
      const response = await api.post("/auth/forgot-password", {
        email,
        base_url: baseUrl,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Reset password with token
  resetPassword: async (token, newPassword, confirmPassword) => {
    try {
      const response = await api.post("/auth/reset-password", {
        token,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Refresh access token using refresh token
  refreshToken: async (refreshToken) => {
    try {
      console.log("SuperAdminAuthService: Starting token refresh");
      const response = await api.post("/auth/refresh", {
        refresh_token: refreshToken,
      });

      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        // Update refresh token if a new one is provided
        if (response.data.refresh_token) {
          localStorage.setItem("refresh_token", response.data.refresh_token);
        }
      }

      return response.data;
    } catch (error) {
      console.error("SuperAdminAuthService: Token refresh error:", error);
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw error;
    }
  },

  // Logout
  logout: () => {
    clearAuthAndRedirect();
  },
};

export { clearAuthAndRedirect };
export default authService;
