import type { Metadata } from "next";
import HeroSection from "@/components/features/landing/HeroSection";
import TrustBadges from "@/components/features/landing/TrustBadges";
import HowItWorks from "@/components/features/landing/HowItWorks";
import ProviderCarousel from "@/components/features/landing/ProviderCarousel";
import RecentlyViewedSection from "@/components/features/landing/RecentlyViewedSection";
import Testimonials from "@/components/features/landing/Testimonials";
import CTASection from "@/components/features/landing/CTASection";
import { providerService } from "@/services/provider.service";

export const metadata: Metadata = {
  title: "Glamyad | Book Top Beauty & Wellness Professionals Near You",
  description:
    "The easiest way to find and book trusted stylists, barbers, and wellness experts near you. Secure your next appointment in seconds with Glamyad.",
};

async function getFeaturedProviders() {
  try {
    const data = await providerService.discoverProviders({
      limit: 6,
      sort: "rating",
    });
    return data.results;
  } catch (error) {
    console.error("Failed to fetch featured providers:", error);
    return [];
  }
}

export default async function LandingPage() {
  const providers = await getFeaturedProviders();

  return (
    <>
      <HeroSection />
      <TrustBadges />
      <HowItWorks />
      <ProviderCarousel
        providers={providers}
        title="Featured Professionals"
        description="Top-rated experts handpicked for quality and reliability."
        href="/explore"
        hrefLabel="View All Professionals"
      />
      <RecentlyViewedSection />
      <Testimonials />
      <CTASection />
    </>
  );
}
