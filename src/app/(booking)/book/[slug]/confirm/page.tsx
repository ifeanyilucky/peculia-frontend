"use client";

import { useQuery } from "@tanstack/react-query";
import { providerService } from "@/services/provider.service";
import { useBookingStore } from "@/store/booking.store";
import { useEffect } from "react";
import BookingHeader from "@/components/features/booking/BookingHeader";
import BookingSummarySidebar from "@/components/features/booking/BookingSummarySidebar";
import BookingConfirmation from "@/components/features/booking/BookingConfirmation";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export default function BookingConfirmPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { setSelectedProvider } = useBookingStore();

  const { data: provider, isLoading } = useQuery({
    queryKey: ["provider", "public", slug],
    queryFn: () => providerService.getProviderPublicProfile(slug),
    enabled: !!slug,
  });

  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (provider) {
      setSelectedProvider(provider);
    }
  }, [provider, setSelectedProvider]);

  // Safety guard: if not authed or missing phone, kick back to time selection
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user?.phone)) {
      router.push(`/book/${slug}/time`);
    }
  }, [isAuthenticated, user, isLoading, slug, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8 bg-white">
        <Loader2 className="animate-spin text-rose-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/30 flex flex-col">
      <BookingHeader currentStep={4} />

      <div className="mx-auto w-full max-w-7xl flex-1 px-6 py-12 lg:px-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
          {/* Main Content */}

          <BookingConfirmation />

          {provider && (
            <BookingSummarySidebar
              provider={provider}
              currentStep={4}
              slug={slug}
            />
          )}
        </div>
      </div>
    </div>
  );
}
