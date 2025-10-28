import { createBrowserRouter } from "react-router-dom";
import { SuperAdminLayout } from "../layouts/SuperAdminLayout";
import Dashboard from "../pages/Dashboard";
import { SignIn } from "../pages/SignIn";
import { ForgotPassword } from "../pages/ForgotPassword";
import { ResetPassword } from "../pages/ResetPassword";
import { SchemeManager } from "../pages/resources_tab/SchemeManger";
import { CompanyProfile } from "../pages/resources_tab/CompanyProfile";
import { CompanyManger } from "../pages/resources_tab/CompanyManger";
import SuperAEPS from "../pages/agent_list/SuperAEPS";
import SuperUTI from "../pages/agent_list/SuperUTI";
import { TransferReturn } from "../pages/fund/TransferReturn";
import { Request } from "../pages/fund/Request";
import { RequestReport } from "../pages/fund/RequestReport";
import { AllAEPSTransaction } from "../pages/transaction_report/AllAEPSTransaction";
import { CommissionStatement } from "../pages/transaction_report/CommissionStatement";
import { BillPayStatement } from "../pages/transaction_report/BillPayStatement";
import { VerificationStatement } from "../pages/transaction_report/VerificationStatement";
import { AffiliateStatement } from "../pages/transaction_report/AffiliateStatement";
import { MicroATMStatement } from "../pages/transaction_report/MicroATMStatement";
import { RechargeStatement } from "../pages/transaction_report/RechargeStatement";
import { UTIPancardStatement } from "../pages/transaction_report/UTIPancardStatement";
import { CreditCardPayment } from "../pages/transaction_report/CreditCardPayment";
import { MainWallet } from "../pages/wallet_history/MainWallet";
import { MatchingPercentage } from "../pages/matching_percentage/MatchingPercentage";
import { MobileUserLogout } from "../pages/setup_tools/MobileUserLogout";
import { APIManager } from "../pages/setup_tools/APIManager";
import { BankAccount } from "../pages/setup_tools/BankAccount";
import { OperatorManager } from "../pages/setup_tools/OperatorManager";
import { PortalSetting } from "../pages/setup_tools/PortalSetting";
import { QuickLinks } from "../pages/setup_tools/QuickLinks";
import { Roles } from "../pages/roles_permissions/Roles";
import { Permissions } from "../pages/roles_permissions/Permissions";
import AccountPortalSettings from "../pages/account_settings/AccountPortalSettings";
import { WhiteLabel } from "../pages/members/WhiteLabel";
import { MasterDistributor } from "../pages/members/MasterDistributor";
import { Distributor } from "../pages/members/Distributor";
import { Retail } from "../pages/members/Retail";
import { Customer } from "../pages/members/Customer";
import WhitelabelLayout from "../layouts/members/WhitelabelLayout";

import MDLayout from "../layouts/members/MDLayout";
import DSLayout from "../layouts/members/DSLayout";
import CustomerLayout from "../layouts/members/CustomerLayout";
import RetailerLayout from "../layouts/members/RetailerLayout";

import TransactionHistory from "../pages/transaction_report/TransactionHistory";

import { ProtectedRoute } from "./ProtectedRoute";

import MPINManagement from "../pages/MPINManagement";
import KYCSubmission from "../pages/KYCSubmission";
import KYCManagement from "../pages/KYCManagement";
import CreateWhiteLabelUnified from "../components/members/whitelabel/CreateWhiteLabelUnified";
import CreateMDSUnified from "../components/members/mds/CreateMDSUnified";
import CreateRetailerUnified from "../components/members/retailer/CreateRetailerUnified";
import CreateCustomerUnified from "../components/members/customer/CreateCustomerUnified";

export const router = createBrowserRouter([
  // Authentication routes (public)
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/kyc-submission",
    element: <KYCSubmission />,
  },

  // super admin - protected routes
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <SuperAdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      // resources
      {
        path: "/resources/scheme-manager",
        element: <SchemeManager />,
      },
      {
        path: "/resources/company",
        element: <CompanyManger />,
      },
      {
        path: "/resources/company-profile",
        element: <CompanyProfile />,
      },
      // Agent List

      {
        path: "/statement/aeps",
        element: <SuperAEPS />,
      },
      {
        path: "/statement/uti",
        element: <SuperUTI />,
      },

      // Fund

      {
        path: "fund/tr",
        element: <TransferReturn />,
      },
      {
        path: "fund/requestview",
        element: <Request />,
      },
      {
        path: "fund/requestviewall",
        element: <RequestReport />,
      },

      // transaction report

      {
        path: "statement/transaction-history",
        element: <TransactionHistory />, //transaction history
      },
      {
        path: "statement/aeps-txn",
        element: <AllAEPSTransaction />,
      },
      {
        path: "statement/commision",
        element: <CommissionStatement />,
      },
      {
        path: "statement/bill-pay",
        element: <BillPayStatement />,
      },
      {
        path: "statement/verification",
        element: <VerificationStatement />,
      },
      {
        path: "statement/affiliate",
        element: <AffiliateStatement />,
      },
      {
        path: "statement/micro-atm",
        element: <MicroATMStatement />,
      },
      {
        path: "statement/recharge",
        element: <RechargeStatement />,
      },
      {
        path: "statement/uti-pancard",
        element: <UTIPancardStatement />,
      },
      {
        path: "statement/credit",
        element: <CreditCardPayment />,
      },

      // Wallet History
      {
        path: "statement/account",
        element: <MainWallet />,
      },

      // Matching Percentage
      {
        path: "matchingpercent",
        element: <MatchingPercentage />,
      },
      // Setup tools
      {
        path: "setup/token",
        element: <MobileUserLogout />,
      },
      {
        path: "setup/api",
        element: <APIManager />,
      },
      {
        path: "setup/bank",
        element: <BankAccount />,
      },
      {
        path: "setup/operator",
        element: <OperatorManager />,
      },
      {
        path: "setup/portalsettings",
        element: <PortalSetting />,
      },
      {
        path: "setup/links",
        element: <QuickLinks />,
      },

      // Roles and Permission
      {
        path: "tools/roles",
        element: <Roles />,
      },
      {
        path: "tools/permissions",
        element: <Permissions />,
      },

      // account settings
      {
        path: "profile/view",
        element: <AccountPortalSettings />,
      },

      // Enhanced Member Management
      {
        path: "kyc/members",
        element: <KYCManagement />,
      },

      // MPIN Management
      {
        path: "profile/mpin",
        element: <MPINManagement />,
      },

      {
        path: "members/whitelabel",
        element: <WhitelabelLayout />,
        children: [
          {
            index: true,
            element: <WhiteLabel />,
          },
          {
            path: "create",
            element: <CreateWhiteLabelUnified />,
          },
        ],
      },
      {
        path: "members/mds",
        element: <MDLayout />,
        children: [
          {
            index: true,
            element: <MasterDistributor />,
          },
          {
            path: "create",
            element: <CreateMDSUnified />,
          },
        ],
      },
      {
        path: "members/ds",
        element: <DSLayout />,
        children: [
          {
            index: true,
            element: <Distributor />,
          },
          {
            path: "create",
            element: <CreateRetailerUnified />,
          },
        ],
      },
      {
        path: "members/retail",
        element: <RetailerLayout />,
        children: [
          {
            index: true,
            element: <Retail />,
          },
          {
            path: "create",
            element: <CreateCustomerUnified />,
          },
        ],
      },
      {
        path: "members/customer",
        element: <CustomerLayout />,
        children: [
          {
            index: true,
            element: <Customer />,
          },
        ],
      },
    ],
  },
]);
