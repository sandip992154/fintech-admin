import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// ✅ Validation Schema
const schema = yup.object().shape({
  subject: yup
    .string()
    .required("Subject is required")
    .min(5, "Subject must be at least 5 characters"),
});

const AddSubjectForm = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="min-w-xl">
      <h1 className="text-2xl font-bold">Add Subject</h1>

      <div className="px-2 py-2 flex flex-col justify-between gap-2">
        <label htmlFor="subject" className="text-xl font-bold">
          Subject
        </label>
        <textarea
          id="subject"
          {...register("subject")}
          className={`ring-1 rounded px-3 py-2 focus:outline-none focus:ring-2 ${
            errors.subject ? "ring-red-500" : "ring-gray-300"
          }`}
          rows={5}
        />
        {errors.subject && (
          <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
        )}
      </div>

      <div className="flex w-full mt-4">
        <button
          type="submit"
          className="ml-auto mr-2 px-2 py-2 bg-secondary text-white rounded w-48 hover:bg-secondary/80 transition"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default AddSubjectForm;
