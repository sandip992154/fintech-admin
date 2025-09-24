/**
 * API service for KYC management endpoints
 */
import apiClient from "./apiClient.js";

class KYCManagementService {
  // ===== KYC Document Submission =====

  /**
   * Submit KYC documents
   */
  async submitKYCDocuments(kycData) {
    try {
      const formData = new FormData();

      // Add text fields
      Object.keys(kycData).forEach((key) => {
        if (key !== "documents" && kycData[key]) {
          formData.append(key, kycData[key]);
        }
      });

      // Add file uploads
      if (kycData.documents) {
        Object.keys(kycData.documents).forEach((docType) => {
          if (kycData.documents[docType]) {
            formData.append(
              `documents[${docType}]`,
              kycData.documents[docType]
            );
          }
        });
      }

      const response = await apiClient.request("/api/v1/kyc/submit", {
        method: "POST",
        body: formData,
        headers: {}, // Remove Content-Type to let browser set multipart boundary
      });
      return response;
    } catch (error) {
      console.error("Error submitting KYC documents:", error);
      throw error;
    }
  }

  /**
   * Get user's KYC status and documents
   */
  async getKYCStatus(userId = null) {
    const endpoint = userId
      ? `/api/v1/kyc/status/${userId}`
      : "/api/v1/kyc/status";
    try {
      const response = await apiClient.request(endpoint, {
        method: "GET",
      });
      return response;
    } catch (error) {
      console.error("Error fetching KYC status:", error);
      throw error;
    }
  }

  // ===== KYC Review (Super Admin Only) =====

  /**
   * Get pending KYC applications for review
   */
  async getPendingKYCApplications(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    try {
      const response = await apiClient.request(
        `/api/v1/kyc/pending?${queryString}`,
        {
          method: "GET",
        }
      );
      return response;
    } catch (error) {
      console.error("Error fetching pending KYC applications:", error);
      throw error;
    }
  }

  /**
   * Get specific KYC application details
   */
  async getKYCApplicationDetails(userId) {
    try {
      const response = await apiClient.request(`/api/v1/kyc/review/${userId}`, {
        method: "GET",
      });
      return response;
    } catch (error) {
      console.error("Error fetching KYC application details:", error);
      throw error;
    }
  }

  /**
   * Approve KYC application
   */
  async approveKYC(userId, comments = "") {
    try {
      const response = await apiClient.request(
        `/api/v1/kyc/approve/${userId}`,
        {
          method: "POST",
          body: JSON.stringify({ comments }),
        }
      );
      return response;
    } catch (error) {
      console.error("Error approving KYC:", error);
      throw error;
    }
  }

  /**
   * Reject KYC application
   */
  async rejectKYC(userId, reason) {
    try {
      const response = await apiClient.request(`/api/v1/kyc/reject/${userId}`, {
        method: "POST",
        body: JSON.stringify({ reason }),
      });
      return response;
    } catch (error) {
      console.error("Error rejecting KYC:", error);
      throw error;
    }
  }

  // ===== KYC Statistics =====

  /**
   * Get KYC statistics and analytics
   */
  async getKYCStats() {
    try {
      const response = await apiClient.request("/api/v1/kyc/stats", {
        method: "GET",
      });
      return response;
    } catch (error) {
      console.error("Error fetching KYC stats:", error);
      throw error;
    }
  }

  /**
   * Get KYC applications history
   */
  async getKYCHistory(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    try {
      const response = await apiClient.request(
        `/api/v1/kyc/history?${queryString}`,
        {
          method: "GET",
        }
      );
      return response;
    } catch (error) {
      console.error("Error fetching KYC history:", error);
      throw error;
    }
  }

  /**
   * Get all KYC applications (alias for getPendingKYCApplications)
   */
  async getKYCApplications(params = {}) {
    return this.getPendingKYCApplications(params);
  }
}

export default new KYCManagementService();
