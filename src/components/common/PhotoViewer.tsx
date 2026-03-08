"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface PhotoViewerProps {
  images: { url: string; caption?: string }[];
  currentIndex: number | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function PhotoViewer({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: PhotoViewerProps) {
  if (currentIndex === null) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-100 flex items-center justify-center bg-black/95 p-4"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 text-white hover:text-rose-500 z-110 bg-black/20 hover:bg-black/40 rounded-full p-2"
        >
          <X size={24} className="md:w-8 md:h-8" />
        </button>

        {images.length > 1 && (
          <>
            <button
              onClick={onPrev}
              className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 md:p-4 text-white hover:bg-white/20 z-110 transition-all backdrop-blur-sm"
            >
              <ChevronLeft size={24} className="md:w-8 md:h-8" />
            </button>

            <button
              onClick={onNext}
              className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 md:p-4 text-white hover:bg-white/20 z-110 transition-all backdrop-blur-sm"
            >
              <ChevronRight size={24} className="md:w-8 md:h-8" />
            </button>
          </>
        )}

        <div className="relative h-full max-h-dvh w-full max-w-7xl py-16 md:py-20 px-2 md:px-20 flex flex-col items-center justify-center">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full flex-1 min-h-0"
          >
            <Image
              src={images[currentIndex].url}
              alt={images[currentIndex].caption || "Gallery Image"}
              fill
              className="object-contain"
              priority
            />
          </motion.div>

          <div className="mt-4 md:mt-6 flex flex-col items-center shrink-0">
            {images[currentIndex].caption && (
              <p className="text-center text-sm md:text-lg text-white font-medium max-w-2xl px-8">
                {images[currentIndex].caption}
              </p>
            )}

            <p className="mt-2 text-center text-slate-400 text-xs md:text-sm font-bold tracking-widest uppercase">
              Image {currentIndex + 1} of {images.length}
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
