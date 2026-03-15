"use client";

import { Service } from "@/types/provider.types";
import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { Check, Plus } from "lucide-react";
import { useBookingStore } from "@/store/booking.store";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/formatters";

interface BookingServiceSelectionProps {
  services: Service[];
}

interface CategorySection {
  name: string;
  services: Service[];
  id: string;
}

export default function BookingServiceSelection({
  services,
}: BookingServiceSelectionProps) {
  const { selectedServices, addService, removeService } = useBookingStore();
  const sectionRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());
  const tabsRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [isSticky, setIsSticky] = useState(false);

  const getCategoryName = (s: Service) => {
    if (s.categoryId && typeof s.categoryId === "object" && s.categoryId.name) {
      return s.categoryId.name;
    }
    return s.category || "General";
  };

  const categories = useMemo((): CategorySection[] => {
    const categoryMap = new Map<string, Service[]>();

    services.forEach((service) => {
      const categoryName = getCategoryName(service);
      if (!categoryMap.has(categoryName)) {
        categoryMap.set(categoryName, []);
      }
      categoryMap.get(categoryName)!.push(service);
    });

    return Array.from(categoryMap.entries()).map(([name, services]) => ({
      name,
      services,
      id: name.toLowerCase().replace(/\s+/g, "-"),
    }));
  }, [services]);

  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].name);
    }
  }, [categories, activeCategory]);

  useEffect(() => {
    const handleScroll = () => {
      if (tabsRef.current) {
        const rect = tabsRef.current.getBoundingClientRect();
        setIsSticky(rect.top <= 0);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const categoryId = entry.target.getAttribute("data-category-id");
            const category = categories.find((c) => c.id === categoryId);
            if (category) {
              setActiveCategory(category.name);
            }
          }
        });
      },
      {
        rootMargin: "-100px 0px -60% 0px",
        threshold: 0,
      },
    );

    sectionRefs.current.forEach((element) => {
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [categories]);

  const scrollToCategory = useCallback((categoryId: string) => {
    const element = sectionRefs.current.get(categoryId);
    if (element) {
      const headerOffset = 140;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }, []);

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
      <h1 className="font-peculiar text-2xl font-black text-slate-900 mb-8 tracking-tight">
        Services
      </h1>

      {/* Categories - Sticky */}
      <div
        ref={tabsRef}
        className={cn(
          "sticky z-10 bg-[#FAFAFA] py-4 -mx-6 px-6 lg:-mx-8 lg:px-8 mb-6 transition-shadow",
          isSticky && "border-b border-slate-200 shadow-sm",
        )}
        style={{ top: "80px" }}
      >
        <div className="overflow-x-auto no-scrollbar">
          <div className="flex w-max gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => scrollToCategory(category.id)}
                className={cn(
                  "rounded-full px-6 py-2.5 text-sm font-black transition-all whitespace-nowrap",
                  activeCategory === category.name
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-900 hover:bg-slate-100",
                )}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Services List by Category */}
      <div className="space-y-12">
        {categories.map((category) => {
          const categoryId = category.id;

          return (
            <div
              key={categoryId}
              ref={(el) => {
                sectionRefs.current.set(categoryId, el);
              }}
              data-category-id={categoryId}
              id={`category-${categoryId}`}
              className="scroll-mt-40"
            >
              {/* Category Header */}
              <h2 className="font-peculiar text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-glam-plum rounded-full" />
                {category.name}
              </h2>

              {/* Services in this category */}
              <div className="space-y-4">
                {category.services.map((service) => {
                  const isSelected = selectedServices.some(
                    (s) => s.id === service.id,
                  );

                  return (
                    <div
                      key={service.id}
                      onClick={() => handleToggleService(service)}
                      className={cn(
                        "group cursor-pointer rounded-xl border p-6 transition-all duration-200 hover:border-slate-300",
                        isSelected
                          ? "border-glam-plum bg-rose-50/10"
                          : "border-slate-200 bg-white",
                      )}
                    >
                      <div className="flex items-start justify-between gap-6">
                        <div className="space-y-3 flex-1">
                          <h3 className="font-bold text-slate-900">
                            {service.name}
                          </h3>

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
                              {formatCurrency(service.price)}
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
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-glam-plum text-white border border-slate-200">
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
        })}
      </div>
    </div>
  );
}
