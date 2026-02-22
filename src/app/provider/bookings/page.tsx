"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { bookingService } from "@/services/booking.service";
import ProviderBookingCard from "@/components/features/bookings/ProviderBookingCard";
import {
  Search,
  Filter,
  Calendar,
  Loader2,
  Inbox,
  LayoutGrid,
  List as ListIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { sileo } from "sileo";

const TABS = [
  { id: "upcoming", label: "Upcoming", status: "confirmed" },
  { id: "pending", label: "Pending Payment", status: "pending_payment" },
  { id: "completed", label: "Completed", status: "completed" },
  {
    id: "cancelled",
    label: "Cancelled",
    status: "cancelled_by_provider,cancelled_by_client",
  },
];

export default function ProviderBookingsPage() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const {
    data: bookings,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["bookings", "provider", activeTab],
    queryFn: () =>
      bookingService.getMyBookings({
        status: TABS.find((t) => t.id === activeTab)?.status,
        limit: 20,
      }),
  });

  const handleBookingAction = async (id: string, action: string) => {
    try {
      if (action === "complete") {
        await bookingService.updateBookingStatus(id, "completed");
      } else if (action === "no-show") {
        await bookingService.updateBookingStatus(id, "no_show");
      }
      sileo.success({
        title: "Success",
        description: `Booking has been ${action}d successfully.`,
      });
      refetch();
    } catch {
      sileo.error({
        title: "Action Failed",
        description: "Failed to update booking status. Please try again.",
      });
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div className="space-y-2">
          <h1 className="font-peculiar text-4xl font-black text-slate-900">
            Bookings
          </h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">
            Manage your appointments and client interactions.
          </p>
        </div>

        <div className="flex items-center gap-2 p-1 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "p-2 rounded-xl transition-all",
              viewMode === "grid"
                ? "bg-slate-900 text-white shadow-lg"
                : "text-slate-400 hover:text-slate-600",
            )}
          >
            <LayoutGrid size={18} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "p-2 rounded-xl transition-all",
              viewMode === "list"
                ? "bg-slate-900 text-white shadow-lg"
                : "text-slate-400 hover:text-slate-600",
            )}
          >
            <ListIcon size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Tabs & Search */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-1 p-1 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm overflow-x-auto no-scrollbar">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all whitespace-nowrap",
                  activeTab === tab.id
                    ? "bg-slate-900 text-white shadow-xl shadow-slate-200"
                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-50",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 lg:w-72">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search clients..."
                className="w-full h-12 bg-white border border-slate-100 rounded-2xl pl-11 pr-4 text-sm font-bold focus:border-slate-900 focus:ring-4 focus:ring-slate-50 transition-all outline-none"
              />
            </div>
            <button className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-400 hover:border-slate-900 hover:text-slate-900 transition-all">
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* Bookings Content */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-rose-600" size={32} />
            <p className="text-sm font-black uppercase tracking-widest text-slate-400">
              Loading your schedule...
            </p>
          </div>
        ) : bookings?.results?.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center bg-white rounded-[2.5rem] border border-slate-100 border-dashed">
            <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-200 mb-6">
              <Inbox size={40} />
            </div>
            <h3 className="font-peculiar text-xl font-bold text-slate-900">
              No bookings found
            </h3>
            <p className="text-slate-400 font-medium max-w-xs mt-2">
              We couldn&apos;t find any bookings in the &quot;
              {TABS.find((t) => t.id === activeTab)?.label}&quot; category.
            </p>
          </div>
        ) : (
          <div
            className={cn(
              "grid gap-6",
              viewMode === "grid"
                ? "sm:grid-cols-2 xl:grid-cols-3"
                : "grid-cols-1",
            )}
          >
            {bookings?.results?.map((booking: any) => (
              <ProviderBookingCard
                key={booking.id}
                booking={booking}
                onAction={handleBookingAction}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
