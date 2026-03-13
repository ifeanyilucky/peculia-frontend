"use client";

import { Provider } from "@/types/provider.types";
import Image from "next/image";
import { useBookingStore } from "@/store/booking.store";
import { useAuthStore } from "@/store/auth.store";
import { useUIStore } from "@/store/ui.store";
import { useRouter } from "next/navigation";
import { formatCurrency, formatNumber } from "@/utils/formatters";
import { useState, useCallback, useEffect, useRef } from "react";
import { bookingService } from "@/services/booking.service";
import { format } from "date-fns";
import { Loader2, User as UserIcon, RefreshCw } from "lucide-react";
import AddPhoneModal from "@/components/features/booking/AddPhoneModal";
import { paymentService } from "@/services/payment.service";
import CenterModal from "@/components/common/CenterModal";
import { openPaystackModal } from "@/utils/paystack";
import { useCaptcha } from "@/hooks/useCaptcha";

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
    selectedDate,
    resetBookingFlow,
    setSelectedProvider,
    policyAccepted,
  } = useBookingStore();
  const { user } = useAuthStore();

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
  /** True when the user closed the Paystack popup without completing payment.
   * We keep paymentData alive so they can resume without creating a new booking. */
  const [paymentPaused, setPaymentPaused] = useState(false);
  const { openModal } = useUIStore();
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [paymentData, setPaymentData] = useState<{
    access_code: string;
    reference: string;
    bookingId: string;
    amount: number;
  } | null>(null);
  /** Ref-based in-flight lock — prevents double submits that slip through
   * React's async re-render cycle before `isBooking` state updates. */
  const isSubmittingRef = useRef(false);

  // CAPTCHA for bot protection
  const { token: captchaToken, executeCaptcha, isEnabled: isCaptchaEnabled } = useCaptcha("booking");

  // Directly call openPaystackModal without depending on a useEffect cycle
  const triggerPaymentModal = useCallback(
    (
      accessCode: string,
      reference: string,
      bookingId: string,
      amount: number,
    ) => {
      if (!user?.email) {
        setBookingError("Your session appears to be missing email data.");
        return;
      }

      openPaystackModal({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
        email: user.email,
        amount: Math.round(amount),
        access_code: accessCode,
        onClose: () => {
          setPaymentPaused(true);
        },
        callback: (response) => {
          router.push(
            `/book/${slug}/success?bookingId=${bookingId}&reference=${response.reference}`,
          );
          setPaymentData(null);
          setPaymentPaused(false);
        },
      });
    },
    [user?.email, router, slug],
  );

  /** Resume an existing payment — re-opens the Paystack popup with the same
   * access_code, no new booking or payment record is created. */
  const handleResumePayment = useCallback(() => {
    if (!paymentData) return;
    setPaymentPaused(false);
    triggerPaymentModal(
      paymentData.access_code,
      paymentData.reference,
      paymentData.bookingId,
      paymentData.amount,
    );
  }, [paymentData, triggerPaymentModal]);

  const isStepComplete = () => {
    if (currentStep === 1) return selectedServices.length > 0;
    // Step 2 is Professional Selection. A specific professional is optional (can be null for "Any").
    // We only need to ensure services are selected.
    if (currentStep === 2) return selectedServices.length > 0;
    // Step 3 is Time Selection. We need a slot chosen.
    if (currentStep === 3) return selectedServices.length > 0 && !!selectedSlot;
    if (currentStep === 4) {
      // selectedDate may be a string (Zustand JSON deserialization from localStorage)
      // so we coerce it and validate it's a real date before allowing submit.
      const rawDate = selectedDate;
      const dateIsValid =
        !!rawDate && !isNaN(new Date(rawDate as string | Date).getTime());
      return (
        selectedServices.length > 0 &&
        dateIsValid &&
        !!selectedSlot &&
        selectedProvider?._id === provider._id &&
        policyAccepted // Must accept policy to proceed
      );
    }
    return false;
  };

  const [bookingError, setBookingError] = useState<string | null>(null);

  const submitBooking = useCallback(async (): Promise<void> => {
    // Ref-based guard prevents double-submits that slip through before React
    // re-renders with the updated `isBooking` state (e.g. rapid tap on mobile).
    if (!selectedSlot || isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsBooking(true);
    setBookingError(null);
    try {
      // Coerce selectedDate to a real Date — Zustand persists Date as an ISO
      // string in localStorage, so after hydration it comes back as a string.
      // Passing a raw string to date-fns format() produces "Invalid Date".
      const rawDate = useBookingStore.getState().selectedDate;
      const safeDate = rawDate ? new Date(rawDate) : null;
      if (!safeDate || isNaN(safeDate.getTime())) {
        setBookingError("Please go back and re-select your date.");
        return;
      }

      const booking = await bookingService.createBooking({
        providerProfileId: provider._id,
        serviceIds: selectedServices.map((s) => s.id),
        teamMemberId: selectedTeamMember?._id,
        scheduledDate: format(safeDate, "yyyy-MM-dd"),
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        policyAccepted: policyAccepted,
        policyVersion: "1.0",
        captchaToken: isCaptchaEnabled ? (await executeCaptcha()) || undefined : undefined,
      });

      if (booking.status === "pending_payment") {
        const payment = await paymentService.initializePayment(
          booking.id || booking._id!,
        );

        if (payment.alreadyPaid) {
          router.push(
            `/book/${slug}/success?bookingId=${booking.id || booking._id!}&reference=${payment.reference}`,
          );
          return;
        }

        setPaymentData({
          access_code: payment.access_code,
          reference: payment.reference,
          bookingId: booking.id || booking._id!,
          amount: booking.depositAmount,
        });
        setPaymentPaused(false);
        // Trigger Paystack directly here
        triggerPaymentModal(
          payment.access_code,
          payment.reference,
          booking.id || booking._id!,
          booking.depositAmount,
        );
      } else {
        router.push(
          `/book/${slug}/success?bookingId=${booking.id || booking._id!}`,
        );
      }
    } catch (error: unknown) {
      console.error("Booking failed:", error);
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ||
        (error as { message?: string })?.message ||
        "Something went wrong. Please try again.";
      setBookingError(msg);
    } finally {
      setIsBooking(false);
      isSubmittingRef.current = false;
    }
  }, [
    selectedSlot,
    selectedServices,
    selectedTeamMember,
    provider?._id,
    slug,
    router,
    triggerPaymentModal,
  ]);

  const handleContinue = async () => {
    // Read fresh auth state to avoid stale closures after modal login
    const { isAuthenticated: freshAuth, user: freshUser } =
      useAuthStore.getState();

    if (currentStep === 1) {
      router.push(`/book/${slug}/professional`);
    } else if (currentStep === 2) {
      router.push(`/book/${slug}/time`);
    } else if (currentStep === 3) {
      if (!selectedSlot) return;

      if (!freshAuth) {
        openModal("booking-auth", { onSuccess: () => handleContinue() });
        return;
      }

      if (!freshUser?.phone) {
        setShowPhoneModal(true);
        return;
      }

      router.push(`/book/${slug}/confirm`);
    } else if (currentStep === 4) {
      if (!selectedSlot) return;

      if (!freshAuth) {
        openModal("booking-auth", { onSuccess: () => handleContinue() });
        return;
      }
      if (!freshUser?.phone) {
        setShowPhoneModal(true);
        return;
      }

      await submitBooking();
    }
  };

  return (
    <>
      <aside className="w-full lg:w-[400px] lg:shrink-0 h-fit lg:sticky lg:top-28">
        <div className="rounded-2xl border border-secondary bg-white flex flex-col min-h-[500px]">
          <div className="p-6 flex items-start gap-4 border-b border-secondary">
            <div>
              <h3 className="font-bold text-primary leading-tight">
                {provider.businessName}
              </h3>
              <p className="text-sm font-medium text-muted-foreground">
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
                          : "text-secondary"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs font-bold text-muted-foreground">
                  ({formatNumber(provider.totalReviews)})
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 p-6 space-y-6">
            {currentStep >= 1 && selectedServices.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  Services
                </h4>
                <div className="space-y-3">
                  {selectedServices.map((service) => (
                    <div
                      key={service.id}
                      className="flex justify-between items-start"
                    >
                      <div>
                        <p className="font-bold text-primary">{service.name}</p>
                        <p className="text-xs text-muted-foreground font-medium">
                          {service.duration} mins
                        </p>
                      </div>
                      <p className="font-bold text-primary">
                        {formatCurrency(service.price)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep >= 2 && selectedSlot && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  Date & Time
                </h4>
                <div className="bg-secondary/50 rounded-xl p-4">
                  <p className="font-bold text-primary">
                    {format(
                      useBookingStore.getState().selectedDate!,
                      "EEEE, MMM d, yyyy",
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground font-medium mt-1">
                    {selectedSlot.startTime} - {selectedSlot.endTime}
                  </p>
                </div>
              </div>
            )}

            {currentStep >= 3 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  Professional
                </h4>
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-secondary/50">
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
                        <UserIcon size={20} className="text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-primary text-sm">
                      {selectedTeamMember
                        ? `${selectedTeamMember.firstName} ${selectedTeamMember.lastName}`
                        : "Any professional"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4 pt-4 border-t border-secondary/50">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-muted-foreground">
                    Service Price
                  </span>
                  <span className="font-bold text-primary">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-emerald-600">
                    Deposit Due Now (20%)
                  </span>
                  <span className="font-bold text-emerald-600">
                    {formatCurrency(totalPrice * 0.2)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-secondary">
                  <span className="font-black text-primary">Pay In Person</span>
                  <span className="font-black text-xl text-primary">
                    {formatCurrency(totalPrice * 0.8)}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-secondary">
            {/* Booking error banner */}
            {bookingError && (
              <div className="mb-3 rounded-2xl bg-secondary border border-secondary p-4">
                <p className="text-sm font-bold text-primary">{bookingError}</p>
              </div>
            )}

            {/* Resume Payment banner — shown when user closed the popup mid-flow */}
            {paymentPaused && paymentData && (
              <div className="mb-3 rounded-2xl bg-amber-50 border border-amber-200 p-4">
                <p className="text-sm font-bold text-amber-800 mb-2">
                  Payment not completed
                </p>
                <p className="text-xs text-amber-700 mb-3">
                  Your booking is saved. Click below to complete your payment.
                </p>
                <button
                  onClick={handleResumePayment}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-amber-600 text-white font-bold text-sm hover:bg-amber-700 transition-colors"
                >
                  <RefreshCw size={16} />
                  Resume Payment
                </button>
              </div>
            )}

            {currentStep === 4 ? (
              <>
                <button
                  onClick={handleContinue}
                  disabled={isBooking || !isStepComplete() || paymentPaused}
                  className="w-full py-4 px-6 rounded-full bg-primary text-white font-bold hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                {!policyAccepted && selectedSlot && (
                  <p className="text-xs text-secondary0 text-center mt-2 font-medium">
                    Please accept the deposit protection policy to continue
                  </p>
                )}
              </>
            ) : (
              <button
                onClick={handleContinue}
                disabled={!isStepComplete()}
                className="w-full py-4 px-6 rounded-full bg-primary text-white font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            )}

            {currentStep < 4 && (
              <p className="text-center text-xs font-medium text-muted-foreground mt-3">
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
          <p className="text-foreground mb-6">
            You can cancel for free up to 24 hours before your appointment. Late
            cancellations may incur a fee.
          </p>
          <button
            onClick={() => setShowCancellationModal(false)}
            className="px-8 py-3 rounded-full bg-primary text-white font-bold"
          >
            Got it
          </button>
        </div>
      </CenterModal>

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
