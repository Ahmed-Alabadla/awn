import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import {
  ChangePasswordFormValues,
  ForgotPasswordValues,
  LoginValues,
  OrganizationRegisterValues,
  ProfileFormValues,
  ResetPasswordValues,
  UserRegisterValues,
} from "@/lib/validation";
import { ApiError } from "@/lib/types";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check authentication status
  const { data: isAuthenticated, isLoading: isAuthLoading } = useQuery({
    queryKey: ["auth", "status"],
    queryFn: () => authService.isAuthenticated(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    initialData: () => {
      // Immediately check authentication status from cookies
      return authService.isAuthenticated();
    },
  });

  // Get current user data
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["auth", "user"],
    queryFn: () => authService.getCurrentUser(),
    enabled: !!isAuthenticated,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry if it's a 401 error (unauthorized)
      if ((error as ApiError)?.response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginValues) => authService.login(credentials),
    onSuccess: () => {
      // Invalidate auth queries to update authentication status
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      toast.success("Login successful!");
      
      // Get redirect URL from search params or default to home
      const redirectUrl = searchParams?.get('redirect') || '/';
      router.push(redirectUrl);
    },
    onError: (error: ApiError) => {
      const errorStatusText = error?.response?.statusText || "Unknown error";
      const errorMessage =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Login failed. Please try again.";
      toast.error(errorStatusText, {
        description: errorMessage,
      });
    },
  });

  // User register mutation
  const userRegisterMutation = useMutation({
    mutationFn: (data: UserRegisterValues) => authService.userRegister(data),
    onSuccess: () => {
      toast.success("Registration successful!", {
        description: "You can now log in with your credentials.",
      });
      router.push("/login");
    },
    onError: (error: ApiError) => {
      const errorStatusText = error?.response?.statusText || "Unknown error";

      const errors = error?.response?.data?.errors;
      const firstErrorMessage =
        errors && Object.keys(errors).length > 0
          ? errors[Object.keys(errors)[0]][0] // first field’s first error
          : null;

      const errorMessage =
        error?.response?.data?.detail ||
        firstErrorMessage ||
        error?.response?.data?.message ||
        "Registration failed. Please try again.";

      toast.error(errorStatusText, {
        description: errorMessage,
      });
    },
  });

  // Organization register mutation
  const organizationRegisterMutation = useMutation({
    mutationFn: (data: OrganizationRegisterValues) =>
      authService.organizationRegister(data),
    onSuccess: () => {
      toast.success("Organization registration successful!", {
        description: "You can now log in with your credentials.",
      });
      router.push("/login");
    },
    onError: (error: ApiError) => {
      const errorStatusText = error?.response?.statusText || "Unknown error";

      const errors = error?.response?.data?.errors;
      const firstErrorMessage =
        errors && Object.keys(errors).length > 0
          ? errors[Object.keys(errors)[0]][0] // first field’s first error
          : null;

      const errorMessage =
        error?.response?.data?.detail ||
        firstErrorMessage ||
        error?.response?.data?.message ||
        "Registration failed. Please try again.";

      toast.error(errorStatusText, {
        description: errorMessage,
      });
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordFormValues) =>
      authService.changePassword(data),
    onSuccess: () => {
      toast.success("Password changed successfully!");
    },
    onError: (error: ApiError) => {
      console.log(error);

      const errorStatusText = error?.response?.statusText || "Unknown error";

      const errorData = error?.response?.data;

      let errorMessage: string | null = null;

      if (errorData) {
        // case: validation errors are key -> array
        if (errorData.errors) {
          const firstKey = Object.keys(errorData.errors)[0];
          if (firstKey) {
            errorMessage = errorData.errors[firstKey][0]; // first error message
          }
        }

        // fallback to `message` or `detail`
        if (!errorMessage) {
          errorMessage = errorData.message || errorData.detail || null;
        }
      }

      toast.error(errorStatusText, {
        description: errorMessage || "Something went wrong. Please try again.",
      });
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: ProfileFormValues) => authService.updateProfile(data),
    onSuccess: (updatedUser) => {
      // Update the user data in the cache
      queryClient.setQueryData(["auth", "user"], updatedUser);
      toast.success("Profile updated successfully!");
    },
    onError: (error: ApiError) => {
      const errorStatusText = error?.response?.statusText || "Unknown error";

      const errorData = error?.response?.data;
      let errorMessage: string | null = null;

      if (errorData) {
        // case: validation errors are key -> array
        if (errorData.errors) {
          const firstKey = Object.keys(errorData.errors)[0];
          if (firstKey) {
            errorMessage = errorData.errors[firstKey][0]; // first error message
          }
        }

        // fallback to `message` or `detail`
        if (!errorMessage) {
          errorMessage = errorData.message || errorData.detail || null;
        }
      }

      toast.error(errorStatusText, {
        description:
          errorMessage || "Failed to update profile. Please try again.",
      });
    },
  });

  // Forgot password
  const forgotPasswordMutation = useMutation({
    mutationFn: (data: ForgotPasswordValues) =>
      authService.forgotPassword(data),
    onSuccess: () => {
      toast.success("Password reset link sent successfully!");
      router.push("/login");
    },
    onError: (error: ApiError) => {
      const errorStatusText = error?.response?.statusText || "Unknown error";

      const errors = error?.response?.data?.errors;
      const firstErrorMessage =
        errors && Object.keys(errors).length > 0
          ? errors[Object.keys(errors)[0]][0] // first field’s first error
          : null;

      const errorMessage =
        error?.response?.data?.detail ||
        firstErrorMessage ||
        error?.response?.data?.message ||
        "Forgot password request failed. Please try again.";

      toast.error(errorStatusText, {
        description: errorMessage,
      });
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: ({
      userId,
      token,
      data,
    }: {
      userId: string;
      token: string;
      data: ResetPasswordValues;
    }) => authService.resetPassword(userId, token, data),
    onSuccess: () => {
      toast.success("Password reset successfully!");
      router.push("/login");
    },
    onError: (error: ApiError) => {
      const errorStatusText = error?.response?.statusText || "Unknown error";

      const errors = error?.response?.data?.errors;
      const firstErrorMessage =
        errors && Object.keys(errors).length > 0
          ? errors[Object.keys(errors)[0]][0] // first field’s first error
          : null;

      const errorMessage =
        error?.response?.data?.detail ||
        firstErrorMessage ||
        error?.response?.data?.message ||
        "Password reset failed. Please try again.";

      toast.error(errorStatusText, {
        description: errorMessage,
      });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Set authentication status to false immediately
      queryClient.setQueryData(["auth", "status"], false);
      // Clear user data
      queryClient.removeQueries({ queryKey: ["auth", "user"] });
      // Invalidate auth queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      toast.success("Logged out successfully");
      router.push("/");
    },
    onError: () => {
      // Even if logout request fails, clear local tokens and redirect
      queryClient.setQueryData(["auth", "status"], false);
      queryClient.removeQueries({ queryKey: ["auth", "user"] });
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      toast.success("Logged out successfully");
      router.push("/");
    },
  });

  // Get tokens
  const getTokens = () => authService.getTokens();

  // Return all hooks and state
  return {
    // State
    isAuthenticated: !!isAuthenticated,
    isLoading: isAuthLoading || isUserLoading,
    user,

    // Actions
    login: loginMutation.mutate,
    userRegister: userRegisterMutation.mutate,
    organizationRegister: organizationRegisterMutation.mutate,
    changePassword: changePasswordMutation.mutate,
    updateProfile: updateProfileMutation.mutate,
    forgotPassword: forgotPasswordMutation.mutate,
    resetPassword: resetPasswordMutation.mutate,
    logout: logoutMutation.mutate,
    getTokens,

    // Mutation states
    isLoginPending: loginMutation.isPending,
    isUserRegisterPending: userRegisterMutation.isPending,
    isOrganizationRegisterPending: organizationRegisterMutation.isPending,
    isChangePasswordPending: changePasswordMutation.isPending,
    isUpdateProfilePending: updateProfileMutation.isPending,
    isForgotPasswordPending: forgotPasswordMutation.isPending,
    isResetPasswordPending: resetPasswordMutation.isPending,
    isLogoutPending: logoutMutation.isPending,
    loginError: loginMutation.error,
  };
};
