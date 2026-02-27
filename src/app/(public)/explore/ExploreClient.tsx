"use client";

import { useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  SlidersHorizontal,
  Map as MapIcon,
  X,
  MapPin,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import ExploreFilterModal from "@/components/features/providers/ExploreFilterModal";
import ProviderGrid from "@/components/features/providers/ProviderGrid";
import DiscoveryMap from "@/components/features/providers/DiscoveryMap";
import { DiscoveryFilters, Provider } from "@/types/provider.types";

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
    <div className="w-full mx-auto  min-h-screen bg-white">
      {/* Filters Bar */}
      <div className="sticky top-[80px] z-30 w-full bg-white border-b border-slate-100 py-4 lg:px-12">
        <div className=" flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-slate-500">
              <span className="text-slate-900">
                {resultsCount} professionals
              </span>{" "}
              found
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowMap(!showMap)}
                className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 hover:border-slate-900 transition-all text-sm font-bold text-slate-900"
              >
                <MapIcon size={16} />
                {showMap ? "Hide map" : "Show map"}
              </button>
            </div>
          </div>

          {/* Quick Filter Chips (Mobile/Tablet) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="flex items-center justify-center p-2.5 rounded-full border border-slate-200 bg-white hover:border-slate-900 shrink-0"
            >
              <SlidersHorizontal size={18} className="text-slate-900" />
            </button>
            <div className="h-6 w-px bg-slate-200 mx-1 shrink-0" />
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white whitespace-nowrap text-sm font-bold text-slate-900 hover:border-slate-900"
            >
              Sort
              <ChevronDown size={14} className="text-slate-500" />
            </button>
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white whitespace-nowrap text-sm font-bold text-slate-900 hover:border-slate-900"
            >
              Price
              <ChevronDown size={14} className="text-slate-500" />
            </button>
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white whitespace-nowrap text-sm font-bold text-slate-900 hover:border-slate-900"
            >
              Type
              <ChevronDown size={14} className="text-slate-500" />
            </button>
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white whitespace-nowrap text-sm font-bold text-slate-900 hover:border-slate-900"
            >
              Options
              <ChevronDown size={14} className="text-slate-500" />
            </button>
          </div>
        </div>
      </div>

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

      <div className="flex w-full min-h-[calc(100vh-160px)]">
        {/* Left Column: Grid */}
        <div
          className={cn(
            "transition-all duration-500 ease-in-out lg:px-12 py-8",
            showMap
              ? "w-full lg:w-[60%] xl:w-[65%]"
              : "w-full max-w-7xl mx-auto",
          )}
        >
          <ProviderGrid
            filters={filters}
            onResultsCount={handleResultsCount}
            onProvidersLoad={handleProvidersLoad}
          />
        </div>

        {/* Right Column: Map */}
        <AnimatePresence>
          {showMap && (
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="hidden lg:block lg:flex-1 sticky top-[152px] h-[calc(100vh-152px)] bg-slate-50 border-l border-slate-100 overflow-hidden"
            >
              <DiscoveryMap providers={providers} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
