"use client";

import { useState } from "react";
import { Booking, getProviderName, getProviderLogo } from "@/types/booking.types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/formatters";
import Image from "next/image";
import { DEFAULT_BUSINESS_IMAGE } from "@/constants/images";

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

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 p-3 rounded-2xl border transition-all duration-300 text-left group",
        isSelected
          ? "border-violet-500 bg-violet-50/30 ring-1 ring-violet-500"
          : "border-glam-blush bg-white hover:border-glam-blush hover:shadow-sm",
      )}
    >
      <div className="relative h-14 w-14 shrink-0 rounded-xl overflow-hidden border border-glam-blush">
        <Image
          src={imageSrc}
          alt={businessName}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          onError={() => setImgError(true)}
        />
      </div>

      <div className="flex-1 min-w-0 pr-2">
        <h4 className="font-peculiar font-black text-glam-plum truncate text-[14px]">
          {businessName}
        </h4>
        <p className="text-muted-foreground text-[12px] font-medium mt-0.5">
          {format(new Date(booking.scheduledDate), "eee, d MMM yyyy")} at{" "}
          {booking.startTime}
        </p>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-muted-foreground text-[11px] font-bold">
            {formatCurrency((booking.servicePrice || 0) / 100)}
          </span>
          <span className="h-0.5 w-0.5 rounded-full bg-glam-blush" />
          <span className="text-muted-foreground text-[11px] font-medium">
            {booking.services.length}{" "}
            {booking.services.length === 1 ? "item" : "items"}
          </span>
        </div>
      </div>
    </button>
  );
}
