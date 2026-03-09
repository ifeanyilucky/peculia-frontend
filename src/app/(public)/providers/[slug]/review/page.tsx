"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { providerService } from "@/services/provider.service";
import { reviewService } from "@/services/review.service";
import { queryKeys } from "@/constants/queryKeys";
import { useAuthStore } from "@/store/auth.store";
import {
  Star,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronLeft,
  MessageSquare,
  Frown,
  Lock,
} from "lucide-react";

// ─── Star Selector ───────────────────────────────────────────────────────────

interface StarSelectorProps {
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
}

function StarSelector({ value, onChange, disabled }: StarSelectorProps) {
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
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={disabled}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="group focus:outline-none transition-transform duration-150 disabled:cursor-not-allowed"
            style={{ transform: active >= star ? "scale(1.15)" : "scale(1)" }}
          >
            <Star
              size={40}
              className={`transition-all duration-200 ${
                active >= star
                  ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.7)]"
                  : "text-slate-200 fill-slate-100"
              }`}
            />
          </button>
        ))}
      </div>
      <span
        className={`text-sm font-semibold tracking-wide transition-all duration-200 ${
          active > 0 ? "text-slate-700 opacity-100" : "text-slate-300 opacity-0"
        }`}
      >
        {labels[active] ?? ""}
      </span>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ReviewPage() {
  const params = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const bookingId = searchParams.get("booking");
  const slug = params.slug;

  const { isAuthenticated, user } = useAuthStore();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const MAX_CHARS = 1000;

  // Redirect to login if not authenticated
  useEffect(() => {
    const hasHydrated = useAuthStore.persist.hasHydrated();
    if (hasHydrated && !isAuthenticated) {
      const redirectTo = `/providers/${slug}/review?booking=${bookingId}`;
      router.replace(`/login?redirect=${encodeURIComponent(redirectTo)}`);
    }
  }, [isAuthenticated, slug, bookingId, router]);

  // ── Data fetching ──────────────────────────────────────────────────────────

  const { data: provider, isLoading: loadingProvider } = useQuery({
    queryKey: queryKeys.providers.detail(slug),
    queryFn: () => providerService.getProviderById(slug),
    enabled: !!slug,
    staleTime: 60_000,
  });

  const { data: existingReview, isLoading: checkingReview } = useQuery({
    queryKey: queryKeys.reviews.booking(bookingId!),
    queryFn: () => reviewService.getReviewByBooking(bookingId!),
    enabled: !!bookingId && isAuthenticated,
    staleTime: 0,
    retry: false,
  });

  // ── Submit mutation ────────────────────────────────────────────────────────

  const {
    mutate: submitReview,
    isPending,
    error: submitError,
  } = useMutation({
    mutationFn: () =>
      reviewService.submitReview({
        bookingId: bookingId!,
        rating,
        comment: comment.trim() || undefined,
      }),
    onSuccess: () => setIsSubmitted(true),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    submitReview();
  };

  // ── Loading state ──────────────────────────────────────────────────────────

  const isLoading = loadingProvider || checkingReview;

  if (!bookingId) {
    return <ErrorScreen message="This review link is invalid or expired." />;
  }

  if (!isAuthenticated) {
    return <LoadingScreen message="Redirecting to login…" />;
  }

  if (isLoading) {
    return <LoadingScreen message="Loading your review…" />;
  }

  if (!provider) {
    return (
      <ErrorScreen message="Provider not found. This link may be outdated." />
    );
  }

  const providerName =
    provider.businessName ||
    `${provider.userId.firstName} ${provider.userId.lastName}`;
  const avatar =
    provider.portfolioImages?.[0]?.url || provider.userId.avatar || null;

  // Already reviewed
  if (existingReview && !isSubmitted) {
    return (
      <PageShell>
        <ProviderCard
          name={providerName}
          avatar={avatar}
          rating={provider.rating}
        />
        <div className="mt-8 text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100">
            <CheckCircle size={32} className="text-emerald-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            You&apos;ve already reviewed this visit
          </h2>
          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={20}
                className={
                  s <= existingReview.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-slate-200"
                }
              />
            ))}
          </div>
          {existingReview.comment && (
            <p className="text-slate-500 italic max-w-sm mx-auto text-sm">
              &ldquo;{existingReview.comment}&rdquo;
            </p>
          )}
          <Link
            href={`/providers/${slug}`}
            className="inline-flex items-center gap-2 mt-4 text-rose-600 font-bold hover:underline"
          >
            <ChevronLeft size={16} />
            Back to {providerName}
          </Link>
        </div>
      </PageShell>
    );
  }

  // Success state — after submission
  if (isSubmitted) {
    return (
      <PageShell>
        <SuccessScreen
          providerName={providerName}
          slug={slug}
          rating={rating}
          comment={comment}
        />
      </PageShell>
    );
  }

  // ── Review Form ────────────────────────────────────────────────────────────
  const errorMessage = submitError
    ? ((submitError as { response?: { data?: { message?: string } } })?.response
        ?.data?.message ?? "Something went wrong. Please try again.")
    : null;

  return (
    <PageShell>
      {/* Provider identity card */}
      <ProviderCard
        name={providerName}
        avatar={avatar}
        rating={provider.rating}
      />

      {/* Intro text */}
      <div className="mt-8 text-center">
        <h1 className="text-2xl font-black text-slate-900">
          How was your experience?
        </h1>
        <p className="mt-2 text-slate-500 text-sm">
          Your feedback helps{" "}
          <span className="font-semibold text-slate-700">{providerName}</span>{" "}
          and future clients.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {/* Star Selector */}
        <div className="flex flex-col items-center">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
            Your Rating
          </label>
          <StarSelector
            value={rating}
            onChange={setRating}
            disabled={isPending}
          />
          {rating === 0 && (
            <p className="mt-3 text-xs text-slate-400">
              Tap a star to rate your visit
            </p>
          )}
        </div>

        {/* Comment */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-400 flex justify-between">
            <span>
              <MessageSquare size={12} className="inline mr-1" />
              Your Review{" "}
              <span className="font-normal text-slate-300">(optional)</span>
            </span>
            <span
              className={
                comment.length > MAX_CHARS * 0.85
                  ? "text-rose-400"
                  : "text-slate-300"
              }
            >
              {comment.length}/{MAX_CHARS}
            </span>
          </label>
          <textarea
            rows={5}
            maxLength={MAX_CHARS}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={isPending}
            placeholder="Tell others what you loved about your experience…"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-300 focus:border-rose-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all resize-none disabled:opacity-60"
          />
        </div>

        {/* Error */}
        {errorMessage && (
          <div className="flex items-start gap-2 rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            {errorMessage}
          </div>
        )}

        {/* Logged-in user identity */}
        {user && (
          <div className="flex items-center gap-2 text-xs text-slate-400 justify-center">
            <Lock size={12} />
            Submitting as{" "}
            <span className="font-semibold text-slate-600">
              {user.firstName} {user.lastName?.charAt(0)}.
            </span>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={rating === 0 || isPending}
          className="w-full relative overflow-hidden rounded-full bg-rose-600 py-4 font-black text-white text-base transition-all hover:bg-rose-700 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40"
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 size={18} className="animate-spin" />
              Submitting…
            </span>
          ) : (
            "Submit Review"
          )}
        </button>
      </form>
    </PageShell>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-lg px-6 py-12 pb-24">{children}</div>
    </div>
  );
}

