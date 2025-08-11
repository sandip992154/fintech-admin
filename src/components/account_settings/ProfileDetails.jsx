import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Yup validation schema
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  mobile: yup
    .string()
    .matches(/^[6-9]\d{9}$/, "Enter valid 10-digit mobile number")
    .required("Mobile number is required"),
  state: yup.string().required("State is required"),
  city: yup.string().required("City is required"),
  gender: yup.string().required("Gender is required"),
  pinCode: yup
    .string()
    .matches(/^\d{6}$/, "Enter a valid 6-digit PIN code")
    .required("PIN code is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  securityPin: yup
    .string()
    .matches(/^\d{4,6}$/, "Security PIN must be 4 to 6 digits")
    .required("Security PIN is required"),
  address: yup.string().required("Address is required"),
});

const ProfileDetails = ({ initialData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      ...initialData,
    },
  });

  const onSubmit = (data) => {
    console.log("Submitted Data:", data);
    alert("Profile updated successfully!");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl"
    >
      <div>
        <label className="block text-sm mb-1">Name</label>
        <input
          type="text"
          {...register("name")}
          className="w-full px-3 py-2 rounded  dark:text-white border border-gray-600"
        />
        <p className="text-red-500 text-sm">{errors.name?.message}</p>
      </div>

      <div>
        <label className="block text-sm mb-1">Mobile</label>
        <input
          type="text"
          {...register("mobile")}
          className="w-full px-3 py-2 rounded  dark:text-white border border-gray-600"
        />
        <p className="text-red-500 text-sm">{errors.mobile?.message}</p>
      </div>

      <div>
        <label className="block text-sm mb-1">State</label>
        <input
          type="text"
          {...register("state")}
          className="w-full px-3 py-2 rounded  dark:text-white border border-gray-600"
        />
        <p className="text-red-500 text-sm">{errors.state?.message}</p>
      </div>

      <div>
        <label className="block text-sm mb-1">City</label>
        <input
          type="text"
          {...register("city")}
          className="w-full px-3 py-2 rounded  dark:text-white border border-gray-600"
        />
        <p className="text-red-500 text-sm">{errors.city?.message}</p>
      </div>

      <div>
        <label className="block text-sm mb-1">Gender</label>
        <select
          {...register("gender")}
          className="w-full px-3 py-2 rounded  dark:text-white border border-gray-600"
        >
          <option className="dark:bg-darkBlue" value="">
            Select Gender
          </option>
          <option className="dark:bg-darkBlue" value="Male">
            Male
          </option>
          <option className="dark:bg-darkBlue" value="Female">
            Female
          </option>
          <option className="dark:bg-darkBlue" value="Other">
            Other
          </option>
        </select>
        <p className="text-red-500 text-sm">{errors.gender?.message}</p>
      </div>

      <div>
        <label className="block text-sm mb-1">PIN Code</label>
        <input
          type="text"
          {...register("pinCode")}
          className="w-full px-3 py-2 rounded  dark:text-white border border-gray-600"
        />
        <p className="text-red-500 text-sm">{errors.pinCode?.message}</p>
      </div>

      <div>
        <label className="block text-sm mb-1">Email</label>
        <input
          type="email"
          {...register("email")}
          className="w-full px-3 py-2 rounded  dark:text-white border border-gray-600"
        />
        <p className="text-red-500 text-sm">{errors.email?.message}</p>
      </div>

      <div>
        <label className="block text-sm mb-1">Security PIN</label>
        <input
          type="password"
          {...register("securityPin")}
          className="w-full px-3 py-2 rounded  dark:text-white border border-gray-600"
        />
        <p className="text-red-500 text-sm">{errors.securityPin?.message}</p>
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm mb-1">Address</label>
        <input
          type="text"
          {...register("address")}
          className="w-full px-3 py-2 rounded  dark:text-white border border-gray-600"
        />
        <p className="text-red-500 text-sm">{errors.address?.message}</p>
      </div>

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

export default ProfileDetails;
