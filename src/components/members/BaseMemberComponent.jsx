/**
 * Base Member Management Component
 * Reusable component for all member types (Admin, WhiteLabel, MDS, Distributor, Retailer, Customer)
 * Eliminates code duplication and provides consistent UI/UX
 */
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import { useMemberManagement } from "../../hooks/useMemberManagement";
import PaginatedTable from "../utility/PaginatedTable";
import FilterBar from "../utility/FilterBar";
import { SuperModal } from "../utility/SuperModel";
import { ToggleButton } from "../utility/ToggleButton";
import ActionDropdown from "../utility/ActionDropDown";
import FundActionForm from "./utility_components/FundActionForm";
import { CheckBoxPermissionForm } from "./utility_components/CheckBoxPermissionForm";
import KycStatusForm from "./utility_components/KycManager";
import ProfileSettings from "./utility_components/ProfileSettings";
import {
  FiRepeat,
  FiSettings,
  FiUserPlus,
  FiShield,
  FiFileText,
  FiSmartphone,
  FiUserCheck,
  FiSend,
  FiCreditCard,
  FiBarChart2,
  FiDatabase,
  FiTrendingUp,
} from "react-icons/fi";

// Configuration for different member types
const MEMBER_CONFIGS = {
  admin: {
    title: "Admin",
    parentRole: null,
    hasSchemeManager: false,
    hasStockManager: false,
  },
  whitelabel: {
    title: "WhiteLabel",
    parentRole: "admin",
    hasSchemeManager: true,
    hasStockManager: true,
  },
  mds: {
    title: "MDS",
    parentRole: "whitelabel",
    hasSchemeManager: true,
    hasStockManager: true,
  },
  distributor: {
    title: "Distributor",
    parentRole: "mds",
    hasSchemeManager: false,
    hasStockManager: false,
  },
  retailer: {
    title: "Retailer",
    parentRole: "distributor",
    hasSchemeManager: false,
    hasStockManager: false,
  },
  customer: {
    title: "Customer",
    parentRole: "retailer",
    hasSchemeManager: false,
    hasStockManager: false,
  },
};

