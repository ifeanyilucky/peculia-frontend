"use client";

import { Booking } from "@/types/booking.types";
import { format } from "date-fns";
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ClientBookingCardProps {
  booking: Booking;
}

export default function ClientBookingCard({ booking }: ClientBookingCardProps) {
  const statusConfig: Record<
    string,
    { label: string; color: string; dot: string }
  > = {
    pending_payment: {
      label: "Action Required",
      color: "text-amber-600",
      dot: "bg-amber-400",
    },
    confirmed: {
      label: "Confirmed",
      color: "text-emerald-600",
      dot: "bg-emerald-400",
    },
    in_progress: {
      label: "In Progress",
      color: "text-blue-600",
      dot: "bg-blue-400",
    },
    completed: {
      label: "Completed",
      color: "text-slate-500",
      dot: "bg-slate-300",
    },
    cancelled_by_client: {
      label: "Cancelled",
      color: "text-rose-500",
      dot: "bg-rose-400",
    },
    cancelled_by_provider: {
      label: "Cancelled by Pro",
      color: "text-rose-500",
      dot: "bg-rose-400",
    },
    expired: {
      label: "Expired",
      color: "text-slate-400",
      dot: "bg-slate-300",
    },
  };

  const config = statusConfig[booking.status] || {
    label: booking.status,
    color: "text-slate-400",
    dot: "bg-slate-200",
  };

  const providerName =
    typeof booking.providerProfileId === "object"
      ? (booking.providerProfileId as any).businessName
      : "Professional";

  return (
    <div className="group relative bg-white rounded-[2rem] border border-slate-100 p-6 lg:p-7 hover:border-slate-200 transition-all duration-500 flex flex-col md:flex-row gap-6 md:items-center overflow-hidden">
      {/* Subtle Side Indicator */}
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-1.5 transition-opacity duration-500",
          config.dot,
          "opacity-40 group-hover:opacity-100",
        )}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex items-start sm:items-center gap-5 min-w-0">
        {/* Minimal Avatar/Icon */}
        <div className="relative shrink-0">
          <div className="h-16 w-16 lg:h-18 lg:w-18 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100/50 group-hover:bg-white group-hover:border-slate-200 transition-all duration-500">
            <span className="text-xl font-peculiar font-black text-slate-800">
              {booking.services[0]?.name[0]}
            </span>
          </div>
          {/* Status Dot Overlay */}
          <div
            className={cn(
              "absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ring-2 ring-transparent transition-all",
              config.dot,
            )}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
            <span
              className={cn(
                "text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5",
                config.color,
              )}
            >
              {config.label}
            </span>
            {booking.depositPaid && (
              <>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                  Paid
                </span>
              </>
            )}
          </div>

          <h3 className="font-peculiar text-xl lg:text-2xl font-black text-slate-900 truncate tracking-tight">
            {booking.services[0]?.name}
            {booking.services.length > 1 && (
              <span className="ml-2 text-slate-400 text-sm font-medium">
                +{booking.services.length - 1}
              </span>
            )}
          </h3>

          <p className="text-slate-400 text-sm font-medium mt-0.5 truncate uppercase tracking-wider text-[11px]">
            {providerName}
          </p>
        </div>
      </div>

      {/* Vertical Divider (Desktop) */}
      <div className="hidden md:block w-px h-12 bg-slate-100" />

      {/* Details & Actions */}
      <div className="flex flex-col sm:flex-row md:items-center gap-6 lg:gap-10 shrink-0">
        <div className="flex items-center gap-8">
          {/* Date */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-slate-600 transition-colors">
              <CalendarDays size={14} strokeWidth={2.5} />
              <span className="text-[10px] font-black uppercase tracking-[0.15em]">
                Date
              </span>
            </div>
            <p className="text-sm font-bold text-slate-900">
              {format(new Date(booking.scheduledDate), "MMM do")}
            </p>
          </div>

          {/* Time */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-slate-600 transition-colors">
              <Clock size={14} strokeWidth={2.5} />
              <span className="text-[10px] font-black uppercase tracking-[0.15em]">
                Time
              </span>
            </div>
            <p className="text-sm font-bold text-slate-900">
              {booking.startTime}
            </p>
          </div>
        </div>

        {/* Dynamic Action Zone */}
        <div className="flex items-center gap-3">
          {booking.status === "pending_payment" && (
            <button className="h-11 px-6 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all active:scale-95 border border-slate-200">
              Pay Now
            </button>
          )}

          {booking.status === "confirmed" && (
            <button className="h-11 px-5 border border-slate-200 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-rose-500 hover:border-rose-100 transition-all active:scale-95">
              Cancel
            </button>
          )}

          {booking.status === "completed" && (
            <button className="h-11 px-6 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all active:scale-95 border border-slate-200">
              Review
            </button>
          )}

          <Link
            href={`/bookings/${booking.id}`}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 text-slate-900 hover:bg-slate-900 hover:text-white transition-all active:scale-95 group/link"
          >
            <ArrowUpRight
              size={18}
              strokeWidth={2.5}
              className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
