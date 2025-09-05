import AboutSection from "./AboutSection";
import HeroSection from "./HeroSection";
import FeaturedAnnouncements from "./FeaturedAnnouncements";

export default function LandingPage() {
  return (
    <div>
      <HeroSection />
      <FeaturedAnnouncements />
      <AboutSection />
    </div>
  );
}
