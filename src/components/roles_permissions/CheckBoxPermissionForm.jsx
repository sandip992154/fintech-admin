import React, { useMemo, useState } from "react";

const permissions = {
  Resource: ["Change Company Profile", "View Commission"],
  "Setup Tools": ["Api Manager", "Bank Account Setup", "Operator Manager"],
  Member: [
    "Manage Master Distributor",
    "Create Master Distributor",
    "Manage Distributor",
    "Create Distributor",
    "Manage Retailer",
    "Create Retailer",
    "Manage Kyc_User Submitted",
    "Manage Kyc Rejected-User",
    "Manage Kyc_User Pending",
    "Manage Kyc_User Update",
    "Manage Register-User",
  ],
  "Member Setting": [
    "Member Profile Edit",
    "Member Password Reset",
    "Member Stock Manager",
  ],
  "Member Report": [
    "Billpayment Report",
    "Money Transfer Report",
    "Main Wallet Statement",
    "Aeps Report",
    "Aeps Wallet Statement",
    "Matm Report",
    "matm Wallet Statement",
    "Member Aeps Agent List",
    "Recharge Report",
  ],
  "Wallet Fund": [
    "Fund Transfer Action",
    "Fund Return Action",
    "Wallet Load Request",
  ],
  "wallet fund report": ["wallet Payments Report"],
  "Aeps Fund": ["Aeps Settlement Request"],
  "Aeps Fund Report": [
    "Aeps Settlement Request",
    "CC/Aeps Settlment report",
    "Matm Settlement Request",
    "Matm Settlement Report",
  ],
  "Agents List": ["Aeps agent List"],
  "Portal Services": [
    "Billpayment Service",
    "Money",
    "Matm Staus",
    "Recharge Service",
    "Commission Settlement",
    "Commission Settlement Service",
    "Matm Service",
    "CC Service",
  ],
  Transactions: [
    "Recharge Statement",
    "Bill Payment statement",
    "Aeps Statement",
    "Matm Statement",
    "UTI Statement",
    "Affiliate Statement",
  ],
  "Transactions Editing": [
    "Billpay Report Editing",
    "Money Transfer Report Editing",
    "Aeps id Statement Editing",
    "Recharge Report Editing",
  ],
  "Transaction Status": ["Bill Payment status", "Matm"],
  "User Setting": ["Account Statement View", "Complaint Submission"],
};

export const CheckBoxPermissionForm = () => {
  const [checked, setChecked] = useState({});

  const getKey = (section, label) => `${section}-${label}`;

  const isAllChecked = useMemo(
    () =>
      Object.entries(permissions).every(([section, items]) =>
        items.every((label) => checked[getKey(section, label)])
      ),
    [checked]
  );

  const isSectionChecked = (section) =>
    permissions[section].every((label) => checked[getKey(section, label)]);

  const toggleCheck = (section, label) => {
    const key = getKey(section, label);
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSection = (section) => {
    const sectionChecked = isSectionChecked(section);
    const updated = { ...checked };
    permissions[section].forEach((label) => {
      updated[getKey(section, label)] = !sectionChecked;
    });
    setChecked(updated);
  };

  const toggleAll = () => {
    const updated = {};
    Object.entries(permissions).forEach(([section, items]) => {
      items.forEach((label) => {
        updated[getKey(section, label)] = !isAllChecked;
      });
    });
    setChecked(updated);
  };

  const handleSubmit = () => {
    const result = {};
    Object.entries(permissions).forEach(([section, items]) => {
      result[section.replace(/ /g, "_")] = {};
      items.forEach((label) => {
        result[section.replace(/ /g, "_")][label.replace(/ /g, "_")] =
          checked[getKey(section, label)] || false;
      });
    });
    console.log(result);
  };

  return (
    <div className="dark:text-white p-6 rounded-lg h-[80vh] text-gray-800 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
      <h2 className="text-2xl font-semibold mb-4">Member Permission</h2>

      <div className="flex gap-6 items-center mb-6">
        <span className="text-lg font-medium">Permissions</span>
        <label className="inline-flex items-center space-x-2">
          <input
            type="checkbox"
            onChange={toggleAll}
            checked={isAllChecked}
            className="form-checkbox text-blue-500"
          />
          <span>Select All</span>
        </label>
      </div>

      <div className="space-y-6">
        {Object.entries(permissions).map(([section, items]) => (
          <div key={section}>
            <div className="flex gap-6 items-start">
              <label className="inline-flex items-center space-x-2 min-w-[150px]">
                <input
                  type="checkbox"
                  checked={isSectionChecked(section)}
                  onChange={() => toggleSection(section)}
                  className="form-checkbox text-yellow-400"
                />
                <span className="font-semibold text-yellow-400">{section}</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-grow">
                {items.map((label) => {
                  const key = getKey(section, label);
                  return (
                    <label
                      key={key}
                      className="inline-flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        checked={checked[key] || false}
                        onChange={() => toggleCheck(section, label)}
                        className="form-checkbox text-blue-500"
                      />
                      <span>{label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <hr className="border-gray-700 mt-4" />
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={handleSubmit}
          className="bg-secondary hover:bg-blue-700 px-6 py-2 rounded text-white"
        >
          Submit
        </button>
      </div>
    </div>
  );
};
