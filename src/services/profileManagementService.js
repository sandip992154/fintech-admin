/**
 * Profile Management Service for SuperAdmin
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
      const response = await apiClient.get("/api/v1/profile/details");
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
        "/api/v1/profile/details",
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
      const response = await apiClient.put(
        "/api/v1/profile/password",
        passwordData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating password:", error);
      throw error;
    }
  }

  // ========== MPIN MANAGEMENT ==========

  /**
   * Update user's MPIN
   */
  static async updateMPIN(mpinData) {
    try {
      const response = await apiClient.put("/api/v1/profile/mpin", mpinData);
      return response.data;
    } catch (error) {
      console.error("Error updating MPIN:", error);
      throw error;
    }
  }

  // ========== BANK DETAILS ==========

  /**
   * Get user's bank details
   */
  static async getBankDetails() {
    try {
      const response = await apiClient.get("/api/v1/profile/bank-details");
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
      const response = await apiClient.put("/api/v1/profile/bank-details", {
        ...bankData,
        security_pin: `${bankData.securityPin}`,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating bank details:", error);
      throw error;
    }
  }

  // ========== PROFILE STATUS ==========

  /**
   * Get profile status and available sections
   */
  static async getProfileStatus() {
    try {
      const response = await apiClient.get("/api/v1/profile/status");
      return response.data;
    } catch (error) {
      console.error("Error fetching profile status:", error);
      throw error;
    }
  }

  // ========== DISABLED SECTIONS ==========

  /**
   * Get KYC details (for non-superadmin users)
   */
  static async getKYCDetails() {
    try {
      const response = await apiClient.get("/api/v1/profile/kyc-details");
      return response.data;
    } catch (error) {
      console.error("Error fetching KYC details:", error);
      throw error;
    }
  }

  /**
   * Check if section is available for current user
   */
  static async checkSectionAvailability(sectionName) {
    try {
      const status = await this.getProfileStatus();
      return status.data?.available_sections?.[sectionName] || false;
    } catch (error) {
      console.error("Error checking section availability:", error);
      return false;
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

    if (!passwordData.new_password || passwordData.new_password.length < 6) {
      errors.new_password = "New password must be at least 6 characters long";
    }

    if (!passwordData.confirm_password) {
      errors.confirm_password = "Confirm password is required";
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      errors.confirm_password = "Passwords do not match";
    }

    // Validate security PIN
    if (!passwordData.security_pin) {
      errors.security_pin = "Security PIN is required";
    } else if (!/^\d{4}$/.test(passwordData.security_pin)) {
      errors.security_pin = "Security PIN must be exactly 4 digits";
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

    if (!mpinData.new_pin || !/^\d{4}$/.test(mpinData.new_pin)) {
      errors.new_pin = "PIN must be exactly 4 digits";
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

    // Security PIN is optional for SuperAdmin, required for others
    if (!isSuperAdmin) {
      if (!bankData.securityPin) {
        errors.securityPin = "Security PIN is required";
      } else {
        const pin = Number(bankData.securityPin);
        if (isNaN(pin) || pin < 1000 || pin > 9999) {
          errors.securityPin = "Security PIN must be exactly 4 digits";
        }
      }
    } else if (bankData.securityPin) {
      const pin = Number(bankData.securityPin);
      if (isNaN(pin) || pin < 1000 || pin > 9999) {
        errors.securityPin = "Security PIN must be exactly 4 digits";
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}

export default ProfileManagementService;
