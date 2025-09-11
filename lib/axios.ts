import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getCookie, setCookie, deleteCookie } from "cookies-next";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || process.env.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add access token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = getCookie("access_token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getCookie("refresh_token");
        if (refreshToken) {
          const response = await axios.post(
            `${
              process.env.NEXT_PUBLIC_API_URL || process.env.API_URL
            }/awn/api/auth/refresh/`,
            { refresh: refreshToken }
          );

          const { access, refresh } = response.data;

          // Update access token in cookies
          setCookie("access_token", access, {
            maxAge: 60 * 60, // 1 hour for access token
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          });

          setCookie("refresh_token", refresh, {
            maxAge: 7 * 24 * 60 * 60, // 7 days for refresh token
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          });

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        deleteCookie("access_token");
        deleteCookie("refresh_token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
