"use client";

import { useState } from "react";
import { useBookingStore } from "@/store/booking.store";
import { bookingService } from "@/services/booking.service";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  MapPin,
  Loader2,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import Image from "next/image";
import { sileo } from "sileo";

export default function BookingReviewStep() {
  const {
    selectedProvider,
    selectedService,
    selectedDate,
    selectedSlot,
    bookingNotes,
    nextStep,
    prevStep,
  } = useBookingStore();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!selectedProvider || !selectedService || !selectedDate || !selectedSlot)
      return;

    setIsSubmitting(true);
    try {
      const booking = await bookingService.createBooking({
        providerProfileId: selectedProvider.id,
        serviceId: selectedService.id,
        scheduledDate: selectedDate.toISOString(),
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        notes: bookingNotes,
      });

      sileo.success({
        title: "Booking Initiated",
        description:
          "Your booking has been created. Please complete the deposit payment.",
      });

      // Save the created booking ID for the next step (could be in store or as a param)
      // Here we'll just move to the next step where the payment logic will take over
      // We might need to store the created booking in the zustand store briefly
      nextStep();
    } catch (error) {
      console.error("Booking creation failed:", error);
      sileo.error({
        title: "Booking Failed",
        description:
          "Something went wrong while creating your booking. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedProvider || !selectedService || !selectedDate || !selectedSlot)
    return null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-10">
        <h2 className="font-outfit text-2xl font-bold text-slate-900">
          Review Your Booking
        </h2>
        <p className="mt-2 text-slate-500">
          Double check everything before proceeding to payment.
        </p>
      </div>

      <div className="mx-auto max-w-2xl space-y-6">
        {/* Provider & Service Summary */}
        <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
          <div className="flex items-center gap-4 bg-slate-50/50 p-6">
            <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-slate-200">
              {selectedProvider.userId.avatar ? (
                <Image
                  src={selectedProvider.userId.avatar}
                  alt={selectedProvider.businessName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-rose-100 text-rose-600 font-bold text-xl">
                  {selectedProvider.businessName[0]}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-outfit text-xl font-bold text-slate-900">
                {selectedService.name}
              </h3>
              <p className="text-sm font-medium text-slate-500">
                with {selectedProvider.businessName}
              </p>
            </div>
          </div>

          <div className="grid gap-6 p-6 sm:grid-cols-2">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Date
                </p>
                <p className="font-bold text-slate-900">
                  {format(selectedDate, "EEEE, MMMM do, yyyy")}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Time & Duration
                </p>
                <p className="font-bold text-slate-900">
                  {selectedSlot.startTime} ({selectedService.duration} mins)
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Location
                </p>
                <p className="font-bold text-slate-900">
                  {selectedProvider.location?.city || "Remote/Home Service"}
                </p>
              </div>
            </div>
          </div>

          {bookingNotes && (
            <div className="border-t border-slate-50 p-6 bg-slate-50/20">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                My Notes
              </p>
              <p className="text-sm text-slate-600 italic">“{bookingNotes}”</p>
            </div>
          )}
        </div>

        {/* Pricing Breakdown */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
          <h4 className="font-outfit font-bold text-slate-900">
            Price Breakdown
          </h4>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">
                {selectedService.name} Base Price
              </span>
              <span className="font-bold text-slate-900">
                ₦{(selectedService.price / 100).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm py-3 border-y border-dashed border-slate-100">
              <span className="text-rose-600 font-bold">Deposit Due Now</span>
              <span className="font-black text-rose-600 font-outfit text-lg">
                ₦{(selectedService.depositAmount / 100).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm pt-1">
              <span className="text-slate-500">Balance Due at Appointment</span>
              <span className="font-bold text-slate-900">
                ₦
                {(
                  (selectedService.price - selectedService.depositAmount) /
                  100
                ).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="rounded-2xl bg-amber-50 p-4 border border-amber-100 flex gap-3">
            <AlertTriangle className="text-amber-500 shrink-0" size={18} />
            <p className="text-xs font-medium leading-relaxed text-amber-800">
              <span className="font-bold">Cancellation Policy:</span>{" "}
              Cancellations made within 24 hours of the appointment time will
              forfeit the deposit.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-2xl text-blue-700">
          <ShieldCheck size={18} />
          <span className="text-[10px] font-black uppercase tracking-widest">
            Secure Payment Powered by Paystack
          </span>
        </div>
      </div>

      <div className="mt-12 flex items-center justify-between border-t border-slate-100 pt-8">
        <button
          onClick={prevStep}
          disabled={isSubmitting}
          className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors disabled:opacity-50"
        >
          ← Edit Details
        </button>
        <button
          onClick={handleConfirm}
          disabled={isSubmitting}
          className="flex items-center gap-3 rounded-full bg-slate-900 px-12 py-4 text-base font-bold text-white transition-all hover:bg-rose-600 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Processing...
            </>
          ) : (
            `Confirm & Pay ₦${(selectedService.depositAmount / 100).toLocaleString()}`
          )}
        </button>
      </div>
    </div>
  );
}
