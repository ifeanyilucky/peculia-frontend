"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { bookingService } from "@/services/booking.service";
import { format } from "date-fns";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  ShieldCheck,
  FileText,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

export default function BookingDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const {
    data: booking,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["booking", id],
    queryFn: () => bookingService.getBookingById(id as string),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
          <div className="absolute inset-0 rounded-full border-4 border-rose-600 border-t-transparent animate-spin" />
        </div>
        <p className="text-sm font-black uppercase tracking-widest text-slate-400">
          Loading details...
        </p>
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <div className="h-20 w-20 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-6">
          <AlertCircle size={40} />
        </div>
        <h2 className="font-peculiar text-3xl font-bold text-slate-900">
          Booking not found
        </h2>
        <p className="mt-4 text-slate-500 max-w-sm">
          We couldn't retrieve the details for this booking. It might have been
          deleted or the link is invalid.
        </p>
        <button
          onClick={() => router.back()}
          className="mt-8 rounded-full bg-slate-900 px-8 py-3 font-bold text-white hover:bg-rose-600 transition-all"
        >
          Go Back
        </button>
      </div>
    );
  }

  const timelineSteps = [
    {
      label: "Booked",
      date: booking.createdAt,
      status: "completed",
      icon: CalendarDays,
    },
    {
      label: "Deposit Paid",
      date: booking.depositPaidAt,
      status: booking.depositPaid ? "completed" : "pending",
      icon: CreditCard,
    },
    {
      label: "In Session",
      date: null,
      status:
        booking.status === "in_progress" || booking.status === "completed"
          ? "completed"
          : "pending",
      icon: Clock,
    },
    {
      label: "Completed",
      date: booking.completedAt,
      status: booking.status === "completed" ? "completed" : "pending",
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Top Nav */}
      <button
        onClick={() => router.back()}
        className="group flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft
          size={18}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Back to History
      </button>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Left Side: Booking Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
            <div className="space-y-1">
              <span className="inline-block px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest mb-2">
                Reference: {booking.bookingRef}
              </span>
              <h1 className="font-peculiar text-4xl font-black text-slate-900">
                {booking.serviceName}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {booking.status === "pending_payment" && (
                <button className="rounded-full bg-rose-600 px-8 py-4 text-sm font-black text-white hover:bg-rose-700 transition-all shadow-xl shadow-rose-100">
                  Pay Deposit ₦{(booking.depositAmount / 100).toLocaleString()}
                </button>
              )}
              {booking.status === "confirmed" && (
                <button className="rounded-full border-2 border-slate-100 bg-white px-8 py-4 text-sm font-black text-slate-500 hover:text-rose-600 hover:border-rose-100 transition-all">
                  Request Change
                </button>
              )}
            </div>
          </div>

          {/* Timeline Widget */}
          <div className="rounded-2xl bg-white border border-slate-100 p-8 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-8 border-b border-slate-50 pb-4">
              Booking Journey
            </h3>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative">
              {/* Connector line (desktop) */}
              <div className="absolute top-[1.125rem] left-0 w-full h-0.5 bg-slate-50 hidden md:block" />

              {timelineSteps.map((step, i) => (
                <div
                  key={step.label}
                  className="relative z-10 flex flex-row md:flex-col items-center gap-4 text-left md:text-center flex-1"
                >
                  <div
                    className={cn(
                      "h-9 w-9 rounded-full flex items-center justify-center border-4 border-white shadow-md transition-all duration-500",
                      step.status === "completed"
                        ? "bg-slate-900 text-white scale-110"
                        : "bg-slate-50 text-slate-300",
                    )}
                  >
                    <step.icon size={16} strokeWidth={3} />
                  </div>
                  <div className="space-y-1">
                    <p
                      className={cn(
                        "text-xs font-black uppercase tracking-widest",
                        step.status === "completed"
                          ? "text-slate-900"
                          : "text-slate-300",
                      )}
                    >
                      {step.label}
                    </p>
                    {step.date && (
                      <p className="text-[10px] font-bold text-slate-400">
                        {format(new Date(step.date), "MMM d")}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Details Card */}
          <div className="rounded-2xl bg-white border border-slate-100 overflow-hidden shadow-sm">
            <div className="p-8 lg:p-10 grid gap-10 md:grid-cols-2">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                    <CalendarDays size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Appointment Date
                    </p>
                    <p className="text-lg font-bold text-slate-900">
                      {format(
                        new Date(booking.scheduledDate),
                        "EEEE, MMMM do, yyyy",
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Time & Duration
                    </p>
                    <p className="text-lg font-bold text-slate-900">
                      {booking.startTime} (
                      {booking.endTime && "to " + booking.endTime})
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Location
                    </p>
                    <p className="text-lg font-bold text-slate-900">
                      Provider Address or Remote
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                    <FileText size={14} />
                    My Notes
                  </div>
                  <p className="text-sm font-medium text-slate-600 italic leading-relaxed">
                    {booking.notes || "No additional instructions provided."}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/5 p-8 lg:p-10 border-t border-slate-100">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
                <CreditCard size={14} />
                Payment Summary
              </div>

              <div className="max-w-md space-y-3">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-slate-500">Service Fee</span>
                  <span className="text-slate-900">
                    ₦{(booking.servicePrice / 100).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold border-b border-white/50 pb-3">
                  <span className="text-rose-600">Deposit Paid</span>
                  <span className="text-rose-600">
                    - ₦{(booking.depositAmount / 100).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-end pt-2">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Remaining Balance
                  </span>
                  <span className="text-3xl font-peculiar font-black text-slate-900">
                    ₦
                    {(
                      (booking.servicePrice - booking.depositAmount) /
                      100
                    ).toLocaleString()}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-bold italic pt-2">
                  To be paid directly to the professional at the appointment.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Professional Card */}
        <div className="space-y-6">
          <h3 className="font-peculiar text-xl font-bold text-slate-900 px-2">
            Managed By
          </h3>

          <div className="rounded-2xl bg-white border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative h-24 w-24 rounded-[2rem] bg-slate-900 overflow-hidden border-4 border-white shadow-2xl mb-4">
                {/* Placeholder avatar */}
              </div>
              <h4 className="text-xl font-black text-slate-900">
                Professional Business
              </h4>
              <p className="text-sm font-medium text-slate-500">
                Beauty & Esthetics Professional
              </p>

              <div className="flex items-center gap-1.5 mt-2">
                <ShieldCheck size={14} className="text-green-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-green-600">
                  Verified Pro
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4">
              <button className="flex items-center justify-center gap-2 h-12 rounded-xl bg-slate-50 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-all">
                <MessageSquare size={16} />
                Chat
              </button>
              <Link
                href="/explore"
                className="flex items-center justify-center gap-2 h-12 rounded-xl border border-slate-100 text-xs font-black uppercase tracking-widest text-slate-500 hover:border-slate-300 transition-all"
              >
                Profile
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] bg-rose-50/50 border border-rose-100 p-6 flex gap-4">
            <div className="h-10 w-10 shrink-0 rounded-full bg-rose-600 text-white flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-black uppercase tracking-widest text-rose-600">
                Peculia Assurance
              </h4>
              <p className="text-[11px] font-medium text-rose-800/60 leading-relaxed">
                Your booking is protected. If the professional cancels, your
                deposit will be refunded automatically.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
