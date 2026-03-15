"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { providerService } from "@/services/provider.service";
import { bookingService } from "@/services/booking.service";
import BookingTimeSelection from "@/components/features/booking/BookingTimeSelection";
import { Loader2 } from "lucide-react";

export default function RescheduleTimePage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params?.bookingId as string;

  const {
    data: booking,
    isLoading: isBookingLoading,
    error: bookingError,
  } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => bookingService.getBookingById(bookingId),
    enabled: !!bookingId,
  });

  const providerId = booking
    ? typeof booking.providerProfileId === "object"
      ? (booking.providerProfileId as { _id: string })._id
      : (booking.providerProfileId as string)
    : undefined;

  const { data: provider, isLoading: isProviderLoading } = useQuery({
    queryKey: ["provider", providerId],
    queryFn: () => providerService.getProviderById(providerId!),
    enabled: !!providerId,
  });

  const handleTimeSelect = () => {
    router.push(`/appointments/${bookingId}/reschedule/confirm`);
  };

  if (isBookingLoading || isProviderLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8 bg-white">
        <Loader2 className="animate-spin text-glam-plum" size={40} />
      </div>
    );
  }

  if (bookingError || !booking) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8 bg-white">
        <p className="text-slate-500">
          Unable to load booking. Please try again.
        </p>
      </div>
    );
  }

  if (!provider || !providerId) {
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
              <h1 className="font-peculiar text-2xl font-black text-slate-900 mb-2 tracking-tight">
                Select Time
              </h1>
              <p className="text-slate-500 font-medium">
                Choose a new date and time for your appointment
              </p>
            </div>
            <BookingTimeSelection
              providerId={providerId}
              onTimeSelect={handleTimeSelect}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
