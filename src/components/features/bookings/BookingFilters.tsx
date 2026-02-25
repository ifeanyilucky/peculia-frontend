"use client";

import { cn } from "@/lib/utils";

export type BookingStatusFilter =
  | "all"
  | "upcoming"
  | "completed"
  | "cancelled";

interface BookingFiltersProps {
  currentTab: BookingStatusFilter;
  onTabChange: (tab: BookingStatusFilter) => void;
}

const TABS: { label: string; value: BookingStatusFilter }[] = [
  { label: "All Bookings", value: "all" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export default function BookingFilters({
  currentTab,
  onTabChange,
}: BookingFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2 p-1 bg-slate-100 rounded-2xl w-fit">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={cn(
            "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300",
            currentTab === tab.value
              ? "bg-white text-slate-900 border border-slate-200"
              : "text-slate-500 hover:text-slate-900",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
