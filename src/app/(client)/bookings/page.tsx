"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { bookingService } from "@/services/booking.service";
import BookingFilters, {
  BookingStatusFilter,
} from "@/components/features/bookings/BookingFilters";
import ClientBookingCard from "@/components/features/bookings/ClientBookingCard";
import {
  Loader2,
  Search,
  CalendarX,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function MyBookingsPage() {
  const [currentTab, setCurrentTab] = useState<BookingStatusFilter>("all");
  const [page, setPage] = useState(1);
  const LIMIT = 10;

  const {
    data: bookings,
    isLoading,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["bookings", "client", currentTab, page],
    queryFn: () =>
      bookingService.getMyBookings({
        status: currentTab === "all" ? undefined : currentTab,
        page,
        limit: LIMIT,
      }),
  });

  const totalPages = bookings?.data?.totalPages || 1;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div className="space-y-2">
          <h1 className="font-peculiar text-4xl font-black text-slate-900">
            My Bookings
          </h1>
          <p className="text-lg text-slate-500 font-medium">
            Manage and track all your professional appointments.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by professional..."
              className="h-12 w-full sm:w-64 pl-11 pr-4 rounded-2xl bg-white border border-slate-100 text-sm font-medium focus:border-rose-500 transition-all outline-none shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <BookingFilters
          currentTab={currentTab}
          onTabChange={(tab) => {
            setCurrentTab(tab);
            setPage(1);
          }}
        />

        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <Loader2 className="animate-spin text-rose-600" size={40} />
              <p className="text-sm font-black uppercase tracking-widest text-slate-400">
                Loading your history...
              </p>
            </div>
          ) : bookings?.data?.results?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100 italic text-slate-400">
              <CalendarX size={48} className="mb-4 opacity-10" />
              <p className="text-lg font-medium">
                No {currentTab !== "all" ? currentTab : ""} bookings found.
              </p>
              <button
                onClick={() => setCurrentTab("all")}
                className="mt-4 text-xs font-black uppercase tracking-widest text-rose-600 hover:underline"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid gap-6">
              {bookings?.data?.results?.map((booking: any) => (
                <ClientBookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 pt-10">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-slate-900 hover:border-slate-300 disabled:opacity-30 transition-all"
            >
              <ArrowLeft size={20} />
            </button>

            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={cn(
                      "h-12 w-12 rounded-2xl text-sm font-heavy transition-all",
                      page === p
                        ? "bg-slate-900 text-white shadow-xl shadow-slate-200"
                        : "bg-white text-slate-500 hover:bg-slate-50",
                    )}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            <button
              disabled={page === totalPages || isPlaceholderData}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-slate-900 hover:border-slate-300 disabled:opacity-30 transition-all"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
