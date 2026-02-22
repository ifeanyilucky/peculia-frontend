import ProviderCard from "../providers/ProviderCard";
import { providerService } from "@/services/provider.service";

// Using dynamic fetch with revalidation
async function getFeaturedProviders() {
  try {
    const data = await providerService.discoverProviders({
      limit: 6,
      sort: "rating",
    });
    return data.results;
  } catch (error) {
    console.error("Failed to fetch featured providers:", error);
    return [];
  }
}

export default async function FeaturedProviders() {
  const providers = await getFeaturedProviders();

  if (providers.length === 0) return null;

  return (
    <section className="py-24 px-6 lg:px-24 bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="font-outfit text-4xl font-bold tracking-tight text-slate-900">
              Featured Professionals
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Top-rated experts handpicked for quality and reliability.
            </p>
          </div>
          <a
            href="/explore"
            className="font-bold text-rose-600 hover:underline"
          >
            View All Professionals →
          </a>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-8 snap-x no-scrollbar">
          {providers.map((provider) => (
            <div key={provider.id} className="w-[320px] shrink-0 snap-start">
              <ProviderCard provider={provider} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
