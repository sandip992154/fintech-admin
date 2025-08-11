import { useState, useEffect, useRef } from "react";

const CommissionDropdown = ({
  commissions,
  setSelectedCommission,
  commissionDropdownOptions,
  handleCommissionOptionClick,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  // Calculate position on open
  useEffect(() => {
    if (isDropdownOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 6, // spacing below button
        left: rect.left,
      });
    }
  }, [isDropdownOpen]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !buttonRef.current.contains(e.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="btn-secondary"
        onClick={() => setIsDropdownOpen((prev) => !prev)}
      >
        Commission/Charge
      </button>

      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="fixed z-[9999] w-48 bg-darkBlue border border-gray-600 rounded-md shadow-md"
          style={{ top: `${position.top}px`, left: `${position.left}px` }}
        >
          <span className="block px-4 py-2 text-sm text-gray-400">
            Commission
          </span>
          {commissionDropdownOptions.map((option) => (
            <div
              key={option.modalKey}
              onClick={() => {
                handleCommissionOptionClick(option.modalKey);
                setSelectedCommission(commissions?.[option.label] || {});
                setIsDropdownOpen(false);
              }}
              className="px-4 py-2 hover:bg-primaryBlue cursor-pointer text-white"
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default CommissionDropdown;
