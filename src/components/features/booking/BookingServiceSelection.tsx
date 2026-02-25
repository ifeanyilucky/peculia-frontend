"use client";

import { Service } from "@/types/provider.types";
import { useState, useMemo } from "react";
import { Check, Plus } from "lucide-react";
import { useBookingStore } from "@/store/booking.store";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/formatters";

interface BookingServiceSelectionProps {
  services: Service[];
}

export default function BookingServiceSelection({
  services,
}: BookingServiceSelectionProps) {
  const { selectedServices, addService, removeService } = useBookingStore();

  const getCategoryName = (s: Service) => {
    if (s.categoryId && typeof s.categoryId === "object" && s.categoryId.name) {
      return s.categoryId.name;
    }
    return s.category || "General";
  };

  const categories = useMemo(() => {
    const cats = Array.from(new Set(services.map(getCategoryName))).filter(
      Boolean,
    );
    return cats;
  }, [services]);

  const [activeCategory, setActiveCategory] = useState(
    categories[0] || "General",
  );

  const filteredServices = useMemo(() => {
    return services.filter((s) => getCategoryName(s) === activeCategory);
  }, [services, activeCategory]);

  const handleToggleService = (service: Service) => {
    const isSelected = selectedServices.some((s) => s.id === service.id);
    if (isSelected) {
      removeService(service.id);
    } else {
      addService(service);
    }
  };

  if (services.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500">
        No services available for booking at this time.
      </div>
    );
  }

  return (
    <div className="w-full flex-1">
      <h1 className="font-peculiar text-4xl font-black text-slate-900 mb-8 tracking-tight">
        Services
      </h1>

      {/* Categories Horizontal Scroll */}
      <div className="mb-8 overflow-x-auto no-scrollbar pb-2">
        <div className="flex w-max gap-3 border-b border-transparent">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "rounded-full px-6 py-2.5 text-sm font-black transition-all",
                activeCategory === category
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-900 hover:bg-slate-100",
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <h2 className="font-peculiar text-2xl font-bold text-slate-900 mb-6">
        {activeCategory}
      </h2>

      {/* Services List */}
      <div className="space-y-4">
        {filteredServices.map((service) => {
          const isSelected = selectedServices.some((s) => s.id === service.id);

          return (
            <div
              key={service.id}
              onClick={() => handleToggleService(service)}
              className={cn(
                "group cursor-pointer rounded-xl border p-6 transition-all duration-200 hover:border-slate-300",
                isSelected
                  ? "border-rose-600 bg-rose-50/10"
                  : "border-slate-200 bg-white",
              )}
            >
              <div className="flex items-start justify-between gap-6">
                <div className="space-y-3 flex-1">
                  <h3 className="font-bold text-slate-900">{service.name}</h3>

                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <span>{service.duration} mins</span>
                    <span className="text-slate-300">•</span>
                    <span>
                      {service.duration} minutes with any professional
                    </span>
                  </div>

                  {service.description && (
                    <p className="text-xs text-slate-500 leading-relaxed font-medium mt-2 line-clamp-2">
                      {service.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 pt-2">
                    <p className="text-sm font-black text-slate-900">
                      {formatCurrency(service.price / 100)}
                    </p>
                    {service.depositAmount > 0 && (
                      <span className="text-[10px] font-bold text-green-600">
                        {Math.round(
                          (service.depositAmount / service.price) * 100,
                        )}
                        % deposit required
                      </span>
                    )}
                  </div>
                </div>

                <div className="shrink-0 flex items-center justify-center pt-1">
                  {isSelected ? (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-600 text-white border border-slate-200">
                      <Check size={20} strokeWidth={3} />
                    </div>
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 group-hover:border-slate-300 group-hover:text-slate-900 transition-all">
                      <Plus size={20} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
