"use client";

import { Provider } from "@/types/provider.types";
import Image from "next/image";
import { useBookingStore } from "@/store/booking.store";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { formatCurrency, formatNumber } from "@/utils/formatters";
import { useState, useCallback, useEffect, useRef } from "react";
import { bookingService } from "@/services/booking.service";
import { format } from "date-fns";
import { Loader2, User as UserIcon } from "lucide-react";
import BookingAuthModal from "@/components/features/booking/BookingAuthModal";
import AddPhoneModal from "@/components/features/booking/AddPhoneModal";
import { paymentService } from "@/services/payment.service";
import CenterModal from "@/components/common/CenterModal";
import { usePaystackPayment } from "react-paystack";
import { useMemo } from "react";

interface BookingSummarySidebarProps {
  provider: Provider;
  currentStep: number;
  slug: string;
}

export default function BookingSummarySidebar({
  provider,
  currentStep,
  slug,
}: BookingSummarySidebarProps) {
  const router = useRouter();
  const {
    selectedServices,
    totalPrice,
    selectedTeamMember,
    selectedSlot,
    selectedProvider,
    resetBookingFlow,
    setSelectedProvider,
  } = useBookingStore();
  const { isAuthenticated, user } = useAuthStore();

  // Handle provider mismatch or initialization
  useEffect(() => {
    if (!selectedProvider || selectedProvider._id !== provider._id) {
      if (currentStep === 1) {
        // If we're on step 1, just set the provider
        setSelectedProvider(provider);
      } else {
        // If we're further in the flow but the provider is different/missing, reset
        resetBookingFlow();
        setSelectedProvider(provider);
        router.replace(`/book/${slug}/services`);
      }
    }
  }, [
    provider,
    selectedProvider,
    currentStep,
    setSelectedProvider,
    resetBookingFlow,
    router,
    slug,
  ]);

  const [isBooking, setIsBooking] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [paymentData, setPaymentData] = useState<{
    access_code: string;
    reference: string;
    bookingId: string;
  } | null>(null);
  const lastInitializedRef = useRef<string | null>(null);

  const paystackConfig = useMemo(
    () => ({
      publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
      email: user?.email || "",
      amount: totalPrice,
      // If we have an access_code, we use it (Backend initialized)
      // Note: access_code is prioritized by Paystack popup
      access_code: paymentData?.access_code,
      // Always pass the reference we expect to avoid Paystack generating a new one
      reference: paymentData?.reference,
    }),
    [user?.email, totalPrice, paymentData?.access_code, paymentData?.reference],
  );

  const initializePayment = usePaystackPayment(paystackConfig);

  const handlePaymentSuccess = useCallback(
    async (trans: { reference: string }) => {
      if (paymentData?.bookingId) {
        router.push(
          `/book/${slug}/success?bookingId=${paymentData.bookingId}&reference=${trans.reference}`,
        );
      }
      setPaymentData(null);
      lastInitializedRef.current = null;
    },
    [paymentData, router, slug],
  );

  const handlePaymentClose = useCallback(() => {
    setPaymentData(null);
    lastInitializedRef.current = null;
  }, []);

  useEffect(() => {
    if (paymentData && lastInitializedRef.current !== paymentData.reference) {
      lastInitializedRef.current = paymentData.reference;

      const timer = setTimeout(() => {
        // @ts-ignore
        initializePayment({
          onSuccess: handlePaymentSuccess,
          onClose: handlePaymentClose,
        });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [
    paymentData,
    initializePayment,
    handlePaymentSuccess,
    handlePaymentClose,
  ]);

  const isStepComplete = () => {
    const state = useBookingStore.getState();
    if (currentStep === 1) return selectedServices.length > 0;
    if (currentStep === 2) return selectedServices.length > 0;
    if (currentStep === 3) return selectedServices.length > 0;
    if (currentStep === 4) {
      return (
        selectedServices.length > 0 &&
        !!state.selectedDate &&
        !!selectedSlot &&
        state.selectedProvider?._id === provider._id
      );
    }
    return false;
  };

  const submitBooking = useCallback(async (): Promise<void> => {
    if (!selectedSlot || isBooking) return;
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

      if (booking.status === "pending_payment") {
        const payment = await paymentService.initializePayment(
          booking.id || booking._id!,
        );
        setPaymentData({
          access_code: payment.access_code,
          reference: payment.reference,
          bookingId: booking.id || booking._id!,
        });
      } else {
        router.push(
          `/book/${slug}/success?bookingId=${booking.id || booking._id!}`,
        );
      }
    } catch (error) {
      console.error("Booking failed:", error);
    } finally {
      setIsBooking(false);
    }
  }, [
    selectedSlot,
    selectedServices,
    selectedTeamMember,
    provider?._id,
    slug,
    router,
    isBooking,
  ]);

  const handleContinue = async () => {
    if (currentStep === 1) {
      router.push(`/book/${slug}/professional`);
    } else if (currentStep === 2) {
      router.push(`/book/${slug}/time`);
    } else if (currentStep === 3) {
      if (!selectedSlot) return;

      if (!isAuthenticated) {
        setShowAuthModal(true);
        return;
      }

      if (!user?.phone) {
        setShowPhoneModal(true);
        return;
      }

      router.push(`/book/${slug}/confirm`);
    } else if (currentStep === 4) {
      if (!selectedSlot) return;

      if (!isAuthenticated) {
        setShowAuthModal(true);
        return;
      }
      if (!user?.phone) {
        setShowPhoneModal(true);
        return;
      }

      await submitBooking();
    }
  };

  return (
    <>
      <aside className="w-full lg:w-[400px] lg:shrink-0 h-fit lg:sticky lg:top-28">
        <div className="rounded-2xl border border-slate-200 bg-white flex flex-col min-h-[500px]">
          <div className="p-6 flex items-start gap-4 border-b border-slate-200">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-200">
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
              <p className="text-sm font-medium text-slate-500">
                {provider.location?.city || "Nigeria"}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < Math.floor(provider.rating)
                          ? "text-yellow-400"
                          : "text-slate-200"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-500">
                  ({formatNumber(provider.totalReviews)})
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 p-6 space-y-6">
            {currentStep >= 1 && selectedServices.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Services
                </h4>
                <div className="space-y-3">
                  {selectedServices.map((service) => (
                    <div
                      key={service.id}
                      className="flex justify-between items-start"
                    >
                      <div>
                        <p className="font-bold text-slate-900">
                          {service.name}
                        </p>
                        <p className="text-xs text-slate-500 font-medium">
                          {service.duration} mins
                        </p>
                      </div>
                      <p className="font-bold text-slate-900">
                        {formatCurrency(service.price / 100)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep >= 2 && selectedSlot && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Date & Time
                </h4>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="font-bold text-slate-900">
                    {format(
                      useBookingStore.getState().selectedDate!,
                      "EEEE, MMM d, yyyy",
                    )}
                  </p>
                  <p className="text-sm text-slate-500 font-medium mt-1">
                    {selectedSlot.startTime} - {selectedSlot.endTime}
                  </p>
                </div>
              </div>
            )}

            {currentStep >= 3 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Professional
                </h4>
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-slate-100">
                    {selectedTeamMember?.avatar || provider.userId.avatar ? (
                      <Image
                        src={
                          selectedTeamMember?.avatar || provider.userId.avatar!
                        }
                        alt="Professional"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <UserIcon size={20} className="text-slate-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">
                      {selectedTeamMember
                        ? `${selectedTeamMember.firstName} ${selectedTeamMember.lastName}`
                        : "Any professional"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-500">Subtotal</span>
                  <span className="font-bold text-slate-900">
                    {formatCurrency(totalPrice / 100)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-500">Service Fee</span>
                  <span className="font-bold text-slate-900">
                    {formatCurrency(0)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                  <span className="font-black text-slate-900">Total</span>
                  <span className="font-black text-xl text-slate-900">
                    {formatCurrency(totalPrice / 100)}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-slate-200">
            {currentStep === 4 ? (
              <button
                onClick={handleContinue}
                disabled={isBooking || !isStepComplete() || isBooking}
                className="w-full py-4 px-6 rounded-full bg-rose-600 text-white font-bold hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isBooking ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Processing...
                  </>
                ) : (
                  "Confirm & Pay"
                )}
              </button>
            ) : (
              <button
                onClick={handleContinue}
                disabled={!isStepComplete()}
                className="w-full py-4 px-6 rounded-full bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            )}

            {currentStep < 4 && (
              <p className="text-center text-xs font-medium text-slate-400 mt-3">
                Step {currentStep} of 4
              </p>
            )}
          </div>
        </div>
      </aside>

      <CenterModal
        isOpen={showCancellationModal}
        onClose={() => setShowCancellationModal(false)}
        title="Cancellation Policy"
      >
        <div className="text-center">
          <p className="text-slate-600 mb-6">
            You can cancel for free up to 24 hours before your appointment. Late
            cancellations may incur a fee.
          </p>
          <button
            onClick={() => setShowCancellationModal(false)}
            className="px-8 py-3 rounded-full bg-slate-900 text-white font-bold"
          >
            Got it
          </button>
        </div>
      </CenterModal>

      {showAuthModal && (
        <BookingAuthModal
          onSuccess={() => {
            setShowAuthModal(false);
            if (currentStep === 4) {
              submitBooking();
            } else {
              handleContinue();
            }
          }}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {showPhoneModal && (
        <AddPhoneModal
          onSuccess={() => {
            setShowPhoneModal(false);
            if (currentStep === 4) {
              submitBooking();
            } else {
              handleContinue();
            }
          }}
          onClose={() => setShowPhoneModal(false)}
        />
      )}
    </>
  );
}
