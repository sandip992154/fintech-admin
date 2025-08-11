import React, { useState } from "react";
import PaginatedTable from "../../components/utility/PaginatedTable";
import FilterBar from "../../components/utility/FilterBar";
import ExcelExportButton from "../../components/utility/ExcelExportButton";

export const MainWallet = () => {
  const Data = [];
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    searchValue: "",
    userId: "",
    status: "",
    product: "",
  });
  const [filteredData, setFilteredData] = useState([...Data]);
  const [currentPage, setCurrentPage] = useState(1);
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
    let data = [...Data];

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
  ];

  const columns = [
    { header: "#", accessor: "id" },
    {
      header: "Refrences Details",
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
      header: "Product",
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
      header: "Provider",
      accessor: "referenceDetails",
      render: (row) => (
        <div>
          <p>{row.referenceDetails.transactionId}</p>
          <p>{row.referenceDetails.dateTime}</p>
        </div>
      ),
    },
    {
      header: "Txnid",
      accessor: "remark",
    },
    {
      header: "Order ID",
      accessor: "remark",
    },
    {
      header: "Number",
      accessor: "remark",
    },
    {
      header: "ST_Type / TXN_Type",
      accessor: "remark",
    },
    {
      header: "Status",
      accessor: "remark",
    },
    {
      header: "Opening Bal.",
      accessor: "remark",
    },
    {
      header: "Amount",
      accessor: "remark",
    },
    {
      header: "Charge",
      accessor: "action",
    },
    {
      header: "Commission/Profit",
      accessor: "remark",
    },
    {
      header: "Closing Bal.",
      accessor: "action",
    },
  ];

  const handleExport = () => {
    const exportData = filteredData.map((item) => ({
      "#": item.id || "N/A",

      // Refrences Details
      "Requested By": item.requestedBy?.name || "N/A",
      "Requester Mobile": item.requestedBy?.mobile || "N/A",
      "Requester Role": item.requestedBy?.role || "N/A",

      // Product Details
      "Bank Name": item.depositDetails?.bankName || "N/A",
      "Account No": item.depositDetails?.accountNo || "N/A",
      IFSC: item.depositDetails?.ifsc || "N/A",

      // Provider
      "Transaction ID": item.referenceDetails?.transactionId || "N/A",
      "Transaction Date": item.referenceDetails?.dateTime || "N/A",

      // Repeated Remark Fields
      Txnid: item.remark || "N/A",
      "Order ID": item.remark || "N/A",
      Number: item.remark || "N/A",
      "ST_Type / TXN_Type": item.remark || "N/A",
      Status: item.remark || "N/A",
      "Opening Bal.": item.remark || "N/A",
      Amount: item.remark || "N/A",
      Charge: item.action || "N/A",
      "Commission/Profit": item.remark || "N/A",
      "Closing Bal.": item.action || "N/A",
    }));

    return exportData;
  };

  return (
    <div className="h-[90vh] 2xl:max-w-[80%] p-4 mx-8 bg-secondaryOne dark:bg-darkBlue/70 rounded-2xl 2xl:mx-auto text-gray-800 overflow-hidden overflow-y-auto px-4 pb-6 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
      <div className="my-4 p-4 rounded-md bg-white dark:bg-transparent">
        <div className=" flex gap-3 justify-between">
          <h2 className="text-2xl font-bold dark:text-adminOffWhite">
            Account Statement
          </h2>
          <div className="">
            <button className="btn-24 text-adminOffWhite bg-accentRed ">
              Refresh
            </button>
            <ExcelExportButton
              buttonLabel="Export"
              fileName="verification-statement.xlsx"
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
