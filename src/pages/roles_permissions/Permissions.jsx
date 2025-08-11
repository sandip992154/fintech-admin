import React, { useState } from "react";
import PaginatedTable from "../../components/utility/PaginatedTable";
import FilterBar from "../../components/utility/FilterBar";
import { SuperModal } from "../../components/utility/SuperModel";
import PermissionForm from "../../components/roles_permissions/PermissionForm";

const data = [
  {
    id: 138,
    name: "ccpay_service",
    displayName: "CC Service",
    type: "service",
    lastUpdated: "27 Mar 24 - 05:00 PM",
  },
  {
    id: 137,
    name: "matm_service",
    displayName: "Matm service",
    type: "service",
    lastUpdated: "27 Mar 24 - 05:00 PM",
  },
  {
    id: 136,
    name: "affiliate_statement",
    displayName: "Affiliate Statement",
    type: "report",
    lastUpdated: "27 Mar 24 - 05:00 PM",
  },
  {
    id: 135,
    name: "affiliate_service",
    displayName: "Affiliate Service",
    type: "service",
    lastUpdated: "27 Mar 24 - 05:00 PM",
  },
  {
    id: 134,
    name: "commission_settlement_service",
    displayName: "Commission Settlement Service",
    type: "service",
    lastUpdated: "27 Mar 24 - 05:00 PM",
  },
  {
    id: 133,
    name: "commission_settlement",
    displayName: "Commission Settlement",
    type: "service",
    lastUpdated: "27 Mar 24 - 05:00 PM",
  },
  {
    id: 124,
    name: "utipancard_statement",
    displayName: "UTI Statement",
    type: "report",
    lastUpdated: "27 Mar 24 - 05:00 PM",
  },
];

export const Permissions = () => {
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
    if (filters.userId) {
      filtered = filtered.filter((d) =>
        String(d.id).includes(String(filters.userId))
      );
    }

    if (filters.searchValue) {
      const val = filters.searchValue.toLowerCase();
      filtered = filtered.filter((d) =>
        d.productName.toLowerCase().includes(val)
      );
    }

    if (filters.status) {
      filtered = filtered.filter((d) =>
        filters.status === "active" ? d.status : !d.status
      );
    }

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
  const [isModal, setIsModal] = useState(false);
  const [editData, setEditData] = useState(null);

  // Call this when clicking "Edit"
  const handleEditClick = (row) => {
    setEditData(row);
    setIsModal(true);
  };
  const handleAddClick = () => {
    setEditData(null);
    setIsModal(true);
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
  ];

  const columns = [
    { header: "#", accessor: "id" },
    { header: "Name", accessor: "name" },
    { header: "Display Name", accessor: "displayName" },
    { header: "Type", accessor: "type" },
    { header: "Last Updated", accessor: "lastUpdated" },
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
            Permissions List
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
        pageSize={pageSize}
      />

      {isModal && (
        <SuperModal onClose={() => setIsModal(false)}>
          <PermissionForm
            initialData={editData}
            setIsModal={setIsModal}
            onSubmitForm={(data) => {
              console.log("Form submitted:", data);
              // handle add/edit logic here
            }}
          />
        </SuperModal>
      )}
    </div>
  );
};
