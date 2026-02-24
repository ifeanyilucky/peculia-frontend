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

      <main className="flex-1 mx-auto w-full max-w-7xl px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <BookingConfirmation />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-12">
            {provider && (
              <BookingSummarySidebar provider={provider} currentStep={4} slug={slug} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
