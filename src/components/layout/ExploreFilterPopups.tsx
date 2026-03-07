"use client";

import { useState } from "react";
import { useSpecialties } from "@/hooks/useSpecialties";
import { Search, MapPin, ChevronRight, ChevronLeft } from "lucide-react";
import {
  format,
  addDays,
  startOfToday,
  isSameDay,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
} from "date-fns";
import { cn } from "@/lib/utils";

// --- Treatment Dropdown ---
export function TreatmentDropdown({
  onSelect,
  searchQuery = "",
}: {
  onSelect: (id: string) => void;
  searchQuery?: string;
}) {
  const { data: specialties = [], isLoading } = useSpecialties();

  const filteredSpecialties = specialties.filter((spec) =>
    spec.label.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="w-80 bg-white rounded-3xl p-4 shadow-xl border border-secondary">
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 px-2">
        {searchQuery ? "Search Results" : "Popular Treatments"}
      </p>
      <div className="grid gap-1">
        {isLoading ? (
          <p className="p-4 text-sm text-secondary-foreground/70">
            Loading treatments...
          </p>
        ) : filteredSpecialties.length > 0 ? (
          filteredSpecialties.map((spec) => (
            <button
              key={spec.id}
              onClick={() => onSelect(spec.id)}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-secondary/50 transition-colors text-left group"
            >
              <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-white transition-colors">
                <Search size={18} className="text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-bold text-primary">{spec.label}</p>
                <p className="text-xs text-secondary-foreground/70">
                  Professional services
                </p>
              </div>
            </button>
          ))
        ) : (
          <p className="p-4 text-sm text-secondary-foreground/70 italic">
            No treatments found
          </p>
        )}
      </div>
    </div>
  );
}

// --- Location Dropdown ---
export function LocationDropdown({
  onSelect,
  searchQuery = "",
}: {
  onSelect: (city: string) => void;
  searchQuery?: string;
}) {
  const allCities = [
    "Lagos, Nigeria",
    "Abuja, Nigeria",
    "Port Harcourt, Nigeria",
    "Ibadan, Nigeria",
    "Lekki Phase I, Lagos",
    "Victoria Island, Lagos",
    "Ikeja, Lagos",
  ];

  const filteredCities = allCities.filter((city) =>
    city.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="w-80 bg-white rounded-3xl p-4 shadow-xl border border-secondary">
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 px-2">
        {searchQuery ? "Search Results" : "Popular Cities"}
      </p>
      <div className="grid gap-1">
        {filteredCities.length > 0 ? (
          filteredCities.map((city) => (
            <button
              key={city}
              onClick={() => onSelect(city)}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-secondary/50 transition-colors text-left group"
            >
              <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-white transition-colors">
                <MapPin size={18} className="text-muted-foreground" />
              </div>
              <p className="text-sm font-bold text-primary">{city}</p>
            </button>
          ))
        ) : (
          <p className="p-4 text-sm text-secondary-foreground/70 italic">
            No locations found
          </p>
        )}
      </div>
    </div>
  );
}

// --- Date/Time Dropdown ---
export function DateTimeDropdown({
  onSelect,
}: {
  onSelect: (date: Date, time: string) => void;
}) {
  const today = startOfToday();
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [viewDate, setViewDate] = useState<Date>(today);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("Any time");

  const timeSlots = [
    { id: "Any time", label: "Any time", range: "" },
    { id: "Morning", label: "Morning", range: "09 - 12" },
    { id: "Afternoon", label: "Afternoon", range: "12 - 17" },
    { id: "Evening", label: "Evening", range: "17 - 00" },
    { id: "Custom", label: "Custom", range: "" },
  ];

  const handlePrevMonth = () => setViewDate(subMonths(viewDate, 1));
  const handleNextMonth = () => setViewDate(addMonths(viewDate, 1));

  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  return (
    <div className="w-[calc(100vw-2rem)] max-w-[700px] bg-white rounded-3xl p-4 sm:p-8 shadow-2xl border border-secondary">
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-12">
        {/* Quick Select */}
        <div className="flex sm:flex-col gap-3 sm:w-48">
          <button
            onClick={() => {
              setSelectedDate(today);
              setViewDate(today);
            }}
            className={cn(
              "flex-1 sm:flex-initial p-4 sm:p-6 rounded-lg border text-left transition-all",
              isSameDay(selectedDate, today)
                ? "border-primary bg-secondary/50"
                : "border-secondary hover:border-slate-200",
            )}
          >
            <p className="text-base sm:text-lg font-black text-primary">
              Today
            </p>
            <p className="text-xs sm:text-sm text-secondary-foreground/70">
              {format(today, "EEE, d MMM")}
            </p>
          </button>
          <button
            onClick={() => {
              const tomorrow = addDays(today, 1);
              setSelectedDate(tomorrow);
              setViewDate(tomorrow);
            }}
            className={cn(
              "flex-1 sm:flex-initial p-4 sm:p-6 rounded-lg border text-left transition-all",
              isSameDay(selectedDate, addDays(today, 1))
                ? "border-primary bg-secondary/50"
                : "border-secondary hover:border-slate-200",
            )}
          >
            <p className="text-base sm:text-lg font-black text-primary">
              Tomorrow
            </p>
            <p className="text-xs sm:text-sm text-secondary-foreground/70">
              {format(addDays(today, 1), "EEE, d MMM")}
            </p>
          </button>
        </div>

        {/* Calendar */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4 sm:mb-8">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-secondary rounded-full transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <p className="text-base font-black text-primary">
              {format(viewDate, "MMMM yyyy")}
            </p>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-secondary rounded-full transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-0.5 sm:gap-1 text-center mb-2 sm:mb-4">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <span
                key={d}
                className="text-[10px] sm:text-xs font-bold text-muted-foreground"
              >
                {d}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
            {calendarDays.map((date, i) => {
              const isSelected = isSameDay(selectedDate, date);
              const isToday = isSameDay(today, date);
              const isCurrentMonth = isSameMonth(date, monthStart);

              return (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedDate(date);
                    onSelect(date, selectedTimeSlot);
                  }}
                  className={cn(
                    "h-8 w-8 sm:h-10 sm:w-10 mx-auto flex items-center justify-center rounded-full text-xs sm:text-sm font-bold transition-all",
                    isSelected
                      ? "bg-primary text-white"
                      : isToday
                        ? "text-primary border border-slate-200"
                        : isCurrentMonth
                          ? "text-slate-600 hover:bg-secondary/50"
                          : "text-slate-300 pointer-events-none",
                  )}
                >
                  {format(date, "d")}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="h-px bg-secondary my-4 sm:my-8" />

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs sm:text-sm font-black text-primary shrink-0">
          Select time
        </span>
        <div className="flex flex-1 flex-wrap gap-2">
          {timeSlots.map((slot) => (
            <button
              key={slot.id}
              onClick={() => {
                setSelectedTimeSlot(slot.id);
                onSelect(selectedDate, slot.id);
              }}
              className={cn(
                "flex-1 min-w-[60px] py-2 px-2 sm:px-3 rounded border text-center transition-all",
                selectedTimeSlot === slot.id
                  ? "border-rose-600 bg-rose-50 text-rose-600 ring-1 ring-rose-600"
                  : "border-slate-200 text-primary hover:border-slate-800",
              )}
            >
              <p className="text-xs sm:text-sm font-black">{slot.label}</p>
              {slot.range && (
                <p className="text-[9px] sm:text-[10px] font-bold opacity-60">
                  {slot.range}
                </p>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
