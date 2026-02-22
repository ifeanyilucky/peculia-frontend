import { Provider } from "@/types/provider.types";
import { CheckCircle2, MapPin, Star } from "lucide-react";
import Image from "next/image";

interface ProfileHeaderProps {
  provider: Provider;
}

export default function ProfileHeader({ provider }: ProfileHeaderProps) {
  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="h-64 w-full bg-slate-900 overflow-hidden md:h-80">
        <Image
          src={
            provider.portfolioImages?.[1]?.url ||
            provider.portfolioImages?.[0]?.url ||
            "/images/placeholder-cover.jpg"
          }
          alt="Cover"
          width={1920}
          height={600}
          className="h-full w-full object-cover opacity-60 blur-sm scale-105"
        />
      </div>

      {/* Profile Info */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative -mt-24 flex flex-col gap-6 md:-mt-32 md:flex-row md:items-end md:gap-8">
          {/* Avatar */}
          <div className="relative h-40 w-40 overflow-hidden rounded-3xl border-4 border-white bg-white shadow-xl md:h-52 md:w-52 md:rounded-[40px]">
            <Image
              src={provider.userId.avatar || "/images/placeholder-avatar.jpg"}
              alt={provider.businessName}
              fill
              className="object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex-1 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-outfit text-3xl font-bold text-slate-900 md:text-5xl">
                {provider.businessName}
              </h1>
              {provider.isVerified && (
                <div className="flex items-center gap-1 rounded-full bg-rose-600 px-3 py-1 text-[10px] font-bold text-white uppercase tracking-widest">
                  <CheckCircle2 size={12} />
                  Verified
                </div>
              )}
            </div>

            <p className="mt-2 text-lg font-medium text-slate-500 md:text-xl">
              {provider.userId.firstName} {provider.userId.lastName}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-1 text-yellow-500">
                <Star size={20} fill="currentColor" />
                <span className="text-lg font-bold text-slate-900">
                  {provider.rating.toFixed(1)}
                </span>
                <span className="text-slate-400">
                  ({provider.totalReviews} reviews)
                </span>
              </div>
              <div className="flex items-center gap-1 text-slate-500">
                <MapPin size={18} />
                <span className="text-sm font-medium">
                  {provider.location?.city}, {provider.location?.state}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {provider.specialties.slice(0, 3).map((spec) => (
                  <span
                    key={spec}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
                  >
                    {spec.replace("_", " ")}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop CTA */}
          <div className="hidden pb-4 md:block">
            <button className="rounded-full bg-rose-600 px-10 py-4 text-base font-bold text-white shadow-lg shadow-rose-200 transition-all hover:bg-rose-700 hover:scale-105 active:scale-95">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
