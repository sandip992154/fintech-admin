/**
 * AEPS Commission Slab Manager Component
 * ====================================
 *
 * Component for managing AEPS commission slabs with amount ranges
 * and role-wise commission values.
 */

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaCalculator,
  FaExclamationTriangle,
} from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useRolePermissions } from "../../hooks/useRolePermissions";
import schemeManagementService from "../../services/schemeManagementService";

const AEPSSlabManager = ({ commissionId, schemeId, onClose = () => {} }) => {
  const { hasCommissionPermission, canEditCommissionField, userRole } =
    useRolePermissions();

  // Early return if no commission ID is provided
  if (!commissionId) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-8">
          <div className="text-yellow-600 dark:text-yellow-400 mb-4">
            <FaExclamationTriangle className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Commission Required
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            AEPS slabs can only be managed for existing commissions. Please save
            the commission first, then manage its slabs.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const [slabs, setSlabs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingSlabId, setEditingSlabId] = useState(null);
  const [newSlab, setNewSlab] = useState(null);
  const [sortField, setSortField] = useState("slab_min");
  const [sortDirection, setSortDirection] = useState("asc");
  const [validationErrors, setValidationErrors] = useState({});

  // Get editable fields based on user role
  const editableFields = useMemo(() => {
    const allFields = [
      "admin",
      "whitelabel",
      "masterdistributor",
      "distributor",
      "retailer",
      "customer",
    ];
    return allFields.filter((field) => canEditCommissionField(field));
  }, [canEditCommissionField]);

  // Default slab structure
  const getDefaultSlab = useCallback(
    () => ({
      slab_min: 0,
      slab_max: 1000,
      admin: 0,
      whitelabel: 0,
      masterdistributor: 0,
      distributor: 0,
      retailer: 0,
      customer: 0,
      is_active: true,
    }),
    []
  );

  // Load slabs
  const loadSlabs = useCallback(async () => {
    if (!commissionId) return;

    try {
      setLoading(true);
      const response = await schemeManagementService.getCommissionSlabs(
        commissionId
      );
      setSlabs(response.items || response || []);
    } catch (error) {
      console.error("Error loading AEPS slabs:", error);
      toast.error("Failed to load AEPS commission slabs");
    } finally {
      setLoading(false);
    }
  }, [commissionId]);

  useEffect(() => {
    loadSlabs();
  }, [loadSlabs]);

  // Validation functions
  const validateSlab = useCallback(
    (slab, existingSlabs = [], currentId = null) => {
      const errors = {};

      // Basic validations
      if (slab.slab_min < 0) {
        errors.slab_min = "Minimum amount cannot be negative";
      }
      if (slab.slab_max <= slab.slab_min) {
        errors.slab_max = "Maximum amount must be greater than minimum";
      }

      // Check for overlapping ranges
      const otherSlabs = existingSlabs.filter((s) => s.id !== currentId);
      const hasOverlap = otherSlabs.some(
        (existing) =>
          slab.slab_min < existing.slab_max && slab.slab_max > existing.slab_min
      );

      if (hasOverlap) {
        errors.range = "Slab range overlaps with existing slab";
      }

      // Validate commission hierarchy (parent >= child)
      const roles = [
        "admin",
        "whitelabel",
        "masterdistributor",
        "distributor",
        "retailer",
        "customer",
      ];
      for (let i = 0; i < roles.length - 1; i++) {
        if (slab[roles[i]] < slab[roles[i + 1]]) {
          errors[roles[i + 1]] = `${
            roles[i + 1]
          } commission cannot be higher than ${roles[i]}`;
        }
      }

      return errors;
    },
    []
  );

  // Sort slabs
  const sortedSlabs = useMemo(() => {
    return [...slabs].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (sortDirection === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  }, [slabs, sortField, sortDirection]);

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Get sort icon
  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort className="opacity-50" />;
    return sortDirection === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  // Handle field change
  const handleFieldChange = (slabId, field, value) => {
    const numValue = parseFloat(value) || 0;

    if (slabId === "new") {
      setNewSlab((prev) => ({ ...prev, [field]: numValue }));
    } else {
      setSlabs((prev) =>
        prev.map((slab) =>
          slab.id === slabId ? { ...slab, [field]: numValue } : slab
        )
      );
    }

    // Clear validation errors for this field
    setValidationErrors((prev) => ({
      ...prev,
      [`${slabId}_${field}`]: null,
    }));
  };

  // Start editing
  const startEditing = (slabId) => {
    if (editingSlabId && editingSlabId !== slabId) {
      // Save current editing first
      handleSaveSlab(editingSlabId);
    }
    setEditingSlabId(slabId);
  };

  // Add new slab
  const handleAddSlab = () => {
    if (newSlab) {
      toast.warning("Please save or cancel the current new slab first");
      return;
    }
    setNewSlab(getDefaultSlab());
    setEditingSlabId("new");
  };

  // Save slab
  const handleSaveSlab = async (slabId) => {
    const slab =
      slabId === "new" ? newSlab : slabs.find((s) => s.id === slabId);
    if (!slab) return;

    // Validate
    const errors = validateSlab(slab, slabs, slabId === "new" ? null : slabId);
    if (Object.keys(errors).length > 0) {
      Object.entries(errors).forEach(([field, message]) => {
        setValidationErrors((prev) => ({
          ...prev,
          [`${slabId}_${field}`]: message,
        }));
        toast.error(message);
      });
      return;
    }

    try {
      setSaving(true);

      if (slabId === "new") {
        // Create new slab
        const created = await schemeManagementService.createCommissionSlab({
          ...slab,
          commission_id: commissionId,
        });
        setSlabs((prev) => [...prev, created]);
        setNewSlab(null);
        toast.success("AEPS slab created successfully");
      } else {
        // Update existing slab
        const updated = await schemeManagementService.updateCommissionSlab(
          slabId,
          slab
        );
        setSlabs((prev) => prev.map((s) => (s.id === slabId ? updated : s)));
        toast.success("AEPS slab updated successfully");
      }

      setEditingSlabId(null);
    } catch (error) {
      console.error("Error saving AEPS slab:", error);
      toast.error("Failed to save AEPS slab");
    } finally {
      setSaving(false);
    }
  };

  // Cancel editing
  const handleCancelEdit = (slabId) => {
    if (slabId === "new") {
      setNewSlab(null);
    } else {
      // Reload to reset changes
      loadSlabs();
    }
    setEditingSlabId(null);
    setValidationErrors({});
  };

  // Delete slab
  const handleDeleteSlab = async (slabId) => {
    if (!window.confirm("Are you sure you want to delete this AEPS slab?")) {
      return;
    }

    try {
      setSaving(true);
      await schemeManagementService.deleteCommissionSlab(slabId);
      setSlabs((prev) => prev.filter((s) => s.id !== slabId));
      toast.success("AEPS slab deleted successfully");
    } catch (error) {
      console.error("Error deleting AEPS slab:", error);
      toast.error("Failed to delete AEPS slab");
    } finally {
      setSaving(false);
    }
  };

  // Calculate commission for amount
  const calculateCommission = (amount, role) => {
    const applicableSlab = slabs.find(
      (slab) =>
        amount >= slab.slab_min && amount < slab.slab_max && slab.is_active
    );
    return applicableSlab ? applicableSlab[role] || 0 : 0;
  };

  // Render editable cell
  const renderEditableCell = (slab, field, slabId) => {
    const isEditing = editingSlabId === slabId;
    const canEdit =
      editableFields.includes(field) ||
      ["slab_min", "slab_max"].includes(field);
    const value = slab[field] || 0;
    const errorKey = `${slabId}_${field}`;
    const hasError = validationErrors[errorKey];

    if (!isEditing || !canEdit) {
      return (
        <span className={`${hasError ? "text-red-600" : ""}`}>
          {field.includes("slab") ? `₹${value}` : `${value}%`}
        </span>
      );
    }

    return (
      <input
        type="number"
        value={value}
        onChange={(e) => handleFieldChange(slabId, field, e.target.value)}
        className={`w-full px-2 py-1 text-sm border rounded ${
          hasError ? "border-red-500" : "border-gray-300"
        } focus:outline-none focus:border-blue-500`}
        min="0"
        step={field.includes("slab") ? "1" : "0.01"}
      />
    );
  };

  if (!hasCommissionPermission("read")) {
    return (
      <div className="p-6 text-center">
        <div className="text-gray-500">
          You don't have permission to view commission slabs
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            AEPS Commission Slabs
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage amount-based commission slabs for AEPS transactions
          </p>
        </div>

        <div className="flex  items-center space-x-3">
          {hasCommissionPermission("create") && (
            <button
              onClick={handleAddSlab}
              className="flex gap-2 p-2 items-center rounded btn-primary"
              disabled={loading || saving || newSlab}
            >
              <FaPlus className="mr-2" />
              Add Slab
            </button>
          )}
          <button
            onClick={onClose}
            className="flex gap-2  items-center !p-2 !text-xl btn-secondary"
          >
            <FaTimes className="mr-2" />
            Close
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ClipLoader color="#3B82F6" size={40} />
        </div>
      ) : (
        <>
          {/* Slabs Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => handleSort("slab_min")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Min Amount</span>
                        {getSortIcon("slab_min")}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => handleSort("slab_max")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Max Amount</span>
                        {getSortIcon("slab_max")}
                      </div>
                    </th>
                    {editableFields.map((field) => (
                      <th
                        key={field}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => handleSort(field)}
                      >
                        <div className="flex items-center space-x-1">
                          <span>{field}</span>
                          {getSortIcon(field)}
                        </div>
                      </th>
                    ))}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {/* New slab row */}
                  {newSlab && (
                    <tr className="bg-blue-50 dark:bg-blue-900/20">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderEditableCell(newSlab, "slab_min", "new")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderEditableCell(newSlab, "slab_max", "new")}
                      </td>
                      {editableFields.map((field) => (
                        <td key={field} className="px-6 py-4 whitespace-nowrap">
                          {renderEditableCell(newSlab, field, "new")}
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleSaveSlab("new")}
                            className="text-green-600 hover:text-green-800"
                            disabled={saving}
                          >
                            {saving ? <ClipLoader size={16} /> : <FaSave />}
                          </button>
                          <button
                            onClick={() => handleCancelEdit("new")}
                            className="text-red-600 hover:text-red-800"
                            disabled={saving}
                          >
                            <FaTimes />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* Existing slabs */}
                  {sortedSlabs.map((slab) => (
                    <tr
                      key={slab.id}
                      className={
                        editingSlabId === slab.id
                          ? "bg-yellow-50 dark:bg-yellow-900/20"
                          : ""
                      }
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderEditableCell(slab, "slab_min", slab.id)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderEditableCell(slab, "slab_max", slab.id)}
                      </td>
                      {editableFields.map((field) => (
                        <td key={field} className="px-6 py-4 whitespace-nowrap">
                          {renderEditableCell(slab, field, slab.id)}
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {editingSlabId === slab.id ? (
                            <>
                              <button
                                onClick={() => handleSaveSlab(slab.id)}
                                className="text-green-600 hover:text-green-800"
                                disabled={saving}
                              >
                                {saving ? <ClipLoader size={16} /> : <FaSave />}
                              </button>
                              <button
                                onClick={() => handleCancelEdit(slab.id)}
                                className="text-red-600 hover:text-red-800"
                                disabled={saving}
                              >
                                <FaTimes />
                              </button>
                            </>
                          ) : (
                            <>
                              {hasCommissionPermission("update") && (
                                <button
                                  onClick={() => startEditing(slab.id)}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <FaEdit />
                                </button>
                              )}
                              {hasCommissionPermission("delete") && (
                                <button
                                  onClick={() => handleDeleteSlab(slab.id)}
                                  className="text-red-600 hover:text-red-800"
                                  disabled={saving}
                                >
                                  <FaTrash />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}

                  {sortedSlabs.length === 0 && !newSlab && (
                    <tr>
                      <td
                        colSpan={editableFields.length + 3}
                        className="px-6 py-12 text-center"
                      >
                        <div className="text-gray-500 dark:text-gray-400">
                          No AEPS commission slabs found
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Commission Calculator */}
          {slabs.length > 0 && (
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-400 mb-3">
                <FaCalculator className="inline mr-2" />
                Commission Calculator
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Transaction Amount
                  </label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                    onChange={(e) => {
                      const amount = parseFloat(e.target.value) || 0;
                      // You can show calculated commissions here
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Role
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500">
                    {editableFields.map((field) => (
                      <option key={field} value={field}>
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Commission
                  </label>
                  <div className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                    ₹0.00
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AEPSSlabManager;
