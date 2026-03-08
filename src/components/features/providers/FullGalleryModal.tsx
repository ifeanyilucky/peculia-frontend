"use client";

import { useEffect } from "react";
import Image from "next/image";
import { ArrowLeft, X } from "lucide-react";
import { PortfolioImage } from "@/types/provider.types";

interface FullGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: PortfolioImage[];
  onImageClick: (index: number) => void;
  businessName: string;
}

export default function FullGalleryModal({
  isOpen,
  onClose,
  images,
  onImageClick,
  businessName,
}: FullGalleryModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 bg-white flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="sticky top-0 z-70 flex items-center justify-between bg-white/80 backdrop-blur-md px-6 py-4 border-b border-slate-100">
        <button
          onClick={onClose}
          className="p-2 -ml-2 hover:bg-slate-100 transition-colors rounded-full flex items-center gap-2 text-slate-600"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-bold">Back</span>
        </button>
        <h2 className="font-peculiar text-xl md:text-2xl font-black text-slate-900 absolute left-1/2 -translate-x-1/2">
          {businessName} Gallery
        </h2>
        <button
          onClick={onClose}
          className="hidden md:flex p-2 hover:bg-slate-100 transition-colors rounded-full text-slate-500"
        >
          <X size={20} />
        </button>
      </div>

      {/* Masonry Grid Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 bg-slate-50">
        <div className="max-w-7xl mx-auto columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {images.map((img, index) => (
            <div
              key={img.publicId || index}
              onClick={() => onImageClick(index)}
              className="relative break-inside-avoid rounded-2xl overflow-hidden cursor-pointer group shadow-sm border border-slate-200/60"
            >
              <Image
                src={img.url}
                alt={img.caption || `${businessName} gallery photo`}
                width={800}
                height={800}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                priority={index < 8}
              />
              <div className="absolute inset-0 bg-slate-900/0 hover:bg-slate-900/10 transition-colors duration-300" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
