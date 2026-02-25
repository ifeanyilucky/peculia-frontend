"use client";

import { useQuery } from "@tanstack/react-query";
import { providerService } from "@/services/provider.service";
import { useBookingGuard } from "@/hooks/useBookingGuard";
import BookingHeader from "@/components/features/booking/BookingHeader";
import BookingSummarySidebar from "@/components/features/booking/BookingSummarySidebar";
import BookingTimeSelection from "@/components/features/booking/BookingTimeSelection";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function TimeSelectionPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const { data: provider, isLoading: isProviderLoading } = useQuery({
    queryKey: ["provider", "public", slug],
    queryFn: () => providerService.getProviderPublicProfile(slug),
    enabled: !!slug,
  });

  const { isReady, hasHydrated } = useBookingGuard(3);

  if (!hasHydrated || isProviderLoading || !isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8 bg-white">
        <Loader2 className="animate-spin text-rose-600" size={40} />
      </div>
    );
  }

  if (!provider) return null;

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
      <BookingHeader currentStep={3} />

      <div className="mx-auto w-full max-w-7xl flex-1 px-6 py-12 lg:px-8">
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
