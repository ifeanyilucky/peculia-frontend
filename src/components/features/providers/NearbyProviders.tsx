"use client";

import { Provider } from "@/types/provider.types";
import ProviderCard from "./ProviderCard";

interface NearbyProvidersProps {
  providers: Provider[];
  currentProviderId: string;
}

export default function NearbyProviders({
  providers,
  currentProviderId,
}: NearbyProvidersProps) {
  // Filter out the current provider if they happen to be in the results
  const filteredProviders = providers.filter(
    (p) => p._id !== currentProviderId,
  );

  if (filteredProviders.length === 0) return null;

  return (
    <>
      <hr className="border-slate-100" />
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="font-peculiar text-3xl font-black text-slate-900">
              Nearby Professionals
            </h2>
            <p className="mt-2 text-lg text-slate-500 font-medium">
              Explore other top-rated beauty and wellness experts in your area.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProviders.slice(0, 4).map((provider) => (
              <ProviderCard key={provider._id} provider={provider} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
