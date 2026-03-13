"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Booking,
  getProviderFromBooking,
  getProviderName,
  getProviderLogo,
} from "@/types/booking.types";
import { format } from "date-fns";
import {
  Calendar,
  MapPin,
  Settings,
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  AlertCircle,
  Ban,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/formatters";
import { useRouter } from "next/navigation";
import { DEFAULT_BUSINESS_IMAGE } from "@/constants/images";
import { useQuery, useMutation } from "@tanstack/react-query";
import { reviewService } from "@/services/review.service";
import { queryKeys } from "@/constants/queryKeys";
import { Loader2 } from "lucide-react";

interface BookingDetailsViewProps {
  booking: Booking;
  onManageClick?: () => void;
}

/** Maps every booking status to display config. */
const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: React.ElementType }
> = {
  pending_payment: {
    label: "Action Required",
    color: "bg-amber-500 text-white",
    icon: Clock,
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-emerald-600 text-white",
    icon: CheckCircle2,
  },
  in_progress: {
    label: "In Progress",
    color: "bg-blue-600 text-white",
    icon: Clock,
  },
  completed: {
    label: "Completed",
    color: "bg-slate-700 text-white",
    icon: CheckCircle2,
  },
  cancelled_by_client: {
    label: "Cancelled",
    color: "bg-primary text-white",
    icon: XCircle,
  },
  cancelled_by_provider: {
    label: "Cancelled by Provider",
    color: "bg-primary text-white",
    icon: Ban,
  },
  no_show: {
    label: "No Show",
    color: "bg-muted-foreground text-white",
    icon: AlertCircle,
  },
  expired: {
    label: "Expired",
    color: "bg-muted-foreground text-white",
    icon: Clock,
  },
};

/** Whether an action zone (manage / pay) should be visible */
const isActionable = (status: string) =>
  status === "pending_payment" || status === "confirmed";

