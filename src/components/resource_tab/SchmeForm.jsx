import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Validation schema
const schema = yup.object().shape({
  schemeName: yup
    .string()
    .required("Scheme name is required")
    .min(3, "Scheme name must be at least 3 characters"),
});

const SchemeForm = ({
  editingScheme,
  setEditingScheme,
  filteredData,
  setFilteredData,
  paginateData,
  setIsModal,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      schemeName: editingScheme?.name || "",
    },
  });

  // Update default value on edit
  React.useEffect(() => {
    if (editingScheme?.name) {
      setValue("schemeName", editingScheme.name);
    }
  }, [editingScheme, setValue]);

  const onSubmit = ({ schemeName }) => {
    if (editingScheme) {
      // Edit mode
      const updatedData = [...filteredData];
      const index = updatedData.findIndex((d) => d.id === editingScheme.id);
      if (index !== -1) {
        updatedData[index].name = schemeName;
        setFilteredData(updatedData);
        paginateData();
      }
    } else {
      // Add mode
      const newEntry = {
        id: filteredData.length + 1,
        name: schemeName,
        status: true,
      };
      const updatedData = [newEntry, ...filteredData];
      setFilteredData(updatedData);
      paginateData();
    }

    // Close modal & reset state
    setIsModal((prev) => ({ ...prev, AddNew: false }));
    setEditingScheme(null);
    reset();
  };

  return (
    <>
      <div className="mb-4 text-lg font-semibold text-center">
        {editingScheme ? "Edit Scheme" : "Add New Scheme"}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col space-y-2">
          <label htmlFor="schemeName" className="text-sm font-medium">
            Scheme Name
          </label>
          <input
            id="schemeName"
            type="text"
            placeholder="Scheme Name"
            {...register("schemeName")}
            className={`w-full px-3 py-2 border ${
              errors.schemeName ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-secondary`}
          />
          {errors.schemeName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.schemeName.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="border-1 bg-secondary px-4 py-2 rounded-md font-bold my-4 w-full text-white"
        >
          {editingScheme ? "Update" : "Add"}
        </button>
      </form>
    </>
  );
};

export default SchemeForm;
