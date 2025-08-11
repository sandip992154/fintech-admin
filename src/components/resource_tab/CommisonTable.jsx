import { useState, useMemo } from "react";

export default function CommissionTable({
  data = {},
  onSubmit = () => {},
  title = "Commission",
}) {
  const services = useMemo(() => Object.keys(data), [data]);
  const [selectedService, setSelectedService] = useState(
    services.length > 0 ? services[0] : ""
  );

  return (
    <div className="text-black dark:text-adminOffWhite p-6 max-w-5xl mx-auto">
      {/* Title */}
      <h2 className="text-2xl font-bold mb-6">{title}</h2>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-700 pb-3">
        {services.map((service) => (
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
        ))}
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto border border-gray-700 rounded-md">
        <div className="max-h-[300px] overflow-y-auto">
          <table className="w-full text-sm table-fixed">
            <thead className="sticky top-0 z-10 bg-[#2A2D3E] text-gray-400 uppercase ">
              <tr>
                <th className="py-2 px-4 text-left w-1/6">Provider</th>
                <th className="py-2 px-4 text-left w-1/6">Type</th>
                <th className="py-2 px-4 text-left w-1/6">Whitelabel</th>
                <th className="py-2 px-4 text-left w-1/6">MD</th>
                <th className="py-2 px-4 text-left w-1/6">Distributor</th>
                <th className="py-2 px-4 text-left w-1/6">Retailer</th>
              </tr>
            </thead>

            <tbody>
              {(data[selectedService] || []).map((row, i) => (
                <tr key={i} className="border-b border-gray-800">
                  <td className="py-2 px-4">{row.provider}</td>
                  <td className="py-2 px-4">{row.type}</td>
                  <td className="py-2 px-4">{row.whitelable}</td>
                  <td className="py-2 px-4">{row.md}</td>
                  <td className="py-2 px-4">{row.distributor}</td>
                  <td className="py-2 px-4">{row.retailer}</td>
                </tr>
              ))}

              {(!data[selectedService] ||
                data[selectedService].length === 0) && (
                <tr>
                  <td
                    colSpan="6"
                    className="py-6 px-4 text-center text-gray-500 italic"
                  >
                    No entries for "{selectedService}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