export default function BookingDetailsView({
  booking,
  onManageClick,
}: BookingDetailsViewProps) {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const provider = getProviderFromBooking(booking);
  const businessName = getProviderName(booking);
  const logoUrl = getProviderLogo(booking);
  const imageSrc = imgError || !logoUrl ? DEFAULT_BUSINESS_IMAGE : logoUrl;

  const address = provider?.location?.address;
  const importantInfo = provider?.bio;
  const locationInstructions = provider?.location?.directions;

  const statusCfg = STATUS_CONFIG[booking.status] ?? {
    label: booking.status.replace(/_/g, " "),
    color: "bg-secondary text-secondary-foreground",
    icon: CheckCircle2,
  };

  const isCompleted = booking.status === "completed";
  const canReview = isCompleted;

  const { data: existingReview, refetch: refetchReview } = useQuery({
    queryKey: queryKeys.reviews.booking(booking.id),
    queryFn: () => reviewService.getReviewByBooking(booking.id),
    enabled: canReview,
  });

  const hasReviewed = !!existingReview;

  // Pricing — values stored in kobo (pence), convert to naira for display
  const serviceTotal = booking.servicePrice || 0;
  const depositAmount = booking.depositAmount || 0;
  const remainingBalance = booking.remainingBalance || 0;

  // Handlers
  const handleAddToCalendar = () => {
    try {
      const dtStart = new Date(
        `${booking.scheduledDate.split("T")[0]}T${booking.startTime}:00`,
      );
      const dtEnd = new Date(
        `${booking.scheduledDate.split("T")[0]}T${booking.endTime}:00`,
      );
      const startStr = dtStart.toISOString().replace(/[-:.][\d]+$/g, "");
      const endStr = dtEnd.toISOString().replace(/[-:.][\d]+$/g, "");
      const title = encodeURIComponent(`Appointment at ${businessName}`);
      const details = encodeURIComponent(`Booking Ref: ${booking.bookingRef}`);
      const loc = encodeURIComponent(address || "");
      window.open(
        `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${details}&location=${loc}`,
        "_blank",
      );
    } catch (err) {
      console.error("Calendar link error", err);
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

  const handleVenueDetails = () => {
    if (provider?.slug) router.push(`/providers/${provider.slug}`);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      {/* ── Hero Image ── */}
      <div className="relative h-48 w-full shrink-0">
        <Image
          src={imageSrc}
          alt={businessName}
          fill
          className="object-cover"
          onError={() => setImgError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-5">
          <div>
            <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">
              {booking.bookingRef}
            </p>
            <h1 className="text-2xl font-peculiar font-black text-white leading-tight">
              {businessName}
            </h1>
          </div>
        </div>
      </div>

      {/* ── Scrollable Body ── */}
      <div className="flex-1 p-5 space-y-6 pb-8">
        {/* Status + Date */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <h2 className="text-lg font-peculiar font-bold text-primary leading-tight">
              {format(new Date(booking.scheduledDate), "eee, d MMM yyyy")} at{" "}
              {booking.startTime}
            </h2>
            <p className="text-muted-foreground font-medium text-sm">
              {booking.totalDuration} min · {booking.services.length}{" "}
              {booking.services.length === 1 ? "service" : "services"}
            </p>
          </div>
          <div
            className={cn(
              "shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest",
              statusCfg.color,
            )}
          >
            <statusCfg.icon size={12} strokeWidth={3} />
            {statusCfg.label}
          </div>
        </div>

        {/* Pay deposit CTA — only for pending_payment */}
        {booking.status === "pending_payment" && depositAmount > 0 && (
          <button className="w-full py-3.5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all active:scale-[0.98] shadow-md">
            Pay Deposit · {formatCurrency(depositAmount)}
          </button>
        )}

        {/* Deposit paid confirmation */}
        {booking.depositPaid && (
          <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 text-xs font-bold">
            <CheckCircle2 size={14} />
            Deposit of {formatCurrency(depositAmount)} paid
          </div>
        )}

        {/* Review CTA — only for completed bookings without review */}
        {canReview && !hasReviewed && (
          <button
            onClick={() => setShowReviewModal(true)}
            className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:from-amber-500 hover:to-yellow-600 transition-all active:scale-[0.98] shadow-md flex items-center justify-center gap-2"
          >
            <Star size={16} className="fill-white" />
            Review your appointment
          </button>
        )}

        {/* Already reviewed badge */}
        {hasReviewed && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 text-amber-700 rounded-2xl border border-amber-100 text-xs font-bold">
              <Star size={14} className="fill-amber-400" />
              You reviewed this appointment ({existingReview.rating}/5)
            </div>
            {provider?.slug && (
              <Link
                href={`/providers/${provider.slug}`}
                className="w-full py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-[0.98] shadow-md flex items-center justify-center gap-2"
              >
                Book this provider again
              </Link>
            )}
          </div>
        )}

        {/* ── Quick Actions ── */}
        <div className="space-y-0.5">
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
          {isActionable(booking.status) && (
            <ActionItem
              icon={Settings}
              label="Manage appointment"
              onClick={onManageClick || (() => {})}
            />
          )}
          <ActionItem
            icon={Building2}
            label="Venue details"
            onClick={handleVenueDetails}
          />
        </div>

        {/* ── Services ── */}
        <section className="space-y-3 pt-4 border-t border-secondary">
          <h3 className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
            Services
          </h3>
          <div className="space-y-2.5">
            {booking.services.map((service, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center gap-3 p-3 bg-secondary/50 rounded-xl"
              >
                <div>
                  <p className="text-sm font-bold text-primary">
                    {service.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
                    {service.duration} min
                  </p>
                </div>
                <p className="text-sm font-black text-primary shrink-0">
                  {formatCurrency(service.price)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Pricing Summary ── */}
        <section className="space-y-3 pt-4 border-t border-secondary">
          <h3 className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
            Payment
          </h3>
          <div className="space-y-2.5">
            <div className="flex justify-between text-sm text-secondary-foreground/70 font-medium">
              <span>Total</span>
              <span className="text-primary font-bold">
                {formatCurrency(serviceTotal)}
              </span>
            </div>
            {depositAmount > 0 && (
              <>
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-emerald-600">Deposit paid</span>
                  <span className="text-emerald-600 font-bold">
                    − {formatCurrency(depositAmount)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-secondary">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Due at appointment
                  </span>
                  <span className="text-xl font-peculiar font-black text-primary">
                    {formatCurrency(remainingBalance)}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground font-medium italic">
                  Payable directly to the professional on the day.
                </p>
              </>
            )}
          </div>
        </section>

        {/* ── Map / Getting There ── */}
        <section className="space-y-3 pt-4 border-t border-secondary">
          <h3 className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
            Getting there
          </h3>
          <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-secondary group">
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
              <div className="h-full w-full bg-secondary/50 flex flex-col items-center justify-center gap-2">
                <MapPin size={20} className="text-slate-300" />
                <p className="text-xs text-muted-foreground font-medium">
                  Address not available
                </p>
              </div>
            )}
            <button
              onClick={handleGetDirections}
              className="absolute bottom-3 right-3 bg-white px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 hover:scale-105 transition-transform border border-secondary"
            >
              <MapPin size={12} className="text-primary" />
              <span className="text-xs font-bold text-primary">
                Open in Maps
              </span>
            </button>
          </div>
          {locationInstructions && (
            <p className="text-xs text-secondary-foreground/80 leading-relaxed font-medium bg-secondary/30 p-3 rounded-xl">
              <span className="font-bold text-slate-800 block mb-1">
                Directions
              </span>
              {locationInstructions}
            </p>
          )}
        </section>

        {/* ── Important Info ── */}
        {importantInfo && (
          <section className="space-y-2 pt-4 border-t border-secondary">
            <h3 className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Important info
            </h3>
            <p className="text-xs text-secondary-foreground/80 leading-relaxed font-medium bg-secondary/30 p-3 rounded-xl whitespace-pre-line border border-secondary/20">
              {importantInfo}
            </p>
          </section>
        )}

        {/* Booking ref footer */}
        <p className="text-[10px] font-bold uppercase text-center tracking-widest text-slate-300 pt-2">
          Ref: {booking.bookingRef}
        </p>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        booking={booking}
        onSuccess={() => refetchReview()}
      />
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
      className="w-full flex items-center justify-between p-3.5 bg-white hover:bg-secondary/50 rounded-xl transition-all group"
    >
      <div className="flex items-center gap-3.5">
        <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-secondary text-slate-600 group-hover:bg-primary group-hover:text-white transition-all">
          <Icon size={16} />
        </div>
        <div className="text-left">
          <p className="text-sm font-bold text-primary">{label}</p>
          {description && (
            <p className="text-[11px] text-muted-foreground font-medium truncate max-w-[190px]">
              {description}
            </p>
          )}
        </div>
      </div>
      <ChevronRight
        size={16}
        className="text-slate-300 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all"
      />
    </button>
  );
}

function StarRatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  const labels: Record<number, string> = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Great",
    5: "Excellent!",
  };
  const active = hovered || value;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="group focus:outline-none transition-transform duration-150"
          >
            <Star
              size={32}
              className={`transition-all duration-200 ${
                active >= star
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-slate-200 fill-slate-100"
              }`}
            />
          </button>
        ))}
      </div>
      <span className="text-sm font-semibold text-slate-500">
        {active > 0 ? labels[active] : "Tap to rate"}
      </span>
    </div>
  );
}

