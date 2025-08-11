import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const stockTypes = [{ label: "Retailer Id", name: "retailer" }];

// Reusable validation schema per row
const getSchema = (fieldName) =>
  yup.object().shape({
    [fieldName]: yup
      .string()
      .required("This field is required")
      .matches(/^[0-9a-zA-Z]+$/, "Only alphanumeric values allowed"),
  });

const StockTableForm = ({ onClose, onSubmitRow }) => {
  return (
    <>
      <h1 className="text-2xl font-bold my-2 ">ID's Stock</h1>
      <div className="space-y-6 dark:text-white">
        {stockTypes.map(({ label, name }) => (
          <StockRowForm
            key={name}
            label={label}
            name={name}
            onSubmitRow={onSubmitRow}
          />
        ))}
        <div className="text-right pt-4">
          <button className="bg-slate-400 btn-md rounded-md" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </>
  );
};

const StockRowForm = ({ label, name, onSubmitRow }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(getSchema(name)),
    defaultValues: { [name]: "" },
  });

  const onSubmit = (data) => {
    onSubmitRow(name, data[name]);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border border-gray-600 dark:text-white rounded-md overflow-hidden"
    >
      <table className="w-full text-sm text-left border-collapse">
        <thead className="uppercase  text-gray-400 text-xs border-b border-gray-700">
          <tr>
            <th className="p-2">Stock Type</th>
            <th className="p-2">Value</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-white">
            <td className="p-2">{label}</td>
            <td className="p-2">
              <input
                {...register(name)}
                placeholder="En"
                className="px-3 py-1 bg-transparent border border-gray-600 rounded-md w-full text-white"
              />
              {errors[name] && (
                <p className="text-red-400 text-xs mt-1">
                  {errors[name]?.message}
                </p>
              )}
            </td>
            <td className="p-2">
              <button
                type="submit"
                className="bg-secondary btn dark:text-white"
              >
                Submit
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  );
};

export default StockTableForm;
