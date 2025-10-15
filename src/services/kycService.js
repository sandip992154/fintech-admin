import apiClient from "./apiClient";

class WhitelabelKYCService {
  constructor() {
    this.baseURL = "kyc";
  }

  // Submit KYC application
  async submitKYC(kycData) {
    const response = await apiClient.post(
      `${this.baseURL}/submit-form`,
      kycData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  }

  // Get current user's KYC status
  async getKYCStatus() {
    const response = await apiClient.get(`${this.baseURL}/status`);
    return response;
  }

  // Upload additional document
  async uploadDocument(documentType, file) {
    const formData = new FormData();
    formData.append("document", file);
    formData.append("document_type", documentType);

    const response = await apiClient.post(
      `${this.baseURL}/upload-document`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  }

  // Update KYC information
  async updateKYC(updateData) {
    const response = await apiClient.put(`${this.baseURL}/update`, updateData);
    return response;
  }

  // Get KYC application details
  async getKYCDetails() {
    const response = await apiClient.get(`${this.baseURL}/details`);
    return response;
  }

  // Delete KYC application (if in draft/rejected status)
  async deleteKYC() {
    const response = await apiClient.delete(`${this.baseURL}/delete`);
    return response;
  }

  // Resubmit KYC after rejection
  async resubmitKYC(kycData) {
    const response = await apiClient.post(`${this.baseURL}/resubmit`, kycData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  }

  // Get list of required documents based on user role
  async getRequiredDocuments() {
    const response = await apiClient.get(`${this.baseURL}/required-documents`);
    return response;
  }

  // Check if KYC is mandatory for current user
  async checkKYCRequirement() {
    const response = await apiClient.get(`${this.baseURL}/requirement`);
    return response;
  }

  // Get KYC applications for whitelabel users (if they manage sub-users)
  async getManagedKYCApplications(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await apiClient.get(
      `${this.baseURL}/managed-applications?${queryParams}`
    );
    return response;
  }

  // Approve KYC application (for whitelabel admin features)
  async approveKYC(applicationId, approvalData) {
    const response = await apiClient.post(
      `${this.baseURL}/approve/${applicationId}`,
      approvalData
    );
    return response;
  }

  // Reject KYC application (for whitelabel admin features)
  async rejectKYC(applicationId, rejectionData) {
    const response = await apiClient.post(
      `${this.baseURL}/reject/${applicationId}`,
      rejectionData
    );
    return response;
  }
}

export default new WhitelabelKYCService();
