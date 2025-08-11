import { useState, useEffect, useRef } from "react";
import PaginatedTable from "../../components/utility/PaginatedTable";
import FilterBar from "../../components/utility/FilterBar";
import { SuperModal } from "../../components/utility/SuperModel";
import { IoIosArrowDown } from "react-icons/io";
import RoleForm from "../../components/roles_permissions/RoleForm";
import RoleSchemeForm from "../../components/roles_permissions/RoleSchemeForm";
import { CheckBoxPermissionForm } from "../../components/roles_permissions/CheckBoxPermissionForm";

const mockData = [
  {
    id: 6,
    name: "SUPER DICISIBUTOR",
    displayName: "SUP DIST",
    lastUpdated: "07 Jul 24 - 06:42 PM",
  },
  {
    id: 5,
    name: "whitelable",
    displayName: "Whitelable",
    lastUpdated: "01 Jan 70 - 05:30 AM",
  },
  {
    id: 4,
    name: "retailer",
    displayName: "Retailer",
    lastUpdated: "29 Jul 18 - 01:07 PM",
  },
];

export const Roles = () => {
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    searchValue: "",
    userId: "",
    status: "",
    product: "",
  });

  const [filteredData, setFilteredData] = useState([...mockData]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isSchemeModal, setIsSchemeModal] = useState(false);
  const [isPermissionModal, setIsPermissionModal] = useState(false);

  const scrollableRef = useRef(null);
  const buttonRefs = useRef([]);
  const [dropdownCoords, setDropdownCoords] = useState(null);

  const handleInputChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    let filtered = [...mockData];
    if (filters.userId) {
      filtered = filtered.filter((d) =>
        String(d.id).includes(String(filters.userId))
      );
    }
    if (filters.searchValue) {
      const val = filters.searchValue.toLowerCase();
      filtered = filtered.filter((d) =>
        d.productName?.toLowerCase().includes(val)
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

  const handleDropdownOpen = (index, row) => {
    const rect = buttonRefs.current[index]?.getBoundingClientRect();
    if (rect) {
      setDropdownCoords({
        top: rect.top + rect.height,
        left: rect.left,
        row,
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".dropdown-fixed")) {
        setDropdownCoords(null);
      }
    };

    const handleParentScroll = () => {
      setDropdownCoords(null);
    };

    const container = scrollableRef.current;

    document.addEventListener("mousedown", handleClickOutside);
    container?.addEventListener("scroll", handleParentScroll, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      container?.removeEventListener("scroll", handleParentScroll, true);
    };
  }, []);

  const handlePermissionClick = () => setIsPermissionModal(true);
  const handleSchemeClick = () => setIsSchemeModal(true);
  const handleAddClick = () => {
    setEditData(null);
    setEditModal(true);
  };
  const handleEditClick = (row) => {
    setEditData(row);
    setEditModal(true);
  };
  const handleSubmitData = (data) => console.log("Form Data Submitted:", data);

  const fields = [
    {
      name: "fromDate",
      type: "date",
      placeholder: "From Date",
      value: filters.fromDate,
      onChange: (val) => handleInputChange("fromDate", val),
    },
    {
      name: "toDate",
      type: "date",
      placeholder: "To Date",
      value: filters.toDate,
      onChange: (val) => handleInputChange("toDate", val),
    },
    {
      name: "searchValue",
      type: "text",
      placeholder: "Search Value",
      value: filters.searchValue,
      onChange: (val) => handleInputChange("searchValue", val),
    },
    {
      name: "userId",
      type: "text",
      placeholder: "Agent/Parent",
      value: filters.userId,
      onChange: (val) => handleInputChange("userId", val),
    },
  ];

  const columns = [
    { header: "#", accessor: "id" },
    { header: "Name", accessor: "name" },
    { header: "Display Name", accessor: "displayName" },
    { header: "Last Updated", accessor: "lastUpdated" },
    {
      header: "Action",
      accessor: "action",
      render: (row, index) => (
        <div className="relative">
          <button
            ref={(el) => (buttonRefs.current[index] = el)}
            onClick={() => handleDropdownOpen(index, row)}
            className="flex items-center justify-center gap-2 btn-md bg-secondary px-4 py-1 text-white rounded hover:bg-secondary/80 transition"
          >
            More <IoIosArrowDown />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div
      ref={scrollableRef}
      className="h-[90vh] 2xl:max-w-[80%] p-4 mx-8 bg-secondaryOne dark:bg-darkBlue/70 rounded-2xl 2xl:mx-auto text-gray-800 overflow-hidden overflow-y-auto px-4 pb-6 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
    >
      <div className="my-4 p-4 rounded-md bg-white dark:bg-transparent">
        <div className="flex gap-3 justify-between">
          <h2 className="text-2xl font-bold dark:text-adminOffWhite">
            Role List
          </h2>
        </div>
        <FilterBar fields={fields} onSearch={applyFilters} />
      </div>

      <div className="flex justify-between mb-4">
        <div />
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

      {editModal && (
        <SuperModal onClose={() => setEditModal(false)}>
          <RoleForm onSubmitForm={handleSubmitData} />
        </SuperModal>
      )}

      {isSchemeModal && (
        <SuperModal onClose={() => setIsSchemeModal(false)}>
          <RoleSchemeForm />
        </SuperModal>
      )}

      {isPermissionModal && (
        <SuperModal onClose={() => setIsPermissionModal(false)}>
          <CheckBoxPermissionForm />
        </SuperModal>
      )}

      {dropdownCoords && (
        <div
          style={{
            position: "fixed",
            top: dropdownCoords.top,
            left: dropdownCoords.left,
            zIndex: 1000,
          }}
          className="dropdown-fixed w-40 bg-darkBlue text-white rounded-md shadow-lg"
        >
          <button
            onClick={() => {
              handlePermissionClick(dropdownCoords.row);
              setDropdownCoords(null);
            }}
            className="block w-full px-4 py-2 text-left hover:bg-secondary/80"
          >
            Permission
          </button>
          <button
            onClick={() => {
              handleSchemeClick(dropdownCoords.row);
              setDropdownCoords(null);
            }}
            className="block w-full px-4 py-2 text-left hover:bg-secondary/80"
          >
            Scheme
          </button>
        </div>
      )}
    </div>
  );
};
