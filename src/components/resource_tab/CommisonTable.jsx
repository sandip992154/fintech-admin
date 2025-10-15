import { useState, useMemo } from "react";

export default function CommissionTable({
  data = {},
  onSubmit = () => {},
  title = "Commission",
  isLoading = false,
}) {
  // Ensure data is properly structured for commission display
  const commissionData = useMemo(() => {
    // If data is empty or not an object, return empty object
    if (!data || typeof data !== "object") {
      console.log("CommissionTable: Data is empty or not an object");
      return {};
    }

    // Check if data looks like commission data (has service keys with array values)
    const hasValidCommissionStructure = Object.values(data).some((value) =>
      Array.isArray(value)
    );

    if (hasValidCommissionStructure) {
      console.log("CommissionTable: Valid commission structure detected");
      return data;
    }

    // If data doesn't look like commission data, return empty structure
    console.log(
      "CommissionTable: Invalid commission structure, returning empty"
    );
    return {};
  }, [data]);

  const services = useMemo(() => Object.keys(commissionData), [commissionData]);
  const [selectedService, setSelectedService] = useState(
    services.length > 0 ? services[0] : ""
  );

  // Update selected service when services change
  useMemo(() => {
    if (services.length > 0 && !services.includes(selectedService)) {
      setSelectedService(services[0]);
    }
  }, [services, selectedService]);

  return (
    <div className="text-black dark:text-adminOffWhite p-6 max-w-5xl mx-auto">
      {/* Title */}
      <h2 className="text-2xl font-bold mb-6">{title}</h2>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-700 pb-3">
        {services.length > 0 ? (
          services.map((service) => (
            <button
              key={service}
              onClick={() => setSelectedService(service)}
              className={`px-4 py-2 rounded-t-md text-sm font-medium ${
                selectedService === service
                  ? "bg-[#7C5CFC] text-white"
                  : "bg-transparent text-gray-400 hover:text-secondary"
              }`}
            >
              {service}
            </button>
          ))
        ) : (
          <div className="text-gray-500 italic py-2">
            No commission data available for this scheme
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto border border-gray-700 rounded-md">
        <div className="max-h-[300px] overflow-y-auto">
          {isLoading ? (
            // Loading State
            <div className="flex justify-center items-center h-40">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-[#7C5CFC]"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#7C5CFC] animate-pulse"></div>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    Loading commission data...
                  </p>
                  <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">
                    Fetching all service types
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Table Content
            <table className="w-full text-sm table-fixed">
              <thead className="sticky top-0 z-10 bg-[#2A2D3E] text-gray-400 uppercase ">
                <tr>
                  <th className="py-2 px-4 text-left w-1/6">Provider</th>
                  <th className="py-2 px-4 text-left w-1/6">Type</th>
                  <th className="py-2 px-4 text-left w-1/6">ADMIN</th>
                  <th className="py-2 px-4 text-left w-1/6">Whitelabel</th>
                  <th className="py-2 px-4 text-left w-1/6">
                    MasterDistributor
                  </th>
                  <th className="py-2 px-4 text-left w-1/6">Distributor</th>
                  <th className="py-2 px-4 text-left w-1/6">Retailer</th>
                </tr>
              </thead>

              <tbody>
                {(commissionData[selectedService] || []).map((row, i) => (
                  <tr key={i} className="border-b border-gray-800">
                    <td className="py-2 px-4">
                      {row.operator?.name || row.provider || "N/A"}
                    </td>
                    <td className="py-2 px-4">
                      {row.commission_type || row.type || "N/A"}
                    </td>
                    <td className="py-2 px-4">{row.admin || 0}</td>
                    <td className="py-2 px-4">{row.whitelabel || 0}</td>
                    <td className="py-2 px-4">
                      {row.masterdistributor || row.md || 0}
                    </td>
                    <td className="py-2 px-4">{row.distributor || 0}</td>
                    <td className="py-2 px-4">{row.retailer || 0}</td>
                  </tr>
                ))}

                {(!commissionData[selectedService] ||
                  commissionData[selectedService].length === 0) && (
                  <tr>
                    <td
                      colSpan="7"
                      className="py-6 px-4 text-center text-gray-500 italic"
                    >
                      No entries for "{selectedService}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={() => onSubmit(selectedService)}
          className="bg-[#7C5CFC] hover:bg-[#6938EF] text-white font-medium px-6 py-2 rounded-md"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
