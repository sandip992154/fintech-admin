import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Validation Schema
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  displayName: yup.string().required("Display Name is required"),
  type: yup.string().required("Type is required"),
});

const PermissionForm = ({
  initialData = {},
  setIsModal,
  onSubmitForm, // Callback to parent for add/edit
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
      displayName: "",
      type: "",
      ...initialData,
    },
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialData?.image || null);

  useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        setValue(key, value || "");
      });
    }
  }, [initialData, setValue]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data) => {
    const payload = {
      ...data,
      image: imagePreview || null,
    };

    onSubmitForm(payload);

    reset();
    setImageFile(null);
    setImagePreview(null);
    setIsModal((prev) => ({ ...prev, AddNew: false }));
  };

  const inputClass = (hasError) =>
    `px-3 py-2 rounded border ${
      hasError ? "border-red-500" : "border-gray-300"
    } focus:outline-none focus:ring-2 focus:ring-secondary`;

  return (
    <div>
      <div className="mb-4 text-lg font-semibold text-center">
        {initialData && initialData.name ? "Edit Permission" : "Add Permission"}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex gap-4">
          {/* Name */}
          <div className="flex flex-col w-full">
            <label htmlFor="name" className="mb-1 text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              placeholder="Enter Permission Name"
              {...register("name")}
              className={inputClass(errors.name)}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Display Name */}
          <div className="flex flex-col w-full">
            <label htmlFor="displayName" className="mb-1 text-sm font-medium">
              Display Name
            </label>
            <input
              id="displayName"
              placeholder="Enter Display Name"
              {...register("displayName")}
              className={inputClass(errors.displayName)}
            />
            {errors.displayName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.displayName.message}
              </p>
            )}
          </div>
        </div>

        {/* Type */}
        <div className="flex flex-col">
          <label htmlFor="type" className="mb-1 text-sm font-medium">
            Type
          </label>
          <input
            id="type"
            placeholder="Enter Permission Type"
            {...register("type")}
            className={inputClass(errors.type)}
          />
          {errors.type && (
            <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
          )}
        </div>

        {/* Image */}
        <div className="flex flex-col">
          <label htmlFor="image" className="mb-1 text-sm font-medium">
            Image/Logo (Optional)
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="px-3 py-2 border border-gray-300 rounded text-sm"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-2 h-24 w-24 object-cover rounded border"
            />
          )}
        </div>

        <button
          type="submit"
          className="bg-secondary text-white px-4 py-2 rounded w-full hover:bg-secondary/80 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default PermissionForm;
