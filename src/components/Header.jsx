import { useEffect, useRef, useState } from "react";
import { FaUser, FaSun, FaWallet } from "../assets/react-icons";
import LoadWalletModal from "./LoadWalletModel";
import { useDarkTheme } from "../hooks/useDarkTheme";
import { FaMoon } from "react-icons/fa";
import UserDropdown from "./UserDropDown";
import { SuperModal } from "./utility/SuperModel";

export default function Header() {
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const { isSuperDarkMode, toggleSuperTheme } = useDarkTheme();
  const [profile, setProfile] = useState(false);

  const dropdownRef = useRef(null);

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
      <h2 className="text-sm font-bold">WELCOME TO NK TAX CONSULTANCY</h2>

      {/* Right: Action Items */}
      <div className="flex items-center gap-4 ">
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
