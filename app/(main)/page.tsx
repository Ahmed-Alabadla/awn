import HomePage from "@/components/pages/HomePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
};

export default function Home() {
  return <HomePage />;
}
