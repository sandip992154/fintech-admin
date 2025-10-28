import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * Status Indicator Component for KYC and MPIN status
 */
const StatusIndicator = ({
  type,
  status,
  hasMPIN,
  onClick,
  className = "",
  showText = true,
  size = "sm",
}) => {
  const navigate = useNavigate();

  const getKYCConfig = (status) => {
    const configs = {
      not_submitted: {
        color: "red",
        text: "KYC Pending",
        icon: "⚠️",
        bgColor: "bg-red-100",
        textColor: "text-red-800",
        borderColor: "border-red-300",
      },
      pending: {
        color: "yellow",
        text: "KYC Under Review",
        icon: "⌛",
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-800",
        borderColor: "border-yellow-300",
      },
      approved: {
        color: "green",
        text: "KYC Approved",
        icon: "✅",
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        borderColor: "border-green-300",
      },
      confirmed: {
        color: "green",
        text: "KYC Confirmed",
        icon: "✅",
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        borderColor: "border-green-300",
      },
      rejected: {
        color: "red",
        text: "KYC Rejected",
        icon: "❌",
        bgColor: "bg-red-100",
        textColor: "text-red-800",
        borderColor: "border-red-300",
      },
      hold: {
        color: "orange",
        text: "KYC On Hold",
        icon: "⏸️",
        bgColor: "bg-orange-100",
        textColor: "text-orange-800",
        borderColor: "border-orange-300",
      },
    };
    return configs[status] || configs.not_submitted;
  };

  const getMPINConfig = (hasMPIN) => {
    if (hasMPIN) {
      return {
        color: "green",
        text: "MPIN Set",
        icon: "🔐",
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        borderColor: "border-green-300",
      };
    } else {
      return {
        color: "red",
        text: "MPIN Required",
        icon: "🔓",
        bgColor: "bg-red-100",
        textColor: "text-red-800",
        borderColor: "border-red-300",
      };
    }
  };

  const config = type === "kyc" ? getKYCConfig(status) : getMPINConfig(hasMPIN);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Default navigation behavior
      if (type === "kyc" && status !== "approved" && status !== "confirmed") {
        navigate("/kyc-submission");
      } else if (type === "mpin" && !hasMPIN) {
        navigate("/profile/mpin");
      }
    }
  };

  const sizeClasses = {
    xs: "px-1 py-0.5 text-xs",
    sm: "px-2 py-1 text-sm",
    md: "px-3 py-1.5 text-base",
    lg: "px-4 py-2 text-lg",
  };

  return (
    <div
      className={`
        inline-flex items-center gap-1 rounded-full border cursor-pointer 
        transition-all duration-200 hover:opacity-80
        ${config.bgColor} ${config.textColor} ${config.borderColor}
        ${sizeClasses[size]}
        ${className}
      `}
      onClick={handleClick}
      title={`Click to ${type === "kyc" ? "complete KYC" : "setup MPIN"}`}
    >
      <span className="text-sm">{config.icon}</span>
      {showText && (
        <span className="font-medium whitespace-nowrap">{config.text}</span>
      )}
    </div>
  );
};

export default StatusIndicator;
