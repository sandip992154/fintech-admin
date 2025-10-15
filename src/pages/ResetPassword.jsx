import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Shield,
  ArrowLeft,
  Check,
  X,
} from "lucide-react";
import authService from "../services/authService";
import { LoadingButton } from "../components/ui/Loading";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const watchedPassword = watch("password", "");

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing reset token. Please try again.");
      navigate("/forgot-password");
    }
  }, [token, navigate]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await authService.resetPassword(
        token,
        data.password,
        data.confirmPassword
      );

      setResetSuccess(true);
      toast.success(
        "🎉 Password reset successful! You can now sign in with your new password.",
        {
          position: "top-right",
          autoClose: 5000,
        }
      );

      setTimeout(() => {
        navigate("/signin");
      }, 3000);
    } catch (error) {
      let errorMessage = "❌ Failed to reset password. Please try again.";

      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength checker
  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(watchedPassword);

  const getStrengthText = (strength) => {
    switch (strength) {
      case 0:
      case 1:
        return "Very Weak";
      case 2:
        return "Weak";
      case 3:
        return "Fair";
      case 4:
        return "Good";
      case 5:
        return "Strong";
      default:
        return "Very Weak";
    }
  };

  const getStrengthColor = (strength) => {
    switch (strength) {
      case 0:
      case 1:
        return "text-red-600";
      case 2:
        return "text-orange-600";
      case 3:
        return "text-yellow-600";
      case 4:
        return "text-blue-600";
      case 5:
        return "text-green-600";
      default:
        return "text-red-600";
    }
  };

  const getStrengthBarColor = (strength) => {
    switch (strength) {
      case 0:
      case 1:
        return "bg-red-500";
      case 2:
        return "bg-orange-500";
      case 3:
        return "bg-yellow-500";
      case 4:
        return "bg-blue-500";
      case 5:
        return "bg-green-500";
      default:
        return "bg-red-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex min-h-[600px]">
          {/* Left Side - Services Display */}
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-blue-600 relative p-8 lg:p-12">
            <div className="relative z-10 flex flex-col justify-center text-white w-full">
              {/* Company Logo and Title */}
              <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <img
                    src="/bandaru_pay_logo.png"
                    alt="Bandaru Pay"
                    className="h-12 w-auto"
                  />
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                  Create New Password
                </h1>
                <h2 className="text-xl lg:text-2xl font-semibold text-yellow-300">
                  Secure your account with a strong password
                </h2>
              </div>

              {/* Security Features */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                  <Shield className="h-5 w-5 text-green-300" />
                  <span className="text-sm">256-bit Encryption</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                  <CheckCircle className="h-5 w-5 text-green-300" />
                  <span className="text-sm">Strong Password Policy</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                  <Lock className="h-5 w-5 text-green-300" />
                  <span className="text-sm">Secure Authentication</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Reset Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-gradient-to-br from-gray-50 to-white">
            <div className="w-full max-w-md">
              {/* Mobile Logo */}
              <div className="lg:hidden text-center mb-6">
                <img
                  src="/bandaru_pay_logo.png"
                  alt="Bandaru Pay"
                  className="h-16 w-auto mx-auto mb-4"
                />
              </div>

              {/* Form Container */}
              <div className="space-y-6">
                {/* Header */}
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center">
                    {resetSuccess ? (
                      <CheckCircle className="h-8 w-8 text-white" />
                    ) : (
                      <Lock className="h-8 w-8 text-white" />
                    )}
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                    {resetSuccess ? "Password Updated!" : "Reset Password"}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {resetSuccess
                      ? "Your password has been successfully updated. Redirecting to login..."
                      : "Enter your new password below"}
                  </p>
                </div>

                {!resetSuccess ? (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          {...register("password")}
                          type={showPassword ? "text" : "password"}
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200 text-gray-800"
                          placeholder="Enter your new password"
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <div className="mt-1 flex items-center text-red-600 text-sm">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          <p>{errors.password.message}</p>
                        </div>
                      )}

                      {/* Password Strength Indicator */}
                      {watchedPassword && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600">
                              Password Strength:
                            </span>
                            <span
                              className={getStrengthColor(passwordStrength)}
                            >
                              {getStrengthText(passwordStrength)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${getStrengthBarColor(
                                passwordStrength
                              )}`}
                              style={{
                                width: `${(passwordStrength / 5) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          {...register("confirmPassword")}
                          type={showConfirmPassword ? "text" : "password"}
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200 text-gray-800"
                          placeholder="Confirm your new password"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <div className="mt-1 flex items-center text-red-600 text-sm">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          <p>{errors.confirmPassword.message}</p>
                        </div>
                      )}
                    </div>

                    {/* Password Requirements */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-blue-800 mb-2">
                        Password Requirements:
                      </h4>
                      <div className="space-y-1 text-xs text-blue-700">
                        <div className="flex items-center">
                          {watchedPassword.length >= 8 ? (
                            <Check className="h-3 w-3 text-green-600 mr-1" />
                          ) : (
                            <X className="h-3 w-3 text-red-600 mr-1" />
                          )}
                          <span>At least 8 characters</span>
                        </div>
                        <div className="flex items-center">
                          {/[A-Z]/.test(watchedPassword) ? (
                            <Check className="h-3 w-3 text-green-600 mr-1" />
                          ) : (
                            <X className="h-3 w-3 text-red-600 mr-1" />
                          )}
                          <span>One uppercase letter</span>
                        </div>
                        <div className="flex items-center">
                          {/[a-z]/.test(watchedPassword) ? (
                            <Check className="h-3 w-3 text-green-600 mr-1" />
                          ) : (
                            <X className="h-3 w-3 text-red-600 mr-1" />
                          )}
                          <span>One lowercase letter</span>
                        </div>
                        <div className="flex items-center">
                          {/[0-9]/.test(watchedPassword) ? (
                            <Check className="h-3 w-3 text-green-600 mr-1" />
                          ) : (
                            <X className="h-3 w-3 text-red-600 mr-1" />
                          )}
                          <span>One number</span>
                        </div>
                        <div className="flex items-center">
                          {/[!@#$%^&*(),.?":{}|<>]/.test(watchedPassword) ? (
                            <Check className="h-3 w-3 text-green-600 mr-1" />
                          ) : (
                            <X className="h-3 w-3 text-red-600 mr-1" />
                          )}
                          <span>One special character</span>
                        </div>
                      </div>
                    </div>

                    <LoadingButton
                      type="submit"
                      loading={isLoading}
                      loadingText="Updating Password..."
                      className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-blue-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center"
                      disabled={isLoading || passwordStrength < 4}
                    >
                      <Shield className="h-5 w-5 mr-2" />
                      Update Password
                    </LoadingButton>
                  </form>
                ) : (
                  <div className="space-y-5">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <p className="text-sm text-green-700">
                          Password updated successfully! Redirecting to login...
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Back to Login */}
                <div className="text-center">
                  <button
                    onClick={() => navigate("/signin")}
                    className="flex items-center justify-center w-full text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors duration-200"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Login
                  </button>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      BANDARU SOFTWARE SOLUTIONS PVT LTD
                    </h4>
                    <div className="space-y-1 text-xs text-gray-600">
                      <p>📧 contact@bandarupay.com</p>
                      <p>📞 Support: +91 7997991699</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
