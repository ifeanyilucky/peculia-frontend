"use client";

import { useBookingStore } from "@/store/booking.store";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import {
  CalendarDays,
  Clock,
  User,
  ShieldCheck,
  AlertCircle,
  MapPin,
  BadgeCheck,
} from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

export default function BookingConfirmation() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;
  const {
    selectedProvider,
    selectedServices,
    selectedTeamMember,
    selectedDate,
    selectedSlot,
    totalPrice,
  } = useBookingStore();

  // Use slug from params or fallback to selectedProvider.slug
  const providerSlug = slug || selectedProvider?.slug;

  if (!selectedDate || !selectedSlot || selectedServices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle size={48} className="text-slate-300 mb-4" />
        <h2 className="text-xl font-black text-slate-900">
          Missing information
        </h2>
        <p className="text-slate-500 mt-2">
          Please complete the previous steps first.
        </p>
        <button
          onClick={() => router.push(`/book/${providerSlug}/services`)}
          className="mt-6 px-6 py-3 rounded-full bg-slate-900 text-white font-bold"
        >
          Go back to services
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="font-peculiar text-4xl font-black text-slate-900 mb-8 tracking-tight">
        Confirm booking
      </h1>

      <div className="space-y-6">
        {/* Date and Time Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
              <CalendarDays size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                Date & Time
              </p>
              <h3 className="text-lg font-black text-slate-900">
                {format(selectedDate, "EEEE, MMMM d, yyyy")}
              </h3>
              <p className="text-slate-600 font-bold flex items-center gap-1.5 mt-0.5">
                <Clock size={14} className="text-slate-400" />
                {selectedSlot.startTime}
              </p>
            </div>
          </div>
        </div>

        {/* Selected Services */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
            Selected Services
          </p>
          <div className="space-y-4">
            {selectedServices.map((service) => (
              <div
                key={service.id}
                className="flex justify-between items-start"
              >
                <div>
                  <h4 className="font-black text-slate-900">{service.name}</h4>
                  <p className="text-sm text-slate-500 font-bold">
                    {service.duration} mins • {formatCurrency(service.price / 100)}
                  </p>
                </div>
              </div>
            ))}
            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
              <span className="font-black text-slate-900">Total</span>
              <span className="font-black text-xl text-slate-900">
                {formatCurrency(totalPrice / 100)}
              </span>
            </div>
          </div>
        </div>

        {/* Professional */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
            Professional
          </p>
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
              {selectedTeamMember?.avatar || selectedProvider?.userId.avatar ? (
                <Image
                  src={
                    selectedTeamMember?.avatar ||
                    selectedProvider?.userId.avatar ||
                    ""
                  }
                  alt="Professional"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-rose-50 text-rose-600">
                  <User size={24} />
                </div>
              )}
            </div>
            <div>
              <h4 className="font-black text-slate-900">
                {selectedTeamMember
                  ? `${selectedTeamMember.firstName} ${selectedTeamMember.lastName}`
                  : selectedProvider?.businessName}
              </h4>
              <div className="flex items-center gap-1 mt-0.5">
                <BadgeCheck size={14} className="text-blue-500" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Verified Professional
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Location (Simplified) */}
        {selectedProvider?.location?.address && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <MapPin size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                  Location
                </p>
                <h3 className="text-lg font-black text-slate-900">
                  {selectedProvider.businessName}
                </h3>
                <p className="text-slate-600 font-bold mt-0.5">
                  {selectedProvider.location.address}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Cancellation Policy */}
        <div className="bg-slate-900 rounded-2xl p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <ShieldCheck size={20} className="text-rose-400" />
            </div>
            <div>
              <h4 className="font-black text-sm uppercase tracking-wider">
                Booking Policy
              </h4>
              <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                Cancel for free up to{" "}
                <span className="text-white font-bold">24 hours</span> before
                your appointment. Late cancellations may incur a fee.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
