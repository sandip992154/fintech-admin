import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
  ExternalLink,
} from "lucide-react";

const Alert = ({
  type = "info",
  title,
  message,
  dismissible = false,
  autoClose = false,
  autoCloseDelay = 5000,
  onClose,
  action,
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose && autoCloseDelay > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDelay]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      setTimeout(onClose, 300); // Allow for fade out animation
    }
  };

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const styles = {
    success: {
      container: "bg-green-50 border-green-200 text-green-800",
      icon: "text-green-400",
      title: "text-green-800",
      message: "text-green-700",
    },
    error: {
      container: "bg-red-50 border-red-200 text-red-800",
      icon: "text-red-400",
      title: "text-red-800",
      message: "text-red-700",
    },
    warning: {
      container: "bg-yellow-50 border-yellow-200 text-yellow-800",
      icon: "text-yellow-400",
      title: "text-yellow-800",
      message: "text-yellow-700",
    },
    info: {
      container: "bg-blue-50 border-blue-200 text-blue-800",
      icon: "text-blue-400",
      title: "text-blue-800",
      message: "text-blue-700",
    },
  };

  const Icon = icons[type];
  const style = styles[type];

  if (!isVisible) return null;

  return (
    <div
      className={`
        rounded-2xl border p-4 shadow-lg backdrop-blur-sm
        transition-all duration-300 ease-in-out
        ${
          isVisible
            ? "opacity-100 transform scale-100"
            : "opacity-0 transform scale-95"
        }
        ${style.container}
        ${className}
      `}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${style.icon}`} />
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`text-sm font-medium ${style.title}`}>{title}</h3>
          )}
          {message && (
            <div className={`${title ? "mt-1" : ""} text-sm ${style.message}`}>
              {message}
            </div>
          )}
          {action && (
            <div className="mt-3">
              <div className="-mx-2 -my-1.5 flex">{action}</div>
            </div>
          )}
        </div>
        {dismissible && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                onClick={handleClose}
                className={`
                  inline-flex rounded-xl p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2
                  hover:bg-white hover:bg-opacity-50 transition-colors duration-200
                  ${style.icon} focus:ring-current
                `}
              >
                <span className="sr-only">Dismiss</span>
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Progress bar for auto-close */}
      {autoClose && autoCloseDelay > 0 && (
        <div className="mt-3 w-full bg-white bg-opacity-30 rounded-full h-1 overflow-hidden">
          <div
            className="h-full bg-current opacity-50 rounded-full transition-all ease-linear"
            style={{
              animation: `shrink ${autoCloseDelay}ms linear forwards`,
            }}
          />
        </div>
      )}
    </div>
  );
};

const NotificationCenter = ({
  notifications = [],
  position = "top-right",
  maxNotifications = 5,
}) => {
  const positionClasses = {
    "top-right": "fixed top-4 right-4 z-50",
    "top-left": "fixed top-4 left-4 z-50",
    "bottom-right": "fixed bottom-4 right-4 z-50",
    "bottom-left": "fixed bottom-4 left-4 z-50",
    "top-center": "fixed top-4 left-1/2 transform -translate-x-1/2 z-50",
    "bottom-center": "fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50",
  };

  const visibleNotifications = notifications.slice(0, maxNotifications);

  return (
    <div className={`${positionClasses[position]} space-y-3 w-96 max-w-sm`}>
      {visibleNotifications.map((notification, index) => (
        <div
          key={notification.id || index}
          className="transform transition-all duration-300 ease-in-out"
          style={{
            animationDelay: `${index * 100}ms`,
            zIndex: visibleNotifications.length - index,
          }}
        >
          <Alert
            {...notification}
            dismissible={true}
            className="shadow-2xl border-0 backdrop-blur-md bg-white bg-opacity-95"
          />
        </div>
      ))}
    </div>
  );
};

const StatusBadge = ({
  status,
  text,
  size = "md",
  pulse = false,
  className = "",
}) => {
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base",
  };

  const statusStyles = {
    online: "bg-green-100 text-green-800 border-green-200",
    offline: "bg-gray-100 text-gray-800 border-gray-200",
    busy: "bg-red-100 text-red-800 border-red-200",
    away: "bg-yellow-100 text-yellow-800 border-yellow-200",
    pending: "bg-blue-100 text-blue-800 border-blue-200",
  };

  const dotColors = {
    online: "bg-green-400",
    offline: "bg-gray-400",
    busy: "bg-red-400",
    away: "bg-yellow-400",
    pending: "bg-blue-400",
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full border font-medium
        ${sizeClasses[size]}
        ${statusStyles[status]}
        ${className}
      `}
    >
      <span
        className={`
          w-2 h-2 rounded-full
          ${dotColors[status]}
          ${pulse ? "animate-pulse" : ""}
        `}
      />
      {text || status}
    </span>
  );
};

const ProgressAlert = ({
  title = "Processing...",
  progress = 0,
  message,
  type = "info",
  showPercentage = true,
}) => {
  const progressColors = {
    info: "bg-blue-600",
    success: "bg-green-600",
    warning: "bg-yellow-600",
    error: "bg-red-600",
  };

  return (
    <Alert
      type={type}
      title={title}
      message={
        <div className="space-y-3">
          {message && <p>{message}</p>}
          <div className="space-y-2">
            {showPercentage && (
              <div className="flex justify-between text-xs">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
            )}
            <div className="w-full bg-white bg-opacity-50 rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${progressColors[type]}`}
                style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
              />
            </div>
          </div>
        </div>
      }
    />
  );
};

// Add keyframes for shrink animation
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes shrink {
      from {
        width: 100%;
      }
      to {
        width: 0%;
      }
    }
  `;
  document.head.appendChild(style);
}

export { Alert, NotificationCenter, StatusBadge, ProgressAlert };
