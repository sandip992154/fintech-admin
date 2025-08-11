import { useEffect, useState } from "react";
import FilterBar from "../../components/utility/FilterBar";
import { AEPSData } from "../../assets/assets";
import ExcelExportButton from "../../components/utility/ExcelExportButton";
import PaginatedTable from "../../components/utility/PaginatedTable";

const SuperUTI = () => {
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    searchValue: "",
    userId: "",
    status: "",
  });

  const [filteredData, setFilteredData] = useState([...AEPSData]);
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

  const columns = [
    {
      header: "ID",
      accessor: "id",
      render: (row) => <span>{row.id}</span>,
    },
    {
      header: "Date & Time",
      accessor: "dateTime",
      render: (row) => <span>{row.dateTime}</span>,
    },
    {
      header: "User Info",
      accessor: "userDetails",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.userDetails?.name}</span>
          <span>ID: {row.userDetails?.id}</span>
          <span className="text-sm italic">{row.userDetails?.role}</span>
        </div>
      ),
    },
    {
      header: "Agent Info",
      accessor: "agentDetails",
      render: (row) => (
        <div className="flex flex-col">
          <span>ID: {row.agentDetails?.agentId}</span>
          <span className="text-blue-600">{row.agentDetails?.agentName}</span>
        </div>
      ),
    },
    {
      header: "KYC Details",
      accessor: "details",
      render: (row) => (
        <div className="flex flex-col">
          <span>Mobile: {row.details?.mobile}</span>
          <span>KYC: {row.details?.kycName}</span>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => {
        const statusColor = {
          success: "text-green-600",
          failed: "text-red-600",
          pending: "text-yellow-600",
          approved: "text-blue-600",
          rejected: "text-gray-500",
        };
        return (
          <span className={`${statusColor[row.status]} ` || "text-black "}>
            {row.status?.toUpperCase()}
          </span>
        );
      },
    },
  ];

  const handleExport = () => {
    const exportData = filteredData.map((item) => ({
      ID: item.id || "N/A",
      DateTime: item.dateTime || "N/A",
      "User ID": item.userDetails?.id || "N/A",
      "User Name": item.userDetails?.name || "N/A",
      "User Role": item.userDetails?.role || "N/A",
      "Agent ID": item.agentDetails?.agentId || "N/A",
      "Agent Name": item.agentDetails?.agentName || "N/A",
      Mobile: item.details?.mobile || "N/A",
      "KYC Name": item.details?.kycName || "N/A",
      Status: item.status || "N/A",
    }));

    return exportData;
  };

  return (
    <div className="h-[90vh] 2xl:max-w-[80%] p-4 mx-8 bg-secondaryOne dark:bg-darkBlue/70 rounded-2xl 2xl:mx-auto text-gray-800 overflow-hidden overflow-y-auto px-4 pb-6 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
      <div className="my-4 p-4 rounded-md bg-white dark:bg-transparent">
        <div className=" flex gap-3 justify-between">
          <h2 className="text-2xl font-bold dark:text-adminOffWhite">
            UTI ID Statement
          </h2>
          <div className="">
            <button className="btn-24 text-adminOffWhite bg-accentRed ">
              Refresh
            </button>
            <ExcelExportButton
              buttonLabel="Export"
              fileName="request.xlsx"
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

export default SuperUTI;
