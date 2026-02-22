"use client";

import { useQuery } from "@tanstack/react-query";
import { availabilityService } from "@/services/availability.service";
import { useAuthStore } from "@/store/auth.store";
import WeeklyScheduleEditor from "@/components/features/availability/WeeklyScheduleEditor";
import BlockedDatesCalendar from "@/components/features/availability/BlockedDatesCalendar";
import {
  Calendar,
  Clock,
  MapPin,
  Info,
  Loader2,
  CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AvailabilityPage() {
  const { user } = useAuthStore();

  const { data: schedule, isLoading } = useQuery({
    queryKey: ["weekly-schedule", user?.id],
    queryFn: () => availabilityService.getWeeklySchedule(user?.id || ""),
    enabled: !!user?.id,
  });

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div className="space-y-2">
          <h1 className="font-outfit text-4xl font-black text-slate-900 tracking-tight">
            Availability
          </h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">
            Set your working hours and manage your time off.
          </p>
        </div>

        <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-2xl border border-blue-100">
          <Info className="text-blue-600" size={18} />
          <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">
            All times are in WAT (UTC+1)
          </p>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Recurring Schedule */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <Clock className="text-rose-600" size={24} />
            <h2 className="font-outfit text-2xl font-black text-slate-900">
              Weekly Schedule
            </h2>
          </div>

          {isLoading ? (
            <div className="h-[600px] flex flex-col items-center justify-center bg-white rounded-[2.5rem] border border-slate-100">
              <Loader2 className="animate-spin text-rose-600" size={32} />
              <p className="text-sm font-black uppercase tracking-widest text-slate-400 mt-4">
                Loading schedule...
              </p>
            </div>
          ) : (
            <WeeklyScheduleEditor initialSchedule={schedule?.days} />
          )}
        </div>

        {/* Calendar / Blocked Dates */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <CalendarDays className="text-rose-600" size={24} />
            <h2 className="font-outfit text-2xl font-black text-slate-900">
              Custom Time Off
            </h2>
          </div>

          <div className="h-full">
            <BlockedDatesCalendar />
          </div>
        </div>
      </div>
    </div>
  );
}
