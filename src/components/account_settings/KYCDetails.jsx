import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Yup validation schema
const schema = yup.object().shape({
  shopName: yup.string().required("Shop name is required"),
  gstNumber: yup
    .string()
    .matches(/^[0-9A-Z]{15}$/, "Invalid GST number")
    .required(),
  aadharNumber: yup
    .string()
    .matches(/^\d{12}$/, "Must be 12 digits")
    .required(),
  panNumber: yup
    .string()
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number")
    .required(),
  securityPin: yup
    .string()
    .matches(/^\d{4,6}$/, "PIN must be 4-6 digits")
    .required(),
  passportPhoto: yup
    .mixed()
    .test("is-image", "Only image files are allowed", (value) => {
      return value && value.length > 0 && value[0].type.startsWith("image/");
    }),
});

const KYCDetails = ({ initialData }) => {
  const [previewUrl, setPreviewUrl] = useState(
    initialData.passportPhoto || null
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: initialData,
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log("Form Submitted:", data);
    // You can now send the data to a backend
  };

  const handleImagePreview = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setValue("passportPhoto", e.target.files);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      alert("Please select a valid image file.");
      setValue("passportPhoto", null);
      setPreviewUrl(null);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl"
    >
      {/* Shop Name */}
      <div>
        <label className="block text-sm mb-1">Shop Name</label>
        <input
          {...register("shopName")}
          className="w-full px-3 py-2 rounded  dark:text-white border border-gray-600"
        />
        <p className="text-red-500 text-xs mt-2">{errors.shopName?.message}</p>
      </div>

      {/* GST */}
      <div>
        <label className="block text-sm mb-1">GST Number</label>
        <input
          {...register("gstNumber")}
          className="w-full px-3 py-2 rounded  dark:text-white border border-gray-600"
        />
        <p className="text-red-500 text-xs mt-2">{errors.gstNumber?.message}</p>
      </div>

      {/* Aadhar */}
      <div>
        <label className="block text-sm mb-1">Aadhar Card Number</label>
        <input
          {...register("aadharNumber")}
          className="w-full px-3 py-2 rounded  dark:text-white border border-gray-600"
        />
        <p className="text-red-500 text-xs mt-2">
          {errors.aadharNumber?.message}
        </p>
      </div>

      {/* PAN */}
      <div>
        <label className="block text-sm mb-1">PAN Card Number</label>
        <input
          {...register("panNumber")}
          className="w-full px-3 py-2 rounded  dark:text-white border border-gray-600"
        />
        <p className="text-red-500 text-xs mt-2">{errors.panNumber?.message}</p>
      </div>

      {/* Security PIN */}
      <div>
        <label className="block text-sm mb-1">Security PIN</label>
        <input
          {...register("securityPin")}
          type="password"
          inputMode="numeric"
          className="w-full px-3 py-2 rounded  dark:text-white border border-gray-600"
        />
        <p className="text-red-500 text-xs mt-2">
          {errors.securityPin?.message}
        </p>
      </div>

      {/* Passport Photo */}
      <div>
        <label className="block text-sm mb-1">Passport Size Photo</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImagePreview}
          className="block text-sm text-gray-300 file:mr-4 file:py-2 file:px-3
              file:rounded file:border-0 file:text-sm file:font-semibold
              file:bg-gray-500 file:text-white hover:file:bg-gray-600"
        />
        <p className="text-red-500 text-xs mt-2">
          {errors.passportPhoto?.message}
        </p>

        {!previewUrl && (
          <div class=" dark:text-white p-4 rounded-md text-sm w-fit">
            <p class="font-semibold text-base">Note :-</p>
            <ul class="list-disc list-inside space-y-1 mt-1">
              <li>
                Image will be uploaded only once, Kindly upload the proper image
              </li>
              <li>
                Size: <span class="font-medium">60px X 80px</span> (passport
                size)
              </li>
            </ul>
          </div>
        )}

        {previewUrl && (
          <div className="mt-2 w-24 h-24 rounded border border-gray-400 overflow-hidden">
            <img
              src={previewUrl}
              alt="Preview"
              className="object-cover w-full h-full"
            />
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="md:col-span-2">
        <button
          type="submit"
          className="px-6 py-2 bg-secondary text-white rounded hover:bg-violet-600 transition"
        >
          Update Profile
        </button>
      </div>
    </form>
  );
};

export default KYCDetails;
