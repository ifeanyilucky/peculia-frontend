"use client";

import { useSearchParams } from "next/navigation";
import ProviderFilters from "@/components/features/providers/ProviderFilters";
import ProviderGrid from "@/components/features/providers/ProviderGrid";
import { DiscoveryFilters } from "@/types/provider.types";

export default function ExploreClient() {
  const searchParams = useSearchParams();

  const filters: DiscoveryFilters = {
    specialty: searchParams.get("specialty") || undefined,
    city: searchParams.get("city") || undefined,
    minRating: searchParams.get("minRating")
      ? Number(searchParams.get("minRating"))
      : undefined,
    isVerified: searchParams.get("isVerified") === "true" || undefined,
    search: searchParams.get("search") || undefined,
    sort: searchParams.get("sort") || "rating",
  };

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <div className="w-full lg:w-80 lg:shrink-0">
        <ProviderFilters />
      </div>
      <div className="flex-1">
        <div className="mb-8">
          <h1 className="font-outfit text-3xl font-bold text-slate-900">
            Discovery
          </h1>
          <p className="mt-2 text-slate-600 tracking-tight">
            Browse top beauty and wellness experts near you.
          </p>
        </div>
        <ProviderGrid filters={filters} />
      </div>
    </div>
  );
}
