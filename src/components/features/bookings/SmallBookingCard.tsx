"use client";

import { useState } from "react";
import {
  Booking,
  getProviderName,
  getProviderLogo,
  getProviderFromBooking,
} from "@/types/booking.types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/formatters";
import Image from "next/image";
import { DEFAULT_BUSINESS_IMAGE } from "@/constants/images";
import { Star } from "lucide-react";
import Link from "next/link";

interface SmallBookingCardProps {
  booking: Booking;
  isSelected?: boolean;
  onClick: () => void;
}

export default function SmallBookingCard({
  booking,
  isSelected,
  onClick,
}: SmallBookingCardProps) {
  const [imgError, setImgError] = useState(false);

  const businessName = getProviderName(booking);
  const logoUrl = getProviderLogo(booking);
  const imageSrc = imgError || !logoUrl ? DEFAULT_BUSINESS_IMAGE : logoUrl;
  const provider = getProviderFromBooking(booking);
  const providerSlug = provider?.slug;
  const isCompleted = booking.status === "completed";

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 p-3 rounded-2xl border transition-all duration-300 text-left group",
        isSelected
          ? "border-violet-500 bg-violet-50/30 ring-1 ring-violet-500"
          : "border-secondary bg-white hover:border-slate-400",
      )}
    >
      <div className="relative h-14 w-14 shrink-0 rounded-xl overflow-hidden border border-secondary">
        <Image
          src={imageSrc}
          alt={businessName}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          onError={() => setImgError(true)}
        />
        {isCompleted && (
          <div className="absolute -top-1 -right-1 h-5 w-5 bg-amber-400 rounded-full flex items-center justify-center shadow-sm">
            <Star size={10} className="fill-white text-white" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 pr-2">
        <h4 className="font-peculiar font-black text-primary truncate text-[14px]">
          {businessName}
        </h4>
        <p className="text-muted-foreground text-[12px] font-medium mt-0.5">
          {format(new Date(booking.scheduledDate), "eee, d MMM yyyy")} at{" "}
          {booking.startTime}
        </p>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-muted-foreground text-[11px] font-bold">
            {formatCurrency(booking.servicePrice || 0)}
          </span>
          <span className="h-0.5 w-0.5 rounded-full bg-secondary" />
          <span className="text-muted-foreground text-[11px] font-medium">
            {booking.services.length}{" "}
            {booking.services.length === 1 ? "item" : "items"}
          </span>
        </div>
        {isCompleted && providerSlug && (
          <div className="mt-2">
            <Link
              href={`/providers/${providerSlug}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 hover:text-amber-700 transition-colors"
            >
              <Star size={10} className="fill-amber-400" />
              Book again
            </Link>
          </div>
        )}
      </div>
    </button>
  );
}
