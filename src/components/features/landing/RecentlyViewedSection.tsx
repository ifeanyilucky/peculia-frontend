"use client";

import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import ProviderCarousel from "./ProviderCarousel";
import type { Provider } from "@/types/provider.types";

export default function RecentlyViewedSection() {
  const { recentlyViewed, isLoaded } = useRecentlyViewed();

  if (!isLoaded || recentlyViewed.length === 0) return null;

  const providers: Provider[] = recentlyViewed.map((p) => ({
    _id: p._id,
    userId: {
      id: p._id,
      firstName: p.name?.split(" ")[0] || "",
      lastName: p.name?.split(" ").slice(1).join(" ") || "",
      avatar: p.image,
    },
    businessName: p.name || "",
    slug: "",
    specialties: [],
    portfolioImages: [],
    isVerified: false,
    rating: p.rating || 0,
    totalReviews: 0,
    totalBookings: 0,
    subscriptionTier: "free" as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  return (
    <ProviderCarousel
      providers={providers}
      title="Recently Viewed"
      description="Pick up where you left off"
    />
  );
}
