import { useEffect, useState } from "react";
import FilterBar from "../../components/utility/FilterBar";

import { AEPSData } from "../../assets/assets";

const SuperAEPS = () => {
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    searchValue: "",
    userId: "",
    status: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [displayData, setDisplayData] = useState([]);

  const pageSize = 10;
  const maxVisiblePages = 5;

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

  useEffect(() => {
    paginateData();
  }, [filteredData, currentPage]);

  // filters function
  const applyFilters = () => {
    let data = [...AEPSData];

    if (filters.searchValue) {
      data = data.filter((d) =>
        d.userDetails.name
          .toLowerCase()
          .includes(String(filters.searchValue).toLowerCase())
      );
    }

    if (filters.userId) {
      data = data.filter((d) => d.userDetails.id == filters.userId);
    }

    if (filters.status) {
      data = data.filter((d) => d.status.toString() === filters.status);
    }
    setFilteredData(data);
    setCurrentPage(1);
  };

  const paginateData = () => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    setDisplayData(filteredData.slice(start, end));
  };

  const totalPages = Math.ceil(filteredData.length / pageSize);

  // Pagination
  const getPaginationRange = () => {
    let start = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
    let end = start + maxVisiblePages - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(end - maxVisiblePages + 1, 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
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
        { label: "approved", value: "approved" },
        { label: "rejected", value: "rejected" },
      ],
    },
  ];

  return (
    <div className="h-[90vh] 2xl:max-w-[80%] p-4 mx-8 bg-secondaryOne dark:bg-darkBlue/70 rounded-2xl 2xl:mx-auto text-gray-800 overflow-hidden overflow-y-auto px-4 pb-6 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
      <div className="my-4 p-4 rounded-md bg-white dark:bg-transparent">
        <h2 className="text-2xl font-bold dark:text-adminOffWhite">
          AEPS Agent List
        </h2>
        <FilterBar fields={fields} onSearch={applyFilters} />
      </div>

      <div className="p-6 rounded-md w-full bg-white dark:bg-transparent dark:text-white">
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-left text-sm">
            <thead>
              <tr className="bg-darkBlue/90 dark:bg-primaryBlue/30 text-white uppercase text-xs">
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">User Details</th>
                <th className="px-4 py-3">Agent Details</th>
                <th className="px-4 py-3">Details</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {displayData.map((entry, index) => (
                <tr key={index} className="border-t border-[#3F425D]">
                  <td className="px-4 py-3">
                    <div className="">{entry.id}</div>
                    <div className="">{entry.dateTime}</div>
                  </td>
                  <td className="px-4 py-3">
                    <p>{entry?.userDetails?.name}</p>
                    <p>{entry?.userDetails?.id}</p>
                    <p>{entry?.userDetails?.role}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p>Agent ID -{entry?.agentDetails?.agentId}</p>
                    <p>Agent Name -{entry?.agentDetails?.agentName}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p>Mobile - {entry?.details?.mobile}</p>
                    <p>KYC Name - {entry?.details?.kycName}</p>
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    <button
                      className={`px-3 py-2  w-24 rounded font-semibold text-white capitalize ${
                        entry.status === "success"
                          ? "bg-green-500"
                          : entry.status === "pending"
                          ? "bg-yellow-500"
                          : entry.status === "failed"
                          ? "bg-red-600"
                          : entry.status === "approved"
                          ? "bg-blue-500"
                          : entry.status === "rejected"
                          ? "bg-gray-500"
                          : "bg-slate-400"
                      }`}
                    >
                      {entry.status}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-between items-center text-sm text-gray-300">
          <p>
            Showing{" "}
            {Math.min((currentPage - 1) * pageSize + 1, filteredData.length)} to{" "}
            {Math.min(currentPage * pageSize, filteredData.length)} of{" "}
            {filteredData.length} entries
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-[#1F2235] text-gray-500 rounded disabled:opacity-30"
            >
              ←
            </button>

            {getPaginationRange().map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-1 rounded ${
                  currentPage === pageNum
                    ? "bg-secondary text-white"
                    : "bg-[#1F2235] text-gray-500"
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-[#1F2235] text-gray-500 rounded disabled:opacity-30"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAEPS;
