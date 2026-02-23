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
          className="absolute top-6 right-6 text-white hover:text-rose-500 z-110"
        >
          <X size={32} />
        </button>

        {images.length > 1 && (
          <>
            <button
              onClick={onPrev}
              className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-4 text-white hover:bg-white/20 z-110 transition-all"
            >
              <ChevronLeft size={32} />
            </button>

            <button
              onClick={onNext}
              className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-4 text-white hover:bg-white/20 z-110 transition-all"
            >
              <ChevronRight size={32} />
            </button>
          </>
        )}

        <div className="relative max-h-[85vh] w-full max-w-5xl px-12 flex flex-col items-center">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-video w-full"
          >
            <Image
              src={images[currentIndex].url}
              alt={images[currentIndex].caption || "Gallery Image"}
              fill
              className="object-contain"
              priority
            />
          </motion.div>

          {images[currentIndex].caption && (
            <p className="mt-6 text-center text-lg text-white font-medium max-w-2xl">
              {images[currentIndex].caption}
            </p>
          )}

          <p className="mt-4 text-center text-slate-400 text-sm font-bold tracking-widest uppercase">
            Image {currentIndex + 1} of {images.length}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
