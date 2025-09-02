import api from "@/lib/axios";
import { LoginValues } from "@/lib/validation";
import { AuthResponse, User } from "@/lib/types";
import { setCookie, getCookie, deleteCookie } from 'cookies-next';

export const authService = {
  // Login
  login: async (credentials: LoginValues): Promise<AuthResponse> => {
    const response = await api.post('/awn/api/auth/login/', credentials);
    const { access, refresh } = response.data;
    
    // Store tokens in cookies
    setCookie('access_token', access, {
      maxAge: 60 * 60, // 1 hour for access token
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    
    setCookie('refresh_token', refresh, {
      maxAge: 7 * 24 * 60 * 60, // 7 days for refresh token
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    
    return response.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/awn/api/auth/profile');
    return response.data;
  },

  // Logout
  logout: () => {
    deleteCookie('access_token');
    deleteCookie('refresh_token');
  },

  // Get tokens from cookies
  getTokens: () => {
    const accessToken = getCookie('access_token');
    const refreshToken = getCookie('refresh_token');
    return { accessToken, refreshToken };
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const { accessToken } = authService.getTokens();
    return !!accessToken;
  },
}