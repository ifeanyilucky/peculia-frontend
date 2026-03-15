"use client";

import { useState, useEffect } from "react";
import {
  Sparkles,
  X,
  LayoutGrid,
  Bookmark,
  CalendarDays,
  ArrowRight,
  Activity,
  Clock,
  Loader2,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useQuery } from "@tanstack/react-query";
import { bookingService } from "@/services/booking.service";
import dynamic from "next/dynamic";
import { format } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";

// Dynamically loaded to avoid pulling all booking components into the initial bundle
const UpcomingAppointments = dynamic(
  () => import("@/components/features/dashboard/UpcomingAppointments"),
  { ssr: false },
);

export default function ClientDashboardPage() {
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [showWelcome, setShowWelcome] = useState(() => {
    if (typeof window !== "undefined") {
      return !localStorage.getItem("peculia_welcome_hidden");
    }
    return false;
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const hideWelcome = () => {
    localStorage.setItem("peculia_welcome_hidden", "true");
    setShowWelcome(false);
  };

  const {
    data: recentActivity,
    isLoading: isLoadingActivity,
    isError: hasActivityError,
  } = useQuery({
    queryKey: ["bookings", "recent", "client"],
    queryFn: () => bookingService.getMyBookings({ limit: 3 }),
  });

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Banner */}
      {mounted && showWelcome && (
        <div className="relative overflow-hidden rounded-2xl bg-slate-900 p-8 lg:p-12 text-white border border-slate-200">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-glam-plum/20 blur-[100px]" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-blue-600/20 blur-[100px]" />

          <button
            onClick={hideWelcome}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white/60 hover:text-white"
          >
            <X size={20} />
          </button>

          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-glam-plum/20 px-4 py-2 text-xs font-bold text-glam-plum border border-glam-plum/30">
              <Sparkles size={14} />
              Welcome to the community
            </div>
            <h1 className="font-peculiar text-3xl lg:text-4xl font-black ">
              Hello,{" "}
              <span className="capitalize">{user?.firstName || "there"}</span>!
              <br />
              <span className="text-white/60">
                Ready for your next session?
              </span>
            </h1>
            <p className="text-base text-white/50 font-medium leading-relaxed">
              Explore thousands of verified professionals, book appointments in
              seconds, and manage your beauty routine all in one place.
            </p>
            <div className="pt-4">
              <Link
                href={ROUTES.public.explore}
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-black text-slate-900 hover:bg-glam-plum hover:text-white transition-all border border-slate-200"
              >
                Find a Professional
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Left Column: Upcoming & Quick Actions */}
        <div className="lg:col-span-2 space-y-10">
          <UpcomingAppointments />

          <div className="space-y-4">
            <h3 className="font-peculiar text-xl font-bold text-slate-900 px-2">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                {
                  label: "Find Pro",
                  icon: LayoutGrid,
                  href: ROUTES.public.explore,
                  color: "bg-blue-50 text-blue-600",
                },
                {
                  label: "My Bookings",
                  icon: CalendarDays,
                  href: ROUTES.client.bookings,
                  color: "bg-rose-50 text-glam-plum",
                },
                {
                  label: "Saved",
                  icon: Bookmark,
                  href: ROUTES.client.saved,
                  color: "bg-amber-50 text-amber-600",
                },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="group flex flex-col items-center justify-center gap-3 p-6 rounded-4xl bg-white border border-slate-100 hover:border-slate-900 transition-all duration-300"
                >
                  <div
                    className={cn(
                      "h-14 w-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                      action.color,
                    )}
                  >
                    <action.icon size={28} />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-slate-900">
                    {action.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Recent Activity */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-peculiar text-xl font-bold text-slate-900">
              Recent Activity
            </h3>
            <Activity size={20} className="text-slate-300" />
          </div>

          <div className="rounded-4xl bg-white border border-slate-100 p-6 space-y-6">
            {isLoadingActivity ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-glam-plum" size={24} />
              </div>
            ) : hasActivityError ? (
              <div className="text-center py-6">
                <p className="text-sm font-medium text-glam-plum">
                  Failed to load activity.
                </p>
              </div>
            ) : recentActivity?.results?.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm font-medium text-slate-400">
                  No recent activity.
                </p>
              </div>
            ) : (
              recentActivity?.results?.map(
                (item: import("@/types/booking.types").Booking, i: number) => (
                  <div key={item.id} className="relative flex gap-4">
                    {/* Vertical Line */}
                    {i !== recentActivity.results.length - 1 && (
                      <div className="absolute left-4.5 top-10 bottom-0 w-0.5 bg-slate-50" />
                    )}

                    <div
                      className={cn(
                        "h-9 w-9 shrink-0 rounded-full flex items-center justify-center border-4 border-white z-10",
                        item.status === "completed"
                          ? "bg-green-100 text-green-600"
                          : item.status === "cancelled_by_client" ||
                              item.status === "cancelled_by_provider"
                            ? "bg-red-100 text-red-600"
                            : "bg-blue-100 text-blue-600",
                      )}
                    >
                      <Clock size={14} />
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-900 leading-none">
                        {item.status === "completed"
                          ? "Appointment Completed"
                          : item.status === "cancelled_by_client"
                            ? "Booking Cancelled"
                            : "Booking Created"}
                      </p>
                      <p className="text-[11px] font-medium text-slate-400">
                        {item.services[0]?.name}
                        {item.services.length > 1 &&
                          ` + ${item.services.length - 1} more`}{" "}
                        • {format(new Date(item.updatedAt), "MMM d, h:mm a")}
                      </p>
                    </div>
                  </div>
                ),
              )
            )}

            <Link
              href="/bookings"
              className="group flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-slate-50 text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-slate-900 hover:text-white transition-all"
            >
              Full Activity History
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
