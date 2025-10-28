import { useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const FilterField = ({
  type = "text",
  placeholder,
  label,
  value,
  onChange,
  options = [],
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const showFloatingLabel = isFocused || (!!value && value !== "");
  const displayLabel = label || placeholder;

  return (
    <div className="relative w-full">
      {/* Static Top Label */}
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {displayLabel}
      </label>

      {/* Input Container */}
      <div className="relative">
        {/* Custom Select */}
        {type === "select" ? (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer hover:border-gray-400 dark:hover:border-gray-500"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
              backgroundPosition: "right 0.5rem center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "1.5em 1.5em",
              paddingRight: "2.5rem",
            }}
          >
            <option value="" disabled hidden>
              Select {displayLabel}
            </option>
            {options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                className="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
              >
                {opt.label}
              </option>
            ))}
          </select>
        ) : type === "date" ? (
          <DatePicker
            selected={value ? new Date(value + "T00:00:00") : null}
            onChange={(date) => onChange(date?.toISOString().split("T")[0])}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholderText={`dd-mm-yyyy`}
            dateFormat="dd-MM-yyyy"
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
            calendarClassName="react-datepicker-custom"
            popperClassName="z-50"
            showYearDropdown
            showMonthDropdown
            dropdownMode="select"
          />
        ) : (
          <input
            ref={inputRef}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder || `Enter ${displayLabel}`}
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 hover:border-gray-400 dark:hover:border-gray-500"
          />
        )}
      </div>
    </div>
  );
};

export default FilterField;
