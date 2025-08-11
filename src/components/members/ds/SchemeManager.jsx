import { useState } from "react";
import SchemeForm from "../utility_components/scheme/SchemeForm";
import SchemeTabs from "../utility_components/scheme/SchemeTabs";
import SchemeTable from "../utility_components/scheme/SchemeTable";

const mockData = {
  "Mobile Recharge": [
    {
      provider: "BSNL TOPUP",
      type: "Percent",
      whitelabel: 4,
      md: 2.9,
      distributor: 2.7,
      retailer: 2.5,
    },
    {
      provider: "BSNL VALIDITY",
      type: "Percent",
      whitelabel: 4,
      md: 2.9,
      distributor: 2.7,
      retailer: 2.5,
    },
    {
      provider: "JIORECH",
      type: "Percent",
      whitelabel: 1.1,
      md: 1.02,
      distributor: 1.01,
      retailer: 1,
    },
    {
      provider: "VI",
      type: "Percent",
      whitelabel: 4,
      md: 2.9,
      distributor: 2.7,
      retailer: 2.5,
    },
    {
      provider: "AIRTEL",
      type: "Percent",
      whitelabel: 1.1,
      md: 1.02,
      distributor: 1.01,
      retailer: 1,
    },
  ],
  AEPS: [],
  DMT: [],
  "DTH Recharge": [],
  "Micro ATM": [],
  "Bill Payments": [],
};

const schemeOptions = [
  "TEST",
  "NK Tax Cunsaltancy",
  "Retailor-A",
  "Default",
  "TEST12",
  "demo1",
];

const SchemeManager = ({ onClose }) => {
  const [selectedTab, setSelectedTab] = useState("Mobile Recharge");
  const [scheme, setScheme] = useState(null);

  const handleFormSubmit = (data) => {
    setScheme(data.scheme);
    console.log("Selected scheme:", data.scheme);
  };

  return (
    <div className="p-6 dark:text-white  rounded-md">
      <h2 className="text-xl font-semibold mb-4">Scheme Manager</h2>
      <SchemeForm schemeOptions={schemeOptions} onSubmit={handleFormSubmit} />
      <SchemeTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <SchemeTable data={mockData[selectedTab] || []} />
      <button className="btn bg-secondary float-end my-4 " onClick={onClose}>
        Close
      </button>
    </div>
  );
};

export default SchemeManager;
