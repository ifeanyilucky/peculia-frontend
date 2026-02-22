"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addDays,
  isBefore,
  startOfToday,
} from "date-fns";
import { ChevronLeft, ChevronRight, Clock, AlertCircle } from "lucide-react";
import { availabilityService } from "@/services/availability.service";
import { useBookingStore } from "@/store/booking.store";
import { cn } from "@/lib/utils";

export default function SelectDateTimeStep() {
  const {
    selectedProvider,
    selectedService,
    selectedDate,
    setSelectedDate,
    selectedSlot,
    setSelectedSlot,
    nextStep,
    prevStep,
  } = useBookingStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // 1. Fetch blocked dates for current month
  const { data: blockedDates } = useQuery({
    queryKey: [
      "availability",
      "blocked",
      selectedProvider?._id,
      format(currentMonth, "yyyy-MM"),
    ],
    queryFn: () =>
      availabilityService.getBlockedDates(
        selectedProvider?._id || "",
        currentMonth.getMonth() + 1,
        currentMonth.getFullYear(),
      ),
    enabled: !!selectedProvider?._id,
  });

  // 2. Fetch slots for selected date
  const { data: slots, isLoading: isLoadingSlots } = useQuery({
    queryKey: [
      "availability",
      "slots",
      selectedProvider?._id,
      selectedService?.id,
      selectedDate?.toISOString(),
    ],
    queryFn: () =>
      availabilityService.getAvailableSlots(
        selectedProvider?._id || "",
        selectedService?.id || "",
        selectedDate!.toISOString(),
      ),
    enabled: !!selectedProvider?._id && !!selectedService?.id && !!selectedDate,
  });

  // Calendar Logic
  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;

        const isBlocked = blockedDates?.some(
          (b) => isSameDay(new Date(b.date), cloneDay) && b.isFullDay,
        );
        const isPast = isBefore(cloneDay, startOfToday());
        const isDisabled = isPast || isBlocked;

        days.push(
          <button
            key={day.toString()}
            disabled={isDisabled}
            onClick={() => {
              setSelectedDate(cloneDay);
              setSelectedSlot(null);
            }}
            className={cn(
              "relative h-12 w-full text-sm font-bold transition-all rounded-xl flex items-center justify-center",
              !isSameMonth(day, monthStart)
                ? "text-slate-300 pointer-events-none"
                : isDisabled
                  ? "text-slate-200 cursor-not-allowed"
                  : isSameDay(day, selectedDate || new Date(0))
                    ? "bg-rose-600 text-white shadow-lg shadow-rose-200 scale-110 z-10"
                    : "text-slate-700 hover:bg-rose-50 hover:text-rose-600",
            )}
          >
            <span>{formattedDate}</span>
            {isBlocked && !isPast && (
              <div className="absolute bottom-1 h-1 w-1 rounded-full bg-slate-300" />
            )}
          </button>,
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-1" key={day.toString()}>
          {days}
        </div>,
      );
      days = [];
    }
    return rows;
  }, [
    currentMonth,
    selectedDate,
    blockedDates,
    setSelectedDate,
    setSelectedSlot,
  ]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="font-peculiar text-2xl font-bold text-slate-900">
          Select Date & Time
        </h2>
        <p className="mt-2 text-slate-500">
          Find a time that works best for you.
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Calendar Side */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-peculiar text-lg font-bold text-slate-900">
              {format(currentMonth, "MMMM yyyy")}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
                disabled={isSameMonth(currentMonth, new Date())}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="grid grid-cols-7 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div
                  key={d}
                  className="text-center text-[10px] font-black uppercase tracking-widest text-slate-400"
                >
                  {d}
                </div>
              ))}
            </div>
            <div className="space-y-1">{days}</div>
          </div>

          <div className="flex items-center gap-4 px-2 text-xs font-semibold text-slate-400">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-rose-600" />
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-slate-100" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-slate-200" />
              <span>Unavailable</span>
            </div>
          </div>
        </div>

        {/* Time Slots Side */}
        <div className="space-y-6">
          <h3 className="font-peculiar text-lg font-bold text-slate-900 flex items-center gap-2">
            Available Slots
            {selectedDate && (
              <span className="text-sm font-medium text-slate-400">
                for {format(selectedDate, "MMM do")}
              </span>
            )}
          </h3>

          <div className="min-h-[300px]">
            {!selectedDate ? (
              <div className="flex h-full flex-col items-center justify-center text-center p-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                <Clock size={40} className="text-slate-300 mb-4" />
                <p className="text-sm font-medium text-slate-500">
                  Pick a date to see <br /> available time slots
                </p>
              </div>
            ) : isLoadingSlots ? (
              <div className="grid grid-cols-3 gap-3">
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className="h-12 animate-pulse rounded-xl bg-slate-100"
                  />
                ))}
              </div>
            ) : slots?.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 bg-rose-50 rounded-3xl border border-rose-100 text-rose-600">
                <AlertCircle size={24} className="mb-2" />
                <p className="text-sm font-bold text-center">
                  No slots available for this date.
                  <br />
                  Try another date.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {slots?.map((slot) => {
                  const isSlotSelected =
                    selectedSlot?.startTime === slot.startTime;
                  return (
                    <button
                      key={slot.startTime}
                      disabled={!slot.isAvailable}
                      onClick={() => setSelectedSlot(slot)}
                      className={cn(
                        "h-12 rounded-xl text-sm font-bold transition-all border-2",
                        !slot.isAvailable
                          ? "bg-slate-50 border-transparent text-slate-300 cursor-not-allowed"
                          : isSlotSelected
                            ? "bg-rose-600 border-rose-600 text-white shadow-lg shadow-rose-100 scale-105"
                            : "bg-white border-slate-100 text-slate-700 hover:border-rose-400 hover:text-rose-600",
                      )}
                    >
                      {slot.startTime}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-12 flex items-center justify-between border-t border-slate-100 pt-8">
        <button
          onClick={prevStep}
          className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          ← Back to Services
        </button>
        <button
          onClick={nextStep}
          disabled={!selectedSlot}
          className="rounded-full bg-slate-900 px-12 py-4 text-base font-bold text-white transition-all hover:bg-rose-600 disabled:opacity-20 disabled:cursor-not-allowed"
        >
          Review Booking Details
        </button>
      </div>
    </div>
  );
}
