// TransactionHistory.jsx
import React, { useState } from "react";
import {
  FaBuilding,
  FaReceipt,
  FaShieldAlt,
  FaCar,
  FaCheckCircle,
  FaFingerprint,
  FaBolt,
  FaShoppingBag,
  FaCreditCard,
  FaFileAlt,
} from "react-icons/fa";
import { SuperModal } from "../../components/utility/SuperModel";
import RunpaisaHistoryTable from "../../components/transaction/RunPaisaHIstoryTable";

export const sampleData = [
  {
    id: 1,
    createdAt: "18 Jun 25- 10:55 AM",
    txnuser: "HAFEEZ SHAIK",
    userRole: "RT",
    txnId: "PKEBP6798338775",
    refNo: "pay_QiXkquPSIOUmkp",
    amount: 89999,
    paymentMode: "CREDIT_CARD",
    status: "Success",
  },
  {
    id: 2,
    createdAt: "18 Jun 25- 10:55 AM",
    txnuser: "HAFEEZ SHAIK",
    userRole: "RT",
    txnId: "PKEBP7834963537",
    refNo: "",
    amount: 90000,
    paymentMode: "",
    status: "Pending",
  },
];

const TransactionHistory = () => {
  const [tableModal, setTableModal] = useState(false);
  const categories = [
    { icon: <FaBuilding />, text: "Banking", active: true },
    { icon: <FaReceipt />, text: "Utility Payment" },
    { icon: <FaShieldAlt />, text: "E - Governance" },
    { icon: <FaShieldAlt />, text: "Insurance" },
    { icon: <FaCar />, text: "Travel" },
    { icon: <FaCheckCircle />, text: "Verification History" },
  ];

  const historyItems = [
    {
      icon: FaFingerprint,
      label: "AePS",
      sub: "OV History",
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      icon: FaFingerprint,
      label: "AePS",
      sub: "MS History",
      color: "text-red-600",
      bg: "bg-red-100",
    },
    {
      icon: FaFingerprint,
      label: "AePS",
      sub: "BE History",
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      icon: FaBolt,
      label: "DMT",
      sub: "History",
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      icon: FaShoppingBag,
      label: "CMS",
      sub: "History",
      color: "text-red-600",
      bg: "bg-red-100",
    },
    {
      icon: FaCreditCard,
      label: "MATM",
      sub: "History",
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      icon: FaBolt,
      label: "Instant DMT",
      sub: "History",
      color: "text-pink-600",
      bg: "bg-pink-100",
    },
    {
      icon: FaFileAlt,
      label: "RP PG",
      sub: "History",
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
  ];

  const columns = [
    { label: "SR.NO.", accessor: "id" },
    { label: "CREATED AT", accessor: "createdAt" },
    { label: "TXNUSER", accessor: "txnuser" },
    { label: "USERROLE", accessor: "userRole" },
    { label: "TXN ID", accessor: "txnId" },
    { label: "REF NO", accessor: "refNo" },
    { label: "AMOUNT", accessor: "amount" },
    { label: "PAYMENT MODE", accessor: "paymentMode" },
    { label: "STATUS", accessor: "status" },
  ];

  return (
    <div className="h-[90vh] 2xl:max-w-[80%] p-4 mx-8 dark:text-white bg-secondaryOne dark:bg-darkBlue/70 rounded-2xl 2xl:mx-auto text-gray-800 overflow-hidden overflow-y-auto px-4 pb-6 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
      <div className="px-6 py-4">
        <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
        <div className="flex gap-4 overflow-x-auto">
          {categories.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer whitespace-nowrap ${
                item.active
                  ? "bg-orange-100 dark:bg-orange-700 border-l-4 border-orange-500 font-semibold text-orange-700 dark:text-white"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <div className="text-lg">{item.icon}</div>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 max-h-[80vh] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {historyItems.map((item, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-darkBlue/45 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setTableModal(true)}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-12 h-12 ${item.bg} rounded-full flex items-center justify-center`}
                >
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <div>
                  <div className={`${item.color} font-semibold text-lg`}>
                    {item.label}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 text-sm">
                    {item.sub}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {tableModal && (
        <SuperModal onClose={() => setTableModal(false)}>
          <RunpaisaHistoryTable
            title="Runpaisa PG History"
            note="Note: search by Txn ID or Amount"
            data={sampleData}
            cols={columns}
          />
        </SuperModal>
      )}
    </div>
  );
};

export default TransactionHistory;
