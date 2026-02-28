"use client";

import { Booking } from "@/types/booking.types";
import { format } from "date-fns";
import {
  Calendar,
  MapPin,
  Settings,
  Building2,
  CheckCircle2,
  Clock,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// Assuming ProviderProfile is part of your types or can be defined here
// If ProviderProfile is not defined in booking.types, you might need to define it.
// For this change, we'll assume it's either implicitly available or we define a minimal one.
interface ProviderProfile {
  businessName: string;
  logo: string;
  address: string;
  // Add other properties of ProviderProfile if known
}

interface BookingDetailsViewProps {
  booking: Booking;
}

export default function BookingDetailsView({
  booking,
}: BookingDetailsViewProps) {
  // Assuming booking.providerProfileId actually holds the ProviderProfile object
  // If it's just an ID, then the logic for businessName, logo, address would need to fetch the profile.
  // Based on the usage, it appears to be the full profile object.
  const provider = booking.providerProfileId as ProviderProfile;
  const businessName = provider?.businessName || "Professional";
  const businessLogo = provider?.logo || "/placeholder-business.png";
  const address = provider?.address;

  const statusConfig: Record<
    string,
    { label: string; color: string; icon: any }
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
    // Add other statuses as needed
  };

  const status = statusConfig[booking.status] || {
    label: booking.status,
    color: "bg-slate-500 text-white",
    icon: CheckCircle2,
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      {/* Hero Image */}
      <div className="relative h-64 w-full">
        <Image
          src={businessLogo}
          alt={businessName}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex items-end p-6">
          <h1 className="text-3xl font-peculiar font-black text-white">
            {businessName}
          </h1>
        </div>
      </div>

      <div className="p-6 space-y-8">
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
        <div className="space-y-1">
          <h2 className="text-3xl font-peculiar font-black text-slate-900 leading-tight">
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
            onClick={() => {}}
          />
          <ActionItem
            icon={MapPin}
            label="Get directions"
            description={address}
            onClick={() => {}}
          />
          <ActionItem
            icon={Settings}
            label="Manage appointment"
            onClick={() => {}}
          />
          <ActionItem
            icon={Building2}
            label="Venue details"
            onClick={() => {}}
          />
        </div>

        {/* Overview Section */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">
            Overview
          </h3>
          <div className="space-y-4">
            {booking.services.map((service, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center group cursor-pointer"
              >
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {service.name}
                  </p>
                  <p className="text-[12px] text-slate-400 font-medium">
                    {service.duration} mins
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-black font-peculiar text-slate-900">
                    ₦{service.price.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total & Deposit Info */}
        <div className="pt-6 space-y-3">
          <div className="flex justify-between items-center py-4 px-6 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="font-black uppercase tracking-widest text-[11px] text-slate-400">
              Total Price
            </span>
            <span className="text-xl font-peculiar font-black text-slate-900">
              ₦{booking.servicePrice.toLocaleString()}
            </span>
          </div>

          {booking.depositPaid ? (
            <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-bold">
              <CheckCircle2 size={16} />
              Deposit of ₦{booking.depositAmount.toLocaleString()} paid
            </div>
          ) : (
            booking.depositAmount > 0 && (
              <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[12px] hover:bg-indigo-600 transition-all active:scale-95">
                Pay Deposit ₦{booking.depositAmount.toLocaleString()}
              </button>
            )
          )}
        </div>
      </div>
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
