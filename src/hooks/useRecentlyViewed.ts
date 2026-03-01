"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "peculia_recently_viewed";
const MAX_RECENT = 10;

export interface RecentlyViewedProvider {
  _id: string;
  name?: string;
  image?: string;
  category?: string;
  rating?: number;
  viewedAt: number;
  [key: string]: unknown;
}

function getStoredProviders(): RecentlyViewedProvider[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function setStoredProviders(providers: RecentlyViewedProvider[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(providers));
  } catch (error) {
    console.error("Failed to save recently viewed providers:", error);
  }
}

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<
    RecentlyViewedProvider[]
  >([]);
  const [isLoaded, setIsLoaded] = useState(false);
  console.log("recentlyViewed", recentlyViewed);

  useEffect(() => {
    setRecentlyViewed(getStoredProviders());
    setIsLoaded(true);
  }, []);

  const addRecentlyViewed = useCallback((provider: RecentlyViewedProvider) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p._id !== provider._id);
      const updated = [
        { ...provider, viewedAt: Date.now() },
        ...filtered,
      ].slice(0, MAX_RECENT);

      setStoredProviders(updated);
      return updated;
    });
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewed([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const removeRecentlyViewed = useCallback((providerId: string) => {
    setRecentlyViewed((prev) => {
      const updated = prev.filter((p) => p._id !== providerId);
      setStoredProviders(updated);
      return updated;
    });
  }, []);

  return {
    recentlyViewed,
    isLoaded,
    addRecentlyViewed,
    clearRecentlyViewed,
    removeRecentlyViewed,
  };
}
