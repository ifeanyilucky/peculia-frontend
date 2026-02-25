"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import ProviderFilters from "@/components/features/providers/ProviderFilters";
import ProviderGrid from "@/components/features/providers/ProviderGrid";
import { DiscoveryFilters } from "@/types/provider.types";
import { Filter, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ExploreClient() {
  const searchParams = useSearchParams();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

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

  const activeFilterCount = Object.keys(filters).filter(
    (key) =>
      filters[key as keyof DiscoveryFilters] !== undefined && key !== "sort",
  ).length;

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:w-80 lg:shrink-0">
        <ProviderFilters />
      </div>

      <div className="flex-1">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-peculiar text-3xl font-bold text-slate-900 md:text-4xl">
              Discovery
            </h1>
            <p className="mt-2 text-slate-600 tracking-tight">
              Browse top beauty and wellness experts near you.
            </p>
          </div>

          <button
            onClick={() => setIsMobileFiltersOpen(true)}
            className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-slate-800 active:scale-95 lg:hidden"
          >
            <Filter size={18} />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px]">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <ProviderGrid filters={filters} />
      </div>

      {/* Mobile Filters Modal */}
      <AnimatePresence>
        {isMobileFiltersOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFiltersOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Drawer */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 right-0 max-h-[90vh] overflow-y-auto rounded-t-[32px] bg-white p-8 shadow-2xl"
            >
              <div className="mb-8 flex items-center justify-between">
                <h2 className="font-peculiar text-2xl font-black text-slate-900">
                  Filters
                </h2>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="rounded-full bg-slate-100 p-2 text-slate-400 hover:text-slate-900"
                >
                  <X size={20} />
                </button>
              </div>

              <ProviderFilters plain showTitle={false} />

              <div className="sticky bottom-0 mt-8 border-t border-slate-100 bg-white pt-6">
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="w-full rounded-2xl bg-rose-600 py-4 text-sm font-bold text-white shadow-lg shadow-rose-200 transition-all hover:bg-rose-700 active:scale-[0.98]"
                >
                  Show Results
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
