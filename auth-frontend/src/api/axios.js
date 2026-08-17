import axios from "axios";
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from "./tokenManager";
import { triggerLogout } from "./authEvents";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Refresh state
let isRefreshing = false;
let refreshSubscribers = [];

// Add requests waiting for a new access token
const subscribeToTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

// Notify all waiting requests
const onTokenRefreshed = (newAccessToken) => {
  refreshSubscribers.forEach((callback) => {
    callback(newAccessToken);
  });

  refreshSubscribers = [];
};

// Reject all waiting requests if refresh fails
const onRefreshFailed = (error) => {
  refreshSubscribers.forEach((callback) => {
    callback(null, error);
  });

  refreshSubscribers = [];
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token && !config.url?.includes("/auth/refresh")) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const originalRequest = error.config;
    // Only handle 401 responses
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // If another request is already refreshing,
    // wait for that refresh instead of starting another.
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        subscribeToTokenRefresh((newAccessToken, refreshError) => {
          if (refreshError || !newAccessToken) {
            reject(refreshError || error);
            return;
          }
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          resolve(api(originalRequest));
        });
      });
    }

    // This request becomes responsible for refreshing.
    isRefreshing = true;

    try {
      const response = await api.post("/auth/refresh");
      const newAccessToken = response.data.data.accessToken;
      setAccessToken(newAccessToken);

      // Tell all waiting requests that
      // a new token is available.
      onTokenRefreshed(newAccessToken);

      // Retry the original request.
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      // Refresh token is invalid,
      // expired, revoked, etc.

      clearAccessToken();
      triggerLogout();
      onRefreshFailed(refreshError);

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
