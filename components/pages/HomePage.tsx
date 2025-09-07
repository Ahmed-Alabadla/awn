"use client";
import AnnouncementPage from "./announcements/AnnouncementPage";
import LandingPage from "./landing/LandingPage";
import OrganizationPage from "./OrganizationPage";
import AdminPage from "./AdminPage";
import { useAuth } from "@/hooks/useAuth";

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();

  // If not authenticated, show landing page
  if (!isAuthenticated) {
    return <LandingPage />;
  }

  // If authenticated, show page based on user role
  const role = user?.role;

  return (
    <>
      {role === "user" && <AnnouncementPage />}
      {role === "organization" && <OrganizationPage />}
      {role === "admin" && <AdminPage />}
    </>
  );
}
