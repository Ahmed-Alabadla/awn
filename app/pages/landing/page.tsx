import AboutSection from "@/components/shared/AboutSection";
import FeaturedAnnouncements from "@/components/shared/FeaturedAnnouncements";
import HeroSection from "@/components/shared/HeroSection";

export default function LandingPage() {
    return (
        <div>
            <HeroSection />
            <FeaturedAnnouncements />
            <AboutSection />
        </div>
    );
}
