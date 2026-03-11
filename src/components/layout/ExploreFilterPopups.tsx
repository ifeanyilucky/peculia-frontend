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
    <div className="w-[340px] bg-white rounded-3xl shadow-2xl border border-glam-blush overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 border-b border-glam-blush">
        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
          {searchQuery ? "Results" : "Popular Treatments"}
        </p>
      </div>

      {/* List */}
      <div className="p-2 max-h-72 overflow-y-auto grid gap-0.5">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
            <Loader2 size={16} className="animate-spin text-glam-plum" />
            <span className="text-sm font-medium">Loading…</span>
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((spec) => (
            <button
              key={spec.id}
              onClick={() => onSelect(spec.label)}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-glam-blush/40 active:bg-glam-blush transition-colors text-left group w-full"
            >
              {/* Icon placeholder */}
              <div className="h-10 w-10 rounded-xl bg-glam-blush/30 flex items-center justify-center group-hover:bg-white transition-colors shrink-0 text-lg">
                {SPECIALTY_EMOJIS[spec.label] ?? "✨"}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-glam-plum truncate">
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
        <div className="px-5 py-3 border-t border-glam-blush bg-glam-blush/10">
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
    <div className="w-[320px] bg-white rounded-3xl shadow-2xl border border-glam-blush overflow-hidden">
      {/* Use my location */}
      <div className="px-5 pt-4 pb-2">
        <button
          disabled
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl border border-dashed border-glam-blush text-left opacity-50 cursor-not-allowed"
        >
          <Navigation size={16} className="text-glam-plum shrink-0" />
          <div>
            <p className="text-sm font-bold text-glam-plum">Use my location</p>
            <p className="text-[10px] text-muted-foreground">
              Location services not available
            </p>
          </div>
        </button>
      </div>

      {/* Divider */}
      <div className="px-5 py-2">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-glam-blush" />
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            {searchQuery ? "Results" : "Popular Cities"}
          </p>
          <div className="flex-1 h-px bg-glam-blush" />
        </div>
      </div>

      {/* Cities */}
      <div className="px-2 pb-2 max-h-64 overflow-y-auto grid gap-0.5">
        {filtered.length > 0 ? (
          filtered.map((city) => (
            <button
              key={city.label}
              onClick={() => onSelect(city.label)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-2xl hover:bg-glam-blush/40 active:bg-glam-blush transition-colors text-left group w-full"
            >
              <span className="text-xl shrink-0">{city.flag}</span>
              <p className="text-sm font-bold text-glam-plum">{city.label}</p>
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
    <div className="w-[calc(100vw-2rem)] max-w-[480px] bg-white rounded-3xl shadow-2xl border border-glam-blush overflow-hidden">
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
                  ? "border-glam-plum bg-glam-blush/30 ring-1 ring-glam-plum/20"
                  : "border-glam-blush hover:border-glam-gold/50",
              )}
            >
              <p className="text-sm font-black text-glam-plum">{label}</p>
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
            className="p-1.5 hover:bg-glam-blush/50 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
          </button>
          <p className="text-sm font-black text-glam-plum">
            {format(viewDate, "MMMM yyyy")}
          </p>
          <button
            onClick={handleNextMonth}
            className="p-1.5 hover:bg-glam-blush/50 rounded-full transition-colors"
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
                    ? "bg-glam-plum text-white shadow-md"
                    : isToday && !isSelected
                      ? "text-glam-plum ring-1 ring-glam-plum/30"
                      : isCurrentMonth && !past
                        ? "text-glam-charcoal hover:bg-glam-blush/40"
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
      <div className="border-t border-glam-blush p-4">
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
                    ? "border-glam-plum bg-glam-plum text-white"
                    : "border-glam-blush text-glam-plum hover:border-glam-plum/40 hover:bg-glam-blush/30",
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
          <div className="mt-3 p-3 bg-glam-blush/30 rounded-2xl space-y-2">
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
                  className="w-full px-3 py-2 border border-glam-blush rounded-xl text-sm font-bold text-glam-plum bg-white focus:ring-2 focus:ring-glam-plum/20 focus:outline-none"
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
                  className="w-full px-3 py-2 border border-glam-blush rounded-xl text-sm font-bold text-glam-plum bg-white focus:ring-2 focus:ring-glam-plum/20 focus:outline-none"
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
// ─────────────────────────────────────────────────────────────────────────────
// Quick Filter Popovers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Sort selection popover content.
 */
export function SortPopover({
  value,
  onSelect,
}: {
  value: string;
  onSelect: (val: string) => void;
}) {
  const options = [
    { id: "rating", label: "Top rated", icon: "⭐" },
    { id: "distance", label: "Nearest", icon: "📍" },
    { id: "newest", label: "Newest", icon: "✨" },
    { id: "relevance", label: "Best match", icon: "🎯" },
  ];

  return (
    <div className="w-[200px] bg-white rounded-3xl shadow-2xl border border-glam-blush overflow-hidden p-2">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onSelect(opt.id)}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all text-left",
            value === opt.id
              ? "bg-glam-plum text-white shadow-sm"
              : "hover:bg-glam-blush/40 text-glam-plum font-bold text-sm",
          )}
        >
          <span className="text-base shrink-0">{opt.icon}</span>
          <span
            className={cn(
              "text-sm font-bold",
              value === opt.id ? "text-white" : "text-glam-plum",
            )}
          >
            {opt.label}
          </span>
        </button>
      ))}
    </div>
  );
}

