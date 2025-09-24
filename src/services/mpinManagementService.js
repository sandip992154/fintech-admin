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
      const response = await apiClient.request("/api/v1/mpin/setup", {
        method: "POST",
        body: JSON.stringify(mpinData),
      });
      return response;
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
      const response = await apiClient.request("/api/v1/mpin/verify", {
        method: "POST",
        body: JSON.stringify({ mpin }),
      });
      return response;
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
      const response = await apiClient.request("/api/v1/mpin/change", {
        method: "POST",
        body: JSON.stringify({
          old_mpin: oldMpin,
          new_mpin: newMpin,
        }),
      });
      return response;
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
      const response = await apiClient.request("/api/v1/mpin/status", {
        method: "GET",
      });
      return response;
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
      const response = await apiClient.request("/api/v1/mpin/reset/request", {
        method: "POST",
      });
      return response;
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
      const response = await apiClient.request(
        "/api/v1/mpin/reset/verify-otp",
        {
          method: "POST",
          body: JSON.stringify({ otp }),
        }
      );
      return response;
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
      const response = await apiClient.request("/api/v1/mpin/reset/confirm", {
        method: "POST",
        body: JSON.stringify({
          reset_token: resetToken,
          new_mpin: newMpin,
        }),
      });
      return response;
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
      const response = await apiClient.request("/api/v1/mpin/stats", {
        method: "GET",
      });
      return response;
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
      const response = await apiClient.request(
        `/api/v1/mpin/admin/reset/${userId}`,
        {
          method: "POST",
        }
      );
      return response;
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
      const response = await apiClient.request(
        `/api/v1/mpin/admin/unlock/${userId}`,
        {
          method: "POST",
        }
      );
      return response;
    } catch (error) {
      console.error("Error unlocking MPIN:", error);
      throw error;
    }
  }
}

export default new MPINManagementService();
