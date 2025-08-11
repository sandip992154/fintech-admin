import { useEffect, useState } from "react";
import FilterBar from "../../components/utility/FilterBar";
import PaginatedTable from "../../components/utility/PaginatedTable";
import ExcelExportButton from "../../components/utility/ExcelExportButton";

export const Request = () => {
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
    { header: "#", accessor: "id" },
    { header: "Product Name", accessor: "productName" },
    { header: "Display Name", accessor: "displayName" },
    { header: "API Code", accessor: "apiCode" },
    {
      header: "Credentials",
      accessor: "credentials",
      render: (row) => (
        <span className="text-blue-500 cursor-pointer">{row.credentials}</span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (row, idx) => (
        <ToggleButton row={row} onchange={() => handleToggle(idx)} />
      ),
    },
    {
      header: "Action",
      accessor: "action",
      render: (row) => (
        <button className="btn-md bg-secondary" onClick={handleEditClick}>
          Edit
        </button>
      ),
    },
  ];

  const handleExport = () => {
    const exportData = filteredData.map((item) => ({
      Id: item.id || "N/A",
      Date: item.date || "N/A",
      Name: item.username || "N/A",
      Email: item.email || "N/A",
      Mobile: item.mobile || "N/A",
      "Role Name": item.type || "N/A",
      "Main Balance": item.mainBalance || "N/A",
      "Aeps Balance": item.aepsBalance || "N/A",
      Parent: item.parentName || "N/A",
      Company: item.website || "N/A",
      Status: item.status ? "Active" : "Inactive",
      address: user.Profile_Details.address || "N/A",
      City: user.Profile_Details.city || "N/A",
      State: user.Profile_Details.state || "N/A",
      Pincode: user.Profile_Details.pinCode || "N/A",
      Shopname: user.KYC_Profile.shopName || "N/A",
      "Gst Tin": user.KYC_Profile.gstNumber || "N/A",
      Pancard: user.KYC_Profile.panNumber || "N/A",
      "Aadhar Card": user.KYC_Profile.aadharNumber || "N/A",
      Account: user.Bank_Details.accountNUmber || "N/A",
      Bank: user.Bank_Details.bankName || "N/A",
      Ifsc: user.Bank_Details.ifscCode || "N/A",
    }));

    return exportData;
  };

  return (
    <div className="h-[90vh] 2xl:max-w-[80%] p-4 mx-8 bg-secondaryOne dark:bg-darkBlue/70 rounded-2xl 2xl:mx-auto text-gray-800 overflow-hidden overflow-y-auto px-4 pb-6 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
      <div className="my-4 p-4 rounded-md bg-white dark:bg-transparent">
        <div className=" flex gap-3 justify-between">
          <h2 className="text-2xl font-bold dark:text-adminOffWhite">
            Fund Request
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
