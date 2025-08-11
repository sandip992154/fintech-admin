const tabs = [
  "Mobile Recharge",
  "AEPS",
  "DMT",
  "DTH Recharge",
  "Micro ATM",
  "Bill Payments",
];

const SchemeTabs = ({ selectedTab, setSelectedTab }) => {
  return (
    <div className="flex gap-4 mt-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setSelectedTab(tab)}
          className={`px-4 py-1 rounded-t-md font-medium cursor-pointer text-sm ${
            selectedTab === tab
              ? "bg-secondary text-white"
              : "text-gray-700 dark:text-gray-300 hover:text-secondary "
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default SchemeTabs;
