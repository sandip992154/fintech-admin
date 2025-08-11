import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// ✅ Yup Schema Validation
const schema = yup.object().shape({
  accountNumber: yup
    .string()
    .matches(/^\d{9,18}$/, "Account Number must be 9 to 18 digits")
    .required("Account Number is required"),
  bankName: yup.string().required("Bank Name is required"),
  ifscCode: yup
    .string()
    .matches(
      /^[A-Z]{4}0[A-Z0-9]{6}$/,
      "Invalid IFSC Code format (e.g. SBIN0001234)"
    )
    .required("IFSC Code is required"),
  securityPin: yup
    .string()
    .matches(/^\d{4,6}$/, "PIN must be 4 to 6 digits")
    .required("Security PIN is required"),
});

const BankDetails = ({ initialData }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialData,
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log("Bank Details Submitted:", data);
    alert("Bank details submitted successfully!");
    reset(); // Optional: clear the form after submit
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl"
    >
      {/* Account Number */}
      <div>
        <label className="block text-sm mb-1">Account Number</label>
        <input
          type="text"
          inputMode="numeric"
          maxLength="18"
          placeholder="Enter your account number"
          {...register("accountNumber")}
          className="w-full px-3 py-2 rounded  dark:text-white border border-gray-600"
        />
        {errors.accountNumber && (
          <p className="text-sm text-red-500 mt-1">
            {errors.accountNumber.message}
          </p>
        )}
      </div>

      {/* Bank Name */}
      <div>
        <label className="block text-sm mb-1">Bank Name</label>
        <input
          type="text"
          placeholder="Enter your bank name"
          {...register("bankName")}
          className="w-full px-3 py-2 rounded  dark:text-white border border-gray-600"
        />
        {errors.bankName && (
          <p className="text-sm text-red-500 mt-1">{errors.bankName.message}</p>
        )}
      </div>

      {/* IFSC Code */}
      <div>
        <label className="block text-sm mb-1">IFSC Code</label>
        <input
          type="text"
          maxLength="11"
          placeholder="e.g. SBIN0001234"
          className="w-full px-3 py-2 uppercase rounded  dark:text-white border border-gray-600"
          {...register("ifscCode")}
        />
        {errors.ifscCode && (
          <p className="text-sm text-red-500 mt-1">{errors.ifscCode.message}</p>
        )}
      </div>

      {/* Security PIN */}
      <div>
        <label className="block text-sm mb-1">Security PIN</label>
        <input
          type="password"
          inputMode="numeric"
          maxLength="6"
          placeholder="Enter 4 to 6 digit PIN"
          {...register("securityPin")}
          className="w-full px-3 py-2 rounded  dark:text-white border border-gray-600"
          onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, ""))}
        />
        {errors.securityPin && (
          <p className="text-sm text-red-500 mt-1">
            {errors.securityPin.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="md:col-span-3">
        <button
          type="submit"
          className="px-6 py-2 bg-secondary text-white rounded hover:bg-violet-600 transition"
        >
          Update
        </button>
      </div>
    </form>
  );
};

export default BankDetails;
