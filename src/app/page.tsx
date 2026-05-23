import HeroSection from "@/components/HeroSection";
import EventSlider from "@/components/EventSlider";
import GallerySection from "@/components/GallerySection";
import CommunitySection from "@/components/CommunitySection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0f1a0f]">
      <HeroSection />
      <EventSlider />
      <GallerySection />
      <CommunitySection />
      <Footer />
    </main>
  );
}
