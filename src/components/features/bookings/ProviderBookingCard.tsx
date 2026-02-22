"use client";

import Image from "next/image";
import { Booking } from "@/types/booking.types";
import { format } from "date-fns";
import {
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  MoreVertical,
  User,
  Scissors,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ProviderBookingCardProps {
  booking: Booking;
  onAction?: (id: string, action: string) => void;
}

export default function ProviderBookingCard({
  booking,
  onAction,
}: ProviderBookingCardProps) {
  const statusStyles = {
    pending_payment: "bg-amber-50 text-amber-600 border-amber-100",
    confirmed: "bg-blue-50 text-blue-600 border-blue-100",
    in_progress: "bg-slate-900 text-white border-slate-900",
    completed: "bg-green-50 text-green-600 border-green-100",
    cancelled_by_client: "bg-rose-50 text-rose-600 border-rose-100",
    cancelled_by_provider: "bg-rose-50 text-rose-600 border-rose-100",
    no_show: "bg-slate-50 text-slate-400 border-slate-100",
  };

  const statusLabels = {
    pending_payment: "Pending Payment",
    confirmed: "Confirmed",
    in_progress: "In Progress",
    completed: "Completed",
    cancelled_by_client: "Cancelled by Client",
    cancelled_by_provider: "Cancelled by You",
    no_show: "No-Show",
  };

  const client = typeof booking.clientId !== "string" ? booking.clientId : null;

  return (
    <div className="group bg-white rounded-[2rem] border border-slate-100 p-6 hover:border-slate-900 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-slate-200/50">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden shrink-0 border-2 border-white shadow-sm relative">
            {client?.avatar ? (
              <Image
                src={client.avatar}
                alt={`${client.firstName || "Client"}'s avatar`}
                fill
                className="object-cover"
                sizes="56px"
              />
            ) : (
              <User size={24} />
            )}
          </div>
          <div>
            <h4 className="font-bold text-slate-900">
              {client
                ? `${client.firstName} ${client.lastName}`
                : "Unknown Client"}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                <Scissors size={12} />
                {booking.serviceName}
              </span>
            </div>
          </div>
        </div>

        <div
          className={cn(
            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
            statusStyles[booking.status],
          )}
        >
          {statusLabels[booking.status]}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-slate-50 space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Date & Time
          </p>
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Clock size={14} className="text-slate-400" />
            {format(new Date(booking.scheduledDate), "MMM d")} •{" "}
            {booking.startTime}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-50 space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Deposit
          </p>
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <div
              className={cn(
                "h-2 w-2 rounded-full",
                booking.depositPaid ? "bg-green-500" : "bg-amber-500",
              )}
            />
            ₦{(booking.depositAmount / 100).toLocaleString()} •{" "}
            {booking.depositPaid ? "Paid" : "Pending"}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between gap-4">
        <Link
          href={`/provider/bookings/${booking.id}`}
          className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
        >
          View Details
        </Link>

        <div className="flex items-center gap-2">
          {booking.status === "confirmed" && (
            <>
              <button
                onClick={() => onAction?.(booking.id, "complete")}
                className="p-2 rounded-xl bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all shadow-sm"
                title="Mark Complete"
              >
                <CheckCircle2 size={18} />
              </button>
              <button
                onClick={() => onAction?.(booking.id, "no-show")}
                className="p-2 rounded-xl bg-slate-50 text-slate-600 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                title="Mark No-Show"
              >
                <XCircle size={18} />
              </button>
            </>
          )}
          <button className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 transition-all">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
