import { useState } from "react";
import PaginatedTable from "../../components/utility/PaginatedTable";
import FilterBar from "../../components/utility/FilterBar";

export const MobileUserLogout = () => {
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

    return data;
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
    { header: "AGENT ID", accessor: "id" },
    {
      header: "IP",
      accessor: "requestedBy",
      render: (row) => <></>,
    },
    {
      header: "Last Login",
      accessor: "depositDetails",
      render: (row) => <div></div>,
    },
    {
      header: "Action",
      accessor: "remark",
    },
  ];

  return (
    <div className="h-[90vh] 2xl:max-w-[80%] p-4 mx-8 bg-secondaryOne dark:bg-darkBlue/70 rounded-2xl 2xl:mx-auto text-gray-800 overflow-hidden overflow-y-auto px-4 pb-6 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
      <div className="my-4 p-4 rounded-md bg-white dark:bg-transparent">
        <div className=" flex gap-3 justify-between">
          <h2 className="text-2xl font-bold dark:text-adminOffWhite">
            Token Delete
          </h2>
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
        setFilteredData={setFilteredData}
        pageSize={pageSize}
      />
    </div>
  );
};
