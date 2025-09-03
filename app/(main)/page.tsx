import AnnouncementPage from "../pages/announcements/page";
import LandingPage from "../pages/landing/page";



export default function Home() {
  // this role can later come from auth, context, or API
  const role: string = "user"; // "visitor" | "user" | "admin" | "organization"

  return (
    <>
      {role === "visitor" && <LandingPage />}
      {role === "user" && <AnnouncementPage />}
      {role === "organization" && "Organization Page"}
      {role === "admin" && "Admin Page"}
    </>
  );
}
