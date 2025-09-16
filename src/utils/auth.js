/**
 * Authentication utilities for admin panel
 */

import { authApi } from '../services/authService';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_DATA_KEY = 'userData';

/**
 * Get refresh token from sessionStorage
 * @returns {string|null} Refresh token or null if not found
 */
export const getRefreshToken = () => {
  return sessionStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Set refresh token in sessionStorage
 * @param {string} token - Refresh token to store
 */
export const setRefreshToken = (token) => {
  if (token) {
    sessionStorage.setItem(REFRESH_TOKEN_KEY, token);
  }
};

/**
 * Get user data from sessionStorage
 * @returns {Object|null} User data or null if not found
 */
export const getUserData = () => {
  const userData = sessionStorage.getItem(USER_DATA_KEY);
  return userData ? JSON.parse(userData) : null;
};

/**
 * Set user data in sessionStorage
 * @param {Object} userData - User data to store
 */
export const setUserData = (userData) => {
  if (userData) {
    sessionStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  }
};

/**
 * Get access token from sessionStorage
 * @returns {string|null} Access token or null if not found
 */
export const getAccessToken = () => {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
};

/**
 * Set access token in sessionStorage
 * @param {string} token - Access token to store
 */
export const setAccessToken = (token) => {
  if (token) {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
    console.log('🔐 Access token stored');
  }
};

/**
 * Remove access token from sessionStorage
 */
export const removeAccessToken = () => {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(USER_DATA_KEY);
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has valid token
 */
export const isAuthenticated = () => {
  const token = getAccessToken();
  return Boolean(token);
};

/**
 * Get token from URL parameters
 * @returns {string|null} Token from URL or null if not found
 */
export const getTokenFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('token');
};

/**
 * Remove token parameter from URL without page reload
 */
export const cleanUrlFromToken = () => {
  const url = new URL(window.location);
  url.searchParams.delete('token');
  window.history.replaceState({}, document.title, url.toString());
};

/**
 * Validate token with server and get user info
 * @param {string} token - Token to validate
 * @returns {Promise<Object|null>} User data or null if invalid
 */
export const validateTokenWithServer = async (token) => {
  try {
    setAccessToken(token);
    const userData = await authApi.getCurrentUser();
    setUserData(userData);
    console.log('✅ Token validated with server');
    return userData;
  } catch (error) {
    console.error('❌ Token validation failed:', error);
    removeAccessToken();
    return null;
  }
};

/**
 * Initialize authentication on app load
 * Checks for token in URL and validates with server
 */
export const initializeAuth = async () => {
  console.log('🔄 Initializing authentication...');
  
  // First check URL for token parameter
  let token = getTokenFromUrl();
  let userData = getUserData();
  
  if (token) {
    console.log('🔐 Token found in URL:', token);
    // Store token and clean URL
    setAccessToken(token);
    cleanUrlFromToken();
  } else {
    // Check if we already have a token in sessionStorage
    token = getAccessToken();
  }
  
  if (token) {
    console.log('🔐 Token available, validating...');
    
    // For development: if no API base URL is set, simulate authentication
    if (!import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL === 'https://api.mydomain.com') {
      console.log('⚡ Development mode: Using simulated authentication');
      
      // Simulate user data for development
      const simulatedUserData = {
        id: 1,
        name: 'Admin User',
        email: 'admin@bandarupay.com',
        username: 'admin',
        roles: ['admin', 'super_admin'],
        permissions: ['manage_users', 'view_reports', 'manage_billing']
      };
      
      setUserData(simulatedUserData);
      return { token, userData: simulatedUserData };
    }
    
    // Production: Validate token with server if we don't have user data
    if (!userData) {
      try {
        userData = await authApi.getCurrentUser();
        setUserData(userData);
        console.log('✅ User data fetched from server');
      } catch (error) {
        console.error('❌ Failed to fetch user data, token may be invalid:', error);
        removeAccessToken();
        return null;
      }
    } else {
      console.log('🔐 Existing valid session found');
    }
    
    return { token, userData };
  }
  
  console.log('❌ No valid authentication found');
  return null;
};

/**
 * Logout user by calling server logout and clearing all storage
 */
export const logout = async () => {
  console.log('🚪 Starting logout process...');
  
  try {
    // Try to logout from server first (only if API is configured)
    if (import.meta.env.VITE_API_BASE_URL && import.meta.env.VITE_API_BASE_URL !== 'https://api.mydomain.com') {
      await authApi.logout();
    }
  } catch (error) {
    console.warn('⚠️ Server logout failed, proceeding with client logout:', error.message);
  }
  
  // Clear all storage regardless of server response
  sessionStorage.clear();
  localStorage.clear();
  
  console.log('✅ Logout completed, redirecting to login');
  
  // Redirect to signin page
  window.location.href = '/signin';
};

/**
 * Refresh access token using refresh token
 * @returns {Promise<boolean>} Success status
 */
export const refreshAccessToken = async () => {
  try {
    console.log('🔄 Attempting to refresh access token...');
    const response = await authApi.refreshToken();
    
    if (response.access_token) {
      setAccessToken(response.access_token);
      if (response.refresh_token) {
        setRefreshToken(response.refresh_token);
      }
      console.log('✅ Access token refreshed successfully');
      return true;
    }
    
    throw new Error('No access token in refresh response');
  } catch (error) {
    console.error('❌ Token refresh failed:', error);
    removeAccessToken();
    return false;
  }
};

/**
 * Redirect to login if not authenticated
 */
export const redirectToLogin = () => {
  console.log('🔐 No valid token found, redirecting to login');
  window.location.href = '/signin';
};
