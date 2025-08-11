import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Yup validation schema
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  website: yup.string().url("Invalid URL").required("Website is required"),
  senderid: yup.string().required("Sender ID is required"),
  smsuser: yup.string().required("SMS User is required"),
  smspwd: yup.string().required("SMS PWD is required"),
});

const CompanyForm = ({
  editingCompany,
  setEditingCompany,
  setIsModal,
  setCompany,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      website: "",
      senderid: "",
      smsuser: "",
      smspwd: "",
    },
  });

  // Populate form values in edit mode
  useEffect(() => {
    if (editingCompany) {
      Object.keys(editingCompany).forEach((key) => {
        if (editingCompany[key] !== undefined) {
          setValue(key, editingCompany[key]);
        }
      });
    }
  }, [editingCompany, setValue]);

  const onSubmit = (data) => {
    console.log("Submitted data:", data);

    setIsModal((prev) => ({ ...prev, AddNew: false }));
    setEditingCompany(null);
    setCompany("");
    reset();
  };

  return (
    <div className="md:min-w-80">
      <div className="mb-4 text-lg font-semibold text-center">
        {editingCompany ? "Edit Company" : "Add Company"}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col space-y-4">
          {[
            { label: "Name", name: "name", type: "text" },
            { label: "Website", name: "website", type: "text" },
            { label: "Sender ID", name: "senderid", type: "text" },
            { label: "SMS User", name: "smsuser", type: "text" },
            { label: "SMS PWD", name: "smspwd", type: "text" },
          ].map(({ label, name, type }) => (
            <div key={name} className="flex flex-col">
              <label htmlFor={name} className="mb-1 font-medium text-sm">
                {label}
              </label>
              <input
                id={name}
                type={type}
                placeholder={label}
                {...register(name)}
                className={`w-full px-4 py-2 rounded border ${
                  errors[name] ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-secondary`}
              />
              {errors[name] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[name]?.message}
                </p>
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="border-1 bg-secondary px-4 py-2 rounded-md font-bold my-3 w-full text-white cursor-pointer"
        >
          {editingCompany ? "Update" : "Add"}
        </button>
      </form>
    </div>
  );
};

export default CompanyForm;
