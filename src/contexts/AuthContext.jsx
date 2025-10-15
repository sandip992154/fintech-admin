import { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";
import { toast } from "react-toastify";

export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [pendingIdentifier, setPendingIdentifier] = useState(null);

  // Enhanced token refresh timer with retry logic
  useEffect(() => {
    let refreshTimer;
    let retryCount = 0;
    const maxRetries = 3;

    const refreshTokenWithRetry = async () => {
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
          console.log("No refresh token available");
          return;
        }

        console.log("Attempting token refresh...");
        const response = await authService.refreshToken(refreshToken);
        if (response.access_token) {
          localStorage.setItem("token", response.access_token);
          // Update refresh token if a new one is provided
          if (response.refresh_token) {
            localStorage.setItem("refresh_token", response.refresh_token);
          }
          retryCount = 0; // Reset retry count on success
          console.log("Token refreshed successfully");
        }
      } catch (error) {
        console.error("Token refresh failed:", error);
        retryCount++;

        if (retryCount >= maxRetries) {
          console.error("Max refresh retries reached, logging out");
          toast.warning("Session expired. Please log in again.", {
            position: "top-right",
            autoClose: 5000,
          });
          handleLogout();
        } else {
          console.log(`Retrying token refresh (${retryCount}/${maxRetries})`);
          // Retry after a delay
          setTimeout(refreshTokenWithRetry, 5000 * retryCount);
        }
      }
    };

    if (isAuthenticated) {
      const refreshInterval = 24 * 60 * 60 * 1000; // 24 hours (refresh once a day)
      refreshTimer = setInterval(refreshTokenWithRetry, refreshInterval);
    }

    return () => clearInterval(refreshTimer);
  }, [isAuthenticated]);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const userData = await authService.getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      console.log("Login response:", response); // Debug log

      // Get username from credentials
      const username =
        credentials instanceof FormData
          ? credentials.get("username")
          : credentials.username;

      // If we get an OTP sent message, set up the OTP verification state
      if (response?.message?.includes("OTP sent")) {
        setPendingIdentifier(username);
        setIsOtpSent(true);
      }

      return response;
    } catch (error) {
      console.error("Login error:", error); // Debug log

      // Check if the error message indicates OTP was sent
      if (error.message?.includes("OTP sent")) {
        const username =
          credentials instanceof FormData
            ? credentials.get("username")
            : credentials.username;
        setPendingIdentifier(username);
        setIsOtpSent(true);
        return { message: error.message };
      }

      // Otherwise rethrow the error
      throw error;
    }
  };

  const verifyOtp = async (otp) => {
    try {
      if (!pendingIdentifier) {
        throw new Error("No pending login request");
      }

      const response = await authService.verifyOtp({
        identifier: pendingIdentifier,
        otp: otp,
      });

      if (response.access_token) {
        localStorage.setItem("token", response.access_token);
        if (response.refresh_token) {
          localStorage.setItem("refresh_token", response.refresh_token);
        }

        // Store login timestamp for session management
        localStorage.setItem("login_timestamp", Date.now().toString());

        // Get user profile
        const userData = await authService.getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
        setIsOtpSent(false);
        setPendingIdentifier(null);

        // Success toast with user info
        toast.success(`🎉 Welcome back, ${userData.name || userData.email}!`, {
          position: "top-right",
          autoClose: 5000,
        });

        // Return success to let component handle navigation
        return { success: true, user: userData };
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      throw error;
    }
  };

  const handleLogout = (showToast = true) => {
    // Clear all auth-related data
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setIsOtpSent(false);
    setPendingIdentifier(null);

    // Clear any pending toasts
    toast.dismiss();

    if (showToast) {
      toast.info("👋 You have been logged out successfully.", {
        position: "top-right",
        autoClose: 3000,
      });
    }

    // Return success to let component handle navigation
    return { success: true };
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await authService.changePassword(currentPassword, newPassword);
      toast.success("Password changed successfully!");
    } catch (error) {
      toast.error(
        error.message || "Failed to change password. Please try again."
      );
      throw error;
    }
  };

  const forgotPassword = async (email) => {
    try {
      await authService.forgotPassword(email);
      toast.success("Password reset instructions sent to your email!");
    } catch (error) {
      toast.error(
        error.message || "Failed to process request. Please try again."
      );
      throw error;
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      await authService.resetPassword(token, newPassword);
      toast.success(
        "Password reset successful! Please login with your new password."
      );
      // Return success to let component handle navigation
      return { success: true };
    } catch (error) {
      toast.error(
        error.message || "Failed to reset password. Please try again."
      );
      throw error;
    }
  };

  // Enhanced session activity monitoring with warnings
  useEffect(() => {
    let inactivityTimer;
    let warningTimer;
    const inactivityPeriod = 30 * 60 * 1000; // 30 minutes
    const warningPeriod = 25 * 60 * 1000; // 25 minutes (5 min warning)

    const showInactivityWarning = () => {
      toast.warning(
        "⚠️ You'll be logged out in 5 minutes due to inactivity. Move your mouse to stay logged in.",
        {
          position: "top-center",
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          toastId: "inactivity-warning", // Prevent duplicate toasts
        }
      );
    };

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      clearTimeout(warningTimer);

      // Set warning timer
      warningTimer = setTimeout(showInactivityWarning, warningPeriod);

      // Set logout timer
      inactivityTimer = setTimeout(() => {
        handleLogout();
        toast.error(
          "🔐 Session expired due to inactivity. Please log in again.",
          {
            position: "top-center",
            autoClose: 8000,
          }
        );
      }, inactivityPeriod);
    };

    if (isAuthenticated) {
      // Monitor user activity
      const events = [
        "mousedown",
        "keydown",
        "scroll",
        "touchstart",
        "mousemove",
        "click",
      ];

      events.forEach((event) =>
        document.addEventListener(event, resetTimer, true)
      );
      resetTimer();

      return () => {
        events.forEach((event) =>
          document.removeEventListener(event, resetTimer, true)
        );
        clearTimeout(inactivityTimer);
        clearTimeout(warningTimer);
      };
    }
  }, [isAuthenticated]);

  // Keep session alive on page visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && isAuthenticated) {
        // Check if token is still valid when user returns to tab
        checkAuth();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isAuthenticated]);

  const value = {
    user,
    loading,
    isAuthenticated,
    isOtpSent,
    setIsOtpSent,
    login,
    verifyOtp,
    logout: handleLogout,
    changePassword,
    forgotPassword,
    resetPassword,
  };

  if (loading) {
    return <div>Loading...</div>; // Or your loading component
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
