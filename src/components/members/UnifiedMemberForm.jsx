/**
 * Unified Member Creation Form Component - Optimized Version
 * Light theme, proper scrolling, backend-compatible fields, performance optimized
 */
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router";
import { useMemberManagement } from "../../hooks/useMemberManagement";
import { toast } from "react-toastify";
import PerformanceMonitor from "../common/PerformanceMonitor";
import {
  FiUser,
  FiMapPin,
  FiBriefcase,
  FiCreditCard,
  FiUsers,
  FiArrowLeft,
  FiAlertCircle,
} from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";

// Optimized validation schema factory with memoization
const createValidationSchema = (memberType) => {
  const baseSchema = {
    full_name: yup
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must not exceed 100 characters")
      .matches(/^[a-zA-Z\s]+$/, "Name should only contain letters and spaces")
      .required("Full name is required"),
    email: yup
      .string()
      .trim()
      .email("Please enter a valid email address")
      .lowercase()
      .required("Email is required"),
    phone: yup
      .string()
      .trim()
      .matches(/^[6-9]\d{9}$/, "Please enter a valid 10-digit phone number")
      .required("Phone number is required"),
    mobile: yup
      .string()
      .trim()
      .matches(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number")
      .nullable()
      .transform((value) => value || null),
    address: yup
      .string()
      .trim()
      .min(10, "Please provide a complete address")
      .max(500, "Address must not exceed 500 characters")
      .required("Address is required"),
    state: yup
      .string()
      .trim()
      .min(2, "Please select a valid state")
      .required("State is required"),
    city: yup
      .string()
      .trim()
      .min(2, "Please select a valid city")
      .required("City is required"),
    pin_code: yup
      .string()
      .trim()
      .matches(/^\d{6}$/, "Please enter a valid 6-digit PIN code")
      .required("PIN code is required"),
    gender: yup
      .string()
      .oneOf(["male", "female", "other"], "Please select a valid gender")
      .nullable()
      .transform((value) => value || null),
    shop_name: yup
      .string()
      .trim()
      .min(2, "Shop name must be at least 2 characters")
      .max(255, "Shop name must not exceed 255 characters")
      .required("Shop name is required"),
    company_name: yup
      .string()
      .trim()
      .max(255, "Company name must not exceed 255 characters")
      .nullable()
      .transform((value) => value || null),
    scheme: yup.string().required("Please select a scheme"),
    pan_card_number: yup
      .string()
      .trim()
      .uppercase()
      .matches(
        /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
        "Please enter a valid PAN card number (e.g., ABCDE1234F)"
      )
      .nullable()
      .transform((value) => value || null),
    company_pan_card: yup
      .string()
      .trim()
      .uppercase()
      .matches(
        /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
        "Please enter a valid company PAN card number"
      )
      .nullable()
      .transform((value) => value || null),
    aadhaar_card_number: yup
      .string()
      .trim()
      .matches(/^\d{12}$/, "Please enter a valid 12-digit Aadhaar number")
      .nullable()
      .transform((value) => value || null),
    parent_id:
      memberType === "admin"
        ? yup.number().nullable()
        : yup.number().required("Parent selection is required"),
    role_name: yup.string().required("Role is required"),
  };

  return yup.object().shape(baseSchema);
};

// Member type configurations
const memberTypeConfig = {
  admin: {
    title: "Create Admin",
    role: "admin",
    color: "bg-blue-600 hover:bg-blue-700",
    icon: FiUser,
    showCompanyFields: true,
  },
  whitelabel: {
    title: "Create White Label",
    role: "whitelabel",
    color: "bg-purple-600 hover:bg-purple-700",
    icon: FiBriefcase,
    showCompanyFields: true,
  },
  mds: {
    title: "Create MDS",
    role: "mds",
    color: "bg-blue-600 hover:bg-blue-700",
    icon: FiUsers,
    showCompanyFields: false,
  },
  distributor: {
    title: "Create Distributor",
    role: "distributor",
    color: "bg-indigo-600 hover:bg-indigo-700",
    icon: FiUsers,
    showCompanyFields: false,
  },
  retailer: {
    title: "Create Retailer",
    role: "retailer",
    color: "bg-green-600 hover:bg-green-700",
    icon: FiBriefcase,
    showCompanyFields: false,
  },
  customer: {
    title: "Create Customer",
    role: "customer",
    color: "bg-orange-600 hover:bg-orange-700",
    icon: FiUser,
    showCompanyFields: false,
  },
};

const UnifiedMemberForm = ({ memberType = "admin", onSubmit }) => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  // Refs for performance optimization
  const mountedRef = useRef(true);
  const formRef = useRef(null);
  const submitTimeoutRef = useRef(null);

  // Memoized configuration to prevent unnecessary re-renders
  const config = useMemo(() => memberTypeConfig[memberType], [memberType]);

  // Memoized validation schema
  const schema = useMemo(
    () => createValidationSchema(memberType),
    [memberType]
  );

  // Get member management functionality
  const {
    schemes,
    schemesLoading,
    availableParents,
    parentsLoading,
    fetchAvailableParents,
    fetchSchemes,
    createMember,
    actionLoading,
    error: hookError,
    clearErrors,
  } = useMemberManagement(memberType, currentUser);

  // Local state with optimized initial values
  const [submitError, setSubmitError] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [formTouched, setFormTouched] = useState(false);

  // Memoized default values
  const defaultValues = useMemo(
    () => ({
      full_name: "",
      email: "",
      phone: "",
      mobile: "",
      address: "",
      state: "",
      city: "",
      pin_code: "",
      gender: "",
      shop_name: "",
      company_name: "",
      scheme: "",
      pan_card_number: "",
      company_pan_card: "",
      aadhaar_card_number: "",
      parent_id: null,
      role_name: config.role,
    }),
    [config.role]
  );

  // Form setup with optimized configuration
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
    mode: "onChange", // Real-time validation for better UX
  });

  // Watch scheme selection for dependent logic
  const selectedScheme = watch("scheme");
  const selectedParentId = watch("parent_id");

  // Cleanup function
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (submitTimeoutRef.current) {
        clearTimeout(submitTimeoutRef.current);
      }
    };
  }, []);

  // Optimized data loading with better error handling
  const loadInitialData = useCallback(async () => {
    if (!mountedRef.current) return;

    try {
      setIsInitialLoading(true);
      setSubmitError(null);
      clearErrors();

      // Load all required data in parallel for better performance
      const promises = [fetchSchemes()];

      // Fetch available parents for non-admin roles
      if (memberType !== "admin") {
        promises.push(fetchAvailableParents(config.role));
      }

      // Wait for all data to load
      await Promise.allSettled(promises);

      console.log(`Initial data loaded for ${memberType} form`);
    } catch (error) {
      console.error("Error loading initial data:", error);
      if (mountedRef.current) {
        setSubmitError(
          "Failed to load form data. Please refresh and try again."
        );
      }
    } finally {
      if (mountedRef.current) {
        setIsInitialLoading(false);
      }
    }
  }, [
    clearErrors,
    fetchSchemes,
    fetchAvailableParents,
    memberType,
    config.role,
  ]);

  // Load initial data on mount
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Optimized form submission handler
  const handleFormSubmit = useCallback(
    async (formData) => {
      if (!mountedRef.current) return;

      try {
        setSubmitError(null);
        setFormTouched(true);

        // Add debounce to prevent double submissions
        if (submitTimeoutRef.current) {
          clearTimeout(submitTimeoutRef.current);
        }

        // Prepare optimized data for backend
        const memberData = {
          ...formData,
          role_name: config.role,
          // Clean and transform data
          full_name: formData.full_name?.trim(),
          email: formData.email?.trim()?.toLowerCase(),
          phone: formData.phone?.trim(),
          mobile: formData.mobile?.trim() || null,
          address: formData.address?.trim(),
          pin_code: formData.pin_code?.trim() || null,
          shop_name: formData.shop_name?.trim(),
          company_name: formData.company_name?.trim() || null,
          pan_card_number:
            formData.pan_card_number?.trim()?.toUpperCase() || null,
          company_pan_card:
            formData.company_pan_card?.trim()?.toUpperCase() || null,
          aadhaar_card_number: formData.aadhaar_card_number?.trim() || null,
          scheme: formData.scheme,
          // Handle parent assignment logic
          parent_id: memberType === "admin" ? null : formData.parent_id || null,
        };

        console.log(`Submitting ${memberType} form with data:`, memberData);

        const result = await createMember(memberData);

        if (mountedRef.current) {
          if (result.success) {
            toast.success(`${config.title} created successfully!`);
            reset(defaultValues);
            setFormTouched(false);

            // Call parent callback if provided
            if (onSubmit) {
              submitTimeoutRef.current = setTimeout(() => {
                onSubmit(result.data);
              }, 100);
            }
          } else {
            const errorMessage =
              result.error || `Failed to create ${memberType}`;
            setSubmitError(errorMessage);
            toast.error(errorMessage);
          }
        }
      } catch (error) {
        console.error(`Error creating ${memberType}:`, error);
        if (mountedRef.current) {
          const errorMessage =
            error.message || `Failed to create ${memberType}`;
          setSubmitError(errorMessage);
          toast.error(errorMessage);
        }
      }
    },
    [config, memberType, createMember, reset, defaultValues, onSubmit]
  );

  // Optimized navigation handler
  const handleGoBack = useCallback(() => {
    if (isDirty && formTouched) {
      const confirmLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
      if (!confirmLeave) return;
    }
    navigate(-1);
  }, [navigate, isDirty, formTouched]);

  // Memoized error state
  const hasErrors = useMemo(() => {
    return !!(submitError || hookError || Object.keys(errors).length > 0);
  }, [submitError, hookError, errors]);

  // Memoized loading state
  const isFormLoading = useMemo(() => {
    return isInitialLoading || actionLoading;
  }, [isInitialLoading, actionLoading]);

  // Optimized styles with memoization
  const styles = useMemo(
    () => ({
      input:
        "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed",
      inputError:
        "w-full px-4 py-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900 placeholder-gray-500 transition-all duration-200",
      label: "block text-sm font-medium text-gray-700 mb-2",
      error: "text-red-600 text-sm mt-1 flex items-center",
      section: "bg-white rounded-lg shadow-sm border border-gray-200",
      sectionHeader:
        "text-lg font-semibold text-gray-900 mb-6 flex items-center",
      button: {
        primary: `px-6 py-3 ${config.color} text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-medium`,
        secondary:
          "px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium",
      },
    }),
    [config.color]
  );

  // Optimized loading screen
  const LoadingScreen = useMemo(
    () => (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">
            Loading {memberType} form...
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Please wait while we prepare the form
          </p>
        </div>
      </div>
    ),
    [memberType]
  );

  // Optimized error display component
  const ErrorDisplay = useMemo(() => {
    if (!submitError && !hookError) return null;

    const errorMessage = submitError || hookError;
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex">
          <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="text-red-700 text-sm mt-1">{errorMessage}</p>
            <button
              onClick={() => {
                setSubmitError(null);
                clearErrors();
              }}
              className="text-red-600 text-sm mt-2 hover:text-red-800 underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    );
  }, [submitError, hookError, clearErrors]);

  // Input component factory
  const createInputField = useCallback(
    (name, type, placeholder, options = {}) => {
      const hasError = errors[name];
      const inputClass = hasError ? styles.inputError : styles.input;

      return (
        <div key={name}>
          <label className={styles.label}>
            {options.label}{" "}
            {options.required && <span className="text-red-500">*</span>}
          </label>
          <input
            type={type}
            {...register(name)}
            className={inputClass}
            placeholder={placeholder}
            disabled={isFormLoading}
            {...options.props}
          />
          {hasError && (
            <p className={styles.error}>
              <FiAlertCircle className="w-4 h-4 mr-1" />
              {hasError.message}
            </p>
          )}
        </div>
      );
    },
    [register, errors, styles, isFormLoading]
  );

  if (isInitialLoading) {
    return LoadingScreen;
  }

  return (
    <div className="h-[90vh] bg-gray-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6 min-h-full">
        {/* Optimized Header */}
        <div className={styles.section + " mb-6"}>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${config.color} shadow-sm`}>
                  <config.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {config.title}
                  </h1>
                  <p className="text-gray-600">
                    Fill in the details to create a new {memberType}
                  </p>
                  {schemes.length > 0 && (
                    <p className="text-sm text-blue-600 mt-1">
                      {schemes.length} scheme{schemes.length !== 1 ? "s" : ""}{" "}
                      available
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={handleGoBack}
                className={styles.button.secondary}
                disabled={isFormLoading}
              >
                <FiArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {ErrorDisplay}

        {/* Optimized Form */}
        <form
          ref={formRef}
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-6"
          noValidate
        >
          {/* Personal Information Section */}
          <div className={styles.section}>
            <div className="p-6">
              <h2 className={styles.sectionHeader}>
                <FiUser className="w-5 h-5 mr-2 text-blue-600" />
                Personal Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {createInputField("full_name", "text", "Enter full name", {
                  label: "Full Name",
                  required: true,
                  props: { autoComplete: "name" },
                })}

                {createInputField("email", "email", "Enter email address", {
                  label: "Email Address",
                  required: true,
                  props: { autoComplete: "email" },
                })}

                {createInputField(
                  "phone",
                  "tel",
                  "Enter 10-digit phone number",
                  {
                    label: "Phone Number",
                    required: true,
                    props: { maxLength: "10", autoComplete: "tel" },
                  }
                )}

                {createInputField(
                  "mobile",
                  "tel",
                  "Enter alternative mobile number",
                  {
                    label: "Mobile Number",
                    props: { maxLength: "10", autoComplete: "tel" },
                  }
                )}

                <div className="md:col-span-2">
                  {createInputField(
                    "shop_name",
                    "text",
                    "Enter shop or business name",
                    {
                      label: "Shop/Business Name",
                      required: true,
                      props: { autoComplete: "organization" },
                    }
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Address Information Section */}
          <div className={styles.section}>
            <div className="p-6">
              <h2 className={styles.sectionHeader}>
                <FiMapPin className="w-5 h-5 mr-2 text-blue-600" />
                Address Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className={styles.label}>
                    Complete Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register("address")}
                    className={
                      errors.address ? styles.inputError : styles.input
                    }
                    placeholder="Enter complete address"
                    rows="3"
                    disabled={isFormLoading}
                    autoComplete="street-address"
                  />
                  {errors.address && (
                    <p className={styles.error}>
                      <FiAlertCircle className="w-4 h-4 mr-1" />
                      {errors.address.message}
                    </p>
                  )}
                </div>

                {/* State Input */}
                <div>
                  <label className={styles.label}>
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("state")}
                    type="text"
                    placeholder="Enter state name"
                    className={errors.state ? styles.inputError : styles.input}
                    disabled={isFormLoading}
                    autoComplete="address-level1"
                  />
                  {errors.state && (
                    <p className={styles.error}>
                      <FiAlertCircle className="w-4 h-4 mr-1" />
                      {errors.state.message}
                    </p>
                  )}
                </div>

                {/* City Input */}
                <div>
                  <label className={styles.label}>
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("city")}
                    type="text"
                    placeholder="Enter city name"
                    className={errors.city ? styles.inputError : styles.input}
                    disabled={isFormLoading}
                    autoComplete="address-level2"
                  />
                  {errors.city && (
                    <p className={styles.error}>
                      <FiAlertCircle className="w-4 h-4 mr-1" />
                      {errors.city.message}
                    </p>
                  )}
                </div>

                {createInputField(
                  "pin_code",
                  "text",
                  "Enter 6-digit PIN code",
                  {
                    label: "PIN Code",
                    required: true,
                    props: { maxLength: "6", autoComplete: "postal-code" },
                  }
                )}

                {/* Gender Selection */}
                <div>
                  <label className={styles.label}>Gender</label>
                  <select
                    {...register("gender")}
                    className={errors.gender ? styles.inputError : styles.input}
                    disabled={isFormLoading}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && (
                    <p className={styles.error}>
                      <FiAlertCircle className="w-4 h-4 mr-1" />
                      {errors.gender.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Company Information Section (conditional) */}
          {config.showCompanyFields && (
            <div className={styles.section}>
              <div className="p-6">
                <h2 className={styles.sectionHeader}>
                  <FiBriefcase className="w-5 h-5 mr-2 text-blue-600" />
                  Company Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    {createInputField(
                      "company_name",
                      "text",
                      "Enter company name",
                      {
                        label: "Company Name",
                        props: { autoComplete: "organization" },
                      }
                    )}
                  </div>

                  {createInputField(
                    "company_pan_card",
                    "text",
                    "Enter company PAN card",
                    {
                      label: "Company PAN Card",
                      props: {
                        maxLength: "10",
                        style: { textTransform: "uppercase" },
                        autoComplete: "off",
                      },
                    }
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Document Information Section */}
          <div className={styles.section}>
            <div className="p-6">
              <h2 className={styles.sectionHeader}>
                <FiCreditCard className="w-5 h-5 mr-2 text-blue-600" />
                Document Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {createInputField(
                  "pan_card_number",
                  "text",
                  "Enter PAN card number",
                  {
                    label: "PAN Card Number",
                    props: {
                      maxLength: "10",
                      style: { textTransform: "uppercase" },
                      autoComplete: "off",
                    },
                  }
                )}

                {createInputField(
                  "aadhaar_card_number",
                  "text",
                  "Enter Aadhaar card number",
                  {
                    label: "Aadhaar Card Number",
                    props: { maxLength: "12", autoComplete: "off" },
                  }
                )}

                {/* Optimized Scheme Selection */}
                <div className="md:col-span-2">
                  <label className={styles.label}>
                    Scheme <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("scheme")}
                    className={errors.scheme ? styles.inputError : styles.input}
                    disabled={isFormLoading || schemesLoading}
                  >
                    <option value="">
                      {schemesLoading ? "Loading schemes..." : "Select Scheme"}
                    </option>
                    {schemes.map((scheme) => (
                      <option key={scheme.id} value={scheme.id}>
                        {scheme.name}{" "}
                        {scheme.description && `(${scheme.description})`}
                      </option>
                    ))}
                  </select>
                  {errors.scheme && (
                    <p className={styles.error}>
                      <FiAlertCircle className="w-4 h-4 mr-1" />
                      {errors.scheme.message}
                    </p>
                  )}
                  {schemes.length === 0 && !schemesLoading && (
                    <p className="text-amber-600 text-sm mt-1 flex items-center">
                      <FiAlertCircle className="w-4 h-4 mr-1" />
                      No schemes available. Please contact administrator.
                    </p>
                  )}
                </div>

                {/* Optimized Parent Selection */}
                <div className="md:col-span-2">
                  {memberType !== "admin" ? (
                    <div>
                      <label className={styles.label}>
                        Parent/Supervisor{" "}
                        {(memberType === "whitelabel" ||
                          memberType === "mds") && (
                          <span className="text-red-500">*</span>
                        )}
                      </label>
                      <select
                        {...register("parent_id")}
                        className={
                          errors.parent_id ? styles.inputError : styles.input
                        }
                        disabled={isFormLoading || parentsLoading}
                      >
                        <option value="">
                          {parentsLoading
                            ? "Loading parents..."
                            : "Select Parent"}
                        </option>
                        {availableParents.map((parent) => (
                          <option key={parent.id} value={parent.id}>
                            {parent.name} ({parent.user_code}) -{" "}
                            {parent.role_name}
                          </option>
                        ))}
                      </select>
                      {errors.parent_id && (
                        <p className={styles.error}>
                          <FiAlertCircle className="w-4 h-4 mr-1" />
                          {errors.parent_id.message}
                        </p>
                      )}
                      {availableParents.length === 0 && !parentsLoading && (
                        <p className="text-amber-600 text-sm mt-1 flex items-center">
                          <FiAlertCircle className="w-4 h-4 mr-1" />
                          No parent options available. Please contact
                          administrator.
                        </p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <label className={styles.label}>Parent Assignment</label>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-800">
                          <strong>Automatic Assignment:</strong> SuperAdmin will
                          be automatically assigned as the parent for this Admin
                          user.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Optimized Submit Section */}
          <div className="flex justify-end space-x-4 bg-gray-50 p-4 rounded-lg">
            <button
              type="button"
              onClick={handleGoBack}
              className={styles.button.secondary}
              disabled={isFormLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isFormLoading || !isValid || schemes.length === 0}
              className={styles.button.primary}
            >
              {actionLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <config.icon className="w-4 h-4 mr-2" />
                  Create {config.title.replace("Create ", "")}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Optimized Performance Monitor */}
      <PerformanceMonitor
        isEnabled={process.env.NODE_ENV === "development"}
        position="bottom-right"
        apiMetrics={{
          apiCalls:
            (actionLoading ? 1 : 0) +
            (schemesLoading ? 1 : 0) +
            (parentsLoading ? 1 : 0),
          cacheHits: 0,
          errorCount: hasErrors ? 1 : 0,
        }}
        renderMetrics={{
          componentName: "UnifiedMemberForm",
          memberType: memberType,
          formValid: isValid,
          schemesCount: schemes.length,
          parentsCount: availableParents.length,
        }}
      />
    </div>
  );
};

export default UnifiedMemberForm;
