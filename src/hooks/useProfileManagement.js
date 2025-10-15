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
      setError(err.message);
      return { success: false, message: err.message };
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
      setError(err.message);
      return { success: false, message: err.message };
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
      // Validate data before sending
      const validation = ProfileManagementService.validateMPINData(data);
      if (!validation.isValid) {
        throw new Error(Object.values(validation.errors)[0]);
      }

      const response = await ProfileManagementService.updateMPIN(data);
      if (response.success) {
        return {
          success: true,
          message: response.message || "MPIN updated successfully!",
        };
      } else {
        throw new Error(response.message || "Failed to update MPIN");
      }
    } catch (err) {
      console.error("Error updating MPIN:", err);
      setError(err.message);
      return { success: false, message: err.message };
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
      // Set default status for SuperAdmin
      setProfileStatus({
        user_tier: "SuperAdmin",
        available_sections: {
          profile_details: true,
          password_manager: true,
          pin_manager: true,
          bank_details: true,
          certificate_manager: true,
          role_manager: true,
          mapping_manager: true,
          kyc_details: false, // Not available for SuperAdmin
        },
      });
    }
  }, [user]);

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
      ]);
    } catch (err) {
      console.error("Error initializing profile:", err);
    } finally {
      setLoading(false);
    }
  }, [user, fetchProfileDetails, fetchBankDetails, fetchProfileStatus]);

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
    profileStatus,
    loading,
    error,
    saveLoading,

    // Actions
    updateProfileDetails,
    updateBankDetails,
    updatePassword,
    updateMPIN,
    refreshProfile,
    clearError,

    // Utilities
    isSectionAvailable,
    getFormattedProfileData,
  };
};
