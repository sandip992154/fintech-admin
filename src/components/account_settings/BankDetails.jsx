import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";

// ✅ Dynamic Yup Schema Validation
const createSchema = (isSuperAdmin) =>
  yup.object().shape({
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
    securityPin: isSuperAdmin
      ? yup
          .number()
          .typeError("PIN must be a number")
          .integer("PIN must be a whole number")
          .min(1000, "PIN must be exactly 4 digits")
          .max(9999, "PIN must be exactly 4 digits")
      : yup
          .number()
          .typeError("PIN must be a number")
          .integer("PIN must be a whole number")
          .min(1000, "PIN must be exactly 4 digits")
          .max(9999, "PIN must be exactly 4 digits")
          .required("Security PIN is required"),
  });

const BankDetails = ({
  initialData,
  onSubmit,
  loading = false,
  error = null,
}) => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "SuperAdmin";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialData,
    resolver: yupResolver(createSchema(isSuperAdmin)),
  });

  // Reset form when initialData changes
  React.useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const handleFormSubmit = async (data) => {
    if (onSubmit) {
      await onSubmit(data);
    } else {
      console.log("Bank Details Submitted:", data);
      toast.success("Bank details submitted successfully!");
      reset(); // Optional: clear the form after submit
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl"
    >
      {/* Error display */}
      {error && (
        <div className="md:col-span-2 lg:col-span-3 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
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
        <label className="block text-sm mb-1">
          Security PIN{" "}
          {isSuperAdmin && <span className="text-gray-500">(Optional)</span>}
        </label>
        <input
          type="password"
          inputMode="numeric"
          maxLength="4"
          placeholder={
            isSuperAdmin ? "Enter 4 digit PIN (optional)" : "Enter 4 digit PIN"
          }
          {...register("securityPin")}
          className="w-full px-3 py-2 rounded  dark:text-white border border-gray-600"
          onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, ""))}
        />
        {errors.securityPin && (
          <p className="text-sm text-red-500 mt-1">
            {errors.securityPin.message}
          </p>
        )}
        {isSuperAdmin && (
          <p className="text-xs text-gray-500 mt-1">
            4-digit PIN only required if you have set up an MPIN
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="md:col-span-3">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-secondary text-white rounded hover:bg-violet-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Updating...
            </>
          ) : (
            "Update Bank Details"
          )}
        </button>
      </div>
    </form>
  );
};

export default BankDetails;
