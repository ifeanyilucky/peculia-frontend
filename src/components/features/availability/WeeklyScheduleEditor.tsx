"use client";

import { useState } from "react";
import {
  Clock,
  Plus,
  Trash2,
  Copy,
  AlertCircle,
  Save,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { sileo } from "sileo";
import { availabilityService } from "@/services/availability.service";

const DAYS = [
  { id: 1, name: "Monday" },
  { id: 2, name: "Tuesday" },
  { id: 3, name: "Wednesday" },
  { id: 4, name: "Thursday" },
  { id: 5, name: "Friday" },
  { id: 6, name: "Saturday" },
  { id: 0, name: "Sunday" },
];

interface TimeRange {
  startTime: string;
  endTime: string;
}

interface DaySchedule {
  dayOfWeek: number;
  isAvailable: boolean;
  slots: TimeRange[];
}

export default function WeeklyScheduleEditor({
  initialSchedule,
}: {
  initialSchedule?: DaySchedule[];
}) {
  const [schedule, setSchedule] = useState<DaySchedule[]>(
    initialSchedule ||
      DAYS.map((day) => ({
        dayOfWeek: day.id,
        isAvailable: day.id !== 0, // Off on Sundays by default
        slots: [{ startTime: "09:00", endTime: "17:00" }],
      })),
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleToggleDay = (dayIndex: number) => {
    setSchedule((prev) =>
      prev.map((day, idx) =>
        idx === dayIndex ? { ...day, isAvailable: !day.isAvailable } : day,
      ),
    );
  };

  const addSlot = (dayIndex: number) => {
    setSchedule((prev) =>
      prev.map((day, idx) =>
        idx === dayIndex
          ? {
              ...day,
              slots: [...day.slots, { startTime: "17:00", endTime: "19:00" }],
            }
          : day,
      ),
    );
  };

  const removeSlot = (dayIndex: number, slotIndex: number) => {
    setSchedule((prev) =>
      prev.map((day, idx) =>
        idx === dayIndex
          ? {
              ...day,
              slots: day.slots.filter((_, sIdx) => sIdx !== slotIndex),
            }
          : day,
      ),
    );
  };

  const updateSlot = (
    dayIndex: number,
    slotIndex: number,
    field: keyof TimeRange,
    value: string,
  ) => {
    setSchedule((prev) =>
      prev.map((day, idx) =>
        idx === dayIndex
          ? {
              ...day,
              slots: day.slots.map((slot, sIdx) =>
                sIdx === slotIndex ? { ...slot, [field]: value } : slot,
              ),
            }
          : day,
      ),
    );
  };

  const copyToAll = (sourceDayIndex: number) => {
    const sourceDay = schedule[sourceDayIndex];
    setSchedule((prev) =>
      prev.map((day) => ({
        ...day,
        isAvailable: sourceDay.isAvailable,
        slots: [...sourceDay.slots.map((s) => ({ ...s }))],
      })),
    );
    sileo.success({
      title: "Copied",
      description: `Schedule copied to all days.`,
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await availabilityService.saveWeeklySchedule({ days: schedule });
      sileo.success({
        title: "Success",
        description: "Your weekly schedule has been updated.",
      });
    } catch {
      sileo.error({
        title: "Error",
        description: "Failed to save schedule. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
      <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
        <div>
          <h3 className="font-peculiar text-xl font-bold text-slate-900">
            Weekly Business Hours
          </h3>
          <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-widest">
            Recurring Availability
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="h-12 px-6 rounded-2xl bg-slate-900 text-xs font-black uppercase tracking-widest text-white hover:bg-rose-600 transition-all shadow-lg flex items-center gap-2 disabled:opacity-70"
        >
          {isSaving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          Save Changes
        </button>
      </div>

      <div className="p-8 space-y-8">
        {schedule.map((day, dayIdx) => {
          const dayName = DAYS.find((d) => d.id === day.dayOfWeek)?.name;

          return (
            <div key={day.dayOfWeek} className="group relative">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-8 border-b border-slate-50 last:border-0 last:pb-0">
                <div className="w-40 shrink-0 flex items-center gap-3">
                  <button
                    onClick={() => handleToggleDay(dayIdx)}
                    className={cn(
                      "h-6 w-11 rounded-full relative transition-all outline-none",
                      day.isAvailable ? "bg-slate-900" : "bg-slate-100",
                    )}
                  >
                    <div
                      className={cn(
                        "absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-all shadow-sm",
                        day.isAvailable && "translate-x-5",
                      )}
                    />
                  </button>
                  <span
                    className={cn(
                      "text-sm font-black uppercase tracking-widest",
                      day.isAvailable ? "text-slate-900" : "text-slate-300",
                    )}
                  >
                    {dayName}
                  </span>
                </div>

                <div className="flex-1 space-y-4">
                  {!day.isAvailable ? (
                    <div className="h-12 flex items-center text-xs font-bold text-slate-400 italic">
                      No working hours set for {dayName}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {day.slots.map((slot, slotIdx) => (
                        <div
                          key={slotIdx}
                          className="flex items-center gap-2 group/slot"
                        >
                          <div className="flex-1 grid grid-cols-2 bg-slate-50 rounded-2xl border border-slate-100 p-1 group-hover/slot:border-slate-300 transition-all">
                            <input
                              type="time"
                              value={slot.startTime}
                              onChange={(e) =>
                                updateSlot(
                                  dayIdx,
                                  slotIdx,
                                  "startTime",
                                  e.target.value,
                                )
                              }
                              className="h-10 bg-transparent px-4 text-sm font-bold text-slate-900 outline-none"
                            />
                            <div className="relative">
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-px bg-slate-200" />
                              <input
                                type="time"
                                value={slot.endTime}
                                onChange={(e) =>
                                  updateSlot(
                                    dayIdx,
                                    slotIdx,
                                    "endTime",
                                    e.target.value,
                                  )
                                }
                                className="h-10 w-full bg-transparent px-4 text-sm font-bold text-slate-900 outline-none"
                              />
                            </div>
                          </div>
                          {day.slots.length > 1 && (
                            <button
                              onClick={() => removeSlot(dayIdx, slotIdx)}
                              className="p-3 rounded-2xl text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => addSlot(dayIdx)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all"
                      >
                        <Plus size={14} />
                        Add Break / Shift
                      </button>
                    </div>
                  )}
                </div>

                <div className="lg:opacity-0 group-hover:opacity-100 transition-all">
                  <button
                    onClick={() => copyToAll(dayIdx)}
                    className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:border-slate-900 hover:text-slate-900 shadow-sm transition-all"
                  >
                    <Copy size={14} />
                    Copy to all
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-8 bg-amber-50 border-t border-amber-100 flex items-start gap-4">
        <AlertCircle className="text-amber-500 shrink-0" size={20} />
        <div>
          <p className="text-sm font-bold text-amber-900">
            Pro Tip: Lunch Breaks
          </p>
          <p className="text-xs font-base text-amber-700 mt-1">
            To set a lunch break, add two slots! For example: 09:00 - 12:00 and
            13:00 - 17:00.
          </p>
        </div>
      </div>
    </div>
  );
}
