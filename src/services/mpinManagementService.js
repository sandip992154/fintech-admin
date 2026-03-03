/**
 * API service for MPIN management endpoints
 */
import apiClient from "./apiClient.js";

class MPINManagementService {
  // ===== MPIN Setup =====

  /**
   * Setup new MPIN for user
   */
  async setupMPIN(mpinData) {
    try {
      const response = await apiClient.post("/mpin/setup", mpinData);
      return response.data;
    } catch (error) {
      console.error("Error setting up MPIN:", error);
      throw error;
    }
  }

  /**
   * Verify MPIN
   */
  async verifyMPIN(mpin) {
    try {
      const response = await apiClient.post("/mpin/verify", { mpin });
      return response.data;
    } catch (error) {
      console.error("Error verifying MPIN:", error);
      throw error;
    }
  }

  // ===== MPIN Management =====

  /**
   * Change existing MPIN
   */
  async changeMPIN(oldMpin, newMpin) {
    try {
      const response = await apiClient.post("/mpin/change", {
        old_mpin: oldMpin,
        new_mpin: newMpin,
      });
      return response.data;
    } catch (error) {
      console.error("Error changing MPIN:", error);
      throw error;
    }
  }

  /**
   * Get MPIN status
   */
  async getMPINStatus() {
    try {
      const response = await apiClient.get("/mpin/status");
      return response.data;
    } catch (error) {
      console.error("Error fetching MPIN status:", error);
      throw error;
    }
  }

  // ===== MPIN Reset =====

  /**
   * Request MPIN reset (sends OTP)
   */
  async requestMPINReset() {
    try {
      const response = await apiClient.post("/mpin/reset/request");
      return response.data;
    } catch (error) {
      console.error("Error requesting MPIN reset:", error);
      throw error;
    }
  }

  /**
   * Verify OTP for MPIN reset
   */
  async verifyResetOTP(otp) {
    try {
      const response = await apiClient.post("/mpin/reset/verify-otp", { otp });
      return response.data;
    } catch (error) {
      console.error("Error verifying reset OTP:", error);
      throw error;
    }
  }

  /**
   * Reset MPIN with new PIN
   */
  async resetMPIN(resetToken, newMpin) {
    try {
      const response = await apiClient.post("/mpin/reset/confirm", {
        reset_token: resetToken,
        new_mpin: newMpin,
      });
      return response.data;
    } catch (error) {
      console.error("Error resetting MPIN:", error);
      throw error;
    }
  }

  // ===== Admin Functions =====

  /**
   * Get MPIN statistics (Admin only)
   */
  async getMPINStats() {
    try {
      const response = await apiClient.get("/mpin/stats");
      return response.data;
    } catch (error) {
      console.error("Error fetching MPIN stats:", error);
      throw error;
    }
  }

  /**
   * Force reset user MPIN (Admin only)
   */
  async adminResetMPIN(userId) {
    try {
      const response = await apiClient.post(`/mpin/admin/reset/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error admin resetting MPIN:", error);
      throw error;
    }
  }

  /**
   * Unlock user MPIN (Admin only)
   */
  async unlockMPIN(userId) {
    try {
      const response = await apiClient.post(`/mpin/admin/unlock/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error unlocking MPIN:", error);
      throw error;
    }
  }
}

export default new MPINManagementService();
