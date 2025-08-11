import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Yup Validation Schema
const schema = yup.object().shape({
  cmo: yup.string().required("CMO Name is required"),
  coo: yup.string().required("COO Name is required"),
});

const CertificateManager = ({ initialData }) => {
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
    alert("Certificate info submitted successfully!");
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl"
    >
      {/* CMO */}
      <div>
        <label className="block text-sm mb-1">
          CMO (Chief Marketing Officer)
        </label>
        <input
          type="text"
          placeholder="Enter CMO Name"
          {...register("cmo")}
          className="w-full px-3 py-2 rounded  dark:text-white border border-gray-600"
        />
        <p className="text-sm text-red-500 mt-1">{errors.cmo?.message}</p>
        <h6 className="text-blue-400 mt-1">Certificate</h6>
      </div>

      {/* COO */}
      <div>
        <label className="block text-sm mb-1">
          COO (Chief Operating Officer)
        </label>
        <input
          type="text"
          placeholder="Enter COO Name"
          {...register("coo")}
          className="w-full px-3 py-2 rounded  dark:text-white border border-gray-600"
        />
        <p className="text-sm text-red-500 mt-1">{errors.coo?.message}</p>
        <h6 className="text-blue-400 mt-1">ID Card</h6>
      </div>

      {/* Submit Button */}
      <div className="md:col-span-2">
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

export default CertificateManager;
