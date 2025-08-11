import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Validation schema
const schema = yup.object().shape({
  fundAction: yup.string().required("Fund Action is required"),
  amount: yup
    .number()
    .typeError("Amount must be a number")
    .positive("Amount must be positive")
    .required("Amount is required"),
  remark: yup.string().required("Remark is required"),
});

const FundActionForm = ({ onClose, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fundAction: "",
      amount: "",
      remark: "",
    },
  });

  const handleFormSubmit = (data) => {
    onSubmit(data); // custom action
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <div>
        <label className="text-2xl  font-medium dark:text-white">
          Fund Action
        </label>
        <select
          {...register("fundAction")}
          className="w-full mt-1 px-4 py-2 rounded-md bg-transparent border border-gray-600 dark:text-white placeholder:text-gray-400"
        >
          <option value="" className="dark:bg-darkBlue">
            Select Action
          </option>
          <option value="Transfer" className="dark:bg-darkBlue">
            Transfer
          </option>
          <option value="Return" className="dark:bg-darkBlue">
            Return
          </option>
        </select>
        {errors.fundAction && (
          <p className="text-red-500 text-sm mt-1">
            {errors.fundAction.message}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium dark:text-white">Amount</label>
        <input
          type="text"
          {...register("amount")}
          placeholder="Enter Amount"
          className="w-full mt-1 px-4 py-2 rounded-md bg-transparent border border-gray-600 dark:text-white placeholder:text-gray-400"
        />
        {errors.amount && (
          <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium dark:text-white">Remark</label>
        <textarea
          {...register("remark")}
          placeholder="Enter Remark"
          rows={3}
          className="w-full mt-1 px-4 py-2 rounded-md bg-transparent border border-gray-600 dark:text-white placeholder:text-gray-400"
        />
        {errors.remark && (
          <p className="text-red-500 text-sm mt-1">{errors.remark.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="bg-slate-400 text-white px-4 py-2 rounded-md"
        >
          Close
        </button>
        <button
          type="submit"
          className="bg-secondary text-white px-4 py-2 rounded-md"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default FundActionForm;
