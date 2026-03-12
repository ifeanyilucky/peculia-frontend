"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/axios";
import { paymentService } from "@/services/payment.service";
import { sileo } from "sileo";
import { Loader2, CheckCircle, XCircle, AlertCircle, Calendar, Scissors } from "lucide-react";
import Link from "next/link";

interface BookingDetails {
  bookingRef: string;
  status: string;
  paymentStatus: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  services: {
    name: string;
    price: number;
    duration: number;
  }[];
  servicePrice: number;
  depositAmount: number;
  depositPaid: boolean;
  provider: string;
  providerSlug: string;
  client: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function PaymentClient({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const searchParams = useSearchParams();
  const [bookingId, setBookingId] = useState<string>("");
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const reference = searchParams.get("reference");

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setBookingId(resolved.id);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) return;
      
      try {
        const response = await api.get(`/bookings/public/${bookingId}`);
        setBooking(response.data.data);
      } catch (error: any) {
        console.error("Failed to fetch booking:", error);
        sileo.error({
          title: "Error",
          description: "Unable to load booking details. The link may be invalid.",
        });
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  useEffect(() => {
    // Skip payment verification if no reference in URL
    if (!reference || !booking || booking.depositPaid) return;
    
    const verifyPayment = async () => {
      setProcessing(true);
      try {
        const result = await paymentService.verifyPayment(reference, bookingId);
        if (result.status === "success") {
          setBooking((prev) =>
            prev ? { ...prev, depositPaid: true, paymentStatus: "completed" } : null
          );
          sileo.success({
            title: "Payment Successful",
            description: "Your booking has been confirmed!",
          });
        }
      } catch (error: any) {
        // Silent fail - user can still try to pay again
        console.log("Payment verification:", error?.response?.status === 401 ? "Auth required, skipping" : error);
      } finally {
        setProcessing(false);
      }
    };
    verifyPayment();
  }, [reference, booking?.depositPaid]); // Only run when reference changes or deposit status changes

  const handlePayment = async () => {
    setProcessing(true);
    try {
      const payment = await paymentService.initializePayment(bookingId);
      if (payment.authorizationUrl) {
        window.location.href = payment.authorizationUrl;
      }
    } catch (error: any) {
      console.error("Payment initialization failed:", error);
      sileo.error({
        title: "Payment Failed",
        description: error?.response?.data?.message || "Please try again.",
      });
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-amber-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-slate-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-amber-50">
        <div className="max-w-md w-full mx-4 bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Booking Not Found</h1>
            <p className="text-slate-600 mb-6">
              This booking link is invalid or has expired.
            </p>
            <Link href="/">
              <button className="w-full h-12 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors">
                Go to Homepage
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isSlotTaken = ["expired", "cancelled_by_client", "cancelled_by_provider"].includes(booking.status);
  const isAlreadyPaid = booking.depositPaid || booking.paymentStatus === "completed";

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        {/* Status Banner */}
        {isSlotTaken && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6 flex items-start gap-4">
            <AlertCircle className="w-8 h-8 text-red-500 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-bold text-red-900">Slot No Longer Available</h2>
              <p className="text-red-700 mt-1">
                This booking slot has been taken or cancelled. Please book a new appointment.
              </p>
              <Link href="/explore">
                <button className="mt-4 h-12 px-6 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors">
                  Book Another Appointment
                </button>
              </Link>
            </div>
          </div>
        )}

        {isAlreadyPaid && !isSlotTaken && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6 flex items-start gap-4">
            <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-bold text-green-900">Booking Confirmed!</h2>
              <p className="text-green-700 mt-1">
                Your payment has been processed. You will receive a confirmation email shortly.
              </p>
            </div>
          </div>
        )}

        {/* Booking Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-rose-500 p-6 text-white">
            <p className="text-sm opacity-80">Booking Reference</p>
            <p className="text-2xl font-bold tracking-wider">{booking.bookingRef}</p>
            <p className="text-sm opacity-80 mt-2">{booking.provider}</p>
          </div>

          {/* Details */}
          <div className="p-6 space-y-6">
            {/* Date & Time */}
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">{formatDate(booking.scheduledDate)}</p>
                <p className="text-slate-600 text-sm">
                  {booking.startTime} - {booking.endTime}
                </p>
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Services</h3>
              <div className="space-y-2">
                {booking.services.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Scissors className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-700">{service.name}</span>
                    </div>
                    <span className="font-semibold text-slate-900">{formatCurrency(service.price)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Summary */}
            <div className="border-t border-slate-100 pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-600">Service Total</span>
                <span className="text-slate-900">{formatCurrency(booking.servicePrice)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-600">Deposit Required</span>
                <span className="font-bold text-primary text-lg">{formatCurrency(booking.depositAmount)}</span>
              </div>
              {booking.servicePrice > booking.depositAmount && (
                <div className="flex justify-between items-center text-sm text-slate-500">
                  <span>Remaining balance</span>
                  <span>Pay at venue: {formatCurrency(booking.servicePrice - booking.depositAmount)}</span>
                </div>
              )}
            </div>

            {/* Payment Button */}
            {!isAlreadyPaid && !isSlotTaken && (
              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full h-14 text-lg font-semibold bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </span>
                ) : (
                  `Pay ${formatCurrency(booking.depositAmount)} Deposit`
                )}
              </button>
            )}

            {/* Already Paid Message */}
            {isAlreadyPaid && !isSlotTaken && (
              <div className="text-center">
                <Link href="/bookings">
                  <button className="w-full h-12 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors">
                    View My Bookings
                  </button>
                </Link>
              </div>
            )}

            {/* Help Text */}
            <p className="text-center text-slate-500 text-sm">
              Need help?{" "}
              <Link href="/help" className="text-primary hover:underline">
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
