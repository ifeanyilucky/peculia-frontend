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
          <h4 className="text-sm font-black text-primary mb-4 uppercase tracking-widest">Sort by</h4>
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
                  "flex flex-col items-center justify-center p-4 rounded-2xl border transition-all gap-2",
                  sortBy === option.id
                    ? "border-primary bg-secondary ring-1 ring-primary shadow-sm"
                    : "border-secondary hover:border-secondary"
                )}
              >
                <option.icon size={20} className={sortBy === option.id ? "text-primary" : "text-muted-foreground"} />
                <span className={cn("text-xs font-bold", sortBy === option.id ? "text-primary" : "text-foreground")}>
                  {option.id}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Price Slider */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-black text-primary uppercase tracking-widest">Maximum price</h4>
            <span className="text-sm font-bold text-primary">NGN {price.toLocaleString()}+</span>
          </div>
          <input
            type="range"
            min="0"
            max="1000000"
            step="1000"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </section>

        {/* Footer Actions */}
        <div className="pt-6 flex items-center gap-4 border-t border-secondary mt-8">
          <button
            onClick={handleClearAll}
            className="flex-1 py-4 text-sm font-black text-primary hover:bg-secondary/50 rounded-2xl transition-all border border-secondary"
          >
            Clear all
          </button>
          <button
            onClick={() => onApply({ sortBy, price })}
            className="flex-[2] py-4 bg-primary text-white text-sm font-black rounded-2xl hover:bg-primary/90 transition-all shadow-lg active:scale-95"
          >
            Apply
          </button>
        </div>
      </div>
    </CenterModal>
  );
}
