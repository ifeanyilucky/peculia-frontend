"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { providerService } from "@/services/provider.service";
import { queryKeys } from "@/constants/queryKeys";
import ProviderCard from "./ProviderCard";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { Loader2, SearchX } from "lucide-react";
import { DiscoveryFilters } from "@/types/provider.types";

interface ProviderGridProps {
  filters: DiscoveryFilters;
}

export default function ProviderGrid({ filters }: ProviderGridProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: queryKeys.providers.list(filters),
    queryFn: ({ pageParam = 1 }) =>
      providerService.discoverProviders({
        ...filters,
        page: pageParam,
        limit: 12,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined,
  });

  const { elementRef } = useIntersectionObserver(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-[400px] animate-pulse rounded-2xl bg-slate-100"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center text-center">
        <p className="text-rose-600">
          Failed to load professionals. Please try again.
        </p>
      </div>
    );
  }

  const allProviders = data?.pages.flatMap((page) => page.results) || [];

  if (allProviders.length === 0) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center text-center p-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
        <SearchX size={48} className="text-slate-300" />
        <h3 className="mt-4 font-outfit text-xl font-bold text-slate-900">
          No professionals found
        </h3>
        <p className="mt-2 text-slate-500 max-w-xs">
          Try adjusting your filters or search terms to find what you&apos;re
          looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="grid gap-6 sm:grid-cols-2">
        {allProviders.map((provider) => (
          <ProviderCard key={provider._id} provider={provider} />
        ))}
      </div>

      {/* Infinite Scroll Trigger */}
      <div ref={elementRef} className="flex justify-center py-8">
        {isFetchingNextPage && (
          <Loader2 className="animate-spin text-rose-600" size={32} />
        )}
        {!hasNextPage && allProviders.length > 0 && (
          <p className="text-sm font-medium text-slate-400">
            You&apos;ve reached the end of the list
          </p>
        )}
      </div>
    </div>
  );
}
