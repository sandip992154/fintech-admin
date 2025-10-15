/**
 * Centralized Error Handling Utilities
 * ===================================
 *
 * Utilities for consistent error handling, loading states,
 * and user-friendly error messages across the application.
 */

import React from "react";
import { toast } from "react-toastify";

// Error types enum
export const ErrorTypes = {
  NETWORK: "NETWORK",
  AUTHENTICATION: "AUTHENTICATION",
  AUTHORIZATION: "AUTHORIZATION",
  VALIDATION: "VALIDATION",
  SERVER: "SERVER",
  NOT_FOUND: "NOT_FOUND",
  UNKNOWN: "UNKNOWN",
};

// Error message mappings
const ERROR_MESSAGES = {
  [ErrorTypes.NETWORK]:
    "Network error. Please check your connection and try again.",
  [ErrorTypes.AUTHENTICATION]: "Authentication failed. Please login again.",
  [ErrorTypes.AUTHORIZATION]:
    "You don't have permission to perform this action.",
  [ErrorTypes.VALIDATION]: "Please check your input and try again.",
  [ErrorTypes.SERVER]: "Server error. Please try again later.",
  [ErrorTypes.NOT_FOUND]: "The requested resource was not found.",
  [ErrorTypes.UNKNOWN]: "An unexpected error occurred. Please try again.",
};

/**
 * Parse API error response and determine error type
 */
export const parseApiError = (error) => {
  // Network/Connection errors
  if (!error.response && error.code === "ECONNABORTED") {
    return {
      type: ErrorTypes.NETWORK,
      message: "Request timeout. Please try again.",
      originalError: error,
    };
  }

  if (!error.response) {
    return {
      type: ErrorTypes.NETWORK,
      message: ERROR_MESSAGES[ErrorTypes.NETWORK],
      originalError: error,
    };
  }

  const status = error.response?.status;
  const data = error.response?.data;

  // Status code based error types
  switch (status) {
    case 401:
      return {
        type: ErrorTypes.AUTHENTICATION,
        message: data?.detail || ERROR_MESSAGES[ErrorTypes.AUTHENTICATION],
        originalError: error,
      };

    case 403:
      return {
        type: ErrorTypes.AUTHORIZATION,
        message: data?.detail || ERROR_MESSAGES[ErrorTypes.AUTHORIZATION],
        originalError: error,
      };

    case 404:
      return {
        type: ErrorTypes.NOT_FOUND,
        message: data?.detail || ERROR_MESSAGES[ErrorTypes.NOT_FOUND],
        originalError: error,
      };

    case 422:
      return {
        type: ErrorTypes.VALIDATION,
        message: data?.detail || ERROR_MESSAGES[ErrorTypes.VALIDATION],
        originalError: error,
        validationErrors: data?.detail || [],
      };

    case 500:
    case 502:
    case 503:
    case 504:
      return {
        type: ErrorTypes.SERVER,
        message: data?.detail || ERROR_MESSAGES[ErrorTypes.SERVER],
        originalError: error,
      };

    default:
      return {
        type: ErrorTypes.UNKNOWN,
        message:
          data?.detail || error.message || ERROR_MESSAGES[ErrorTypes.UNKNOWN],
        originalError: error,
      };
  }
};

/**
 * Handle API errors with consistent messaging
 */
export const handleApiError = (error, customMessage = null) => {
  console.error("API Error:", error);

  const parsedError = parseApiError(error);
  const message = customMessage || parsedError.message;

  // Show appropriate toast based on error type
  switch (parsedError.type) {
    case ErrorTypes.AUTHENTICATION:
      toast.error(message, {
        autoClose: 5000,
        onClose: () => {
          // Redirect to login if needed
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
        },
      });
      break;

    case ErrorTypes.AUTHORIZATION:
      toast.warning(message, { autoClose: 5000 });
      break;

    case ErrorTypes.VALIDATION:
      toast.error(message, { autoClose: 7000 });
      break;

    case ErrorTypes.NETWORK:
      toast.error(message, {
        autoClose: 8000,
        hideProgressBar: false,
      });
      break;

    default:
      toast.error(message, { autoClose: 5000 });
      break;
  }

  return parsedError;
};

/**
 * Loading state hook for consistent loading management
 */
export const useLoadingState = (initialState = {}) => {
  const [loadingStates, setLoadingStates] = React.useState(initialState);

  const setLoading = React.useCallback((key, isLoading) => {
    setLoadingStates((prev) => ({
      ...prev,
      [key]: isLoading,
    }));
  }, []);

  const isLoading = React.useCallback(
    (key) => {
      return Boolean(loadingStates[key]);
    },
    [loadingStates]
  );

  const hasAnyLoading = React.useCallback(() => {
    return Object.values(loadingStates).some(Boolean);
  }, [loadingStates]);

  return { setLoading, isLoading, hasAnyLoading, loadingStates };
};

/**
 * Enhanced async operation wrapper with error handling
 */
export const withErrorHandling = async (operation, options = {}) => {
  const {
    errorMessage = null,
    successMessage = null,
    onError = null,
    onSuccess = null,
    showLoading = true,
  } = options;

  try {
    const result = await operation();

    if (successMessage) {
      toast.success(successMessage);
    }

    if (onSuccess) {
      onSuccess(result);
    }

    return { success: true, data: result, error: null };
  } catch (error) {
    const parsedError = handleApiError(error, errorMessage);

    if (onError) {
      onError(parsedError);
    }

    return { success: false, data: null, error: parsedError };
  }
};

/**
 * Form validation error display component
 */
export const ValidationErrorDisplay = ({ errors = [], className = "" }) => {
  if (!errors.length) return null;

  return (
    <div
      className={`bg-red-50 border border-red-200 rounded-lg p-3 ${className}`}
    >
      <div className="text-red-700 text-sm font-medium mb-2">
        Please fix the following errors:
      </div>
      <ul className="text-red-600 text-sm list-disc list-inside space-y-1">
        {errors.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
    </div>
  );
};

/**
 * Loading spinner component with consistent styling
 */
export const LoadingSpinner = ({
  size = "md",
  color = "primary",
  overlay = false,
  message = "Loading...",
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const colorClasses = {
    primary: "text-blue-600",
    secondary: "text-gray-600",
    success: "text-green-600",
    warning: "text-yellow-600",
    danger: "text-red-600",
  };

  const spinner = (
    <div
      className={`inline-flex items-center space-x-2 ${
        overlay ? "text-white" : ""
      }`}
    >
      <svg
        className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
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
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {message && (
        <span className={`text-sm ${overlay ? "text-white" : "text-gray-600"}`}>
          {message}
        </span>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl">
          {spinner}
        </div>
      </div>
    );
  }

  return spinner;
};

/**
 * Error boundary component for React error handling
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-64 flex items-center justify-center">
          <div className="text-center p-6">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              An unexpected error occurred. Please refresh the page or contact
              support.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Retry wrapper for failed operations
 */
export const withRetry = async (operation, maxRetries = 3, delay = 1000) => {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries) {
        throw error;
      }

      // Exponential backoff delay
      await new Promise((resolve) => setTimeout(resolve, delay * attempt));
    }
  }

  throw lastError;
};

export default {
  ErrorTypes,
  parseApiError,
  handleApiError,
  useLoadingState,
  withErrorHandling,
  withRetry,
  ValidationErrorDisplay,
  LoadingSpinner,
  ErrorBoundary,
};
