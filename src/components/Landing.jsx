import { useEffect } from "react";
import {
  getTokenFromUrl,
  setAccessToken,
  cleanUrlFromToken,
} from "../utils/auth";

const Landing = () => {
  useEffect(() => {
    // Check for token in URL on component mount
    const token = getTokenFromUrl();
    if (token) {
      setAccessToken(token);
      cleanUrlFromToken();
      // Redirect to main app after setting token
      window.location.href = "/";
    } else {
      // No token found, redirect to login
      window.location.href = import.meta.env.VITE_API_SIGNIN_URL;
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">
          Setting up your session...
        </p>
      </div>
    </div>
  );
};

export default Landing;