function ReviewModal({
  isOpen,
  onClose,
  booking,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
  onSuccess: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submitMutation = useMutation({
    mutationFn: () =>
      reviewService.submitReview({
        bookingId: booking.id,
        rating,
        comment: comment.trim() || undefined,
      }),
    onSuccess: () => {
      onSuccess();
      onClose();
      setRating(0);
      setComment("");
      setError(null);
    },
    onError: (err: unknown) => {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to submit review. Please try again.",
      );
    },
  });

  const isSubmitting = submitMutation.isPending;

  const handleSubmit = () => {
    if (rating === 0) return;
    setError(null);
    submitMutation.mutate();
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setError(null);
      onClose();
    }
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          onClick={handleClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary/50 text-muted-foreground disabled:opacity-50"
        >
          <XCircle size={20} />
        </button>

        <h3 className="text-xl font-peculiar font-bold text-primary text-center mb-1">
          Rate Your Experience
        </h3>
        <p className="text-xs text-muted-foreground text-center mb-6">
          How was your appointment with {getProviderName(booking)}?
        </p>

        <StarRatingInput value={rating} onChange={setRating} />

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience (optional)"
          className="w-full mt-6 p-3 rounded-xl border border-secondary bg-secondary/30 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          rows={3}
          maxLength={1000}
        />

        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-xl">
            <p className="text-xs text-red-600 font-medium">{error}</p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={rating === 0 || isSubmitting}
          className="w-full mt-4 py-3.5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Review"
          )}
        </button>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
