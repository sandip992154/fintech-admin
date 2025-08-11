import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Form schema
const schema = yup.object().shape({
  bankName: yup.string().required("Bank Name is required"),
  accountNumber: yup.string().required("Account Number is required"),
  ifsc: yup.string().required("IFSC is required"),
  branch: yup.string().required("Branch is required"),
  charges: yup
    .number()
    .typeError("Charges must be a number")
    .required("Charges per lakh is required"),
  qr: yup.mixed().nullable(),
});

// Fields
const fields = [
  { name: "bankName", label: "Bank Name", type: "text" },
  { name: "accountNumber", label: "Account Number", type: "text" },
  { name: "ifsc", label: "IFSC", type: "text" },
  { name: "branch", label: "Branch", type: "text" },
  { name: "charges", label: "Charges/Lakh", type: "number" },
  { name: "qr", label: "QR (Optional)", type: "file" },
];

const BankDetailsForm = ({ initialData = {}, onSubmit }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: initialData,
    resolver: yupResolver(schema),
  });

  const [previewUrl, setPreviewUrl] = useState("");
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (initialData?.qr && typeof initialData.qr === "string") {
      setPreviewUrl(initialData.qr); // for edit case
      setFileName("Existing QR Image");
    }
  }, [initialData]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-3xl mx-auto p-6 rounded-lg"
    >
      <h2 className="text-xl font-semibold mb-4 dark:text-white">
        Bank Details
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map(({ name, label, type }) => (
          <div key={name} className="flex flex-col">
            <label
              htmlFor={name}
              className="mb-1 text-sm font-medium dark:text-white"
            >
              {label}
            </label>

            {type === "file" ? (
              <>
                <input
                  type="file"
                  id={name}
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setValue(name, e.target.files);
                      setPreviewUrl(URL.createObjectURL(file));
                      setFileName(file.name); // NEW
                    }
                  }}
                  className={`bg-transparent border rounded-md px-3 py-2 text-sm dark:text-white 
            ${errors[name] ? "border-red-500" : "border-gray-500"} 
            focus:outline-none focus:ring-1 ${
              errors[name] ? "focus:ring-red-500" : "focus:ring-purple-500"
            }`}
                />
                {/* 👇 Show selected file name */}
                {fileName && (
                  <span className="text-sm text-gray-300 mt-1">
                    Selected: {fileName}
                  </span>
                )}
                {/* 👇 Show preview */}
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="QR Preview"
                    className="mt-2 h-20 w-20 border border-gray-500 rounded-md"
                  />
                )}
              </>
            ) : (
              <input
                type={type}
                id={name}
                {...register(name)}
                className={`bg-transparent border rounded-md px-3 py-2 text-sm dark:text-white 
          ${errors[name] ? "border-red-500" : "border-gray-500"} 
          focus:outline-none focus:ring-1 ${
            errors[name] ? "focus:ring-red-500" : "focus:ring-purple-500"
          }`}
              />
            )}

            {errors[name] && (
              <p className="text-red-400 text-sm mt-1">
                {errors[name]?.message}
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
    </form>
  );
};

export default BankDetailsForm;
