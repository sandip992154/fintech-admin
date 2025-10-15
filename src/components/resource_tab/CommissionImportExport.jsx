/**
 * Commission Import/Export Component
 * =================================
 *
 * Component for importing and exporting commission data
 * with Excel/CSV support and validation.
 */

import React, { useState, useCallback } from "react";
import {
  FaUpload,
  FaDownload,
  FaFileExcel,
  FaFileCsv,
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
} from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useRolePermissions } from "../../hooks/useRolePermissions";
import schemeManagementService from "../../services/schemeManagementService";
import ExcelToJsonWithExcelJS from "../utility/ExcelToJsonWithExcelJS";

const CommissionImportExport = ({
  schemeId,
  operators = [],
  serviceType = null,
  onClose = () => {},
  onImportComplete = () => {},
}) => {
  const { hasCommissionPermission } = useRolePermissions();

  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [validationResults, setValidationResults] = useState(null);
  const [importData, setImportData] = useState(null);

  // Define required columns for the Excel import
  const requiredColumns = [
    "provider",
    "type",
    "superadmin",
    "admin",
    "whitelable",
    "md",
    "distributor",
    "retailer",
  ];

  // Handle data from ExcelToJsonWithExcelJS component
  const handleImportData = useCallback(
    (jsonData) => {
      console.log("Received data from ExcelToJsonWithExcelJS:", jsonData);

      if (!Array.isArray(jsonData) || jsonData.length === 0) {
        toast.error("No valid data found in the imported file");
        setImportData(null);
        setValidationResults(null);
        return;
      }

      try {
        // Validate the imported data
        const validation = validateImportData(jsonData);
        setValidationResults(validation);

        if (validation.isValid) {
          setImportData(jsonData);
          // Pass data directly to parent component for form population
          onImportComplete(jsonData);
          toast.success(`Successfully validated ${jsonData.length} records`);
        } else {
          setImportData(null);
          toast.error("Data validation failed. Please check the errors below.");
        }
      } catch (error) {
        console.error("Error processing imported data:", error);
        toast.error("Failed to process imported data");
        setImportData(null);
        setValidationResults(null);
      }
    },
    [operators, onImportComplete]
  );

  // Generate provider array for ExcelToJsonWithExcelJS template
  const providerList = operators.map((operator) => operator.name);

  // Validate import data
  const validateImportData = useCallback(
    (data) => {
      const errors = [];
      const warnings = [];

      if (!Array.isArray(data) || data.length === 0) {
        errors.push("No data found in file");
        return { isValid: false, errors, warnings };
      }

      // Required fields - using 'provider' to match ExcelToJsonWithExcelJS template
      const requiredFields = ["provider"];
      const roleFields = [
        "superadmin",
        "admin", // Added admin field
        "whitelable", // Note: ExcelToJsonWithExcelJS uses "whitelable"
        "md",
        "distributor",
        "retailer",
      ];

      // Get valid operator names for validation
      const validOperatorNames = operators.map((op) => op.name.toLowerCase());

      data.forEach((row, index) => {
        const rowNum = index + 2; // +2 for 1-based indexing and header row

        // Check required fields
        requiredFields.forEach((field) => {
          if (!row[field] || row[field].toString().trim() === "") {
            errors.push(`Row ${rowNum}: Missing required field '${field}'`);
          }
        });

        // Validate operator name against available operators
        if (row.provider && validOperatorNames.length > 0) {
          const operatorExists = validOperatorNames.includes(
            row.provider.toLowerCase()
          );
          if (!operatorExists) {
            errors.push(
              `Row ${rowNum}: Invalid operator name '${
                row.provider
              }'. Available operators: ${operators
                .map((op) => op.name)
                .join(", ")}`
            );
          }
        }

        // Validate commission values
        roleFields.forEach((field) => {
          if (row[field] !== undefined && row[field] !== "") {
            const value = parseFloat(row[field]);
            if (isNaN(value) || value < 0) {
              errors.push(
                `Row ${rowNum}: Invalid commission value for '${field}': ${row[field]}`
              );
            }
            if (value > 100) {
              warnings.push(
                `Row ${rowNum}: Commission value for '${field}' is over 100%: ${value}%`
              );
            }
          }
        });

        // Validate commission hierarchy
        const commissions = {};
        roleFields.forEach((field) => {
          commissions[field] = parseFloat(row[field]) || 0;
        });

        // Check hierarchy: superadmin >= admin >= whitelable >= md >= distributor >= retailer
        if (commissions.superadmin < commissions.admin) {
          errors.push(
            `Row ${rowNum}: Commission hierarchy violation - Admin (${commissions.admin}%) cannot be higher than SuperAdmin (${commissions.superadmin}%)`
          );
        }
        if (commissions.admin < commissions.whitelable) {
          errors.push(
            `Row ${rowNum}: Commission hierarchy violation - Whitelabel (${commissions.whitelable}%) cannot be higher than Admin (${commissions.admin}%)`
          );
        }
        if (commissions.whitelable < commissions.md) {
          errors.push(
            `Row ${rowNum}: Commission hierarchy violation - MD (${commissions.md}%) cannot be higher than Whitelabel (${commissions.whitelable}%)`
          );
        }
        if (commissions.md < commissions.distributor) {
          errors.push(
            `Row ${rowNum}: Commission hierarchy violation - Distributor (${commissions.distributor}%) cannot be higher than MD (${commissions.md}%)`
          );
        }
        if (commissions.distributor < commissions.retailer) {
          errors.push(
            `Row ${rowNum}: Commission hierarchy violation - Retailer (${commissions.retailer}%) cannot be higher than Distributor (${commissions.distributor}%)`
          );
        }
      });

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        totalRows: data.length,
      };
    },
    [operators]
  );

  // Execute import - Not needed since we pass data directly to parent
  const executeImport = useCallback(async () => {
    if (!importData || !validationResults?.isValid) {
      toast.error("No valid data to import");
      return;
    }

    try {
      setImporting(true);

      // Since we're passing data directly to parent component,
      // we don't need to call the API here
      onImportComplete(importData);
      toast.success(
        `Successfully imported ${importData.length} commission records`
      );

      // Close the modal
      onClose();
    } catch (error) {
      console.error("Error importing commissions:", error);
      toast.error("Failed to import commissions");
    } finally {
      setImporting(false);
    }
  }, [importData, validationResults, onImportComplete, onClose]);

  // Export commissions
  const handleExport = useCallback(
    async (format) => {
      try {
        setExporting(true);

        const result = await schemeManagementService.exportCommissions(
          schemeId,
          format
        );

        // Create download link
        const blob = new Blob([result.data], {
          type:
            format === "excel"
              ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              : "text/csv",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `commissions_scheme_${schemeId}.${
          format === "excel" ? "xlsx" : "csv"
        }`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success(`Commission data exported successfully`);
      } catch (error) {
        console.error("Error exporting commissions:", error);
        toast.error("Failed to export commissions");
      } finally {
        setExporting(false);
      }
    },
    [schemeId]
  );

  if (!hasCommissionPermission("create") && !hasCommissionPermission("read")) {
    return (
      <div className="p-6 text-center">
        <div className="text-gray-500">
          You don't have permission to import/export commissions
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Commission Import/Export
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Import commission data from Excel files or export existing data
          </p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <FaTimes size={24} />
        </button>
      </div>

      {/* Import Section */}
      {hasCommissionPermission("create") && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            <FaUpload className="inline mr-2" />
            Import Commissions
          </h3>

          {/* ExcelToJsonWithExcelJS Component */}
          <div className="mb-4">
            <ExcelToJsonWithExcelJS
              requiredColumns={requiredColumns}
              setSelectedCommission={handleImportData}
              provider={providerList}
            />
          </div>

          {/* Validation Results */}
          {validationResults && (
            <div className="mb-4 p-4 border rounded-lg">
              <div className="flex items-center mb-2">
                {validationResults.isValid ? (
                  <FaCheck className="text-green-500 mr-2" />
                ) : (
                  <FaTimes className="text-red-500 mr-2" />
                )}
                <span
                  className={`font-medium ${
                    validationResults.isValid
                      ? "text-green-800 dark:text-green-400"
                      : "text-red-800 dark:text-red-400"
                  }`}
                >
                  {validationResults.isValid
                    ? `✓ Validation Passed - ${validationResults.totalRows} records ready to import`
                    : `✗ Validation Failed - ${validationResults.errors.length} errors found`}
                </span>
              </div>

              {/* Errors */}
              {validationResults.errors.length > 0 && (
                <div className="mb-2">
                  <h4 className="font-medium text-red-800 dark:text-red-400 mb-1">
                    Errors:
                  </h4>
                  <ul className="list-disc list-inside text-sm text-red-700 dark:text-red-300">
                    {validationResults.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Warnings */}
              {validationResults.warnings.length > 0 && (
                <div>
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-400 mb-1">
                    Warnings:
                  </h4>
                  <ul className="list-disc list-inside text-sm text-yellow-700 dark:text-yellow-300">
                    {validationResults.warnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Import Button */}
          {importData && validationResults?.isValid && (
            <button
              onClick={executeImport}
              className="btn-primary w-full"
              disabled={importing}
            >
              {importing ? (
                <ClipLoader size={16} color="#ffffff" className="mr-2" />
              ) : (
                <FaUpload className="mr-2" />
              )}
              Apply {validationResults.totalRows} Records to Form
            </button>
          )}
        </div>
      )}

      {/* Export Section */}
      {hasCommissionPermission("read") && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">
            <FaDownload className="inline mr-2" />
            Export Commissions
          </h3>

          <div className="space-y-3">
            <button
              onClick={() => handleExport("excel")}
              className="btn-primary w-full"
              disabled={exporting}
            >
              {exporting ? (
                <ClipLoader size={16} color="#ffffff" className="mr-2" />
              ) : (
                <FaFileExcel className="mr-2" />
              )}
              Export as Excel (.xlsx)
            </button>

            <button
              onClick={() => handleExport("csv")}
              className="btn-secondary w-full"
              disabled={exporting}
            >
              {exporting ? (
                <ClipLoader size={16} color="#4B5563" className="mr-2" />
              ) : (
                <FaFileCsv className="mr-2" />
              )}
              Export as CSV
            </button>
          </div>

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-sm text-blue-800 dark:text-blue-400">
              <strong>Export includes:</strong>
              <ul className="list-disc list-inside mt-1">
                <li>All commission configurations</li>
                <li>Service type and operator details</li>
                <li>Commission rates for all roles</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <strong>Note:</strong> Import files should match the template format
          exactly. Use the template download button in the Excel component above
          to get the correct format with current operators for{" "}
          {serviceType || "this service"}.
        </div>
      </div>
    </div>
  );
};

export default CommissionImportExport;
