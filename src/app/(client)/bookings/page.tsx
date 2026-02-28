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
import { Loader2, Search, CalendarX } from "lucide-react";

export default function MyBookingsPage() {
  const [currentTab, setCurrentTab] = useState<BookingStatusFilter>("all");
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const LIMIT = 10;

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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-peculiar text-3xl font-black text-slate-900 tracking-tight">
            Appointments
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Manage your style journey and upcoming sessions.
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
              value={searchQuery}
              onChange={handleSearchChange}
              className="h-12 w-full sm:w-64 pl-11 pr-4 rounded-2xl bg-white border border-slate-100 text-sm font-medium focus:border-rose-500 transition-all outline-none"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
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
          ) : bookings?.results?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-100 italic text-slate-400">
              <CalendarX size={48} className="mb-4 opacity-10" />
              <p className="text-lg font-medium">
                No {currentTab !== "all" ? currentTab : ""} bookings found.
              </p>
              <button
                onClick={() => {
                  setCurrentTab("all");
                  setSearchQuery("");
                  setDebouncedSearch("");
                }}
                className="mt-4 text-xs font-black uppercase tracking-widest text-rose-600 hover:underline"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Group bookings by status like in screenshot? Or just list? */}
              {/* For now, matching the screenshot's "Upcoming" section look */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 px-2">
                  <h2 className="text-xl font-peculiar font-black text-slate-900">
                    Upcoming
                  </h2>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-black text-white">
                    {bookings?.results?.length || 0}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
            </div>
          )}
        </div>

        {/* Pagination */}
        {bookings?.pagination && (
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
