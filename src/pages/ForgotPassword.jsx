import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Send } from "lucide-react";
import { toast } from "react-toastify";
import authService from "../services/authService";
import { LoadingButton } from "../components/ui/Loading";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

export const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(data.email);
      setEmail(data.email);
      setEmailSent(true);

      toast.success("📧 Password reset email sent! Check your inbox.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
    } catch (error) {
      let errorMessage = "❌ Something went wrong. Please try again.";

      if (error.response?.data?.detail?.includes("not found")) {
        errorMessage =
          "📧 Email address not found. Please check and try again.";
      }

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex min-h-[600px]">
          {/* Left Side - Services Display */}
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-500 to-red-600 relative p-8 lg:p-12">
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
                  Secure Password Recovery
                </h1>
                <h2 className="text-xl lg:text-2xl font-semibold text-yellow-300">
                  Get back to your account safely
                </h2>
              </div>

              {/* Security Features */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                  <CheckCircle className="h-5 w-5 text-green-300" />
                  <span className="text-sm">Bank-grade Security</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                  <CheckCircle className="h-5 w-5 text-green-300" />
                  <span className="text-sm">Encrypted Password Reset</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                  <CheckCircle className="h-5 w-5 text-green-300" />
                  <span className="text-sm">24/7 Support Available</span>
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
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                    {emailSent ? (
                      <CheckCircle className="h-8 w-8 text-white" />
                    ) : (
                      <Mail className="h-8 w-8 text-white" />
                    )}
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                    {emailSent ? "Email Sent!" : "Reset Password"}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {emailSent
                      ? `Password reset link has been sent to ${email}. Check your inbox and click the link to reset your password.`
                      : "Enter your email address and we'll send you a password reset link"}
                  </p>
                </div>

                {!emailSent ? (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          {...register("email")}
                          type="email"
                          id="email"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-200 text-gray-800 placeholder-gray-500"
                          placeholder="Enter your email address"
                        />
                      </div>
                      {errors.email && (
                        <div className="mt-1 flex items-center text-red-600 text-sm">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          <p>{errors.email.message}</p>
                        </div>
                      )}
                    </div>

                    <LoadingButton
                      type="submit"
                      loading={isLoading}
                      loadingText="Sending Reset Link..."
                      className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-red-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center"
                      disabled={isLoading}
                    >
                      <Send className="h-5 w-5 mr-2" />
                      Send Reset Link
                    </LoadingButton>
                  </form>
                ) : (
                  <div className="space-y-5">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <p className="text-sm text-green-700">
                          Reset link sent successfully!
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setEmailSent(false);
                        setEmail("");
                      }}
                      className="w-full py-3 px-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200"
                    >
                      Send Another Reset Link
                    </button>
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
