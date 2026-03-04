import React, { useEffect, useMemo, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { providerService } from "@/services/provider.service";
import { queryKeys } from "@/constants/queryKeys";
import ProviderCard from "./ProviderCard";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { Loader2, SearchX } from "lucide-react";
import { DiscoveryFilters } from "@/types/provider.types";

interface ProviderGridProps {
  filters: DiscoveryFilters;
  onResultsCount?: (count: number) => void;
  onProvidersLoad?: (providers: any[]) => void;
}

export default function ProviderGrid({
  filters,
  onResultsCount,
  onProvidersLoad,
}: ProviderGridProps) {
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

  // Collect all providers across all pages
  const allProviders = useMemo(
    () => data?.pages.flatMap((page) => page.results) || [],
    [data?.pages],
  );

  // Report total results count back to parent
  const totalResults = data?.pages[0]?.pagination?.totalResults || 0;

  useEffect(() => {
    if (onResultsCount) {
      onResultsCount(totalResults);
    }
  }, [totalResults, onResultsCount]);

  const prevProvidersRef = React.useRef(allProviders);
  const prevProviders = prevProvidersRef.current;
  const providersChanged =
    allProviders.length !== prevProviders.length ||
    allProviders.some((p, i) => p._id !== prevProviders[i]?._id);

  useEffect(() => {
    if (onProvidersLoad && providersChanged) {
      prevProvidersRef.current = allProviders;
      onProvidersLoad(allProviders);
    }
  }, [allProviders, onProvidersLoad, providersChanged]);

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
            className="h-[400px] animate-pulse rounded-2xl bg-glam-blush/50"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center text-center">
        <p className="text-glam-plum">
          Failed to load professionals. Please try again.
        </p>
      </div>
    );
  }

  if (allProviders.length === 0) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center text-center p-12 bg-glam-blush/50 rounded-3xl border border-dashed border-glam-blush">
        <SearchX size={48} className="text-glam-blush" />
        <h3 className="mt-4 font-peculiar text-xl font-bold text-glam-plum">
          No professionals found
        </h3>
        <p className="mt-2 text-glam-blush/500 max-w-xs">
          Try adjusting your filters or search terms to find what you&apos;re
          looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {allProviders.map((provider) => (
          <ProviderCard key={provider._id} provider={provider} />
        ))}
      </div>

      {/* Infinite Scroll Trigger */}
      <div ref={elementRef} className="flex justify-center py-8">
        {isFetchingNextPage && (
          <Loader2 className="animate-spin text-glam-plum" size={32} />
        )}
        {!hasNextPage && allProviders.length > 0 && (
          <p className="text-sm font-medium text-muted-foreground">
            You&apos;ve reached the end of the list
          </p>
        )}
      </div>
    </div>
  );
}
