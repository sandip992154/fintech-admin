import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import schemeManagementService from "../../../services/schemeManagementService";
import { SuperModal } from "../../utility/SuperModel";
import FilterBar from "../../utility/FilterBar";
import PaginatedTable from "../../utility/PaginatedTable";
import { ToggleButton } from "../../utility/ToggleButton";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaUpload,
  FaDownload,
} from "react-icons/fa";
import { ClipLoader } from "react-spinners";

// Validation schema for service operator form
const operatorSchema = yup.object().shape({
  name: yup
    .string()
    .required("Operator name is required")
    .min(2, "Operator name must be at least 2 characters"),
  service_type: yup.string().required("Service type is required"),
});

const ServiceOperatorForm = ({
  editingOperator,
  onOperatorUpdate,
  onClose,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const serviceTypes = schemeManagementService.getServiceTypes();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(operatorSchema),
    defaultValues: {
      name: editingOperator?.name || "",
      service_type: editingOperator?.service_type || "",
    },
  });

  useEffect(() => {
    if (editingOperator) {
      setValue("name", editingOperator.name);
      setValue("service_type", editingOperator.service_type);
    }
  }, [editingOperator, setValue]);

  const onSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      if (editingOperator) {
        await schemeManagementService.updateOperator(
          editingOperator.id,
          formData
        );
        toast.success("Operator updated successfully!");
      } else {
        await schemeManagementService.createOperator(formData);
        toast.success("Operator created successfully!");
      }

      if (onOperatorUpdate) {
        onOperatorUpdate();
      }

      reset();
      onClose();
    } catch (error) {
      console.error("Error saving operator:", error);
      toast.error(error.message || "Failed to save operator");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-4 text-lg font-semibold text-center">
        {editingOperator ? "Edit Service Operator" : "Add New Service Operator"}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Operator Name */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Operator Name *
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter operator name (e.g., Airtel, Jio)"
            {...register("name")}
            className={`w-full px-3 py-2 border ${
              errors.name ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-darkBlue dark:text-white dark:border-gray-600`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Service Type */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="service_type" className="text-sm font-medium">
            Service Type *
          </label>
          <select
            id="service_type"
            {...register("service_type")}
            className={`w-full px-3 py-2 border ${
              errors.service_type ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-darkBlue dark:text-white dark:border-gray-600`}
          >
            <option value="">Select Service Type</option>
            {serviceTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.service_type && (
            <p className="text-red-500 text-sm mt-1">
              {errors.service_type.message}
            </p>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md font-medium hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-md font-medium text-white ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {editingOperator ? "Updating..." : "Creating..."}
              </div>
            ) : editingOperator ? (
              "Update Operator"
            ) : (
              "Create Operator"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

const ServiceOperatorManager = () => {
  const [loading, setLoading] = useState(false);
  const [operators, setOperators] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [editingOperator, setEditingOperator] = useState(null);
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOperators, setTotalOperators] = useState(0);
  const [isModal, setIsModal] = useState({
    AddOperator: false,
    ViewOperator: false,
    BulkUpload: false,
  });

  const [filters, setFilters] = useState({
    searchValue: "",
    service_type: "",
    is_active: "",
  });

  const pageSize = 10;

  // Load operators data
  const loadOperators = async () => {
    try {
      setLoading(true);
      const params = {
        skip: (currentPage - 1) * pageSize,
        limit: pageSize,
        ...filters,
      };

      // Remove empty filters
      Object.keys(params).forEach((key) => {
        if (
          params[key] === "" ||
          params[key] === null ||
          params[key] === undefined
        ) {
          delete params[key];
        }
      });

      const response = await schemeManagementService.getServiceOperators(
        params
      );
      setOperators(response.items || response);
      setFilteredData(response.items || response);
      setTotalOperators(response.total || response.length);
    } catch (error) {
      console.error("Error loading operators:", error);
      toast.error("Failed to load operators");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOperators();
  }, [currentPage, filters]);

  // Generic input handler
  const handleInputChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Toggle operator status
  const handleToggle = async (operator, index) => {
    try {
      const updatedOperator = { ...operator, is_active: !operator.is_active };
      await schemeManagementService.updateOperator(operator.id, {
        name: operator.name,
        service_type: operator.service_type,
        is_active: updatedOperator.is_active,
      });

      // Update local state
      const updated = [...filteredData];
      updated[index] = updatedOperator;
      setFilteredData(updated);

      toast.success(
        `Operator ${
          updatedOperator.is_active ? "activated" : "deactivated"
        } successfully`
      );
    } catch (error) {
      console.error("Error toggling operator status:", error);
      toast.error("Failed to update operator status");
    }
  };

  // Delete operator
  const handleDelete = async (operator) => {
    if (window.confirm(`Are you sure you want to delete "${operator.name}"?`)) {
      try {
        await schemeManagementService.deleteOperator(operator.id);
        toast.success("Operator deleted successfully");
        loadOperators(); // Refresh data
      } catch (error) {
        console.error("Error deleting operator:", error);
        toast.error("Failed to delete operator");
      }
    }
  };

  // Modal handlers
  const openAddModal = () => {
    setEditingOperator(null);
    setIsModal((prev) => ({ ...prev, AddOperator: true }));
  };

  const openEditModal = (operator) => {
    setEditingOperator(operator);
    setIsModal((prev) => ({ ...prev, AddOperator: true }));
  };

  const openViewModal = (operator) => {
    setSelectedOperator(operator);
    setIsModal((prev) => ({ ...prev, ViewOperator: true }));
  };

  // Filter fields
  const filterFields = [
    {
      name: "searchValue",
      type: "text",
      placeholder: "Search operators...",
      value: filters.searchValue || "",
      onChange: (val) => handleInputChange("searchValue", val),
    },
    {
      name: "service_type",
      type: "select",
      placeholder: "Service Type",
      value: filters.service_type || "",
      onChange: (val) => handleInputChange("service_type", val),
      options: [
        { label: "All Types", value: "" },
        ...schemeManagementService.getServiceTypes(),
      ],
    },
    {
      name: "is_active",
      type: "select",
      placeholder: "Status",
      value: filters.is_active || "",
      onChange: (val) => handleInputChange("is_active", val),
      options: [
        { label: "All Status", value: "" },
        { label: "Active", value: "true" },
        { label: "Inactive", value: "false" },
      ],
    },
  ];

  // Table columns
  const columns = [
    {
      header: "ID",
      accessor: "id",
      render: (row) => `#${row.id}`,
    },
    {
      header: "Operator Name",
      accessor: "name",
      render: (row) => (
        <div className="font-medium text-gray-900 dark:text-white">
          {row.name}
        </div>
      ),
    },
    {
      header: "Service Type",
      accessor: "service_type",
      render: (row) => (
        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-200">
          {row.service_type?.replace("_", " ").toUpperCase()}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "is_active",
      render: (row, idx) => (
        <ToggleButton
          row={row}
          onchange={() => handleToggle(row, idx)}
          checked={row.is_active}
        />
      ),
    },
    {
      header: "Created",
      accessor: "created_at",
      render: (row) => {
        if (!row.created_at) return "N/A";
        return new Date(row.created_at).toLocaleDateString();
      },
    },
    {
      header: "Actions",
      accessor: "actions",
      render: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => openViewModal(row)}
            className="text-blue-600 hover:text-blue-800 p-1"
            title="View Details"
          >
            <FaEye />
          </button>
          <button
            onClick={() => openEditModal(row)}
            className="text-green-600 hover:text-green-800 p-1"
            title="Edit Operator"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="text-red-600 hover:text-red-800 p-1"
            title="Delete Operator"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="h-[90vh] 2xl:max-w-[80%] p-4 mx-8 bg-secondaryOne dark:bg-darkBlue/70 rounded-2xl 2xl:mx-auto text-gray-800 overflow-hidden overflow-y-auto px-4 pb-6 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
      {/* Header */}
      <div className="my-4 p-4 rounded-md bg-white dark:bg-transparent">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold dark:text-adminOffWhite">
              Service Operators
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Manage service operators for different service types
            </p>
          </div>

          {/* Stats Card */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center min-w-[80px]">
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {totalOperators}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Total Operators
            </div>
          </div>
        </div>

        <FilterBar fields={filterFields} onSearch={loadOperators} />
      </div>

      {/* Main Content */}
      <div className="p-6 rounded-md w-full bg-white dark:bg-transparent dark:text-white">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
              Service Operators
            </button>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() =>
                setIsModal((prev) => ({ ...prev, BulkUpload: true }))
              }
              className="bg-orange-500 hover:bg-orange-600 text-white btn-md flex items-center"
            >
              <FaUpload className="mr-2" />
              Bulk Upload
            </button>
            <button
              onClick={openAddModal}
              className="bg-[#22C55E] hover:bg-[#16a34a] text-white btn-md flex items-center"
            >
              <FaPlus className="mr-2" />
              Add Operator
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <ClipLoader color="#3B82F6" size={35} />
          </div>
        ) : (
          <PaginatedTable
            data={filteredData}
            columns={columns}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pageSize={pageSize}
            totalItems={totalOperators}
          />
        )}
      </div>

      {/* Add/Edit Operator Modal */}
      {isModal.AddOperator && (
        <SuperModal
          onClose={() => {
            setIsModal((prev) => ({ ...prev, AddOperator: false }));
            setEditingOperator(null);
          }}
        >
          <ServiceOperatorForm
            editingOperator={editingOperator}
            onOperatorUpdate={loadOperators}
            onClose={() => {
              setIsModal((prev) => ({ ...prev, AddOperator: false }));
              setEditingOperator(null);
            }}
          />
        </SuperModal>
      )}

      {/* View Operator Modal */}
      {isModal.ViewOperator && selectedOperator && (
        <SuperModal
          onClose={() => {
            setIsModal((prev) => ({ ...prev, ViewOperator: false }));
            setSelectedOperator(null);
          }}
        >
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Operator Details</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Name:
                </label>
                <p className="text-lg font-medium">{selectedOperator.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Service Type:
                </label>
                <p className="text-lg">
                  {selectedOperator.service_type?.replace("_", " ")}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Status:
                </label>
                <span
                  className={`px-2 py-1 text-sm rounded ${
                    selectedOperator.is_active
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}
                >
                  {selectedOperator.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Created:
                </label>
                <p>
                  {selectedOperator.created_at
                    ? new Date(selectedOperator.created_at).toLocaleString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </SuperModal>
      )}

      {/* Bulk Upload Modal */}
      {isModal.BulkUpload && (
        <SuperModal
          onClose={() => setIsModal((prev) => ({ ...prev, BulkUpload: false }))}
        >
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Bulk Upload Operators</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Upload CSV File
                </label>
                <input
                  type="file"
                  accept=".csv"
                  className="w-full p-2 border border-gray-300 rounded-md dark:bg-darkBlue dark:border-gray-600"
                />
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p>Required columns: name, service_type</p>
                <p>
                  Service types: mobile_recharge, dth_recharge, bill_payments,
                  aeps, dmt, micro_atm
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() =>
                    setIsModal((prev) => ({ ...prev, BulkUpload: false }))
                  }
                  className="px-4 py-2 border border-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                  Upload
                </button>
              </div>
            </div>
          </div>
        </SuperModal>
      )}
    </div>
  );
};

export default ServiceOperatorManager;
