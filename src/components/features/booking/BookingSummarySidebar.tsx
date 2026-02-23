"use client";

import { Service, Provider } from "@/types/provider.types";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useBookingStore } from "@/store/booking.store";

interface BookingSummarySidebarProps {
  provider: Provider;
}

export default function BookingSummarySidebar({
  provider,
}: BookingSummarySidebarProps) {
  const { selectedServices, totalPrice, totalDuration } = useBookingStore();

  return (
    <aside className="w-full lg:w-[400px] lg:shrink-0 h-fit lg:sticky lg:top-28">
      <div className="rounded-[2rem] border border-slate-100 bg-white shadow-xl shadow-slate-200/50 flex flex-col min-h-[500px]">
        {/* Provider Profile Info */}
        <div className="p-6 flex items-start gap-4 border-b border-slate-100">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-100">
            <Image
              src={provider.userId.avatar || "/images/placeholder-avatar.png"}
              alt={provider.businessName}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 leading-tight">
              {provider.businessName}
            </h3>
            <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <span className="flex items-center text-yellow-500 font-bold">
                {provider.rating.toFixed(1)}
                <span className="ml-0.5 text-yellow-400">★</span>
              </span>
              <span className="text-slate-300">•</span>
              <span>({provider.totalReviews.toLocaleString()})</span>
            </div>
            <p className="mt-1 text-xs text-slate-500 truncate">
              {provider.location?.address ||
                provider.location?.city ||
                "Address not provided"}
            </p>
          </div>
        </div>

        {/* Selected Services Info */}
        <div className="flex-1 p-6 flex flex-col">
          {selectedServices.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-sm font-medium text-slate-400">
              No services selected
            </div>
          ) : (
            <div className="flex-1 space-y-4 overflow-y-auto">
              {selectedServices.map((service) => (
                <div
                  key={service.id}
                  className="flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900">
                      {service.name}
                    </p>
                    <p className="text-[11px] font-medium text-slate-500">
                      {service.duration} mins • {service.duration} minutes with
                      any professional
                    </p>
                  </div>
                  <p className="text-sm font-black text-slate-900 tabular-nums shrink-0 mt-0.5">
                    ₦{(service.price / 100).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Total & Action Button */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 rounded-b-[2rem]">
          <div className="flex items-center justify-between font-peculiar text-xl font-black text-slate-900 mb-6">
            <span>Total</span>
            <span>
              {totalPrice > 0
                ? `£${(totalPrice / 100).toLocaleString()}`
                : "free"}
            </span>
          </div>

          <button
            disabled={selectedServices.length === 0}
            className="w-full rounded-full bg-slate-900 py-4 text-sm font-black text-white transition-all hover:bg-slate-800 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </div>
    </aside>
  );
}
