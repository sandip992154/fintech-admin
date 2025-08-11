import { useEffect, useState } from "react";
import FilterBar from "../../components/utility/FilterBar";
import PaginatedTable from "../../components/utility/PaginatedTable";

export const RequestReport = () => {
  const Data = [];

  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    searchValue: "",
    userId: "",
    status: "",
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

  useEffect(() => {
    applyFilters();
  }, [filters]);

  // filters function
  const applyFilters = () => {
    let data = [...Data];

    if (filters.searchValue) {
      data = data.filter((d) =>
        d.name.toLowerCase().includes(String(filters.searchValue).toLowerCase())
      );
    }

    if (filters.userId) {
      data = data.filter((d) => d.id == filters.userId);
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
    {
      header: "#",
      accessor: "kycStatus",
      render: (row) => (
        <div>
          <button className="btn-24 !w-28 text-xs bg-accentGreen text-adminOffWhite ml-1">
            {row.kycStatus}
          </button>
          <span>{row.id}</span>
          <div>{row.dateTime}</div>
        </div>
      ),
    },
    {
      header: "REQUESTED BY",
      accessor: "requestedBy",
      render: (row) => (
        <>
          <p>{row.name}</p>
          <p>{row.mobile}</p>
          <p>{row.role}</p>
        </>
      ),
    },
    {
      header: "DEPOSIT BANK DETAILS",
      accessor: "depositBank",
      render: (row) => (
        <>
          <p>
            {row.parent?.name} ({row.parent?.id})
          </p>
          <p>{row.parent?.mobile}</p>
          <p>{row.parent?.role}</p>
        </>
      ),
    },
    {
      header: "REFERENCE DETAILS",
      accessor: "companyProfile",
      render: (row) => <p>{row.companyProfile}</p>,
    },
    {
      header: "AMOUNT",
      accessor: "wallet",
      render: (row) => (
        <>
          <p>main - {row.wallet?.main}/-</p>
          <p>Locked - {row.wallet?.locked}/-</p>
        </>
      ),
    },
    {
      header: "REMARK",
      accessor: "remark",
      render: () => (
        <button className="btn-24 font-semibold bg-secondary text-white capitalize text-wrap text-xs">
          Transfer / Return
        </button>
      ),
    },
    {
      header: "ACTION",
      accessor: "action",
      render: (row) => (
        <button
          onClick={() => console.log("Action on", row.id)}
          className="btn-sm bg-primary hover:bg-primary/80 text-white px-2 py-1 rounded"
        >
          View
        </button>
      ),
    },
  ];

  return (
    <div className="h-[90vh] 2xl:max-w-[80%] p-4 mx-8 bg-secondaryOne dark:bg-darkBlue/70 rounded-2xl 2xl:mx-auto text-gray-800 overflow-hidden overflow-y-auto px-4 pb-6 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
      <div className="my-4 p-4 rounded-md bg-white dark:bg-transparent">
        <h2 className="text-2xl font-bold dark:text-adminOffWhite">
          Fund Request
        </h2>
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
