import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import PricingSection from "@/components/PricingSection";
import DataSharingSection from "@/components/DataSharingSection";
import WebSquareSection from "@/components/WebSquareSection";
import Footer from "@/components/Footer";

export default function Landing() {
  return (
    <div className="font-sans bg-white grid-bg smooth-scroll">
      <Navigation />
      <HeroSection />
      <HowItWorksSection />
      <PricingSection />
      <DataSharingSection />
      <WebSquareSection />
      <Footer />
    </div>
  );
}
