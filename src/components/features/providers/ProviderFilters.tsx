"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useSpecialties } from "@/hooks/useSpecialties";
import { Star, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProviderFiltersProps {
  showTitle?: boolean;
  plain?: boolean;
}

export default function ProviderFilters({
  showTitle = true,
  plain = false,
}: ProviderFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: specialties = [], isLoading } = useSpecialties();

  const currentSpecialty = searchParams.get("specialty") || "";
  const currentCity = searchParams.get("city") || "";
  const currentMinRating = searchParams.get("minRating") || "";
  const currentVerified = searchParams.get("isVerified") === "true";
  const currentSort = searchParams.get("sort") || "rating";

  const updateFilter = (name: string, value: string | boolean | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === "" || value === false) {
      params.delete(name);
    } else {
      params.set(name, String(value));
    }
    router.push(`?${params.toString()}`);
  };

  const clearAll = () => {
    router.push("/explore");
  };

  return (
    <aside
      className={cn(
        "space-y-8 sticky top-24",
        !plain && "bg-white p-6 rounded-2xl border border-secondary",
      )}
    >
      {showTitle && (
        <div className="flex items-center justify-between">
          <h3 className="font-peculiar text-xl font-bold text-primary">
            Filters
          </h3>
          <button
            onClick={clearAll}
            className="text-xs font-medium text-primary hover:underline"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Specialty */}
      <div className="space-y-4">
        <p className="text-sm font-bold text-primary">Specialty</p>
        <div className="flex flex-col gap-2">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading specialties...</p>
          ) : (
            specialties.map((spec) => (
              <label
                key={spec.id}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="specialty"
                  checked={currentSpecialty === spec.id}
                  onChange={() => updateFilter("specialty", spec.id)}
                  className="h-4 w-4 rounded-full border-secondary text-primary focus:ring-primary"
                />
                <span className="text-sm text-slate-600 group-hover:text-primary">
                  {spec.label}
                </span>
              </label>
            ))
          )}
        </div>
      </div>

      {/* City */}
      <div className="space-y-4">
        <p className="text-sm font-bold text-primary">City</p>
        <input
          type="text"
          placeholder="e.g. Lagos"
          value={currentCity}
          onChange={(e) => updateFilter("city", e.target.value)}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none"
        />
      </div>

      {/* Minimum Rating */}
      <div className="space-y-4">
        <p className="text-sm font-bold text-primary">Minimum Rating</p>
        <div className="flex gap-2">
          {[4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() =>
                updateFilter(
                  "minRating",
                  currentMinRating === String(rating) ? null : String(rating),
                )
              }
              className={cn(
                "flex flex-1 items-center justify-center gap-1 rounded-lg border py-2 text-xs font-bold transition-all",
                currentMinRating === String(rating)
                  ? "border-primary bg-primary text-white"
                  : "border-secondary text-slate-600 hover:border-rose-200",
              )}
            >
              {rating}+{" "}
              <Star
                size={12}
                fill={
                  currentMinRating === String(rating) ? "white" : "currentColor"
                }
              />
            </button>
          ))}
        </div>
      </div>

      {/* Verified Only */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-primary">Verified Only</p>
        <button
          onClick={() => updateFilter("isVerified", !currentVerified)}
          className={cn(
            "relative h-6 w-11 rounded-full transition-colors",
            currentVerified ? "bg-primary" : "bg-slate-200",
          )}
        >
          <div
            className={cn(
              "absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform",
              currentVerified ? "translate-x-5" : "",
            )}
          />
        </button>
      </div>

      {/* Sort By */}
      <div className="space-y-4">
        <p className="text-sm font-bold text-primary">Sort By</p>
        <select
          value={currentSort}
          onChange={(e) => updateFilter("sort", e.target.value)}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none appearance-none"
        >
          <option value="rating">Highest Rated</option>
          <option value="totalReviews">Most Reviewed</option>
          <option value="createdAt">Newest Joined</option>
        </select>
      </div>
    </aside>
  );
}
