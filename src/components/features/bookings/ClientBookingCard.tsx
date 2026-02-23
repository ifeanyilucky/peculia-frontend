"use client";

import { Booking } from "@/types/booking.types";
import { format } from "date-fns";
import {
  CalendarDays,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";

interface ClientBookingCardProps {
  booking: Booking;
}

export default function ClientBookingCard({ booking }: ClientBookingCardProps) {
  const statusConfig: Record<
    string,
    { label: string; color: string; icon: any }
  > = {
    pending_payment: {
      label: "Awaiting Payment",
      color: "text-amber-600 bg-amber-50",
      icon: AlertCircle,
    },
    confirmed: {
      label: "Confirmed",
      color: "text-green-600 bg-green-50",
      icon: CheckCircle2,
    },
    in_progress: {
      label: "In Progress",
      color: "text-blue-600 bg-blue-50",
      icon: Clock,
    },
    completed: {
      label: "Completed",
      color: "text-slate-600 bg-slate-50",
      icon: CheckCircle2,
    },
    cancelled_by_client: {
      label: "Cancelled",
      color: "text-rose-600 bg-rose-50",
      icon: XCircle,
    },
    cancelled_by_provider: {
      label: "Cancelled by Pro",
      color: "text-rose-600 bg-rose-50",
      icon: XCircle,
    },
  };

  const config = statusConfig[booking.status] || {
    label: booking.status,
    color: "text-slate-400 bg-slate-50",
    icon: Clock,
  };
  const StatusIcon = config.icon;

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 p-6 lg:p-8 hover:border-rose-200 hover:shadow-2xl hover:shadow-rose-50 transition-all duration-500 relative flex flex-col lg:flex-row gap-8">
      {/* Visual Indicator */}
      <div
        className={cn(
          "absolute top-0 left-0 bottom-0 w-2 h-full rounded-l-[2.5rem]",
          config.color.split(" ")[1],
        )}
      />

      {/* Provider & Service Info */}
      <div className="flex gap-6 flex-1 min-w-0">
        <div className="h-16 w-16 lg:h-20 lg:w-20 rounded-[1.5rem] bg-slate-100 overflow-hidden relative border border-slate-50 shrink-0">
          <div className="flex h-full w-full items-center justify-center bg-rose-50 text-rose-600 font-bold text-2xl">
            {booking.serviceName[0]}
          </div>
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                config.color,
              )}
            >
              <StatusIcon size={12} strokeWidth={3} />
              {config.label}
            </span>
            {booking.depositPaid && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                Deposit Paid
              </span>
            )}
          </div>
          <h3 className="font-peculiar text-xl lg:text-2xl font-black text-slate-900 group-hover:text-rose-600 transition-colors truncate">
            {booking.serviceName}
          </h3>
          <p className="text-slate-500 font-medium truncate mt-1 underline-offset-4 hover:underline decoration-rose-500 decoration-2 transition-all">
            with{" "}
            <span className="font-bold text-slate-900">Provider Name...</span>
          </p>
        </div>
      </div>

      {/* Date & Time Grid */}
      <div className="flex flex-col sm:flex-row gap-6 lg:gap-10 border-t lg:border-t-0 lg:border-l border-slate-50 pt-6 lg:pt-0 lg:pl-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 group-hover:bg-rose-50 group-hover:text-rose-600 transition-colors">
              <CalendarDays size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Date
              </p>
              <p className="font-bold text-slate-900">
                {format(new Date(booking.scheduledDate), "MMM do, yyyy")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
              <Clock size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Time
              </p>
              <p className="font-bold text-slate-900">{booking.startTime}</p>
            </div>
          </div>
        </div>

        <div className="flex items-end lg:items-center">
          <Link
            href={`/bookings/${booking.id}`}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white shadow-xl shadow-slate-200 hover:bg-rose-600 hover:scale-110 transition-all duration-300 group/btn"
          >
            <ChevronRight
              size={24}
              className="group-hover/btn:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </div>

      {/* Action Buttons Float (Bottom) */}
      <div className="mt-2 flex flex-wrap gap-3 border-t border-slate-50 pt-6 lg:absolute lg:right-6 lg:top-6 lg:border-0 lg:mt-0 lg:pt-0">
        {booking.status === "pending_payment" && (
          <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg shadow-slate-100">
            <CreditCard size={14} />
            Pay Deposit
          </button>
        )}

        {booking.status === "confirmed" && (
          <button className="flex items-center gap-2 px-6 py-2.5 border-2 border-slate-100 text-slate-400 rounded-xl text-xs font-black uppercase tracking-widest hover:border-rose-200 hover:text-rose-600 transition-all">
            <XCircle size={14} />
            Cancel Booking
          </button>
        )}

        {booking.status === "completed" && (
          <button className="flex items-center gap-2 px-6 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg shadow-rose-100">
            <Sparkles size={14} />
            Leave Review
          </button>
        )}
      </div>
    </div>
  );
}

// Sub-component for icons
function CreditCard({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  );
}

function Sparkles({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
