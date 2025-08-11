import React, { useState } from "react";
import PaginatedTable from "../../components/utility/PaginatedTable";
import FilterBar from "../../components/utility/FilterBar";
import { SuperModal } from "../../components/utility/SuperModel";
import BankDetailsForm from "../../components/setup_tools/BankDetailsForm";
import { ToggleButton } from "../../components/utility/ToggleButton";

const data = [
  {
    id: 3,
    bankName: "hdfc",
    accountNumber: "50200071035081",
    ifsc: "HDFC0005853",
    branch: "hyderabad",
    charge: 0,
    status: true,
  },
  {
    id: 2,
    bankName: "vamsi",
    accountNumber: "913010015266082",
    ifsc: "UTIB0000008",
    branch: "Begumpet",
    charge: 0,
    status: false,
  },
  {
    id: 1,
    bankName: "TEST",
    accountNumber: "1234567890",
    ifsc: "TEST1234567",
    branch: "TEST",
    charge: 0,
    status: false,
  },
];

export const BankAccount = () => {
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    searchValue: "",
    userId: "",
    status: "",
    product: "",
  });

  const [filteredData, setFilteredData] = useState([...data]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const handleInputChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    let filtered = [...data];

    // Optional: Handle future filter logic
    // if (filters.userId) {
    //   filtered = filtered.filter((d) =>
    //     String(d.id).includes(String(filters.userId))
    //   );
    // }

    // if (filters.searchValue) {
    //   const val = filters.searchValue.toLowerCase();
    //   filtered = filtered.filter((d) =>
    //     d.productName.toLowerCase().includes(val)
    //   );
    // }

    // if (filters.status) {
    //   filtered = filtered.filter((d) =>
    //     filters.status === "active" ? d.status : !d.status
    //   );
    // }

    setFilteredData(filtered);
    setCurrentPage(1);
    return filtered;
  };

  const handleToggle = (indexInDisplay) => {
    const actualIndex = (currentPage - 1) * pageSize + indexInDisplay;
    const updated = [...filteredData];
    updated[actualIndex].status = !updated[actualIndex].status;
    setFilteredData(updated);
  };

  //   Edit API Manager
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState(null);

  // Call this when clicking "Edit"
  const handleEditClick = (row) => {
    setEditData(row);
    setEditModal(true);
  };
  const handleAddClick = () => {
    setEditData(null);
    setEditModal(true);
  };

  const handleFormSubmit = (data) => {
    // Convert file input (if needed)
    if (data.qr && data.qr.length > 0) {
      data.qr = data.qr[0];
    }
    console.log("Submitted Data:", data);
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
        { label: "Select Status", value: "" },
        { label: "Active", value: "active" },
        { label: "De-active", value: "de-active" },
      ],
    },
  ];

  const columns = [
    { header: "#", accessor: "id" },
    { header: "Bank Name", accessor: "bankName" },
    {
      header: "Account / QR",
      accessor: "accountNumber",
      render: (row) => (
        <span className="whitespace-nowrap">A/C No.: {row.accountNumber}</span>
      ),
    },
    { header: "IFSC", accessor: "ifsc" },
    { header: "Branch", accessor: "branch" },
    { header: "Charge", accessor: "charge" },
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
        <button
          className="btn-md bg-secondary px-4 py-1 text-white rounded hover:bg-secondary/80 transition"
          onClick={() => handleEditClick(row)}
        >
          Edit
        </button>
      ),
    },
  ];

  return (
    <div className="h-[90vh] 2xl:max-w-[80%] p-4 mx-8 bg-secondaryOne dark:bg-darkBlue/70 rounded-2xl 2xl:mx-auto text-gray-800 overflow-hidden overflow-y-auto px-4 pb-6 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
      <div className="my-4 p-4 rounded-md bg-white dark:bg-transparent">
        <div className=" flex gap-3 justify-between">
          <h2 className="text-2xl font-bold dark:text-adminOffWhite">
            Bank Account List
          </h2>
        </div>
        <FilterBar fields={fields} onSearch={applyFilters} />
      </div>
      <div className="flex justify-between mb-2">
        <div className=""></div>
        <button className="btn bg-accentGreen" onClick={handleAddClick}>
          + Add New
        </button>
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

      {editModal && (
        <SuperModal onClose={() => setEditModal(false)}>
          <BankDetailsForm initialData={editData} onSubmit={handleFormSubmit} />
        </SuperModal>
      )}
    </div>
  );
};
