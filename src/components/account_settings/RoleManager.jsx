import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Validation schema using Yup
const schema = yup.object().shape({
  memberRole: yup.string().required("Member role is required"),
  securityPin: yup
    .string()
    .matches(/^\d{4,6}$/, "PIN must be 4 to 6 digits")
    .required("Security PIN is required"),
});

const RoleManager = ({ initialData }) => {
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
    console.log("Submitted data:", data);
    alert("Role changed successfully!");
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl"
    >
      {/* Member Role */}
      <div>
        <label className="block text-sm mb-1">Select Member Role</label>
        <input
          type="text"
          {...register("memberRole")}
          placeholder="Enter role (e.g. Admin, Member)"
          className="w-full px-3 py-2 rounded  dark:text-white border border-gray-600"
        />
        {errors.memberRole && (
          <p className="text-sm text-red-500 mt-1">
            {errors.memberRole.message}
          </p>
        )}
      </div>

      {/* Security PIN */}
      <div>
        <label className="block text-sm mb-1">Security PIN</label>
        <input
          type="password"
          maxLength="6"
          placeholder="Enter 4–6 digit PIN"
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
      <div className="md:col-span-2">
        <button
          type="submit"
          className="px-6 py-2 bg-secondary text-white rounded hover:bg-violet-600 transition"
        >
          Change
        </button>
      </div>
    </form>
  );
};

export default RoleManager;
