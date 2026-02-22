"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { providerService } from "@/services/provider.service";
import PortfolioGrid from "@/components/features/portfolio/PortfolioGrid";
import PortfolioUploadModal from "@/components/features/portfolio/PortfolioUploadModal";
import {
  Plus,
  Image as ImageIcon,
  Loader2,
  Inbox,
  Sparkles,
  LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProviderPortfolioPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: profile,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["provider-profile", "me"],
    queryFn: () => providerService.getMyProfile(),
  });

  const portfolioImages = profile?.portfolioImages || [];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div className="space-y-2">
          <h1 className="font-peculiar text-4xl font-black text-slate-900">
            Portfolio
          </h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">
            Showcase your best work and attract more clients.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-8 py-4 text-sm font-black uppercase tracking-widest text-white hover:bg-rose-600 transition-all shadow-xl shadow-slate-200"
        >
          <Plus size={20} />
          Upload Work
        </button>
      </div>

      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
            <LayoutGrid className="text-slate-400" size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Gallery View
            </span>
          </div>

          <div className="flex items-center gap-3 px-4 py-2 bg-rose-50 rounded-2xl border border-rose-100">
            <Sparkles className="text-rose-600" size={16} />
            <span className="text-xs font-black uppercase tracking-widest text-rose-600">
              {portfolioImages.length} Samples Published
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-rose-600" size={32} />
            <p className="text-sm font-black uppercase tracking-widest text-slate-400">
              Loading gallery...
            </p>
          </div>
        ) : portfolioImages.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-center bg-white rounded-[2.5rem] border border-slate-100 border-dashed">
            <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-200 mb-6">
              <ImageIcon size={40} />
            </div>
            <h3 className="font-peculiar text-xl font-bold text-slate-900">
              Portfolio is empty
            </h3>
            <p className="text-slate-400 font-medium max-w-xs mt-2">
              Add photos of your previous work to build trust with potential
              clients.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-8 inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-rose-600 hover:text-rose-700 underline underline-offset-8"
            >
              Upload your first sample
            </button>
          </div>
        ) : (
          <PortfolioGrid images={portfolioImages} onRefresh={refetch} />
        )}
      </div>

      <PortfolioUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refetch}
      />
    </div>
  );
}
