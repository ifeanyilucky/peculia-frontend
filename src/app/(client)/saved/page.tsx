"use client";

import { useQuery } from "@tanstack/react-query";
import { providerService } from "@/services/provider.service";
import ProviderCard from "@/components/features/providers/ProviderCard";
import { Loader2, Bookmark, ArrowRight } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/store/auth.store";

export default function SavedProvidersPage() {
  const { isAuthenticated } = useAuthStore();

  const { data: savedProviders, isLoading } = useQuery({
    queryKey: ["providers", "saved"],
    queryFn: () => providerService.getSavedProviders(),
    enabled: isAuthenticated,
  });

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div className="space-y-2">
          <h1 className="font-peculiar text-4xl font-black text-slate-900">
            Saved Professionals
          </h1>
          <p className="text-lg text-slate-500 font-medium">
            Your curated list of favorites for quick booking.
          </p>
        </div>
      </div>

      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-rose-600" size={40} />
          </div>
        ) : !isAuthenticated ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border-2 border-dashed border-slate-200 text-slate-400">
            <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
              <Bookmark size={40} className="text-slate-200" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Sign in to view saved professionals
            </h2>
            <p className="text-sm font-medium text-slate-500 max-w-sm text-center leading-relaxed">
              Create an account or sign in to save your favorite professionals and
              book easily later.
            </p>
            <Link
              href={ROUTES.auth.login}
              className="mt-8 flex items-center gap-2 rounded-full bg-slate-900 px-8 py-4 text-sm font-black text-white hover:bg-rose-600 transition-all"
            >
              Sign In
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : !savedProviders || savedProviders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border-2 border-dashed border-slate-200 text-slate-400">
            <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
              <Bookmark size={40} className="text-slate-200" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              No saved professionals yet
            </h2>
            <p className="text-sm font-medium text-slate-500 max-w-sm text-center leading-relaxed">
              Explore the community to find professionals that match your style
              and save them for easy access later.
            </p>
            <Link
              href={ROUTES.public.explore}
              className="mt-8 flex items-center gap-2 rounded-full bg-slate-900 px-8 py-4 text-sm font-black text-white hover:bg-rose-600 transition-all"
            >
              Explore Community
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {savedProviders.map((provider) => (
              <ProviderCard key={provider._id} provider={provider} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
