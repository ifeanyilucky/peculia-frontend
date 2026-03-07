"use client";

import { useState } from "react";
import { useSpecialties } from "@/hooks/useSpecialties";
import {
  Search,
  MapPin,
  Navigation,
  ChevronRight,
  ChevronLeft,
  Loader2,
} from "lucide-react";
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
  isBefore,
} from "date-fns";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Treatment Dropdown
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Treatment selection dropdown panel.
 * Shows a searchable list of specialties fetched from the API.
 */
export function TreatmentDropdown({
  onSelect,
  searchQuery = "",
}: {
  onSelect: (id: string) => void;
  searchQuery?: string;
}) {
  const { data: specialties = [], isLoading } = useSpecialties();

  const filtered = specialties.filter((spec) =>
    spec.label.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="w-[340px] bg-white rounded-3xl shadow-2xl border border-secondary overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 border-b border-secondary/60">
        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
          {searchQuery ? "Results" : "Popular Treatments"}
        </p>
      </div>

      {/* List */}
      <div className="p-2 max-h-72 overflow-y-auto grid gap-0.5">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-sm font-medium">Loading…</span>
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((spec) => (
            <button
              key={spec.id}
              onClick={() => onSelect(spec.label)}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-secondary/50 active:bg-secondary transition-colors text-left group w-full"
            >
              {/* Icon placeholder */}
              <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-white transition-colors shrink-0 text-lg">
                {SPECIALTY_EMOJIS[spec.label] ?? "✨"}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-primary truncate">
                  {spec.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  Professional service
                </p>
              </div>
              <ChevronRight
                size={14}
                className="ml-auto text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
              />
            </button>
          ))
        ) : (
          <div className="py-8 text-center">
            <Search
              size={24}
              className="mx-auto mb-2 text-muted-foreground/50"
            />
            <p className="text-sm font-medium text-muted-foreground">
              No treatments found
            </p>
          </div>
        )}
      </div>

      {/* Footer hint */}
      {!searchQuery && (
        <div className="px-5 py-3 border-t border-secondary/60 bg-secondary/20">
          <p className="text-[10px] text-muted-foreground">
            Type in the search bar above to filter treatments
          </p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Location Dropdown
// ─────────────────────────────────────────────────────────────────────────────

const CITY_LIST = [
  { label: "Lagos, Nigeria", flag: "🇳🇬" },
  { label: "Abuja, Nigeria", flag: "🇳🇬" },
  { label: "Port Harcourt, Nigeria", flag: "🇳🇬" },
  { label: "Ibadan, Nigeria", flag: "🇳🇬" },
  { label: "Lekki Phase I, Lagos", flag: "📍" },
  { label: "Victoria Island, Lagos", flag: "📍" },
  { label: "Ikeja, Lagos", flag: "📍" },
];

/**
 * Location selection dropdown panel.
 * Shows a "use my location" nudge and a curated list of cities.
 */
export function LocationDropdown({
  onSelect,
  searchQuery = "",
}: {
  onSelect: (city: string) => void;
  searchQuery?: string;
}) {
  const filtered = CITY_LIST.filter((c) =>
    c.label.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="w-[320px] bg-white rounded-3xl shadow-2xl border border-secondary overflow-hidden">
      {/* Use my location */}
      <div className="px-5 pt-4 pb-2">
        <button
          disabled
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl border border-dashed border-secondary/80 text-left opacity-50 cursor-not-allowed"
        >
          <Navigation size={16} className="text-primary shrink-0" />
          <div>
            <p className="text-sm font-bold text-primary">Use my location</p>
            <p className="text-[10px] text-muted-foreground">
              Location services not available
            </p>
          </div>
        </button>
      </div>

      {/* Divider */}
      <div className="px-5 py-2">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-secondary/60" />
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            {searchQuery ? "Results" : "Popular Cities"}
          </p>
          <div className="flex-1 h-px bg-secondary/60" />
        </div>
      </div>

      {/* Cities */}
      <div className="px-2 pb-2 max-h-64 overflow-y-auto grid gap-0.5">
        {filtered.length > 0 ? (
          filtered.map((city) => (
            <button
              key={city.label}
              onClick={() => onSelect(city.label)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-2xl hover:bg-secondary/50 active:bg-secondary transition-colors text-left group w-full"
            >
              <span className="text-xl shrink-0">{city.flag}</span>
              <p className="text-sm font-bold text-primary">{city.label}</p>
              <ChevronRight
                size={14}
                className="ml-auto text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
              />
            </button>
          ))
        ) : (
          <div className="py-6 text-center">
            <MapPin
              size={22}
              className="mx-auto mb-2 text-muted-foreground/50"
            />
            <p className="text-sm font-medium text-muted-foreground">
              No locations found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DateTime Dropdown
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Preset time slot definitions.
 * id = value sent to the backend:
 *   "Any time" | "Morning" | "Afternoon" | "Evening" | "HH:mm-HH:mm" (custom)
 */
const TIME_SLOTS = [
  { id: "Any time", label: "Any time", range: "" },
  { id: "Morning", label: "Morning", range: "09–12" },
  { id: "Afternoon", label: "Afternoon", range: "12–17" },
  { id: "Evening", label: "Evening", range: "17–00" },
  { id: "Custom", label: "Custom", range: "" },
];

const WEEK_DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

/**
 * Date + time selection dropdown panel.
 * Full inline calendar with quick-select buttons and time slots.
 *
 * onSelect is called with:
 *  - date: the selected Date object
 *  - time: backend-ready token — "Any time" | "Morning" | "Afternoon" | "Evening" | "HH:mm-HH:mm"
 */
export function DateTimeDropdown({
  onSelect,
}: {
  onSelect: (date: Date, time: string) => void;
}) {
  const today = startOfToday();
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [viewDate, setViewDate] = useState<Date>(today);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("Any time");
  // Custom time range
  const [customStart, setCustomStart] = useState("09:00");
  const [customEnd, setCustomEnd] = useState("17:00");

  const handlePrevMonth = () => setViewDate(subMonths(viewDate, 1));
  const handleNextMonth = () => setViewDate(addMonths(viewDate, 1));

  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const isPast = (d: Date) => isBefore(d, today) && !isSameDay(d, today);

  return (
    <div className="w-[calc(100vw-2rem)] max-w-[480px] bg-white rounded-3xl shadow-2xl border border-secondary overflow-hidden">
      {/* Quick picks */}
      <div className="flex gap-2 p-4 pb-0">
        {[
          { label: "Today", date: today },
          { label: "Tomorrow", date: addDays(today, 1) },
        ].map(({ label, date }) => {
          const isSelected = isSameDay(selectedDate, date);
          return (
            <button
              key={label}
              onClick={() => {
                setSelectedDate(date);
                setViewDate(date);
                onSelect(date, selectedTimeSlot);
              }}
              className={cn(
                "flex-1 px-3 py-2.5 rounded-2xl border text-left transition-all",
                isSelected
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                  : "border-secondary hover:border-slate-300",
              )}
            >
              <p className="text-sm font-black text-primary">{label}</p>
              <p className="text-[10px] text-muted-foreground">
                {format(date, "EEE, d MMM")}
              </p>
            </button>
          );
        })}
      </div>

      {/* Calendar */}
      <div className="p-4">
        {/* Month nav */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePrevMonth}
            disabled={isSameMonth(viewDate, today)}
            className="p-1.5 hover:bg-secondary rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
          </button>
          <p className="text-sm font-black text-primary">
            {format(viewDate, "MMMM yyyy")}
          </p>
          <button
            onClick={handleNextMonth}
            className="p-1.5 hover:bg-secondary rounded-full transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-1">
          {WEEK_DAYS.map((d) => (
            <span
              key={d}
              className="text-center text-[10px] font-black text-muted-foreground py-1"
            >
              {d}
            </span>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-y-0.5">
          {calendarDays.map((date, i) => {
            const isSelected = isSameDay(selectedDate, date);
            const isToday = isSameDay(today, date);
            const isCurrentMonth = isSameMonth(date, monthStart);
            const past = isPast(date);

            return (
              <button
                key={i}
                onClick={() => {
                  if (past) return;
                  setSelectedDate(date);
                  onSelect(date, selectedTimeSlot);
                }}
                disabled={past}
                className={cn(
                  "h-9 w-9 mx-auto flex items-center justify-center rounded-full text-sm font-bold transition-all",
                  isSelected
                    ? "bg-primary text-white shadow-md"
                    : isToday && !isSelected
                      ? "text-primary ring-1 ring-primary/30"
                      : isCurrentMonth && !past
                        ? "text-slate-700 hover:bg-secondary"
                        : "text-slate-300 cursor-default",
                )}
              >
                {format(date, "d")}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time slots */}
      <div className="border-t border-secondary/60 p-4">
        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3">
          Time of day
        </p>
        <div className="flex flex-wrap gap-2">
          {TIME_SLOTS.map((slot) => {
            const isSelected = selectedTimeSlot === slot.id;
            return (
              <button
                key={slot.id}
                onClick={() => {
                  setSelectedTimeSlot(slot.id);
                  // For non-custom slots, emit immediately
                  if (slot.id !== "Custom") {
                    onSelect(selectedDate, slot.id);
                  }
                }}
                className={cn(
                  "flex-1 min-w-[70px] py-2 px-3 rounded-xl border text-center transition-all",
                  isSelected
                    ? "border-primary bg-primary text-white"
                    : "border-secondary text-primary hover:border-primary/40 hover:bg-secondary/30",
                )}
              >
                <p className="text-xs font-black">{slot.label}</p>
                {slot.range && (
                  <p className="text-[9px] font-medium opacity-70 mt-0.5">
                    {slot.range}
                  </p>
                )}
              </button>
            );
          })}
        </div>

        {/* Custom time range picker — shown only when "Custom" is selected */}
        {selectedTimeSlot === "Custom" && (
          <div className="mt-3 p-3 bg-secondary/30 rounded-2xl space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Select your time range
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="text-[10px] font-bold text-muted-foreground block mb-1">
                  From
                </label>
                <input
                  type="time"
                  value={customStart}
                  onChange={(e) => {
                    setCustomStart(e.target.value);
                    if (
                      e.target.value &&
                      customEnd &&
                      e.target.value < customEnd
                    ) {
                      onSelect(selectedDate, `${e.target.value}-${customEnd}`);
                    }
                  }}
                  className="w-full px-3 py-2 border border-secondary rounded-xl text-sm font-bold text-primary bg-white focus:ring-2 focus:ring-primary/20 focus:outline-none"
                />
              </div>
              <span className="text-muted-foreground text-sm font-black mt-4">
                →
              </span>
              <div className="flex-1">
                <label className="text-[10px] font-bold text-muted-foreground block mb-1">
                  To
                </label>
                <input
                  type="time"
                  value={customEnd}
                  onChange={(e) => {
                    setCustomEnd(e.target.value);
                    if (
                      customStart &&
                      e.target.value &&
                      customStart < e.target.value
                    ) {
                      onSelect(
                        selectedDate,
                        `${customStart}-${e.target.value}`,
                      );
                    }
                  }}
                  className="w-full px-3 py-2 border border-secondary rounded-xl text-sm font-bold text-primary bg-white focus:ring-2 focus:ring-primary/20 focus:outline-none"
                />
              </div>
            </div>
            {customStart >= customEnd && (
              <p className="text-[10px] text-destructive font-bold">
                End time must be after start time
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Emoji map for specialty labels — add more as API data grows */
const SPECIALTY_EMOJIS: Record<string, string> = {
  Haircut: "✂️",
  "Hair Styling": "💇",
  "Hair Colouring": "🎨",
  Manicure: "💅",
  Pedicure: "🦶",
  Facial: "🧖",
  Massage: "💆",
  Waxing: "🌺",
  Makeup: "💄",
  Lashes: "👁️",
  Brows: "🤩",
  "Nail Art": "🎨",
  Braiding: "🌀",
  Extensions: "✨",
  Skincare: "🧴",
  Tanning: "☀️",
  Threading: "🪡",
  "Body Treatment": "🛁",
};
