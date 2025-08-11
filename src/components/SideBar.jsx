import { useState } from "react";
import { Link } from "react-router";

import { IoIosArrowDown, IoIosArrowForward } from "../assets/react-icons";
import { HiOutlineClipboardList } from "react-icons/hi";

import {
  FaUser,
  FiSettings,
  HiOutlineDocumentReport,
  RiFileListLine,
  FaWallet,
  FaUsersCog,
  FaCogs,
  FaMoneyBillAlt,
  FaListAlt,
  FaPercent,
  BiSolidMessage,
} from "../assets/react-icons";

import { Logo } from "../assets/assets";

const menuItems = [
  {
    icon: <FaUser />,
    label: "Member",
    component: "",
    subItems: [
      { label: "White Label", component: "members/whitelabel" },
      { label: "Master Distributor", component: "members/mds" },
      { label: "Distributor", component: "members/ds" },
      { label: "Retail", component: "members/retail" },
      { label: "Customer", component: "members/customer" },
    ],
  },
  {
    icon: <RiFileListLine />,
    label: "Resources",
    subItems: [
      { label: "Scheme Manager", component: "/resources/scheme-manager" },
      { label: "Company", component: "/resources/company" },
      { label: "Company Profile", component: "/resources/company-profile" },
    ],
  },
  {
    icon: <FaMoneyBillAlt />,
    label: "Fund",
    component: "",
    subItems: [
      { label: "Transfer/Return", component: "fund/tr" },
      { label: "Request", component: "fund/requestview" },
      { label: "Request Report", component: "fund/requestviewall" },
    ],
  },
  {
    icon: <FaListAlt />,
    label: "Agent List",
    component: "",
    subItems: [
      { label: "AEPS", component: "/statement/aeps" },
      { label: "UTI", component: "/statement/uti" },
    ],
  },
  {
    icon: <HiOutlineDocumentReport />,
    label: "Transaction Report",
    component: "/statement/transaction-history",
    subItems: [
      {
        label: "All AEPS Transaction",
        component: "statement/aeps-txn",
      },
      { label: "Commision Statement", component: "statement/commision" },
      { label: "Bill Pay Statement", component: "statement/bill-pay" },
      { label: "Verification Statement", component: "statement/verification" },
      { label: "Affilate Statement ", component: "statement/affiliate" },
      { label: "Micro ATM Statement", component: "statement/micro-atm" },
      { label: "Recharge Statement", component: "statement/recharge" },
      { label: "UTI Pancard Statement", component: "statement/uti-pancard" },
      { label: "Credit Card Payment", component: "statement/credit" },
    ],
  },
  {
    icon: <FaWallet />,
    label: "Main Wallet",
    component: "statement/account",
  },
  { icon: <BiSolidMessage />, label: "Complaints", component: "" },
  {
    icon: <FaPercent />,
    label: "Matching Percent",
    component: "matchingpercent",
  },
  {
    icon: <FaCogs />,
    label: "Setup Tools",
    component: "",
    subItems: [
      { label: "Mobile User Logout", component: "setup/token" },
      { label: "API Manager", component: "setup/api" },
      { label: "Bank Account", component: "setup/bank" },
      { label: "Operator Manager", component: "setup/operator" },
      { label: "Portal Setting", component: "setup/portalsettings" },
      { label: "Quick Links", component: "setup/links" },
    ],
  },
  {
    icon: <FiSettings />,
    label: "Account Setting",
    component: "",
    subItems: [{ label: "Profile Setting", component: "profile/view" }],
  },
  {
    icon: <FaUsersCog />,
    label: "Roles & Permissions",
    component: "",
    subItems: [
      { label: "Roles", component: "tools/roles" },
      { label: "Permission", component: "tools/permissions" },
    ],
  },
];

export default function Sidebar() {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (label) => {
    setOpenDropdown((prev) => (prev === label ? null : label));
  };

  return (
    <div className="bg-primary dark:bg-darkBlue w-64 h-screen text-white flex flex-col px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">
        <img src={Logo} className="w-20 mx-auto " />
      </h1>
      <Link
        to="/"
        className="flex items-center gap-3 text-white font-extrabold mb-1 hover:bg-white hover:text-[#3B74A5] px-3 py-2 rounded cursor-pointer transition-colors"
      >
        <HiOutlineClipboardList className="text-xl" />
        Dashboard
      </Link>

      <ul className="space-y-1 overflow-y-auto flex-1 min-h-0 scrollbar-thin">
        {menuItems.map((item, idx) => (
          <li key={idx}>
            <div
              onClick={() => item.subItems && toggleDropdown(item.label)}
              className="flex items-center justify-between text-sm hover:bg-white hover:text-[#3B74A5] px-3 py-2 rounded cursor-pointer transition-colors"
            >
              <Link
                to={item?.component}
                onClick={(e) => (!item.component ? e.preventDefault() : null)}
                className="flex items-center gap-3 flex-1"
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
              {item.subItems && (
                <span className="transform transition-transform duration-200">
                  {openDropdown === item.label ? (
                    <IoIosArrowDown />
                  ) : (
                    <IoIosArrowForward />
                  )}
                </span>
              )}
            </div>

            {/* Submenu */}
            {item.subItems && openDropdown === item.label && (
              <ul className="ml-6 mt-1 space-y-2 transition-all duration-300 border-l border-white/20 pl-3">
                {item.subItems.map((sub, subIdx) => (
                  <li
                    key={subIdx}
                    className="text-sm px-2 py-1 rounded hover:bg-white hover:text-[#3B74A5] transition-colors cursor-pointer"
                  >
                    <Link to={sub?.component}>{sub.label}</Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
