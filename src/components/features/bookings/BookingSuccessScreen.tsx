"use client";

import { useBookingStore } from "@/store/booking.store";
import { CheckCircle2, Calendar, Clock, ArrowRight, Home } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import Link from "next/link";

export default function BookingSuccessScreen() {
  const { lastCreatedBooking, resetBookingFlow } = useBookingStore();

  if (!lastCreatedBooking) return null;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center animate-in fade-in duration-700">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", damping: 12, stiffness: 200 }}
        className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-green-50 text-green-600"
      >
        <CheckCircle2 size={48} strokeWidth={2.5} />
      </motion.div>

      <div className="max-w-md space-y-4">
        <h2 className="font-outfit text-4xl font-black text-slate-900">
          Appointment Confirmed!
        </h2>
        <p className="text-lg font-medium text-slate-600">
          Your booking with{" "}
          <span className="font-bold text-slate-900">
            {lastCreatedBooking.providerProfileId?.businessName}
          </span>{" "}
          has been secured.
        </p>
      </div>

      <div className="mt-12 w-full max-w-sm overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl shadow-slate-100">
        <div className="bg-slate-50/50 p-6">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">
            Booking Reference
          </p>
          <p className="mt-1 font-mono text-lg font-bold text-rose-600">
            {lastCreatedBooking.bookingRef}
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 text-left">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
              <Calendar size={18} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                Date
              </p>
              <p className="font-bold text-slate-900">
                {format(
                  new Date(lastCreatedBooking.scheduledDate),
                  "EEEE, MMMM do",
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-left">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
              <Clock size={18} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                Time
              </p>
              <p className="font-bold text-slate-900">
                {lastCreatedBooking.startTime}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-50 p-6 bg-green-50/10">
          <p className="text-xs font-bold text-green-600">
            Deposit Paid: ₦
            {(lastCreatedBooking.depositAmount / 100).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-12 flex flex-col sm:flex-row gap-4">
        <Link
          href="/dashboard"
          onClick={resetBookingFlow}
          className="flex items-center justify-center gap-2 rounded-full bg-slate-900 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-rose-600 shadow-lg shadow-slate-200"
        >
          View My Bookings
          <ArrowRight size={18} />
        </Link>
        <Link
          href="/"
          onClick={resetBookingFlow}
          className="flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-4 text-sm font-bold text-slate-600 transition-all hover:bg-slate-50"
        >
          <Home size={18} />
          Back to Home
        </Link>
      </div>

      <p className="mt-12 max-w-xs text-xs leading-relaxed text-slate-400">
        A confirmation email has been sent to your registered address. Please
        arrive 5-10 minutes before your scheduled time.
      </p>
    </div>
  );
}
