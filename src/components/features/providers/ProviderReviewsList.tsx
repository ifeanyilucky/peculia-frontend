"use client";

import { useQuery } from "@tanstack/react-query";
import { providerService } from "@/services/provider.service";
import { queryKeys } from "@/constants/queryKeys";
import {
  Star,
  MessageSquare,
  Loader2,
  Quote,
  CornerDownRight,
} from "lucide-react";
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
      <div className="p-12 text-center bg-slate-50 rounded-3xl border border-slate-200">
        <MessageSquare size={32} className="mx-auto text-slate-300" />
        <p className="mt-4 text-slate-500">
          No reviews yet. Be the first to leave one!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8">
      {reviews.map((review) => (
        <div
          key={review._id}
          className="group relative bg-white p-6 rounded-3xl border border-slate-100/50 hover:border-rose-100 hover:shadow-xl hover:shadow-rose-500/3 transition-all duration-300"
        >
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex gap-4">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-slate-100 ring-4 ring-slate-50">
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
              <div className="flex flex-col justify-center">
                <p className="font-peculiar text-lg font-bold text-slate-900">
                  {review.clientId.firstName}{" "}
                  {review.clientId.lastName?.charAt(0)}.
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < review.rating ? "currentColor" : "none"}
                        className={
                          i < review.rating
                            ? "text-yellow-400"
                            : "text-slate-200"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-slate-400">
                    {format(new Date(review.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
              </div>
            </div>

            <Quote
              size={24}
              className="text-slate-100 absolute top-6 right-6 group-hover:text-rose-100 transition-colors"
            />
          </div>

          <div className="mt-6 relative">
            <p className="leading-relaxed text-slate-600 text-base">
              {review.comment}
            </p>
          </div>

          {review.providerReply && (
            <div className="mt-8 rounded-2xl bg-slate-50/50 p-6 border border-slate-100/50 group-hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <CornerDownRight size={16} className="text-glam-plum" />
                <span className="text-[10px] font-black text-glam-plum uppercase tracking-widest">
                  Provider Response
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                {review.providerReply}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
