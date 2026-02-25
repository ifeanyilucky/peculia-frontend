import { notFound } from "next/navigation";
import Link from "next/link";
import { providerService } from "@/services/provider.service";
import ProfileHeader from "@/components/features/providers/ProfileHeader";
import ProviderAbout from "@/components/features/providers/ProviderAbout";
import ProviderServices from "@/components/features/providers/ProviderServices";
import ProviderPortfolio from "@/components/features/providers/ProviderPortfolio";
import ProviderReviewsList from "@/components/features/providers/ProviderReviewsList";
import { Suspense } from "react";
import { availabilityService } from "@/services/availability.service";
import ProviderLocation from "@/components/features/providers/ProviderLocation";
import NearbyProviders from "@/components/features/providers/NearbyProviders";
import { getOpeningStatus } from "@/utils/time.utils";
import RecentlyViewedTracker from "@/components/features/providers/RecentlyViewedTracker";
import Script from "next/script";
import { Loader2, Star, Clock, MapPin, ChevronDown } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";

interface ProviderProfilePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(
  { params }: ProviderProfilePageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params;
  try {
    const provider = await providerService.getProviderById(slug);
    if (!provider) return { title: "Provider Not Found" };

    const name = `${provider.userId.firstName} ${provider.userId.lastName}`;
    const businessName = provider.businessName;
    const previousImages = (await parent).openGraph?.images || [];

    return {
      title: `${businessName || name} | Beauty Professional`,
      description:
        provider.bio?.substring(0, 160) ||
        `Book ${name} for beauty and wellness services on Peculia.`,
      openGraph: {
        title: `${businessName || name} on Peculia`,
        description: provider.bio?.substring(0, 160),
        url: `https://peculia.com/providers/${slug}`,
        images: provider.userId.avatar
          ? [provider.userId.avatar, ...previousImages]
          : previousImages,
      },
    };
  } catch {
    return { title: "Peculia Provider" };
  }
}

