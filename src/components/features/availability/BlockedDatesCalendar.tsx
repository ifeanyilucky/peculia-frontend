"use client";

import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday as isTodayFn,
  isBefore,
  startOfToday,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Lock,
  Unlock,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { availabilityService } from "@/services/availability.service";
import { useAuthStore } from "@/store/auth.store";
import { sileo } from "sileo";

export default function BlockedDatesCalendar() {
  const { user } = useAuthStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const {
    data: blockedDates,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["blocked-dates", user?.id, format(currentMonth, "yyyy-MM")],
    queryFn: () =>
      availabilityService.getBlockedDates(
        user?.id || "",
        currentMonth.getMonth() + 1,
        currentMonth.getFullYear(),
      ),
    enabled: !!user?.id,
  });

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const handleToggleBlock = async (date: Date) => {
    const isBlocked = blockedDates?.find((b) =>
      isSameDay(new Date(b.date), date),
    );

    try {
      if (isBlocked) {
        await availabilityService.unblockDate(isBlocked.id);
        sileo.success({
          title: "Unlocked",
          description: "Date is now available for bookings.",
        });
      } else {
        await availabilityService.blockDate({
          date: format(date, "yyyy-MM-dd"),
          isFullDay: true,
        });
        sileo.success({
          title: "Blocked",
          description: "Date is now hidden from clients.",
        });
      }
      refetch();
    } catch {
      sileo.error({
        title: "Action Failed",
        description: "Could not update date status.",
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden flex flex-col h-full">
      <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
        <div>
          <h3 className="font-peculiar text-xl font-bold text-slate-900">
            Custom Time Off
          </h3>
          <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-widest">
            Manage Blocked Dates
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2.5 rounded-xl border border-slate-100 bg-white text-slate-400 hover:text-slate-900 transition-all hover:border-slate-300"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="w-32 text-center text-xs font-black uppercase tracking-widest text-slate-900">
            {format(currentMonth, "MMMM yyyy")}
          </div>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2.5 rounded-xl border border-slate-100 bg-white text-slate-400 hover:text-slate-900 transition-all hover:border-slate-300"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="p-8 flex-1">
        <div className="grid grid-cols-7 gap-px bg-slate-100 rounded-3xl overflow-hidden border border-slate-100">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="bg-slate-50 py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-400"
            >
              {day}
            </div>
          ))}

          {days.map((date, idx) => {
            const isBlocked = blockedDates?.some((b) =>
              isSameDay(new Date(b.date), date),
            );
            const isPast = isBefore(date, startOfToday());
            const isToday = isTodayFn(date);

            return (
              <button
                key={date.toString()}
                onClick={() => !isPast && handleToggleBlock(date)}
                disabled={isPast || isLoading}
                className={cn(
                  "relative h-24 bg-white p-4 flex flex-col items-end justify-start transition-all group",
                  isPast
                    ? "opacity-30 cursor-not-allowed"
                    : "hover:bg-slate-50 active:scale-95",
                  isBlocked && "bg-rose-50/30",
                )}
              >
                <span
                  className={cn(
                    "text-xs font-black",
                    isToday
                      ? "text-glam-plum h-6 w-6 rounded-full bg-rose-50 flex items-center justify-center -mr-1 -mt-1"
                      : "text-slate-400",
                    isBlocked && !isToday && "text-glam-plum",
                  )}
                >
                  {format(date, "d")}
                </span>

                {isBlocked && (
                  <div className="absolute inset-x-2 bottom-2 p-1.5 rounded-lg bg-glam-plum flex items-center justify-center text-white">
                    <Lock size={12} strokeWidth={3} />
                  </div>
                )}

                {!isBlocked && !isPast && (
                  <div className="absolute inset-x-2 bottom-2 p-1.5 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300 opacity-0 group-hover:opacity-100 transition-all">
                    <Unlock size={12} strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-start gap-4">
        <AlertCircle className="text-slate-400 shrink-0" size={20} />
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Instruction
          </p>
          <p className="text-xs font-medium text-slate-500 mt-1 leading-relaxed">
            Click on a date to block it for the entire day. Blocked dates will
            not appear in the discovery results for clients.
          </p>
        </div>
      </div>
    </div>
  );
}
