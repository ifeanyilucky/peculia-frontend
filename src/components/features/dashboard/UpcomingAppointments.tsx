"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { bookingService } from "@/services/booking.service";
import { CalendarDays, Clock, ChevronRight, Loader2 } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { Booking } from "@/types/booking.types";
import { Provider } from "@/types/provider.types";
import Image from "next/image";
import RightSideModal from "@/components/ui/RightSideModal";
import BookingDetailsView from "@/components/features/bookings/BookingDetailsView";

export default function UpcomingAppointments() {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["bookings", "upcoming", "client"],
    queryFn: () =>
      bookingService.getMyBookings({ status: "confirmed", limit: 3 }),
  });

  if (isLoading) {
    return (
      <div className="h-48 rounded-3xl bg-white border border-slate-100 flex items-center justify-center">
        <Loader2 className="animate-spin text-rose-600" size={24} />
      </div>
    );
  }

  const upcomingBookings: Booking[] = bookings?.results || [];

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="font-peculiar text-xl font-bold text-slate-900">
            Upcoming Appointments
          </h3>
          <Link
            href="/bookings"
            className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-1"
          >
            View All
            <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid gap-4">
          {upcomingBookings.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-slate-100 p-8 text-center text-slate-400">
              <CalendarDays size={32} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm font-medium">
                No upcoming appointments found.
              </p>
              <Link
                href="/explore"
                className="mt-4 inline-block text-xs font-black uppercase tracking-widest text-rose-600 hover:text-rose-700"
              >
                Book a session
              </Link>
            </div>
          ) : (
            upcomingBookings.map((booking) => {
              const provider =
                typeof booking.providerProfileId === "object"
                  ? (booking.providerProfileId as unknown as Provider)
                  : null;

              const businessName = provider?.businessName || "Professional";
              const logo =
                provider?.portfolioImages?.[0]?.url ||
                provider?.userId?.avatar ||
                null;
              const serviceInitial = booking.services[0]?.name?.[0] ?? "B";

              return (
                <button
                  key={booking.id}
                  onClick={() => setSelectedBooking(booking)}
                  className="group flex items-center gap-4 bg-white p-4 rounded-3xl border border-slate-100 hover:border-rose-200 transition-all duration-300 w-full text-left"
                >
                  {/* Provider logo / fallback */}
                  <div className="h-16 w-16 rounded-2xl bg-rose-50 overflow-hidden relative border border-slate-100 shrink-0">
                    {logo ? (
                      <Image
                        src={logo}
                        alt={businessName}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-rose-600 font-black text-xl">
                        {serviceInitial}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 truncate group-hover:text-rose-600 transition-colors">
                      {booking.services[0]?.name}
                      {booking.services.length > 1 && (
                        <span className="ml-2 text-slate-400 font-bold">
                          +{booking.services.length - 1}
                        </span>
                      )}
                    </h4>
                    <p className="text-sm text-slate-500 truncate mt-0.5">
                      with{" "}
                      <span className="font-semibold text-slate-700">
                        {businessName}
                      </span>
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <CalendarDays size={12} className="text-rose-500" />
                        {format(new Date(booking.scheduledDate), "MMM do")}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <Clock size={12} className="text-blue-500" />
                        {booking.startTime}
                      </div>
                    </div>
                  </div>

                  <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-rose-600 group-hover:text-white transition-all shrink-0">
                    <ChevronRight size={18} />
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Booking details drawer — shared pattern with bookings page */}
      <RightSideModal
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        title="Appointment Details"
      >
        {selectedBooking && <BookingDetailsView booking={selectedBooking} />}
      </RightSideModal>
    </>
  );
}
