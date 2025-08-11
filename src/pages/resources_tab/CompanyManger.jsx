import { useEffect, useState } from "react";
import { companyManagerData } from "../../assets/assets";
import { SuperModal } from "../../components/utility/SuperModel";
import FilterField from "../../components/utility/FilterField";
import FilterBar from "../../components/utility/FilterBar";
import { ToggleButton } from "../../components/utility/ToggleButton";
import PaginatedTable from "../../components/utility/PaginatedTable";
import CompanyForm from "../../components/resource_tab/CompanyForm";

export const CompanyManger = () => {
  // All modals open CLose State
  const [isModal, setIsModal] = useState({
    AddNew: false,
  });

  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    searchValue: "",
    userId: "",
    status: "",
  });

  //modales state
  const [company, setCompany] = useState({
    name: "",
    website: "",
    senderid: "",
    smsuser: "",
    smspwd: "",
  });
  const [editingCompany, setEditingCompany] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);

  const pageSize = 10;
  const maxVisiblePages = 5;

  // ✅ Generic input handler
  const handleInputChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  //Modal input handler
  const handlemodalInputChange = (name, value) => {
    setCompany((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    applyFilters();
  }, [filters]);

  // filters function
  const applyFilters = () => {
    let data = [...companyManagerData];

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

  // handle toggle
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
        { label: "active", value: "active" },
        { label: "inactive", value: "inactive" },
      ],
    },
  ];

  // utility for modal handlings

  const openAddModal = () => {
    setEditingCompany(null);
    setCompany("");
    setIsModal((prev) => ({ ...prev, AddNew: true }));
  };

  const openEditModal = (entry) => {
    setEditingCompany(entry);
    setCompany(entry);
    setIsModal((prev) => ({ ...prev, AddNew: true }));
  };

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
      header: "Domain",
      accessor: "website",
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
        <button className="btn-secondary" onClick={() => openEditModal(row)}>
          Edit
        </button>
      ),
    },
  ];

  return (
    <div className="h-[90vh] 2xl:max-w-[80%] p-4 mx-8 bg-secondaryOne dark:bg-darkBlue/70 rounded-2xl 2xl:mx-auto text-gray-800 overflow-hidden overflow-y-auto px-4 pb-6 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
      <div className="my-4 p-4 rounded-md bg-white dark:bg-transparent">
        <h2 className="text-2xl font-bold dark:text-adminOffWhite">
          Company Manager
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
            setEditingCompany(null);
            setCompany("");
          }}
        >
          <CompanyForm
            editingCompany={editingCompany}
            setEditingCompany={setEditingCompany}
            setIsModal={setIsModal}
            setCompany={setCompany}
          />
        </SuperModal>
      )}
    </div>
  );
};
