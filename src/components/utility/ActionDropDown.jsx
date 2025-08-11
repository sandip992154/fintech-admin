import { useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";

const ActionDropdown = ({ items = [], row = {}, buttonLabel = "Action" }) => {
  const [open, setOpen] = useState(false);
  const [dropdownStyles, setDropdownStyles] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Calculate and set dropdown position (above the button)
  useEffect(() => {
    if (open && buttonRef.current && dropdownRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownHeight = dropdownRef.current.offsetHeight || 150;
      setDropdownStyles({
        top: rect.top + window.scrollY - dropdownHeight - 4,
        left: rect.left + window.scrollX,
        right: rect.right + window.scrollX,
      });
    }
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setOpen((prev) => !prev)}
        className="btn bg-secondary flex items-center gap-1  px-3 py-1.5 rounded-md shadow-md hover:bg-secondary/90 transition"
      >
        {buttonLabel}
        <FiChevronDown className="w-4 h-4" />
      </button>

      {open && (
        <div
          ref={dropdownRef}
          style={{
            position: "fixed",
            top: dropdownStyles.top,
            left: dropdownStyles.left,
            zIndex: 9999,
            width: "220px",
          }}
          className="rounded-lg bg-[#1e293b] text-white shadow-xl ring-1 ring-gray-700 text-sm"
        >
          <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-700">
            Actions
          </div>
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                item.onClick?.(row);
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-blue-600/30 flex items-center gap-2 transition-colors duration-150"
            >
              {item.icon && <span className="text-primary">{item.icon}</span>}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </>
  );
};

export default ActionDropdown;
