/**
 * Profile Management Service for Admin
 * Handles all profile-related API calls for the enhanced backend
 */
import apiClient from "./apiClient.js";

class ProfileManagementService {
  // ========== PROFILE DETAILS ==========

  /**
   * Get user's profile details
   */
  static async getProfileDetails() {
    try {
      const response = await apiClient.get("/profile/details");
      return response.data;
    } catch (error) {
      console.error("Error fetching profile details:", error);
      throw error;
    }
  }

  /**
   * Update user's profile details
   */
  static async updateProfileDetails(profileData) {
    try {
      const response = await apiClient.put(
        "/profile/details",
        profileData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating profile details:", error);
      console.error("Error response:", error.response?.data);

      // Return structured error response
      if (error.response?.data?.detail) {
        return {
          success: false,
          message: error.response.data.detail,
        };
      } else if (error.message) {
        return {
          success: false,
          message: error.message,
        };
      } else {
        return {
          success: false,
          message: "Failed to update profile details",
        };
      }
    }
  }

  // ========== PASSWORD MANAGEMENT ==========

  /**
   * Update user's password
   */
  static async updatePassword(passwordData) {
    try {
      const response = await apiClient.put("/profile/password", passwordData);
      return response.data;
    } catch (error) {
      console.error("Error updating password:", error);
      return {
        success: false,
        message:
          error.response?.data?.detail ||
          error.message ||
          "Failed to update password",
      };
    }
  }

  /**
   * Verify PIN reset OTP (Step 2 of the 3-step PIN reset flow).
   * POST /pin/verify-otp
   */
  static async verifyPinOTP(otp) {
    try {
      const response = await apiClient.post("/pin/verify-otp", { otp });
      return response.data;
    } catch (error) {
      const status = error.response?.status;
      const detail = error.response?.data?.detail;
      return {
        success: false,
        message:
          status && status < 500 && detail
            ? detail
            : "OTP verification failed. Please try again.",
      };
    }
  }

  // ========== MPIN MANAGEMENT ==========

  /**
   * Reset MPIN with a new PIN.
   * PUT /profile/mpin
   */
  static async updateMPIN(mpinData) {
    try {
      const response = await apiClient.put("/profile/mpin", {
        new_pin: mpinData.new_pin,
        confirm_pin: mpinData.confirm_pin,
        otp: mpinData.otp,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating MPIN:", error);
      const status = error.response?.status;
      const detail = error.response?.data?.detail;
      return {
        success: false,
        message:
          status && status < 500 && detail
            ? detail
            : "Failed to update PIN. Please try again.",
      };
    }
  }

  // ========== BANK DETAILS ==========

  /**
   * Get user's bank details
   */
  static async getBankDetails() {
    try {
      const response = await apiClient.get("/profile/bank-details");
      return response.data;
    } catch (error) {
      console.error("Error fetching bank details:", error);
      throw error;
    }
  }

  /**
   * Update user's bank details
   */
  static async updateBankDetails(bankData) {
    try {
      const response = await apiClient.put("/profile/bank-details", {
        ...bankData,
        security_pin: `${bankData.securityPin}`,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating bank details:", error);
      return {
        success: false,
        message:
          error.response?.data?.detail ||
          error.message ||
          "Failed to update bank details",
      };
    }
  }

  // ========== PROFILE STATUS ==========

  /**
   * Get profile status and available sections
   */
  static async getProfileStatus() {
    try {
      const response = await apiClient.get("/profile/status");
      return response.data;
    } catch (error) {
      console.error("Error fetching profile status:", error);
      throw error;
    }
  }

  // ========== DISABLED SECTIONS ==========

  /**
   * Get KYC details
   */
  static async getKYCDetails() {
    try {
      const response = await apiClient.get("/profile/kyc-details");
      return response.data;
    } catch (error) {
      console.error("Error fetching KYC details:", error);
      throw error;
    }
  }

  /**
   * Update KYC details
   */
  static async updateKYCDetails(data) {
    try {
      const response = await apiClient.put("/profile/kyc-details", data);
      return response.data;
    } catch (error) {
      console.error("Error updating KYC details:", error);
      return {
        success: false,
        message:
          error.response?.data?.detail ||
          error.message ||
          "Failed to update KYC details",
      };
    }
  }

  // ========== CERTIFICATE MANAGER ==========

  /**
   * Get certificate manager details
   */
  static async getCertificateManager() {
    try {
      const response = await apiClient.get("/profile/certificate-manager");
      return response.data;
    } catch (error) {
      console.error("Error fetching certificate manager:", error);
      throw error;
    }
  }

  /**
   * Update certificate manager
   */
  static async updateCertificateManager(data) {
    try {
      const response = await apiClient.put("/profile/certificate-manager", data);
      return response.data;
    } catch (error) {
      console.error("Error updating certificate manager:", error);
      return {
        success: false,
        message:
          error.response?.data?.detail ||
          error.message ||
          "Failed to update certificate details",
      };
    }
  }

  // ========== ROLE MANAGER ==========

  /**
   * Get role manager details
   */
  static async getRoleManager() {
    try {
      const response = await apiClient.get("/profile/role-manager");
      return response.data;
    } catch (error) {
      console.error("Error fetching role manager:", error);
      throw error;
    }
  }

  /**
   * Update role manager
   */
  static async updateRoleManager(data) {
    try {
      const response = await apiClient.put("/profile/role-manager", data);
      return response.data;
    } catch (error) {
      console.error("Error updating role manager:", error);
      return {
        success: false,
        message:
          error.response?.data?.detail ||
          error.message ||
          "Failed to update role",
      };
    }
  }

  // ========== MAPPING MANAGER ==========

  /**
   * Get mapping manager details
   */
  static async getMappingManager() {
    try {
      const response = await apiClient.get("/profile/mapping-manager");
      return response.data;
    } catch (error) {
      console.error("Error fetching mapping manager:", error);
      throw error;
    }
  }

  /**
   * Update mapping manager
   */
  static async updateMappingManager(data) {
    try {
      const response = await apiClient.put("/profile/mapping-manager", data);
      return response.data;
    } catch (error) {
      console.error("Error updating mapping manager:", error);
      return {
        success: false,
        message:
          error.response?.data?.detail ||
          error.message ||
          "Failed to update mapping",
      };
    }
  }

  // ========== UTILITY METHODS ==========

  /**
   * Format profile data for frontend display
   */
  static formatProfileData(profileData) {
    return {
      name: profileData.name || "",
      mobile: profileData.mobile || "",
      email: profileData.email || "",
      state: profileData.state || "",
      city: profileData.city || "",
      gender: profileData.gender || "",
      pinCode: profileData.pinCode || "",
      address: profileData.address || "",
      profile_photo: profileData.profile_photo || null,
    };
  }

  /**
   * Validate profile data before sending to API
   */
  static validateProfileData(profileData) {
    const errors = {};

    if (profileData.name && profileData.name.length < 2) {
      errors.name = "Name must be at least 2 characters long";
    }

    if (profileData.mobile && !/^[6-9]\d{9}$/.test(profileData.mobile)) {
      errors.mobile = "Please enter a valid 10-digit mobile number";
    }

    if (
      profileData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)
    ) {
      errors.email = "Please enter a valid email address";
    }

    if (profileData.pinCode && !/^\d{6}$/.test(profileData.pinCode)) {
      errors.pinCode = "PIN code must be exactly 6 digits";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Validate password data
   */
  static validatePasswordData(passwordData) {
    const errors = {};

    if (!passwordData.current_password) {
      errors.current_password = "Current password is required";
    }

    if (!passwordData.new_password || passwordData.new_password.length < 8) {
      errors.new_password = "New password must be at least 8 characters long";
    } else {
      if (!/[A-Z]/.test(passwordData.new_password)) {
        errors.new_password = "Password must contain at least one uppercase letter";
      } else if (!/[a-z]/.test(passwordData.new_password)) {
        errors.new_password = "Password must contain at least one lowercase letter";
      } else if (!/\d/.test(passwordData.new_password)) {
        errors.new_password = "Password must contain at least one digit";
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(passwordData.new_password)) {
        errors.new_password = "Password must contain at least one special character";
      }
    }

    if (!passwordData.confirm_password) {
      errors.confirm_password = "Confirm password is required";
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      errors.confirm_password = "Passwords do not match";
    }

    if (!passwordData.security_pin) {
      errors.security_pin = "Security PIN is required";
    } else if (!/^\d{4,6}$/.test(passwordData.security_pin)) {
      errors.security_pin = "Security PIN must be 4-6 digits";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Validate MPIN data
   */
  static validateMPINData(mpinData) {
    const errors = {};

    if (!mpinData.new_pin || !/^\d{4,6}$/.test(mpinData.new_pin)) {
      errors.new_pin = "PIN must be 4–6 numeric digits";
    }

    if (mpinData.new_pin !== mpinData.confirm_pin) {
      errors.confirm_pin = "PINs do not match";
    }

    if (!mpinData.otp || !/^\d{6}$/.test(mpinData.otp)) {
      errors.otp = "OTP must be exactly 6 digits";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Validate bank details data
   */
  static validateBankData(bankData, userRole = null) {
    const errors = {};
    const isSuperAdmin = userRole === "SuperAdmin";

    if (bankData.accountNumber && !/^\d{9,18}$/.test(bankData.accountNumber)) {
      errors.accountNumber = "Account number must be 9-18 digits";
    }

    if (
      bankData.ifscCode &&
      !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bankData.ifscCode)
    ) {
      errors.ifscCode = "Invalid IFSC code format (e.g., SBIN0001234)";
    }

    if (!bankData.securityPin) {
      errors.securityPin = "Security PIN is required";
    } else if (!/^\d{4,6}$/.test(String(bankData.securityPin))) {
      errors.securityPin = "Security PIN must be 4-6 digits";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}

export default ProfileManagementService;
