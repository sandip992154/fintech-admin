/**
 * Custom hook for profile management
 * Handles all profile-related state and API interactions
 */

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import ProfileManagementService from "../services/profileManagementService";

export const useProfileManagement = () => {
  // State management
  const [profileData, setProfileData] = useState(null);
  const [bankDetails, setBankDetails] = useState(null);
  const [kycDetails, setKycDetails] = useState(null);
  const [certificateData, setCertificateData] = useState(null);
  const [roleData, setRoleData] = useState(null);
  const [mappingData, setMappingData] = useState(null);
  const [profileStatus, setProfileStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);

  const { user } = useAuth();

  // ========== PROFILE DETAILS ==========

  /**
   * Fetch profile details from API
   */
  const fetchProfileDetails = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const response = await ProfileManagementService.getProfileDetails();
      if (response.success) {
        setProfileData(response.data);
      } else {
        throw new Error(response.message || "Failed to fetch profile details");
      }
    } catch (err) {
      console.error("Error fetching profile details:", err);
      setError(err.message || "Failed to load profile details");

      // Set default data structure if API fails
      setProfileData({
        name: user.name || "",
        mobile: user.mobile || "",
        email: user.email || "",
        state: "",
        city: "",
        gender: "",
        pinCode: "",
        address: "",
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Update profile details
   */
  const updateProfileDetails = async (data) => {
    setSaveLoading(true);
    setError(null);

    try {
      console.log("Updating profile with data:", data);

      // Validate data before sending
      const validation = ProfileManagementService.validateProfileData(data);
      if (!validation.isValid) {
        console.error("Validation failed:", validation.errors);
        throw new Error(Object.values(validation.errors)[0]);
      }

      const response = await ProfileManagementService.updateProfileDetails(
        data
      );

      console.log("Profile update response:", response);

      if (response.success) {
        setProfileData((prev) => ({ ...prev, ...data }));
        return {
          success: true,
          message: response.message || "Profile updated successfully!",
        };
      } else {
        throw new Error(response.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setSaveLoading(false);
    }
  };

  // ========== BANK DETAILS ==========

  /**
   * Fetch bank details from API
   */
  const fetchBankDetails = useCallback(async () => {
    if (!user) return;

    try {
      const response = await ProfileManagementService.getBankDetails();
      if (response.success) {
        setBankDetails(response.data);
      } else {
        // Set empty structure if no bank details found
        setBankDetails({
          accountNumber: "",
          bankName: "",
          ifscCode: "",
          accountHolderName: "",
        });
      }
    } catch (err) {
      console.error("Error fetching bank details:", err);
      setBankDetails({
        accountNumber: "",
        bankName: "",
        ifscCode: "",
        accountHolderName: "",
      });
    }
  }, [user]);

  /**
   * Update bank details
   */
  const updateBankDetails = async (data) => {
    setSaveLoading(true);
    setError(null);

    try {
      // Validate data before sending
      const validation = ProfileManagementService.validateBankData(
        data,
        user?.role
      );
      if (!validation.isValid) {
        throw new Error(Object.values(validation.errors)[0]);
      }

      const response = await ProfileManagementService.updateBankDetails(data);
      if (response.success) {
        setBankDetails((prev) => ({ ...prev, ...data }));
        return {
          success: true,
          message: response.message || "Bank details updated successfully!",
        };
      } else {
        throw new Error(response.message || "Failed to update bank details");
      }
    } catch (err) {
      console.error("Error updating bank details:", err);
      const message =
        err.response?.data?.detail || err.message || "Failed to update bank details";
      setError(message);
      return { success: false, message };
    } finally {
      setSaveLoading(false);
    }
  };

  // ========== PASSWORD MANAGEMENT ==========

  /**
   * Update password
   */
  const updatePassword = async (data) => {
    setSaveLoading(true);
    setError(null);

    try {
      // Validate data before sending
      const validation = ProfileManagementService.validatePasswordData(data);
      if (!validation.isValid) {
        throw new Error(Object.values(validation.errors)[0]);
      }

      const response = await ProfileManagementService.updatePassword(data);
      if (response.success) {
        return {
          success: true,
          message: response.message || "Password updated successfully!",
        };
      } else {
        throw new Error(response.message || "Failed to update password");
      }
    } catch (err) {
      console.error("Error updating password:", err);
      const message =
        err.response?.data?.detail || err.message || "Failed to update password";
      setError(message);
      return { success: false, message };
    } finally {
      setSaveLoading(false);
    }
  };

  // ========== MPIN MANAGEMENT ==========

  /**
   * Update MPIN
   */
  const updateMPIN = async (data) => {
    setSaveLoading(true);
    setError(null);

    try {
      // Validate PIN data including OTP
      const validation = ProfileManagementService.validateMPINData(data);
      if (!validation.isValid) {
        throw new Error(Object.values(validation.errors)[0]);
      }

      const response = await ProfileManagementService.updateMPIN(data);
      // Backend returns { message: "..." } on success
      if (response.message && response.success !== false) {
        return {
          success: true,
          message: response.message,
        };
      } else {
        throw new Error(response.message || "Failed to reset PIN");
      }
    } catch (err) {
      console.error("Error resetting PIN:", err);
      const message =
        err.response?.data?.detail || err.message || "Failed to reset PIN";
      setError(message);
      return { success: false, message };
    } finally {
      setSaveLoading(false);
    }
  };

  // ========== PROFILE STATUS ==========

  /**
   * Fetch profile status and available sections
   */
  const fetchProfileStatus = useCallback(async () => {
    if (!user) return;

    try {
      const response = await ProfileManagementService.getProfileStatus();
      if (response.success) {
        setProfileStatus(response.data);
      }
    } catch (err) {
      console.error("Error fetching profile status:", err);
      // Set default status for Admin
      setProfileStatus({
        user_tier: "Admin",
        available_sections: {
          profile_details: true,
          password_manager: true,
          pin_manager: true,
          bank_details: true,
          certificate_manager: true,
          role_manager: true,
          mapping_manager: true,
          kyc_details: true,
        },
      });
    }
  }, [user]);

  // ========== KYC DETAILS ==========

  const fetchKYCDetails = useCallback(async () => {
    if (!user) return;
    try {
      const response = await ProfileManagementService.getKYCDetails();
      if (response.success) {
        setKycDetails(response.data);
      }
    } catch (err) {
      console.error("Error fetching KYC details:", err);
      setKycDetails({ shop_name: "", gst_number: "", aadhar_number: "", pan_number: "" });
    }
  }, [user]);

  const updateKYCDetails = async (data) => {
    setSaveLoading(true);
    setError(null);
    try {
      const response = await ProfileManagementService.updateKYCDetails(data);
      if (response.success) {
        setKycDetails((prev) => ({ ...prev, ...data }));
        return { success: true, message: response.message || "KYC details updated successfully!" };
      } else {
        throw new Error(response.message || "Failed to update KYC details");
      }
    } catch (err) {
      const message = err.response?.data?.detail || err.message || "Failed to update KYC details";
      setError(message);
      return { success: false, message };
    } finally {
      setSaveLoading(false);
    }
  };

  // ========== CERTIFICATE MANAGER ==========

  const fetchCertificateManager = useCallback(async () => {
    if (!user) return;
    try {
      const response = await ProfileManagementService.getCertificateManager();
      if (response.success) {
        setCertificateData(response.data);
      }
    } catch (err) {
      console.error("Error fetching certificate data:", err);
      setCertificateData({ cmo: "", coo: "" });
    }
  }, [user]);

  const updateCertificateManager = async (data) => {
    setSaveLoading(true);
    setError(null);
    try {
      const response = await ProfileManagementService.updateCertificateManager(data);
      if (response.success) {
        setCertificateData((prev) => ({ ...prev, ...data }));
        return { success: true, message: response.message || "Certificate details updated successfully!" };
      } else {
        throw new Error(response.message || "Failed to update certificate details");
      }
    } catch (err) {
      const message = err.response?.data?.detail || err.message || "Failed to update certificate details";
      setError(message);
      return { success: false, message };
    } finally {
      setSaveLoading(false);
    }
  };

  // ========== ROLE MANAGER ==========

  const fetchRoleManager = useCallback(async () => {
    if (!user) return;
    try {
      const response = await ProfileManagementService.getRoleManager();
      if (response.success) {
        setRoleData(response.data);
      }
    } catch (err) {
      console.error("Error fetching role data:", err);
      setRoleData({ member_role: "" });
    }
  }, [user]);

  const updateRoleManager = async (data) => {
    setSaveLoading(true);
    setError(null);
    try {
      const response = await ProfileManagementService.updateRoleManager(data);
      if (response.success) {
        setRoleData((prev) => ({ ...prev, ...data }));
        return { success: true, message: response.message || "Role updated successfully!" };
      } else {
        throw new Error(response.message || "Failed to update role");
      }
    } catch (err) {
      const message = err.response?.data?.detail || err.message || "Failed to update role";
      setError(message);
      return { success: false, message };
    } finally {
      setSaveLoading(false);
    }
  };

  // ========== MAPPING MANAGER ==========

  const fetchMappingManager = useCallback(async () => {
    if (!user) return;
    try {
      const response = await ProfileManagementService.getMappingManager();
      if (response.success) {
        setMappingData(response.data);
      }
    } catch (err) {
      console.error("Error fetching mapping data:", err);
      setMappingData({ parent_member: "" });
    }
  }, [user]);

  const updateMappingManager = async (data) => {
    setSaveLoading(true);
    setError(null);
    try {
      const response = await ProfileManagementService.updateMappingManager(data);
      if (response.success) {
        setMappingData((prev) => ({ ...prev, ...data }));
        return { success: true, message: response.message || "Mapping updated successfully!" };
      } else {
        throw new Error(response.message || "Failed to update mapping");
      }
    } catch (err) {
      const message = err.response?.data?.detail || err.message || "Failed to update mapping";
      setError(message);
      return { success: false, message };
    } finally {
      setSaveLoading(false);
    }
  };

  /**
   * Check if a section is available for current user
   */
  const isSectionAvailable = (sectionName) => {
    if (!profileStatus) return true; // Default to available if status not loaded
    return profileStatus.available_sections?.[sectionName] !== false;
  };

  // ========== INITIALIZATION ==========

  /**
   * Initialize all profile data
   */
  const initializeProfile = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      await Promise.all([
        fetchProfileDetails(),
        fetchBankDetails(),
        fetchProfileStatus(),
        fetchKYCDetails(),
        fetchCertificateManager(),
        fetchRoleManager(),
        fetchMappingManager(),
      ]);
    } catch (err) {
      console.error("Error initializing profile:", err);
    } finally {
      setLoading(false);
    }
  }, [user, fetchProfileDetails, fetchBankDetails, fetchProfileStatus, fetchKYCDetails, fetchCertificateManager, fetchRoleManager, fetchMappingManager]);

  // Initialize on component mount or user change
  useEffect(() => {
    initializeProfile();
  }, [initializeProfile]);

  // ========== UTILITY METHODS ==========

  /**
   * Clear error state
   */
  const clearError = () => {
    setError(null);
  };

  /**
   * Refresh all data
   */
  const refreshProfile = async () => {
    await initializeProfile();
  };

  /**
   * Get formatted profile data for forms
   */
  const getFormattedProfileData = () => {
    if (!profileData) return {};
    return ProfileManagementService.formatProfileData(profileData);
  };

  return {
    // State
    profileData,
    bankDetails,
    kycDetails,
    certificateData,
    roleData,
    mappingData,
    profileStatus,
    loading,
    error,
    saveLoading,

    // Actions
    updateProfileDetails,
    updateBankDetails,
    updatePassword,
    updateMPIN,
    updateKYCDetails,
    updateCertificateManager,
    updateRoleManager,
    updateMappingManager,
    refreshProfile,
    clearError,

    // Utilities
    isSectionAvailable,
    getFormattedProfileData,
  };
};
