import type { Metadata } from "next";
import HeroSection from "@/components/features/landing/HeroSection";
import TrustBadges from "@/components/features/landing/TrustBadges";
import HowItWorks from "@/components/features/landing/HowItWorks";
import FeaturedProviders from "@/components/features/landing/FeaturedProviders";
import Testimonials from "@/components/features/landing/Testimonials";
import CTASection from "@/components/features/landing/CTASection";

export const metadata: Metadata = {
  title: "Peculia | Book Top Beauty & Wellness Professionals",
  description:
    "Find and book trusted local beauty and wellness professionals. From barbers to stylists, Peculia makes booking easy and secure.",
};

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
