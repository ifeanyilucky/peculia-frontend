"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProviderCard from "../providers/ProviderCard";
import type { Provider as ProviderType } from "@/types/provider.types";

interface ProviderCarouselProps {
  providers: ProviderType[];
  title: string;
  description?: string;
  href?: string;
  hrefLabel?: string;
  showServices?: boolean;
}

export default function ProviderCarousel({
  providers,
  title,
  description,
  href,
  hrefLabel,
  showServices = true,
}: ProviderCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    checkScroll();
    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);

    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    const cardWidth = 320 + 24;
    const scrollAmount = direction === "left" ? -cardWidth : cardWidth;

    el.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  if (providers.length === 0) return null;

  return (
    <section className="relative py-24 px-6 lg:px-24 bg-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="font-peculiar text-4xl font-bold text-primary">
              {title}
            </h2>
            {description && (
              <p className="mt-4 text-lg text-foreground">{description}</p>
            )}
          </div>
          {href && hrefLabel && (
            <a href={href} className="font-bold text-primary hover:underline">
              {hrefLabel} →
            </a>
          )}
        </div>

        <div className="relative group">
          <AnimatePresence>
            {canScrollLeft && (
              <motion.button
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 bg-white border border-secondary rounded-full p-3 hover:bg-secondary/50 hover:scale-110 active:scale-95 transition-all duration-200 hidden md:flex items-center justify-center"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5 text-foreground" />
              </motion.button>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {canScrollRight && (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 bg-white border border-secondary rounded-full p-3 hover:bg-secondary/50 hover:scale-110 active:scale-95 transition-all duration-200 hidden md:flex items-center justify-center"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5 text-foreground" />
              </motion.button>
            )}
          </AnimatePresence>

          <div
            ref={scrollRef}
            className="flex gap-6 pb-8 overflow-x-auto scroll-smooth snap-x snap-mandatory hide-scrollbar"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <style jsx>{`
              .hide-scrollbar::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {providers.map((provider) => (
              <div
                key={provider._id}
                className="w-[320px] shrink-0 snap-start"
              >
                <ProviderCard provider={provider} showServices={showServices} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
