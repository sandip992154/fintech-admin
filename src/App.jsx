import { RouterProvider, createBrowserRouter } from "react-router";
import { ToastContainer } from "react-toastify";
import "./App.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";

// Super admin
import { SuperAdminLayout } from "./layouts/SuperAdminLayout";
import Dashboard from "./pages/Dashboard";
import { SignIn } from "./pages/SignIn";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import { SchemeManager } from "./pages/resources_tab/SchemeManger";
import { CompanyProfile } from "./pages/resources_tab/CompanyProfile";
import { CompanyManger } from "./pages/resources_tab/CompanyManger";
import SuperAEPS from "./pages/agent_list/SuperAEPS";
import SuperUTI from "./pages/agent_list/SuperUTI";
import { TransferReturn } from "./pages/fund/TransferReturn";
import { Request } from "./pages/fund/Request";
import { RequestReport } from "./pages/fund/RequestReport";
import { AllAEPSTransaction } from "./pages/transaction_report/AllAEPSTransaction";
import { CommissionStatement } from "./pages/transaction_report/CommissionStatement";
import { BillPayStatement } from "./pages/transaction_report/BillPayStatement";
import { VerificationStatement } from "./pages/transaction_report/VerificationStatement";
import { AffiliateStatement } from "./pages/transaction_report/AffiliateStatement";
import { MicroATMStatement } from "./pages/transaction_report/MicroATMStatement";
import { RechargeStatement } from "./pages/transaction_report/RechargeStatement";
import { UTIPancardStatement } from "./pages/transaction_report/UTIPancardStatement";
import { CreditCardPayment } from "./pages/transaction_report/CreditCardPayment";
import { MainWallet } from "./pages/wallet_history/MainWallet";
import { MatchingPercentage } from "./pages/matching_percentage/MatchingPercentage";
import { MobileUserLogout } from "./pages/setup_tools/MobileUserLogout";
import { APIManager } from "./pages/setup_tools/APIManager";
import { BankAccount } from "./pages/setup_tools/BankAccount";
import { OperatorManager } from "./pages/setup_tools/OperatorManager";
import { PortalSetting } from "./pages/setup_tools/PortalSetting";
import { QuickLinks } from "./pages/setup_tools/QuickLinks";
import { Roles } from "./pages/roles_permissions/Roles";
import { Permissions } from "./pages/roles_permissions/Permissions";
import AccountPortalSettings from "./pages/account_settings/AccountPortalSettings";
import { WhiteLabel } from "./pages/members/WhiteLabel";
import { MasterDistributor } from "./pages/members/MasterDistributor";
import { Distributor } from "./pages/members/Distributor";
import { Retail } from "./pages/members/Retail";
import { Customer } from "./pages/members/Customer";
import WhitelabelLayout from "./layouts/members/WhitelabelLayout";
import CreateWhitelabel from "./components/members/whitelabel/CreateWhiteLabel";
import MDLayout from "./layouts/members/MDLayout";
import DSLayout from "./layouts/members/DSLayout";
import CustomerLayout from "./layouts/members/CustomerLayout";
import RetailerLayout from "./layouts/members/RetailerLayout";
import CreateMDS from "./components/members/mds/CreateMDS";
import CreateRetailerBYDs from "./components/members/ds/CreateRetailerBYDs";
import TransactionHistory from "./pages/transaction_report/TransactionHistory";
import CreateCutsomerBYRetailer from "./components/members/retailer/CreateCustomerBYRetailer";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import MPINManagement from "./pages/MPINManagement";
import KYCSubmission from "./pages/KYCSubmission";
import KYCManagement from "./pages/KYCManagement";
import CreateWhiteLabelUnified from "./components/members/whitelabel/CreateWhiteLabelUnified";
import CreateMDSUnified from "./components/members/mds/CreateMDSUnified";
import CreateRetailerUnified from "./components/members/retailer/CreateRetailerUnified";
import CreateCustomerUnified from "./components/members/customer/CreateCustomerUnified";

