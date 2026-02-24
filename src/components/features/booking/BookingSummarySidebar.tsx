"use client";

import { Provider } from "@/types/provider.types";
import Image from "next/image";
import { useBookingStore } from "@/store/booking.store";
import { useAuthStore } from "@/store/auth.store";
import { useRouter, useParams } from "next/navigation";
import { formatCurrency, formatNumber } from "@/utils/formatters";
import { useState, useCallback } from "react";
import { bookingService } from "@/services/booking.service";
import { format } from "date-fns";
import { Loader2, User as UserIcon } from "lucide-react";
import BookingAuthModal from "@/components/features/booking/BookingAuthModal";
import AddPhoneModal from "@/components/features/booking/AddPhoneModal";

interface BookingSummarySidebarProps {
  provider: Provider;
  currentStep: number;
}

export default function BookingSummarySidebar({
  provider,
  currentStep,
}: BookingSummarySidebarProps) {
  const router = useRouter();
  const params = useParams();
  const providerId = params?.providerId as string;
  const { selectedServices, totalPrice, selectedTeamMember, selectedSlot } =
    useBookingStore();
  const { isAuthenticated, user } = useAuthStore();

  const [isBooking, setIsBooking] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  const isStepComplete = () => {
    if (currentStep === 1) return selectedServices.length > 0;
    if (currentStep === 2) return selectedServices.length > 0;
    if (currentStep === 3) return !!selectedSlot;
    if (currentStep === 4) return true;
    return false;
  };

  /**
   * Core booking submission — called after auth + phone are guaranteed.
   * Extracted so it can be re-triggered from both modal onSuccess callbacks.
   */
  const submitBooking = useCallback(async () => {
    if (!selectedSlot) return;
    setIsBooking(true);
    try {
      const booking = await bookingService.createBooking({
        providerProfileId: provider._id,
        serviceIds: selectedServices.map((s) => s.id),
        teamMemberId: selectedTeamMember?._id,
        scheduledDate: format(
          useBookingStore.getState().selectedDate!,
          "yyyy-MM-dd",
        ),
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
      });
      router.push(`/book/${providerId}/success?bookingId=${booking.id}`);
    } catch (error) {
      console.error("Booking failed:", error);
    } finally {
      setIsBooking(false);
    }
  }, [
    selectedSlot,
    selectedServices,
    selectedTeamMember,
    provider._id,
    providerId,
    router,
  ]);

  const handleContinue = async () => {
    if (currentStep === 1) {
      router.push(`/book/${providerId}/professional`);
    } else if (currentStep === 2) {
      router.push(`/book/${providerId}/time`);
    } else if (currentStep === 3) {
      router.push(`/book/${providerId}/confirm`);
    } else if (currentStep === 4) {
      if (!selectedSlot) return;

      // ── Gate 1: Not authenticated → show auth modal ──
      if (!isAuthenticated) {
        setShowAuthModal(true);
        return;
      }

      // ── Gate 2: Authenticated but no phone → capture phone ──
      if (!user?.phone) {
        setShowPhoneModal(true);
        return;
      }

      // ── Gate 3: All good → submit directly ──
      await submitBooking();
    }
  };

  return (
    <aside className="w-full lg:w-[400px] lg:shrink-0 h-fit lg:sticky lg:top-28">
      <div className="rounded-4xl border border-slate-100 bg-white shadow-xl shadow-slate-200/50 flex flex-col min-h-[500px]">
        {/* Provider Profile Info */}
        <div className="p-6 flex items-start gap-4 border-b border-slate-100">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-100">
            <Image
              src={provider.userId.avatar || "/images/placeholder-avatar.png"}
              alt={provider.businessName}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 leading-tight">
              {provider.businessName}
            </h3>
            <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <span className="flex items-center text-yellow-500 font-bold">
                {provider.rating.toFixed(1)}
                <span className="ml-0.5 text-yellow-400">★</span>
              </span>
              <span className="text-slate-300">•</span>
              <span>({formatNumber(provider.totalReviews)})</span>
            </div>
            <p className="mt-1 text-xs text-slate-500 truncate">
              {provider.location?.address ||
                provider.location?.city ||
                "Address not provided"}
            </p>
          </div>
        </div>

        {/* Selected Services Info */}
        <div className="flex-1 p-6 flex flex-col">
          {selectedServices.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-sm font-medium text-slate-400">
              No services selected
            </div>
          ) : (
            <div className="flex-1 space-y-4 overflow-y-auto">
              <div className="space-y-4">
                {selectedServices.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-900">
                        {service.name}
                      </p>
                      <p className="text-[11px] font-medium text-slate-500">
                        {service.duration} mins •{" "}
                        {selectedTeamMember
                          ? `${selectedTeamMember.firstName} ${selectedTeamMember.lastName}`
                          : "Any professional"}
                      </p>
                    </div>
                    <p className="text-sm font-black text-slate-900 tabular-nums shrink-0 mt-0.5">
                      {formatCurrency(service.price / 100)}
                    </p>
                  </div>
                ))}
              </div>

              {selectedTeamMember && (
                <div className="mt-6 pt-6 border-t border-slate-50">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                    Chosen Professional
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                      {selectedTeamMember.avatar ? (
                        <Image
                          src={selectedTeamMember.avatar}
                          alt={selectedTeamMember.firstName}
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      ) : (
                        <UserIcon size={16} className="text-slate-400" />
                      )}
                    </div>
                    <p className="text-xs font-bold text-slate-900">
                      {selectedTeamMember.firstName}{" "}
                      {selectedTeamMember.lastName}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Total & Action Button */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 rounded-b-4xl">
          <div className="flex items-center justify-between font-peculiar text-xl font-black text-slate-900 mb-6">
            <span>Total</span>
            <span>
              {totalPrice > 0 ? `${formatCurrency(totalPrice / 100)}` : "free"}
            </span>
          </div>

          <button
            onClick={handleContinue}
            disabled={!isStepComplete() || isBooking}
            className="w-full rounded-full bg-slate-900 py-4 text-sm font-black text-white transition-all hover:bg-slate-800 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2"
          >
            {isBooking ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Processing...
              </>
            ) : currentStep === 4 ? (
              "Confirm & Pay"
            ) : (
              "Continue"
            )}
          </button>
        </div>
      </div>

      {/* ── Booking Auth Modal (unauthenticated users) ────────────── */}
      {showAuthModal && (
        <BookingAuthModal
          onSuccess={() => {
            setShowAuthModal(false);
            // After auth, check phone gate immediately
            const freshUser = useAuthStore.getState().user;
            if (!freshUser?.phone) {
              setShowPhoneModal(true);
            } else {
              submitBooking();
            }
          }}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {/* ── Add Phone Modal (authed users without phone) ────────────── */}
      {showPhoneModal && (
        <AddPhoneModal
          onSuccess={() => {
            setShowPhoneModal(false);
            submitBooking();
          }}
          onClose={() => setShowPhoneModal(false)}
        />
      )}
    </aside>
  );
}
