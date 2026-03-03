import { useEffect, useRef, useState } from "react";
import { FaUser, FaSun, FaWallet } from "../assets/react-icons";
import LoadWalletModal from "./LoadWalletModel";
import { useDarkTheme } from "../hooks/useDarkTheme";
import { FaMoon, FaHistory, FaExchangeAlt } from "react-icons/fa";
import UserDropdown from "./UserDropDown";
import { SuperModal } from "./utility/SuperModel";
import StatusIndicator from "./kyc/StatusIndicator";
import { getUserStatus, shouldRedirectToKYC } from "../utils/userStatus";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const { isSuperDarkMode, toggleSuperTheme } = useDarkTheme();
  const [profile, setProfile] = useState(false);
  const [userStatus, setUserStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const dropdownRef = useRef(null);

  // Load user status on component mount
  useEffect(() => {
    const loadUserStatus = async () => {
      try {
        setLoading(true);
        const status = await getUserStatus();
        setUserStatus(status);
      } catch (error) {
        console.error("Error loading user status:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserStatus();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfile(false);
      }
    };

    if (profile) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profile]);

  return (
    <header className=" text-black bg-white dark:bg-transparent dark:text-adminOffWhite flex justify-between items-center px-6 py-3 rounded-t-lg shadow-sm ">
      {/* Left: Welcome text */}
      <h2 className="text-sm font-bold">
        WELCOME TO Bandaru Software Solution Pvt. Ltd.
      </h2>

      {/* Right: Action Items */}
      <div className="flex items-center gap-4 ">
        {/* KYC and MPIN Status Indicators */}
        {!loading && userStatus && (
          <div className="flex items-center gap-2">
            {/* KYC Status */}
            <StatusIndicator
              type="kyc"
              status={userStatus.kyc.status}
              size="xs"
              className="hidden sm:flex"
            />

            {/* MPIN Status */}
            <StatusIndicator
              type="mpin"
              hasMPIN={userStatus.mpin.has_mpin}
              size="xs"
              className="hidden sm:flex"
            />
          </div>
        )}
        {/* Transfer Funds & Wallet History quick-access buttons */}
        <Link
          to="/fund/tr"
          className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-1.5 rounded-md shadow-md transition cursor-pointer"
        >
          <FaExchangeAlt className="text-sm" />
          <span>Transfer Funds</span>
        </Link>
        <Link
          to="/statement/account"
          className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-3 py-1.5 rounded-md shadow-md transition cursor-pointer"
        >
          <FaHistory className="text-sm" />
          <span>Wallet History</span>
        </Link>

        {isSuperDarkMode ? (
          <FaSun
            className="text-xl text-black dark:text-adminOffWhite"
            onClick={toggleSuperTheme}
          />
        ) : (
          <FaMoon
            className="text-xl text-black dark:text-adminOffWhite"
            onClick={toggleSuperTheme}
          />
        )}

        {/* Wallet Button */}
        <button
          onClick={() => setIsWalletOpen(true)}
          className="flex items-center bg-secondary text-white font-semibold px-4 py-1.5 rounded-md gap-2 shadow-md hover:bg-[#7a7bf0] transition cursor-pointer"
        >
          <span>Admin wallet</span>
          <FaWallet />
        </button>

        {/* Profile Icon */}
        <div
          className="w-8 h-8 rounded-full bg-gradient-to-b from-[#1c4ba1] to-[#002d62] flex items-center justify-center shadow-inner cursor-pointer"
          onClick={() => setProfile(!profile)}
        >
          <FaUser className="text-white text-xl" />
          {/* <img src={userIcon} alt="" className="w-20" /> */}
        </div>
      </div>
      {isWalletOpen && (
        <SuperModal onClose={() => setIsWalletOpen(false)}>
          <LoadWalletModal />
        </SuperModal>
      )}
      {profile && <UserDropdown ref={dropdownRef} />}
    </header>
  );
}
