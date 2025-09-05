"use client";
import AnnouncementPage from "./announcements/AnnouncementPage";
import LandingPage from "./landing/LandingPage";
import { useAuth } from "@/hooks/useAuth";

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated ? <AnnouncementPage /> : <LandingPage />}
      {/* {role === "user" && <AnnouncementPage />}
      {role === "organization" && "Organization Page"}
      {role === "admin" && "Admin Page"} */}
    </>
  );
}
