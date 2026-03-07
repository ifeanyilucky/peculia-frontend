import { redirect } from "next/navigation";
import { providerService } from "@/services/provider.service";
import type { Metadata, ResolvingMetadata } from "next";

interface BookingPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ service?: string }>;
}

export async function generateMetadata(
  { params }: BookingPageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params;
  try {
    const provider = await providerService.getProviderById(slug);
    if (!provider) return { title: "Book Services | Glamyad" };

    const name = `${provider.userId.firstName} ${provider.userId.lastName}`;
    const businessName = provider.businessName;
    const previousImages = (await parent).openGraph?.images || [];

    return {
      title: `Book ${businessName || name} | Glamyad`,
      description: `Schedule an appointment with ${businessName || name} on Glamyad. Check availability and book instantly.`,
      openGraph: {
        title: `Book ${businessName || name} on Glamyad`,
        description:
          provider.bio?.substring(0, 160) ||
          `Schedule an appointment with ${businessName || name}.`,
        url: `https://glamyad.com/book/${slug}`,
        images: provider.portfolioImages?.[0]?.url
          ? [provider.portfolioImages[0].url, ...previousImages]
          : provider.userId.avatar
            ? [provider.userId.avatar, ...previousImages]
            : previousImages,
      },
    };
  } catch {
    return { title: "Book Services | Glamyad" };
  }
}

export default async function BookingPage({
  params,
  searchParams,
}: BookingPageProps) {
  const { slug } = await params;
  const { service: serviceSlug } = await searchParams;

  // Validate provider exists and is bookable
  const provider = await providerService
    .getProviderById(slug)
    .catch(() => null);

  if (!provider) {
    redirect("/explore");
  }

  if (!provider.isDiscoverable || !provider.canBookOnline) {
    // If provider is not discoverable or back-online, redirect to their profile which will show status
    redirect(`/pro/${slug}`);
  }

  // If a service slug is provided via query param (deep linking)
  // we would ideally pre-select it.
  // For now, the existing booking flow starts at /services
  // We will redirect to /book/[slug]/services

  // NOTE: In a more advanced implementation, we would set the service in store/cookie here
  // and redirect to /book/[slug]/professional or /book/[slug]/time

  redirect(
    `/book/${slug}/services${serviceSlug ? `?service=${serviceSlug}` : ""}`,
  );
}