function ProviderCard({
  name,
  avatar,
  rating,
}: {
  name: string;
  avatar: string | null;
  rating: number;
}) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-slate-100">
        {avatar ? (
          <Image src={avatar} alt={name} fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl font-black text-slate-400">
            {name.charAt(0)}
          </div>
        )}
      </div>
      <div>
        <p className="font-black text-xl text-slate-900">{name}</p>
        <div className="flex items-center gap-1 justify-center mt-1">
          <Star size={13} className="fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-semibold text-slate-600">
            {rating.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
}

function SuccessScreen({
  providerName,
  slug,
  rating,
  comment,
}: {
  providerName: string;
  slug: string;
  rating: number;
  comment: string;
}) {
  return (
    <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Animated check */}
      <div className="relative mx-auto w-24 h-24">
        <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-30" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500">
          <CheckCircle size={40} className="text-white" />
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900">Thank you! 🎉</h1>
        <p className="text-slate-500 text-sm leading-relaxed">
          Your review for{" "}
          <span className="font-bold text-slate-700">{providerName}</span> has
          been submitted. It helps other clients discover great talent.
        </p>
      </div>

      {/* Review preview card */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 text-left shadow-sm">
        <div className="flex gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              size={16}
              className={
                s <= rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-slate-200 fill-slate-100"
              }
            />
          ))}
        </div>
        {comment && (
          <p className="text-slate-600 text-sm italic leading-relaxed">
            &ldquo;{comment}&rdquo;
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 pt-2">
        <Link
          href={`/providers/${slug}`}
          className="w-full rounded-full bg-slate-900 py-4 font-black text-white text-center hover:bg-slate-800 transition-all active:scale-95 inline-block"
        >
          View {providerName}&apos;s Profile
        </Link>
        <Link
          href="/explore"
          className="w-full rounded-full border border-slate-200 py-3 font-bold text-slate-600 text-center hover:bg-slate-50 transition-all text-sm inline-block"
        >
          Explore other professionals
        </Link>
      </div>
    </div>
  );
}

function LoadingScreen({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white flex flex-col items-center justify-center gap-4 text-center px-6">
      <Loader2 size={36} className="animate-spin text-rose-500" />
      <p className="text-slate-500 font-medium">{message}</p>
    </div>
  );
}

function ErrorScreen({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white flex flex-col items-center justify-center gap-4 text-center px-6">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-rose-100">
        <Frown size={36} className="text-rose-500" />
      </div>
      <h2 className="text-xl font-black text-slate-900">Oops!</h2>
      <p className="text-slate-500 max-w-xs text-sm">{message}</p>
      <Link
        href="/explore"
        className="mt-2 text-rose-600 font-bold hover:underline text-sm"
      >
        Browse professionals →
      </Link>
    </div>
  );
}
