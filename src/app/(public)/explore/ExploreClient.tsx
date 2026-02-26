"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, Map as MapIcon, X, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import ExploreFilterModal from "@/components/features/providers/ExploreFilterModal";
import ProviderGrid from "@/components/features/providers/ProviderGrid";
import { DiscoveryFilters } from "@/types/provider.types";

export default function ExploreClient() {
  const searchParams = useSearchParams();
  const [showMap, setShowMap] = useState(true);
  const [resultsCount, setResultsCount] = useState(0);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

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
    <div className="w-full min-h-screen bg-white">
      {/* Filters Bar */}
      <div className="sticky top-[80px] z-40 w-full bg-white border-b border-slate-100 py-4 px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px] flex items-center justify-between">
          <p className="text-sm font-bold text-slate-500">
            <span className="text-slate-900">{resultsCount} professionals</span> found
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 hover:border-slate-900 transition-all text-sm font-bold text-slate-900"
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>
            <button
              onClick={() => setShowMap(!showMap)}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 hover:border-slate-900 transition-all text-sm font-bold text-slate-900"
            >
              <MapIcon size={16} />
              {showMap ? "Hide map" : "Show map"}
            </button>
          </div>
        </div>
      </div>

      <ExploreFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={(f) => {
          console.log("Applying filters:", f);
          setIsFilterModalOpen(false);
          // TODO: Sync with URL
        }}
      />

      <div className="flex w-full min-h-[calc(100vh-160px)]">
        {/* Left Column: Grid */}
        <div
          className={cn(
            "transition-all duration-500 ease-in-out px-6 lg:px-12 py-8",
            showMap ? "w-full lg:w-[60%] xl:w-[65%]" : "w-full max-w-7xl mx-auto"
          )}
        >
          <ProviderGrid
            filters={filters}
            onResultsCount={(count) => setResultsCount(count)}
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
              {/* Placeholder for Google Map */}
              <div className="absolute inset-0 bg-blue-50/50 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-4">
                    <MapIcon size={32} className="text-slate-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Map View</h3>
                  <p className="text-sm text-slate-500 max-w-xs mt-1">
                    Google Maps integration would show professionals in your current area.
                  </p>
                </div>
              </div>

              {/* Mock Map Markers (Bubbles) */}
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute p-2 transition-transform hover:scale-110 cursor-pointer"
                  style={{
                    top: `${20 + Math.random() * 60}%`,
                    left: `${20 + Math.random() * 60}%`,
                  }}
                >
                  <div className="bg-slate-900 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg border-2 border-white flex items-center gap-1">
                    <MapPin size={10} />
                    4.9
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
