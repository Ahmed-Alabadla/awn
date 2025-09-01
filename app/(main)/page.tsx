import AboutSection from "@/components/shared/AboutSection";
import FeaturedAnnouncements from "@/components/shared/FeaturedAnnouncements";
import HeroSection from "@/components/shared/HeroSection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <FeaturedAnnouncements />
      <AboutSection />
    </div>
  );
}
