import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// ✅ Validation Schema
const schema = yup.object().shape({
  newPin: yup
    .string()
    .matches(/^\d{4,6}$/, "PIN must be 4 to 6 digits")
    .required("New PIN is required"),
  confirmPin: yup
    .string()
    .oneOf([yup.ref("newPin")], "PINs do not match")
    .required("Confirm PIN is required"),
  otp: yup
    .string()
    .matches(/^\d{6}$/, "OTP must be exactly 6 digits")
    .required("OTP is required"),
});

const PinManager = ({ initialData }) => {
  const [otpSent, setOtpSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialData,
    resolver: yupResolver(schema),
  });

  const handleSendOtp = () => {
    alert("OTP has been sent!");
    setOtpSent(true);
  };

  const onSubmit = (data) => {
    console.log("PIN Reset Data:", data);
    // Process PIN reset here
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl"
    >
      {/* New PIN */}
      <div>
        <label className="block text-sm mb-1">New PIN</label>
        <input
          type="password"
          inputMode="numeric"
          maxLength="6"
          {...register("newPin")}
          className="w-full px-3 py-2 rounded  dark:text-white border border-gray-600"
        />
        <p className="text-red-500 text-sm mt-1">{errors.newPin?.message}</p>
      </div>

      {/* Confirm PIN */}
      <div>
        <label className="block text-sm mb-1">Confirm PIN</label>
        <input
          type="password"
          inputMode="numeric"
          maxLength="6"
          {...register("confirmPin")}
          className="w-full px-3 py-2 rounded  dark:text-white border border-gray-600"
        />
        <p className="text-red-500 text-sm mt-1">
          {errors.confirmPin?.message}
        </p>
      </div>

      {/* OTP */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm">OTP</label>
          <button
            type="button"
            onClick={handleSendOtp}
            className="text-xs text-violet-400 hover:underline"
          >
            {otpSent ? "Resend OTP" : "Send OTP"}
          </button>
        </div>
        <input
          type="text"
          inputMode="numeric"
          maxLength="6"
          {...register("otp")}
          placeholder="Enter 6-digit OTP"
          className="w-full px-3 py-2 rounded  dark:text-white border border-gray-600"
        />
        <p className="text-red-500 text-sm mt-1">{errors.otp?.message}</p>
      </div>

      {/* Submit */}
      <div className="md:col-span-3">
        <button
          type="submit"
          className="px-6 py-2 bg-secondary text-white rounded hover:bg-violet-600 transition"
        >
          Reset PIN
        </button>
      </div>
    </form>
  );
};

export default PinManager;
