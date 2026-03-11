import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { providerService } from "@/services/provider.service";
import ProfileHeader from "@/components/features/providers/ProfileHeader";
import ProviderAbout from "@/components/features/providers/ProviderAbout";
import ProviderServices from "@/components/features/providers/ProviderServices";
import ProviderReviewsList from "@/components/features/providers/ProviderReviewsList";
import { availabilityService } from "@/services/availability.service";
import ProviderLocation from "@/components/features/providers/ProviderLocation";
import ProviderTeam from "@/components/features/providers/ProviderTeam";
import NearbyProviders from "@/components/features/providers/NearbyProviders";
import ProfileTabs from "@/components/features/providers/ProfileTabs";
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
        `Book ${name} for beauty and wellness services on Glamyad.`,
      openGraph: {
        title: `${businessName || name} on Glamyad`,
        description: provider.bio?.substring(0, 160),
        url: `https://glamyad.com/providers/${slug}`,
        images: provider.portfolioImages?.[0]?.url
          ? [provider.portfolioImages[0].url, ...previousImages]
          : provider.userId.avatar
            ? [provider.userId.avatar, ...previousImages]
            : previousImages,
      },
    };
  } catch {
    return { title: "Glamyad Provider" };
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
        pagination: { totalResults: 0, page: 1, limit: 5, totalPages: 0 },
      }));

    const team = await providerService
      .getProviderTeam(provider._id)
      .catch(() => []);

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
      image: provider.portfolioImages?.[0]?.url || provider.userId.avatar,
      rating: provider.rating,
      slug: provider.slug,
      location: provider.location,
    };

    const sections = [
      { id: "services", label: "Services" },
      { id: "team", label: "Team" },
      { id: "about", label: "About" },
      { id: "reviews", label: "Reviews" },
      { id: "location", label: "Location" },
    ];

    return (
      <RecentlyViewedTracker provider={providerData}>
        <div className="bg-glam-ivory/30 pb-24">
          {/* Schema.org Structured Data */}
          <Script
            id="provider-jsonld"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />

          {/* ProfileHeader heavily relies on useSearchParams for modal handling */}
          <Suspense
            fallback={
              <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8 h-[500px] animate-pulse bg-slate-50 rounded-2xl my-4" />
            }
          >
            <ProfileHeader
              provider={provider}
              schedule={schedule}
              initialOpeningStatus={openingStatus}
            />
          </Suspense>

          {/* Sticky Tabs */}
          <ProfileTabs sections={sections} />

          {/* Content Tabs/Grid */}
          <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
            <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
              {/* Left Column: Main Info */}
              <div className="flex-1 space-y-16">
                <div id="services">
                  <ProviderServices
                    services={services}
                    providerId={provider._id}
                  />
                </div>
                <hr className="border-glam-blush" />
                <div id="team">
                  <ProviderTeam team={team} />
                </div>

                <hr className="border-glam-blush" />
                <div id="about">
                  <ProviderAbout provider={provider} />
                </div>

                <hr className="border-glam-blush" />

                <section id="reviews">
                  <h3 className="font-peculiar text-3xl font-black text-glam-plum mb-8">
                    Client Reviews
                  </h3>
                  <Suspense
                    fallback={
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="animate-spin text-glam-plum" />
                      </div>
                    }
                  >
                    <ProviderReviewsList providerProfileId={provider._id} />
                  </Suspense>
                </section>

                <hr className="border-glam-blush" />

                <div id="location">
                  <ProviderLocation provider={provider} schedule={schedule} />
                </div>
              </div>

              {/* Right Column: Sticky Sidebar (Desktop) */}
              <aside className="w-full space-y-8 lg:w-96 lg:shrink-0 lg:sticky lg:top-40">
                <div className="rounded-3xl border border-glam-blush bg-white p-8 shadow-sm">
                  <h2 className="font-peculiar text-3xl font-black text-glam-plum">
                    {provider.businessName}
                  </h2>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-xl font-bold text-glam-plum">
                      {provider.rating.toFixed(1)}
                    </span>
                    <div className="flex items-center text-glam-gold">
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
                              : "text-glam-blush"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-muted-foreground font-medium">
                      ({provider.totalReviews.toLocaleString()})
                    </span>
                  </div>

                  <Link
                    href={`/book/${slug}/services`}
                    className="mt-8 flex justify-center w-full rounded-full bg-glam-plum py-4 text-lg font-black text-white transition-all hover:bg-glam-plum/90 shadow-lg shadow-glam-plum/20 active:scale-95"
                  >
                    Book now
                  </Link>

                  <div className="mt-10 space-y-6">
                    <div className="flex items-start gap-3 text-glam-charcoal/70">
                      <Clock size={20} className="mt-1 shrink-0" />
                      <div>
                        <p className="font-bold">
                          <span
                            className={
                              openingStatus.isOpen
                                ? "text-green-600"
                                : "text-glam-plum"
                            }
                          >
                            {openingStatus.isOpen ? "Open" : "Closed"}
                          </span>
                          <span className="ml-2 font-medium">
                            {openingStatus.message.replace(
                              /^(Open|Closed) - /,
                              "— ",
                            )}
                          </span>
                          <ChevronDown
                            size={16}
                            className="ml-2 inline opacity-50"
                          />
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 text-glam-charcoal/70">
                      <MapPin size={20} className="mt-1 shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium leading-relaxed">
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
                          className="mt-2 inline-block text-glam-plum font-black hover:underline"
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
          <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-glam-blush bg-white/80 p-4 backdrop-blur-lg md:hidden safe-area-inset-bottom">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-glam-charcoal/40">
                  Starting price
                </p>
                <p className="text-xl font-black text-glam-plum">
                  ₦{(startingPrice / 100).toLocaleString()}
                </p>
              </div>
              <Link
                href={`/book/${slug}/services`}
                className="flex-[1.5] rounded-full bg-glam-plum py-4 font-black text-white shadow-lg shadow-glam-plum/20 transition-all active:scale-95 text-center"
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
