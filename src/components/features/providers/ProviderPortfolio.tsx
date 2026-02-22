"use client";

import { Provider } from "@/types/provider.types";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

interface ProviderPortfolioProps {
  provider: Provider;
}

export default function ProviderPortfolio({
  provider,
}: ProviderPortfolioProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const images = provider.portfolioImages || [];

  if (images.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-50 rounded-3xl border border-slate-200">
        <p className="text-slate-500">No portfolio images uploaded yet.</p>
      </div>
    );
  }

  const handlePrev = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! === 0 ? images.length - 1 : prev! - 1));
  };

  const handleNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! === images.length - 1 ? 0 : prev! + 1));
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {images.map((img, idx) => (
          <motion.div
            key={img.publicId}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedIndex(idx)}
            className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl bg-slate-100"
          >
            <Image
              src={img.url}
              alt={img.caption || `Portfolio ${idx + 1}`}
              fill
              className="object-cover transition-transform group-hover:scale-110"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <Maximize2 className="text-white" size={24} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
          >
            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute top-6 right-6 text-white hover:text-rose-500"
            >
              <X size={32} />
            </button>

            <button
              onClick={handlePrev}
              className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-4 text-white hover:bg-white/20"
            >
              <ChevronLeft size={32} />
            </button>

            <div className="relative max-h-[80vh] w-full max-w-5xl px-12">
              <motion.div
                key={selectedIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative aspect-video w-full"
              >
                <Image
                  src={images[selectedIndex].url}
                  alt={images[selectedIndex].caption || "Portfolio"}
                  fill
                  className="object-contain"
                />
              </motion.div>
              {images[selectedIndex].caption && (
                <p className="mt-4 text-center text-lg text-white font-medium">
                  {images[selectedIndex].caption}
                </p>
              )}
              <p className="mt-2 text-center text-slate-400 text-sm">
                Image {selectedIndex + 1} of {images.length}
              </p>
            </div>

            <button
              onClick={handleNext}
              className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-4 text-white hover:bg-white/20"
            >
              <ChevronRight size={32} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
