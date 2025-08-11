import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Validation schema
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  recharge1: yup.string().required("Recharge1 is required"),
  operatorType: yup.string().required("Operator Type is required"),
  api: yup.string().required("API is required"),
});

// Dropdown options
const operatorTypes = [
  "Mobile",
  "DTH",
  "Electricity Bill",
  "Pancard",
  "Dmt",
  "Aeps",
  "Fund",
];

const apiOptions = [
  "lyda_recharge",
  "lyda_payout",
  "lyda_affiliate",
  "lyda_billpay",
  "lyda_aeps_sdk",
  "lyda_aeps",
  "lyda_pan_card",
  "lyda_matm_sdk",
  "lyda_verification",
  "load_wallet",
  "air_pay_pg",
  "cc_payments",
];

const OperatorForm = ({ initialData = {}, onClose = () => {} }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialData,
    resolver: yupResolver(schema),
  });
  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data) => {
    console.log("Submitted Data:", data);
    handleClose();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className=" p-6 rounded-md dark:text-white space-y-4"
    >
      <h1 className="text-2xl font-bold">Add Operator</h1>
      <div className="grid grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label className="block mb-1">Name</label>
          <input
            {...register("name")}
            placeholder="Enter value"
            className="w-full bg-transparent border border-slate-600 rounded px-3 py-2 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-secondary"
          />
          {errors.name && (
            <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Recharge1 */}
        <div>
          <label className="block mb-1">Recharge1</label>
          <input
            {...register("recharge1")}
            placeholder="Enter value"
            className="w-full bg-transparent border border-slate-600 rounded px-3 py-2 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-secondary"
          />
          {errors.recharge1 && (
            <p className="text-red-400 text-sm mt-1">
              {errors.recharge1.message}
            </p>
          )}
        </div>

        {/* Operator Type */}
        <div>
          <label className="block mb-1">Operator Type</label>
          <select
            {...register("operatorType")}
            className="w-full bg-transparent border border-slate-600 rounded px-3 py-2 dark:text-white"
          >
            <option className="dark:bg-darkBlue" value="">
              Select Operator Type
            </option>
            {operatorTypes.map((type) => (
              <option
                className="dark:bg-darkBlue"
                key={type}
                value={type.toLowerCase().replace(/ /g, "_")}
              >
                {type}
              </option>
            ))}
          </select>
          {errors.operatorType && (
            <p className="text-red-400 text-sm mt-1">
              {errors.operatorType.message}
            </p>
          )}
        </div>

        {/* API */}
        <div>
          <label className="block mb-1">Api</label>
          <select
            {...register("api")}
            className="w-full bg-transparent border border-slate-600 rounded px-3 py-2 dark:text-white"
          >
            <option className="dark:bg-darkBlue" value="">
              Select Api
            </option>
            {apiOptions.map((api) => (
              <option className="dark:bg-darkBlue" key={api} value={api}>
                {api.replace(/_/g, " ")}
              </option>
            ))}
          </select>
          {errors.api && (
            <p className="text-red-400 text-sm mt-1">{errors.api.message}</p>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-4 pt-2">
        <button
          type="button"
          onClick={handleClose}
          className="bg-gray-400 text-black px-4 py-2 rounded hover:bg-gray-500 transition"
        >
          Close
        </button>
        <button
          type="submit"
          className="bg-secondary px-4 py-2 rounded text-white hover:bg-secondary/80 transition"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default OperatorForm;
