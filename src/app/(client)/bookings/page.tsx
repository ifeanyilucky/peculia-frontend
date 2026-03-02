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
import CenterModal from "@/components/common/CenterModal";
import Pagination from "@/components/ui/Pagination";
import { Loader2, Search, CalendarX, Plus, CalendarClock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { isToday, isTomorrow, isThisWeek, isPast, format } from "date-fns";
import { ROUTES } from "@/constants/routes";
import { formatCurrency } from "@/utils/formatters";

/**
 * Groups an array of bookings into labelled date sections.
 * Order: Today → Tomorrow → This Week → Upcoming → Past.
 */
/** Statuses that are considered "done" regardless of scheduled date */
const TERMINAL_STATUSES = new Set([
  "cancelled_by_client",
  "cancelled_by_provider",
  "expired",
  "no_show",
  "completed",
]);

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
    // Terminal-status bookings always go to Past, regardless of scheduled date
    if (TERMINAL_STATUSES.has(b.status)) {
      sections[4].items.push(b);
      continue;
    }
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
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
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
            href={ROUTES.public.explore}
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
        {selectedBooking && (
          <BookingDetailsView
            booking={selectedBooking}
            onManageClick={() => {
              setIsManageModalOpen(true);
            }}
          />
        )}
      </RightSideModal>

      {/* Manage Appointment Modal */}
      <CenterModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        title="Manage appointment"
      >
        {selectedBooking && (
          <ManageAppointmentModalContent
            booking={selectedBooking}
            onClose={() => setIsManageModalOpen(false)}
          />
        )}
      </CenterModal>
    </div>
  );
}

// Needed to silence unused import warning — format is used indirectly by date-fns helpers
void format;

function ManageAppointmentModalContent({
  booking,
  onClose,
}: {
  booking: Booking;
  onClose: () => void;
}) {
  const router = useRouter();
  const provider = booking.providerProfileId as unknown as {
    businessName?: string;
    portfolioImages?: { url: string }[];
  };
  const businessName = provider?.businessName || "Professional";
  const businessLogo =
    provider?.portfolioImages?.[0]?.url || "/placeholder-business.png";
  const serviceTotal = (booking.servicePrice || 0) / 100;

  return (
    <div className="text-left mt-2">
      <div className="flex items-center gap-4 mb-8">
        <div className="relative h-14 w-14 rounded-2xl overflow-hidden shrink-0 border border-slate-100">
          <Image
            src={businessLogo}
            alt={businessName}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <p className="font-bold text-slate-900">
            {format(new Date(booking.scheduledDate), "eee, d MMM yyyy")} at{" "}
            {booking.startTime}
          </p>
          <p className="text-sm font-medium text-slate-500">{businessName}</p>
          <p className="text-sm font-medium text-slate-400">
            {formatCurrency(serviceTotal)} · {booking.services.length} item
            {booking.services.length !== 1 && "s"}
          </p>
        </div>
      </div>

      <div className="space-y-1 border-t border-slate-100 pt-5">
        <button 
          onClick={() => {
            onClose();
            router.push(`/appointments/${booking.id}/reschedule/professional`);
          }}
          className="w-full flex items-center gap-3 py-4 px-2 hover:bg-slate-50 rounded-xl transition-all group"
        >
          <CalendarClock
            size={20}
            className="text-slate-400 group-hover:text-slate-900"
          />
          <span className="font-bold text-slate-900 text-[15px]">
            Reschedule appointment
          </span>
        </button>
        <button className="w-full flex items-center gap-3 py-4 px-2 hover:bg-rose-50 rounded-xl transition-all group">
          <CalendarX
            size={20}
            className="text-slate-400 group-hover:text-rose-500"
          />
          <span className="font-bold text-rose-500 text-[15px]">
            Cancel appointment
          </span>
        </button>
      </div>
    </div>
  );
}
