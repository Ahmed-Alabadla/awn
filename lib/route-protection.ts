/**
 * Route protection utilities and constants
 */

// Routes that require authentication
export const PROTECTED_ROUTES = [
  "/profile",
  "/announcements/[id]",
  "/organizations/[id]",
] as const;

// Routes that should only be accessible to non-authenticated users
export const GUEST_ONLY_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
] as const;

// Public routes that can be accessed by anyone
export const PUBLIC_ROUTES = ["/"] as const;

export type ProtectedRoute = (typeof PROTECTED_ROUTES)[number];
export type GuestOnlyRoute = (typeof GUEST_ONLY_ROUTES)[number];
export type PublicRoute = (typeof PUBLIC_ROUTES)[number];

/**
 * Check if a route requires authentication
 */
export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => {
    // Handle dynamic routes with [id] parameters
    if (route.includes("[id]")) {
      const baseRoute = route.replace("/[id]", "");
      // Check if pathname starts with base route and has an additional segment
      const regex = new RegExp(
        `^${baseRoute.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/[^/]+/?$`
      );
      return regex.test(pathname);
    }
    // Handle regular routes
    return pathname.startsWith(route);
  });
}

/**
 * Check if a route is guest-only
 */
export function isGuestOnlyRoute(pathname: string): boolean {
  return GUEST_ONLY_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Check if a route is public
 */
export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
}

/**
 * Get the appropriate redirect URL based on authentication status and current route
 */
export function getRedirectUrl(
  pathname: string,
  isAuthenticated: boolean,
  defaultAuthenticatedRedirect: string = "/",
  defaultUnauthenticatedRedirect: string = "/login"
): string | null {
  if (isProtectedRoute(pathname) && !isAuthenticated) {
    return defaultUnauthenticatedRedirect;
  }

  if (isGuestOnlyRoute(pathname) && isAuthenticated) {
    return defaultAuthenticatedRedirect;
  }

  return null; // No redirect needed
}
