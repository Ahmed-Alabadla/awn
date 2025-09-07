import RouteGuard from "@/components/RouteGuard";
import Profile from "@/components/pages/Profile";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
};

export default function ProfilePage() {
  return (
    <RouteGuard requireAuth={true} redirectTo="/login">
      <Profile />
    </RouteGuard>
  );
}
