import { Outlet, Navigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import Sidebar from "../components/SideBar";
import Header from "../components/Header";
import { ToastContainer } from "react-toastify";
import { AuthContext } from "../contexts/AuthContext";

import { getUserStatus, checkKYCStatus } from "../utils/userStatus";
import KYCRequiredNotification from "../components/kyc/KYCRequiredNotification";

export const SuperAdminLayout = () => {
  const { user, loading, isAuthenticated } = useContext(AuthContext);
  const [kycStatus, setKycStatus] = useState(null);
  const [kycLoading, setKycLoading] = useState(true);

  useEffect(() => {
    const checkUserKYCStatus = async () => {
      if (loading) {
        return;
      }

      if (!user || !isAuthenticated) {
        setKycLoading(false);
        return;
      }

      try {
        console.log("✅ User authenticated, checking KYC status");
        const kycStatusData = await checkKYCStatus();
        setKycStatus(kycStatusData.status);
      } catch (error) {
        console.error("Failed to check KYC status:", error);
        setKycStatus("not_submitted");
      } finally {
        setKycLoading(false);
      }
    };

    checkUserKYCStatus();
  }, [user, isAuthenticated, loading]);

  // Show loading while checking authentication or KYC
  if (loading || kycLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading authentication...</div>
      </div>
    );
  }

  // If not authenticated, redirect to signin
  if (!user || !isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  // Show KYC requirement if not completed (but only if user is authenticated)
  // Allow users with pending, approved, or confirmed KYC to access dashboard
  if (kycStatus && !["pending", "approved", "confirmed"].includes(kycStatus)) {
    console.log(
      `🚫 KYC Status "${kycStatus}" requires completion - showing KYC notification`
    );
    return <KYCRequiredNotification status={kycStatus} />;
  }

  return (
    <>
      <section className=" max-h-[100vh] overflow-hidden flex w-full bg-secondaryOne dark:bg-darkBlue/95">
        <Sidebar />
        <div className="w-full">
          <Header />
          <main className="overflow-hidden max-w-[calc(100vw-14rem)]">
            <Outlet />
          </main>
        </div>
        <ToastContainer />
      </section>
    </>
  );
};
