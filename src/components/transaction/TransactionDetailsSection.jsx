import React from "react";
import { FaFileAlt, FaRedo, FaPrint, FaCog, FaEye } from "react-icons/fa";

const TransactionDetailsSection = ({
  userDetails = {},
  parentDetails = {},
  transactionDetails = {},
}) => {
  const renderDetails = (data = {}) =>
    Object.entries(data).map(([label, value], idx) => (
      <div
        key={label}
        className={`grid grid-cols-2 ${
          idx % 2 === 0
            ? "bg-white dark:bg-darkBlue/40"
            : "bg-gray-50 dark:bg-darkBlue/20"
        } border-b border-gray-200 dark:border-gray-600`}
      >
        <div className="px-4 py-3 text-gray-700 dark:text-gray-300 font-medium capitalize">
          {label.replace(/([A-Z])/g, " $1")}
        </div>
        <div className="px-4 py-3 text-gray-900 dark:text-white">
          {value || "—"}
        </div>
      </div>
    ));

  return (
    <div className="bg-white dark:bg-darkBlue rounded-lg shadow-xl max-w-4xl w-full border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="bg-blue-800 text-white p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaFileAlt className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Transaction Details</h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-blue-700 rounded-md transition-colors">
              <FaRedo className="h-4 w-4" />
            </button>
            <button className="p-2 hover:bg-blue-700 rounded-md transition-colors">
              <FaPrint className="h-4 w-4" />
            </button>
            <button className="p-2 hover:bg-blue-700 rounded-md transition-colors">
              <FaCog className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="max-h-[70vh] overflow-y-auto p-6 scrollbar-thin">
        {/* View Wallet Statement Button */}
        <div className="mb-6">
          <button className="w-full bg-blue-300 hover:bg-blue-400 text-blue-800 font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2">
            <FaEye className="h-4 w-4" />
            View Wallet Statement
          </button>
        </div>

        {/* User Details */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-4">
            User Details:
          </h3>
          <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="bg-blue-800 text-white grid grid-cols-2">
              <div className="px-4 py-3 font-medium">LABEL</div>
              <div className="px-4 py-3 font-medium">VALUE</div>
            </div>
            {Object.keys(userDetails).length > 0 ? (
              renderDetails(userDetails)
            ) : (
              <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                No user details available
              </div>
            )}
          </div>
        </div>

        {/* Parent Details */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-4">
            Parent Details:
          </h3>
          <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="bg-blue-800 text-white grid grid-cols-2">
              <div className="px-4 py-3 font-medium">LABEL</div>
              <div className="px-4 py-3 font-medium">VALUE</div>
            </div>
            {Object.keys(parentDetails).length > 0 ? (
              renderDetails(parentDetails)
            ) : (
              <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                No parent details available
              </div>
            )}
          </div>
        </div>

        {/* Transaction Details */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-4">
            Full Transaction Details:
          </h3>
          <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="bg-blue-800 text-white grid grid-cols-2">
              <div className="px-4 py-3 font-medium">LABEL</div>
              <div className="px-4 py-3 font-medium">VALUE</div>
            </div>
            {Object.keys(transactionDetails).length > 0 ? (
              renderDetails(transactionDetails)
            ) : (
              <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                No transaction details available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailsSection;
