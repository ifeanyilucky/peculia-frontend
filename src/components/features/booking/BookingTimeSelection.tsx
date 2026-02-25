"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  format,
  addDays,
  subDays,
  startOfToday,
  isBefore,
  isSameDay,
  startOfWeek,
  getDay,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  User,
  Users,
} from "lucide-react";
import { availabilityService } from "@/services/availability.service";
import { useBookingStore } from "@/store/booking.store";
import { useRouter, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/formatters";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface BookingTimeSelectionProps {
  providerId: string;
}

const DAYS_MAP = [0, 1, 2, 3, 4, 5, 6];

export default function BookingTimeSelection({
  providerId,
}: BookingTimeSelectionProps) {
  const router = useRouter();
  const today = startOfToday();

  const {
    selectedServices,
    selectedTeamMember,
    selectedDate,
    setSelectedDate,
    selectedSlot,
    setSelectedSlot,
  } = useBookingStore();

  const { data: schedule } = useQuery({
    queryKey: ["availability", "schedule", providerId],
    queryFn: () => availabilityService.getWeeklySchedule(providerId),
    enabled: !!providerId,
  });

  const isDayOpen = (date: Date): boolean => {
    if (!schedule?.schedule) return true;
    const dayIndex = getDay(date);
    const dayName = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][dayIndex];
    const daySchedule = schedule.schedule[dayName];
    return daySchedule?.isOpen && daySchedule?.slots?.length > 0;
  };

  const isDayDisabled = (date: Date): boolean => {
    return isBefore(date, today) || !isDayOpen(date);
  };

  const getDisabledDays = (date: Date): boolean => {
    return isDayDisabled(date);
  };

  const getOpenDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const openDays: Date[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      if (!isDayDisabled(currentDate)) {
        openDays.push(currentDate);
      }
    }

    return openDays;
  };

  // Week window state — anchored to Monday of the current week or today's week
  const [weekStart, setWeekStart] = useState<Date>(
    startOfWeek(selectedDate ?? today, { weekStartsOn: 1 }),
  );

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart],
  );

  const totalDuration = selectedServices.reduce(
    (acc, service) => acc + service.duration,
    0,
  );

  const { data: slots, isLoading: isLoadingSlots } = useQuery({
    queryKey: [
      "availability",
      "slots",
      providerId,
      selectedDate ? format(selectedDate, "yyyy-MM-dd") : null,
      selectedTeamMember?._id,
      totalDuration,
    ],
    queryFn: () =>
      availabilityService.getAvailableSlots(
        providerId,
        selectedServices.map((s) => s.id),
        selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
        selectedTeamMember?._id,
      ),
    enabled: !!providerId && selectedServices.length > 0 && !!selectedDate,
  });

  const professionalLabel = selectedTeamMember
    ? `${selectedTeamMember.firstName} ${selectedTeamMember.lastName}`
    : "Any professional";

  return (
    <div className="w-full flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="font-peculiar text-4xl font-black text-slate-900 mb-8 tracking-tight">
        Select time
      </h1>

      {/* Controls row */}
      <div className="flex items-center justify-between mb-6">
        {/* Professional pill */}
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-slate-200 bg-white cursor-default select-none">
          {selectedTeamMember ? (
            <User size={16} className="text-slate-500 shrink-0" />
          ) : (
            <Users size={16} className="text-slate-500 shrink-0" />
          )}
          <span className="text-sm font-bold text-slate-800">
            {professionalLabel}
          </span>
          <ChevronRight size={14} className="text-slate-400 rotate-90" />
        </div>

        {/* Calendar icon dropdown */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="h-10 w-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm">
              <CalendarDays size={18} />
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0 border-none shadow-2xl"
            align="end"
          >
            <Calendar
              mode="single"
              selected={selectedDate || undefined}
              onSelect={(date) => {
                if (date && !isDayDisabled(date)) {
                  setSelectedDate(date);
                  setSelectedSlot(null);
                  setWeekStart(startOfWeek(date, { weekStartsOn: 1 }));
                }
              }}
              disabled={(date) => getDisabledDays(date)}
              modifiers={{
                open: getOpenDaysInMonth(new Date()),
              }}
              modifiersClassNames={{
                open: "bg-rose-100 text-rose-700 font-bold",
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Week strip */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-black text-slate-900">
            {format(weekStart, "MMMM yyyy")}
          </h2>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setWeekStart((w) => subDays(w, 7))}
              disabled={!isBefore(today, weekStart)}
              className="h-8 w-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setWeekStart((w) => addDays(w, 7))}
              className="h-8 w-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day) => {
            const isPast = isBefore(day, today);
            const isClosed = !isDayOpen(day);
            const isDisabled = isPast || isClosed;
            const isSelected = selectedDate
              ? isSameDay(day, selectedDate)
              : false;

            return (
              <button
                key={day.toISOString()}
                disabled={isDisabled}
                onClick={() => {
                  if (!isDisabled) {
                    setSelectedDate(day);
                    setSelectedSlot(null);
                  }
                }}
                className={cn(
                  "flex flex-col items-center gap-1 py-3 rounded-2xl transition-all relative",
                  isDisabled
                    ? "opacity-30 cursor-not-allowed"
                    : isSelected
                      ? "bg-rose-600 text-white shadow-lg shadow-rose-200"
                      : "hover:bg-slate-50 text-slate-600",
                )}
              >
                <span
                  className={cn(
                    "text-[10px] font-black uppercase tracking-widest",
                    isSelected ? "text-white/70" : "text-slate-400",
                  )}
                >
                  {format(day, "EEE")}
                </span>
                {isClosed ? (
                  <span
                    className={cn(
                      "text-lg font-black line-through decoration-2",
                      isSelected ? "text-white/50" : "text-slate-300",
                    )}
                  >
                    {format(day, "d")}
                  </span>
                ) : (
                  <span
                    className={cn(
                      "text-lg font-black",
                      isSelected ? "text-white" : "text-slate-900",
                    )}
                  >
                    {format(day, "d")}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time slots */}
      {!selectedDate ? (
        <div className="py-16 flex flex-col items-center justify-center text-center text-slate-400 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
          <CalendarDays size={40} className="mb-4 text-slate-300" />
          <p className="text-sm font-bold">
            Select a date to see available times
          </p>
        </div>
      ) : isLoadingSlots ? (
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-14 rounded-xl bg-slate-100 animate-pulse"
            />
          ))}
        </div>
      ) : !slots || slots.length === 0 ? (
        <div className="py-16 flex flex-col items-center justify-center text-center text-slate-400 bg-rose-50 rounded-3xl border border-rose-100">
          <p className="text-sm font-bold text-rose-500">
            No available slots for this date.
          </p>
          <p className="text-xs font-medium text-rose-400 mt-1">
            Try selecting another day.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {slots
            .filter((s) => s.isAvailable)
            .map((slot) => {
              const isSelected = selectedSlot?.startTime === slot.startTime;
              return (
                <button
                  key={slot.startTime}
                  onClick={() => setSelectedSlot(isSelected ? null : slot)}
                  className={cn(
                    "w-full text-left px-6 py-4 rounded-xl border transition-all font-bold text-sm",
                    isSelected
                      ? "bg-rose-600 border-rose-600 text-white shadow-md shadow-rose-100"
                      : "bg-white border-slate-100 text-slate-700 hover:border-slate-200 hover:bg-slate-50",
                  )}
                >
                  {slot.startTime}
                </button>
              );
            })}
        </div>
      )}
    </div>
  );
}
