"use client";

import { Service } from "@/types/provider.types";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useBookingStore } from "@/store/booking.store";
import { formatCurrency } from "@/utils/formatters";

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
    const catsAndOrders = services.map((s) => ({
      name: getCategoryName(s),
      order:
        s.categoryId && typeof s.categoryId === "object"
          ? s.categoryId.order || 0
          : s.order || 0,
    }));

    // Unique names while preserving order (taking the first order found for a name)
    const uniqueCats: { name: string; order: number }[] = [];
    const seen = new Set();

    catsAndOrders.forEach((item) => {
      if (!seen.has(item.name)) {
        seen.add(item.name);
        uniqueCats.push(item);
      }
    });

    return uniqueCats.sort((a, b) => a.order - b.order).map((c) => c.name);
  }, [services]);

  const [activeCategory, setActiveCategory] = useState("");

  // Determine which category should be active
  const currentCategory = activeCategory || categories[0] || "";

  const filteredServices = useMemo(() => {
    return services
      .filter((s) => getCategoryName(s) === currentCategory)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [services, currentCategory]);

  if (services.length === 0) {
    return (
      <div className="p-8 text-center bg-glam-blush/20 rounded-2xl border border-glam-blush">
        <p className="text-glam-charcoal/60">No services listed yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pt-4">
      <div className="flex items-center justify-between">
        <h3 className="font-peculiar text-3xl font-black text-glam-plum">
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
              className={`whitespace-nowrap rounded-full px-6 py-2.5 text-sm font-bold transition-all border ${
                currentCategory === category
                  ? "bg-glam-plum text-white border-glam-plum shadow-md"
                  : "bg-white text-glam-plum border-glam-blush hover:bg-glam-blush/40"
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
            key={currentCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid gap-4"
          >
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between rounded-[2rem] border border-glam-blush bg-white p-6 shadow-sm transition-all hover:border-glam-gold/30"
              >
                <div className="space-y-2">
                  <h4 className="font-peculiar text-xl font-bold text-glam-plum">
                    {service.name}
                  </h4>
                  <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                    <span>{service.duration} mins</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-xl font-black text-glam-plum">
                      {formatCurrency(service.price)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    addService(service);
                    router.push(`/book/${providerId}/services`);
                  }}
                  className="rounded-full border border-glam-blush bg-white px-8 py-3 text-sm font-black text-glam-plum transition-all hover:bg-glam-plum hover:text-white hover:border-glam-plum active:scale-95 shadow-sm"
                >
                  Book
                </button>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <button className="rounded-full border border-glam-blush px-8 py-3 text-sm font-black text-glam-plum transition-all hover:bg-glam-blush/40">
        See all
      </button>
    </div>
  );
}
