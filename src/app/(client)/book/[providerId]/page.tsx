"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { providerService } from "@/services/provider.service";
import { useBookingStore } from "@/store/booking.store";
import BookingStepNav from "@/components/features/bookings/BookingStepNav";
import SelectServiceStep from "@/components/features/bookings/SelectServiceStep";
import SelectDateTimeStep from "@/components/features/bookings/SelectDateTimeStep";
import BookingNotesStep from "@/components/features/bookings/BookingNotesStep";
import BookingReviewStep from "@/components/features/bookings/BookingReviewStep";
import BookingPaymentStep from "@/components/features/bookings/BookingPaymentStep";
import BookingSuccessScreen from "@/components/features/bookings/BookingSuccessScreen";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

const STEPS = ["Service", "Schedule", "Notes", "Review", "Payment"];

export default function BookingFlowPage() {
  const { providerId } = useParams();
  const { currentStep, setSelectedProvider, resetBookingFlow } =
    useBookingStore();
  const router = useRouter();

  const {
    data: provider,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["provider", "public", providerId],
    queryFn: () =>
      providerService.getProviderPublicProfile(providerId as string),
    enabled: !!providerId,
  });

  useEffect(() => {
    if (provider) {
      setSelectedProvider(provider);
    }
  }, [provider, setSelectedProvider]);

  // Handle case where user refreshes on a later step - we should probably always start at step 1 for security/consistency
  useEffect(() => {
    // Optional: could enforce reset on mount if needed
    // resetBookingFlow();
  }, [resetBookingFlow]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2
            className="mx-auto animate-spin text-rose-600 mb-4"
            size={40}
          />
          <p className="font-outfit text-xl font-bold text-slate-900">
            Preparing booking experience...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !provider) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center text-center p-6">
        <h2 className="font-outfit text-3xl font-bold text-slate-900">
          Professional not found
        </h2>
        <p className="mt-4 text-lg text-slate-600">
          The booking link you followed might be invalid or expired.
        </p>
        <Link
          href={ROUTES.public.explore}
          className="mt-8 rounded-full bg-slate-900 px-8 py-3 font-bold text-white hover:bg-rose-600 transition-all"
        >
          Explore Professionals
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/30 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 py-4 px-6 lg:px-24 sticky top-0 z-40">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-rose-600 transition-colors"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <div className="text-center">
            <h1 className="font-outfit text-lg font-bold text-slate-900">
              Booking with {provider.businessName}
            </h1>
          </div>
          <div className="w-[60px]" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Progress Bar */}
      {currentStep <= STEPS.length && (
        <BookingStepNav steps={STEPS} currentStep={currentStep} />
      )}

      {/* Wizard Content */}
      <main className="mx-auto max-w-4xl px-6 mt-8">
        {currentStep === 1 && <SelectServiceStep />}
        {currentStep === 2 && <SelectDateTimeStep />}
        {currentStep === 3 && <BookingNotesStep />}
        {currentStep === 4 && <BookingReviewStep />}
        {currentStep === 5 && <BookingPaymentStep />}
        {currentStep === 6 && <BookingSuccessScreen />}
      </main>
    </div>
  );
}
