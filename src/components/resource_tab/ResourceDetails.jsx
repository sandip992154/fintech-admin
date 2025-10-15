/**
 * Resource Details Component - Admin Portal
 * ==========================================
 *
 * Component for displaying detailed information about a resource
 * including metadata, files, access levels, and history.
 * Adapted for admin portal with administrative controls.
 */

import React, { useState, useEffect } from "react";
import {
  FaFile,
  FaDownload,
  FaEdit,
  FaTrash,
  FaEye,
  FaClock,
  FaUser,
  FaTag,
  FaLink,
  FaShieldAlt,
} from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { authNotifications } from "../common/modernNotificationService";

const ResourceDetails = ({
  resource,
  onEdit = () => {},
  onDelete = () => {},
  canEdit = true,
  canDelete = true,
}) => {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (resource?.files) {
      setFiles(resource.files);
    }
  }, [resource]);

  const handleDownload = async (fileId, fileName) => {
    try {
      setLoading(true);
      // Implement file download logic here
      // const response = await resourceManagementService.downloadFile(fileId);
      authNotifications.success(`Downloading ${fileName}`);
    } catch (error) {
      console.error("Download error:", error);
      authNotifications.error("Failed to download file");
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (file) => {
    // Implement file preview logic
    window.open(file.url, "_blank");
  };

  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "archived":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getAccessLevelBadge = (level) => {
    const levels = {
      public: { color: "bg-green-100 text-green-800", icon: FaEye },
      internal: { color: "bg-blue-100 text-blue-800", icon: FaShieldAlt },
      restricted: { color: "bg-red-100 text-red-800", icon: FaShieldAlt },
      confidential: {
        color: "bg-purple-100 text-purple-800",
        icon: FaShieldAlt,
      },
    };

    const config = levels[level?.toLowerCase()] || levels["internal"];
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${config.color}`}
      >
        <IconComponent className="mr-1" />
        {level?.toUpperCase() || "INTERNAL"}
      </span>
    );
  };

  if (!resource) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">No resource selected</div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FaFile className="text-2xl" />
            <div>
              <h2 className="text-xl font-bold">{resource.name}</h2>
              <p className="text-blue-100">{resource.type || "Resource"}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(
                resource.status
              )}`}
            >
              {resource.status || "Active"}
            </span>
            {getAccessLevelBadge(resource.access_level)}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Basic Information
            </h3>

            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Description:
                </span>
                <p className="text-gray-900 dark:text-white mt-1">
                  {resource.description || "No description available"}
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <FaUser className="text-gray-500" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Created by: {resource.created_by || "Unknown"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaClock className="text-gray-500" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {resource.created_at
                      ? new Date(resource.created_at).toLocaleDateString()
                      : "Unknown date"}
                  </span>
                </div>
              </div>

              {resource.category && (
                <div className="flex items-center space-x-2">
                  <FaTag className="text-gray-500" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Category: {resource.category}
                  </span>
                </div>
              )}

              {resource.url && (
                <div className="flex items-center space-x-2">
                  <FaLink className="text-gray-500" />
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View Resource
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Metadata
            </h3>

            {resource.metadata && Object.keys(resource.metadata).length > 0 ? (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                  {JSON.stringify(resource.metadata, null, 2)}
                </pre>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No metadata available
              </p>
            )}
          </div>
        </div>

        {/* Files Section */}
        {files.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Attached Files ({files.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <FaFile className="text-blue-500" />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handlePreview(file)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Preview"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleDownload(file.id, file.name)}
                        className="text-green-600 hover:text-green-800"
                        title="Download"
                        disabled={loading}
                      >
                        {loading ? <ClipLoader size={12} /> : <FaDownload />}
                      </button>
                    </div>
                  </div>

                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {file.name}
                  </p>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {file.size
                      ? `${Math.round(file.size / 1024)} KB`
                      : "Unknown size"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-3">
          {canEdit && (
            <button
              onClick={() => onEdit(resource)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaEdit />
              <span>Edit</span>
            </button>
          )}

          {canDelete && (
            <button
              onClick={() => onDelete(resource)}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <FaTrash />
              <span>Delete</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourceDetails;
