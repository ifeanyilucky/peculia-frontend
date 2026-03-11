"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { Provider } from "@/types/provider.types";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/formatters";

interface ProviderCardProps {
  provider: Provider;
  className?: string;
  showServices?: boolean;
}

export default function ProviderCard({
  provider,
  className,
  showServices = true,
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
        <div className="relative aspect-3/2 w-full overflow-hidden rounded-2xl bg-secondary">
          <Image
            src={
              provider.portfolioImages?.[0]?.url ||
              "https://placehold.co/600x400?text=Glamyad+Provider"
            }
            alt={provider.businessName}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="px-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-peculiar text-xl font-bold text-primary truncate">
              {provider.businessName}
            </h3>
            <div className="flex items-center gap-1.5 shrink-0">
              <Star className="fill-yellow-400 text-yellow-400" size={16} />
              <span className="text-sm font-bold text-primary">
                {provider.rating.toFixed(1)}
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                ({provider.totalReviews})
              </span>
            </div>
          </div>

          <div className="mt-1 space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              {provider.location?.city ? `${provider.location.city}` : ""}
            </p>
            <p className="text-sm font-medium text-muted-foreground capitalize">
              {specialty}
            </p>
          </div>

          {/* Services Section */}
          {showServices && (
            <div className="mt-4 space-y-2">
              {(provider.services?.slice(0, 3) || []).map((service: any) => (
                <div
                  key={service.id || service._id}
                  className="flex items-center justify-between p-3 px-5 rounded-full bg-secondary/50 border border-secondary group-hover:border-secondary transition-colors"
                >
                  <div>
                    <p className="text-sm font-bold text-primary leading-none">
                      {service.name}
                    </p>
                    <p className="text-[10px] font-bold text-muted-foreground mt-1">
                      {service.duration} mins
                    </p>
                  </div>
                  <p className="text-sm font-black text-primary">
                    {formatCurrency(service.price)}
                  </p>
                </div>
              ))}

              {provider.services && provider.services.length > 3 && (
                <p className="text-xs font-black text-primary mt-2 hover:underline cursor-pointer">
                  See allservices
                </p>
              )}
              {(!provider.services || provider.services.length === 0) && (
                <div className="py-2">
                  <p className="text-xs font-bold text-muted-foreground italic">
                    Loading services...
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
