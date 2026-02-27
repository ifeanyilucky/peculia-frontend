import { Suspense } from "react";
import type { Metadata } from "next";
import ExploreClient from "./ExploreClient";

export const metadata: Metadata = {
  title: "Explore Professionals",
  description:
    "Browse and discover the best beauty and wellness experts in your area. Filter by specialty, rating, and location.",
};

export default function ExplorePage() {
  return (
    <main className="mx-auto px-6 py-12">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-rose-600 border-t-transparent" />
            <p className="mt-4 text-sm font-black uppercase tracking-widest text-slate-400">
              Loading discovery...
            </p>
          </div>
        }
      >
        <ExploreClient />
      </Suspense>
    </main>
  );
}