export default async function ProviderProfilePage({
  params,
}: ProviderProfilePageProps) {
  const { slug } = await params;

  try {
    const provider = await providerService.getProviderById(slug);
    if (!provider) return notFound();

    const services = await providerService.getProviderServices(provider._id);
    const schedule = await availabilityService
      .getWeeklySchedule(provider._id)
      .catch(() => null);

    // Fetch nearby providers
    const nearbyProvidersData = await providerService
      .discoverProviders({
        lat: provider.location?.coordinates?.coordinates[1],
        lng: provider.location?.coordinates?.coordinates[0],
        city: !provider.location?.coordinates
          ? provider.location?.city
          : undefined,
        limit: 5,
        radiusKm: 20,
      })
      .catch(() => ({
        results: [],
        pagination: { total: 0, page: 1, limit: 5, totalPages: 0 },
      }));

    const nearbyProviders = nearbyProvidersData.results || [];

    const name = `${provider.userId.firstName} ${provider.userId.lastName}`;
    const businessName = provider.businessName;

    // Calculate starting price (in kobo, displayed in Naira)
    const startingPrice =
      services?.length > 0 ? Math.min(...services.map((s) => s.price)) : 500000; // Default to ₦5,000 if no services (500,000 kobo)

    // Structured Data (JSON-LD)
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: businessName || name,
      image: provider.userId.avatar,
      description: provider.bio,
      address: {
        "@type": "PostalAddress",
        streetAddress: provider.location?.address,
        addressLocality: provider.location?.city,
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: provider.rating,
        reviewCount: provider.totalReviews,
      },
    };

    const openingStatus = getOpeningStatus(schedule);

    const providerData = {
      _id: provider._id,
      name: businessName || name,
      image: provider.userId.avatar,
      rating: provider.rating,
    };

    return (
      <RecentlyViewedTracker provider={providerData}>
        <div className="bg-white pb-24">
        {/* Schema.org Structured Data */}
        <Script
          id="provider-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Profile Header */}
        <ProfileHeader
          provider={provider}
          schedule={schedule}
          initialOpeningStatus={openingStatus}
        />

        {/* Content Tabs/Grid */}
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
            {/* Left Column: Main Info */}
            <div className="flex-1 space-y-16">
              <ProviderServices services={services} providerId={provider._id} />

              <hr className="border-slate-100" />
              <ProviderAbout provider={provider} />

              <hr className="border-slate-100" />

              <section>
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="font-peculiar text-2xl font-bold text-slate-900">
                    Portfolio
                  </h3>
                  <span className="text-sm font-bold text-rose-600">
                    {provider.portfolioImages?.length || 0} Images
                  </span>
                </div>
                <ProviderPortfolio provider={provider} />
              </section>

              <hr className="border-slate-100" />

              <section>
                <h3 className="font-peculiar text-2xl font-bold text-slate-900 mb-8">
                  Client Reviews
                </h3>
                <Suspense
                  fallback={
                    <Loader2 className="animate-spin text-rose-600 mx-auto" />
                  }
                >
                  <ProviderReviewsList providerProfileId={provider._id} />
                </Suspense>
              </section>

              <hr className="border-slate-100" />

              <ProviderLocation provider={provider} schedule={schedule} />
            </div>

            {/* Right Column: Sticky Sidebar (Desktop) */}
            <aside className="w-full space-y-8 lg:w-96 lg:shrink-0 lg:sticky lg:top-24">
              <div className="rounded-2xl border border-slate-200 bg-white p-8">
                <h2 className="font-peculiar text-3xl font-black text-slate-900">
                  {provider.businessName}
                </h2>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xl font-bold text-slate-900">
                    {provider.rating.toFixed(1)}
                  </span>
                  <div className="flex items-center text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        fill={
                          i < Math.floor(provider.rating)
                            ? "currentColor"
                            : "none"
                        }
                        className={
                          i < Math.floor(provider.rating)
                            ? ""
                            : "text-slate-200"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-slate-400 font-medium">
                    ({provider.totalReviews.toLocaleString()})
                  </span>
                </div>

                <div className="mt-4 inline-flex rounded-lg bg-green-50 px-3 py-1 text-xs font-bold text-green-600 border border-green-100">
                  Deals
                </div>

                <Link
                  href={`/book/${slug}/services`}
                  className="mt-8 flex justify-center w-full rounded-full bg-slate-900 py-4 text-lg font-black text-white transition-all hover:bg-slate-800 active:scale-95"
                >
                  Book now
                </Link>

                <div className="mt-10 space-y-6">
                  <div className="flex items-start gap-3">
                    <Clock size={20} className="mt-1 text-slate-400" />
                    <div>
                      <p className="font-bold text-slate-900">
                        <span
                          className={
                            openingStatus.isOpen
                              ? "text-green-600"
                              : "text-rose-600"
                          }
                        >
                          {openingStatus.isOpen ? "Open" : "Closed"}
                        </span>
                        <span className="ml-2 font-medium text-slate-500">
                          {openingStatus.message.replace(
                            /^(Open|Closed) - /,
                            "— ",
                          )}
                        </span>
                        <ChevronDown
                          size={16}
                          className="ml-2 inline text-slate-400"
                        />
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin size={20} className="mt-1 text-slate-400" />
                    <div className="flex-1">
                      <p className="font-medium text-slate-500 leading-relaxed">
                        {provider.location?.address ||
                          `${provider.location?.city}, ${provider.location?.state}`}
                      </p>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          provider.location?.address ||
                            `${provider.location?.city}, ${provider.location?.state}`,
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 text-indigo-600 font-bold hover:underline"
                      >
                        Get directions
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Original Availability Preview (Hidden for now to match reference more closely) */}
              {/* <ProviderAvailabilityPreview /> */}
            </aside>
          </div>
        </div>

        {/* Nearby Providers Section */}
        <NearbyProviders
          providers={nearbyProviders}
          currentProviderId={provider._id}
        />

        {/* Mobile Sticky CTA */}
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/80 p-4 backdrop-blur-lg md:hidden">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-slate-500">
                Starting price
              </p>
              <p className="text-xl font-black text-slate-900">
                ₦{(startingPrice / 100).toLocaleString()}
              </p>
            </div>
            <Link
              href={`/book/${slug}/services`}
              className="flex-1 rounded-full bg-rose-600 py-3 font-bold text-white transition-all active:scale-95 text-center"
            >
              Book Appointment
            </Link>
          </div>
        </div>
      </div>
      </RecentlyViewedTracker>
    );
  } catch (error) {
    console.error("Failed to load provider profile:", error);
    return notFound();
  }
}
