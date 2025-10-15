import { toast } from "react-toastify";
import {
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
  Loader,
} from "lucide-react";

// Default options for all notifications
const DEFAULT_OPTIONS = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

// Custom toast notification service with modern styling
class ModernNotificationService {
  constructor() {
    this.defaultOptions = DEFAULT_OPTIONS;
  }

  // Success notification
  success(message, options = {}) {
    const finalOptions = { ...DEFAULT_OPTIONS, ...options };

    return toast.success(
      <div className="flex items-center space-x-3">
        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-gray-900 font-medium">{message}</p>
        </div>
      </div>,
      {
        ...finalOptions,
        className: "modern-toast modern-toast--success",
      }
    );
  }

  // Error notification
  error(message, options = {}) {
    const finalOptions = {
      ...DEFAULT_OPTIONS,
      autoClose: 7000, // Longer duration for errors
      ...options,
    };

    return toast.error(
      <div className="flex items-center space-x-3">
        <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-gray-900 font-medium">{message}</p>
        </div>
      </div>,
      {
        ...finalOptions,
        className: "modern-toast modern-toast--error",
      }
    );
  }

  // Warning notification
  warning(message, options = {}) {
    const finalOptions = { ...DEFAULT_OPTIONS, ...options };

    return toast.warning(
      <div className="flex items-center space-x-3">
        <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-gray-900 font-medium">{message}</p>
        </div>
      </div>,
      {
        ...finalOptions,
        className: "modern-toast modern-toast--warning",
      }
    );
  }

  // Info notification
  info(message, options = {}) {
    const finalOptions = { ...DEFAULT_OPTIONS, ...options };

    return toast.info(
      <div className="flex items-center space-x-3">
        <Info className="h-5 w-5 text-blue-500 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-gray-900 font-medium">{message}</p>
        </div>
      </div>,
      {
        ...finalOptions,
        className: "modern-toast modern-toast--info",
      }
    );
  }

  // Loading notification
  loading(message, options = {}) {
    const finalOptions = {
      ...DEFAULT_OPTIONS,
      autoClose: false,
      closeOnClick: false,
      ...options,
    };

    return toast.info(
      <div className="flex items-center space-x-3">
        <Loader className="h-5 w-5 text-blue-500 flex-shrink-0 animate-spin" />
        <div className="flex-1">
          <p className="text-gray-900 font-medium">{message}</p>
        </div>
      </div>,
      {
        ...finalOptions,
        className: "modern-toast modern-toast--loading",
      }
    );
  }

  // Promise-based notification (for async operations)
  promise(promise, messages, options = {}) {
    const finalOptions = { ...this.defaultOptions, ...options };

    return toast.promise(
      promise,
      {
        pending: {
          render: ({ data }) => (
            <div className="flex items-center space-x-3">
              <Loader className="h-5 w-5 text-blue-500 flex-shrink-0 animate-spin" />
              <div className="flex-1">
                <p className="text-gray-900 font-medium">
                  {messages.pending || "Processing..."}
                </p>
              </div>
            </div>
          ),
          className: "modern-toast modern-toast--loading",
        },
        success: {
          render: ({ data }) => (
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-gray-900 font-medium">
                  {messages.success || "Success!"}
                </p>
              </div>
            </div>
          ),
          className: "modern-toast modern-toast--success",
        },
        error: {
          render: ({ data }) => (
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-gray-900 font-medium">
                  {messages.error || "Something went wrong!"}
                </p>
              </div>
            </div>
          ),
          className: "modern-toast modern-toast--error",
        },
      },
      finalOptions
    );
  }

  // Custom notification with title and description
  custom({ type = "info", title, message, icon, options = {} }) {
    const finalOptions = { ...DEFAULT_OPTIONS, ...options };

    const icons = {
      success: CheckCircle,
      error: AlertCircle,
      warning: AlertTriangle,
      info: Info,
    };

    const iconColors = {
      success: "text-green-500",
      error: "text-red-500",
      warning: "text-yellow-500",
      info: "text-blue-500",
    };

    const IconComponent = icon || icons[type];
    const iconColorClass = iconColors[type];

    return toast[type](
      <div className="flex items-start space-x-3">
        <IconComponent
          className={`h-5 w-5 ${iconColorClass} flex-shrink-0 mt-0.5`}
        />
        <div className="flex-1">
          {title && (
            <p className="text-gray-900 font-semibold text-sm mb-1">{title}</p>
          )}
          <p className="text-gray-700 text-sm">{message}</p>
        </div>
      </div>,
      {
        ...finalOptions,
        className: `modern-toast modern-toast--${type}`,
      }
    );
  }

  // Dismiss all notifications
  dismissAll() {
    toast.dismiss();
  }

  // Dismiss specific notification
  dismiss(toastId) {
    toast.dismiss(toastId);
  }

  // Update existing notification
  update(toastId, options) {
    toast.update(toastId, options);
  }

  // Check if notification is active
  isActive(toastId) {
    return toast.isActive(toastId);
  }
}

// Create and export singleton instance
const modernNotify = new ModernNotificationService();

// Export individual methods for convenience
export const {
  success,
  error,
  warning,
  info,
  loading,
  promise,
  custom,
  dismissAll,
  dismiss,
  update,
  isActive,
} = modernNotify;

// Export the service instance
export default modernNotify;

// Helper function for authentication-related notifications
export const authNotifications = {
  loginSuccess: (name) =>
    success(`Welcome back, ${name}!`, {
      autoClose: 3000,
    }),

  loginError: (message) =>
    error(message || "Login failed. Please check your credentials.", {
      autoClose: 6000,
    }),

  otpSent: (method) =>
    info(`Verification code sent to your ${method}`, {
      autoClose: 4000,
    }),

  otpError: (message) =>
    error(message || "Invalid verification code. Please try again.", {
      autoClose: 5000,
    }),

  sessionExpired: () =>
    warning("Your session has expired. Please login again.", {
      autoClose: 6000,
    }),

  passwordResetSent: () =>
    success("Password reset instructions sent to your email", {
      autoClose: 5000,
    }),

  passwordResetSuccess: () =>
    success(
      "Password reset successfully! You can now login with your new password.",
      {
        autoClose: 6000,
      }
    ),

  sessionWarning: (minutes) =>
    warning(
      `Your session will expire in ${minutes} minutes. Click to extend.`,
      {
        autoClose: 10000,
        onClick: () => {
          // This would trigger session extension
          window.dispatchEvent(new CustomEvent("extendSession"));
        },
      }
    ),

  logoutSuccess: () =>
    info("You have been logged out successfully", {
      autoClose: 3000,
    }),

  // General notification methods for convenience
  success: (message, options = {}) => success(message, options),
  error: (message, options = {}) => error(message, options),
  warning: (message, options = {}) => warning(message, options),
  info: (message, options = {}) => info(message, options),
};
