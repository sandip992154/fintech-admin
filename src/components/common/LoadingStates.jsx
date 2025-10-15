/**
 * Loading State Components
 * Reusable loading indicators for better UX
 */
import React from "react";

// Spinner component
export const Spinner = ({ size = "medium", color = "primary" }) => {
  const sizeClasses = {
    small: "h-4 w-4",
    medium: "h-6 w-6",
    large: "h-8 w-8",
    xlarge: "h-12 w-12",
  };

  const colorClasses = {
    primary: "border-primary",
    white: "border-white",
    gray: "border-gray-400",
  };

  return (
    <div
      className={`animate-spin rounded-full border-2 border-t-transparent ${sizeClasses[size]} ${colorClasses[color]}`}
    />
  );
};

// Button loading state
export const LoadingButton = ({
  loading = false,
  disabled = false,
  children,
  className = "",
  loadingText = "Loading...",
  ...props
}) => {
  return (
    <button
      disabled={loading || disabled}
      className={`flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-opacity ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <Spinner size="small" color="white" />
          <span className="ml-2">{loadingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

// Full page loading overlay
export const LoadingOverlay = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 flex items-center space-x-4">
        <Spinner size="large" color="primary" />
        <span className="text-white font-medium">{message}</span>
      </div>
    </div>
  );
};

// Skeleton loader for forms
export const FormSkeleton = ({ fields = 4 }) => {
  return (
    <div className="space-y-6">
      {Array.from({ length: fields }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
          <div className="h-10 bg-gray-700 rounded"></div>
        </div>
      ))}
    </div>
  );
};

// Table skeleton loader
export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="space-y-4">
      {/* Header skeleton */}
      <div className="grid grid-cols-4 gap-4 animate-pulse">
        {Array.from({ length: columns }).map((_, index) => (
          <div key={index} className="h-4 bg-gray-700 rounded"></div>
        ))}
      </div>

      {/* Rows skeleton */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-4 gap-4 animate-pulse">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="h-8 bg-gray-700 rounded"></div>
          ))}
        </div>
      ))}
    </div>
  );
};

// Card skeleton loader
export const CardSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-gray-800 rounded-lg p-6 animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-700 rounded w-4/6"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Data loading state with retry
export const DataLoader = ({
  loading,
  error,
  onRetry,
  children,
  skeleton,
  emptyMessage = "No data available",
}) => {
  if (loading) {
    return skeleton || <FormSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-400 mb-4">
          <svg
            className="w-12 h-12 mx-auto mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-lg font-medium">Error loading data</p>
          <p className="text-sm text-gray-400 mt-1">{error}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  return (
    children || (
      <div className="text-center py-8 text-gray-400">
        <svg
          className="w-12 h-12 mx-auto mb-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8v2m0 8v2"
          />
        </svg>
        <p>{emptyMessage}</p>
      </div>
    )
  );
};

// Progress indicator
export const ProgressBar = ({ progress = 0, className = "" }) => {
  return (
    <div className={`w-full bg-gray-700 rounded-full h-2 ${className}`}>
      <div
        className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  );
};

// Step indicator for multi-step forms
export const StepIndicator = ({ steps, currentStep, completedSteps = [] }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = completedSteps.includes(stepNumber);
        const isCurrent = currentStep === stepNumber;
        const isUpcoming = stepNumber > currentStep;

        return (
          <div key={stepNumber} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`
                w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm
                ${isCompleted ? "bg-green-500 text-white" : ""}
                ${isCurrent ? "bg-primary text-white" : ""}
                ${isUpcoming ? "bg-gray-600 text-gray-400" : ""}
              `}
              >
                {isCompleted ? (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  stepNumber
                )}
              </div>
              <span
                className={`text-xs mt-2 ${
                  isCurrent ? "text-white" : "text-gray-400"
                }`}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-16 h-0.5 mx-2 ${
                  isCompleted ? "bg-green-500" : "bg-gray-600"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default {
  Spinner,
  LoadingButton,
  LoadingOverlay,
  FormSkeleton,
  TableSkeleton,
  CardSkeleton,
  DataLoader,
  ProgressBar,
  StepIndicator,
};
