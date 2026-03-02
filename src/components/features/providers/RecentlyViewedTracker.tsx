"use client";

import { useEffect, type ReactNode } from "react";
import {
  useRecentlyViewed,
  RecentlyViewedProvider,
} from "@/hooks/useRecentlyViewed";

interface RecentlyViewedTrackerProps {
  children: ReactNode;
  provider: {
    _id: string;
    name?: string;
    image?: string;
    category?: string;
    rating?: number;
    slug?: string;
    isDiscoverable?: boolean;
    location?: {
      city?: string;
      state?: string;
      address?: string;
    };
    [key: string]: unknown;
  };
}

export default function RecentlyViewedTracker({
  children,
  provider,
}: RecentlyViewedTrackerProps) {
  const { addRecentlyViewed } = useRecentlyViewed();

  useEffect(() => {
    if (provider.isDiscoverable === false) return;

    const providerData: RecentlyViewedProvider = {
      _id: provider._id,
      name: provider.name,
      image: provider.image,
      rating: provider.rating,
      slug: provider.slug,
      isDiscoverable: provider.isDiscoverable,
      location: provider.location,
      viewedAt: Date.now(),
    };

    addRecentlyViewed(providerData);
  }, [provider._id, addRecentlyViewed, provider, provider.isDiscoverable]);

  return <>{children}</>;
}
