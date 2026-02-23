"use client";

import { Provider } from "@/types/provider.types";
import {
  CheckCircle2,
  MapPin,
  Star,
  Share2,
  Heart,
  ChevronRight,
  Clock,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import PhotoViewer from "@/components/common/PhotoViewer";

import { SPECIALTIES } from "@/constants/specialties";

interface ProfileHeaderProps {
  provider: Provider;
}

export default function ProfileHeader({ provider }: ProfileHeaderProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const images = provider.portfolioImages || [];

  // Look up the label for the primary specialty
  const specialtyId = provider.specialties?.[0];
  const specialtyLabel =
    SPECIALTIES.find((s) => s.id === specialtyId)?.label ||
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

  return (
    <div className="bg-white">
      {/* Breadcrumbs */}
      <nav className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
        <ol className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <li>
            <Link href="/" className="hover:text-rose-600">
              Home
            </Link>
          </li>
          <span className="text-slate-300 mx-1">.</span>
          <li>
            <Link
              href={`/explore?specialty=${specialtyId}`}
              className="hover:text-rose-600 capitalize"
            >
              {specialtyLabel}
            </Link>
          </li>
          <span className="text-slate-300 mx-1">.</span>
          <li>
            <Link
              href={`/explore?city=${city}`}
              className="hover:text-rose-600"
            >
              {city}
            </Link>
          </li>
          {area && (
            <>
              <span className="text-slate-300 mx-1">.</span>
              <li>
                <Link
                  href={`/explore?city=${city}&state=${area}`}
                  className="hover:text-rose-600"
                >
                  {area}
                </Link>
              </li>
            </>
          )}
          <span className="text-slate-300 mx-1">.</span>
          <li className="text-slate-900 font-bold truncate max-w-[150px] sm:max-w-none">
            {provider.businessName}
          </li>
        </ol>
      </nav>

      {/* Business Info Section */}
      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h1 className="font-peculiar text-4xl font-black text-slate-900 md:text-5xl">
                {provider.businessName}
              </h1>
              {provider.isVerified && (
                <CheckCircle2 size={24} className="fill-blue-500 text-white" />
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-bold">
              <div className="flex items-center gap-1">
                <span className="text-slate-900">
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
                        i < Math.floor(provider.rating) ? "" : "text-slate-200"
                      }
                    />
                  ))}
                </div>
                <span className="text-indigo-600 font-medium">
                  ({provider.totalReviews.toLocaleString()})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span className="text-rose-600">Closed</span>
                <span className="text-slate-500 font-medium">
                  — opens on Tuesday at 10:00
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span className="text-slate-500 font-medium">
                  {provider.location?.address ||
                    `${city}, ${provider.location?.state}`}
                </span>
                <button className="text-indigo-600 hover:underline">
                  Get directions
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 transition-all hover:bg-slate-50 active:scale-90">
              <Share2 size={20} className="text-slate-600" />
            </button>
            <button className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 transition-all hover:bg-slate-50 active:scale-90">
              <Heart size={20} className="text-slate-600" />
            </button>
          </div>
        </div>

        {/* Image Gallery Grid */}
        <div className="mt-10 grid h-[400px] grid-cols-1 gap-3 md:h-[500px] md:grid-cols-3">
          {/* Main Large Image */}
          <div
            className="relative cursor-pointer overflow-hidden rounded-2xl md:col-span-2"
            onClick={() => setSelectedIndex(0)}
          >
            <Image
              src={images[0]?.url || "/images/placeholder-cover.jpg"}
              alt={provider.businessName}
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              priority
            />
          </div>

          {/* Secondary Stacked Images */}
          <div className="hidden grid-rows-2 gap-3 md:grid">
            <div
              className="relative cursor-pointer overflow-hidden rounded-2xl"
              onClick={() => setSelectedIndex(1)}
            >
              <Image
                src={
                  images[1]?.url ||
                  images[0]?.url ||
                  "/images/placeholder-cover.jpg"
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
                  "/images/placeholder-cover.jpg"
                }
                alt={provider.businessName}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
              <button
                className="absolute bottom-6 right-6 rounded-lg bg-white/90 px-4 py-2 text-xs font-black text-slate-900 shadow-xl backdrop-blur-sm transition-all hover:bg-white hover:scale-105 active:scale-95"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex(2);
                }}
              >
                See all images
              </button>
            </div>
          </div>
        </div>
      </section>

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
