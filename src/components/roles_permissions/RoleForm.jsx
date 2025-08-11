import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Yup schema for validation
const schema = yup.object().shape({
  roleName: yup.string().required("Role Name is required"),
  displayName: yup.string().required("Display Name is required"),
});

const RoleForm = ({ onSubmitForm }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    onSubmitForm(data);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 p-4 w-full dark:text-white"
    >
      <h1 className="text-2xl font-bold">Add Role</h1>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Role Name */}
        <div className="flex flex-col w-full">
          <label htmlFor="roleName" className="mb-1 text-sm font-medium">
            Role Name
          </label>
          <input
            id="roleName"
            placeholder="Enter Role Name"
            {...register("roleName")}
            className={`px-3 py-2 rounded border bg-transparent dark:text-white ${
              errors.roleName ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-secondary`}
          />
          {errors.roleName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.roleName.message}
            </p>
          )}
        </div>

        {/* Display Name */}
        <div className="flex flex-col w-full">
          <label htmlFor="displayName" className="mb-1 text-sm font-medium">
            Display Name
          </label>
          <input
            id="displayName"
            placeholder="Enter Display Name"
            {...register("displayName")}
            className={`px-3 py-2 rounded border bg-transparent dark:text-white ${
              errors.displayName ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-secondary`}
          />
          {errors.displayName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.displayName.message}
            </p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-4">
        <button
          type="submit"
          className="bg-secondary px-6 py-2 rounded-md dark:text-white font-semibold hover:bg-secondary/80 transition"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default RoleForm;
