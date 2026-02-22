"use client";

import { useQuery } from "@tanstack/react-query";
import { bookingService } from "@/services/booking.service";
import { format, isToday, isTomorrow } from "date-fns";
import {
  Clock,
  User,
  Scissors,
  CheckCircle2,
  XCircle,
  Loader2,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { sileo } from "sileo";

export default function UpcomingBookingsList() {
  const {
    data: bookings,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["bookings", "upcoming", "provider"],
    queryFn: () =>
      bookingService.getMyBookings({ status: "confirmed", limit: 5 }),
  });

  const handleAction = async (id: string, action: "complete" | "no-show") => {
    try {
      // Assuming these endpoints exist or will be mapped to patch status
      await bookingService.updateBookingStatus(
        id,
        action === "complete" ? "completed" : "no_show",
      );
      sileo.success({
        title:
          action === "complete" ? "Booking Completed" : "Marked as No-Show",
        description: "The booking status has been updated successfully.",
      });
      refetch();
    } catch {
      sileo.error({
        title: "Action Failed",
        description: "Could not update booking status. Please try again.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-[2.5rem] border border-slate-100">
        <Loader2 className="animate-spin text-rose-600 mb-4" size={32} />
        <p className="text-sm font-black uppercase tracking-widest text-slate-400">
          Fetching schedule...
        </p>
      </div>
    );
  }

  const results = bookings?.results || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h3 className="font-outfit text-xl font-bold text-slate-900">Agenda</h3>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-[10px] font-black uppercase tracking-widest text-white">
          <Calendar size={12} />
          Next 48 Hours
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
        {results.length === 0 ? (
          <div className="py-12 text-center space-y-4">
            <div className="h-16 w-16 mx-auto rounded-full bg-slate-50 flex items-center justify-center text-slate-200">
              <Calendar size={32} />
            </div>
            <p className="text-sm font-medium text-slate-400">
              No confirmed bookings for today or tomorrow.
            </p>
          </div>
        ) : (
          <div className="space-y-8 relative">
            {/* Timeline Line */}
            <div className="absolute left-[1.125rem] top-2 bottom-2 w-0.5 bg-slate-50" />

            {results.map((booking: any) => {
              const date = new Date(booking.scheduledDate);
              const isEventToday = isToday(date);

              return (
                <div key={booking.id} className="relative pl-12 group">
                  {/* Timeline Dot */}
                  <div
                    className={cn(
                      "absolute left-0 top-1.5 h-9 w-9 rounded-full flex items-center justify-center border-4 border-white shadow-sm z-10 transition-transform group-hover:scale-110",
                      isEventToday
                        ? "bg-rose-600 text-white"
                        : "bg-slate-900 text-white",
                    )}
                  >
                    <Clock size={16} />
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                            isEventToday
                              ? "bg-rose-50 text-rose-600"
                              : "bg-slate-50 text-slate-600",
                          )}
                        >
                          {isEventToday
                            ? "Today"
                            : isTomorrow(date)
                              ? "Tomorrow"
                              : format(date, "MMM d")}{" "}
                          • {booking.startTime}
                        </span>
                        <div className="h-1 w-1 rounded-full bg-slate-200" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          {booking.serviceName}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden">
                          {booking.clientId?.avatar ? (
                            <img
                              src={booking.clientId.avatar}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <User size={18} />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-none">
                            {booking.clientId?.firstName}{" "}
                            {booking.clientId?.lastName}
                          </p>
                          <p className="text-xs font-medium text-slate-400 mt-1">
                            {booking.startTime} - {booking.endTime}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleAction(booking.id, "complete")}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all shadow-sm"
                      >
                        <CheckCircle2 size={14} />
                        Complete
                      </button>
                      <button
                        onClick={() => handleAction(booking.id, "no-show")}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                      >
                        <XCircle size={14} />
                        No-Show
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
