"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams, useParams } from "next/navigation";
import {
  CheckCircle,
  Calendar,
  Clock,
  User,
  ArrowRight,
  Loader2,
  XCircle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { paymentService } from "@/services/payment.service";
import { bookingService } from "@/services/booking.service";
import { useBookingStore } from "@/store/booking.store";
import { formatCurrency } from "@/utils/formatters";
import { format } from "date-fns";
import confetti from "canvas-confetti";
import Link from "next/link";
import { motion } from "framer-motion";
import { AxiosError } from "axios";

const triggerConfetti = () => {
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#E11D48", "#FB7185", "#F43F5E"],
  });
};

function SuccessContent() {
  const searchParams = useSearchParams();
  const params = useParams();
  const slug = params?.slug as string;
  const reference = searchParams?.get("reference");
  const bookingId = searchParams?.get("bookingId");
  const { resetBookingFlow } = useBookingStore();

  const [verificationStatus, setVerificationStatus] = useState<
    "verifying" | "success" | "error"
  >("verifying");
  const [errorMsg, setErrorMsg] = useState("");
  const hasTriggeredRes = useRef(false);

  // 1. Verify Payment if reference exists
  const {
    data: paymentResult,
    isLoading: isVerifying,
    isError: isVerifyError,
    error: verifyError,
  } = useQuery({
    queryKey: ["payment-verify", reference, bookingId],
    queryFn: () =>
      paymentService.verifyPayment(reference!, bookingId || undefined),
    enabled: !!reference,
    retry: 1,
  });

  // 2. Fetch Booking Details
  const activeBookingId = reference ? paymentResult?.bookingId : bookingId;
  const { data: booking, isLoading: isLoadingBooking } = useQuery({
    queryKey: ["booking-details", activeBookingId],
    queryFn: () => bookingService.getBookingById(activeBookingId as string),
    enabled: !!activeBookingId,
  });

  useEffect(() => {
    if (hasTriggeredRes.current) return;

    if (reference) {
      if (isVerifyError) {
        setTimeout(() => {
          setVerificationStatus("error");
          const errorData = (verifyError as AxiosError<{ message: string }>)
            ?.response?.data;
          setErrorMsg(
            errorData?.message ||
              "We couldn't verify your payment. Please contact support if you were charged.",
          );
        }, 0);
        hasTriggeredRes.current = true;
      } else if (paymentResult?.status === "success") {
        setTimeout(() => {
          setVerificationStatus("success");
          triggerConfetti();
          resetBookingFlow();
        }, 0);
        hasTriggeredRes.current = true;
      } else if (paymentResult?.status === "failed") {
        setTimeout(() => {
          setVerificationStatus("error");
          setErrorMsg(
            "Your payment was not successful. Please try again or contact support.",
          );
        }, 0);
        hasTriggeredRes.current = true;
      }
    } else if (bookingId && booking) {
      setTimeout(() => {
        setVerificationStatus("success");
        triggerConfetti();
        resetBookingFlow();
      }, 0);
      hasTriggeredRes.current = true;
    }
  }, [
    reference,
    paymentResult,
    isVerifyError,
    verifyError,
    bookingId,
    booking,
    resetBookingFlow,
  ]);

  if (isVerifying || isLoadingBooking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="animate-spin text-slate-900" size={48} />
        <p className="text-slate-500 font-medium">Verifying your booking...</p>
      </div>
    );
  }

  if (verificationStatus === "error") {
    return (
      <div className="max-w-md mx-auto mt-20 text-center px-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-rose-50 text-rose-600 mb-6">
          <XCircle size={40} />
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-4">
          Payment Failed
        </h1>
        <p className="text-slate-500 mb-8">{errorMsg}</p>
        <Link
          href={`/book/${slug}/confirm`}
          className="inline-flex items-center justify-center w-full bg-slate-900 text-white rounded-full py-4 font-black hover:bg-slate-800 transition-all"
        >
          Try Again
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 12, delay: 0.2 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 mb-6"
        >
          <CheckCircle size={40} />
        </motion.div>
        <h1 className="font-peculiar text-4xl font-black text-slate-900 tracking-tight mb-3">
          Appointment Confirmed!
        </h1>
        <p className="text-slate-500 font-medium max-w-sm mx-auto">
          We&apos;ve sent a confirmation email to your inbox. You can also view
          details in your dashboard.
        </p>
      </motion.div>

      {/* Summary Card */}
      {booking && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-4xl border border-slate-100 overflow-hidden mb-8"
        >
          <div className="p-8 border-b border-slate-50">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
              Booking ID: {booking.bookingRef}
            </p>
            <div className="space-y-6">
              {/* Pro & Location */}
              <div className="flex items-start gap-4">
                <div className="mt-1 p-2.5 rounded-xl bg-slate-50 text-slate-600">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 leading-tight">
                    {typeof booking.providerProfileId === "object"
                      ? (booking.providerProfileId as any).businessName
                      : "Provider"}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {typeof booking.providerProfileId === "object"
                      ? (booking.providerProfileId as any).location?.address
                      : ""}
                  </p>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50">
                  <Calendar size={18} className="text-slate-400" />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">
                      Date
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      {booking.scheduledDate
                        ? format(new Date(booking.scheduledDate), "EEE, MMM d")
                        : "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50">
                  <Clock size={18} className="text-slate-400" />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">
                      Time
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      {booking.startTime}
                    </p>
                  </div>
                </div>
              </div>

              {/* Services */}
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase">
                  Services
                </p>
                {booking.services.map(
                  (s: { serviceId: string; name: string; price: number }) => (
                    <div
                      key={s.serviceId}
                      className="flex justify-between items-center"
                    >
                      <span className="text-sm font-medium text-slate-600">
                        {s.name}
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        {formatCurrency(s.price / 100)}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>

          <div className="px-8 py-6 bg-slate-50/50 flex items-center justify-between">
            <span className="text-sm font-black text-slate-900">
              Total Paid
            </span>
            <span className="text-xl font-black text-rose-600">
              {formatCurrency((booking.servicePrice || 0) / 100)}
            </span>
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Link
          href="/dashboard"
          className="flex-1 inline-flex items-center justify-center bg-slate-900 text-white rounded-full py-4 font-black hover:bg-slate-800 transition-all active:scale-95 group"
        >
          View Dashboard
          <ArrowRight
            size={18}
            className="ml-2 group-hover:translate-x-1 transition-transform"
          />
        </Link>
        <Link
          href="/"
          className="flex-1 inline-flex items-center justify-center bg-white border border-slate-200 text-slate-900 rounded-full py-4 font-black hover:bg-slate-50 transition-all active:scale-95"
        >
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50/30">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <Loader2 className="animate-spin text-slate-900" size={48} />
            <p className="text-slate-500 font-medium">Loading...</p>
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </div>
  );
}
