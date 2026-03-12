"use client";

import { Provider } from "@/types/provider.types";
import { CheckCircle2, Star, Share2, ExternalLink } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import PhotoViewer from "@/components/common/PhotoViewer";
import FullGalleryModal from "./FullGalleryModal";
import SaveButton from "./SaveButton";
import Breadcrumbs, { BreadcrumbItem } from "@/components/ui/Breadcrumbs";
import {
  getOpeningStatus,
  WeeklySchedule,
  OpeningStatus,
} from "@/utils/time.utils";
import { useEffect } from "react";
import { sileo } from "sileo";

import { useSpecialties } from "@/hooks/useSpecialties";

interface ProfileHeaderProps {
  provider: Provider;
  schedule?: WeeklySchedule;
  initialOpeningStatus?: OpeningStatus;
}

export default function ProfileHeader({
  provider,
  schedule,
  initialOpeningStatus,
}: ProfileHeaderProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const { data: specialties = [], isLoading } = useSpecialties();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const isGalleryOpen = searchParams?.get("modal") === "gallery";

  const handleOpenGallery = () => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("modal", "gallery");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleCloseGallery = () => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.delete("modal");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const openingStatus =
    mounted && schedule
      ? getOpeningStatus(schedule)
      : initialOpeningStatus || { isOpen: false, message: "Loading..." };

  const address =
    provider.location?.address ||
    `${provider.location?.city}, ${provider.location?.state}`;
  const mapQuery = encodeURIComponent(address);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
  const images = [
    ...(provider.portfolioImages || []),
    ...(provider.venueImages || []),
  ];

  // Look up the label for the primary specialty
  const specialtyId = provider.specialties?.[0];
  const specialtyLabel = isLoading
    ? "Loading..."
    : specialties.find((s) => s.id === specialtyId)?.label ||
      specialtyId?.replace("_", " ") ||
      "Health & Beauty";

  const city = provider.location?.city || "London";
  const area = provider.location?.state; // Using state as the "Area" (e.g., Fulham)

  const handlePrev = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! === 0 ? images.length - 1 : prev! - 1));
  };

  const handleNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! === images.length - 1 ? 0 : prev! + 1));
  };

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    {
      label: specialtyLabel as string,
      href: `/explore?specialty=${specialtyId}`,
    },
    { label: city, href: `/explore?city=${city}` },
    ...(area
      ? [{ label: area, href: `/explore?city=${city}&state=${area}` }]
      : []),
    { label: provider.businessName },
  ];

  const handleShare = async () => {
    const shareData = {
      title: `${provider.businessName} on Glamyad`,
      text:
        provider.bio?.substring(0, 100) ||
        `Book ${provider.businessName} on Glamyad!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareData.url);
        // You could add a toast here if sileo/sonner was imported
        sileo.success({
          title: "Copied!",
          description: "Link copied to clipboard!",
        });
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  return (
    <div className="bg-white">
      {/* Breadcrumbs */}
      <div className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Business Info + Photo Gallery Section */}
      <section className="mx-auto max-w-7xl px-6 py-4 md:py-8 lg:px-8">
        {/* On mobile: flex column with photos first (order-1), info second (order-2).
            On md+: info is naturally above the photo grid as a block layout. */}
        <div className="flex flex-col">

          {/* ── Business Info Row ── order-2 on mobile (shown below photo on mobile) */}
          <div className="order-2 md:order-1 flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:mb-8 mt-5 md:mt-0">
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center gap-3">
                <h1 className="font-peculiar text-3xl font-black text-primary md:text-5xl">
                  {provider.businessName}
                </h1>
                {provider.isVerified && (
                  <CheckCircle2 size={22} className="fill-blue-500 text-white shrink-0" />
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-bold">
                {/* Rating */}
                <div className="flex items-center gap-1">
                  <span className="text-primary">
                    {provider.rating.toFixed(1)}
                  </span>
                  <div className="flex items-center text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={
                          i < Math.floor(provider.rating)
                            ? "currentColor"
                            : "none"
                        }
                        className={
                          i < Math.floor(provider.rating) ? "" : "text-secondary"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-indigo-600 font-medium">
                    ({provider.totalReviews.toLocaleString()})
                  </span>
                </div>

                {/* Open/Closed status */}
                <div className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-secondary" />
                  <span
                    className={
                      openingStatus.isOpen ? "text-green-600" : "text-primary"
                    }
                  >
                    {openingStatus.isOpen ? "Open" : "Closed"}
                  </span>
                  <span className="text-muted-foreground font-medium">
                    {openingStatus.message.replace(/^(Open|Closed) - /, "— ")}
                  </span>
                </div>

                {/* Address – hidden on mobile to keep it clean; visible md+ */}
                <div className="hidden sm:flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-secondary" />
                  <span className="text-muted-foreground font-medium truncate max-w-[200px] sm:max-w-none">
                    {address}
                  </span>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    Get directions
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              {/* Address row visible only on mobile, below the meta row */}
              <div className="flex sm:hidden items-center gap-2 text-sm">
                <span className="text-muted-foreground font-medium truncate">
                  {address}
                </span>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 font-bold hover:underline flex items-center gap-1 shrink-0"
                >
                  Directions
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

            {/* Share + Save – always visible but floated right */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={handleShare}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-secondary transition-all hover:bg-slate-50 active:scale-90"
              >
                <Share2 size={20} className="text-foreground" />
              </button>
              <SaveButton providerId={provider._id} size="lg" />
            </div>
          </div>

          {/* ── Photo Gallery ── order-1 on mobile (shown first, below breadcrumbs) */}
          <div className="order-1 md:order-2">
            {/* Mobile: share + save overlay on the photo */}
            <div className="relative">
              <div className="grid h-[260px] grid-cols-1 gap-3 sm:h-[360px] md:h-[500px] md:grid-cols-3">
                {/* Main Large Image */}
                <div
                  className="relative cursor-pointer overflow-hidden rounded-2xl md:col-span-2"
                  onClick={() => setSelectedIndex(0)}
                >
                  <Image
                    src={
                      images[0]?.url ||
                      "https://placehold.co/1200x800?text=Glamyad+Provider"
                    }
                    alt={provider.businessName}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    priority
                  />

                  {/* Mobile-only: see all photos pill at bottom-left of main image */}
                  {images.length > 1 && (
                    <button
                      className="absolute bottom-4 left-4 md:hidden flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-black text-primary backdrop-blur-sm border border-secondary active:scale-95"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenGallery();
                      }}
                    >
                      <span>📷</span>
                      {images.length} photos
                    </button>
                  )}
                </div>

                {/* Secondary Stacked Images — desktop only */}
                <div className="hidden grid-rows-2 gap-3 md:grid">
                  <div
                    className="relative cursor-pointer overflow-hidden rounded-2xl"
                    onClick={() => setSelectedIndex(1)}
                  >
                    <Image
                      src={
                        images[1]?.url ||
                        images[0]?.url ||
                        "https://placehold.co/1200x800?text=Glamyad+Provider"
                      }
                      alt={provider.businessName}
                      fill
                      className="object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                  <div
                    className="relative cursor-pointer overflow-hidden rounded-2xl"
                    onClick={() => setSelectedIndex(2)}
                  >
                    <Image
                      src={
                        images[2]?.url ||
                        images[0]?.url ||
                        "https://placehold.co/1200x800?text=Glamyad+Provider"
                      }
                      alt={provider.businessName}
                      fill
                      className="object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <button
                      className="absolute bottom-6 right-6 rounded-lg bg-white/90 px-4 py-2 text-xs font-black text-primary backdrop-blur-sm transition-all hover:bg-white hover:scale-105 active:scale-95 border border-secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenGallery();
                      }}
                    >
                      See all images
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile-only: share + save pills floating top-right on the photo */}
              <div className="absolute top-3 right-3 md:hidden flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm border border-secondary shadow-sm transition-all hover:bg-white active:scale-90"
                >
                  <Share2 size={16} className="text-foreground" />
                </button>
                <SaveButton providerId={provider._id} size="sm" />
              </div>
            </div>
          </div>

        </div>
      </section>

      <FullGalleryModal
        isOpen={isGalleryOpen}
        onClose={handleCloseGallery}
        images={images}
        businessName={provider.businessName}
        onImageClick={(idx) => setSelectedIndex(idx)}
      />

      <PhotoViewer
        images={images}
        currentIndex={selectedIndex}
        onClose={() => setSelectedIndex(null)}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </div>
  );
}
