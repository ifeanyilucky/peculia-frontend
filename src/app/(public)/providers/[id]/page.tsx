import { notFound } from "next/navigation";
import { providerService } from "@/services/provider.service";
import ProfileHeader from "@/components/features/providers/ProfileHeader";
import ProviderAbout from "@/components/features/providers/ProviderAbout";
import ProviderServices from "@/components/features/providers/ProviderServices";
import ProviderPortfolio from "@/components/features/providers/ProviderPortfolio";
import ProviderReviewsList from "@/components/features/providers/ProviderReviewsList";
import ProviderAvailabilityPreview from "@/components/features/providers/ProviderAvailabilityPreview";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

interface ProviderProfilePageProps {
  params: Promise<{ id: string }>;
}

export default async function ProviderProfilePage({
  params,
}: ProviderProfilePageProps) {
  const { id } = await params;

  try {
    const provider = await providerService.getProviderById(id);
    const services = await providerService.getProviderServices(id);

    if (!provider) return notFound();

    return (
      <div className="bg-white pb-24">
        {/* Profile Header */}
        <ProfileHeader provider={provider} />

        {/* Content Tabs/Grid */}
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
            {/* Left Column: Main Info */}
            <div className="flex-1 space-y-16">
              <ProviderAbout provider={provider} />

              <hr className="border-slate-100" />

              <ProviderServices services={services} />

              <hr className="border-slate-100" />

              <section>
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="font-outfit text-2xl font-bold text-slate-900">
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
                <h3 className="font-outfit text-2xl font-bold text-slate-900 mb-8">
                  Client Reviews
                </h3>
                <Suspense
                  fallback={
                    <Loader2 className="animate-spin text-rose-600 mx-auto" />
                  }
                >
                  <ProviderReviewsList providerProfileId={id} />
                </Suspense>
              </section>
            </div>

            {/* Right Column: Sticky Sidebar (Desktop) */}
            <aside className="w-full space-y-8 lg:w-80 lg:shrink-0 lg:sticky lg:top-24">
              <ProviderAvailabilityPreview />

              <div className="rounded-3xl bg-slate-900 p-8 text-white shadow-xl shadow-slate-200">
                <h4 className="font-outfit text-xl font-bold">
                  Ready to book?
                </h4>
                <p className="mt-2 text-sm text-slate-400">
                  Select a service and secure your spot with a direct deposit.
                </p>
                <button className="mt-6 w-full rounded-full bg-rose-600 py-4 font-bold transition-all hover:bg-rose-700">
                  Select a Service
                </button>
              </div>
            </aside>
          </div>
        </div>

        {/* Mobile Sticky CTA */}
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-100 bg-white/80 p-4 backdrop-blur-lg md:hidden">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-slate-500">
                Starting price
              </p>
              <p className="text-xl font-black text-slate-900">₦5,000</p>
            </div>
            <button className="flex-1 rounded-full bg-rose-600 py-3 font-bold text-white shadow-lg shadow-rose-200 transition-all active:scale-95">
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Failed to load provider profile:", error);
    return notFound();
  }
}
