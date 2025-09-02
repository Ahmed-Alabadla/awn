import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authService } from '@/services/auth.service';
import { LoginValues } from '@/lib/validation';
import { ApiError } from '@/lib/types';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  // Check authentication status
  const { data: isAuthenticated, isLoading: isAuthLoading } = useQuery({
    queryKey: ['auth', 'status'],
    queryFn: () => authService.isAuthenticated(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Get current user data
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['auth', 'user'],
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
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      toast.success('Login successful!');
      router.push('/'); // Redirect to home page or dashboard
    },
    onError: (error: ApiError) => {
      const errorMessage = error?.response?.data?.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => {
      authService.logout();
      return Promise.resolve();
    },
    onSuccess: () => {
      // Clear all queries on logout
      queryClient.clear();
      toast.success('Logged out successfully');
      router.push('/login');
    },
  });

  // Get tokens
  const getTokens = () => authService.getTokens();

  return {
    // State
    isAuthenticated: !!isAuthenticated,
    isLoading: isAuthLoading || isUserLoading,
    user,
    
    // Actions
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    getTokens,
    
    // Mutation states
    isLoginPending: loginMutation.isPending,
    isLogoutPending: logoutMutation.isPending,
    loginError: loginMutation.error,
  };
};