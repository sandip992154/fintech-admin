// components/DateRangePicker.js
import { useState } from "react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css"; // theme

import { FaRegCalendarAlt } from "react-icons/fa";

export const CustomDatePicker = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  //   console.log(dateRange);

  const formattedRange = `${format(
    dateRange[0].startDate,
    "MMMM d, yyyy"
  )} - ${format(dateRange[0].endDate, "MMMM d, yyyy")}`;

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setShowCalendar(!showCalendar)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-darkBlue/30 border border-gray-300 dark:border-darkBlue rounded-md shadow-sm hover:border-gray-400 transition"
      >
        <FaRegCalendarAlt className="text-purple-700" />
        <span className="text-sm font-medium">
          <span className="text-gray-500">Date:</span> {formattedRange}
        </span>
        <svg
          className="ml-2 w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {showCalendar && (
        <div className="absolute z-50 mt-2 dark:bg-darkBlue bg-white ">
          <DateRange
            editableDateInputs={true}
            onChange={(item) => setDateRange([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={dateRange}
            className="shadow-lg dark:bg-darkBlue/30"
          />
        </div>
      )}
    </div>
  );
};