/**
 * Price selection popover content.
 */
export function PricePopover({
  value,
  onSelect,
}: {
  value: number;
  onSelect: (val: number) => void;
}) {
  const [tempPrice, setTempPrice] = useState(value || 500000);

  return (
    <div className="w-[280px] bg-white rounded-3xl shadow-2xl border border-glam-blush overflow-hidden p-5">
      <div className="flex items-center justify-between mb-5">
        <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
          Max Price
        </h4>
        <span className="text-sm font-black text-glam-plum">
          NGN {tempPrice.toLocaleString()}
        </span>
      </div>

      <input
        type="range"
        min="1000"
        max="1000000"
        step="1000"
        value={tempPrice}
        onChange={(e) => setTempPrice(Number(e.target.value))}
        className="w-full h-1.5 bg-glam-blush rounded-lg appearance-none cursor-pointer accent-glam-plum mb-6"
      />

      <div className="flex gap-2">
        <button
          onClick={() => onSelect(0)}
          className="flex-1 py-2.5 rounded-xl border border-glam-blush text-xs font-black text-muted-foreground hover:bg-glam-blush/30 transition-all"
        >
          Reset
        </button>
        <button
          onClick={() => onSelect(tempPrice)}
          className="flex-2 py-2.5 bg-glam-plum text-white text-xs font-black rounded-xl hover:bg-glam-plum/90 transition-all shadow-md active:scale-95"
        >
          Apply
        </button>
      </div>
    </div>
  );
}

/**
 * Rating selection popover content.
 */
export function RatingPopover({
  value,
  onSelect,
}: {
  value: number;
  onSelect: (val: number) => void;
}) {
  const ratings = [
    { label: "Any rating", val: 0 },
    { label: "4.5+ ★", val: 4.5 },
    { label: "4.0+ ★", val: 4.0 },
    { label: "3.5+ ★", val: 3.5 },
  ];

  return (
    <div className="w-[180px] bg-white rounded-3xl shadow-2xl border border-glam-blush overflow-hidden p-2">
      {ratings.map((r) => (
        <button
          key={r.val}
          onClick={() => onSelect(r.val)}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all text-left",
            value === r.val
              ? "bg-glam-plum text-white shadow-sm"
              : "hover:bg-glam-blush/40 text-glam-plum font-bold text-sm",
          )}
        >
          <span
            className={cn(
              "text-sm font-bold",
              value === r.val ? "text-white" : "text-glam-plum",
            )}
          >
            {r.label}
          </span>
        </button>
      ))}
    </div>
  );
}

/**
 * Type/Verification selection popover content.
 */
export function TypePopover({
  isVerified,
  onToggleVerified,
}: {
  isVerified: boolean;
  onToggleVerified: (val: boolean) => void;
}) {
  return (
    <div className="w-[240px] bg-white rounded-3xl shadow-2xl border border-glam-blush overflow-hidden p-5">
      <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">
        Professional Type
      </h4>

      <div className="flex items-center justify-between gap-4 p-3 bg-glam-blush/30 rounded-2xl border border-glam-blush/50">
        <div className="min-w-0">
          <p className="text-xs font-black text-glam-plum">Verified Only</p>
          <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
            Only show vetted professionals
          </p>
        </div>
        <button
          onClick={() => onToggleVerified(!isVerified)}
          className={cn(
            "h-6 w-11 rounded-full transition-all relative shrink-0",
            isVerified ? "bg-glam-plum" : "bg-slate-300",
          )}
        >
          <div
            className={cn(
              "absolute top-1 h-4 w-4 rounded-full bg-white transition-all shadow-sm",
              isVerified ? "left-6" : "left-1",
            )}
          />
        </button>
      </div>

      <div className="mt-4 pt-4 border-t border-glam-blush">
        <p className="text-[10px] text-muted-foreground text-center italic">
          Additional professional categories and visit types coming soon.
        </p>
      </div>
    </div>
  );
}
