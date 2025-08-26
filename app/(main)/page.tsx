import AboutSection from "@/components/shared/AboutSection";
import AnnouncementsSection from "@/components/shared/AnnouncementsSection";
import HeroSection from "@/components/shared/HeroSection";


export default function Home() {
  return (
    <div>
      <HeroSection />
      <AnnouncementsSection />
      <AboutSection/>
    </div>
  );
}