// admin

const App = () => {
  const router = createBrowserRouter([
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
          Component: Dashboard,
        },
        // resources
        {
          path: "/resources/scheme-manager",
          Component: SchemeManager,
        },
        {
          path: "/resources/company",
          Component: CompanyManger,
        },
        {
          path: "/resources/company-profile",
          Component: CompanyProfile,
        },
        // Agent List

        {
          path: "/statement/aeps",
          Component: SuperAEPS,
        },
        {
          path: "/statement/uti",
          Component: SuperUTI,
        },

        // Fund

        {
          path: "fund/tr",
          Component: TransferReturn,
        },
        {
          path: "fund/requestview",
          Component: Request,
        },
        {
          path: "fund/requestviewall",
          Component: RequestReport,
        },

        // transaction report

        {
          path: "statement/transaction-history",
          Component: TransactionHistory, //transaction history
        },
        {
          path: "statement/aeps-txn",
          Component: AllAEPSTransaction,
        },
        {
          path: "statement/commision",
          Component: CommissionStatement,
        },
        {
          path: "statement/bill-pay",
          Component: BillPayStatement,
        },
        {
          path: "statement/verification",
          Component: VerificationStatement,
        },
        {
          path: "statement/affiliate",
          Component: AffiliateStatement,
        },
        {
          path: "statement/micro-atm",
          Component: MicroATMStatement,
        },
        {
          path: "statement/recharge",
          Component: RechargeStatement,
        },
        {
          path: "statement/uti-pancard",
          Component: UTIPancardStatement,
        },
        {
          path: "statement/credit",
          Component: CreditCardPayment,
        },

        // Wallet History
        {
          path: "statement/account",
          Component: MainWallet,
        },

        // Matching Percentage
        {
          path: "matchingpercent",
          Component: MatchingPercentage,
        },
        // Setup tools
        {
          path: "setup/token",
          Component: MobileUserLogout,
        },
        {
          path: "setup/api",
          Component: APIManager,
        },
        {
          path: "setup/bank",
          Component: BankAccount,
        },
        {
          path: "setup/operator",
          Component: OperatorManager,
        },
        {
          path: "setup/portalsettings",
          Component: PortalSetting,
        },
        {
          path: "setup/links",
          Component: QuickLinks,
        },

        // Roles and Permission
        {
          path: "tools/roles",
          Component: Roles,
        },
        {
          path: "tools/permissions",
          Component: Permissions,
        },

        // account settings
        {
          path: "profile/view",
          Component: AccountPortalSettings,
        },

        // Enhanced Member Management
        {
          path: "kyc/members",
          Component: KYCManagement,
        },

        // MPIN Management
        {
          path: "profile/mpin",
          Component: MPINManagement,
        },

        {
          path: "members/whitelabel",
          Component: WhitelabelLayout,
          children: [
            {
              index: true,
              Component: WhiteLabel,
            },
            {
              path: "create",
              Component: CreateWhiteLabelUnified,
            },
          ],
        },
        {
          path: "members/mds",
          Component: MDLayout,
          children: [
            {
              index: true,
              Component: MasterDistributor,
            },
            {
              path: "create",
              Component: CreateMDSUnified,
            },
          ],
        },
        {
          path: "members/ds",
          Component: DSLayout,
          children: [
            {
              index: true,
              Component: Distributor,
            },
            {
              path: "create",
              Component: CreateRetailerUnified,
            },
          ],
        },
        {
          path: "members/retail",
          Component: RetailerLayout,
          children: [
            {
              index: true,
              Component: Retail,
            },
            {
              path: "create",
              Component: CreateCustomerUnified,
            },
          ],
        },
        {
          path: "members/customer",
          Component: CustomerLayout,
          children: [
            {
              index: true,
              Component: Customer,
            },
            // {
            //   path: "create",
            //   Component: CreateWhitelabel,
            // },
          ],
        },
      ],
    },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </AuthProvider>
  );
};

export default App;
