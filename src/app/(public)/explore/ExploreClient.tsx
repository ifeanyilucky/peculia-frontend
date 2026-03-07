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

/**
 * The header is two rows: ~56px (row 1) + ~52px (row 2 search bar) = ~108px total.
 * The filter bar below sticks at top-[108px] so it lines up cleanly.
 */
const HEADER_HEIGHT = "top-[108px]";

const QUICK_FILTERS = [
  { label: "Sort", icon: ArrowUpDown },
  { label: "Price", icon: DollarSign },
  { label: "Rating", icon: Star },
  { label: "Type", icon: Tag },
];

export default function ExploreClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showMap, setShowMap] = useState(true);
  const [resultsCount, setResultsCount] = useState(0);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([]);

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
    <div className="w-full min-h-screen">
      {/* ── Sticky Filter Bar ─────────────────────────────────────────────── */}
      <div
        className={cn(
          "sticky z-30 w-full bg-white/90 backdrop-blur-sm border-b border-secondary/60",
          HEADER_HEIGHT,
        )}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between h-12 gap-3">
          {/* Left: results count + quick filter chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {/* Filters icon button */}
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="flex items-center justify-center h-8 w-8 rounded-full border border-slate-200 bg-white hover:border-primary hover:bg-secondary/30 transition-all shrink-0"
              aria-label="Open filters"
            >
              <SlidersHorizontal size={14} className="text-slate-700" />
            </button>

            <div className="h-5 w-px bg-slate-200 shrink-0" />

            {/* Results count */}
            <p className="text-xs font-medium text-muted-foreground shrink-0 whitespace-nowrap">
              <span className="font-black text-slate-900">{resultsCount}</span>{" "}
              professionals
            </p>

            <div className="h-5 w-px bg-slate-200 shrink-0" />

            {/* Quick filter chips */}
            {QUICK_FILTERS.map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => setIsFilterModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-white whitespace-nowrap text-xs font-bold text-slate-800 hover:border-slate-700 hover:bg-slate-50 transition-all shrink-0"
              >
                <Icon size={12} className="text-slate-500" />
                {label}
                <ChevronDown size={11} className="text-slate-400" />
              </button>
            ))}
          </div>

          {/* Right: Map toggle (desktop only) */}
          <button
            onClick={() => setShowMap(!showMap)}
            className="hidden lg:flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-200 hover:border-slate-700 transition-all text-xs font-bold text-slate-800 shrink-0"
          >
            <MapIcon size={13} />
            {showMap ? "Hide map" : "Show map"}
          </button>
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
        <AnimatePresence>
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
        </AnimatePresence>
      </div>
    </div>
  );
}
