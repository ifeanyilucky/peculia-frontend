"use client";

import { Provider } from "@/types/provider.types";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { Maximize2 } from "lucide-react";
import PhotoViewer from "@/components/common/PhotoViewer";

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

      <PhotoViewer
        images={images}
        currentIndex={selectedIndex}
        onClose={() => setSelectedIndex(null)}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </>
  );
}
