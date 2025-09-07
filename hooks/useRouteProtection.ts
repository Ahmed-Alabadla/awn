import { useAuth } from "./useAuth";
import { useRouter, usePathname } from "next/navigation";
import { isProtectedRoute, isGuestOnlyRoute } from "@/lib/route-protection";

/**
 * Hook that provides authentication state and route protection utilities
 */
export const useRouteProtection = () => {
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const currentRouteRequiresAuth = isProtectedRoute(pathname);
  const currentRouteIsGuestOnly = isGuestOnlyRoute(pathname);

  /**
   * Navigate to a protected route with authentication check
   */
  const navigateToProtectedRoute = (route: string) => {
    if (!auth.isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(route)}`);
    } else {
      router.push(route);
    }
  };

  /**
   * Check if user can access a specific route
   */
  const canAccessRoute = (route: string): boolean => {
    if (isProtectedRoute(route)) {
      return auth.isAuthenticated;
    }
    if (isGuestOnlyRoute(route)) {
      return !auth.isAuthenticated;
    }
    return true; // Public route
  };

  return {
    ...auth,
    currentRouteRequiresAuth,
    currentRouteIsGuestOnly,
    navigateToProtectedRoute,
    canAccessRoute,
  };
};
