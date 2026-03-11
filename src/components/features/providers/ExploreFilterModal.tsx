"use client";

import { useState } from "react";
import CenterModal from "@/components/common/CenterModal";
import { Heart, MapPin, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExploreFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
}

export default function ExploreFilterModal({
  isOpen,
  onClose,
  onApply,
}: ExploreFilterModalProps) {
  const [sortBy, setSortBy] = useState("Best match");
  const [price, setPrice] = useState(387080);

  const handleClearAll = () => {
    setSortBy("Best match");
    setPrice(387080);
  };

  return (
    <CenterModal
      isOpen={isOpen}
      onClose={onClose}
      title="Filters"
      maxWidth="max-w-xl"
    >
      <div className="text-left space-y-8">
        {/* Sort By */}
        <section>
          <h4 className="text-sm font-black text-glam-plum mb-4 uppercase tracking-widest">
            Sort by
          </h4>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "Best match", icon: Heart },
              { id: "Nearest", icon: MapPin },
              { id: "Top rated", icon: Star },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setSortBy(option.id)}
                className={cn(
                  "flex flex-col items-center justify-center p-4 rounded-full border transition-all gap-2",
                  sortBy === option.id
                    ? "border-glam-plum bg-glam-blush ring-1 ring-glam-plum shadow-sm"
                    : "border-glam-blush hover:border-glam-gold/30",
                )}
              >
                <option.icon
                  size={20}
                  className={
                    sortBy === option.id
                      ? "text-glam-plum"
                      : "text-muted-foreground"
                  }
                />
                <span
                  className={cn(
                    "text-xs font-bold",
                    sortBy === option.id ? "text-glam-plum" : "text-glam-charcoal",
                  )}
                >
                  {option.id}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Price Slider */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-black text-glam-plum uppercase tracking-widest">
              Maximum price
            </h4>
            <span className="text-sm font-bold text-glam-plum">
              NGN {price.toLocaleString()}+
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1000000"
            step="1000"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full h-1.5 bg-glam-blush rounded-lg appearance-none cursor-pointer accent-glam-plum"
          />
        </section>

        {/* Footer Actions */}
        <div className="pt-6 flex items-center gap-4 border-t border-glam-blush mt-8">
          <button
            onClick={handleClearAll}
            className="flex-1 py-4 text-sm font-black text-glam-plum hover:bg-glam-blush/50 rounded-full transition-all border border-glam-blush"
          >
            Clear all
          </button>
          <button
            onClick={() => onApply({ sortBy, price })}
            className="flex-[2] py-4 bg-glam-plum text-white text-sm font-black rounded-full hover:bg-glam-plum/90 transition-all shadow-lg active:scale-95"
          >
            Apply
          </button>
        </div>
      </div>
    </CenterModal>
  );
}
