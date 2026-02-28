"use client";

import { Booking } from "@/types/booking.types";
import { Provider } from "@/types/provider.types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Image from "next/image";

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
  const provider = booking.providerProfileId as unknown as Provider;
  const businessName = provider?.businessName || "Professional";
  const businessLogo =
    provider?.portfolioImages?.[0]?.url ||
    provider?.userId?.avatar ||
    "/placeholder-business.png";

  const formatPrice = (price: number) => {
    return (price / 100).toLocaleString();
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 p-3 rounded-2xl border transition-all duration-300 text-left group",
        isSelected
          ? "border-violet-500 bg-violet-50/30 ring-1 ring-violet-500"
          : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm",
      )}
    >
      <div className="relative h-14 w-14 shrink-0 rounded-xl overflow-hidden border border-slate-100">
        <Image
          src={businessLogo}
          alt={businessName}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      <div className="flex-1 min-w-0 pr-2">
        <h4 className="font-peculiar font-black text-slate-900 truncate text-[14px]">
          {businessName}
        </h4>
        <p className="text-slate-500 text-[12px] font-medium mt-0.5">
          {format(new Date(booking.scheduledDate), "eee, d MMM yyyy")} at{" "}
          {booking.startTime}
        </p>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-slate-400 text-[11px] font-bold">
            ₦{formatPrice(booking.servicePrice)}
          </span>
          <span className="h-0.5 w-0.5 rounded-full bg-slate-300" />
          <span className="text-slate-400 text-[11px] font-medium">
            {booking.services.length}{" "}
            {booking.services.length === 1 ? "item" : "items"}
          </span>
        </div>
      </div>
    </button>
  );
}
