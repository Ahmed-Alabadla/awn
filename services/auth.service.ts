import api from "@/lib/axios";
import {
  ChangePasswordFormValues,
  ForgotPasswordValues,
  LoginValues,
  OrganizationRegisterValues,
  ProfileFormValues,
  ResetPasswordValues,
  UserRegisterValues,
} from "@/lib/validation";
import { AuthResponse, User } from "@/lib/types";
import { setCookie, getCookie, deleteCookie } from "cookies-next";

export const authService = {
  // Login
  login: async (credentials: LoginValues): Promise<AuthResponse> => {
    const response = await api.post("/awn/api/auth/login/", credentials);
    const { access, refresh } = response.data;

    // Store tokens in cookies
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

    return response.data;
  },

  // User register
  userRegister: async (data: UserRegisterValues): Promise<AuthResponse> => {
    const response = await api.post("/awn/api/auth/signup/user/", data);
    return response.data;
  },

  // Organization register
  organizationRegister: async (
    data: OrganizationRegisterValues
  ): Promise<AuthResponse> => {
    const response = await api.post("/awn/api/auth/signup/organization/", data);
    return response.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get("/awn/api/auth/profile");
    return response.data.data;
  },

  // Change password
  changePassword: async (data: ChangePasswordFormValues) => {
    const response = await api.post("/awn/api/auth/change-password/", data);
    return response.data;
  },

  // Forgot password
  forgotPassword: async (data: ForgotPasswordValues) => {
    const response = await api.post("/awn/api/auth/forgot-password/", data);
    return response.data;
  },

  // Reset password
  resetPassword: async (
    userId: string,
    token: string,
    data: ResetPasswordValues
  ) => {
    const response = await api.post("/awn/api/auth/reset-password/", {
      user_id: userId,
      token,
      password: data.password,
      password_confirm: data.password_confirm,
    });
    return response.data;
  },

  // Update profile
  updateProfile: async (data: ProfileFormValues): Promise<User> => {
    // Check if profile_image is a File to determine if we need FormData
    const hasFile = data.profile_image instanceof File;

    if (hasFile) {
      // Use FormData for file upload
      const formData = new FormData();

      // Add other fields to FormData
      if (data.name) formData.append("name", data.name);
      if (data.phone) formData.append("phone", data.phone);
      if (data.profile_image)
        formData.append("profile_image", data.profile_image);

      const response = await api.put(
        "/awn/api/auth/update-profile/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.data;
    } else {
      // Use regular JSON for other data
      const response = await api.put("/awn/api/auth/update-profile/", data);
      return response.data.data;
    }
  },

  // Logout
  logout: async () => {
    const { refreshToken } = authService.getTokens();

    try {
      // Send logout request to server with refresh token
      if (refreshToken) {
        await api.post("/awn/api/logout/", {
          refresh: refreshToken,
        });
      }
    } catch (error) {
      // Log the error but continue with client-side logout
      console.error("Logout request failed:", error);
    } finally {
      // Always clear cookies regardless of server response
      deleteCookie("access_token");
      deleteCookie("refresh_token");
    }
  },

  // Get tokens from cookies
  getTokens: () => {
    const accessToken = getCookie("access_token");
    const refreshToken = getCookie("refresh_token");
    return { accessToken, refreshToken };
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const { accessToken, refreshToken } = authService.getTokens();

    // If no tokens exist, user is not authenticated
    if (!accessToken && !refreshToken) {
      return false;
    }

    // If we have at least an access token, consider user authenticated
    // The axios interceptor will handle token refresh if needed
    return !!accessToken || !!refreshToken;
  },
};
