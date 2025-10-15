import KYCManagementService from "../services/kycManagementService";
import MPINManagementService from "../services/mpinManagementService";

/**
 * Check user's KYC status
 * @returns {Promise<Object>} KYC status information
 */
export const checkKYCStatus = async () => {
  try {
    const response = await KYCManagementService.getKYCStatus();
    return response.data || response;
  } catch (error) {
    console.error("Error checking KYC status:", error);
    return { status: "not_submitted", message: "Unable to fetch KYC status" };
  }
};

/**
 * Check user's MPIN setup status
 * @returns {Promise<Object>} MPIN status information
 */
export const checkMPINStatus = async () => {
  try {
    const response = await MPINManagementService.getMPINStatus();
    return response.data || response;
  } catch (error) {
    console.error("Error checking MPIN status:", error);
    return { has_mpin: false, message: "Unable to fetch MPIN status" };
  }
};

/**
 * Get comprehensive user status (KYC + MPIN)
 * @returns {Promise<Object>} Combined status information
 */
export const getUserStatus = async () => {
  try {
    const [kycStatus, mpinStatus] = await Promise.all([
      checkKYCStatus(),
      checkMPINStatus(),
    ]);

    // KYC is considered "submitted" if status is pending, approved, or confirmed
    const kycSubmitted =
      kycStatus.status &&
      ["pending", "approved", "confirmed"].includes(kycStatus.status);

    return {
      kyc: kycStatus,
      mpin: mpinStatus,
      needsKYC: !kycSubmitted || kycStatus.status === "rejected",
      needsMPIN: !mpinStatus.has_mpin,
      isFullySetup:
        (kycStatus.status === "confirmed" || kycStatus.status === "approved") &&
        mpinStatus.has_mpin,
    };
  } catch (error) {
    console.error("Error getting user status:", error);
    return {
      kyc: { status: "not_submitted" },
      mpin: { has_mpin: false },
      needsKYC: true,
      needsMPIN: true,
      isFullySetup: false,
    };
  }
};

/**
 * Check if user should be redirected to KYC based on their status and role
 * @param {string} userRole - User's role
 * @param {Object} userStatus - User's status object
 * @returns {boolean} Whether to redirect to KYC
 */
export const shouldRedirectToKYC = (userRole, userStatus) => {
  // Roles that require KYC completion
  const kycRequiredRoles = [
    "whitelabel",
    "mds",
    "distributor",
    "retailer",
    "customer",
  ];

  if (!kycRequiredRoles.includes(userRole)) {
    console.log(
      `🔓 Role "${userRole}" does not require KYC - bypassing redirect`
    );
    return false;
  }

  // Check if KYC is not completed or rejected
  const shouldRedirect = userStatus.needsKYC;
  console.log(`🔍 KYC Status Check:`, {
    userRole,
    kycStatus: userStatus.kyc?.status,
    needsKYC: userStatus.needsKYC,
    shouldRedirect,
  });

  return shouldRedirect;
};

/**
 * Get status indicator for KYC
 * @param {string} status - KYC status
 * @returns {Object} Status indicator configuration
 */
export const getKYCStatusIndicator = (status) => {
  const indicators = {
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

  return indicators[status] || indicators.not_submitted;
};

/**
 * Get status indicator for MPIN
 * @param {boolean} hasMPIN - Whether user has MPIN set
 * @returns {Object} Status indicator configuration
 */
export const getMPINStatusIndicator = (hasMPIN) => {
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
