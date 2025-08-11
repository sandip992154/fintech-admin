import { useState } from "react";
import PaginatedTable from "../../components/utility/PaginatedTable";
import FilterBar from "../../components/utility/FilterBar";
import { SuperModal } from "../../components/utility/SuperModel";
import AddQuickLinkForm from "../../components/setup_tools/AddQuickLinkForm";
const data = [
  {
    id: 1,
    name: "Google",
    link: "https://www.google.com",
    image:
      "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png",
  },
  {
    id: 2,
    name: "YouTube",
    link: "https://www.youtube.com",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg",
  },
  {
    id: 3,
    name: "GitHub",
    link: "https://github.com",
    image:
      "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
  },
  {
    id: 4,
    name: "Facebook",
    link: "https://www.facebook.com",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png",
  },
  {
    id: 5,
    name: "Twitter",
    link: "https://www.twitter.com",
    image: "https://abs.twimg.com/icons/apple-touch-icon-192x192.png",
  },
];

export const QuickLinks = () => {
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
    //   filtered = filtered.filter((d) => d.name.toLowerCase().includes(val));
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

  //   Edit Quick Links
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState({});

  // Call this when clicking "Edit"
  const handleEditClick = (row) => {
    setEditData(row);
    setEditModal(true);
  };
  // Call this when Clickinh Add New
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
  ];

  const columns = [
    { header: "#", accessor: "id" },
    { header: "Name", accessor: "name" },
    { header: "Links", accessor: "link" },
    {
      header: "Image/Logo",
      accessor: "image",
      render: (row) => (
        <img
          src={row.image}
          alt={row.name}
          className="w-10 h-10 rounded object-contain"
        />
      ),
    },
    {
      header: "Action",
      accessor: "action",
      render: (row, idx) => (
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
            Quick Links
          </h2>
        </div>
        <FilterBar fields={fields} onSearch={applyFilters} />
      </div>
      <div className="flex justify-between my-2">
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

      {editModal && (
        <SuperModal onClose={() => setEditModal(false)}>
          <AddQuickLinkForm
            initialData={editData}
            onSubmit={handleFormSubmit}
          />
        </SuperModal>
      )}
    </div>
  );
};
