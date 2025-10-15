import { useEffect, useState, useCallback, useMemo } from "react";
import CommissionTable from "../../components/resource_tab/CommisonTable";
import CommissionEditableForm from "../../components/resource_tab/CommissionEditableForm";
import CommissionDropdown from "../../components/resource_tab/CommissionDropdown";
import FilterBar from "../../components/utility/FilterBar";
import PaginatedTable from "../../components/utility/PaginatedTable";
import { ToggleButton } from "../../components/utility/ToggleButton";
import SchemeForm from "../../components/resource_tab/SchmeForm";
import schemeManagementService from "../../services/schemeManagementService";
import { useRolePermissions } from "../../hooks/useRolePermissions";
import { authNotifications } from "../../components/common/modernNotificationService";
import {
  handleApiError,
  withErrorHandling,
  useLoadingState,
  LoadingSpinner,
  ValidationErrorDisplay,
} from "../../utils/errorHandling";

import {
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { SuperModal } from "../../components/utility/SuperModel";

/**
 * Admin Portal - SchemeManager Component
 *
 * This is an ADMIN-ONLY portal component designed for administrative control
 * over schemes and commission management across the platform.
 *
 * Admin Access Control & Capabilities:
 * 🔥 ADMIN PORTAL - Full administrative access to ALL schemes regardless of creator
 * � SCHEME MANAGEMENT - Create, Read, Update, Delete any scheme in the system
 * 💰 COMMISSION CONTROL - Full access to view and modify commission structures
 * � MULTI-TENANT OVERSIGHT - Manage schemes across all user hierarchies
 * 🔧 SYSTEM ADMINISTRATION - Override normal role restrictions for administrative tasks
 *
 * Admin Operations:
 * ✅ Create schemes for any user role or organization
 * ✅ Edit/Delete any scheme regardless of original creator
 * ✅ View and modify commission rates for all services
 * ✅ Activate/Deactivate schemes system-wide
 * ✅ Bulk operations and advanced filtering
 * ✅ Administrative reporting and analytics
 *
 * Security Notes:
 * 🛡️ Admin authentication required
 * 🛡️ All operations logged for audit trails
 * 🛡️ Enhanced validation for system-wide changes
 */
export const SchemeManager = () => {
  // Role-based permissions hook
  const {
    user,
    permissions,
    hasSchemePermission,
    hasCommissionPermission,
    canAccessScheme,
    filterAccessibleSchemes,
    roleInfo,
    userRole,
  } = useRolePermissions();

  // Memoize commission dropdown options to prevent unnecessary re-creation
  const commissionDropdownOptions = useMemo(
    () => [
      { label: "Mobile Recharge", modalKey: "MobileRecharge" },
      { label: "DTH Recharge", modalKey: "DTHRecharge" },
      { label: "Bill Payments", modalKey: "BillPayments" },
      { label: "AEPS", modalKey: "AEPS" },
      { label: "DMT", modalKey: "DMT" },
      { label: "Micro ATM", modalKey: "MicroATM" },
    ],
    []
  );
  // Loading states using centralized error handling
  const {
    setLoading: setOperationLoading,
    isLoading: isOperationLoading,
    hasAnyLoading,
  } = useLoadingState({
    schemes: false,
    create: false,
    update: false,
    delete: false,
    commission: false,
  });

  // Legacy loading state (maintain compatibility)
  const [loading, setLoading] = useState(false);

  // Enhanced error state
  const [errors, setErrors] = useState({
    general: null,
    validation: [],
  });

  const [schemes, setSchemes] = useState([]);
  const [totalSchemes, setTotalSchemes] = useState(0);

  // All modals open close State
  const [isModal, setIsModal] = useState({
    AddNew: false,
    ViewCommision: false,
    "Commision/Charge": false,
    MobileRecharge: false,
    AEPS: false,
    DTHRecharge: false,
    MicroATM: false,
    BillPayments: false,
    DMT: false,
    // Admin-specific modals
    AEPSSlabManager: false,
    CommissionImportExport: false,
    BulkCommissionUpdate: false,
  });

  //modales state
  const [schemeName, setSchemeName] = useState("");
  const [editingScheme, setEditingScheme] = useState(null);
  const [selectedCommission, setSelectedCommission] = useState({});
  const [currentSchemeForCommission, setCurrentSchemeForCommission] =
    useState(null);

  const [filters, setFilters] = useState({
    searchValue: "",
    is_active: "all",
    from_date: "",
    to_date: "",
    filter_user_id: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalSchemes: 0,
    activeSchemes: 0,
  });

  // Resource management state (for future expansion)
  const [selectedResource, setSelectedResource] = useState(null);
  const [resources, setResources] = useState([]);

  // Admin portal - simplified state management
  const [adminStats, setAdminStats] = useState({
    totalSchemes: 0,
    activeSchemes: 0,
    inactiveSchemes: 0,
    totalUsers: 0,
    recentActivity: 0,
  });

  const pageSize = 10;

  // Admin Portal - Simplified access control (all admins have full access)
  const isAdminUser = useCallback(() => {
    return (
      userRole === "admin" ||
      userRole === "superadmin" ||
      userRole === "super_admin"
    );
  }, [userRole]);

  // Admin can access all schemes - no complex hierarchy needed
  const canAccessAllSchemes = useCallback(() => {
    if (!isAdminUser()) {
      authNotifications.error("Admin access required for this portal");
      return false;
    }
    return true;
  }, [isAdminUser]);

  // Admin Portal - Enhanced data loading with full access
  const loadSchemeData = useCallback(async () => {
    // Verify admin access first
    if (!canAccessAllSchemes()) {
      return;
    }

    try {
      setLoading(true);
      setOperationLoading("schemes", true);

      // Build filter parameters for admin view (access to all schemes)
      const filterParams = schemeManagementService.buildFilterParams({
        skip: (currentPage - 1) * pageSize,
        limit: pageSize,
        search: filters.searchValue,
        is_active: filters.is_active,
        from_date: filters.from_date,
        to_date: filters.to_date,
        filter_user_id: filters.filter_user_id,
        admin_view: true, // Flag for admin access to all schemes
      });

      // Admin gets all schemes regardless of creator hierarchy
      const response = await schemeManagementService.getSchemesWithFilters(
        filterParams
      );

      let schemesData = response.items || response || [];

      setSchemes(schemesData);
      setFilteredData(schemesData);
      setTotalSchemes(response.total || schemesData.length);

      // Enhanced admin stats
      setAdminStats({
        totalSchemes: response.total || schemesData.length,
        activeSchemes: schemesData.filter((s) => s.is_active).length,
        inactiveSchemes: schemesData.filter((s) => !s.is_active).length,
        totalUsers: response.unique_users || 0,
        recentActivity: response.recent_changes || 0,
      });

      authNotifications.success(
        `Loaded ${schemesData.length} schemes for admin review`
      );
    } catch (error) {
      console.error("Error loading scheme data:", error);

      const errorMessage =
        error.message || "Failed to load schemes. Please try again.";
      authNotifications.error(errorMessage);

      // Reset data on error
      setSchemes([]);
      setFilteredData([]);
      setTotalSchemes(0);
      setAdminStats({
        totalSchemes: 0,
        activeSchemes: 0,
        inactiveSchemes: 0,
        totalUsers: 0,
        recentActivity: 0,
      });
    } finally {
      setLoading(false);
      setOperationLoading("schemes", false);
    }
  }, [
    currentPage,
    pageSize,
    filters,
    canAccessAllSchemes,
    setOperationLoading,
  ]); // Dependencies for useCallback

  // Optimized generic input handler with useCallback
  const handleInputChange = useCallback((name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1); // Reset to first page when filtering
  }, []); // No dependencies needed as we use functional updates

  // Optimized toggle scheme status with enhanced error handling
  const handleToggle = useCallback(
    async (scheme, index) => {
      console.log("=== TOGGLE DEBUG START ===");
      console.log("Original scheme:", scheme);
      console.log("Current is_active:", scheme.is_active);
      console.log("Index:", index);

      try {
        setOperationLoading("update", true);
        setLoading(true);

        const newStatus = !scheme.is_active;
        console.log("Toggling to:", newStatus);

        // Call the specific status update endpoint
        const updatedScheme = await schemeManagementService.updateSchemeStatus(
          scheme.id,
          newStatus
        );
        console.log("Server response:", updatedScheme);

        // Safety check: Use the actual response from server to determine the final state
        const actualStatus = updatedScheme.is_active;
        console.log("Actual status from server:", actualStatus);

        // Update filteredData state
        setFilteredData((prevData) => {
          const updated = [...prevData];
          updated[index] = {
            ...scheme,
            is_active: actualStatus,
            updated_at: updatedScheme.updated_at || new Date().toISOString(),
          };
          console.log("Updated filteredData item:", updated[index]);
          return updated;
        });

        // Update schemes state
        setSchemes((prevSchemes) =>
          prevSchemes.map((s) =>
            s.id === scheme.id
              ? {
                  ...s,
                  is_active: actualStatus,
                  updated_at:
                    updatedScheme.updated_at || new Date().toISOString(),
                }
              : s
          )
        );

        // Update admin stats
        setAdminStats((prev) => ({
          ...prev,
          activeSchemes:
            prev.totalSchemes > 0
              ? actualStatus
                ? prev.activeSchemes + 1
                : prev.activeSchemes - 1
              : 0,
          inactiveSchemes:
            prev.totalSchemes > 0
              ? actualStatus
                ? prev.inactiveSchemes - 1
                : prev.inactiveSchemes + 1
              : 0,
        }));

        // Show success message
        authNotifications.success(
          `Scheme "${scheme.name}" ${
            actualStatus ? "activated" : "deactivated"
          } successfully`
        );

        // If the server state doesn't match what we expected, show a warning
        if (actualStatus !== newStatus) {
          console.warn(
            `Expected status: ${newStatus}, but server returned: ${actualStatus}`
          );
          authNotifications.warning(
            `Status updated, but server returned different state than expected`
          );
        }
      } catch (error) {
        console.error("Error toggling scheme status:", error);

        const errorMessage =
          error?.response?.data?.detail ||
          error?.message ||
          "Failed to update scheme status";

        authNotifications.error(`Toggle Failed: ${errorMessage}`);

        // Reload data to ensure consistency on error
        loadSchemeData();
      } finally {
        setOperationLoading("update", false);
        setLoading(false);
        console.log("=== TOGGLE DEBUG END ===");
      }
    },
    [setOperationLoading, loadSchemeData]
  );

  // Admin Portal - Enhanced delete function with full access
  const handleDelete = useCallback(
    async (scheme) => {
      // Admin verification
      if (!canAccessAllSchemes()) {
        return;
      }

      // Enhanced confirmation for admin portal
      const confirmMessage = `
        ADMIN DELETE CONFIRMATION
        
        Scheme: "${scheme.name}"
        Creator: ${scheme.created_by_role || "Unknown"} (ID: ${
        scheme.created_by || "N/A"
      })
        Status: ${scheme.is_active ? "Active" : "Inactive"}
        
        This action will permanently delete the scheme and all associated commission data.
        This cannot be undone.
        
        Are you sure you want to proceed?
      `;

      if (window.confirm(confirmMessage)) {
        try {
          setOperationLoading("delete", true);

          await schemeManagementService.deleteScheme(scheme.id);

          authNotifications.success(
            `Admin: Successfully deleted scheme "${scheme.name}" (ID: ${scheme.id})`
          );

          // Reload data to reflect changes
          await loadSchemeData();
        } catch (error) {
          console.error("Error deleting scheme:", error);

          const errorMessage =
            error?.response?.data?.detail ||
            error?.message ||
            "Failed to delete scheme. Please try again.";

          authNotifications.error(`Admin Delete Failed: ${errorMessage}`);
        } finally {
          setOperationLoading("delete", false);
        }
      }
    },
    [canAccessAllSchemes, setOperationLoading, loadSchemeData]
  ); // Dependencies for useCallback

  // Memoized filter fields configuration for better performance
  const fields = useMemo(
    () => [
      {
        name: "searchValue",
        type: "text",
        placeholder: "Search schemes by name or description...",
        value: filters.searchValue || "",
        onChange: (val) => handleInputChange("searchValue", val),
      },
      {
        name: "is_active",
        type: "select",
        placeholder: "Status",
        value: filters.is_active || "all",
        onChange: (val) => handleInputChange("is_active", val),
        options: [
          { label: "All Status", value: "all" },
          { label: "Active", value: "true" },
          { label: "Inactive", value: "false" },
        ],
      },
      {
        name: "from_date",
        type: "date",
        placeholder: "From Date",
        value: filters.from_date || "",
        onChange: (val) => handleInputChange("from_date", val),
        label: "From Date",
      },
      {
        name: "to_date",
        type: "date",
        placeholder: "To Date",
        value: filters.to_date || "",
        onChange: (val) => handleInputChange("to_date", val),
        label: "To Date",
      },
      {
        name: "filter_user_id",
        type: "number",
        placeholder: "Filter by User ID (includes hierarchy)",
        value: filters.filter_user_id || "",
        onChange: (val) => handleInputChange("filter_user_id", val),
        label: "User ID Filter",
      },
    ],
    [filters]
  );

  useEffect(() => {
    loadSchemeData();
  }, [filters, currentPage]);

  // Load scheme management data with enhanced filtering and error handling
  // utility for modal handlings - memoized to prevent unnecessary re-renders
  const handleCommissionOptionClick = useCallback(
    async (modalKey, scheme = null) => {
      if (scheme) {
        setCurrentSchemeForCommission(scheme);

        // 🚀 OPTIMIZATION: Load commission data for ONLY the specific service type
        try {
          setOperationLoading("commission", true);

          // Map modalKey to service type
          const serviceTypeMap = {
            MobileRecharge: "mobile_recharge",
            DTHRecharge: "dth_recharge",
            BillPayments: "bill_payments",
            AEPS: "aeps",
            DMT: "dmt",
            MicroATM: "micro_atm",
          };

          const serviceType =
            serviceTypeMap[modalKey] || modalKey.toLowerCase();

          console.log(
            `🔍 Loading commission for specific service: ${serviceType}`
          );

          // Get existing commission data for ONLY this scheme and service type
          const commissionData =
            await schemeManagementService.getCommissionsBySchemeAndService(
              scheme.id,
              serviceType
            );

          // Set the commission data
          setSelectedCommission(commissionData || []);

          authNotifications.info(
            `Loading ${modalKey} commission for scheme "${scheme.name}" (service: ${serviceType})`
          );
        } catch (error) {
          console.error("Error loading commission data:", error);
          setSelectedCommission([]);
          authNotifications.warning(
            `Could not load existing commission data for ${modalKey}. You can still create new commission rates.`
          );
        } finally {
          setOperationLoading("commission", false);
        }
      }

      setIsModal((prev) => ({ ...prev, [modalKey]: true }));
    },
    [setOperationLoading]
  );

  // Admin Portal - Enhanced commission management functions
  const openBulkCommissionUpdate = useCallback(() => {
    if (!canAccessAllSchemes()) {
      return;
    }
    setIsModal((prev) => ({ ...prev, BulkCommissionUpdate: true }));
    authNotifications.info("Admin: Opening bulk commission update");
  }, [canAccessAllSchemes]);

  const openCommissionImportExport = useCallback(() => {
    if (!canAccessAllSchemes()) {
      return;
    }
    setIsModal((prev) => ({ ...prev, CommissionImportExport: true }));
    authNotifications.info("Admin: Opening commission import/export");
  }, [canAccessAllSchemes]);

  // Admin Portal - Enhanced modal functions
  const openAddModal = useCallback(() => {
    if (!canAccessAllSchemes()) {
      return;
    }

    setEditingScheme(null);
    setSchemeName("");
    setIsModal((prev) => ({ ...prev, AddNew: true }));

    authNotifications.info("Admin: Opening scheme creation form");
  }, [canAccessAllSchemes]);

  const openEditModal = useCallback(
    (entry) => {
      if (!canAccessAllSchemes()) {
        return;
      }

      setEditingScheme(entry);
      setSchemeName(entry.name);
      setIsModal((prev) => ({ ...prev, AddNew: true }));

      authNotifications.info(
        `Admin: Editing scheme "${entry.name}" (ID: ${entry.id})`
      );
    },
    [canAccessAllSchemes]
  );

  const openViewCommissionModal = useCallback(
    async (scheme) => {
      if (!canAccessAllSchemes()) {
        return;
      }

      try {
        setIsModal((prev) => ({ ...prev, ViewCommision: true }));
        setSelectedCommission({});
        setOperationLoading("commission", true);

        if (!scheme || !scheme.id) {
          console.error("Invalid scheme object:", scheme);
          authNotifications.error("Invalid scheme data provided");
          setSelectedCommission({});
          setOperationLoading("commission", false);
          return;
        }

        // ✅ Load ALL commission data for the View Commission modal
        console.log(
          `🔍 Loading ALL commission data for scheme: ${scheme.name}`
        );

        const commissionData =
          await schemeManagementService.getAllCommissionsByScheme(scheme.id);

        setSelectedCommission(commissionData || {});

        authNotifications.success(
          `Loaded all commission data for "${scheme.name}"`
        );
      } catch (error) {
        console.error("Error fetching commission data:", error);

        const errorMessage =
          error?.response?.data?.detail ||
          error?.message ||
          "Failed to load commission data";

        authNotifications.error(`Commission Error: ${errorMessage}`);
        setSelectedCommission({});
      } finally {
        setOperationLoading("commission", false);
      }
    },
    [canAccessAllSchemes, setOperationLoading]
  );

  // Memoized callback for closing commission modal
  const handleCloseCommissionModal = useCallback((modalKey) => {
    setIsModal((prev) => ({ ...prev, [modalKey]: false }));
  }, []);

  // Admin Portal - Resource management functions (placeholder for future features)
  const openCreateResource = useCallback(() => {
    if (!canAccessAllSchemes()) {
      return;
    }
    setIsModal((prev) => ({ ...prev, CreateResource: true }));
  }, [canAccessAllSchemes]);

  const openViewResource = useCallback(
    (resource) => {
      if (!canAccessAllSchemes()) {
        return;
      }
      setSelectedResource(resource);
      setIsModal((prev) => ({ ...prev, ViewResource: true }));
    },
    [canAccessAllSchemes]
  );

  // Admin Portal - Resource management functions (placeholder for future features)
  const handleCreateResource = useCallback(
    async (resourceData) => {
      if (!canAccessAllSchemes()) {
        return;
      }

      try {
        setOperationLoading("create", true);

        // Implement resource creation logic here
        console.log("Admin creating resource:", resourceData);

        authNotifications.success("Admin: Resource created successfully");
        setIsModal((prev) => ({ ...prev, CreateResource: false }));

        // Reload resources if needed
      } catch (error) {
        console.error("Error creating resource:", error);

        const errorMessage =
          error?.response?.data?.detail ||
          error?.message ||
          "Failed to create resource";

        authNotifications.error(
          `Admin Resource Creation Failed: ${errorMessage}`
        );
      } finally {
        setOperationLoading("create", false);
      }
    },
    [canAccessAllSchemes, setOperationLoading]
  );

  const handleDeleteResource = useCallback(
    async (resourceId) => {
      if (!window.confirm("Are you sure you want to delete this resource?")) {
        return;
      }

      const result = await withErrorHandling(
        async () => {
          setOperationLoading("delete", true);

          // Implement resource deletion logic here
          console.log("Deleting resource:", resourceId);

          // Here you would call the actual delete API
          // const response = await schemeManagementService.deleteResource(resourceId);

          // For now, just simulate success
          return { success: true };
        },
        {
          successMessage: "Resource deleted successfully",
          errorMessage: "Failed to delete resource",
        }
      );

      setOperationLoading("delete", false);

      if (result.success) {
        // Reload resources if needed after successful deletion
        // loadSchemeData();
      }
    },
    [setOperationLoading]
  );

  // Memoized table columns configuration for better performance
  const columns = useMemo(
    () => [
      {
        header: "ID",
        accessor: "id",
        render: (row) => `#${row.id}`,
      },
      {
        header: "Scheme Name",
        accessor: "name",
        render: (row) => (
          <div className="font-medium text-gray-900 dark:text-white">
            {row.name}
          </div>
        ),
      },
      {
        header: "Description",
        accessor: "description",
        render: (row) => (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {row.description || "No description"}
          </div>
        ),
      },
      {
        header: "Status",
        accessor: "is_active",
        render: (row, idx) => (
          <ToggleButton
            row={row}
            onchange={() => handleToggle(row, idx)}
            checked={Boolean(row.is_active)}
          />
        ),
      },
      {
        header: "Creator Role",
        accessor: "created_by_role",
        render: (row) => {
          const role = row.created_by_role || "unknown";
          const displayRole =
            role === "super_admin"
              ? "Super Admin"
              : role === "user"
              ? "User"
              : role.charAt(0).toUpperCase() + role.slice(1);
          return (
            <span
              className={`px-2 py-1 text-xs rounded ${
                role === "super_admin"
                  ? "bg-purple-100 text-purple-800"
                  : role === "admin"
                  ? "bg-blue-100 text-blue-800"
                  : role === "user"
                  ? "bg-gray-100 text-gray-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {displayRole}
            </span>
          );
        },
      },
      {
        header: "Owner",
        accessor: "owner_id",
        render: (row) => {
          if (!row.owner_id) {
            return (
              <span className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-600">
                No Owner
              </span>
            );
          }
          return (
            <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
              User #{row.owner_id}
            </span>
          );
        },
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
        width: "200px", // Add fixed width to ensure actions column is visible
        render: (row) => {
          // Admin Portal - Full access to all actions
          const isAdmin = isAdminUser();

          if (!isAdmin) {
            return (
              <div className="flex space-x-2 min-w-fit">
                <span className="text-red-500 text-xs px-2 py-1 bg-red-50 rounded border">
                  Admin Only
                </span>
              </div>
            );
          }

          return (
            <div className="flex space-x-2 min-w-fit">
              {/* Admin Edit Button */}
              <button
                className="text-green-600 hover:text-green-800 p-1 rounded border border-green-300 hover:bg-green-50 transition-colors"
                onClick={() => openEditModal(row)}
                title={`Admin: Edit scheme "${row.name}"`}
              >
                <FaEdit />
              </button>

              {/* Admin View Commission Button */}
              <button
                className="text-blue-600 hover:text-blue-800 p-1 rounded border border-blue-300 hover:bg-blue-50 transition-colors"
                onClick={() => openViewCommissionModal(row)}
                title={`Admin: View commission for "${row.name}"`}
              >
                <FaEye />
              </button>

              {/* Admin Delete Button */}
              <button
                className="text-red-600 hover:text-red-800 p-1 rounded border border-red-300 hover:bg-red-50 transition-colors"
                onClick={() => handleDelete(row)}
                title={`Admin: Delete scheme "${row.name}" (Permanent)`}
              >
                <FaTrash />
              </button>

              {/* Admin Commission Management */}
              <div className="inline-block">
                <CommissionDropdown
                  commissions={row.commissions || []}
                  setSelectedCommission={setSelectedCommission}
                  commissionDropdownOptions={commissionDropdownOptions}
                  handleCommissionOptionClick={handleCommissionOptionClick}
                  scheme={row}
                  adminMode={true}
                />
              </div>
            </div>
          );
        },
      },
    ],
    [
      user,
      userRole,
      isAdminUser,
      handleToggle,
      handleDelete,
      setSelectedCommission,
      commissionDropdownOptions,
      handleCommissionOptionClick,
      openEditModal,
      openViewCommissionModal,
    ]
  ); // Admin Portal - Simplified dependencies

  return (
    <div className="h-[90vh] 2xl:max-w-[80%] p-4 mx-8 bg-secondaryOne dark:bg-darkBlue/70 rounded-2xl 2xl:mx-auto text-gray-800 overflow-hidden overflow-y-auto px-4 pb-6 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
      {/* Global Error Display */}
      {errors.general && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-red-700 text-sm font-medium">
            {errors.general}
          </div>
        </div>
      )}

      {/* Validation Errors */}
      <ValidationErrorDisplay errors={errors.validation} className="mb-4" />

      {/* Loading Overlay */}
      {hasAnyLoading() && (
        <div className="fixed inset-0 bg-white/25 bg-opacity-25 flex items-center justify-center z-40">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl">
            <LoadingSpinner
              size="lg"
              message={
                isOperationLoading("schemes")
                  ? "Loading schemes..."
                  : isOperationLoading("create")
                  ? "Creating scheme..."
                  : isOperationLoading("update")
                  ? "Updating scheme..."
                  : isOperationLoading("delete")
                  ? "Deleting resource..."
                  : isOperationLoading("commission")
                  ? "Processing commission..."
                  : "Processing..."
              }
            />
          </div>
        </div>
      )}

      {/* Admin Portal Header */}
      <div className="my-4 p-4 rounded-md bg-white dark:bg-transparent border-l-4 border-blue-500">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold dark:text-adminOffWhite flex items-center">
              🔧 Admin Portal - Scheme Manager
              {isAdminUser() && (
                <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded">
                  ADMIN ACCESS
                </span>
              )}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Administrative control over all schemes and commission structures
            </p>
          </div>

          {/* Enhanced Admin Stats Cards */}
          <div className="flex space-x-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center min-w-[80px]">
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {adminStats.totalSchemes}
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400">
                Total Schemes
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-center min-w-[80px]">
              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                {adminStats.activeSchemes}
              </div>
              <div className="text-xs text-green-600 dark:text-green-400">
                Active
              </div>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg text-center min-w-[80px]">
              <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                {adminStats.inactiveSchemes}
              </div>
              <div className="text-xs text-orange-600 dark:text-orange-400">
                Inactive
              </div>
            </div>
          </div>
        </div>

        {/* Admin Actions Bar */}
        <div className="flex justify-between items-center flex-wrap gap-4 mt-4 mb-2">
          <div className="flex-1">
            <form
              className="flex flex-col md:flex-row md:items-end md:space-x-4 space-y-2 md:space-y-0"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className="flex flex-col flex-1 min-w-[180px]">
                <label
                  htmlFor="searchValue"
                  className="text-xs font-medium text-gray-600 mb-1"
                >
                  Search
                </label>
                <input
                  id="searchValue"
                  name="searchValue"
                  type="text"
                  placeholder="Search schemes..."
                  className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  value={filters.searchValue}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, searchValue: e.target.value }))
                  }
                />
              </div>
              <div className="flex flex-col min-w-[120px]">
                <label
                  htmlFor="is_active"
                  className="text-xs font-medium text-gray-600 mb-1"
                >
                  Status
                </label>
                <select
                  id="is_active"
                  name="is_active"
                  className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  value={filters.is_active}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, is_active: e.target.value }))
                  }
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex flex-col min-w-[120px]">
                <label
                  htmlFor="from_date"
                  className="text-xs font-medium text-gray-600 mb-1"
                >
                  From
                </label>
                <input
                  id="from_date"
                  name="from_date"
                  type="date"
                  className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  value={filters.from_date}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, from_date: e.target.value }))
                  }
                />
              </div>
              <div className="flex flex-col min-w-[120px]">
                <label
                  htmlFor="to_date"
                  className="text-xs font-medium text-gray-600 mb-1"
                >
                  To
                </label>
                <input
                  id="to_date"
                  name="to_date"
                  type="date"
                  className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  value={filters.to_date}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, to_date: e.target.value }))
                  }
                />
              </div>
              <div className="flex flex-col justify-end">
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-md mt-1 md:mt-0"
                  onClick={() => loadSchemeData()}
                >
                  Search
                </button>
              </div>
            </form>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
            Admin Portal: Full system access • Last updated:{" "}
            {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      <div className="p-6 rounded-md w-full bg-white dark:bg-transparent dark:text-white">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold">Admin Scheme Management</h3>
            <p className="text-sm text-gray-500">
              Full administrative control over all schemes
            </p>
          </div>

          <div className="flex space-x-2">
            {/* Admin Create Scheme Button */}
            {isAdminUser() ? (
              <button
                className="bg-[#22C55E] hover:bg-[#16a34a] text-white btn-md flex items-center px-4 py-2 rounded-md transition-colors"
                onClick={openAddModal}
                title="Admin: Create new scheme for any user/organization"
              >
                <FaPlus className="mr-2" />
                Admin: Add Scheme
              </button>
            ) : (
              <div className="text-red-500 text-sm px-4 py-2 bg-red-50 rounded-md border border-red-200">
                <span className="flex items-center">
                  <FaUser className="mr-2" />
                  Admin Access Required
                </span>
              </div>
            )}
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
            totalItems={totalSchemes}
          />
        )}
      </div>

      {/* Add/Edit New Modal */}
      {isModal["AddNew"] && (
        <SuperModal
          onClose={() => {
            setIsModal((prev) => ({ ...prev, AddNew: false }));
            setEditingScheme(null);
            setSchemeName("");
          }}
        >
          <SchemeForm
            editingScheme={editingScheme}
            onSchemeUpdate={loadSchemeData}
            onClose={() => {
              setIsModal((prev) => ({ ...prev, AddNew: false }));
              setEditingScheme(null);
              setSchemeName("");
            }}
          />
        </SuperModal>
      )}

      {/* view commision */}
      {isModal["ViewCommision"] && (
        <SuperModal
          onClose={() =>
            setIsModal((prev) => ({ ...prev, ViewCommision: false }))
          }
        >
          <CommissionTable
            title="View Commission"
            data={selectedCommission} // <-- your real API data
            isLoading={isOperationLoading("commission")}
            onSubmit={() => {
              setIsModal((prev) => ({ ...prev, ViewCommision: false }));
            }}
          />
        </SuperModal>
      )}

      {/* commission/charges */}
      {commissionDropdownOptions.map(
        ({ modalKey, label }) =>
          isModal[modalKey] && (
            <SuperModal
              key={modalKey}
              onClose={() =>
                setIsModal((prev) => ({ ...prev, [modalKey]: false }))
              }
              className="max-w-7xl"
            >
              <div className="text-lg font-semibold mb-4">
                {label} Commission Settings
              </div>
              <div className="text-sm text-gray-600 mb-4">
                Scheme: "{currentSchemeForCommission?.name || "Unknown"}" |
                Service: {label}
              </div>
              {/* Enhanced CommissionEditableForm with all required props */}
              <CommissionEditableForm
                serviceKey={modalKey}
                commission={selectedCommission}
                setSelectedCommission={setSelectedCommission}
                schemeId={currentSchemeForCommission?.id}
                serviceType={modalKey}
                // serviceName={label}
                // isLoading={isOperationLoading("commission")}
                onClose={() => handleCloseCommissionModal(modalKey)}
              />
            </SuperModal>
          )
      )}

      {/* Resource Manager Modal */}
      {isModal["ResourceManager"] && (
        <SuperModal
          onClose={() =>
            setIsModal((prev) => ({ ...prev, ResourceManager: false }))
          }
          className="max-w-6xl"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Resource Management</h2>
              <button
                onClick={openCreateResource}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
              >
                <FaPlus className="mr-2" />
                Create Resource
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <ClipLoader color="#3B82F6" size={40} />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Categories Section */}
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4">
                    Categories ({categories.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="border rounded-lg p-3 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{
                              backgroundColor: category.color || "#3B82F6",
                            }}
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{category.name}</h4>
                            <p className="text-sm text-gray-500">
                              {category.resources_count || 0} resources
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs rounded ${
                              category.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {category.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resources Section */}
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4">
                    Resources ({resources.length})
                  </h3>
                  <div className="space-y-3">
                    {resources.map((resource) => (
                      <div
                        key={resource.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <FaEye className="text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">{resource.name}</h4>
                              <p className="text-sm text-gray-500">
                                {resource.category_name} •{" "}
                                {resource.resource_type}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-2 py-1 text-xs rounded ${
                                resource.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {resource.status}
                            </span>
                            <button
                              onClick={() => openViewResource(resource)}
                              className="text-blue-600 hover:text-blue-800 p-2"
                            >
                              <FaEye />
                            </button>
                            <button
                              onClick={() => handleDeleteResource(resource.id)}
                              className="text-red-600 hover:text-red-800 p-2"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </SuperModal>
      )}

      {/* Create Resource Modal */}
      {isModal["CreateResource"] && (
        <SuperModal
          onClose={() =>
            setIsModal((prev) => ({ ...prev, CreateResource: false }))
          }
          className="max-w-2xl"
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Create New Resource</h2>
            <ResourceForm
              categories={categories}
              onSubmit={handleCreateResource}
              onCancel={() =>
                setIsModal((prev) => ({ ...prev, CreateResource: false }))
              }
            />
          </div>
        </SuperModal>
      )}

      {/* View Resource Modal */}
      {isModal["ViewResource"] && selectedResource && (
        <SuperModal
          onClose={() =>
            setIsModal((prev) => ({ ...prev, ViewResource: false }))
          }
          className="max-w-3xl"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Resource Details</h2>
              <div className="flex space-x-2">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center">
                  <FaEdit className="mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteResource(selectedResource.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center"
                >
                  <FaTrash className="mr-2" />
                  Delete
                </button>
              </div>
            </div>
            <ResourceDetails resource={selectedResource} />
          </div>
        </SuperModal>
      )}
    </div>
  );
};

export default SchemeManager;
