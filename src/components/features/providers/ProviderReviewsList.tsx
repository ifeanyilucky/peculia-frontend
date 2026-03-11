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
        <Loader2 className="animate-spin text-glam-plum" />
      </div>
    );

  const reviews = data?.results || [];

  if (reviews.length === 0) {
    return (
      <div className="p-12 text-center bg-glam-blush/20 rounded-3xl border border-glam-blush">
        <MessageSquare size={32} className="mx-auto text-glam-charcoal/20" />
        <p className="mt-4 text-glam-charcoal/60 font-medium">
          No reviews yet. Be the first to leave one!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="border-b border-glam-blush pb-10 last:border-0 last:pb-0"
        >
          <div className="flex justify-between gap-4">
            <div className="flex gap-4">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-glam-blush/40 ring-2 ring-white shadow-sm">
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
                <p className="font-black text-glam-plum">
                  {review.clientId.firstName}{" "}
                  {review.clientId.lastName?.charAt(0)}.
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={
                          i < review.rating
                            ? "fill-glam-gold text-glam-gold"
                            : "text-glam-blush"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-glam-charcoal/40">
                    {format(new Date(review.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-5 leading-relaxed text-glam-charcoal/80 italic font-medium">
            &ldquo;{review.comment}&rdquo;
          </p>

          {review.providerReply && (
            <div className="mt-6 rounded-2xl bg-white border border-glam-blush p-6 ml-6 shadow-sm relative">
              <div className="absolute top-0 left-6 -translate-y-1/2 bg-white px-2 text-[9px] font-black uppercase tracking-widest text-glam-gold">
                Response from {review.clientId.firstName}
              </div>
              <p className="text-sm text-glam-charcoal/70 leading-relaxed font-medium">
                {review.providerReply}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
