import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// ✅ Validation Schema
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  link: yup.string().url("Invalid URL").required("Link is required"),
  image: yup.mixed().notRequired(),
});

const AddQuickLinkForm = ({ initialData = {}, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: initialData,
    resolver: yupResolver(schema),
  });

  const img = initialData?.image;
  const [previewImage, setPreviewImage] = useState(img || null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setValue("image", file);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className=" dark:text-white p-6 rounded-lg  w-full max-w-md"
    >
      <h1 className="text-2xl font-bold dark:text-white mb-4">
        {initialData ? "Edit Links" : "Add Links"}
      </h1>

      {/* Name Field */}
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-semibold mb-1">
          Name
        </label>
        <input
          id="name"
          {...register("name")}
          placeholder="Enter Name"
          className={`w-full px-4 py-2 rounded  dark:text-white border ${
            errors.name ? "border-red-500" : "border-gray-600"
          } focus:outline-none focus:ring-2 focus:ring-purple-500`}
        />
        {errors.name && (
          <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Link Field */}
      <div className="mb-4">
        <label htmlFor="link" className="block text-sm font-semibold mb-1">
          Link
        </label>
        <input
          id="link"
          {...register("link")}
          placeholder="Enter Link"
          className={`w-full px-4 py-2 rounded  dark:text-white border ${
            errors.link ? "border-red-500" : "border-gray-600"
          } focus:outline-none focus:ring-2 focus:ring-purple-500`}
        />
        {errors.link && (
          <p className="text-red-400 text-sm mt-1">{errors.link.message}</p>
        )}
      </div>

      {/* Image Upload */}
      <div className="mb-4">
        <label htmlFor="image" className="block text-sm font-semibold mb-1">
          Image/Logo (Optional)
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full dark:text-white border border-gray-600 px-4 py-2 rounded"
        />
      </div>

      {/* Preview Container */}
      {previewImage && (
        <div className="mb-6 mt-2">
          <p className="text-sm font-semibold mb-1">Preview:</p>
          <div className="w-20 h-20   border border-gray-600 rounded flex items-center justify-center overflow-hidden">
            <img
              src={previewImage}
              alt="Preview"
              className="object-contain w-full h-full"
            />
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-[#7D5FFF] hover:bg-[#7D5FFF]/80 text-white px-6 py-2 rounded shadow"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default AddQuickLinkForm;
