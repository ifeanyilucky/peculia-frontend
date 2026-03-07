"use client";

import { useState } from "react";
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
  Check,
} from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

const POLICY_VERSION = "1.0";

export default function BookingConfirmation() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;
  const [showPolicyDetails, setShowPolicyDetails] = useState(false);
  const {
    selectedProvider,
    selectedServices,
    selectedTeamMember,
    selectedDate,
    selectedSlot,
    totalPrice,
    policyAccepted,
    setPolicyAccepted,
  } = useBookingStore();

  // Use slug from params or fallback to selectedProvider.slug
  const providerSlug = slug || selectedProvider?.slug;

  if (
    !selectedDate ||
    !selectedSlot ||
    selectedServices.length === 0 ||
    !selectedProvider
  ) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle size={48} className="text-secondary mb-4" />
        <h2 className="text-xl font-black text-primary">Missing information</h2>
        <p className="text-muted-foreground mt-2">
          Please complete the previous steps first.
        </p>
        <button
          onClick={() => router.push(`/book/${providerSlug}/services`)}
          className="mt-6 px-6 py-3 rounded-full bg-primary text-white font-bold"
        >
          Go back to services
        </button>
      </div>
    );
  }

  const depositAmount = Math.round(totalPrice * 0.2); // 20% deposit

  return (
    <div className="w-full flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="font-peculiar text-2xl font-black text-primary mb-8 tracking-tight">
        Confirm booking
      </h1>

      <div className="space-y-6">
        {/* Date and Time Card */}
        <div className="bg-white rounded-2xl border border-secondary p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center text-primary">
              <CalendarDays size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                Date & Time
              </p>
              <h3 className="text-lg font-black text-primary">
                {format(selectedDate, "EEEE, MMMM d, yyyy")}
              </h3>
              <p className="text-foreground font-bold flex items-center gap-1.5 mt-0.5">
                <Clock size={14} className="text-muted-foreground" />
                {selectedSlot.startTime}
              </p>
            </div>
          </div>
        </div>

        {/* Selected Services */}
        <div className="bg-white rounded-2xl border border-secondary p-6">
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">
            Selected Services
          </p>
          <div className="space-y-4">
            {selectedServices.map((service) => (
              <div
                key={service.id}
                className="flex justify-between items-start"
              >
                <div>
                  <h4 className="font-black text-primary">{service.name}</h4>
                  <p className="text-sm text-muted-foreground font-bold">
                    {service.duration} mins •{" "}
                    {formatCurrency(service.price / 100)}
                  </p>
                </div>
              </div>
            ))}
            <div className="pt-4 border-t border-secondary flex justify-between items-center">
              <span className="font-black text-primary">Total</span>
              <span className="font-black text-xl text-primary">
                {formatCurrency(totalPrice / 100)}
              </span>
            </div>
            <div className="pt-2 border-t border-secondary flex justify-between items-center">
              <span className="text-sm font-bold text-muted-foreground">
                Deposit Required (20%)
              </span>
              <span className="font-black text-lg text-emerald-600">
                {formatCurrency(depositAmount / 100)}
              </span>
            </div>
          </div>
        </div>

        {/* Professional */}
        <div className="bg-white rounded-2xl border border-secondary p-6">
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">
            Professional
          </p>
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-secondary border border-secondary">
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
                <div className="flex h-full w-full items-center justify-center bg-secondary text-primary">
                  <User size={24} />
                </div>
              )}
            </div>
            <div>
              <h4 className="font-black text-primary">
                {selectedTeamMember
                  ? `${selectedTeamMember.firstName} ${selectedTeamMember.lastName}`
                  : selectedProvider?.businessName}
              </h4>
              <div className="flex items-center gap-1 mt-0.5">
                <BadgeCheck size={14} className="text-blue-500" />
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                  Verified Professional
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Location (Simplified) */}
        {selectedProvider?.location?.address && (
          <div className="bg-white rounded-2xl border border-secondary p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <MapPin size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                  Location
                </p>
                <h3 className="text-lg font-black text-primary">
                  {selectedProvider.businessName}
                </h3>
                <p className="text-foreground font-bold mt-0.5">
                  {selectedProvider.location.address}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* NEW Deposit Protection Policy */}
        <div className="bg-primary rounded-2xl p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <ShieldCheck size={20} className="text-accent" />
            </div>
            <div className="flex-1">
              <h4 className="font-black text-sm uppercase tracking-wider">
                Deposit Protection Policy
              </h4>
              <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
                Your deposit is{" "}
                <span className="text-white font-bold">non-refundable</span>.
                You may reschedule once at least 24 hours before your
                appointment. Cancelling will forfeit your deposit.
              </p>
              <button
                type="button"
                onClick={() => setShowPolicyDetails(!showPolicyDetails)}
                className="text-accent text-xs font-bold mt-2 hover:underline"
              >
                {showPolicyDetails ? "Hide details" : "View full policy"}
              </button>

              {showPolicyDetails && (
                <div className="mt-4 p-4 bg-white/5 rounded-xl space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <Check
                      size={16}
                      className="text-emerald-400 mt-0.5 shrink-0"
                    />
                    <p className="text-secondary">
                      20% deposit is required to confirm booking
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check
                      size={16}
                      className="text-emerald-400 mt-0.5 shrink-0"
                    />
                    <p className="text-secondary">
                      One free reschedule allowed (24h notice)
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check
                      size={16}
                      className="text-emerald-400 mt-0.5 shrink-0"
                    />
                    <p className="text-secondary">
                      Rescheduling does not reset refund eligibility
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-accent mt-0.5 shrink-0" />
                    <p className="text-secondary">
                      Client cancellation = deposit forfeited
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check
                      size={16}
                      className="text-emerald-400 mt-0.5 shrink-0"
                    />
                    <p className="text-secondary">
                      Provider cancellation = full refund
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-accent mt-0.5 shrink-0" />
                    <p className="text-secondary">
                      No-show = deposit transferred to provider
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Policy Acceptance Checkbox */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <label className="flex items-start gap-3 cursor-pointer">
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0 mt-0.5 ${
                  policyAccepted
                    ? "bg-secondary0 border-secondary0"
                    : "border-muted-foreground hover:border-muted-foreground"
                }`}
              >
                {policyAccepted && <Check size={12} className="text-white" />}
              </div>
              <input
                type="checkbox"
                className="sr-only"
                checked={policyAccepted}
                onChange={(e) => setPolicyAccepted(e.target.checked)}
              />
              <p className="text-sm text-secondary">
                I accept the{" "}
                <span className="text-white font-bold">
                  deposit protection policy
                </span>{" "}
                and understand that my deposit is non-refundable.
              </p>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
