"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { providerService } from "@/services/provider.service";
import { bookingService } from "@/services/booking.service";
import BookingProfessionalSelection from "@/components/features/booking/BookingProfessionalSelection";
import { Loader2 } from "lucide-react";

export default function RescheduleProfessionalPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params?.bookingId as string;

  const { data: booking, isLoading: isBookingLoading } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => bookingService.getBookingById(bookingId),
    enabled: !!bookingId,
  });

  const providerId = typeof booking?.providerProfileId === "object" 
    ? booking.providerProfileId._id 
    : booking?.providerProfileId;

  const { data: provider } = useQuery({
    queryKey: ["provider", providerId],
    queryFn: () => providerService.getProviderById(providerId!),
    enabled: !!providerId,
  });

  const handleProfessionalSelect = (professionalId: string) => {
    router.push(`/appointments/${bookingId}/reschedule/time`);
  };

  if (isBookingLoading || !booking) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8 bg-white">
        <Loader2 className="animate-spin text-rose-600" size={40} />
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8 bg-white">
        <p className="text-slate-500">Provider not found</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
      <div className="mx-auto w-full max-w-7xl flex-1 px-6 py-12 lg:px-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
          <div className="flex-1">
            <div className="mb-8">
              <h1 className="font-peculiar text-3xl font-black text-slate-900 mb-2">
                Select Professional
              </h1>
              <p className="text-slate-500 font-medium">
                Choose a different professional for your appointment
              </p>
            </div>
            <BookingProfessionalSelection 
              providerId={providerId} 
              onSelect={handleProfessionalSelect}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
