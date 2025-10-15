import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Yup validation schema
const schema = yup.object().shape({
  currentPassword: yup
    .string()
    .min(1, "Current password is required")
    .required("Current password is required"),
  newPassword: yup
    .string()
    .min(6, "New password must be at least 6 characters")
    .required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm password is required"),
  securityPin: yup
    .number()
    .typeError("PIN must be a number")
    .integer("PIN must be a whole number")
    .min(1000, "PIN must be exactly 4 digits")
    .max(9999, "PIN must be exactly 4 digits")
    .required("Security PIN is required"),
});

const PasswordManager = ({
  initialData,
  onSubmit,
  loading = false,
  error = null,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialData,
    resolver: yupResolver(schema),
  });

  // Reset form when initialData changes
  React.useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const handleFormSubmit = async (data) => {
    // Transform field names from camelCase to snake_case for backend
    const transformedData = {
      current_password: data.currentPassword,
      new_password: data.newPassword,
      confirm_password: data.confirmPassword,
      security_pin: data.securityPin.toString(), // Backend expects string for PIN
    };

    if (onSubmit) {
      await onSubmit(transformedData);
    } else {
      console.log("Submitted Data:", transformedData);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl"
    >
      {/* Error display */}
      {error && (
        <div className="md:col-span-3 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Current Password */}
      <div>
        <label className="block text-sm mb-1">Current Password</label>
        <input
          type="password"
          placeholder="Enter current password"
          {...register("currentPassword")}
          className="w-full px-3 py-2 rounded  dark:text-white border border-gray-600"
        />
        <p className="text-red-500 text-xs mt-1">
          {errors.currentPassword?.message}
        </p>
      </div>

      {/* New Password */}
      <div>
        <label className="block text-sm mb-1 ">New Password</label>
        <input
          type="password"
          {...register("newPassword")}
          className="w-full px-3 py-2 rounded  dark:text-white border border-gray-600"
        />
        <p className="text-red-500 text-xs mt-1">
          {errors.newPassword?.message}
        </p>
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm mb-1">Confirm Password</label>
        <input
          type="password"
          {...register("confirmPassword")}
          className="w-full px-3 py-2 rounded  dark:text-white border border-gray-600"
        />
        <p className="text-red-500 text-xs mt-1">
          {errors.confirmPassword?.message}
        </p>
      </div>

      {/* Security PIN */}
      <div>
        <label className="block text-sm mb-1">Security PIN</label>
        <input
          type="password"
          inputMode="numeric"
          maxLength="4"
          placeholder="Enter 4 digit PIN"
          {...register("securityPin")}
          className="w-full px-3 py-2 rounded  dark:text-white border border-gray-600"
          onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, ""))}
        />
        <p className="text-red-500 text-xs mt-1">
          {errors.securityPin?.message}
        </p>
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
            "Update Password"
          )}
        </button>
      </div>
    </form>
  );
};

export default PasswordManager;
