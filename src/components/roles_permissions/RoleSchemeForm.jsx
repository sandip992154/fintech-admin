import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

// Options array
const schemeOptions = [
  { label: "Select Scheme", value: "" },
  { label: "TEST", value: "TEST" },
  { label: "NK Tax Cunsaltancy", value: "NK Tax Cunsaltancy" },
  { label: "Retailor-A", value: "Retailor-A" },
  { label: "Default", value: "Default" },
  { label: "TEST12", value: "TEST12" },
  { label: "demo1", value: "demo1" },
];

// Yup validation schema
const schema = Yup.object().shape({
  scheme: Yup.string().required("Scheme is required"),
});

const RoleSchemeForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log("Form Data:", data);
  };

  return (
    <div className=" ">
      <h1 className="text-2xl font-bold">Scheme Manager</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="  p-8 rounded-lg w-[350px]"
      >
        <label
          htmlFor="scheme"
          className="block text-sm dark:text-gray-300 mb-2"
        >
          Scheme
        </label>
        <select
          id="scheme"
          {...register("scheme")}
          className={`w-full bg-transparent dark:text-gray-200 border rounded px-3 py-2 outline-none ${
            errors.scheme ? "border-red-500" : "border-gray-500"
          }`}
        >
          {schemeOptions.map((option, index) => (
            <option
              key={index}
              value={option.value}
              className="dark:bg-darkBlue"
            >
              {option.label}
            </option>
          ))}
        </select>

        {errors.scheme && (
          <p className="text-red-400 text-sm mt-1">{errors.scheme.message}</p>
        )}

        <button
          type="submit"
          className="mt-6 bg-[#7C6FF9] text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#6C5DD3] transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default RoleSchemeForm;