const BaseMemberComponent = ({
  memberType,
  SchemeManagerComponent = null,
  StockManagerComponent = null,
}) => {
  const { user: currentUser } = useAuth();
  const mountedRef = useRef(true);
  const dataTransformRef = useRef(new Map());

  // Get configuration for this member type
  const config = MEMBER_CONFIGS[memberType] || MEMBER_CONFIGS.customer;

  // Loading states
  const [initialLoading, setInitialLoading] = useState(true);
  const [editModal, setEditModal] = useState(null);
  const [editData, setEditData] = useState(null);

  // Early return if user not available
  if (!currentUser) {
    return (
      <div className="h-[90vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">
            Loading user information...
          </p>
        </div>
      </div>
    );
  }

  // Member management hook
  const {
    members = [],
    schemes = [],
    availableParents = [],
    loading = false,
    actionLoading = false,
    error = null,
    actionError = null,
    clearErrors = () => {},
    currentPage = 1,
    totalPages = 1,
    totalMembers = 0,
    pageSize = 20,
    filters = {},
    updateFilters = () => {},
    applyFilters = () => {},
    resetFilters = () => {},
    fetchMembers = () => {},
    updateMemberStatus = () => {},
    deleteMember = () => {},
    goToPage = () => {},
    refreshData = () => {},
    bulkUpdateStatus = () => {},
  } = useMemberManagement(memberType, currentUser) || {};

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Error handling
  const handleError = useCallback(
    (error, context = "") => {
      if (!mountedRef.current) return;

      const errorMessage = error?.message || error || "An error occurred";
      console.error(`${config.title} component error ${context}:`, error);

      if (error?.response?.status === 401) {
        toast.error("Authentication required. Please log in again.");
      } else if (error?.response?.status === 403) {
        toast.error("You don't have permission to perform this action.");
      } else if (error?.response?.status === 404) {
        toast.error("The requested resource was not found.");
      } else if (error?.response?.status >= 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error(errorMessage);
      }

      clearErrors();
    },
    [clearErrors, config.title]
  );

  // Action handler with loading and error handling
  const handleActionWithLoading = useCallback(
    async (action, successMessage, errorContext) => {
      if (!mountedRef.current) return;

      try {
        const result = await action();
        if (result?.success) {
          toast.success(successMessage);
          return result;
        } else {
          handleError(result?.error || "Operation failed", errorContext);
          return result;
        }
      } catch (error) {
        handleError(error, errorContext);
        return { success: false, error };
      }
    },
    [handleError]
  );

  // Initialize data
  useEffect(() => {
    if (currentUser && mountedRef.current) {
      const initializeData = async () => {
        setInitialLoading(true);
        try {
          const promises = [
            fetchMembers({ force: true }).catch((err) => {
              console.warn(`Failed to fetch ${memberType} members:`, err);
              return null;
            }),
          ];

          await Promise.allSettled(promises);
        } catch (error) {
          console.error(`Failed to initialize ${memberType} data:`, error);
          handleError(error, "initialization");
        } finally {
          if (mountedRef.current) {
            setInitialLoading(false);
          }
        }
      };

      initializeData();
    }
  }, [currentUser, memberType, config.parentRole, fetchMembers, handleError]);

  // Handle errors from hooks
  useEffect(() => {
    if (error) handleError(error, "in hook");
    if (actionError) handleError(actionError, "in action");
  }, [error, actionError, handleError]);

  // Transform data for table display
  const transformedData = useMemo(() => {
    if (!members || members.length === 0) return [];

    const cacheKey = JSON.stringify(
      members.map((m) => ({ id: m.id, updated_at: m.updated_at }))
    );

    if (dataTransformRef.current.has(cacheKey)) {
      return dataTransformRef.current.get(cacheKey);
    }

    const transformed = members.map((member) => ({
      id: member.id,
      status: member.is_active,
      date: new Date(member.created_at).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      username: member.full_name || "N/A",
      mobile: member.phone || member.phone_number || "N/A",
      email: member.email || "N/A",
      type: member.role_name || member.role || memberType,
      parentName: member.parent_name || "N/A",
      parentMobile: member.parent_user_code || "N/A",
      parentRole: member.parent_role || "N/A",
      registrationDate: new Date(member.created_at).toLocaleDateString("en-GB"),
      website: "nkpay4all.com/",
      mainBalance: member.wallet_balance || 0,
      aepsBalance: member.aeps_balance || 0,
      commission: member.commission_balance || 0,
      md: member.md_stock || 0,
      distributor: member.distributor_stock || 0,
      retailer: member.retailer_stock || 0,
      user_code: member.user_code || "",
      scheme_name: member.scheme_name || "N/A",
      state: member.state || "",
      city: member.city || "",
      is_active: member.is_active,
      originalData: member,
    }));

    dataTransformRef.current.set(cacheKey, transformed);
    return transformed;
  }, [members, memberType]);

  // Action handlers
  const handleToggle = useCallback(
    async (indexInDisplay) => {
      const member = transformedData[indexInDisplay];
      if (!member) return;

      const newStatus = !member.status;
      return handleActionWithLoading(
        async () => {
          const result = await updateMemberStatus(member.id, newStatus);
          if (result.success) {
            await refreshData();
          }
          return result;
        },
        `${config.title} member ${
          newStatus ? "activated" : "deactivated"
        } successfully`,
        "toggle member status"
      );
    },
    [
      transformedData,
      updateMemberStatus,
      refreshData,
      handleActionWithLoading,
      config.title,
    ]
  );

  const handleDelete = useCallback(
    async (memberId) => {
      if (!mountedRef.current) return;

      const confirmed = window.confirm(
        `Are you sure you want to delete this ${config.title.toLowerCase()} member? This action cannot be undone.`
      );
      if (!confirmed) return;

      return handleActionWithLoading(
        async () => {
          const result = await deleteMember(memberId);
          if (result.success) {
            await refreshData();
          }
          return result;
        },
        `${config.title} member deleted successfully`,
        "delete member"
      );
    },
    [deleteMember, refreshData, handleActionWithLoading, config.title]
  );

  const handlePageChange = useCallback(
    async (newPage) => {
      if (newPage < 1 || newPage > totalPages || newPage === currentPage)
        return;

      try {
        await goToPage(newPage);
      } catch (error) {
        handleError(error, "pagination");
      }
    },
    [currentPage, totalPages, goToPage, handleError]
  );

  const handleFilterChange = useCallback(
    (name, value) => {
      updateFilters({ [name]: value });
    },
    [updateFilters]
  );

  const handleSearch = useCallback(async () => {
    try {
      await applyFilters();
    } catch (error) {
      handleError(error, "search");
    }
  }, [applyFilters, handleError]);

  const handleResetFilters = useCallback(async () => {
    try {
      await resetFilters();
    } catch (error) {
      handleError(error, "reset filters");
    }
  }, [resetFilters, handleError]);

  const handleRefresh = useCallback(async () => {
    return handleActionWithLoading(
      async () => {
        await refreshData();
        return { success: true };
      },
      `${config.title} data refreshed successfully`,
      "refresh"
    );
  }, [refreshData, handleActionWithLoading, config.title]);

  const handleExport = useCallback(async () => {
    return handleActionWithLoading(
      async () => {
        const csvContent = [
          [
            "ID",
            "Username",
            "Mobile",
            "Email",
            "Role",
            "Parent",
            "State",
            "City",
            "Status",
            "Main Balance",
            "AEPS Balance",
            "Commission",
            "Registration Date",
          ],
          ...transformedData.map((member) => [
            member.id,
            member.username,
            member.mobile,
            member.email,
            member.type,
            member.parentName,
            member.state,
            member.city,
            member.status ? "Active" : "Inactive",
            member.mainBalance,
            member.aepsBalance,
            member.commission,
            member.registrationDate,
          ]),
        ]
          .map((row) => row.join(","))
          .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${memberType}_members_${
          new Date().toISOString().split("T")[0]
        }.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        return { success: true };
      },
      `${config.title} members exported successfully`,
      "export"
    );
  }, [transformedData, memberType, handleActionWithLoading, config.title]);

  // Modal handlers
  const handleEditClick = useCallback((title, row) => {
    setEditData(row);
    setEditModal(title);
  }, []);

  const handleFormSubmit = useCallback(
    (formData) => {
      console.log(`${config.title} form submitted:`, formData);
      setEditModal(null);
    },
    [config.title]
  );

  const handleStockSubmit = useCallback(
    (type, value) => {
      console.log(`${config.title} stock submitted [${type}]: ${value}`);
    },
    [config.title]
  );

  // Filter fields configuration
  const fields = useMemo(
    () => [
      {
        name: "fromDate",
        type: "date",
        placeholder: "From Date",
        value: filters.date_from || "",
        onChange: (val) => handleFilterChange("date_from", val),
      },
      {
        name: "toDate",
        type: "date",
        placeholder: "To Date",
        value: filters.date_to || "",
        onChange: (val) => handleFilterChange("date_to", val),
      },
      {
        name: "searchValue",
        type: "text",
        placeholder: "Search Name, Email, Phone, User Code",
        value: filters.search || "",
        onChange: (val) => handleFilterChange("search", val),
      },
      {
        name: "status",
        type: "select",
        placeholder: "Select Status",
        value:
          filters.is_active !== undefined
            ? filters.is_active
              ? "active"
              : "inactive"
            : "",
        onChange: (val) => {
          if (val === "") {
            handleFilterChange("is_active", undefined);
          } else {
            handleFilterChange("is_active", val === "active");
          }
        },
        options: [
          { label: "All Status", value: "" },
          { label: "Active", value: "active" },
          { label: "Inactive", value: "inactive" },
        ],
      },
      {
        name: "scheme",
        type: "select",
        placeholder: "Select Scheme",
        value: filters.scheme || "",
        onChange: (val) => handleFilterChange("scheme", val),
        options: [
          { label: "All Schemes", value: "" },
          ...schemes.map((scheme) => ({
            label: scheme.name || scheme.scheme_name || "Unknown",
            value: scheme.id || scheme.scheme_id || scheme.name,
          })),
        ],
      },
    ],
    [filters, handleFilterChange, schemes]
  );

  // Actions configuration
  const actions = useMemo(
    () => [
      {
        label: "Fund Transfer / Return",
        icon: <FiRepeat />,
        onClick: (row) => handleEditClick("fund_Transfer", row),
      },
      ...(config.hasSchemeManager
        ? [
            {
              label: "Scheme",
              icon: <FiSettings />,
              onClick: (row) => handleEditClick("Scheme", row),
            },
          ]
        : []),
      ...(config.hasStockManager
        ? [
            {
              label: "Add Id Stock",
              icon: <FiUserPlus />,
              onClick: (row) => handleEditClick("Add_ID_Stock", row),
            },
          ]
        : []),
      {
        label: "Permission",
        icon: <FiShield />,
        onClick: (row) => handleEditClick("Permission", row),
      },
      {
        label: "View Profile",
        icon: <FiUserPlus />,
        onClick: (row) => handleEditClick("View_Profile", row),
      },
      {
        label: "Kyc Manager",
        icon: <FiShield />,
        onClick: (row) => handleEditClick("Kyc_Manager", row),
      },
    ],
    [handleEditClick, config.hasSchemeManager, config.hasStockManager]
  );

  // Reports configuration
  const reports = useMemo(
    () => [
      {
        label: "BillPayment",
        icon: <FiFileText />,
        onClick: (row) => handleEditClick("billpayment", row),
      },
      {
        label: "Recharge",
        icon: <FiSmartphone />,
        onClick: (row) => handleEditClick("recharge", row),
      },
      {
        label: "AEPS",
        icon: <FiUserCheck />,
        onClick: (row) => handleEditClick("aeps", row),
      },
      {
        label: "Money Transfer",
        icon: <FiSend />,
        onClick: (row) => handleEditClick("money_transfer", row),
      },
      {
        label: "UTI Pancard",
        icon: <FiCreditCard />,
        onClick: (row) => handleEditClick("uti_pancard", row),
      },
      {
        label: "Account Statement",
        icon: <FiBarChart2 />,
        onClick: (row) => handleEditClick("account_statement", row),
      },
      {
        label: "AEPS Wallet",
        icon: <FiDatabase />,
        onClick: (row) => handleEditClick("aeps_wallet", row),
      },
      {
        label: "Commission Wallet",
        icon: <FiTrendingUp />,
        onClick: (row) => handleEditClick("commission_wallet", row),
      },
    ],
    [handleEditClick]
  );

  // Table columns configuration
  const columns = useMemo(
    () => [
      {
        header: "#",
        accessor: "id",
        render: (row, idx) => (
          <div className="flex flex-col">
            <div className="flex gap-2 items-center">
              <ToggleButton row={row} onchange={() => handleToggle(idx)} />
              <span>{row.id}</span>
            </div>
            <span className="text-xs text-gray-500">{row.date}</span>
          </div>
        ),
      },
      {
        header: "NAME",
        accessor: "name",
        render: (row) => (
          <div className="flex flex-col">
            <span className="font-medium">{row.username}</span>
            <span className="text-sm text-gray-600">{row.mobile}</span>
            <span className="text-xs text-gray-500">{row.type}</span>
          </div>
        ),
      },
      {
        header: "PARENT DETAILS",
        accessor: "parentDetails",
        render: (row) => (
          <div className="flex flex-col">
            <span className="font-medium">{row.parentName}</span>
            <span className="text-sm text-gray-600">{row.parentMobile}</span>
            <span className="text-xs text-gray-500">{row.parentRole}</span>
          </div>
        ),
      },
      {
        header: "COMPANY PROFILE",
        accessor: "companyProfile",
        render: (row) => (
          <div className="flex flex-col">
            <span className="text-sm">{row.registrationDate}</span>
            <span className="text-sm text-blue-400">{row.website}</span>
          </div>
        ),
      },
      {
        header: "WALLET DETAILS",
        accessor: "walletDetails",
        render: (row) => (
          <div className="flex flex-col">
            <span className="text-sm">Main: {row.mainBalance} ₹</span>
          </div>
        ),
      },
      {
        header: "ID STOCK",
        accessor: "idStock",
        render: (row) => (
          <div className="flex flex-col">
            <span className="text-sm">MD: {row.md}</span>
            <span className="text-sm">Distributor: {row.distributor}</span>
            <span className="text-sm">Retailer: {row.retailer}</span>
          </div>
        ),
      },
      {
        header: "ACTION",
        accessor: "action",
        render: (row) => (
          <div className="flex flex-col gap-2">
            <ActionDropdown items={actions} row={row} />
            <ActionDropdown items={reports} row={row} buttonLabel="Reports" />
          </div>
        ),
      },
    ],
    [actions, reports, handleToggle]
  );

  // Mock user data for profile
  const user = useMemo(
    () => ({
      Profile_Details: {
        name: "BANDARU KISHORE BABU",
        mobile: "7997991899",
        state: "Telangana",
        city: "HYDERABAD",
        gender: "",
        pinCode: "500089",
        email: "support@phonepays.in",
        securityPin: "",
        address: "7-15/62,PLOT NO 62,ROAD NO 4.SI",
      },
      KYC_Profile: {
        shopName: "",
        gstNumber: "",
        aadharNumber: "",
        panNumber: "",
        securityPin: "",
        passportPhoto: "",
      },
      Password_Manager: {
        newPassword: "",
        confirmPassword: "",
        securityPin: "",
      },
      Pin_Manager: {
        newPin: "",
        confirmPin: "",
        otp: "",
      },
      Bank_Details: {
        accountNUmber: "",
        bankName: "",
        ifscCode: "",
        securityPin: "",
      },
      Cetificate_Manager: {
        cmo: "",
        coo: "",
      },
      Role_Manager: {
        membersRole: "",
        securityPin: "",
      },
      Mapping_Manager: {
        parentMember: "",
        securityPin: "",
      },
    }),
    []
  );

  return (
    <div className="h-[90vh] 2xl:max-w-[80%] p-4 mx-8 dark:bg-darkBlue/70 rounded-2xl 2xl:mx-auto text-gray-800 overflow-hidden overflow-y-auto px-4 pb-6 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
      <div className="my-4 p-4 rounded-md bg-white dark:bg-transparent">
        <div className="flex gap-3 justify-between">
          <h2 className="text-2xl font-bold dark:text-adminOffWhite">
            {config.title} List {totalMembers > 0 && `(${totalMembers})`}
          </h2>
          <div className="flex items-center gap-2">
            <button
              className="btn-24 text-adminOffWhite bg-accentRed"
              onClick={handleRefresh}
              disabled={loading || actionLoading}
            >
              {loading || actionLoading ? "Loading..." : "Refresh"}
            </button>
            <button
              className="btn-24 text-adminOffWhite bg-accentGreen"
              onClick={handleExport}
              disabled={actionLoading}
            >
              {actionLoading ? "Exporting..." : "Export"}
            </button>
          </div>
        </div>
        <FilterBar
          fields={fields}
          onSearch={handleSearch}
          onReset={handleResetFilters}
        />
      </div>

      <div className="flex items-center justify-between mb-2">
        <div className="">
          {loading && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Loading {config.title.toLowerCase()} members...
            </div>
          )}
          {initialLoading && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Initializing data...
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Link
            to="create"
            className="px-2 py-1 cursor-pointer bg-accentGreen rounded text-adminOffWhite"
          >
            Create {config.title}
          </Link>
        </div>
      </div>

      <PaginatedTable
        data={transformedData}
        columns={columns}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        loading={loading}
        pageSize={pageSize}
      />

      {editModal && (
        <SuperModal onClose={() => setEditModal(null)}>
          {editModal === "fund_Transfer" && (
            <FundActionForm
              onClose={() => setEditModal(null)}
              onSubmit={handleFormSubmit}
            />
          )}

          {editModal === "Scheme" && SchemeManagerComponent && (
            <SchemeManagerComponent onClose={() => setEditModal(null)} />
          )}

          {editModal === "Add_ID_Stock" && StockManagerComponent && (
            <StockManagerComponent
              onClose={() => setEditModal(null)}
              onSubmitRow={handleStockSubmit}
            />
          )}

          {editModal === "Permission" && <CheckBoxPermissionForm />}
          {editModal === "Kyc_Manager" && <KycStatusForm />}
          {editModal === "View_Profile" && <ProfileSettings user={user} />}
        </SuperModal>
      )}
    </div>
  );
};

export default BaseMemberComponent;
