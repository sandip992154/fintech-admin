import React, { useState, useEffect, useCallback } from "react";
import PaginatedTable from "../../components/utility/PaginatedTable";
import FilterBar from "../../components/utility/FilterBar";
import ExcelExportButton from "../../components/utility/ExcelExportButton";
import walletService from "../../services/walletService";

export const MainWallet = () => {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    searchValue: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const fetchTransactions = useCallback(async (fromDate, toDate) => {
    setLoading(true);
    setError(null);
    try {
      const result = await walletService.getTransactionHistory(
        fromDate || null,
        toDate || null
      );
      if (result.success) {
        const rows = Array.isArray(result.data)
          ? result.data
          : result.data?.transactions || [];
        setAllData(rows);
        setFilteredData(rows);
      } else {
        setError(result.message || "Failed to load transactions.");
        setAllData([]);
        setFilteredData([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions("", "");
  }, [fetchTransactions]);

  const handleInputChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    fetchTransactions(filters.fromDate, filters.toDate);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    fetchTransactions(filters.fromDate, filters.toDate);
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
      placeholder: "Search Ref ID / Remark",
      value: filters.searchValue || "",
      onChange: (val) => {
        handleInputChange("searchValue", val);
        if (!val) {
          setFilteredData(allData);
        } else {
          const term = val.toLowerCase();
          setFilteredData(
            allData.filter(
              (d) =>
                String(d.reference_id || "").toLowerCase().includes(term) ||
                String(d.remark || "").toLowerCase().includes(term) ||
                String(d.description || "").toLowerCase().includes(term) ||
                String(d.transaction_type || d.type || "").toLowerCase().includes(term)
            )
          );
          setCurrentPage(1);
        }
      },
    },
  ];

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount) => {
    if (amount === null || amount === undefined) return "—";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const columns = [
    {
      header: "#",
      accessor: "id",
      render: (row, idx) => (currentPage - 1) * pageSize + idx + 1,
    },
    {
      header: "Date & Time",
      accessor: "created_at",
      render: (row) => <span className="whitespace-nowrap">{formatDate(row.created_at)}</span>,
    },
    {
      header: "Reference ID",
      accessor: "reference_id",
      render: (row) => (
        <span className="font-mono text-xs">{row.reference_id || "—"}</span>
      ),
    },
    {
      header: "Transaction Type",
      accessor: "transaction_type",
      render: (row) => {
        const type = (row.transaction_type || row.type || "").toLowerCase();
        return (
          <span
            className={`px-2 py-1 rounded text-xs font-semibold ${
              type === "credit"
                ? "bg-green-100 text-green-700"
                : type === "debit"
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {(row.transaction_type || row.type || "—").toUpperCase()}
          </span>
        );
      },
    },
    {
      header: "Remark / Description",
      accessor: "remark",
      render: (row) => (
        <span className="text-xs">{row.remark || row.description || "—"}</span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => {
        const status = (row.status || "").toLowerCase();
        return (
          <span
            className={`px-2 py-1 rounded text-xs font-semibold ${
              status === "success" || status === "completed"
                ? "bg-green-100 text-green-700"
                : status === "failed"
                ? "bg-red-100 text-red-700"
                : status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {row.status || "—"}
          </span>
        );
      },
    },
    {
      header: "Opening Bal.",
      accessor: "balance_before",
      render: (row) => formatAmount(row.balance_before),
    },
    {
      header: "Amount",
      accessor: "amount",
      render: (row) => (
        <span
          className={
            (row.transaction_type || row.type || "").toLowerCase() === "debit"
              ? "text-red-600 font-semibold"
              : "text-green-600 font-semibold"
          }
        >
          {formatAmount(row.amount)}
        </span>
      ),
    },
    {
      header: "Closing Bal.",
      accessor: "balance_after",
      render: (row) => formatAmount(row.balance_after),
    },
  ];

  const handleExport = () =>
    filteredData.map((item, idx) => ({
      "#": idx + 1,
      "Date & Time": formatDate(item.created_at),
      "Reference ID": item.reference_id || "N/A",
      "Transaction Type": item.transaction_type || item.type || "N/A",
      "Remark / Description": item.remark || item.description || "N/A",
      Status: item.status || "N/A",
      "Opening Balance": item.balance_before ?? "N/A",
      Amount: item.amount ?? "N/A",
      "Closing Balance": item.balance_after ?? "N/A",
    }));

  return (
    <div className="h-[90vh] 2xl:max-w-[80%] p-4 mx-8 bg-secondaryOne dark:bg-darkBlue/70 rounded-2xl 2xl:mx-auto text-gray-800 overflow-hidden overflow-y-auto px-4 pb-6 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
      <div className="my-4 p-4 rounded-md bg-white dark:bg-transparent">
        <div className="flex gap-3 justify-between">
          <h2 className="text-2xl font-bold dark:text-adminOffWhite">
            Account Statement
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="btn-24 text-adminOffWhite bg-accentRed disabled:opacity-60"
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
            <ExcelExportButton
              buttonLabel="Export"
              fileName="account-statement.xlsx"
              data={handleExport()}
            />
          </div>
        </div>
        <FilterBar fields={fields} onSearch={applyFilters} />
      </div>

      {error && (
        <div className="mx-4 mb-4 px-4 py-3 rounded bg-red-100 text-red-700 text-sm">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center py-12 text-gray-500">
          Loading transactions...
        </div>
      )}

      {!loading && (
        <PaginatedTable
          data={filteredData}
          filters={filters}
          onSearch={applyFilters}
          columns={columns}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pageSize={pageSize}
        />
      )}
    </div>
  );
};

