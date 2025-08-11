import { useState } from "react";
import PaginatedTable from "../../components/utility/PaginatedTable";
import FilterBar from "../../components/utility/FilterBar";
import { SuperModal } from "../../components/utility/SuperModel";

import OperatorForm from "./OperatorForm";

const data = [
  {
    id: 23027,
    name: "RUPAY Card Business",
    type: "ccpayment",
    status: true,
    operatorApi: "lyda_payout",
  },
  {
    id: 23026,
    name: "AMEX Card Business",
    type: "ccpayment",
    status: true,
    operatorApi: "lyda_payout",
  },
  {
    id: 23025,
    name: "Mastercard Card Business",
    type: "ccpayment",
    status: true,
    operatorApi: "lyda_payout",
  },
  {
    id: 23024,
    name: "VISA Card Business",
    type: "ccpayment",
    status: true,
    operatorApi: "lyda_payout",
  },
  {
    id: 23023,
    name: "CC Payout 25001-50000",
    type: "ccpayout",
    status: true,
    operatorApi: "lyda_payout",
  },
  {
    id: 23022,
    name: "CC Payout 1001-25000",
    type: "ccpayout",
    status: true,
    operatorApi: "lyda_payout",
  },
  {
    id: 23021,
    name: "CC Payout 1-1000",
    type: "ccpayout",
    status: true,
    operatorApi: "lyda_recharge",
  },
];

export const OperatorManager = () => {
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
    {
      name: "Product",
      type: "select",
      placeholder: "Select Product",
      value: filters.status || "",
      onChange: (val) => handleInputChange("product", val),
      options: [
        { label: "Select Status", value: "" },
        { label: "Active", value: "active" },
        { label: "De-active", value: "de-active" },
        { label: "Broadband", value: "broadband" },
        { label: "Cable", value: "cable" },
        { label: "Dmt", value: "dmt" },
        { label: "Dth", value: "dth" },
        { label: "Electricity", value: "electricity" },
        { label: "Fast Tag", value: "fast_tag" },
        { label: "Fund", value: "fund" },
        { label: "Housing", value: "housing" },
        { label: "Insurance", value: "insurance" },
        { label: "Landline", value: "landline" },
        { label: "Life Insurance", value: "life_insurance" },
        { label: "Loan Repay", value: "loan_repay" },
        { label: "Lpg Gas", value: "lpg_gas" },
        { label: "Municipal", value: "municipal" },
        { label: "Mobile", value: "mobile" },
        { label: "Pancard", value: "pancard" },
        { label: "Piped Gas", value: "piped_gas" },
        { label: "Postpaid", value: "postpaid" },
        { label: "School Fees", value: "school_fees" },
      ],
    },
  ];

  const handleOperatorApiChange = (index, value) => {
    const updatedData = [...data];
    updatedData[index].operatorApi = value;
    setFilteredData(updatedData);
  };

  const columns = [
    { header: "#", accessor: "id" },
    { header: "NAME", accessor: "name" },
    { header: "TYPE", accessor: "type" },
    {
      header: "STATUS",
      accessor: "status",
      render: (row, idx) => (
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={row.status}
            onChange={() => handleToggle(idx)}
            className="sr-only peer"
          />
          <div
            className="w-11 h-5 border-2 border-slate-500 rounded-full transition-all duration-300 
          peer-checked:bg-secondary relative
          after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
          after:bg-slate-400 after:rounded-full after:h-3 after:w-3 
          after:transition-all peer-checked:after:translate-x-[20px] peer-checked:after:bg-white"
          ></div>
        </label>
      ),
    },
    {
      header: "OPERATOR API",
      accessor: "operatorApi",
      render: (row, idx) => (
        <select
          value={row.operatorApi}
          onChange={(e) => handleOperatorApiChange(idx, e.target.value)}
          className=" dark:text-white px-2 py-1 rounded border border-slate-600"
        >
          <option className="dark:bg-darkBlue" value="">
            Select API
          </option>
          <option className="dark:bg-darkBlue" value="lyda_recharge">
            lyda Recharge
          </option>
          <option className="dark:bg-darkBlue" value="lyda_payout">
            lyda Payout
          </option>
          <option className="dark:bg-darkBlue" value="lyda_affiliate">
            lyda Affiliate
          </option>
          <option className="dark:bg-darkBlue" value="lyda_billpay">
            lyda BillPay
          </option>
          <option className="dark:bg-darkBlue" value="lyda_aeps_sdk">
            lyda AEPS SDK
          </option>
          <option className="dark:bg-darkBlue" value="lyda_aeps">
            lyda AEPS
          </option>
          <option className="dark:bg-darkBlue" value="lyda_pan_card">
            lyda PAN Card
          </option>
          <option className="dark:bg-darkBlue" value="lyda_matm_sdk">
            lyda MATM SDK
          </option>
          <option className="dark:bg-darkBlue" value="lyda_verification">
            lyda Verification
          </option>
          <option className="dark:bg-darkBlue" value="load_wallet">
            Load Wallet
          </option>
          <option className="dark:bg-darkBlue" value="air_pay_pg">
            Air Pay Pg
          </option>
          <option className="dark:bg-darkBlue" value="cc_payments">
            CC-Payments
          </option>
        </select>
      ),
    },
    {
      header: "ACTION",
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
            Opearator List
          </h2>
        </div>
        <FilterBar fields={fields} onSearch={applyFilters} />
      </div>
      <div className="flex justify-between mb-2 ">
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
          <OperatorForm
            initialData={editData}
            onClose={() => setEditModal(false)}
          />
        </SuperModal>
      )}
    </div>
  );
};
