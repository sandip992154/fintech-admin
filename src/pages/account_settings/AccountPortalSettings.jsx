import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import BankDetails from "../../components/account_settings/BankDetails";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ProfileDetails from "../../components/account_settings/ProfileDetails";
import KYCDetails from "../../components/account_settings/KYCDetails";
import PasswordManager from "../../components/account_settings/PasswordManager";
import PinManager from "../../components/account_settings/PinManager";
import CertificateManager from "../../components/account_settings/CertificateManager";
import RoleManager from "../../components/account_settings/RoleManager";
import MappingManager from "../../components/account_settings/MappingManager";
import { useProfileManagement } from "../../hooks/useProfileManagement";

const AccountPortalSettings = () => {
  const [activePage, setActivePage] = useState("Profile Details");

  // Use the profile management hook
  const {
    profileData,
    bankDetails,
    kycDetails,
    certificateData,
    roleData,
    mappingData,
    profileStatus,
    loading,
    error,
    saveLoading,
    updateProfileDetails,
    updateBankDetails,
    updatePassword,
    updateMPIN,
    updateKYCDetails,
    updateCertificateManager,
    updateRoleManager,
    updateMappingManager,
    isSectionAvailable,
    clearError,
    refreshProfile,
    getFormattedProfileData,
  } = useProfileManagement();

  // Define all available pages
  const allPages = [
    "Profile Details",
    "KYC Details",
    "Password Manager",
    "Pin Manager",
    "Bank Details",
    "Certificate Manager",
    "Role Manager",
    "Mapping Manager",
  ];

  // Filter pages based on user tier permissions
  const pages = allPages.filter((page) => {
    const sectionMap = {
      "Profile Details": "profile_details",
      "KYC Details": "kyc_details",
      "Password Manager": "password_manager",
      "Pin Manager": "pin_manager",
      "Bank Details": "bank_details",
      "Certificate Manager": "certificate_manager",
      "Role Manager": "role_manager",
      "Mapping Manager": "mapping_manager",
    };

    return isSectionAvailable(sectionMap[page]);
  });

  // Default data structure for components
  const defaultData = {
    Profile_Details: getFormattedProfileData(),
    KYC_Profile: {
      shopName: kycDetails?.shop_name || "",
      gstNumber: kycDetails?.gst_number || "",
      aadharNumber: kycDetails?.aadhar_number || "",
      panNumber: kycDetails?.pan_number || "",
      securityPin: "",
      passportPhoto: "",
    },
    Password_Manager: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      securityPin: "",
    },
    Pin_Manager: {
      newPin: "",
      confirmPin: "",
      otp: "",
    },
    Bank_Details: {
      accountNumber: bankDetails?.accountNumber || bankDetails?.account_number || "",
      bankName: bankDetails?.bankName || bankDetails?.bank_name || "",
      ifscCode: bankDetails?.ifscCode || bankDetails?.ifsc_code || "",
      accountHolderName: bankDetails?.accountHolderName || bankDetails?.account_holder_name || "",
      securityPin: "",
    },
    Certificate_Manager: {
      cmo: certificateData?.cmo || "",
      coo: certificateData?.coo || "",
      securityPin: "",
    },
    Role_Manager: {
      memberRole: roleData?.member_role || "",
      securityPin: "",
    },
    Mapping_Manager: {
      parentMember: mappingData?.parent_member || "",
      securityPin: "",
    },
  };

  // Set first available page as active if current active page is not available
  useEffect(() => {
    if (pages.length > 0 && !pages.includes(activePage)) {
      setActivePage(pages[0]);
    }
  }, [pages, activePage]);
  // Handle profile operations with proper error handling
  const handleProfileUpdate = async (data) => {
    clearError();
    const result = await updateProfileDetails(data);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(`Error: ${result.message}`);
    }
    return result;
  };

  const handleBankDetailsUpdate = async (data) => {
    clearError();
    const result = await updateBankDetails(data);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(`Error: ${result.message}`);
    }
    return result;
  };

  const handlePasswordUpdate = async (data) => {
    clearError();
    const result = await updatePassword(data);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(`Error: ${result.message}`);
    }
    return result;
  };

  const handleMPINUpdate = async (data) => {
    clearError();
    const result = await updateMPIN(data);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(`Error: ${result.message}`);
    }
    return result;
  };

  const handleKYCUpdate = async (data) => {
    clearError();
    const result = await updateKYCDetails(data);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(`Error: ${result.message}`);
    }
    return result;
  };

  const handleCertificateUpdate = async (data) => {
    clearError();
    const result = await updateCertificateManager(data);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(`Error: ${result.message}`);
    }
    return result;
  };

  const handleRoleUpdate = async (data) => {
    clearError();
    const result = await updateRoleManager(data);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(`Error: ${result.message}`);
    }
    return result;
  };

  const handleMappingUpdate = async (data) => {
    clearError();
    const result = await updateMappingManager(data);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(`Error: ${result.message}`);
    }
    return result;
  };

  const renderPageContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="large" />
          <span className="ml-3 text-gray-600">Loading profile data...</span>
        </div>
      );
    }

    switch (activePage) {
      case "Profile Details":
        return (
          <ProfileDetails
            initialData={defaultData.Profile_Details}
            onSubmit={handleProfileUpdate}
            loading={saveLoading}
            error={error}
          />
        );
      case "KYC Details":
        return (
          <KYCDetails
            initialData={defaultData.KYC_Profile}
            onSubmit={handleKYCUpdate}
            loading={saveLoading}
            error={error}
          />
        );
      case "Password Manager":
        return (
          <PasswordManager
            initialData={defaultData.Password_Manager}
            onSubmit={handlePasswordUpdate}
            loading={saveLoading}
            error={error}
          />
        );
      case "Pin Manager":
        return (
          <PinManager
            initialData={defaultData.Pin_Manager}
            onSubmit={handleMPINUpdate}
            loading={saveLoading}
            error={error}
            mpinIsSet={profileStatus?.mpin_is_set === true}
          />
        );
      case "Bank Details":
        return (
          <BankDetails
            initialData={defaultData.Bank_Details}
            onSubmit={handleBankDetailsUpdate}
            loading={saveLoading}
            error={error}
          />
        );
      case "Certificate Manager":
        return (
          <CertificateManager
            initialData={defaultData.Certificate_Manager}
            onSubmit={handleCertificateUpdate}
            loading={saveLoading}
            error={error}
          />
        );
      case "Role Manager":
        return (
          <RoleManager
            initialData={defaultData.Role_Manager}
            onSubmit={handleRoleUpdate}
            loading={saveLoading}
            error={error}
          />
        );
      case "Mapping Manager":
        return (
          <MappingManager
            initialData={defaultData.Mapping_Manager}
            onSubmit={handleMappingUpdate}
            loading={saveLoading}
            error={error}
          />
        );
      default:
        return <div className="text-center text-gray-500">Select a page</div>;
    }
  };

  return (
    <div className="max-h-[90vh] 2xl:max-w-[80%] p-4 mx-8 bg-white mt-2 dark:bg-darkBlue/70 rounded-2xl 2xl:mx-auto dark:text-white overflow-hidden overflow-y-auto px-4 pb-6 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
      {/* Header with refresh button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Profile</h1>

        {/* User tier indicator */}
        {profileStatus && (
          <div className="flex items-center space-x-4">
            <span className="text-sm bg-secondary/10 text-secondary px-3 py-1 rounded-full">
              {profileStatus.user_role}
            </span>
            <button
              onClick={refreshProfile}
              disabled={loading}
              className="text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 px-3 py-1 rounded-md transition-colors disabled:opacity-50"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        )}
      </div>

      {/* Error display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={clearError}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Tab navigation */}
      <div className="flex flex-wrap">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => setActivePage(page)}
            className={`cursor-pointer px-4 py-2 rounded-t-md text-sm font-medium transition-colors ${
              activePage === page
                ? "bg-secondary text-white"
                : "hover:text-secondary"
            }`}
          >
            {page}
          </button>
        ))}
      </div>
      <hr className="my-4 dark:border-gray-600" />

      {/* Content area */}
      <div className="p-4 rounded">{renderPageContent()}</div>
    </div>
  );
};

export default AccountPortalSettings;
