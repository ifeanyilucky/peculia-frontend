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
    <div className="w-full min-h-screen">
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
