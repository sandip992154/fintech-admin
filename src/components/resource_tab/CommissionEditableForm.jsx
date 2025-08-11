import { useEffect, useState } from "react";
import ExcelToJsonWithExcelJS from "../../components/utility/ExcelToJsonWithExcelJS";

export const CommissionEditableForm = ({
  serviceKey,
  commission = [],
  onClose,
  setSelectedCommission,
}) => {
  const [editableCommission, setEditableCommission] = useState([]);

  // Sync incoming commission prop to local state
  useEffect(() => {
    setEditableCommission(commission);
  }, [commission]);

  // Handle input/select changes
  const handleChange = (index, field, value) => {
    setEditableCommission((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  // Submit handler
  const handleSubmit = () => {
    setSelectedCommission(editableCommission); // update parent
    onClose(); // close modal
  };

  const provider = editableCommission.map((item) => item.provider);

  return (
    <>
      <ExcelToJsonWithExcelJS
        requiredColumns={[
          "provider",
          "type",
          "whitelable",
          "md",
          "distributor",
          "retailer",
        ]}
        provider={provider}
        setSelectedCommission={setEditableCommission} // now updates this component
      />

      <form className="space-y-4 max-w-full">
        <div className="max-h-[60vh] overflow-y-auto ring-1 ring-gray-700 rounded-md">
          <table className="w-full text-sm table-auto border border-gray-700 border-collapse">
            <thead className="text-gray-400 uppercase bg-darkBlue sticky -top-1 z-10">
              <tr>
                <th className="py-3 px-4 text-left border border-gray-700">
                  Operator
                </th>
                <th className="py-3 px-4 text-left border border-gray-700">
                  Type
                </th>
                <th className="py-3 px-4 text-left border border-gray-700">
                  Whitelabel
                </th>
                <th className="py-3 px-4 text-left border border-gray-700">
                  MD
                </th>
                <th className="py-3 px-4 text-left border border-gray-700">
                  Distributor
                </th>
                <th className="py-3 px-4 text-left border border-gray-700">
                  Retailer
                </th>
              </tr>
            </thead>
            <tbody>
              {editableCommission.map((row, i) => (
                <tr key={i} className="dark:text-white">
                  <td className="py-2 px-4 border border-gray-700">
                    {row.provider}
                  </td>
                  <td className="py-2 px-4 border border-gray-700">
                    <select
                      value={row.type || ""}
                      onChange={(e) => handleChange(i, "type", e.target.value)}
                      className="w-full dark:bg-darkBlue dark:text-white ring-1 ring-gray-600 rounded-md px-3 py-2 focus:outline-none"
                    >
                      <option value="">Select Type</option>
                      <option value="Percent">Percent (%)</option>
                      <option value="Flat">Flat (Rs)</option>
                    </select>
                  </td>
                  <td className="py-2 px-4 border border-gray-700">
                    <input
                      type="text"
                      value={row.whitelable || ""}
                      onChange={(e) =>
                        handleChange(i, "whitelable", e.target.value)
                      }
                      className="w-full dark:bg-darkBlue dark:text-white ring-1 ring-gray-600 rounded-md px-3 py-2 focus:outline-none"
                    />
                  </td>
                  <td className="py-2 px-4 border border-gray-700">
                    <input
                      type="text"
                      value={row.md || ""}
                      onChange={(e) => handleChange(i, "md", e.target.value)}
                      className="w-full dark:bg-darkBlue dark:text-white ring-1 ring-gray-600 rounded-md px-3 py-2 focus:outline-none"
                    />
                  </td>
                  <td className="py-2 px-4 border border-gray-700">
                    <input
                      type="text"
                      value={row.distributor || ""}
                      onChange={(e) =>
                        handleChange(i, "distributor", e.target.value)
                      }
                      className="w-full dark:bg-darkBlue dark:text-white ring-1 ring-gray-600 rounded-md px-3 py-2 focus:outline-none"
                    />
                  </td>
                  <td className="py-2 px-4 border border-gray-700">
                    <input
                      type="text"
                      value={row.retailer || ""}
                      onChange={(e) =>
                        handleChange(i, "retailer", e.target.value)
                      }
                      className="w-full dark:bg-darkBlue dark:text-white ring-1 ring-gray-600 rounded-md px-3 py-2 focus:outline-none"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-right">
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-[#7C5CFC] hover:bg-[#6938EF] dark:text-white px-6 py-2 rounded-md font-medium"
          >
            Submit
          </button>
        </div>
      </form>
    </>
  );
};
