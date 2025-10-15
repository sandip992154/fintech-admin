import { useEffect, useState, useMemo, useCallback, memo } from "react";
import { toast } from "react-toastify";
import schemeManagementService from "../../services/schemeManagementService";
// import ExcelToJsonWithExcelJS from "../../utility/ExcelToJsonWithExcelJS";
import AEPSSlabManager from "./AEPSSlabManager";
import CommissionImportExport from "./CommissionImportExport";
import { SuperModal } from "../utility/SuperModel";
import { useRolePermissions } from "../../hooks/useRolePermissions";

const CommissionEditableForm = memo(
  ({
    serviceKey,
    commission = [],
    onClose,
    setSelectedCommission,
    schemeId = null,
    serviceType = null,
  }) => {
    console.log("commission", commission);
    // Role-based permissions
    const {
      canEditCommissionField,
      commissionFieldRules,
      validateCommissionHierarchy,
      roleInfo,
      hasCommissionPermission,
    } = useRolePermissions();

    // Memoize safe commission to prevent unnecessary re-computations
    const safeCommission = useMemo(
      () => (Array.isArray(commission) ? commission : []),
      [commission]
    );

    // Memoize commission field rules
    const fieldRules = useMemo(
      () => commissionFieldRules || {},
      [commissionFieldRules]
    );

    // Memoize visible columns based on user role
    const visibleColumns = useMemo(() => {
      const allColumns = [
        { key: "admin", label: "Admin" },
        { key: "whitelabel", label: "Whitelabel" },
        { key: "masterdistributor", label: "MD" },
        { key: "distributor", label: "Distributor" },
        { key: "retailer", label: "Retailer" },
        { key: "customer", label: "Customer" },
      ];

      // Show columns that user can edit or view
      return allColumns.filter(
        (col) =>
          canEditCommissionField(col.key) || fieldRules[col.key]?.editable
      );
    }, [canEditCommissionField, fieldRules]);

    // Check if user has permission to edit commissions
    const canEditCommissions = hasCommissionPermission("update");

    console.log("canEditCommissionField", canEditCommissions);

    // Memoize service type mapping to prevent recreating object on every render
    const serviceTypeMap = useMemo(
      () => ({
        MobileRecharge: "mobile_recharge",
        DTHRecharge: "dth_recharge",
        BillPayments: "bill_payments",
        AEPS: "aeps",
        DMT: "dmt",
        MicroATM: "micro_atm",
      }),
      []
    );

    const [editableCommission, setEditableCommission] = useState([]);
    const [operators, setOperators] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showAEPSSlabs, setShowAEPSSlabs] = useState(false);
    const [showImportExport, setShowImportExport] = useState(false);
    const [submissionProgress, setSubmissionProgress] = useState({
      show: false,
      status: "", // 'processing', 'success', 'error', 'partial'
      message: "",
      details: {
        total: 0,
        processed: 0,
        created: 0,
        updated: 0,
        failed: 0,
        errors: [],
      },
    });

    // Memoize mapped service type to prevent recalculation
    const mappedServiceType = useMemo(
      () => serviceTypeMap[serviceKey] || serviceType,
      [serviceKey, serviceType, serviceTypeMap]
    );

    // Load operators for the service type
    useEffect(() => {
      const loadOperators = async () => {
        try {
          setIsLoading(true);
          console.log("Loading operators for service:", mappedServiceType);

          if (!mappedServiceType) {
            console.warn("No service type provided");
            setOperators([]);
            setEditableCommission([]);
            return;
          }

          const operatorsData =
            await schemeManagementService.getOperatorsByService(
              mappedServiceType
            );

          console.log("Loaded operators:", operatorsData);
          setOperators(operatorsData || []);

          // Always try to fetch existing commissions first if we have a schemeId
          let existingCommissions = [];
          if (schemeId) {
            try {
              console.log(
                "Fetching existing commissions for scheme:",
                schemeId,
                "service:",
                mappedServiceType
              );
              existingCommissions =
                await schemeManagementService.getCommissionsBySchemeAndService(
                  schemeId,
                  mappedServiceType
                );
              console.log("Found existing commissions:", existingCommissions);
            } catch (error) {
              console.log(
                "No existing commissions found or error fetching:",
                error.message
              );
              existingCommissions = [];
            }
          }

          // Create commission structure: merge existing with all operators
          const commissionStructure = (operatorsData || []).map((operator) => {
            // Find existing commission for this operator
            const existingCommission = existingCommissions.find(
              (comm) =>
                comm.operator?.id === operator.id ||
                comm.operator?.name === operator.name
            );

            if (existingCommission) {
              // Use existing commission data and add operator reference
              console.log(
                `Using existing commission for operator ${operator.name}:`,
                existingCommission
              );
              return {
                id: existingCommission.id, // Important: Keep commission ID for updates
                operator_id: operator.id,
                provider: operator.name,
                service_type: mappedServiceType,
                commission_type:
                  existingCommission.commission_type || "percentage",
                admin: existingCommission.admin || "",
                whitelabel: existingCommission.whitelabel || "",
                masterdistributor: existingCommission.masterdistributor || "",
                distributor: existingCommission.distributor || "",
                retailer: existingCommission.retailer || "",
                customer: existingCommission.customer || "",
                is_active: existingCommission.is_active !== false,
                isExisting: true, // Flag to identify existing commissions
                // Add slabs for AEPS service
                ...(mappedServiceType === "aeps" && {
                  slabs: existingCommission.slabs || [],
                }),
              };
            } else {
              // Create empty commission structure for new operators
              console.log(
                `Creating empty commission for operator ${operator.name}`
              );
              return {
                operator_id: operator.id,
                provider: operator.name,
                service_type: mappedServiceType,
                commission_type: "percentage",
                admin: "",
                whitelabel: "",
                masterdistributor: "",
                distributor: "",
                retailer: "",
                customer: "",
                is_active: true,
                isExisting: false, // Flag to identify new commissions
                // Don't initialize slabs for AEPS - they can be added later via slab manager
              };
            }
          });

          console.log("Final commission structure:", commissionStructure);
          setEditableCommission(commissionStructure);
        } catch (error) {
          console.error("Error loading operators:", error);
          toast.error(
            `Failed to load operators: ${error.message || "Unknown error"}`
          );
          setOperators([]);
          setEditableCommission([]);
        } finally {
          setIsLoading(false);
        }
      };

      if (mappedServiceType && schemeId) {
        // Only load if we have both service type and scheme ID
        loadOperators();
      } else {
        console.warn("Missing mapped service type or scheme ID");
        setIsLoading(false);
      }
    }, [mappedServiceType, schemeId]); // Remove safeCommission dependency as we're fetching fresh data

    // Handle input/select changes - memoized to prevent unnecessary re-renders
    const handleChange = useCallback((index, field, value) => {
      setEditableCommission((prev) =>
        Array.isArray(prev)
          ? prev.map((row, i) =>
              i === index ? { ...row, [field]: value } : row
            )
          : []
      );
    }, []);

    // Handle Excel import completion
    const handleImportComplete = useCallback(
      (importedData) => {
        console.log("Import completed with data:", importedData);

        if (!Array.isArray(importedData) || importedData.length === 0) {
          toast.error("No valid data found in the imported file");
          return;
        }

        try {
          // Map imported data to commission structure
          // ExcelToJsonWithExcelJS uses: provider, type,  admin, whitelable, md, distributor, retailer
          const mappedCommissions = importedData.map((row, index) => {
            // Find matching operator by name (exact match)
            const matchingOperator = operators.find(
              (op) => op.name.toLowerCase() === row.provider?.toLowerCase()
            );

            if (!matchingOperator) {
              console.warn(
                `No matching operator found for provider: ${row.provider}`
              );
            }

            return {
              operator_id: matchingOperator?.id || null,
              provider: row.provider || `Unknown Operator ${index + 1}`,
              service_type: mappedServiceType,
              commission_type:
                row.type === "percentage" || row.type === "Percentage"
                  ? "percentage" // Use consistent enum value
                  : "fixed", // Use consistent enum value
              admin: row.admin || "",
              whitelabel: row.whitelable || "", // Note: ExcelToJsonWithExcelJS uses "whitelable" (typo in original)
              masterdistributor: row.md || "",
              distributor: row.distributor || "",
              retailer: row.retailer || "",
              customer: "",
              is_active: true,
            };
          });

          console.log("Mapped commissions:", mappedCommissions);
          setEditableCommission(mappedCommissions);
          toast.success(
            `Successfully imported ${mappedCommissions.length} commission records`
          );
        } catch (error) {
          console.error("Error processing imported data:", error);
          toast.error("Failed to process imported data");
        }
      },
      [operators, mappedServiceType]
    );

    // Reload operators function for external calls
    const reloadOperators = useCallback(async () => {
      try {
        setIsLoading(true);
        console.log("Reloading operators for service:", mappedServiceType);

        if (!mappedServiceType) {
          console.warn("No service type provided for reload");
          return;
        }

        const operatorsData =
          await schemeManagementService.getOperatorsByService(
            mappedServiceType
          );

        console.log("Reloaded operators:", operatorsData);
        setOperators(operatorsData || []);

        // Update existing commission data with new operators if needed
        if (
          Array.isArray(editableCommission) &&
          editableCommission.length > 0
        ) {
          const updatedCommissions = editableCommission.map((commission) => {
            const matchingOperator = (operatorsData || []).find(
              (op) => op.name === commission.provider
            );
            return {
              ...commission,
              operator_id: matchingOperator?.id || commission.operator_id,
            };
          });
          setEditableCommission(updatedCommissions);
        }

        toast.success("Operators reloaded successfully");
      } catch (error) {
        console.error("Error reloading operators:", error);
        toast.error(
          `Failed to reload operators: ${error.message || "Unknown error"}`
        );
      } finally {
        setIsLoading(false);
      }
    }, [mappedServiceType, editableCommission]);
    const handleSubmit = useCallback(async () => {
      if (!schemeId) {
        toast.error("Scheme ID is required to save commissions");
        return;
      }

      // Ensure schemeId is a valid integer
      const schemeIdInt = parseInt(schemeId);
      if (isNaN(schemeIdInt)) {
        toast.error("Invalid Scheme ID format");
        return;
      }

      // Validate service type
      if (!mappedServiceType) {
        toast.error("Service type is required to save commissions");
        return;
      }

      if (!canEditCommissions) {
        toast.error("You don't have permission to edit commissions");
        return;
      }

      setIsSubmitting(true);
      setSubmissionProgress({
        show: true,
        status: "processing",
        message: "Preparing commission data...",
        details: {
          total: 0,
          processed: 0,
          created: 0,
          updated: 0,
          failed: 0,
          errors: [],
        },
      });

      try {
        // Validate commission data
        const invalidRows = Array.isArray(editableCommission)
          ? editableCommission.filter((row) => {
              const commissionValues = [
                row.admin,
                row.whitelabel,
                row.masterdistributor,
                row.distributor,
                row.retailer,
                row.customer,
              ];
              return commissionValues.some(
                (val) => val !== "" && (isNaN(val) || val < 0)
              );
            })
          : [];

        if (invalidRows.length > 0) {
          toast.error(
            "Please enter valid commission values (positive numbers only)"
          );
          return;
        }

        // Validate commission hierarchy for each row
        // Custom hierarchy validation: only check non-empty fields, and ensure parent >= child
        const hierarchyViolations = Array.isArray(editableCommission)
          ? editableCommission.filter((row) => {
              // Only check if at least two fields are filled
              const levels = [
                { key: "whitelabel", label: "Whitelabel" },
                { key: "masterdistributor", label: "MD" },
                { key: "distributor", label: "Distributor" },
                { key: "retailer", label: "Retailer" },
                { key: "customer", label: "Customer" },
              ];
              let lastValue = null;
              for (let i = 0; i < levels.length; i++) {
                const val = row[levels[i].key];
                if (
                  val !== undefined &&
                  val !== null &&
                  val !== "" &&
                  !isNaN(val)
                ) {
                  const num = parseFloat(val);
                  if (lastValue !== null && num > lastValue) {
                    // Child commission is greater than parent
                    return true;
                  }
                  lastValue = num;
                }
              }
              return false;
            })
          : [];

        if (hierarchyViolations.length > 0) {
          toast.error(
            "Commission hierarchy violation: Parent role commission must be greater than or equal to child role commission"
          );
          return;
        }

        // Separate existing commissions (to update) from new ones (to create)
        const commissionsToUpdate = [];
        const commissionsToCreate = [];

        const commissionsToProcess = Array.isArray(editableCommission)
          ? editableCommission.filter((row) => {
              // Only process rows with at least one commission value and valid operator
              if (!row.operator_id) {
                console.warn("Skipping row with missing operator_id:", row);
                return false;
              }

              const commissionValues = [
                row.admin,
                row.whitelabel,
                row.masterdistributor,
                row.distributor,
                row.retailer,
                row.customer,
              ];
              return commissionValues.some((val) => val !== "" && !isNaN(val));
            })
          : [];

        // Categorize commissions into update/create groups
        commissionsToProcess.forEach((row) => {
          const commissionData = {
            service_type: mappedServiceType,
            commission_type:
              row.commission_type === "percentage" ||
              row.commission_type === "percent"
                ? "percentage"
                : row.commission_type === "fixed" ||
                  row.commission_type === "flat"
                ? "fixed"
                : row.commission_type || "fixed",
            admin: parseFloat(row.admin) || 0,
            whitelabel: parseFloat(row.whitelabel) || 0,
            masterdistributor: parseFloat(row.masterdistributor) || 0,
            distributor: parseFloat(row.distributor) || 0,
            retailer: parseFloat(row.retailer) || 0,
            customer: parseFloat(row.customer) || 0,
            is_active: row.is_active !== false,
          };

          // Add slabs for AEPS service
          if (mappedServiceType === "aeps") {
            // Only include slabs if they exist and are not empty
            if (row.slabs && row.slabs.length > 0) {
              commissionData.slabs = row.slabs;
            }
            // If no slabs, don't include the field to avoid backend validation error
          }

          if (row.isExisting && row.id) {
            // Existing commission - add to update list
            commissionsToUpdate.push({
              id: row.id,
              data: commissionData,
              provider: row.provider,
            });
          } else {
            // New commission - add to create list
            commissionsToCreate.push({
              operator: row.provider,
              ...commissionData,
            });
          }
        });

        if (
          commissionsToUpdate.length === 0 &&
          commissionsToCreate.length === 0
        ) {
          toast.error("Please add commission values for at least one operator");
          setSubmissionProgress((prev) => ({
            ...prev,
            show: false,
          }));
          return;
        }

        const totalOperations =
          commissionsToUpdate.length + commissionsToCreate.length;
        setSubmissionProgress((prev) => ({
          ...prev,
          message: `Processing ${totalOperations} commission operations...`,
          details: {
            ...prev.details,
            total: totalOperations,
          },
        }));

        console.log("Processing commissions:", {
          toUpdate: commissionsToUpdate.length,
          toCreate: commissionsToCreate.length,
          updateList: commissionsToUpdate,
          createList: commissionsToCreate,
        });

        let updateSuccessCount = 0;
        let createSuccessCount = 0;
        const errors = [];

        // Use the new bulk create and update method for better performance
        if (commissionsToUpdate.length > 0 || commissionsToCreate.length > 0) {
          console.log("Processing bulk commission operations...");

          setSubmissionProgress((prev) => ({
            ...prev,
            message: "Executing bulk commission operations...",
          }));

          try {
            // Prepare bulk data with all entries marked appropriately
            const allEntries = [
              ...commissionsToCreate.map((comm) => ({
                ...comm,
                isExisting: false,
              })),
              ...commissionsToUpdate.map((comm) => ({
                operator: comm.provider,
                ...comm.data,
                isExisting: true,
                commission_id: comm.id,
              })),
            ];

            const bulkResult =
              await schemeManagementService.bulkCreateAndUpdateCommissions({
                scheme_id: schemeIdInt,
                service: mappedServiceType,
                entries: allEntries,
              });

            updateSuccessCount = bulkResult.updated_entries || 0;
            createSuccessCount = bulkResult.created_entries || 0;

            if (bulkResult.errors && bulkResult.errors.length > 0) {
              errors.push(...bulkResult.errors);
            }

            setSubmissionProgress((prev) => ({
              ...prev,
              status: errors.length > 0 ? "partial" : "success",
              message: `Bulk operation completed`,
              details: {
                ...prev.details,
                processed: bulkResult.successful_entries || 0,
                created: createSuccessCount,
                updated: updateSuccessCount,
                failed: bulkResult.failed_entries || 0,
                errors: bulkResult.errors || [],
              },
            }));

            console.log("Bulk operation results:", {
              created: createSuccessCount,
              updated: updateSuccessCount,
              failed: bulkResult.failed_entries || 0,
              errors: bulkResult.errors || [],
            });
          } catch (error) {
            console.error("Bulk operation failed:", error);
            errors.push(`Bulk operation failed: ${error.message}`);

            setSubmissionProgress((prev) => ({
              ...prev,
              status: "error",
              message: "Bulk operation failed, trying individual operations...",
            }));

            // Fallback to individual operations if bulk fails
            console.log("Falling back to individual operations...");

            // Handle updates for existing commissions
            if (commissionsToUpdate.length > 0) {
              console.log("Updating existing commissions individually...");
              for (const commission of commissionsToUpdate) {
                try {
                  await schemeManagementService.updateCommission(
                    commission.id,
                    commission.data
                  );
                  updateSuccessCount++;
                  setSubmissionProgress((prev) => ({
                    ...prev,
                    details: {
                      ...prev.details,
                      processed: prev.details.processed + 1,
                      updated: updateSuccessCount,
                    },
                  }));
                  console.log(
                    `Successfully updated commission for ${commission.provider}`
                  );
                } catch (error) {
                  console.error(
                    `Failed to update commission for ${commission.provider}:`,
                    error
                  );
                  errors.push(
                    `Failed to update ${commission.provider}: ${error.message}`
                  );
                  setSubmissionProgress((prev) => ({
                    ...prev,
                    details: {
                      ...prev.details,
                      failed: prev.details.failed + 1,
                      errors: [
                        ...prev.details.errors,
                        `Update failed for ${commission.provider}`,
                      ],
                    },
                  }));
                }
              }
            }

            // Handle creation of new commissions
            if (commissionsToCreate.length > 0) {
              console.log("Creating new commissions individually...");
              try {
                const createResult =
                  await schemeManagementService.bulkCreateCommissions({
                    scheme_id: schemeIdInt,
                    service: mappedServiceType,
                    entries: commissionsToCreate,
                  });
                createSuccessCount =
                  createResult.successful_entries || commissionsToCreate.length;
                setSubmissionProgress((prev) => ({
                  ...prev,
                  details: {
                    ...prev.details,
                    created: createSuccessCount,
                  },
                }));
                console.log(
                  `Successfully created ${createSuccessCount} new commissions`
                );
              } catch (error) {
                console.error("Failed to create new commissions:", error);
                errors.push(
                  `Failed to create new commissions: ${error.message}`
                );
                setSubmissionProgress((prev) => ({
                  ...prev,
                  details: {
                    ...prev.details,
                    errors: [
                      ...prev.details.errors,
                      "Failed to create new commissions",
                    ],
                  },
                }));
              }
            }
          }
        }

        // Show appropriate success/error messages
        const totalSuccess = updateSuccessCount + createSuccessCount;

        // Update final progress status
        setSubmissionProgress((prev) => ({
          ...prev,
          status:
            totalSuccess > 0
              ? errors.length > 0
                ? "partial"
                : "success"
              : "error",
          message:
            totalSuccess > 0
              ? "Commission operations completed"
              : "No operations completed successfully",
          details: {
            ...prev.details,
            processed: totalSuccess,
            created: createSuccessCount,
            updated: updateSuccessCount,
            failed: errors.length,
            errors: errors,
          },
        }));

        if (totalSuccess > 0) {
          const messages = [];
          if (updateSuccessCount > 0) {
            messages.push(`${updateSuccessCount} commission(s) updated`);
          }
          if (createSuccessCount > 0) {
            messages.push(`${createSuccessCount} commission(s) created`);
          }
          toast.success(`Successfully saved: ${messages.join(", ")}!`);
        }

        if (errors.length > 0) {
          console.error("Errors during commission save:", errors);
          toast.error(`Some operations failed: ${errors.join(", ")}`);
        }

        // If we had any success, update parent component and close modal after delay
        if (totalSuccess > 0) {
          setTimeout(() => {
            if (setSelectedCommission) {
              setSelectedCommission(editableCommission);
            }
            onClose(); // close modal
          }, 2000); // Show success for 2 seconds before closing
        } else {
          // Hide progress after 3 seconds if no success
          setTimeout(() => {
            setSubmissionProgress((prev) => ({ ...prev, show: false }));
          }, 3000);
        }
      } catch (error) {
        console.error("Error saving commissions:", error);
        toast.error(error.message || "Failed to save commissions");
        setSubmissionProgress((prev) => ({
          ...prev,
          status: "error",
          message: "Commission operation failed",
          details: {
            ...prev.details,
            errors: [error.message || "Unknown error occurred"],
          },
        }));

        // Hide progress after 3 seconds on error
        setTimeout(() => {
          setSubmissionProgress((prev) => ({ ...prev, show: false }));
        }, 3000);
      } finally {
        setIsSubmitting(false);
      }
    }, [
      schemeId,
      editableCommission,
      setSelectedCommission,
      onClose,
      mappedServiceType,
    ]);

    // Memoize provider list to prevent unnecessary recalculations
    const providerList = useMemo(
      () =>
        Array.isArray(editableCommission)
          ? editableCommission.map((item) => item.provider)
          : [],
      [editableCommission]
    );

    if (isLoading) {
      return (
        <div className="flex flex-col justify-center items-center h-32 space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="text-sm text-gray-600">
            Loading operators for {mappedServiceType}...
          </span>
          <span className="text-xs text-gray-400">
            Service Key: {serviceKey}
          </span>
        </div>
      );
    }

    return (
      <>
        <div className="mb-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {serviceKey.replace(/([A-Z])/g, " $1").trim()} Commission
                Settings
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Set commission rates for each operator. Leave empty fields to
                skip operators.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              {mappedServiceType === "aeps" &&
                hasCommissionPermission("update") && (
                  <button
                    type="button"
                    onClick={() => setShowAEPSSlabs(true)}
                    disabled={
                      !editableCommission.some(
                        (comm) => comm.isExisting && comm.id
                      )
                    }
                    className={`text-sm ${
                      editableCommission.some(
                        (comm) => comm.isExisting && comm.id
                      )
                        ? "btn-secondary"
                        : "btn-secondary opacity-50 cursor-not-allowed"
                    }`}
                    title={
                      !editableCommission.some(
                        (comm) => comm.isExisting && comm.id
                      )
                        ? "Save commissions first to manage AEPS slabs"
                        : "Manage AEPS Commission Slabs"
                    }
                  >
                    AEPS Slabs
                  </button>
                )}
              {hasCommissionPermission("create") && (
                <button
                  type="button"
                  onClick={() => setShowImportExport(true)}
                  className="btn-secondary text-sm"
                >
                  Import/Export
                </button>
              )}
            </div>
          </div>
        </div>

        {/* <ExcelToJsonWithExcelJS
          requiredColumns={[
            "provider",
            "commission_type",
            "admin",
            "whitelabel",
            "masterdistributor",
            "distributor",
            "retailer",
            "customer",
          ]}
          provider={providerList}
          setSelectedCommission={handleImportComplete}
          onDataProcessed={handleImportComplete}
          validProviders={operators.map((op) => op.name)}
        /> */}

        {/* Legend for commission status */}
        <div className="flex items-center space-x-6 mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Commission Status:
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-xs text-green-700 dark:text-green-300">
              Existing (will be updated)
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-xs text-blue-700 dark:text-blue-300">
              New (will be created)
            </span>
          </div>
        </div>

        {/* Progress Indicator */}
        {submissionProgress.show && (
          <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center space-x-3 mb-3">
              {submissionProgress.status === "processing" && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              )}
              {submissionProgress.status === "success" && (
                <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                  <svg
                    className="h-3 w-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
              {submissionProgress.status === "error" && (
                <div className="h-5 w-5 rounded-full bg-red-500 flex items-center justify-center">
                  <svg
                    className="h-3 w-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
              {submissionProgress.status === "partial" && (
                <div className="h-5 w-5 rounded-full bg-yellow-500 flex items-center justify-center">
                  <svg
                    className="h-3 w-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {submissionProgress.message}
              </span>
            </div>

            {submissionProgress.details.total > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                  <span>Progress</span>
                  <span>
                    {submissionProgress.details.processed}/
                    {submissionProgress.details.total}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      submissionProgress.status === "success"
                        ? "bg-green-500"
                        : submissionProgress.status === "error"
                        ? "bg-red-500"
                        : submissionProgress.status === "partial"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        (submissionProgress.details.processed /
                          submissionProgress.details.total) *
                          100
                      )}%`,
                    }}
                  ></div>
                </div>

                {(submissionProgress.details.created > 0 ||
                  submissionProgress.details.updated > 0 ||
                  submissionProgress.details.failed > 0) && (
                  <div className="flex flex-wrap gap-4 text-xs pt-2">
                    {submissionProgress.details.created > 0 && (
                      <span className="text-green-600 dark:text-green-400">
                        ✓ {submissionProgress.details.created} created
                      </span>
                    )}
                    {submissionProgress.details.updated > 0 && (
                      <span className="text-blue-600 dark:text-blue-400">
                        ↻ {submissionProgress.details.updated} updated
                      </span>
                    )}
                    {submissionProgress.details.failed > 0 && (
                      <span className="text-red-600 dark:text-red-400">
                        ✗ {submissionProgress.details.failed} failed
                      </span>
                    )}
                  </div>
                )}

                {submissionProgress.details.errors.length > 0 && (
                  <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                    <div className="text-xs text-red-700 dark:text-red-300 font-medium mb-1">
                      Errors:
                    </div>
                    <ul className="text-xs text-red-600 dark:text-red-400 space-y-1 max-h-20 overflow-y-auto">
                      {submissionProgress.details.errors
                        .slice(0, 5)
                        .map((error, index) => (
                          <li key={index} className="truncate">
                            • {error}
                          </li>
                        ))}
                      {submissionProgress.details.errors.length > 5 && (
                        <li className="text-red-500 italic">
                          ... and {submissionProgress.details.errors.length - 5}{" "}
                          more
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <form className="space-y-4 max-w-full">
          <div className="max-h-[60vh] overflow-y-auto ring-1 ring-gray-700 rounded-md">
            <table className="w-full text-sm table-auto border border-gray-700 border-collapse">
              <thead className="text-gray-400 uppercase bg-darkBlue sticky -top-1 z-10">
                <tr>
                  <th className="py-3 px-4 text-left border border-gray-700">
                    Operator
                  </th>
                  <th className="py-3 px-4 text-left border border-gray-700">
                    Type
                  </th>
                  {visibleColumns.map((column) => (
                    <th
                      key={column.key}
                      className="py-3 px-4 text-left border border-gray-700"
                    >
                      {column.label}
                      {!canEditCommissionField(column.key) && (
                        <span className="ml-1 text-xs text-gray-400">
                          (View Only)
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {editableCommission?.map((row, i) => (
                  <tr
                    key={i}
                    className={`dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 ${
                      row.isExisting
                        ? "border-l-4 border-l-green-500 bg-green-50 dark:bg-green-900/20"
                        : "border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    }`}
                  >
                    <td className="py-2 px-4 border border-gray-700 font-medium">
                      <div className="flex items-center space-x-2">
                        <span>{row.provider}</span>
                        {row.isExisting ? (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full dark:text-green-300 dark:bg-green-800/30">
                            Existing
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full dark:text-blue-300 dark:bg-blue-800/30">
                            New
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-4 border border-gray-700">
                      <select
                        value={row.commission_type || "percentage"}
                        onChange={(e) =>
                          handleChange(i, "commission_type", e.target.value)
                        }
                        className="w-full dark:bg-darkBlue dark:text-white ring-1 ring-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed (₹)</option>
                        {serviceKey === "AEPS" && (
                          <option value="slab_based">Slab Based</option>
                        )}
                      </select>
                    </td>
                    {visibleColumns.map((column) => {
                      const canEdit = canEditCommissionField(column.key);
                      const value = row[column.key] || "";

                      return (
                        <td
                          key={column.key}
                          className="py-2 px-4 border border-gray-700"
                        >
                          {canEdit ? (
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={value}
                              onChange={(e) =>
                                handleChange(i, column.key, e.target.value)
                              }
                              className="w-full dark:bg-darkBlue dark:text-white ring-1 ring-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="0.00"
                            />
                          ) : (
                            <div className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md">
                              {value || "0.00"}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {Array.isArray(editableCommission) &&
            editableCommission.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <div className="mb-2">
                  No operators found for this service type.
                </div>
                <div className="text-sm">
                  Service: {mappedServiceType} | Operators Available:{" "}
                  {operators.length}
                </div>
                {operators.length > 0 && (
                  <button
                    onClick={reloadOperators}
                    className="mt-2 text-blue-500 hover:text-blue-700 text-sm underline"
                  >
                    Reload Operators
                  </button>
                )}
              </div>
            )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md font-medium hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={
                !canEditCommissions ||
                isSubmitting ||
                !Array.isArray(editableCommission) ||
                editableCommission.length === 0
              }
              className={`px-6 py-2 rounded-md font-medium text-white ${
                !canEditCommissions ||
                isSubmitting ||
                !Array.isArray(editableCommission) ||
                editableCommission.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#7C5CFC] hover:bg-[#6938EF]"
              }`}
              title={
                !canEditCommissions
                  ? "You don't have permission to edit commissions"
                  : ""
              }
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
                  Saving...
                </div>
              ) : (
                "Save Commissions"
              )}
            </button>
          </div>
        </form>

        {/* AEPS Slab Manager Modal */}
        {showAEPSSlabs &&
          (() => {
            const existingCommission = editableCommission.find(
              (comm) => comm.isExisting && comm.id
            );
            const commissionId = existingCommission?.id;
            console.log(
              "Opening AEPS Slab Manager with commissionId:",
              commissionId
            );
            console.log("Existing commission:", existingCommission);
            console.log("All commissions:", editableCommission);

            return (
              <SuperModal
                onClose={() => setShowAEPSSlabs(false)}
                className="max-w-6xl"
              >
                <AEPSSlabManager
                  commissionId={commissionId}
                  schemeId={schemeId}
                  onClose={() => setShowAEPSSlabs(false)}
                />
              </SuperModal>
            );
          })()}

        {/* Import/Export Modal */}
        {showImportExport && (
          <SuperModal
            onClose={() => setShowImportExport(false)}
            className="max-w-4xl"
          >
            <CommissionImportExport
              schemeId={schemeId}
              serviceType={mappedServiceType}
              operators={operators}
              onClose={() => setShowImportExport(false)}
              onImportComplete={(importedData) => {
                handleImportComplete(importedData);
                setShowImportExport(false);
              }}
              onReloadNeeded={reloadOperators}
            />
          </SuperModal>
        )}
      </>
    );
  }
);

// Add display name for better debugging
CommissionEditableForm.displayName = "CommissionEditableForm";

export default CommissionEditableForm;
