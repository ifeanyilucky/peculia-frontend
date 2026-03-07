import { Suspense } from "react";
import type { Metadata } from "next";
import ExploreClient from "./ExploreClient";

export const metadata: Metadata = {
  title: "Explore Professionals | Glamyad",
  description:
    "Browse and discover the best beauty and wellness experts in your area. Filter by specialty, rating, and location.",
};

/**
 * ExplorePage — thin server component shell.
 * All client-side state and UI live in ExploreClient.
 * The layout.tsx wrapper provides the <main> tag and sticky header.
 */
export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-primary border-t-transparent" />
          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
            Loading discovery…
          </p>
        </div>
      }
    >
      <ExploreClient />
    </Suspense>
  );
}
