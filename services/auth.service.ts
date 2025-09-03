import api from "@/lib/axios";
import {
  ChangePasswordFormValues,
  LoginValues,
  OrganizationRegisterValues,
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
    const { accessToken } = authService.getTokens();
    return !!accessToken;
  },
};
