"use client";

import { Service } from "@/types/provider.types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useBookingStore } from "@/store/booking.store";

interface ProviderServicesProps {
  services: Service[];
  providerId: string;
}

export default function ProviderServices({
  services,
  providerId,
}: ProviderServicesProps) {
  const router = useRouter();
  const { addService } = useBookingStore();
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

  if (services.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-50 rounded-3xl border border-slate-200">
        <p className="text-slate-500">No services listed yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="font-peculiar text-3xl font-black text-slate-900">
          Services
        </h3>
      </div>

      {/* Categories Tabs */}
      <div className="relative">
        <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap rounded-full px-6 py-2 text-sm font-bold transition-all ${
                activeCategory === category
                  ? "bg-slate-900 text-white shadow-lg"
                  : "bg-transparent text-slate-600 hover:bg-slate-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Services List */}
      <div className="grid gap-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid gap-4"
          >
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between rounded-3xl border border-slate-100 bg-white p-6 transition-all hover:border-slate-200 hover:shadow-xl hover:shadow-slate-100/50"
              >
                <div className="space-y-2">
                  <h4 className="font-peculiar text-xl font-bold text-slate-900">
                    {service.name}
                  </h4>
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-400">
                    <span>{service.duration} mins</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-black text-slate-900">
                      ₦{(service.price / 100).toLocaleString()}
                    </p>
                    {service.depositAmount > 0 && (
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        Save 10%
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    addService(service);
                    router.push(`/book/${providerId}/services`);
                  }}
                  className="rounded-full border border-slate-200 bg-white px-8 py-2 text-sm font-black text-slate-900 transition-all hover:bg-slate-900 hover:text-white hover:border-slate-900 active:scale-95"
                >
                  Book
                </button>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <button className="rounded-full border border-slate-200 px-6 py-2.5 text-sm font-black text-slate-900 transition-all hover:bg-slate-50">
        See all
      </button>
    </div>
  );
}
