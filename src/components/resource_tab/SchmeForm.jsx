import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import schemeManagementService from "../../services/schemeManagementService";

// Validation schema
const schema = yup.object().shape({
  name: yup
    .string()
    .required("Scheme name is required")
    .min(3, "Scheme name must be at least 3 characters"),
  description: yup
    .string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),
});

const SchemeForm = ({ editingScheme, onSchemeUpdate, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: editingScheme?.name || "",
      description: editingScheme?.description || "",
    },
  });

  // Update default values on edit
  React.useEffect(() => {
    if (editingScheme) {
      setValue("name", editingScheme.name);
      setValue("description", editingScheme.description || "");
    }
  }, [editingScheme, setValue]);

  const onSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      let result;

      if (editingScheme) {
        // Edit mode - update existing scheme
        result = await schemeManagementService.updateScheme(
          editingScheme.id,
          formData
        );
        toast.success("Scheme updated successfully!");
      } else {
        // Add mode - create new scheme
        result = await schemeManagementService.createScheme(formData);
        toast.success("Scheme created successfully!");
      }

      // Notify parent component to refresh data
      if (onSchemeUpdate) {
        onSchemeUpdate();
      }

      // Close modal & reset state
      onClose();
      reset();
    } catch (error) {
      console.error("Error saving scheme:", error);
      toast.error(error.message || "Failed to save scheme. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="mb-4 text-lg font-semibold text-center">
        {editingScheme ? "Edit Scheme" : "Add New Scheme"}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Scheme Name */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Scheme Name *
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter scheme name"
            {...register("name")}
            className={`w-full px-3 py-2 border ${
              errors.name ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-secondary dark:bg-darkBlue dark:text-white dark:border-gray-600`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description *
          </label>
          <textarea
            id="description"
            rows="3"
            placeholder="Enter scheme description"
            {...register("description")}
            className={`w-full px-3 py-2 border ${
              errors.description ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-secondary dark:bg-darkBlue dark:text-white dark:border-gray-600 resize-none`}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full px-4 py-2 rounded-md font-bold text-white transition-colors ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-secondary hover:bg-secondary/90"
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {editingScheme ? "Updating..." : "Creating..."}
            </div>
          ) : editingScheme ? (
            "Update Scheme"
          ) : (
            "Create Scheme"
          )}
        </button>
      </form>
    </>
  );
};

export default SchemeForm;
