import { useEffect, useState } from "react";

import { UsersData } from "../../assets/assets";
import { SuperModal } from "../../components/utility/SuperModel";
import FilterField from "../../components/utility/FilterField";
import CommissionTable from "../../components/resource_tab/CommisonTable";
import { CommissionEditableForm } from "../../components/resource_tab/CommissionEditableForm";
import CommissionDropdown from "../../components/resource_tab/CommissionDropdown";
import FilterBar from "../../components/utility/FilterBar";
import PaginatedTable from "../../components/utility/PaginatedTable";
import { ToggleButton } from "../../components/utility/ToggleButton";
import SchemeForm from "../../components/resource_tab/SchmeForm";

const commissionDropdownOptions = [
  { label: "Mobile Recharge", modalKey: "MobileRecharge" },
  { label: "DTH Recharge", modalKey: "DTHRecharge" },
  { label: "Bill Payments", modalKey: "BillPayments" },
  { label: "AEPS", modalKey: "AEPS" },
];

export const SchemeManager = () => {
  // All modals open CLose State
  const [isModal, setIsModal] = useState({
    AddNew: false,
    ViewCommision: false,
    "Commision/Charge": false,
    MobileRecharge: false,
    AEPS: false,
    DTHRecharge: false,
    MicroATM: false,
    BillPayments: false,
  });

  //modales state
  const [schemeName, setSchemeName] = useState("");
  const [editingScheme, setEditingScheme] = useState(null);
  const [selectedCommission, setSelectedCommission] = useState({});

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
    let data = [...UsersData];

    if (filters.searchValue) {
      data = data.filter((d) =>
        d.name.toLowerCase().includes(String(filters.searchValue).toLowerCase())
      );
    }

    if (filters.userId) {
      data = data.filter((d) =>
        d.userId?.toLowerCase().includes(String(filters.userId).toLowerCase())
      );
    }

    if (filters.status) {
      data = data.filter((d) => d.status.toString() === filters.status);
    }
    setFilteredData(data);
    setCurrentPage(1);
  };

  const handleToggle = (indexInDisplay) => {
    const actualIndex = (currentPage - 1) * pageSize + indexInDisplay;
    const updated = [...filteredData];
    updated[actualIndex].status = !updated[actualIndex].status;
    setFilteredData(updated);
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
        { label: "true", value: "true" },
        { label: "false", value: "false" },
      ],
    },
  ];

  // utility for modal handlings
  const handleCommissionOptionClick = (modalKey) => {
    setIsModal((prev) => ({ ...prev, [modalKey]: true }));
  };

  const openAddModal = () => {
    setEditingScheme(null);
    setSchemeName("");
    setIsModal((prev) => ({ ...prev, AddNew: true }));
  };

  const openEditModal = (entry) => {
    setEditingScheme(entry);
    setSchemeName(entry.name);
    setIsModal((prev) => ({ ...prev, AddNew: true }));
  };

  const openViewCommissionModal = (commission) => {
    setSelectedCommission(commission || {});
    setIsModal((prev) => ({ ...prev, ViewCommision: true }));
  };

  // table columns
  const columns = [
    {
      header: "#",
      accessor: "id",
    },
    {
      header: "Name",
      accessor: "name",
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
        <div className="space-x-2">
          <button className="btn-secondary" onClick={openEditModal}>
            Edit
          </button>
          <button
            className="btn-secondary"
            onClick={() => openViewCommissionModal(row.commission)}
          >
            View Commission
          </button>
          <CommissionDropdown
            commissions={row.commission}
            setSelectedCommission={setSelectedCommission}
            commissionDropdownOptions={commissionDropdownOptions}
            handleCommissionOptionClick={handleCommissionOptionClick}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="h-[90vh] 2xl:max-w-[80%] p-4 mx-8 bg-secondaryOne dark:bg-darkBlue/70 rounded-2xl 2xl:mx-auto text-gray-800 overflow-hidden overflow-y-auto px-4 pb-6 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
      <div className="my-4 p-4 rounded-md bg-white dark:bg-transparent">
        <h2 className="text-2xl font-bold dark:text-adminOffWhite">
          Scheme Manager
        </h2>
        <FilterBar fields={fields} onSearch={applyFilters} />
      </div>

      <div className="p-6 rounded-md w-full bg-white dark:bg-transparent dark:text-white">
        <div className="flex justify-between items-center mb-4">
          <div></div>
          <button
            className="bg-[#22C55E] hover:bg-[#16a34a] text-white btn-md "
            onClick={openAddModal}
          >
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
      </div>

      {/* Add/Edit New Modal */}
      {isModal["AddNew"] && (
        <SuperModal
          onClose={() => {
            setIsModal((prev) => ({ ...prev, AddNew: false }));
            setEditingScheme(null);
            setSchemeName("");
          }}
        >
          <SchemeForm
            editingScheme={editingScheme}
            setEditingScheme={setEditingScheme}
            filteredData={filteredData}
            setFilteredData={setFilteredData}
            setIsModal={setIsModal}
          />
        </SuperModal>
      )}

      {/* view commision */}
      {isModal["ViewCommision"] && (
        <SuperModal
          onClose={() =>
            setIsModal((prev) => ({ ...prev, ViewCommision: false }))
          }
        >
          <CommissionTable
            title="View Commission"
            data={selectedCommission} // <-- your real API data
            onSubmit={(service) => {
              console.log("Submit clicked for:", service);
              // maybe call an API to save or just close
              setIsModal((prev) => ({ ...prev, ViewCommision: false }));
            }}
          />
        </SuperModal>
      )}

      {/* commission/charges */}
      {commissionDropdownOptions.map(
        ({ modalKey, label }) =>
          isModal[modalKey] && (
            <SuperModal
              key={modalKey}
              onClose={() =>
                setIsModal((prev) => ({ ...prev, [modalKey]: false }))
              }
            >
              <div className="text-lg font-semibold mb-4">
                {label} Commission
              </div>
              {/* Replace with a dynamic component based on modalKey */}
              <CommissionEditableForm
                serviceKey={modalKey}
                commission={selectedCommission}
                onClose={() =>
                  setIsModal((prev) => ({ ...prev, [modalKey]: false }))
                }
              />
            </SuperModal>
          )
      )}
    </div>
  );
};
