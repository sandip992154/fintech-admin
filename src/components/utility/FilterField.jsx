import { useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const FilterField = ({
  type = "text",
  placeholder,
  value,
  onChange,
  options = [],
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const showFloatingLabel = isFocused || (!!value && value !== "");

  return (
    <div className="relative group w-full max-w-40">
      {/* Floating Label */}
      <label
        className={`absolute left-3 transition-all duration-200 px-1 pointer-events-none z-10 ${
          showFloatingLabel
            ? "text-xs -top-2 bg-white dark:bg-darkBlue text-gray-700 dark:text-white"
            : "top-1/2 -translate-y-1/2 text-gray-400"
        }`}
      >
        {placeholder}
      </label>

      {/* Custom Select */}
      {type === "select" ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="bg-transparent border border-gray-500 text-gray-700 dark:text-white dark:bg-darkBlue rounded-md px-3 py-2 w-full appearance-none"
        >
          <option value="" disabled hidden></option>
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className="text-black dark:text-white bg-white dark:bg-[#1e293b]"
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
          placeholderText=""
          dateFormat="yyyy-MM-dd"
          className="bg-transparent border border-gray-500 text-gray-700 dark:text-white dark:bg-darkBlue rounded-md px-3 py-2 w-full"
          calendarClassName="react-datepicker-custom"
          popperClassName="z-50"
        />
      ) : (
        <input
          ref={inputRef}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)} // ✅ Fix here
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder=" "
          className="bg-transparent border border-gray-500 text-gray-700 dark:text-white dark:bg-darkBlue rounded-md px-3 py-2 w-full  placeholder-transparent"
        />
      )}
    </div>
  );
};

export default FilterField;
