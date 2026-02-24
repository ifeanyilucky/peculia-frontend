"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, CheckCircle2 } from "lucide-react";
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
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn(
        "group h-full overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:border-slate-300",
        className,
      )}
    >
      <Link href={`/providers/${provider.slug || provider._id}`} className="block">
        {/* Cover Image */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-100 border-b border-slate-100">
          <Image
            src={
              provider.portfolioImages?.[0]?.url ||
              "/images/placeholder-provider.jpg"
            }
            alt={provider.businessName}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {provider.isVerified && (
            <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[10px] font-bold text-rose-600 backdrop-blur-sm border border-slate-100">
              <CheckCircle2 size={12} />
              VERIFIED
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
              {provider.specialties[0]?.replace("_", " ")}
            </span>
            <div className="flex items-center gap-1">
              <Star className="fill-yellow-400 text-yellow-400" size={14} />
              <span className="text-sm font-bold text-slate-900">
                {provider.rating.toFixed(1)}
              </span>
              <span className="text-xs text-slate-400">
                ({provider.totalReviews})
              </span>
            </div>
          </div>

          <h3 className="mt-2 font-peculiar text-xl font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
            {provider.businessName}
          </h3>

          <div className="mt-2 flex items-center gap-1 text-sm text-slate-500">
            <MapPin size={14} />
            <span>{provider.location?.city || "Unknown Location"}</span>
          </div>

          <div className="mt-4 flex flex-wrap gap-1">
            {provider.specialties.slice(0, 3).map((spec) => (
              <span
                key={spec}
                className="rounded-md bg-slate-50 px-2 py-1 text-[10px] font-medium text-slate-600 border border-slate-100"
              >
                {spec.replace("_", " ")}
              </span>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
            <div className="text-sm">
              <span className="text-slate-400">Starting from</span>
              <p className="font-bold text-slate-900">₦5,000</p>
            </div>
            <button className="rounded-full px-4 py-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-all border border-rose-100 uppercase tracking-tighter">
              View Profile
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
