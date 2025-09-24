/**
 * API service for enhanced user management endpoints
 */
import apiClient from "./apiClient.js";

class UserManagementService {
  // ===== User Profile Management =====

  /**
   * Get user profile by ID
   */
  async getUserProfile(userId) {
    try {
      const response = await apiClient.request(
        `/api/v1/user-management/profile/${userId}`,
        {
          method: "GET",
        }
      );
      return response;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(userId, profileData) {
    try {
      const response = await apiClient.request(
        `/api/v1/user-management/profile/${userId}`,
        {
          method: "PUT",
          body: JSON.stringify(profileData),
        }
      );
      return response;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  }

  // ===== Member Management =====

  /**
   * Create new member under current user
   */
  async createMember(memberData) {
    try {
      const response = await apiClient.request(
        "/api/v1/user-management/create-member",
        {
          method: "POST",
          body: JSON.stringify(memberData),
        }
      );
      return response;
    } catch (error) {
      console.error("Error creating member:", error);
      throw error;
    }
  }

  /**
   * Get members list with pagination and filters
   */
  async getMembers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    try {
      const response = await apiClient.request(
        `/api/v1/user-management/members?${queryString}`,
        {
          method: "GET",
        }
      );
      return response;
    } catch (error) {
      console.error("Error fetching members:", error);
      throw error;
    }
  }

  /**
   * Update member status (activate/deactivate)
   */
  async updateMemberStatus(userId, isActive) {
    try {
      const response = await apiClient.request(
        `/api/v1/user-management/member/${userId}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ is_active: isActive }),
        }
      );
      return response;
    } catch (error) {
      console.error("Error updating member status:", error);
      throw error;
    }
  }

  /**
   * Delete member
   */
  async deleteMember(userId) {
    try {
      const response = await apiClient.request(
        `/api/v1/user-management/member/${userId}`,
        {
          method: "DELETE",
        }
      );
      return response;
    } catch (error) {
      console.error("Error deleting member:", error);
      throw error;
    }
  }

  // ===== Member Statistics =====

  /**
   * Get member statistics and analytics
   */
  async getMemberStats() {
    try {
      const response = await apiClient.request(
        "/api/v1/user-management/stats",
        {
          method: "GET",
        }
      );
      return response;
    } catch (error) {
      console.error("Error fetching member stats:", error);
      throw error;
    }
  }

  /**
   * Get member hierarchy tree
   */
  async getMemberHierarchy() {
    try {
      const response = await apiClient.request(
        "/api/v1/user-management/hierarchy",
        {
          method: "GET",
        }
      );
      return response;
    } catch (error) {
      console.error("Error fetching member hierarchy:", error);
      throw error;
    }
  }
}

export default new UserManagementService();
