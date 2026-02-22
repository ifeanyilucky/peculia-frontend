"use client";

import { PortfolioImage } from "@/types/provider.types";
import { Trash2, ExternalLink, Maximize2, FileText } from "lucide-react";
import { providerService } from "@/services/provider.service";
import { sileo } from "sileo";
import { cn } from "@/lib/utils";

interface PortfolioGridProps {
  images: PortfolioImage[];
  onRefresh: () => void;
}

export default function PortfolioGrid({
  images,
  onRefresh,
}: PortfolioGridProps) {
  const handleDelete = async (publicId: string) => {
    if (
      !confirm("Are you sure you want to remove this item from your portfolio?")
    )
      return;
    try {
      await providerService.deletePortfolioImage(publicId);
      sileo.success({
        title: "Deleted",
        description: "Image removed from portfolio.",
      });
      onRefresh();
    } catch {
      sileo.error({ title: "Error", description: "Failed to delete image." });
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {images.map((image) => (
        <div
          key={image.publicId}
          className="group relative aspect-square rounded-[2.5rem] overflow-hidden bg-slate-100 border border-slate-100 hover:border-slate-900 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-slate-200"
        >
          <img
            src={image.url}
            alt={image.caption || "Portfolio item"}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-6">
            <div className="flex justify-end">
              <button
                onClick={() => handleDelete(image.publicId)}
                className="p-3 rounded-2xl bg-white/10 backdrop-blur-md text-white hover:bg-rose-600 transition-all border border-white/10"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="space-y-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <div className="flex items-center gap-2">
                <FileText size={14} className="text-rose-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
                  Professional Sample
                </span>
              </div>
              <p className="text-sm font-bold text-white line-clamp-2 leading-relaxed">
                {image.caption || "No caption provided"}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
理论上;
