"use client";

import { useQuery } from "@tanstack/react-query";
import { providerService } from "@/services/provider.service";
import { queryKeys } from "@/constants/queryKeys";
import { Star, MessageSquare, Loader2 } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";

interface ProviderReviewsListProps {
  providerProfileId: string;
}

export default function ProviderReviewsList({
  providerProfileId,
}: ProviderReviewsListProps) {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.reviews.list(providerProfileId),
    queryFn: () =>
      providerService.getProviderReviews(providerProfileId, { limit: 10 }),
  });

  if (isLoading)
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="animate-spin text-rose-600" />
      </div>
    );

  const reviews = data?.results || [];

  if (reviews.length === 0) {
    return (
      <div className="p-12 text-center bg-slate-50 rounded-3xl border border-slate-200">
        <MessageSquare size={32} className="mx-auto text-slate-300" />
        <p className="mt-4 text-slate-500">
          No reviews yet. Be the first to leave one!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="border-b border-slate-100 pb-8 last:border-0 last:pb-0"
        >
          <div className="flex justify-between gap-4">
            <div className="flex gap-4">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-slate-100">
                <Image
                  src={
                    review.clientId.avatar ||
                    "https://placehold.co/100x100?text=User"
                  }
                  alt={review.clientId.firstName}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-bold text-slate-900">
                  {review.clientId.firstName}{" "}
                  {review.clientId.lastName?.charAt(0)}.
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={
                          i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-slate-200"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400">
                    {format(new Date(review.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-4 leading-relaxed text-slate-600 italic">
            &ldquo;{review.comment}&rdquo;
          </p>

          {review.reply && (
            <div className="mt-6 rounded-2xl bg-slate-50 p-5 ml-6 border-l-2 border-rose-500">
              <p className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-2">
                Provider Response
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                {review.reply}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
