import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import memberService from "../services/memberManagementService";

export const useMemberManagement = (initialRole = null, currentUser = null) => {
  // Early return for invalid parameters
  if (typeof initialRole === "object" && initialRole !== null) {
    console.warn(
      "useMemberManagement: initialRole should be a string, received object. Using null."
    );
    initialRole = null;
  }

  // Core Data States
  const [members, setMembers] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [availableParents, setAvailableParents] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);

  // Loading States
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [schemesLoading, setSchemesLoading] = useState(false);
  const [parentsLoading, setParentsLoading] = useState(false);

  // Error States
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMembers, setTotalMembers] = useState(0);
  const [pageSize] = useState(20);

  // Filter States
  const [filters, setFilters] = useState({
    role: initialRole,
    search: "",
    status: "all",
    parent_id: null,
    scheme: "",
    sort_by: "created_at",
    sort_order: "desc",
  });

  // Performance optimization refs
  const lastRequestRef = useRef(null);
  const requestTimeoutRef = useRef(null);
  const mountedRef = useRef(true);
  const hookErrorRef = useRef(null);

  // Hook error state
  const [hookError, setHookError] = useState(null);

  // Helper Functions
  const clearErrors = useCallback(() => {
    setError(null);
    setActionError(null);
    setHookError(null);
  }, []);

  const handleError = useCallback((error, setErrorFn) => {
    try {
      if (!mountedRef.current) return;

      const errorMessage =
        typeof error === "string"
          ? error
          : error?.response?.data?.message ||
            error?.message ||
            "An error occurred";

      console.error("Member Management Error:", error);

      if (setErrorFn) {
        setErrorFn(errorMessage);
      } else {
        setError(errorMessage);
      }
    } catch (handlerError) {
      console.error("Error in error handler:", handlerError);
      setHookError("Critical error in error handling");
    }
  }, []);

  // Memoized Values - Optimized for performance
  const userAccessLevel = useMemo(() => {
    if (!currentUser?.role_name) return "BASIC";
    return memberService.getUserAccessLevel(currentUser.role_name);
  }, [currentUser?.role_name]);

  const optimizedRequestData = useMemo(() => {
    // Extract role name with multiple fallback options
    const userRole =
      currentUser?.role_name || currentUser?.role?.name || "admin";

    if (!currentUser) {
      return null;
    }

    const baseParams = {
      ...filters,
      page: currentPage,
      limit: pageSize,
      role: initialRole || "admin", // Use the initialRole parameter instead of hardcoded super_admin
    };

    const params = memberService.buildOptimizedParams(
      baseParams,
      userRole,
      "list"
    );

    return params;
  }, [filters, currentPage, pageSize, currentUser, initialRole]);

  const filteredMembers = useMemo(() => {
    if (!filters.search?.trim()) return members;
    const searchTerm = filters.search.toLowerCase().trim();
    return members.filter(
      (member) =>
        member.full_name?.toLowerCase().includes(searchTerm) ||
        member.email?.toLowerCase().includes(searchTerm) ||
        member.phone?.includes(searchTerm) ||
        member.user_code?.toLowerCase().includes(searchTerm)
    );
  }, [members, filters.search]);

  // Data Fetching Functions
  const fetchSchemes = useCallback(
    async (useCache = true) => {
      if (!mountedRef.current) {
        return;
      }

      setSchemesLoading(true);
      try {
        const response = await memberService.getSchemes(useCache);
        if (!mountedRef.current) return;

        // Handle different response structures with fallback
        const schemesData =
          response?.items || response?.schemes || response || [];

        if (mountedRef.current) {
          setSchemes(schemesData?.items);
        } else {
          console.log(
            "fetchSchemes: mountedRef is false, not setting schemes state"
          );
        }
      } catch (err) {
        if (mountedRef.current) {
          console.error("Error fetching schemes:", err);
          handleError(err, setError);
          setSchemes([]);
        }
      } finally {
        if (mountedRef.current) {
          setSchemesLoading(false);
        }
      }
    },
    [handleError]
  );

  const fetchAvailableParents = useCallback(
    async (role, search = null, useCache = true) => {
      if (!role) {
        setAvailableParents([]);
        return;
      }

      if (!mountedRef.current) return;

      setParentsLoading(true);
      try {
        const response = await memberService.getAvailableParents(
          role,
          search,
          useCache,
          currentUser // Pass current user context
        );

        if (mountedRef.current) {
          setAvailableParents(response?.parents || response || []);
        }
      } catch (err) {
        if (mountedRef.current) {
          console.error("Error fetching parent options:", err);
          handleError(err, setError);
          setAvailableParents([]);
        }
      } finally {
        if (mountedRef.current) {
          setParentsLoading(false);
        }
      }
    },
    [handleError, optimizedRequestData]
  );

  const fetchMembers = useCallback(
    async (customFilters = {}, useCache = true) => {
      if (!currentUser?.id) {
        console.log("No current user ID, aborting fetchMembers");
        return;
      }

      if (!optimizedRequestData) {
        console.log("No optimized request data, aborting fetchMembers");
        return;
      }

      // Prevent duplicate requests
      const requestKey = JSON.stringify({
        optimizedRequestData,
        customFilters,
      });
      if (lastRequestRef.current === requestKey && !customFilters.force) {
        return;
      }
      lastRequestRef.current = requestKey;

      setLoading(true);
      clearErrors();

      try {
        const requestData = { ...optimizedRequestData, ...customFilters };

        const response = await memberService.getMembers(requestData, {
          useCache,
        });

        // Only update state if component is still mounted
        if (mountedRef.current) {
          if (response?.members) {
            setMembers(response.members);
            setTotalMembers(response.total || 0);
            setTotalPages(Math.ceil((response.total || 0) / pageSize));
            console.log(
              "Successfully set members data:",
              response.members.length,
              "members"
            );
          } else {
            setMembers([]);
            setTotalMembers(0);
            setTotalPages(1);
          }
        }
      } catch (err) {
        console.error("Error in fetchMembers:", err);
        if (err.name !== "AbortError" && mountedRef.current) {
          handleError(err, setError);
          setMembers([]);
          setTotalMembers(0);
          setTotalPages(1);
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    },
    [currentUser?.id, optimizedRequestData, pageSize, handleError, clearErrors]
  );

  // CRUD Operations
  const createMember = useCallback(
    async (memberData) => {
      if (!mountedRef.current)
        return { success: false, error: "Component unmounted" };

      setActionLoading(true);
      clearErrors();

      try {
        const response = await memberService.createMember(
          memberData,
          currentUser?.role_ame
        );

        if (mountedRef.current) {
          await fetchMembers({ force: true }, false);
        }

        return {
          success: true,
          data: response,
          message: "Member created successfully",
        };
      } catch (err) {
        if (mountedRef.current) {
          const errorMessage = memberService.handleApiError(err);
          handleError(err, setActionError);
          return {
            success: false,
            error: errorMessage,
            message: errorMessage,
          };
        }
        return { success: false, error: "Component unmounted" };
      } finally {
        if (mountedRef.current) {
          setActionLoading(false);
        }
      }
    },
    [fetchMembers, handleError, clearErrors, currentUser?.role_name]
  );

  const updateMember = useCallback(
    async (memberId, memberData) => {
      if (!mountedRef.current)
        return { success: false, error: "Component unmounted" };

      setActionLoading(true);
      clearErrors();

      try {
        const response = await memberService.updateMember(
          memberId,
          memberData,
          currentUser?.role_name
        );

        if (mountedRef.current) {
          await fetchMembers({ force: true }, false);
        }

        return {
          success: true,
          data: response,
          message: "Member updated successfully",
        };
      } catch (err) {
        if (mountedRef.current) {
          const errorMessage = memberService.handleApiError(err);
          handleError(err, setActionError);
          return {
            success: false,
            error: errorMessage,
            message: errorMessage,
          };
        }
        return { success: false, error: "Component unmounted" };
      } finally {
        if (mountedRef.current) {
          setActionLoading(false);
        }
      }
    },
    [fetchMembers, handleError, clearErrors, currentUser?.role_name]
  );

  const deleteMember = useCallback(
    async (memberId) => {
      if (!mountedRef.current)
        return { success: false, error: "Component unmounted" };

      setActionLoading(true);
      clearErrors();

      try {
        await memberService.deleteMember(memberId);

        if (mountedRef.current) {
          await fetchMembers({ force: true }, false);
        }

        return {
          success: true,
          message: "Member deleted successfully",
        };
      } catch (err) {
        if (mountedRef.current) {
          const errorMessage = memberService.handleApiError(err);
          handleError(err, setActionError);
          return {
            success: false,
            error: errorMessage,
            message: errorMessage,
          };
        }
        return { success: false, error: "Component unmounted" };
      } finally {
        if (mountedRef.current) {
          setActionLoading(false);
        }
      }
    },
    [fetchMembers, handleError, clearErrors]
  );

  const updateMemberStatus = useCallback(
    async (memberId, isActive) => {
      if (!mountedRef.current)
        return { success: false, error: "Component unmounted" };

      setActionLoading(true);
      clearErrors();

      try {
        await memberService.updateMemberStatus(memberId, isActive);

        if (mountedRef.current) {
          await fetchMembers({ force: true }, false);
        }

        return {
          success: true,
          message: `Member ${
            isActive ? "activated" : "deactivated"
          } successfully`,
        };
      } catch (err) {
        if (mountedRef.current) {
          const errorMessage = memberService.handleApiError(err);
          handleError(err, setActionError);
          return {
            success: false,
            error: errorMessage,
            message: errorMessage,
          };
        }
        return { success: false, error: "Component unmounted" };
      } finally {
        if (mountedRef.current) {
          setActionLoading(false);
        }
      }
    },
    [fetchMembers, handleError, clearErrors]
  );

  // Filter Management - Optimized with stable references
  const updateFilters = useCallback((newFilters) => {
    // Ensure newFilters is an object
    if (!newFilters || typeof newFilters !== "object") {
      console.warn("updateFilters called with invalid filters:", newFilters);
      return;
    }

    setFilters((prev) => {
      // Only update if filters actually changed to prevent unnecessary re-renders
      const hasChanges = Object.keys(newFilters).some(
        (key) => prev[key] !== newFilters[key]
      );
      if (!hasChanges) return prev;

      setCurrentPage(1); // Reset page when filters change
      return { ...prev, ...newFilters };
    });
  }, []);

  const applyFilters = useCallback(
    (newFilters) => {
      updateFilters(newFilters);
    },
    [updateFilters]
  );

  const resetFilters = useCallback(() => {
    setFilters({
      role: initialRole,
      search: "",
      status: "all",
      parent_id: null,
      scheme: "",
      sort_by: "created_at",
      sort_order: "desc",
    });
    setCurrentPage(1);
  }, [initialRole]);

  // Pagination Management
  const updatePage = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const goToPage = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  // Effects - Optimized to prevent multiple renders

  // Mount effect to ensure mountedRef is properly set
  useEffect(() => {
    mountedRef.current = true;
    // return () => {
    //   console.log(
    //     "useMemberManagement: Hook unmounting, setting mountedRef to false"
    //   );
    // };
  }, []);

  useEffect(() => {
    if (currentUser?.id) {
      // Only fetch schemes and location options once when user is available
      const initializeData = async () => {
        try {
          await Promise.allSettled([fetchSchemes()]);
        } catch (error) {
          console.error("Error initializing data:", error);
        }
      };

      initializeData();
    }
  }, [currentUser?.id, fetchSchemes]); // Include all dependencies

  useEffect(() => {
    if (currentUser?.id) {
      fetchMembers();
    }
  }, [currentUser?.id, filters, currentPage, fetchMembers]); // Include fetchMembers dependency

  // Cache Management - Optimized with stable function references
  const refreshData = useCallback(async () => {
    if (memberService.clearMemberCache) {
      memberService.clearMemberCache();
    }
    await Promise.all([
      fetchMembers({ force: true }, false),
      fetchSchemes(false),
    ]);
  }, [fetchMembers, fetchSchemes]);

  const clearCache = useCallback(() => {
    if (memberService.clearAllCache) {
      memberService.clearAllCache();
    }
  }, []);

  // Cleanup on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      mountedRef.current = false;

      // Clear any pending timeouts
      if (requestTimeoutRef.current) {
        clearTimeout(requestTimeoutRef.current);
      }

      // Clear cache if component is unmounting
      clearCache();
    };
  }, [clearCache]);

  return {
    // Data
    members: filteredMembers,
    schemes,
    availableParents,
    dashboardStats,
    userAccessLevel,

    // Pagination
    currentPage,
    totalPages,
    totalMembers,
    pageSize,

    // Filters
    filters,
    updateFilters,
    applyFilters,
    resetFilters,

    // Loading states
    loading,
    actionLoading,
    schemesLoading,
    parentsLoading,

    // Error states
    error,
    actionError,
    hookError,
    clearErrors,

    // Data fetching functions
    fetchMembers,
    fetchSchemes,
    fetchAvailableParents,

    // CRUD operations
    createMember,
    updateMember,
    deleteMember,
    updateMemberStatus,

    // Pagination functions
    updatePage,
    goToPage,

    // Cache management
    refreshData,
    refresh: refreshData,
    clearCache,

    // Utility functions
    getParentOptions: fetchAvailableParents,
    exportMembers: () => console.log("Export feature needs implementation"),
    bulkUpdateStatus: async (memberIds, status) => {
      // Placeholder for bulk update
      console.log("Bulk update not implemented yet", { memberIds, status });
      return { success: false, message: "Not implemented" };
    },

    // Computed properties
    isLoading: loading || schemesLoading || parentsLoading,
    hasError: !!(error || actionError),
  };
};

export default useMemberManagement;
