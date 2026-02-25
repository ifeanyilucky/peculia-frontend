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
  Scissors,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { formatCurrency } from "@/utils/formatters";

/** Maps booking status to display-friendly label + color. */
const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; dot: string; bg: string }
> = {
  pending_payment: {
    label: "Action Required",
    color: "text-amber-600",
    dot: "bg-amber-400",
    bg: "bg-amber-50",
  },
  confirmed: {
    label: "Confirmed",
    color: "text-emerald-600",
    dot: "bg-emerald-400",
    bg: "bg-emerald-50",
  },
  in_progress: {
    label: "In Progress",
    color: "text-blue-600",
    dot: "bg-blue-400",
    bg: "bg-blue-50",
  },
  completed: {
    label: "Completed",
    color: "text-slate-600",
    dot: "bg-slate-300",
    bg: "bg-slate-50",
  },
  cancelled_by_client: {
    label: "Cancelled",
    color: "text-rose-500",
    dot: "bg-rose-400",
    bg: "bg-rose-50",
  },
  cancelled_by_provider: {
    label: "Cancelled by Pro",
    color: "text-rose-500",
    dot: "bg-rose-400",
    bg: "bg-rose-50",
  },
};

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
  console.log({ booking });
  /* ---- Loading State ---- */
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5">
        <div className="relative h-14 w-14">
          <div className="absolute inset-0 rounded-full border-[3px] border-slate-100" />
          <div className="absolute inset-0 rounded-full border-[3px] border-slate-900 border-t-transparent animate-spin" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          Loading booking…
        </p>
      </div>
    );
  }

  /* ---- Error State ---- */
  if (isError || !booking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6 gap-6">
        <div className="h-16 w-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center">
          <AlertCircle size={32} strokeWidth={1.5} />
        </div>
        <div className="space-y-2">
          <h2 className="font-peculiar text-3xl font-black text-slate-900">
            Booking not found
          </h2>
          <p className="text-slate-400 text-sm max-w-xs">
            We couldn&apos;t retrieve this booking. The link may be invalid or
            the booking has been removed.
          </p>
        </div>
        <button
          onClick={() => router.back()}
          className="h-12 px-8 rounded-xl bg-slate-900 text-white text-xs font-black uppercase tracking-widest hover:bg-rose-600 transition-all active:scale-95"
        >
          Go Back
        </button>
      </div>
    );
  }

  const status = STATUS_CONFIG[booking.status] || {
    label: booking.status,
    color: "text-slate-400",
    dot: "bg-slate-200",
    bg: "bg-slate-50",
  };

  const providerName =
    typeof booking.providerProfileId === "object"
      ? (booking.providerProfileId as any).businessName
      : "Professional";

  const providerInitial = providerName?.[0] ?? "P";

  const timelineSteps = [
    {
      label: "Booked",
      date: booking.createdAt,
      done: true,
      icon: CalendarDays,
    },
    {
      label: "Deposit Paid",
      date: booking.depositPaidAt,
      done: booking.depositPaid,
      icon: CreditCard,
    },
    {
      label: "In Session",
      date: null,
      done: booking.status === "in_progress" || booking.status === "completed",
      icon: Clock,
    },
    {
      label: "Completed",
      date: booking.completedAt,
      done: booking.status === "completed",
      icon: CheckCircle2,
    },
  ];

  const remainingBalance = (booking.servicePrice - booking.depositAmount) / 100;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Back Nav */}
      <button
        onClick={() => router.back()}
        className="group inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.15em] text-slate-400 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft
          size={16}
          strokeWidth={2.5}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Bookings
      </button>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-[0.15em]">
              {booking.bookingRef}
            </span>
            <span
              className={cn(
                "inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.15em]",
                status.bg,
                status.color,
              )}
            >
              <span className={cn("h-1.5 w-1.5 rounded-full", status.dot)} />
              {status.label}
            </span>
          </div>
          <h1 className="font-peculiar text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            {booking.services[0]?.name}
            {booking.services.length > 1 && (
              <span className="ml-3 text-slate-300 text-xl">
                +{booking.services.length - 1}
              </span>
            )}
          </h1>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-widest text-[11px]">
            {providerName}
          </p>
        </div>

        {/* CTA based on status */}
        <div className="flex items-center gap-3 shrink-0">
          {booking.status === "pending_payment" && (
            <button className="h-12 px-8 rounded-xl bg-slate-900 text-white text-xs font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg shadow-slate-900/5 active:scale-95">
              Pay {formatCurrency(booking.depositAmount / 100)}
            </button>
          )}
          {booking.status === "confirmed" && (
            <button className="h-12 px-6 rounded-xl border border-slate-200 text-slate-400 text-xs font-black uppercase tracking-widest hover:text-rose-500 hover:border-rose-100 transition-all active:scale-95">
              Request Change
            </button>
          )}
          {booking.status === "completed" && (
            <button className="h-12 px-8 rounded-xl bg-rose-600 text-white text-xs font-black uppercase tracking-widest hover:bg-rose-700 transition-all active:scale-95">
              Leave Review
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* ---- Left Column ---- */}
        <div className="lg:col-span-2 space-y-6">
          {/* Journey Timeline */}
          <div className="rounded-[1.5rem] bg-white border border-slate-100 p-6 lg:p-8">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">
              Booking Journey
            </p>
            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              {/* Hairline connector (desktop) */}
              <div className="absolute top-[18px] left-0 right-0 h-px bg-slate-100 hidden md:block" />

              {timelineSteps.map((step) => (
                <div
                  key={step.label}
                  className="relative z-10 flex flex-row md:flex-col items-center gap-4 md:gap-3 text-left md:text-center flex-1"
                >
                  <div
                    className={cn(
                      "h-9 w-9 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-all duration-500 shrink-0",
                      step.done
                        ? "bg-slate-900 text-white"
                        : "bg-slate-50 text-slate-300",
                    )}
                  >
                    <step.icon size={15} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p
                      className={cn(
                        "text-[10px] font-black uppercase tracking-widest",
                        step.done ? "text-slate-900" : "text-slate-300",
                      )}
                    >
                      {step.label}
                    </p>
                    {step.date && (
                      <p className="text-[10px] font-medium text-slate-400 mt-0.5">
                        {format(new Date(step.date), "MMM d")}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Appointment Details */}
          <div className="rounded-[1.5rem] bg-white border border-slate-100 p-6 lg:p-8">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
              Appointment Details
            </p>
            <div className="grid sm:grid-cols-3 gap-6">
              {/* Date */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <CalendarDays size={14} strokeWidth={2.5} />
                  <span className="text-[10px] font-black uppercase tracking-[0.15em]">
                    Date
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-900">
                  {format(new Date(booking.scheduledDate), "EEE, MMM do yyyy")}
                </p>
              </div>

              {/* Time */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Clock size={14} strokeWidth={2.5} />
                  <span className="text-[10px] font-black uppercase tracking-[0.15em]">
                    Time
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-900">
                  {booking.startTime}
                  {booking.endTime && (
                    <span className="text-slate-400 font-medium">
                      {" "}
                      — {booking.endTime}
                    </span>
                  )}
                </p>
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <MapPin size={14} strokeWidth={2.5} />
                  <span className="text-[10px] font-black uppercase tracking-[0.15em]">
                    Location
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-900">
                  Provider Address
                </p>
              </div>
            </div>
          </div>

          {/* Services & Notes */}
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Services */}
            <div className="rounded-[1.5rem] bg-white border border-slate-100 p-6 lg:p-8">
              <div className="flex items-center gap-2 text-slate-400 mb-5">
                <Scissors size={14} strokeWidth={2.5} />
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                  Services
                </p>
              </div>
              <div className="space-y-4">
                {booking.services.map((service: any) => (
                  <div
                    key={service.serviceId}
                    className="flex justify-between items-start gap-4"
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {service.name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                        {service.duration} min
                      </p>
                    </div>
                    <p className="text-sm font-bold text-slate-900 shrink-0">
                      {formatCurrency(service.price / 100)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="rounded-[1.5rem] bg-white border border-slate-100 p-6 lg:p-8">
              <div className="flex items-center gap-2 text-slate-400 mb-5">
                <FileText size={14} strokeWidth={2.5} />
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                  My Notes
                </p>
              </div>
              <p className="text-sm font-medium text-slate-500 leading-relaxed">
                {booking.notes || "No additional instructions provided."}
              </p>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="rounded-[1.5rem] bg-white border border-slate-100 p-6 lg:p-8">
            <div className="flex items-center gap-2 text-slate-400 mb-6">
              <CreditCard size={14} strokeWidth={2.5} />
              <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                Payment Summary
              </p>
            </div>

            <div className="max-w-sm space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Service Fee</span>
                <span className="text-slate-900 font-bold">
                  {formatCurrency(booking.servicePrice / 100)}
                </span>
              </div>
              <div className="flex justify-between text-sm pb-4 border-b border-slate-100">
                <span className="text-emerald-600 font-medium">
                  Deposit Paid
                </span>
                <span className="text-emerald-600 font-bold">
                  − {formatCurrency(booking.depositAmount / 100)}
                </span>
              </div>
              <div className="flex justify-between items-end pt-1">
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                  Due at Appointment
                </span>
                <span className="text-2xl font-peculiar font-black text-slate-900">
                  {formatCurrency(remainingBalance)}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium pt-1 italic">
                Payable directly to the professional on the day.
              </p>
            </div>
          </div>
        </div>

        {/* ---- Right Sidebar ---- */}
        <div className="space-y-5">
          {/* Provider Card */}
          <div className="rounded-[1.5rem] bg-white border border-slate-100 p-6">
            <div className="flex flex-col items-center text-center gap-3 pb-6 border-b border-slate-50">
              {/* Avatar */}
              <div className="h-20 w-20 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-2xl font-peculiar font-black shadow-xl shadow-slate-900/10">
                {providerInitial}
              </div>
              <div>
                <h4 className="text-base font-black text-slate-900">
                  {providerName}
                </h4>
                <p className="text-[11px] font-medium text-slate-400 mt-0.5 uppercase tracking-wider">
                  Beauty Professional
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck
                  size={13}
                  strokeWidth={2.5}
                  className="text-emerald-500"
                />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                  Verified Pro
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 pt-5">
              <Link
                href={`/providers/${(booking.providerProfileId as any)?.slug}`}
                className="flex items-center justify-center gap-1.5 h-11 rounded-xl border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:border-slate-200 transition-all active:scale-95"
              >
                Profile
                <ArrowUpRight size={13} strokeWidth={2.5} />
              </Link>
            </div>
          </div>

          {/* Assurance Card */}
          <div className="rounded-[1.5rem] bg-rose-50 border border-rose-100 p-6 flex gap-4">
            <div className="h-9 w-9 shrink-0 rounded-xl bg-rose-600 text-white flex items-center justify-center">
              <ShieldCheck size={18} strokeWidth={2} />
            </div>
            <div className="space-y-1">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-rose-600">
                Peculia Assurance
              </h4>
              <p className="text-[11px] font-medium text-rose-900/50 leading-relaxed">
                Your booking is protected. If the professional cancels, your
                deposit is automatically refunded.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
