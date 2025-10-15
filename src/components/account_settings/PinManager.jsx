import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import apiClient from "../../services/apiClient";

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

const PinManager = ({ initialData, onSubmit, loading = false }) => {
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: initialData,
    resolver: yupResolver(schema),
  });

  const handleSendOtp = async () => {
    setSendingOtp(true);
    try {
      const response = await apiClient.post("/api/v1/profile/otp/generate", {
        purpose: "pin_change",
      });

      toast.success(response.data.message);
      setOtpSent(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
      const errorMessage =
        error.response?.data?.detail || error.message || "Failed to send OTP";
      toast.error(errorMessage);
    } finally {
      setSendingOtp(false);
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      // Direct PIN change - OTP verification will be handled by the backend
      if (onSubmit) {
        const pinData = {
          new_pin: data.newPin,
          confirm_pin: data.confirmPin,
          otp: data.otp,
        };
        await onSubmit(pinData);
        setOtpVerified(true);
      }
    } catch (error) {
      toast.error("Error processing PIN change");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl"
    >
      {/* New PIN */}
      <div>
        <label className="block text-sm mb-1">New PIN</label>
        <input
          type="password"
          inputMode="numeric"
          maxLength="4"
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
          maxLength="4"
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
            disabled={sendingOtp}
            className="text-xs text-violet-400 hover:underline disabled:opacity-50"
          >
            {sendingOtp ? "Sending..." : otpSent ? "Resend OTP" : "Send OTP"}
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
          disabled={loading || !otpSent}
          className="px-6 py-2 bg-secondary text-white rounded hover:bg-violet-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? "Processing..."
            : otpVerified
            ? "PIN Updated!"
            : "Reset PIN"}
        </button>

        {!otpSent && (
          <p className="text-xs text-gray-500 mt-2">
            Please send OTP first to enable PIN reset
          </p>
        )}
      </div>
    </form>
  );
};

export default PinManager;
