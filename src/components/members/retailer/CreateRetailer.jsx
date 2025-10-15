import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link } from "react-router";
import { useMemberManagement } from "../../../../hooks/useMemberManagement";
import { toast } from "react-toastify";

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
  parent: yup.string().required("Please select a parent"),
});

const states = ["Maharashtra", "Gujarat", "Karnataka", "Tamil Nadu"];

const CreateRetailer = ({ onSubmit }) => {
  const {
    schemes,
    locationOptions,
    availableParents,
    getSchemes,
    fetchLocationOptions,
    fetchAvailableParents,
    createMember,
    actionLoading,
    error,
    clearErrors,
  } = useMemberManagement("retailer");

  const [selectedState, setSelectedState] = useState("");
  const [cities, setCities] = useState([]);

  // Load schemes, parents, and locations on component mount
  useEffect(() => {
    getSchemes();
    fetchAvailableParents("distributor"); // Retailer parent should be Distributor
    fetchLocationOptions();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const watchedState = watch("state");

  // Handle state change and update cities
  useEffect(() => {
    if (watchedState && watchedState !== selectedState) {
      setSelectedState(watchedState);
      const stateCities = locationOptions.cities?.[watchedState] || [];
      setCities(stateCities);
      setValue("city", ""); // Reset city when state changes
    }
  }, [watchedState, selectedState, locationOptions, setValue]);

  const handleFormSubmit = async (data) => {
    try {
      clearErrors();
      const success = await createMember(data);
      if (success) {
        toast.success("Retailer created successfully!");
        reset();
        if (onSubmit) onSubmit();
      }
    } catch (err) {
      toast.error(error || "Failed to create retailer");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create Retailer
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          <Link
            to="/member-management"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            ← Back to Member Management
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Parent Selection */}
            <div>
              <label
                htmlFor="parent"
                className="block text-sm font-medium text-gray-700"
              >
                Select Parent Distributor *
              </label>
              <select
                id="parent"
                {...register("parent")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select Distributor</option>
                {availableParents.map((parent) => (
                  <option key={parent.id} value={parent.id}>
                    {parent.name} ({parent.user_code})
                  </option>
                ))}
              </select>
              {errors.parent && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.parent.message}
                </p>
              )}
            </div>

            {/* Personal Information */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name *
              </label>
              <input
                id="name"
                type="text"
                {...register("name")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="mobile"
                className="block text-sm font-medium text-gray-700"
              >
                Mobile Number *
              </label>
              <input
                id="mobile"
                type="tel"
                {...register("mobile")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.mobile && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.mobile.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Address Information */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address *
              </label>
              <textarea
                id="address"
                {...register("address")}
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700"
                >
                  State *
                </label>
                <select
                  id="state"
                  {...register("state")}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                {errors.state && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.state.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700"
                >
                  City *
                </label>
                <select
                  id="city"
                  {...register("city")}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  disabled={!selectedState}
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.city.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="pinCode"
                className="block text-sm font-medium text-gray-700"
              >
                Pin Code *
              </label>
              <input
                id="pinCode"
                type="text"
                {...register("pinCode")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.pinCode && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.pinCode.message}
                </p>
              )}
            </div>

            {/* Business Information */}
            <div>
              <label
                htmlFor="shopName"
                className="block text-sm font-medium text-gray-700"
              >
                Shop Name *
              </label>
              <input
                id="shopName"
                type="text"
                {...register("shopName")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.shopName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.shopName.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="companyName"
                className="block text-sm font-medium text-gray-700"
              >
                Company Name *
              </label>
              <input
                id="companyName"
                type="text"
                {...register("companyName")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.companyName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.companyName.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="domain"
                className="block text-sm font-medium text-gray-700"
              >
                Domain *
              </label>
              <input
                id="domain"
                type="text"
                {...register("domain")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.domain && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.domain.message}
                </p>
              )}
            </div>

            {/* Documentation */}
            <div>
              <label
                htmlFor="panCard"
                className="block text-sm font-medium text-gray-700"
              >
                PAN Card *
              </label>
              <input
                id="panCard"
                type="text"
                {...register("panCard")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.panCard && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.panCard.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="aadhaarCard"
                className="block text-sm font-medium text-gray-700"
              >
                Aadhaar Card *
              </label>
              <input
                id="aadhaarCard"
                type="text"
                {...register("aadhaarCard")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.aadhaarCard && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.aadhaarCard.message}
                </p>
              )}
            </div>

            {/* Scheme Selection */}
            <div>
              <label
                htmlFor="scheme"
                className="block text-sm font-medium text-gray-700"
              >
                Scheme *
              </label>
              <select
                id="scheme"
                {...register("scheme")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select Scheme</option>
                {schemes.map((scheme) => (
                  <option key={scheme.id} value={scheme.id}>
                    {scheme.name}
                  </option>
                ))}
              </select>
              {errors.scheme && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.scheme.message}
                </p>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={actionLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? "Creating..." : "Create Retailer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRetailer;
