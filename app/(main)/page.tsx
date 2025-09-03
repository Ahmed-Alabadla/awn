"use client";
import { useAuth } from "@/hooks/useAuth";
import AnnouncementPage from "../pages/announcements/page";
import LandingPage from "../pages/landing/page";

export default function Home() {
  // this role can later come from auth, context, or API
  // const role: string = "user"; // "visitor" | "user" | "admin" | "organization"

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
