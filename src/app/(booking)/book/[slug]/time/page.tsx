"use client";

import { useQuery } from "@tanstack/react-query";
import { providerService } from "@/services/provider.service";
import { useBookingGuard } from "@/hooks/useBookingGuard";
import BookingHeader from "@/components/features/booking/BookingHeader";
import BookingSummarySidebar from "@/components/features/booking/BookingSummarySidebar";
import BookingTimeSelection from "@/components/features/booking/BookingTimeSelection";
import { useParams } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function TimeSelectionPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const {
    data: provider,
    isLoading: isProviderLoading,
    isError: hasProviderError,
  } = useQuery({
    queryKey: ["provider", "public", slug],
    queryFn: () => providerService.getProviderPublicProfile(slug),
    enabled: !!slug,
  });

  const { isReady, hasHydrated } = useBookingGuard(3);

  if (!hasHydrated || isProviderLoading || !isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8 bg-white">
        <Loader2 className="animate-spin text-glam-plum" size={40} />
      </div>
    );
  }

  if (hasProviderError || !provider) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-white">
        <AlertCircle size={48} className="text-glam-plum mb-4" />
        <h2 className="text-xl font-black text-slate-900 mb-2">
          Provider not found
        </h2>
        <p className="text-slate-500 mb-6">
          The provider you're looking for doesn't exist or has been removed.
        </p>
        <Link
          href="/explore"
          className="px-6 py-3 rounded-full bg-slate-900 text-white font-bold hover:bg-glam-plum transition-all"
        >
          Browse Professionals
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
      <BookingHeader currentStep={3} />

      <div className="mx-auto w-full max-w-7xl flex-1 px-6 py-12 lg:px-8 pb-24 lg:pb-12">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
          <BookingTimeSelection providerId={provider._id} />
          <BookingSummarySidebar
            provider={provider}
            currentStep={3}
            slug={slug}
          />
        </div>
      </div>
    </div>
  );
}
