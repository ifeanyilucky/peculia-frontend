"use client";

import { useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  SlidersHorizontal,
  Map as MapIcon,
  ChevronDown,
  Star,
  DollarSign,
  Tag,
  ArrowUpDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import ExploreFilterModal from "@/components/features/providers/ExploreFilterModal";
import ProviderGrid from "@/components/features/providers/ProviderGrid";
import DiscoveryMap from "@/components/features/providers/DiscoveryMap";
import { DiscoveryFilters, Provider } from "@/types/provider.types";
import {
  SortPopover,
  PricePopover,
  RatingPopover,
  TypePopover,
} from "@/components/layout/ExploreFilterPopups";
import { useEffect, useRef } from "react";

/**
 * The header is two rows: ~56px (row 1) + ~52px (row 2 search bar) = ~108px total.
 * The filter bar below sticks at top-[108px] so it lines up cleanly.
 */
const HEADER_HEIGHT = "top-[108px]";

const QUICK_FILTERS = [
  { label: "Sort", icon: ArrowUpDown },
  { label: "Price", icon: DollarSign },
  { label: "Rating", icon: Star },
  // { label: "Type", icon: Tag },
];

export default function ExploreClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showMap, setShowMap] = useState(true);
  const [resultsCount, setResultsCount] = useState(0);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activePopover, setActivePopover] = useState<string | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const popoverRef = useRef<HTMLDivElement>(null);

  // ── Click-outside handler for popovers ────────────────────────────────────
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setActivePopover(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateFilter = (
    key: string,
    value: string | number | boolean | null,
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === undefined || value === null || value === "" || value === 0) {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
    router.push(`?${params.toString()}`);
    setActivePopover(null);
  };

  const handleResultsCount = useCallback((count: number) => {
    setResultsCount(count);
  }, []);

  const handleProvidersLoad = useCallback((p: Provider[]) => {
    setProviders(p);
  }, []);

  const filters: DiscoveryFilters = {
    specialty: searchParams.get("specialty") || undefined,
    city: searchParams.get("city") || undefined,
    minRating: searchParams.get("minRating")
      ? Number(searchParams.get("minRating"))
      : undefined,
    isVerified: searchParams.get("isVerified") === "true" || undefined,
    search: searchParams.get("search") || undefined,
    sort: searchParams.get("sort") || "rating",
    date: searchParams.get("date") || undefined,
    time: searchParams.get("time") || undefined,
    maxPrice: searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined,
  };

  return (
    <div className="w-full min-h-screen bg-glam-ivory/30">
      {/* ── Quick filters bar ────────────────────────────────────────────── */}
      <div className="sticky top-[108px] z-30 w-full bg-white/80 backdrop-blur-md border-b border-glam-blush px-4 sm:px-6 lg:px-10 py-3">
        <div className="flex items-center justify-between gap-4 max-w-[1440px] mx-auto">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            {/* All filters button */}
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-glam-blush bg-white text-xs font-black text-glam-plum hover:bg-glam-blush/40 transition-all shrink-0"
            >
              <SlidersHorizontal size={14} />
              Filters
            </button>

            <div className="h-4 w-px bg-glam-blush mx-1 shrink-0" />

            {/* Quick filter chips */}
            <div className="relative flex items-center gap-2" ref={popoverRef}>
              {QUICK_FILTERS.map((filter) => {
                const isActive = activePopover === filter.label;
                let displayValue = filter.label;

                // Dynamically update label based on filter value
                if (filter.label === "Sort") {
                  const s = filters.sort;
                  if (s === "rating") displayValue = "Top rated";
                  else if (s === "distance") displayValue = "Nearest";
                  else if (s === "newest") displayValue = "Newest";
                } else if (filter.label === "Price" && filters.maxPrice) {
                  displayValue = `Under ₦${(filters.maxPrice / 100).toLocaleString()}`;
                } else if (filter.label === "Rating" && filters.minRating) {
                  displayValue = `${filters.minRating}+ ★`;
                }

                return (
                  <div key={filter.label} className="relative">
                    <button
                      onClick={() =>
                        setActivePopover(isActive ? null : filter.label)
                      }
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-black transition-all shrink-0",
                        isActive || displayValue !== filter.label
                          ? "border-glam-plum bg-glam-plum text-white shadow-md"
                          : "border-glam-blush bg-white text-glam-plum hover:border-glam-gold/30",
                      )}
                    >
                      <filter.icon size={14} />
                      {displayValue}
                      <ChevronDown
                        size={12}
                        className={cn(
                          "transition-transform",
                          isActive && "rotate-180",
                        )}
                      />
                    </button>

                    {/* Popover content */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 mt-2 z-50"
                        >
                          {filter.label === "Sort" && (
                            <SortPopover
                              value={filters.sort || "rating"}
                              onSelect={(val) => updateFilter("sort", val)}
                            />
                          )}
                          {filter.label === "Price" && (
                            <PricePopover
                              value={filters.maxPrice || 0}
                              onSelect={(val) => updateFilter("maxPrice", val)}
                            />
                          )}
                          {filter.label === "Rating" && (
                            <RatingPopover
                              value={filters.minRating || 0}
                              onSelect={(val) => updateFilter("minRating", val)}
                            />
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-4">
            <p className="text-xs font-bold text-glam-charcoal/60">
              <span className="text-glam-plum font-black">
                {resultsCount.toLocaleString()}
              </span>{" "}
              professionals found
            </p>
            <button
              onClick={() => setShowMap(!showMap)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-glam-charcoal text-white text-xs font-black hover:bg-glam-plum transition-all shadow-md active:scale-95"
            >
              <MapIcon size={14} />
              {showMap ? "Hide Map" : "Show Map"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Filter modal ─────────────────────────────────────────────────── */}
      <ExploreFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={(f) => {
          const params = new URLSearchParams(searchParams.toString());
          if (f.sortBy === "Nearest") {
            params.set("sort", "distance");
          } else if (f.sortBy === "Top rated") {
            params.set("sort", "rating");
          } else {
            params.set("sort", "relevance");
          }
          if (f.price > 0) {
            params.set("maxPrice", f.price.toString());
          } else {
            params.delete("maxPrice");
          }
          router.push(`?${params.toString()}`);
          setIsFilterModalOpen(false);
        }}
      />

      {/* ── Main content: grid + map ─────────────────────────────────────── */}
      <div className="flex w-full min-h-[calc(100vh-160px)]">
        {/* Provider grid */}
        <div
          className={cn(
            "transition-all duration-500 ease-in-out px-4 sm:px-6 lg:px-10 py-6",
            showMap
              ? "w-full lg:w-[58%] xl:w-[62%]"
              : "w-full max-w-7xl mx-auto",
          )}
        >
          <ProviderGrid
            filters={filters}
            onResultsCount={handleResultsCount}
            onProvidersLoad={handleProvidersLoad}
          />
        </div>

        {/* Map panel (desktop only) */}
        {/* <AnimatePresence>
          {showMap && (
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 60 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="hidden lg:block lg:flex-1 sticky top-[160px] h-[calc(100vh-160px)] bg-slate-50 border-l border-slate-100 overflow-hidden"
            >
              <DiscoveryMap providers={providers} />
            </motion.div>
          )}
        </AnimatePresence> */}
      </div>
    </div>
  );
}
