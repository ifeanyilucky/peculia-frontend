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
      <div className="p-8 text-center bg-secondary/50 rounded-2xl border border-secondary">
        <p className="text-secondary-foreground/70">No services listed yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="font-peculiar text-3xl font-black text-primary">
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
                currentCategory === category
                  ? "bg-primary text-white"
                  : "bg-transparent text-foreground hover:bg-secondary/50 border border-secondary"
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
                className="flex items-center justify-between rounded-2xl border border-secondary bg-white p-6 transition-all hover:border-secondary"
              >
                <div className="space-y-2">
                  <h4 className="font-peculiar text-xl font-bold text-primary">
                    {service.name}
                  </h4>
                  <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                    <span>{service.duration} mins</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-black text-primary">
                      {formatCurrency(service.price)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    addService(service);
                    router.push(`/book/${providerId}/services`);
                  }}
                  className="rounded-full border border-secondary bg-white px-8 py-2 text-sm font-black text-primary transition-all hover:bg-primary hover:text-white hover:border-primary active:scale-95"
                >
                  Book
                </button>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <button className="rounded-full border border-secondary px-6 py-2.5 text-sm font-black text-primary transition-all hover:bg-secondary/50">
        See all
      </button>
    </div>
  );
}
