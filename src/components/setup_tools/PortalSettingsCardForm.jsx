import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

export const PortalSettingsCardForm = ({ title, label, placeholder }) => {
  const validationSchema = Yup.object().shape({
    input: Yup.string().required(`${label} is required`),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (data) => {
    alert(`${title}: ${data.input}`);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-between bg-white dark:text-white p-5 rounded-xl shadow-md w-full h-full dark:bg-darkBlue/80"
    >
      <div className="flex flex-col gap-2 flex-grow">
        <h2 className="text-lg font-semibold">{title}</h2>

        <label className="text-sm dark:text-gray-300">{label}</label>
        <input
          type="text"
          placeholder={placeholder}
          {...register("input")}
          className="w-full p-2 rounded-md border border-[#2A2D4A] dark:bg-transparent dark:text-white outline-none"
        />
        {touchedFields.input && errors.input && (
          <div className="text-red-400 text-sm">{errors.input.message}</div>
        )}
      </div>

      {/* Button container pushed to bottom */}
      <div className="mt-auto pt-4">
        <button
          type="submit"
          className="w-full bg-secondary hover:bg-slate-400 dark:text-white py-2 px-4 rounded-md"
        >
          Update Info
        </button>
      </div>
    </form>
  );
};
