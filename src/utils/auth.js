import { authApi } from "../services/authService";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_DATA_KEY = "userData";

export const getAccessToken = () => sessionStorage.getItem(ACCESS_TOKEN_KEY);
export const setAccessToken = (token) =>
  token && sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
export const removeAccessToken = () => {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(USER_DATA_KEY);
};
export const getUserData = () => {
  const data = sessionStorage.getItem(USER_DATA_KEY);
  return data ? JSON.parse(data) : null;
};
export const setUserData = (data) =>
  data && sessionStorage.setItem(USER_DATA_KEY, JSON.stringify(data));

export const getTokenFromUrl = () =>
  new URLSearchParams(window.location.search).get("token");
export const cleanUrlFromToken = () => {
  const url = new URL(window.location);
  url.searchParams.delete("token");
  window.history.replaceState({}, document.title, url.toString());
};

export const isAuthenticated = () => Boolean(getAccessToken());

/**
 * Fetch current user from backend using /auth/me
 */
export const fetchCurrentUser = async () => {
  try {
    const userData = await authApi.getCurrentUser(); // make sure authApi includes token in headers
    setUserData(userData);
    return userData;
  } catch (error) {
    console.error("❌ Failed to fetch user from backend:", error);
    removeAccessToken();
    return null;
  }
};

/**
 * Initialize authentication on app load
 */
export const initializeAuth = async () => {
  let token = getTokenFromUrl();

  if (token) {
    setAccessToken(token);
    cleanUrlFromToken();
  } else {
    token = getAccessToken();
  }

  if (!token) {
    console.log("❌ No token found");
    return null;
  }

  // Always hit backend to get user data
  const userData = await fetchCurrentUser();
  if (!userData) return null;

  return { token, userData };
};

/**
 * Logout user
 */
export const logout = async () => {
  try {
    await authApi.logout(); // hit backend logout
  } catch (err) {
    console.warn(
      "⚠️ Backend logout failed, clearing client storage anyway:",
      err.message
    );
  }
  sessionStorage.clear();
  localStorage.clear();
  redirectToLogin();
};

/**
 * Refresh token
 */
export const refreshAccessToken = async () => {
  try {
    const res = await authApi.refreshToken();
    if (res.access_token) {
      setAccessToken(res.access_token);
      if (res.refresh_token)
        sessionStorage.setItem(REFRESH_TOKEN_KEY, res.refresh_token);
      return true;
    }
    throw new Error("No access token in refresh response");
  } catch (err) {
    console.error("❌ Token refresh failed:", err);
    removeAccessToken();
    return false;
  }
};

/** * Redirect to login if not authenticated */
export const redirectToLogin = () => {
  console.log("🔐 No valid token found, redirecting to login");
  window.location.href = import.meta.env.VITE_API_SIGNIN_URL;
};
git 