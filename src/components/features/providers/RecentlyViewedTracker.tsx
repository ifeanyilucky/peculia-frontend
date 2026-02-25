"use client";

import { useEffect, type ReactNode } from "react";
import { useRecentlyViewed, RecentlyViewedProvider } from "@/hooks/useRecentlyViewed";

interface RecentlyViewedTrackerProps {
  children: ReactNode;
  provider: {
    _id: string;
    name?: string;
    image?: string;
    category?: string;
    rating?: number;
    [key: string]: unknown;
  };
}

export default function RecentlyViewedTracker({
  children,
  provider,
}: RecentlyViewedTrackerProps) {
  const { addRecentlyViewed } = useRecentlyViewed();

  useEffect(() => {
    const providerData: RecentlyViewedProvider = {
      _id: provider._id,
      name: provider.name,
      image: provider.image,
      rating: provider.rating,
      viewedAt: Date.now(),
    };

    addRecentlyViewed(providerData);
  }, [provider._id, addRecentlyViewed, provider]);

  return <>{children}</>;
}
