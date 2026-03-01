"use client";

import { useState } from "react";
import { Booking } from "@/types/booking.types";
import { Provider } from "@/types/provider.types";
import { format } from "date-fns";
import {
  Calendar,
  MapPin,
  Settings,
  Building2,
  CheckCircle2,
  Clock,
  ChevronRight,
  CalendarClock,
  CalendarX,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/formatters";
import CenterModal from "@/components/common/CenterModal";
import { useRouter } from "next/navigation";

interface BookingDetailsViewProps {
  booking: Booking;
}

export default function BookingDetailsView({
  booking,
}: BookingDetailsViewProps) {
  const router = useRouter();
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  const provider = booking.providerProfileId as unknown as Provider;
  const businessName = provider?.businessName || "Professional";
  const businessLogo =
    provider?.portfolioImages?.[0]?.url ||
    provider?.userId?.avatar ||
    "/placeholder-business.png";
  const address = provider?.location?.address;
  const importantInfo = provider?.bio;
  const locationInstructions = provider?.location?.directions;

  const statusConfig: Record<
    string,
    { label: string; color: string; icon: React.ElementType }
  > = {
    confirmed: {
      label: "Confirmed",
      color: "bg-indigo-600 text-white",
      icon: CheckCircle2,
    },
    pending_payment: {
      label: "Action Required",
      color: "bg-amber-500 text-white",
      icon: Clock,
    },
    expired: {
      label: "Expired",
      color: "bg-slate-400 text-white",
      icon: Clock,
    },
  };

  const status = statusConfig[booking.status] || {
    label: booking.status,
    color: "bg-slate-500 text-white",
    icon: CheckCircle2,
  };

  // Calculations
  const subtotal = booking.servicePrice / 100;
  const tax = subtotal * 0.075; // 7.5% VAT placeholder
  const total = subtotal + tax;

  // Handlers
  const handleAddToCalendar = () => {
    // Basic conversion for YYYYMMDDTHHMMSSZ format required by Google Calendar
    try {
      const dtStart = new Date(
        `${booking.scheduledDate.split("T")[0]}T${booking.startTime}:00Z`,
      );
      const dtEnd = new Date(
        `${booking.scheduledDate.split("T")[0]}T${booking.endTime}:00Z`,
      );
      const startStr = dtStart.toISOString().replace(/-|:|\.\d+/g, "");
      const endStr = dtEnd.toISOString().replace(/-|:|\.\d+/g, "");

      const title = encodeURIComponent(`Appointment at ${businessName}`);
      const details = encodeURIComponent(`Booking Ref: ${booking.bookingRef}`);
      const loc = encodeURIComponent(address || "");
      const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${details}&location=${loc}`;
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error creating calendar link", error);
    }
  };

  const handleGetDirections = () => {
    if (address) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
        "_blank",
      );
    }
  };

  const handleManageAppointment = () => {
    setIsManageModalOpen(true);
  };

  const handleVenueDetails = () => {
    if (provider?.slug) {
      router.push(`/providers/${provider.slug}`);
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      {/* Hero Image */}
      <div className="relative h-48 w-full">
        <Image
          src={businessLogo}
          alt={businessName}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex items-end p-4">
          <h1 className="text-2xl font-peculiar font-black text-white">
            {businessName}
          </h1>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Status Badge */}
        <div
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-black uppercase tracking-widest",
            status.color,
          )}
        >
          <status.icon size={14} strokeWidth={3} />
          {status.label}
        </div>

        {/* Date and Time */}
        <div className="space-y-0.5">
          <h2 className="text-xl font-peculiar font-bold text-slate-900 leading-tight">
            {format(new Date(booking.scheduledDate), "eee, d MMM yyyy")} at{" "}
            {booking.startTime}
          </h2>
          <p className="text-slate-400 font-medium tracking-tight">
            {booking.totalDuration} minutes duration
          </p>
        </div>

        {/* Action List */}
        <div className="space-y-1">
          <ActionItem
            icon={Calendar}
            label="Add to calendar"
            onClick={handleAddToCalendar}
          />
          <ActionItem
            icon={MapPin}
            label="Get directions"
            description={address}
            onClick={handleGetDirections}
          />
          <ActionItem
            icon={Settings}
            label="Manage appointment"
            onClick={handleManageAppointment}
          />
          <ActionItem
            icon={Building2}
            label="Venue details"
            onClick={handleVenueDetails}
          />
        </div>

        {/* Overview Section */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Overview
          </h3>
          <div className="space-y-3">
            {booking.services.map((service, idx) => (
              <div
                key={idx}
                className="flex justify-between items-start group cursor-pointer"
              >
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {service.name}
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {service.duration} mins
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">
                    {formatCurrency(service.price / 100)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Pricing */}
          <div className="space-y-3 pt-6 border-t border-slate-100/50">
            <div className="flex justify-between text-slate-500 font-medium text-sm">
              <span>Subtotal</span>
              <span>₦{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-500 font-medium text-sm">
              <span>Tax</span>
              <span>₦{tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-900 font-black text-lg pt-1">
              <span>Total</span>
              <span className="font-peculiar">₦{total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* More Details */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              More details
            </h3>
            <div className="space-y-3">
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-slate-900">
                  Cancellation policy
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  Cancel for free anytime.
                </p>
              </div>

              <div className="space-y-1.5">
                <p className="text-sm font-medium text-slate-900">
                  Important info
                </p>
                <div className="text-xs text-slate-500 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl border border-slate-100 whitespace-pre-line">
                  {importantInfo ||
                    `At ${businessName}, our services are strictly by booking, and payment must be made to secure your appointment(s).`}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Getting There */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Getting there
          </h3>
          <div className="relative h-44 w-full rounded-xl overflow-hidden border border-slate-100 group">
            {address ? (
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                className="grayscale contrast-[1.1] opacity-80 group-hover:opacity-100 transition-opacity"
                title="Venue Location Map"
              />
            ) : (
              <div className="h-full w-full bg-slate-50 flex items-center justify-center">
                <p className="text-xs text-slate-400 font-medium">
                  Address not available
                </p>
              </div>
            )}

            <button
              onClick={handleGetDirections}
              className="absolute bottom-3 right-3 bg-white px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 transform hover:scale-105 transition-transform border border-slate-100"
            >
              <MapPin size={14} className="text-indigo-600" />
              <span className="text-xs font-medium text-slate-900">
                Open in Maps
              </span>
            </button>
          </div>
          {locationInstructions && (
            <p className="text-xs text-slate-500 leading-relaxed font-medium mt-1 bg-slate-50/50 p-3 rounded-xl">
              <span className="font-medium text-slate-900 flex items-center gap-1.5 mb-1">
                <Building2 size={14} className="text-indigo-600" />
                Directions
              </span>
              {locationInstructions}
            </p>
          )}
        </div>

        {/* Deposit Info */}
        {booking.depositPaid ? (
          <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 text-xs font-medium">
            <CheckCircle2 size={14} />
            Deposit of {formatCurrency(booking.depositAmount / 100)} paid
          </div>
        ) : (
          booking.depositAmount > 0 && (
            <button className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-rose-600 transition-all active:scale-[0.98] shadow-md">
              Pay Deposit {formatCurrency(booking.depositAmount / 100)}
            </button>
          )
        )}
        <p className="text-[10px] font-bold uppercase text-center tracking-wider text-slate-400">
          Ref: {booking.bookingRef}
        </p>
      </div>

      {/* Manage Appointment Modal */}
      <CenterModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        title="Manage appointment"
      >
        <div className="text-left mt-2">
          <div className="flex items-center gap-4 mb-8">
            <div className="relative h-16 w-16 rounded-2xl overflow-hidden shrink-0 border border-slate-100">
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
              <p className="text-sm font-medium text-slate-500">
                {businessName}
              </p>
              <p className="text-sm font-medium text-slate-400">
                {formatCurrency(booking.servicePrice / 100)} •{" "}
                {booking.services.length} item
                {booking.services.length !== 1 && "s"}
              </p>
            </div>
          </div>

          <div className="space-y-2 border-t border-slate-100 pt-6">
            <button className="w-full flex items-center gap-3 py-4 px-2 hover:bg-slate-50 rounded-xl transition-all group">
              <CalendarClock
                size={20}
                className="text-slate-500 group-hover:text-slate-900"
              />
              <span className="font-bold text-slate-900 text-[15px]">
                Reschedule appointment
              </span>
            </button>

            <button className="w-full flex items-center gap-3 py-4 px-2 hover:bg-slate-50 rounded-xl transition-all group">
              <CalendarX
                size={20}
                className="text-slate-500 group-hover:text-slate-900"
              />
              <span className="font-bold text-slate-900 text-[15px]">
                Cancel appointment
              </span>
            </button>
          </div>
        </div>
      </CenterModal>
    </div>
  );
}

function ActionItem({
  icon: Icon,
  label,
  description,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  description?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 rounded-2xl transition-all group border-b border-transparent hover:border-slate-100 last:border-0"
    >
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-900 group-hover:bg-indigo-600 group-hover:text-white transition-all">
          <Icon size={18} />
        </div>
        <div className="text-left">
          <p className="font-bold text-slate-900">{label}</p>
          {description && (
            <p className="text-[11px] text-slate-400 font-medium truncate max-w-[200px]">
              {description}
            </p>
          )}
        </div>
      </div>
      <ChevronRight
        size={18}
        className="text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all"
      />
    </button>
  );
}
