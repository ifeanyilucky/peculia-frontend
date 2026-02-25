"use client";

import { useQuery } from "@tanstack/react-query";
import { providerService } from "@/services/provider.service";
import { useBookingStore } from "@/store/booking.store";
import { useEffect, useState, useCallback, useRef } from "react";
import BookingHeader from "@/components/features/booking/BookingHeader";
import BookingSummarySidebar from "@/components/features/booking/BookingSummarySidebar";
import BookingConfirmation from "@/components/features/booking/BookingConfirmation";
import { Loader2, Clock } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { PaystackConsumer } from "react-paystack";

const TIMEOUT_MINUTES = 10;

interface PaystackConfig {
  reference: string;
  email: string;
  amount: number;
  publicKey: string;
  accessCode?: string;
  onSuccess: (trans: { reference: string }) => void;
  onClose: () => void;
}

function BookingContent({
  provider,
  slug,
  initializePayment,
  timeLeft,
  isTimedOut,
  setTimeLeft,
  setIsTimedOut,
  formatTime,
  handleStartOver,
}: {
  provider: any;
  slug: string;
  initializePayment: (config: PaystackConfig) => void;
  timeLeft: number | null;
  isTimedOut: boolean;
  setTimeLeft: React.Dispatch<React.SetStateAction<number | null>>;
  setIsTimedOut: React.Dispatch<React.SetStateAction<boolean>>;
  formatTime: (s: number) => string;
  handleStartOver: () => void;
}) {
  const { isAuthenticated, user } = useAuthStore();
  const { setSelectedProvider } = useBookingStore();

  useEffect(() => {
    if (provider) {
      setSelectedProvider(provider);
    }
  }, [provider, setSelectedProvider]);

  useEffect(() => {
    if (!timeLeft && timeLeft !== null && !isTimedOut) return;

    if (timeLeft === null && isAuthenticated && user?.phone) {
      setTimeLeft(TIMEOUT_MINUTES * 60);
    }
  }, [timeLeft, isAuthenticated, user?.phone]);

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
  }, [timeLeft, isTimedOut, setIsTimedOut]);

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

  return (
    <div className="min-h-screen bg-slate-50/30 flex flex-col">
      <BookingHeader currentStep={4} />

      {timeLeft !== null && !isTimedOut && timeLeft <= 60 && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-amber-700">
            <Clock size={18} className="animate-pulse" />
            <span className="font-bold text-sm">
              Time remaining to confirm: {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      )}

      <div className="mx-auto w-full max-w-7xl flex-1 px-6 py-12 lg:px-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
          <BookingConfirmation />

          {provider && (
            <BookingSummarySidebar
              provider={provider}
              currentStep={4}
              slug={slug}
              initializePayment={initializePayment}
            />
          )}
        </div>
      </div>

      {isTimedOut && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-6">
              <Clock className="w-8 h-8 text-rose-600" />
            </div>
            <h2 className="font-peculiar text-2xl font-black text-slate-900 mb-3">
              Session Timeout
            </h2>
            <p className="text-slate-600 mb-8">
              You didn't complete your booking within {TIMEOUT_MINUTES} minutes.
              Your selected slots may no longer be available.
            </p>
            <button
              onClick={handleStartOver}
              className="w-full py-4 px-6 rounded-full bg-rose-600 text-white font-bold hover:bg-rose-700 transition-colors"
            >
              Start New Booking
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookingConfirmPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();

  const { data: provider, isLoading } = useQuery({
    queryKey: ["provider", "public", slug],
    queryFn: () => providerService.getProviderPublicProfile(slug),
    enabled: !!slug,
  });

  const { isAuthenticated, user } = useAuthStore();

  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isTimedOut, setIsTimedOut] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartOver = () => {
    router.push(`/book/${slug}/services`);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8 bg-white">
        <Loader2 className="animate-spin text-rose-600" size={40} />
      </div>
    );
  }

  return (
    <PaystackConsumer
      config={{
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
      }}
    >
      {({ initializePayment }) => (
        <BookingContent
          provider={provider}
          slug={slug}
          initializePayment={initializePayment}
          timeLeft={timeLeft}
          isTimedOut={isTimedOut}
          setTimeLeft={setTimeLeft}
          setIsTimedOut={setIsTimedOut}
          formatTime={formatTime}
          handleStartOver={handleStartOver}
        />
      )}
    </PaystackConsumer>
  );
}
