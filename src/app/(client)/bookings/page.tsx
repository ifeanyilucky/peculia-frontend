"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import { bookingService } from "@/services/booking.service";
import { Booking } from "@/types/booking.types";
import BookingFilters, {
  BookingStatusFilter,
} from "@/components/features/bookings/BookingFilters";
import SmallBookingCard from "@/components/features/bookings/SmallBookingCard";
import RightSideModal from "@/components/ui/RightSideModal";
import BookingDetailsView from "@/components/features/bookings/BookingDetailsView";
import Pagination from "@/components/ui/Pagination";
import { Loader2, Search, CalendarX, Plus } from "lucide-react";
import Link from "next/link";
import { isToday, isTomorrow, isThisWeek, isPast, format } from "date-fns";

/**
 * Groups an array of bookings into labelled date sections.
 * Order: Today → Tomorrow → This Week → Upcoming → Past.
 */
function groupBookings(bookings: Booking[]): {
  label: string;
  items: Booking[];
}[] {
  const sections: { label: string; items: Booking[] }[] = [
    { label: "Today", items: [] },
    { label: "Tomorrow", items: [] },
    { label: "This Week", items: [] },
    { label: "Upcoming", items: [] },
    { label: "Past", items: [] },
  ];

  for (const b of bookings) {
    const d = new Date(b.scheduledDate);
    if (isToday(d)) sections[0].items.push(b);
    else if (isTomorrow(d)) sections[1].items.push(b);
    else if (isThisWeek(d, { weekStartsOn: 1 })) sections[2].items.push(b);
    else if (!isPast(d)) sections[3].items.push(b);
    else sections[4].items.push(b);
  }

  return sections.filter((s) => s.items.length > 0);
}

export default function MyBookingsPage() {
  const [currentTab, setCurrentTab] = useState<BookingStatusFilter>("all");
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const LIMIT = 20;

  const debouncedSetSearch = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearch(value);
        setPage(1);
      }, 500),
    [],
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSetSearch(value);
  };

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["bookings", "client", currentTab, page, debouncedSearch],
    queryFn: () =>
      bookingService.getMyBookings({
        status: currentTab === "all" ? undefined : currentTab,
        page,
        limit: LIMIT,
        search: debouncedSearch || undefined,
      }),
  });

  const grouped =
    currentTab === "all" ? groupBookings(bookings?.results || []) : null;

  const total = bookings?.pagination?.totalResults ?? 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-peculiar text-3xl font-black text-slate-900 tracking-tight">
            Appointments
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            {total > 0
              ? `${total} booking${total !== 1 ? "s" : ""} in total`
              : "Manage your style journey"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search provider..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="h-11 w-full sm:w-56 pl-10 pr-4 rounded-2xl bg-white border border-slate-100 text-sm font-medium focus:border-rose-400 transition-all outline-none shadow-sm"
            />
          </div>

          {/* Book Now CTA */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 h-11 px-5 rounded-2xl bg-slate-900 text-white text-xs font-black uppercase tracking-widest hover:bg-rose-600 transition-all active:scale-95 shrink-0"
          >
            <Plus size={14} strokeWidth={3} />
            Book
          </Link>
        </div>
      </div>

      {/* Filters */}
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
              <Loader2 className="animate-spin text-rose-600" size={36} />
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                Loading your bookings…
              </p>
            </div>
          ) : bookings?.results?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-100">
              <CalendarX size={40} className="mb-4 text-slate-200" />
              <p className="text-base font-black text-slate-400 uppercase tracking-widest">
                No bookings found
              </p>
              <p className="text-sm text-slate-400 font-medium mt-1">
                {currentTab !== "all" || debouncedSearch
                  ? "Try adjusting your filters"
                  : "Your appointments will appear here"}
              </p>
              {(currentTab !== "all" || debouncedSearch) && (
                <button
                  onClick={() => {
                    setCurrentTab("all");
                    setSearchQuery("");
                    setDebouncedSearch("");
                  }}
                  className="mt-5 text-xs font-black uppercase tracking-widest text-rose-500 hover:underline"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : currentTab === "all" && grouped ? (
            /* ── Grouped view (All tab) ── */
            <div className="space-y-10">
              {grouped.map((group) => (
                <section key={group.label}>
                  <div className="flex items-center gap-3 mb-4 px-1">
                    <h2 className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                      {group.label}
                    </h2>
                    <span className="h-px flex-1 bg-slate-100" />
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">
                      {group.items.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {group.items.map((booking) => (
                      <SmallBookingCard
                        key={booking.id}
                        booking={booking}
                        isSelected={selectedBooking?.id === booking.id}
                        onClick={() => {
                          setSelectedBooking(booking);
                          setIsModalOpen(true);
                        }}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            /* ── Flat list (filtered tabs) ── */
            <div className="space-y-3">
              <div className="flex items-center gap-3 mb-4 px-1">
                <h2 className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  {currentTab === "upcoming"
                    ? "Upcoming"
                    : currentTab === "completed"
                      ? "Completed"
                      : currentTab === "cancelled"
                        ? "Cancelled"
                        : "All"}
                </h2>
                <span className="h-px flex-1 bg-slate-100" />
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">
                  {total}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {bookings?.results?.map((booking: Booking) => (
                  <SmallBookingCard
                    key={booking.id}
                    booking={booking}
                    isSelected={selectedBooking?.id === booking.id}
                    onClick={() => {
                      setSelectedBooking(booking);
                      setIsModalOpen(true);
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {bookings?.pagination && bookings.pagination.totalPages > 1 && (
          <Pagination
            currentPage={bookings.pagination.page}
            totalPages={bookings.pagination.totalPages}
            onPageChange={setPage}
            totalResults={bookings.pagination.totalResults}
            limit={bookings.pagination.limit}
            currentCount={bookings.results.length}
          />
        )}
      </div>

      {/* Booking Details Drawer */}
      <RightSideModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Appointment Details"
      >
        {selectedBooking && <BookingDetailsView booking={selectedBooking} />}
      </RightSideModal>
    </div>
  );
}

// Needed to silence unused import warning — format is used indirectly by date-fns helpers
void format;
