import HeroSection from "@/components/features/landing/HeroSection";
import TrustBadges from "@/components/features/landing/TrustBadges";
import HowItWorks from "@/components/features/landing/HowItWorks";
import FeaturedProviders from "@/components/features/landing/FeaturedProviders";
import Testimonials from "@/components/features/landing/Testimonials";
import CTASection from "@/components/features/landing/CTASection";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <TrustBadges />
      <HowItWorks />
      <FeaturedProviders />
      <Testimonials />
      <CTASection />
    </>
  );
}
