import axios from "axios";

// In production always enforce HTTPS regardless of what the env variable says
let BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
if (import.meta.env.PROD && BASE_URL.startsWith("http://")) {
  BASE_URL = BASE_URL.replace("http://", "https://");
}

const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Clear auth and redirect to login
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/signin";
      return Promise.reject(new Error("Session expired. Please login again."));
    }

    return Promise.reject(error);
  }
);

export default apiClient;
