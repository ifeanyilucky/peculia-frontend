"use client";

import { useState, useEffect, useCallback } from "react";
import { useBookingStore } from "@/store/booking.store";
import { paymentService } from "@/services/payment.service";
import {
  Loader2,
  CreditCard,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { sileo } from "sileo";

export default function BookingPaymentStep() {
  const { lastCreatedBooking, nextStep } = useBookingStore();
  const [isInitializing, setIsInitializing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [paymentRef, setPaymentRef] = useState<string | null>(null);

  const handleInitializePayment = async () => {
    if (!lastCreatedBooking) return;

    setIsInitializing(true);
    try {
      const { authorizationUrl, reference } =
        await paymentService.initializePayment(lastCreatedBooking.id);
      setPaymentRef(reference);

      // Focus-friendly approach: open in same tab to avoid popup blockers,
      // but the prompt says "new tab or redirect", so let's do redirect for better mobile UX.
      window.location.href = authorizationUrl;
    } catch (error) {
      console.error("Payment initialization failed:", error);
      sileo.error({
        title: "Payment Error",
        description: "Failed to initialize payment gateway. Please try again.",
      });
    } finally {
      setIsInitializing(false);
    }
  };

  // Poll for verification if we have a reference (e.g. user returned from payment)
  const verifyPayment = useCallback(async () => {
    if (!paymentRef) return;

    setIsVerifying(true);
    try {
      const payment = await paymentService.verifyPayment(paymentRef);
      if (payment.status === "success") {
        sileo.success({
          title: "Payment Confirmed",
          description: "Your deposit payment was successful.",
        });
        nextStep(); // Go to success screen
      } else if (payment.status === "failed") {
        sileo.error({
          title: "Payment Failed",
          description: "The transaction was not successful. Please try again.",
        });
      }
    } catch (error) {
      console.error("Payment verification failed:", error);
    } finally {
      setIsVerifying(false);
    }
  }, [paymentRef, nextStep]);

  // Check URL for reference on mount (e.g. after redirect back)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const trxref = urlParams.get("trxref") || urlParams.get("reference");

    if (trxref) {
      setPaymentRef(trxref);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (paymentRef) {
      verifyPayment();
    }
  }, [paymentRef, verifyPayment]);

  if (!lastCreatedBooking) return null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-10">
        <h2 className="font-outfit text-2xl font-bold text-slate-900">
          Secure Your Appointment
        </h2>
        <p className="mt-2 text-slate-500">
          Pay the deposit to confirm your booking with{" "}
          {typeof lastCreatedBooking.providerProfileId !== "string"
            ? lastCreatedBooking.providerProfileId.businessName
            : "the professional"}
          .
        </p>
      </div>

      <div className="mx-auto max-w-md space-y-8">
        <div className="rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-xl shadow-slate-100">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-rose-50 text-rose-600">
            <CreditCard size={32} />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-black uppercase tracking-widest text-slate-400">
              Total Deposit
            </p>
            <p className="font-outfit text-5xl font-black text-slate-900">
              ₦{(lastCreatedBooking.depositAmount / 100).toLocaleString()}
            </p>
            <p className="text-xs font-bold text-slate-400">
              Transaction ID: {lastCreatedBooking.bookingRef}
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <button
              onClick={handleInitializePayment}
              disabled={isInitializing || isVerifying}
              className="flex w-full items-center justify-center gap-3 rounded-full bg-slate-900 py-4 text-base font-bold text-white transition-all hover:bg-rose-600 disabled:opacity-70"
            >
              {isInitializing ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Redirecting...
                </>
              ) : (
                <>
                  Pay Deposit Now
                  <ExternalLink size={18} />
                </>
              )}
            </button>

            {isVerifying && (
              <div className="flex items-center justify-center gap-2 text-sm font-bold text-rose-600">
                <Loader2 className="animate-spin" size={16} />
                Verifying Payment Status...
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4 px-4">
          <div className="flex gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600">
              <ShieldCheck size={14} />
            </div>
            <p className="text-xs font-medium text-slate-500 leading-relaxed">
              Payments are encrypted and processed securely by{" "}
              <span className="font-bold text-slate-800">Paystack</span>. Your
              credit card information is never stored on our servers.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600">
              <AlertCircle size={14} />
            </div>
            <p className="text-xs font-medium text-slate-500 leading-relaxed">
              Once payment is confirmed, you will receive an email with your
              appointment details and the provider will be notified.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
