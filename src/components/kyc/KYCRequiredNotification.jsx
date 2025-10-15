import React from "react";
import { useNavigate } from "react-router";
import { FiAlertCircle, FiCheckCircle, FiX } from "react-icons/fi";

/**
 * KYC Required Notification Component
 * Shows when user needs to complete KYC before accessing features
 */
const KYCRequiredNotification = ({
  show = true,
  onClose,
  kycStatus = "not_submitted",
  className = "",
}) => {
  const navigate = useNavigate();

  if (!show) return null;

  const getStatusConfig = () => {
    const configs = {
      not_submitted: {
        icon: <FiAlertCircle className="w-6 h-6" />,
        title: "🔒 KYC Verification Required",
        message:
          "Complete your KYC verification to unlock all whitelabel features and start your journey with us!",
        bgColor: "bg-gradient-to-br from-red-50 to-orange-50",
        borderColor: "border-red-300",
        textColor: "text-red-900",
        buttonText: "🚀 Complete KYC Now",
        buttonColor:
          "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800",
      },
      rejected: {
        icon: <FiAlertCircle className="w-6 h-6" />,
        title: "❌ KYC Application Rejected",
        message:
          "Don't worry! Please review the feedback and resubmit your KYC with the correct information.",
        bgColor: "bg-gradient-to-br from-red-50 to-pink-50",
        borderColor: "border-red-300",
        textColor: "text-red-900",
        buttonText: "🔄 Resubmit KYC",
        buttonColor:
          "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800",
      },
      pending: {
        icon: <FiCheckCircle className="w-6 h-6" />,
        title: "⏳ KYC Under Review",
        message:
          "Great! Your KYC application is being reviewed by our team. We'll notify you once it's approved.",
        bgColor: "bg-gradient-to-br from-yellow-50 to-amber-50",
        borderColor: "border-yellow-300",
        textColor: "text-yellow-900",
        buttonText: "👀 View Status",
        buttonColor:
          "bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800",
      },
    };

    return configs[kycStatus] || configs.not_submitted;
  };

  const config = getStatusConfig();

  const handleCompleteKYC = () => {
    navigate("/kyc-submission");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full">
        <div
          className={`
          ${config.bgColor} ${config.borderColor} ${config.textColor} 
          border border-l-4 p-8 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105
          ${className}
        `}
        >
          <div className="text-center">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div
                className={`
                w-16 h-16 rounded-full flex items-center justify-center
                ${
                  kycStatus === "not_submitted" || kycStatus === "rejected"
                    ? "bg-red-100"
                    : "bg-yellow-100"
                }
              `}
              >
                <div className="text-2xl">{config.icon}</div>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold mb-3">{config.title}</h3>

            {/* Message */}
            <div className="mb-6">
              <p className="text-base leading-relaxed">{config.message}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleCompleteKYC}
                className={`
                  ${config.buttonColor} text-white
                  w-full py-3 px-6 rounded-lg text-base font-semibold
                  transition-all duration-200 transform hover:scale-105
                  shadow-md hover:shadow-lg
                `}
              >
                {config.buttonText}
              </button>

              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-200 text-sm"
                >
                  <span className="flex items-center justify-center gap-1">
                    <FiX className="w-4 h-4" />
                    Dismiss
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-green-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-purple-200 rounded-full opacity-20 animate-pulse delay-500"></div>
        </div>
      </div>
    </div>
  );
};

export default KYCRequiredNotification;
