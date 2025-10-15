import React, { useState, useEffect } from "react";
import {
  FiEye,
  FiCheck,
  FiX,
  FiDownload,
  FiSearch,
  FiFilter,
  FiUser,
  FiFileText,
  FiAlertCircle,
} from "react-icons/fi";
import KYCManagementService from "../services/kycManagementService";
import { authNotifications } from "../components/common/modernNotificationService";

const KYCManagement = () => {
  const [kycApplications, setKycApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  const [filters, setFilters] = useState({
    status: "all",
    search: "",
    role: "all",
  });

  const [approvalData, setApprovalData] = useState({
    admin_notes: "",
  });

  const [rejectionData, setRejectionData] = useState({
    rejection_reason: "",
    admin_notes: "",
  });

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  useEffect(() => {
    fetchKYCApplications();
  }, [filters]);

  const fetchKYCApplications = async () => {
    try {
      setLoading(true);
      const response = await KYCManagementService.getKYCApplications(filters);
      setKycApplications(response.data || []);

      // Calculate stats
      const stats = response.data.reduce(
        (acc, app) => {
          acc.total++;
          acc[app.status]++;
          return acc;
        },
        { total: 0, pending: 0, approved: 0, rejected: 0 }
      );

      setStats(stats);
    } catch (error) {
      console.error("Error fetching KYC applications:", error);
      authNotifications.error(
        "Failed to load KYC applications. Please refresh the page."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setShowDetailsModal(true);
  };

  const handleApprove = (application) => {
    setSelectedApplication(application);
    setShowApprovalModal(true);
  };

  const handleReject = (application) => {
    setSelectedApplication(application);
    setShowRejectionModal(true);
  };

  const submitApproval = async (e) => {
    e.preventDefault();

    try {
      setActionLoading(true);
      await KYCManagementService.approveKYC(
        selectedApplication.user.user_code,
        approvalData.admin_notes
      );

      setApprovalData({ admin_notes: "" });
      setShowApprovalModal(false);
      fetchKYCApplications(); // Refresh list
      authNotifications.success(
        `KYC application for ${selectedApplication.user.name} has been approved successfully!`
      );
    } catch (error) {
      console.error("Error approving KYC:", error);

      let errorMessage = "Failed to approve KYC application. Please try again.";
      if (error?.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      authNotifications.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const submitRejection = async (e) => {
    e.preventDefault();

    if (!rejectionData.rejection_reason.trim()) {
      authNotifications.error("Rejection reason is required");
      return;
    }

    try {
      setActionLoading(true);
      await KYCManagementService.rejectKYC(
        selectedApplication.user.user_code,
        rejectionData.rejection_reason
      );

      setRejectionData({ rejection_reason: "", admin_notes: "" });
      setShowRejectionModal(false);
      fetchKYCApplications(); // Refresh list
      authNotifications.success(
        `KYC application for ${selectedApplication.user.name} has been rejected. User will be notified.`
      );
    } catch (error) {
      console.error("Error rejecting KYC:", error);

      let errorMessage = "Failed to reject KYC application. Please try again.";
      if (error?.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      authNotifications.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const downloadDocument = async (applicationId, documentType) => {
    try {
      setActionLoading(true);
      const response = await KYCManagementService.downloadDocument(
        applicationId,
        documentType
      );

      // Create blob and download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${documentType}_${applicationId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      authNotifications.success(
        `${documentType} document downloaded successfully!`
      );
    } catch (error) {
      console.error("Error downloading document:", error);

      let errorMessage = "Failed to download document. Please try again.";
      if (error?.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      authNotifications.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "text-yellow-600 bg-yellow-100",
      approved: "text-green-600 bg-green-100",
      rejected: "text-red-600 bg-red-100",
      under_review: "text-blue-600 bg-blue-100",
    };
    return colors[status] || "text-gray-600 bg-gray-100";
  };

  const getRoleColor = (role) => {
    const colors = {
      whitelabel: "text-purple-600 bg-purple-100",
      mds: "text-blue-600 bg-blue-100",
      distributor: "text-green-600 bg-green-100",
      retailer: "text-orange-600 bg-orange-100",
      customer: "text-gray-600 bg-gray-100",
    };
    return colors[role] || "text-gray-600 bg-gray-100";
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          KYC Management
        </h1>
        <p className="text-gray-600">
          Review and approve user KYC applications
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <FiFileText className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Applications
              </p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <FiFileText className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Pending Review
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.pending}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <FiCheck className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.approved}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <FiX className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.rejected}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <FiSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              className="border border-gray-300 rounded-lg px-3 py-2 w-64 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <FiFilter className="text-gray-400" />
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="under_review">Under Review</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <FiUser className="text-gray-400" />
            <select
              value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="whitelabel">White Label</option>
              <option value="mds">Master Distributor</option>
              <option value="distributor">Distributor</option>
              <option value="retailer">Retailer</option>
              <option value="customer">Customer</option>
            </select>
          </div>
        </div>
      </div>

      {/* KYC Applications Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documents
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center">
                    Loading KYC applications...
                  </td>
                </tr>
              ) : kycApplications.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No KYC applications found
                  </td>
                </tr>
              ) : (
                kycApplications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {application.full_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {application.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {application.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(
                          application.user.user_code
                        )}`}
                      >
                        {application.user.user_code}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          application.status
                        )}`}
                      >
                        {application.status?.replace("_", " ").toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(application.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        {application.aadhar_card_url && (
                          <button
                            onClick={() =>
                              downloadDocument(application.id, "aadhar")
                            }
                            className="text-blue-600 hover:text-blue-800"
                            title="Download Aadhar Card"
                          >
                            <FiDownload /> Aadhar Card
                          </button>
                        )}
                        {application.pan_card_url && (
                          <button
                            onClick={() =>
                              downloadDocument(application.id, "pan")
                            }
                            className="text-green-600 hover:text-green-800"
                            title="Download PAN Card"
                          >
                            <FiDownload /> Pan Card
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDetails(application)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FiEye />
                        </button>
                        {application.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(application)}
                              className="text-green-600 hover:text-green-900"
                            >
                              <FiCheck />
                            </button>
                            <button
                              onClick={() => handleReject(application)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <FiX />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedApplication && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  KYC Application Details
                </h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Personal Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {selectedApplication.full_name}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {selectedApplication.email}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {selectedApplication.phone}
                    </p>
                    <p>
                      <span className="font-medium">Role:</span>{" "}
                      {selectedApplication.user_code}
                    </p>
                    <p>
                      <span className="font-medium">Date of Birth:</span>{" "}
                      {selectedApplication.date_of_birth}
                    </p>
                    <p>
                      <span className="font-medium">Gender:</span>{" "}
                      {selectedApplication.gender}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Address Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Address:</span>{" "}
                      {selectedApplication.address}
                    </p>
                    <p>
                      <span className="font-medium">City:</span>{" "}
                      {selectedApplication.city}
                    </p>
                    <p>
                      <span className="font-medium">State:</span>{" "}
                      {selectedApplication.state}
                    </p>
                    <p>
                      <span className="font-medium">PIN Code:</span>{" "}
                      {selectedApplication.pin_code}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Document Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Aadhar Number:</span>{" "}
                      {selectedApplication.aadhar_card_no}
                    </p>
                    <p>
                      <span className="font-medium">PAN Number:</span>{" "}
                      {selectedApplication.pan_card_no}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Application Status
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Status:</span>
                      <span
                        className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          selectedApplication.status
                        )}`}
                      >
                        {selectedApplication.status
                          ?.replace("_", " ")
                          .toUpperCase()}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">Submitted:</span>{" "}
                      {new Date(
                        selectedApplication.submitted_at
                      ).toLocaleString()}
                    </p>
                    {selectedApplication.admin_notes && (
                      <p>
                        <span className="font-medium">Admin Notes:</span>{" "}
                        {selectedApplication.admin_notes}
                      </p>
                    )}
                    {selectedApplication.rejection_reason && (
                      <p>
                        <span className="font-medium">Rejection Reason:</span>{" "}
                        {selectedApplication.rejection_reason}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && selectedApplication && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Approve KYC Application
                </h3>
                <button
                  onClick={() => setShowApprovalModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form onSubmit={submitApproval} className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-4">
                    Are you sure you want to approve the KYC application for{" "}
                    <strong>{selectedApplication.user_name}</strong>?
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Admin Notes (Optional)
                  </label>
                  <textarea
                    value={approvalData.admin_notes}
                    onChange={(e) =>
                      setApprovalData({
                        ...approvalData,
                        admin_notes: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Add any notes about this approval..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowApprovalModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Approve KYC
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && selectedApplication && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Reject KYC Application
                </h3>
                <button
                  onClick={() => setShowRejectionModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form onSubmit={submitRejection} className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-4">
                    Rejecting KYC application for{" "}
                    <strong>{selectedApplication.user_name}</strong>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rejection Reason *
                  </label>
                  <select
                    required
                    value={rejectionData.rejection_reason}
                    onChange={(e) =>
                      setRejectionData({
                        ...rejectionData,
                        rejection_reason: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select reason</option>
                    <option value="invalid_documents">Invalid Documents</option>
                    <option value="blurry_images">Blurry Images</option>
                    <option value="mismatch_information">
                      Information Mismatch
                    </option>
                    <option value="incomplete_application">
                      Incomplete Application
                    </option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Admin Notes
                  </label>
                  <textarea
                    value={rejectionData.admin_notes}
                    onChange={(e) =>
                      setRejectionData({
                        ...rejectionData,
                        admin_notes: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Provide details about why this application was rejected..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowRejectionModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Reject KYC
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KYCManagement;
