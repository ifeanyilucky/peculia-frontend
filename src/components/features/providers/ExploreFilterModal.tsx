"use client";

import { useState } from "react";
import CenterModal from "@/components/common/CenterModal";
import { SlidersHorizontal, Heart, MapPin, Star, User, Users, Baby, Accessibility, Car, Train, ShowerHead, Lock, Bath, Waves, Wind, X } from "lucide-react";
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
  const [venueType, setVenueType] = useState("Everyone");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const amenities = [
    { id: "pet", label: "Pet-friendly", icon: Heart },
    { id: "adults", label: "Adults only", icon: Users },
    { id: "kid", label: "Kid-friendly", icon: Baby },
    { id: "wheelchair", label: "Wheelchair accessible", icon: Accessibility },
    { id: "parking", label: "Parking available", icon: Car },
    { id: "transport", label: "Near public transport", icon: Train },
    { id: "showers", label: "Showers", icon: ShowerHead },
    { id: "lockers", label: "Lockers", icon: Lock },
    { id: "towels", label: "Bath towels", icon: Bath },
    { id: "pool", label: "Swimming pool", icon: Waves },
    { id: "sauna", label: "Sauna", icon: Wind },
  ];

  const handleToggleAmenity = (id: string) => {
    setSelectedAmenities(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleClearAll = () => {
    setSortBy("Best match");
    setPrice(387080);
    setVenueType("Everyone");
    setSelectedAmenities([]);
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
          <h4 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-widest">Sort by</h4>
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
                    ? "border-rose-600 bg-rose-50 ring-1 ring-rose-600 shadow-sm"
                    : "border-slate-100 hover:border-slate-200"
                )}
              >
                <option.icon size={20} className={sortBy === option.id ? "text-rose-600" : "text-slate-400"} />
                <span className={cn("text-xs font-bold", sortBy === option.id ? "text-rose-600" : "text-slate-600")}>
                  {option.id}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Price Slider */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Maximum price</h4>
            <span className="text-sm font-bold text-slate-900">NGN {price.toLocaleString()}+</span>
          </div>
          <input
            type="range"
            min="0"
            max="1000000"
            step="1000"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-rose-600"
          />
        </section>

        {/* Venue Type */}
        <section>
          <h4 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-widest">Venue type</h4>
          <div className="flex flex-wrap gap-2">
            {["Everyone", "Female only", "Male only"].map((type) => (
              <button
                key={type}
                onClick={() => setVenueType(type)}
                className={cn(
                  "px-6 py-2.5 rounded-full border text-sm font-bold transition-all",
                  venueType === type
                    ? "bg-rose-600 border-rose-600 text-white shadow-md shadow-rose-200"
                    : "border-slate-200 text-slate-600 hover:border-slate-900"
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </section>

        {/* Amenities */}
        <section>
          <h4 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-widest">Amenities</h4>
          <div className="flex flex-wrap gap-2">
            {amenities.map((amenity) => (
              <button
                key={amenity.id}
                onClick={() => handleToggleAmenity(amenity.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-bold transition-all",
                  selectedAmenities.includes(amenity.id)
                    ? "border-slate-900 bg-slate-900 text-white shadow-md"
                    : "border-slate-200 text-slate-600 hover:border-slate-900"
                )}
              >
                <amenity.icon size={16} />
                {amenity.label}
              </button>
            ))}
          </div>
        </section>

        {/* Footer Actions */}
        <div className="pt-6 flex items-center gap-4 border-t border-slate-100 mt-8">
          <button
            onClick={handleClearAll}
            className="flex-1 py-4 text-sm font-black text-slate-900 hover:bg-slate-50 rounded-2xl transition-all border border-slate-200"
          >
            Clear all
          </button>
          <button
            onClick={() => onApply({ sortBy, price, venueType, selectedAmenities })}
            className="flex-[2] py-4 bg-slate-900 text-white text-sm font-black rounded-2xl hover:bg-slate-800 transition-all shadow-lg active:scale-95"
          >
            Apply
          </button>
        </div>
      </div>
    </CenterModal>
  );
}
