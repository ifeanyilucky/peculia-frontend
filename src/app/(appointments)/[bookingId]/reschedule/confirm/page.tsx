"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { providerService } from "@/services/provider.service";
import { bookingService } from "@/services/booking.service";
import { useBookingStore } from "@/store/booking.store";
import { useEffect, useState, useCallback, useRef } from "react";
import { Loader2, Clock } from "lucide-react";
import { format } from "date-fns";
import { formatCurrency } from "@/utils/formatters";
import Image from "next/image";
import { cn } from "@/lib/utils";
import CenterModal from "@/components/common/CenterModal";

const TIMEOUT_MINUTES = 10;

export default function RescheduleConfirmPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params?.bookingId as string;

  const { 
    selectedTeamMember, 
    selectedDate, 
    selectedSlot,
    setSelectedProvider,
    resetBookingFlow 
  } = useBookingStore();

  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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

  useEffect(() => {
    if (provider) {
      setSelectedProvider(provider);
    }
  }, [provider, setSelectedProvider]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    setTimeLeft(TIMEOUT_MINUTES * 60);
  }, []);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || isTimedOut) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          setIsTimedOut(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isTimedOut]);

  const resetTimer = useCallback(() => {
    if (!isTimedOut) {
      setTimeLeft(TIMEOUT_MINUTES * 60);
    }
  }, [isTimedOut]);

  useEffect(() => {
    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [resetTimer]);

  const handleReschedule = async () => {
    if (!selectedDate || !selectedSlot) return;
    
    setIsSubmitting(true);
    try {
      await bookingService.rescheduleBooking(bookingId, {
        scheduledDate: format(selectedDate, "yyyy-MM-dd"),
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        teamMemberId: selectedTeamMember?._id,
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Reschedule error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToBookings = () => {
    resetBookingFlow();
    router.push("/bookings");
  };

  if (isBookingLoading || !booking) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8 bg-white">
        <Loader2 className="animate-spin text-rose-600" size={40} />
      </div>
    );
  }

  const businessName = provider?.businessName || "Professional";
  const businessLogo = provider?.portfolioImages?.[0]?.url || "/placeholder-business.png";
  const serviceTotal = (booking.servicePrice || 0) / 100;

  return (
    <div className="min-h-screen bg-slate-50/30 flex flex-col">
      <div className="mx-auto w-full max-w-2xl flex-1 px-6 py-12 lg:px-8">
        {timeLeft !== null && !isTimedOut && timeLeft <= 60 && (
          <div className="bg-amber-50 border border-amber-200 px-6 py-3 rounded-2xl mb-6">
            <div className="flex items-center justify-center gap-2 text-amber-700">
              <Clock size={18} className="animate-pulse" />
              <span className="font-bold text-sm">
                Time remaining: {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl border border-slate-100 p-6 mb-6">
          <h1 className="font-peculiar text-2xl font-black text-slate-900 mb-6">
            Confirm Reschedule
          </h1>

          {/* Current Booking Info */}
          <div className="p-4 bg-slate-50 rounded-2xl mb-6">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
              Current Appointment
            </p>
            <p className="text-sm font-medium text-slate-600">
              {format(new Date(booking.scheduledDate), "eee, d MMM yyyy")} at {booking.startTime}
            </p>
          </div>

          {/* New Appointment */}
          <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
            <p className="text-xs font-black uppercase tracking-widest text-rose-400 mb-3">
              New Appointment
            </p>
            {selectedDate && selectedSlot ? (
              <p className="text-sm font-medium text-slate-900">
                {format(selectedDate, "eee, d MMM yyyy")} at {selectedSlot.startTime}
              </p>
            ) : (
              <p className="text-sm font-medium text-rose-600">
                Please select a new time
              </p>
            )}
          </div>
        </div>

        {/* Provider Info */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 rounded-2xl overflow-hidden shrink-0 border border-slate-100">
              <Image
                src={businessLogo}
                alt={businessName}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-bold text-slate-900">{businessName}</p>
              <p className="text-sm font-medium text-slate-500">
                {booking.services.length} {booking.services.length === 1 ? "service" : "services"} · {formatCurrency(serviceTotal)}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleReschedule}
            disabled={!selectedDate || !selectedSlot || isSubmitting}
            className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-rose-700 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Processing..." : "Confirm Reschedule"}
          </button>
          <button
            onClick={() => router.push(`/appointments/${bookingId}/reschedule/time`)}
            className="w-full py-4 border border-slate-200 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all"
          >
            Back to Time Selection
          </button>
        </div>
      </div>

      {/* Success Modal */}
      <CenterModal
        isOpen={showSuccessModal}
        onClose={() => {}}
        title="Appointment Rescheduled!"
        description="Your appointment has been successfully rescheduled."
      >
        <div className="flex flex-col gap-3">
          <button
            onClick={handleGoToBookings}
            className="w-full h-14 rounded-full bg-rose-600 text-sm font-black text-white hover:bg-rose-700 transition-all active:scale-[0.98]"
          >
            View My Bookings
          </button>
        </div>
      </CenterModal>

      {/* Timeout Modal */}
      {isTimedOut && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center border border-slate-200">
            <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-6">
              <Clock className="w-8 h-8 text-rose-600" />
            </div>
            <h2 className="font-peculiar text-2xl font-black text-slate-900 mb-3">
              Session Timeout
            </h2>
            <p className="text-slate-600 mb-8">
              Your session timed out. Please try rescheduling again.
            </p>
            <button
              onClick={() => router.push("/bookings")}
              className="w-full py-4 px-6 rounded-full bg-rose-600 text-white font-bold hover:bg-rose-700 transition-colors"
            >
              Go to My Bookings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
