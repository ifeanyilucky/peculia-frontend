"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { Provider } from "@/types/provider.types";
import { cn } from "@/lib/utils";

interface ProviderCardProps {
  provider: Provider;
  className?: string;
}

export default function ProviderCard({
  provider,
  className,
}: ProviderCardProps) {
  const specialty =
    provider.specialties[0]?.replace("_", " ") || "Health & Beauty";

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn("group h-full transition-all", className)}
    >
      <Link
        href={`/providers/${provider.slug || provider._id}`}
        className="block space-y-4"
      >
        {/* Cover Image */}
        <div className="relative aspect-3/2 w-full overflow-hidden rounded-4xl bg-slate-100">
          <Image
            src={
              provider.portfolioImages?.[0]?.url ||
              "https://placehold.co/600x400?text=Peculia+Provider"
            }
            alt={provider.businessName}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="px-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-peculiar text-xl font-bold text-slate-900 truncate">
              {provider.businessName}
            </h3>
            <div className="flex items-center gap-1.5 shrink-0">
              <Star className="fill-yellow-400 text-yellow-400" size={16} />
              <span className="text-sm font-bold text-slate-900">
                {provider.rating.toFixed(1)}
              </span>
              <span className="text-sm font-medium text-slate-400">
                ({provider.totalReviews})
              </span>
            </div>
          </div>

          <div className="mt-1 space-y-1">
            <p className="text-sm font-medium text-slate-400">
              {provider.location?.address?.split(",")[0] ||
                provider.location?.city ||
                "Unknown Location"}
              {provider.location?.city ? `, ${provider.location.city}` : ""}
            </p>
            <p className="text-sm font-medium text-slate-400 capitalize">
              {specialty}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
