import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Validation schema using yup
const schema = yup.object().shape({
  productName: yup.string().required("Product Name is required"),
  displayName: yup.string().required("Display Name is required"),
  url: yup.string().url("Invalid URL").required("URL is required"),
  username: yup.string().required("Username is required"),
  password: yup
    .string()
    .min(6, "Minimum 6 characters")
    .required("Password is required"),
  optional1: yup.string().nullable(),
  apiCode: yup.string().required("API Code is required"),
  productType: yup.string().required("Product Type is required"),
  commissionType: yup.string().required("Commission Type is required"),
  commissionCharge: yup.string().nullable(),
});

const fieldLabels = {
  productName: "Product Name",
  displayName: "Display Name",
  url: "Url",
  username: "Username",
  password: "Password",
  optional1: "Optional1",
  apiCode: "Api Code",
  productType: "Product Type",
  commissionType: "Commission Type",
  commissionCharge: "Commission/Charge",
};

const APIManagerForm = ({ initialData = {}, onSubmit }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialData, // default set initially
  });

  // 👇 reset form when initialData changes (for controlled input)
  useEffect(() => {
    reset(initialData);
  }, [initialData, reset]);

  return (
    <div className="">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-4xl mx-auto p-6 rounded-lg dark:text-white "
      >
        <h1 className="py-3 text-2xl font-bold text-center border-b-2 border-slate-400 mb-3">
          API Manager
        </h1>
        <div className="overflow-hidden overflow-y-auto max-h-[70vh] px-4 pb-6 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(fieldLabels).map(([key, label]) => (
              <div key={key} className="flex flex-col">
                <label htmlFor={key} className="mb-1 text-sm font-medium">
                  {label}
                </label>
                <input
                  {...register(key)}
                  id={key}
                  type="text"
                  className={`bg-transparent border ${
                    errors[key]
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-500 focus:ring-purple-400"
                  } rounded-md px-3 py-2 text-sm dark:text-white focus:outline-none focus:ring-1`}
                />
                {errors[key] && (
                  <p className="text-sm text-red-400 mt-1">
                    {errors[key]?.message}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <button
              type="submit"
              className="px-6 py-2 bg-secondary text-white rounded-md hover:bg-purple-600 transition"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default APIManagerForm;
