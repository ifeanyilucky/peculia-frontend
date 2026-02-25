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
    businessName: p.name || "Unknown",
    slug: p._id,
    specialties: p.category ? [p.category] : [],
    portfolioImages: p.image
      ? [{ url: p.image, publicId: "", caption: "" }]
      : [],
    isVerified: false,
    rating: p.rating || 0,
    totalReviews: 0,
    totalBookings: 0,
    subscriptionTier: "free" as const,
    location: undefined,
    bio: undefined,
    yearsOfExperience: undefined,
    startingPrice: undefined,
    createdAt: new Date(p.viewedAt).toISOString(),
    updatedAt: new Date(p.viewedAt).toISOString(),
  }));
  console.log("providers", providers);
  return (
    <ProviderCarousel
      providers={providers}
      title="Recently Viewed"
      description="Pick up where you left off"
    />
  );
}
