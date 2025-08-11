import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link } from "react-router";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  mobile: yup
    .string()
    .matches(/^\d{10}$/, "Enter valid 10-digit mobile")
    .required(),
  email: yup.string().email("Invalid email").required("Email is required"),
  address: yup.string().required("Address is required"),
  state: yup.string().required("State is required"),
  city: yup.string().required("City is required"),
  pinCode: yup
    .string()
    .matches(/^\d{6}$/, "Invalid pincode")
    .required(),
  shopName: yup.string().required("Shop name is required"),
  panCard: yup.string().required("PAN card is required"),
  aadhaarCard: yup.string().required("Aadhaar card is required"),
  scheme: yup.string().required("Please select a scheme"),
  companyName: yup.string().required("Company name is required"),
  domain: yup.string().required("Domain is required"),
});

const states = ["Maharashtra", "Gujarat", "Karnataka", "Tamil Nadu"];
const schemes = ["Retailor-A", "NK Tax Consultancy", "Default"];

const CreateWhitelabel = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const inputClass =
    "px-4 py-2 bg-transparent rounded ring-1 ring-gray-600 focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <div className="h-[90vh] 2xl:max-w-[80%] p-4 mx-8 bg-white mt-2 dark:bg-darkBlue/70 rounded-2xl 2xl:mx-auto text-gray-800 overflow-hidden overflow-y-auto px-4 pb-6 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 dark:text-white"
      >
        {/* Personal Info - Left Column */}
        <div className="col-span-2 text-lg font-semibold mt-4">
          Personal Information
        </div>
        <div className="flex flex-col">
          <label>
            Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register("name")}
            placeholder="First Name"
            className={inputClass}
          />
          {errors.name && (
            <p className="text-red-400 text-xs">{errors.name.message}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label>
            Mobile <span className="text-red-500">*</span>
          </label>
          <input
            {...register("mobile")}
            placeholder="Mobile Number"
            className={inputClass}
          />
          {errors.mobile && (
            <p className="text-red-400 text-xs">{errors.mobile.message}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label>
            Email <span className="text-red-500">*</span>
          </label>
          <input
            {...register("email")}
            placeholder="Email Address"
            className={inputClass}
          />
          {errors.email && (
            <p className="text-red-400 text-xs">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label>
            State <span className="text-red-500">*</span>
          </label>
          <select {...register("state")} className={inputClass}>
            <option value="" className="dark:bg-darkBlue">
              Select State
            </option>
            {states.map((state) => (
              <option key={state} value={state} className="dark:bg-darkBlue">
                {state}
              </option>
            ))}
          </select>
          {errors.state && (
            <p className="text-red-400 text-xs">{errors.state.message}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label>
            Address <span className="text-red-500">*</span>
          </label>
          <input
            {...register("address")}
            placeholder="Address"
            className={inputClass}
          />
          {errors.address && (
            <p className="text-red-400 text-xs">{errors.address.message}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label>
            City <span className="text-red-500">*</span>
          </label>
          <input
            {...register("city")}
            placeholder="City"
            className={inputClass}
          />
          {errors.city && (
            <p className="text-red-400 text-xs">{errors.city.message}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label>
            Pin Code <span className="text-red-500">*</span>
          </label>
          <input
            {...register("pinCode")}
            placeholder="PinCode"
            className={inputClass}
          />
          {errors.pinCode && (
            <p className="text-red-400 text-xs">{errors.pinCode.message}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label>
            Shop Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register("shopName")}
            placeholder="Shop Name"
            className={inputClass}
          />
          {errors.shopName && (
            <p className="text-red-400 text-xs">{errors.shopName.message}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label>
            PAN Card Number <span className="text-red-500">*</span>
          </label>
          <input
            {...register("panCard")}
            placeholder="Pan card"
            className={inputClass}
          />
          {errors.panCard && (
            <p className="text-red-400 text-xs">{errors.panCard.message}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label>
            Aadhaar Card Number <span className="text-red-500">*</span>
          </label>
          <input
            {...register("aadhaarCard")}
            placeholder="Aadhar Card Number"
            className={inputClass}
          />
          {errors.aadhaarCard && (
            <p className="text-red-400 text-xs">{errors.aadhaarCard.message}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label>Scheme</label>
          <select {...register("scheme")} className={inputClass}>
            <option value="" className="dark:bg-darkBlue">
              Select Scheme
            </option>
            {schemes.map((sch) => (
              <option key={sch} value={sch} className="dark:bg-darkBlue">
                {sch}
              </option>
            ))}
          </select>
          {errors.scheme && (
            <p className="text-red-400 text-xs">{errors.scheme.message}</p>
          )}
        </div>

        {/* Whitelabel Section */}
        <div className="col-span-2 text-lg font-semibold mt-4">
          Whitelable Information
        </div>

        <div className="flex flex-col">
          <label>
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register("companyName")}
            placeholder="Enter Value"
            className={inputClass}
          />
          {errors.companyName && (
            <p className="text-red-400 text-xs">{errors.companyName.message}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label>
            Domain <span className="text-red-500">*</span>
          </label>
          <input
            {...register("domain")}
            placeholder="Enter Value"
            className={inputClass}
          />
          {errors.domain && (
            <p className="text-red-400 text-xs">{errors.domain.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="col-span-2">
          <div className="flex gap-2">
            <Link
              to="/members/whitelabel"
              className="mt-4 bg-accentRed text-white btn-md"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="mt-4 bg-secondary text-white btn-md"
            >
              Add New User
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateWhitelabel;
