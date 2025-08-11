import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Validation schema
const schema = yup.object().shape({
  parentMember: yup.string().required("Parent Member is required"),
  securityPin: yup
    .string()
    .matches(/^\d{4,6}$/, "PIN must be 4 to 6 digits")
    .required("Security PIN is required"),
});

const MappingManager = ({ initialData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: initialData,
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log("Submitted Data:", data);
    alert("Mapping updated successfully!");
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl"
    >
      {/* Parent Member */}
      <div>
        <label className="block text-sm mb-1">Parent Member</label>
        <input
          type="text"
          placeholder="Test(1234567899)(Master Distribu)"
          {...register("parentMember")}
          className="w-full px-3 py-2 rounded  dark:text-white border border-gray-600"
        />
        {errors.parentMember && (
          <p className="text-sm text-red-500 mt-1">
            {errors.parentMember.message}
          </p>
        )}
      </div>

      {/* Security PIN */}
      <div>
        <label className="block text-sm mb-1">Security PIN</label>
        <input
          type="password"
          inputMode="numeric"
          maxLength="6"
          placeholder="Enter 4–6 digit PIN"
          {...register("securityPin")}
          onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, ""))}
          className="w-full px-3 py-2 rounded  dark:text-white border border-gray-600"
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

export default MappingManager;
