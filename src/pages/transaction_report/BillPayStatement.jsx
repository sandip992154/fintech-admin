import React, { useState } from "react";
import { sampleData } from "../../assets/assets";
import FilterBar from "../../components/utility/FilterBar";
import PaginatedTable from "../../components/utility/PaginatedTable";
import ExcelExportButton from "../../components/utility/ExcelExportButton";

export const BillPayStatement = () => {
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    searchValue: "",
    userId: "",
    status: "",
    product: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const pageSize = 10;

  // ✅ Generic input handler
  const handleInputChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // filters function
  const applyFilters = () => {
    let data = [...sampleData];

    // Filter by Search: requestedBy.name or mobile
    if (filters.searchValue) {
      const term = filters.searchValue.toLowerCase();
      data = data.filter(
        (d) =>
          d.requestedBy.name.toLowerCase().includes(term) ||
          d.requestedBy.mobile.includes(term)
      );
    }

    // Filter by User ID (exact match)
    if (filters.userId) {
      data = data.filter((d) => String(d.id) === String(filters.userId));
    }

    // Filter by Status (action)
    if (filters.status) {
      data = data.filter(
        (d) => d.action.toLowerCase() === filters.status.toLowerCase()
      );
    }

    // Filter by Product (assumed product info is in remark field or depositDetails.bankName)
    if (filters.product) {
      const term = filters.product.toLowerCase();
      data = data.filter(
        (d) =>
          d.remark.toLowerCase().includes(term) || // if you're using remark to store product info
          d.depositDetails.bankName.toLowerCase().includes(term) // optional based on assumption
      );
    }

    // Filter by From and To Date (on referenceDetails.dateTime)
    if (filters.fromDate || filters.toDate) {
      data = data.filter((d) => {
        const entryDate = new Date(d.referenceDetails.dateTime);
        const fromDate = filters.fromDate ? new Date(filters.fromDate) : null;
        const toDate = filters.toDate ? new Date(filters.toDate) : null;

        if (fromDate && entryDate < fromDate) return false;
        if (toDate && entryDate > toDate) return false;
        return true;
      });
    }

    setFilteredData(data);
    setCurrentPage(1);
  };

  const fields = [
    {
      name: "fromDate",
      type: "date",
      placeholder: "From Date",
      value: filters.fromDate || "",
      onChange: (val) => handleInputChange("fromDate", val),
    },
    {
      name: "toDate",
      type: "date",
      placeholder: "To Date",
      value: filters.toDate || "",
      onChange: (val) => handleInputChange("toDate", val),
    },
    {
      name: "searchValue",
      type: "text",
      placeholder: "Search Value",
      value: filters.searchValue || "",
      onChange: (val) => handleInputChange("searchValue", val),
    },
    {
      name: "userId",
      type: "text",
      placeholder: "Agent/Parent",
      value: filters.userId || "",
      onChange: (val) => handleInputChange("userId", val),
    },
    {
      name: "status",
      type: "select",
      placeholder: "Select Status",
      value: filters.status || "",
      onChange: (val) => handleInputChange("status", val),
      options: [
        { label: "success", value: "success" },
        { label: "pending", value: "pending" },
        { label: "failed", value: "failed" },
        { label: "reversed", value: "reversed" },
        { label: "refunded", value: "refunded" },
      ],
    },
    {
      name: "product",
      type: "select",
      placeholder: "Select Product",
      value: filters.product || "",
      onChange: (val) => handleInputChange("product", val),
      options: [
        { label: "Select Biller", value: "" },
        {
          label: "Adani Electricity Mumbai Limited",
          value: "Adani Electricity Mumbai Limited",
        },
        {
          label: "Ajmer Vidyut Vitran Nigam Limited (AVVNL)",
          value: "Ajmer Vidyut Vitran Nigam Limited (AVVNL)",
        },
        {
          label: "Assam Power Distribution Company Ltd (NON-RAPDR)",
          value: "Assam Power Distribution Company Ltd (NON-RAPDR)",
        },
        {
          label: "Assam Power Distribution Company Ltd-Smart Prepaid Recharge",
          value: "Assam Power Distribution Company Ltd-Smart Prepaid Recharge",
        },
        {
          label: "Bangalore Electricity Supply Co. Ltd (BESCOM)",
          value: "Bangalore Electricity Supply Co. Ltd (BESCOM)",
        },
        { label: "B.E.S.T Mumbai", value: "B.E.S.T Mumbai" },
        {
          label: "Bharatpur Electricity Services Ltd. (BESL)",
          value: "Bharatpur Electricity Services Ltd. (BESL)",
        },
        {
          label: "Bikaner Electricity Supply Limited (BkESL)",
          value: "Bikaner Electricity Supply Limited (BkESL)",
        },
        {
          label: "BSES Rajdhani Power Limited",
          value: "BSES Rajdhani Power Limited",
        },
        {
          label: "BSES Rajdhani Prepaid Meter Recharge",
          value: "BSES Rajdhani Prepaid Meter Recharge",
        },
        {
          label: "BSES Yamuna Power Limited",
          value: "BSES Yamuna Power Limited",
        },
        { label: "CESC Limited", value: "CESC Limited" },
        {
          label: "Chamundeshwari Electricity Supply Corp Ltd (CESCOM)",
          value: "Chamundeshwari Electricity Supply Corp Ltd (CESCOM)",
        },
        {
          label: "Chhattisgarh State Power Distribution Co. Ltd",
          value: "Chhattisgarh State Power Distribution Co. Ltd",
        },
        {
          label:
            "Dadra and Nagar Haveli and Daman and Diu Power Distribution Corporation Limited",
          value:
            "Dadra and Nagar Haveli and Daman and Diu Power Distribution Corporation Limited",
        },
        {
          label:
            "Dakshinanchal Vidyut Vitran Nigam Limited (DVVNL)(Postpaid and Smart Prepaid Meter Recharge)",
          value:
            "Dakshinanchal Vidyut Vitran Nigam Limited (DVVNL)(Postpaid and Smart Prepaid Meter Recharge)",
        },
        {
          label: "Dakshin Gujarat Vij Company Limited (DGVCL)",
          value: "Dakshin Gujarat Vij Company Limited (DGVCL)",
        },
      ],
    },
  ];

  const columns = [
    { header: "Order Id", accessor: "id" },
    {
      header: "User Details",
      accessor: "requestedBy",
      render: (row) => (
        <div>
          <p>{row.requestedBy.name}</p>
          <p>{row.requestedBy.mobile}</p>
          <p>{row.requestedBy.role}</p>
        </div>
      ),
    },
    {
      header: "Transaction DETAILS",
      accessor: "depositDetails",
      render: (row) => (
        <div>
          <p>{row.depositDetails.bankName}</p>
          <p>{row.depositDetails.accountNo}</p>
          <p>{row.depositDetails.ifsc}</p>
        </div>
      ),
    },
    {
      header: "Biller Details",
      accessor: "referenceDetails",
      render: (row) => (
        <div>
          <p>{row.referenceDetails.transactionId}</p>
          <p>{row.referenceDetails.dateTime}</p>
        </div>
      ),
    },
    {
      header: "Reference Details",
      accessor: "wallet",
      render: (row) => (
        <div>
          <p>Main: ₹{row.wallet.main}</p>
          <p>Locked: ₹{row.wallet.locked}</p>
        </div>
      ),
    },
    {
      header: "Amount/Commission",
      accessor: "remark",
    },
    {
      header: "Status",
      accessor: "action",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            row.action === "success"
              ? "bg-green-200 text-green-800"
              : "bg-red-200 text-red-800"
          }`}
        >
          {row.action}
        </span>
      ),
    },
  ];

  const handleExport = () => {
    const exportData = filteredData.map((item) => ({
      ID: item.id || "N/A",

      // Requester Info
      "Requested By": item.requestedBy?.name || "N/A",
      "Requester Mobile": item.requestedBy?.mobile || "N/A",
      "Requester Role": item.requestedBy?.role || "N/A",

      // Bank/Deposit Info
      "Bank Name": item.depositDetails?.bankName || "N/A",
      "Account No": item.depositDetails?.accountNo || "N/A",
      IFSC: item.depositDetails?.ifsc || "N/A",

      // Reference Info
      "Transaction ID": item.referenceDetails?.transactionId || "N/A",
      "Transaction Date": item.referenceDetails?.dateTime || "N/A",

      // Wallet Info
      "Main Wallet": item.wallet?.main || 0,
      "Locked Wallet": item.wallet?.locked || 0,

      // Additional
      Remark: item.remark || "N/A",
      Action: item.action || "N/A",
    }));

    return exportData;
  };

  return (
    <div className="h-[90vh] 2xl:max-w-[80%] p-4 mx-8 bg-secondaryOne dark:bg-darkBlue/70 rounded-2xl 2xl:mx-auto text-gray-800 overflow-hidden overflow-y-auto px-4 pb-6 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
      <div className="my-4 p-4 rounded-md bg-white dark:bg-transparent">
        <div className=" flex gap-3 justify-between">
          <h2 className="text-2xl font-bold dark:text-adminOffWhite">
            Bill Payment Statement
          </h2>
          <div className="">
            <button className="btn-24 text-adminOffWhite bg-accentRed ">
              Refresh
            </button>
            <ExcelExportButton
              buttonLabel="Export"
              fileName="bill-payment.xlsx"
              data={handleExport()}
            />
          </div>
        </div>
        <FilterBar fields={fields} onSearch={applyFilters} />
      </div>

      <PaginatedTable
        data={filteredData}
        filters={filters}
        onSearch={applyFilters}
        columns={columns}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
      />
    </div>
  );
};
