"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  fallbackComponent?: React.ReactNode;
}

export default function RouteGuard({
  children,
  requireAuth = false,
  redirectTo,
  fallbackComponent,
}: RouteGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // If authentication is required but user is not authenticated
      if (requireAuth && !isAuthenticated) {
        const defaultRedirect = "/login";
        router.push(redirectTo || defaultRedirect);
        return;
      }

      // If authentication is NOT required (guest only) but user IS authenticated
      if (!requireAuth && isAuthenticated) {
        const defaultRedirect = "/";
        router.push(redirectTo || defaultRedirect);
        return;
      }
    }
  }, [isAuthenticated, isLoading, router, redirectTo, requireAuth]);

  // Show loading state while checking authentication
  if (isLoading) {
    return fallbackComponent || <LoadingSpinner />;
  }

  // Check conditions for rendering children
  const shouldRenderChildren = requireAuth ? isAuthenticated : !isAuthenticated;

  if (!shouldRenderChildren) {
    return null;
  }

  return <>{children}</>;
}
