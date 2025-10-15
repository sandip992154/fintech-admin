import { useEffect, useState } from "react";

import {
  getTokenFromUrl,
  getAccessToken,
  getUserData,
} from "../../../utils/auth";
import { useAuth } from "../../hooks/useAuth";

const AuthDebug = () => {
  const { user, token, userRoles, userPermissions, isLoading } = useAuth();
  const [urlToken, setUrlToken] = useState(null);
  const [storedToken, setStoredToken] = useState(null);
  const [storedUserData, setStoredUserData] = useState(null);

  useEffect(() => {
    setUrlToken(getTokenFromUrl());
    setStoredToken(getAccessToken());
    setStoredUserData(getUserData());
  }, []);

  if (isLoading) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Authentication Debug</h1>
        <div className="animate-pulse">Loading authentication...</div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">🔍 Authentication Debug Panel</h1>

      {/* URL Information */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">📍 URL Information</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Current URL:</strong>
            <br />
            <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs break-all">
              {window.location.href}
            </code>
          </div>
          <div>
            <strong>Token from URL:</strong>
            <br />
            <span
              className={`px-2 py-1 rounded text-xs ${
                urlToken
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              }`}
            >
              {urlToken || "None"}
            </span>
          </div>
        </div>
      </div>

      {/* Storage Information */}
      <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">💾 Storage Information</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Stored Token:</strong>
            <br />
            <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs break-all">
              {storedToken || "None"}
            </code>
          </div>
          <div>
            <strong>Stored User Data:</strong>
            <br />
            <pre className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs whitespace-pre-wrap max-h-20 overflow-y-auto">
              {storedUserData
                ? JSON.stringify(storedUserData, null, 2)
                : "None"}
            </pre>
          </div>
        </div>
      </div>

      {/* Auth Context Information */}
      <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">
          🔐 Auth Context Information
        </h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Context Token:</strong>
            <br />
            <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs break-all">
              {token || "None"}
            </code>
          </div>
          <div>
            <strong>Context User:</strong>
            <br />
            <pre className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs whitespace-pre-wrap max-h-20 overflow-y-auto">
              {user ? JSON.stringify(user, null, 2) : "None"}
            </pre>
          </div>
        </div>
      </div>

      {/* Roles and Permissions */}
      <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">👥 Roles & Permissions</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>User Roles ({userRoles.length}):</strong>
            <div className="mt-2 space-y-1">
              {userRoles.map((role, index) => (
                <span
                  key={index}
                  className="inline-block bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs mr-1"
                >
                  {role.name || role.slug}
                </span>
              ))}
              {userRoles.length === 0 && (
                <span className="text-gray-500">No roles</span>
              )}
            </div>
          </div>
          <div>
            <strong>User Permissions ({userPermissions.length}):</strong>
            <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
              {userPermissions.map((permission, index) => (
                <span
                  key={index}
                  className="inline-block bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs mr-1 mb-1"
                >
                  {permission.name || permission.slug}
                </span>
              ))}
              {userPermissions.length === 0 && (
                <span className="text-gray-500">No permissions</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Test URLs */}
      <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">🧪 Test URLs</h2>
        <div className="space-y-2 text-sm">
          <p>
            <strong>Test with token:</strong>
          </p>
          <a
            href="?token=test-token-123456"
            className="text-blue-600 hover:underline break-all"
          >
            {window.location.origin}
            {window.location.pathname}?token=test-token-123456
          </a>

          <p className="mt-4">
            <strong>Test with different token:</strong>
          </p>
          <a
            href="?token=admin-jwt-token-example"
            className="text-blue-600 hover:underline break-all"
          >
            {window.location.origin}
            {window.location.pathname}?token=admin-jwt-token-example
          </a>
        </div>
      </div>

      {/* Environment Info */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">
          ⚙️ Environment Information
        </h2>
        <div className="text-sm space-y-2">
          <div>
            <strong>API Base URL:</strong>
            <code className="ml-2 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              {import.meta.env.VITE_API_BASE_URL ||
                "Not set (using simulated data)"}
            </code>
          </div>
          <div>
            <strong>Development Mode:</strong>
            <span
              className={`ml-2 px-2 py-1 rounded text-xs ${
                !import.meta.env.VITE_API_BASE_URL ||
                import.meta.env.VITE_API_BASE_URL === "https://api.mydomain.com"
                  ? "bg-green-100 text-green-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {!import.meta.env.VITE_API_BASE_URL ||
              import.meta.env.VITE_API_BASE_URL === "https://api.mydomain.com"
                ? "ON (Simulated)"
                : "OFF (Real API)"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthDebug;
