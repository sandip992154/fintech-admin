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
      const response = await apiClient.get(
        `/user-management/profile/${userId}`
      );
      return response.data;
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
      const response = await apiClient.put(
        `/user-management/profile/${userId}`,
        profileData
      );
      return response.data;
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
      const response = await apiClient.post(
        "/user-management/create-member",
        memberData
      );
      return response.data;
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
      const response = await apiClient.get(
        `/user-management/members?${queryString}`
      );
      return response.data;
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
      const response = await apiClient.patch(
        `/user-management/member/${userId}/status`,
        { is_active: isActive }
      );
      return response.data;
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
      const response = await apiClient.delete(
        `/user-management/member/${userId}`
      );
      return response.data;
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
      const response = await apiClient.get("/user-management/stats");
      return response.data;
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
      const response = await apiClient.get("/user-management/hierarchy");
      return response.data;
    } catch (error) {
      console.error("Error fetching member hierarchy:", error);
      throw error;
    }
  }
}

export default new UserManagementService();
