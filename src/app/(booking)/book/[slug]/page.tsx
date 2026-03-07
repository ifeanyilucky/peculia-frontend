import { redirect } from "next/navigation";
import { providerService } from "@/services/provider.service";

interface BookingPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ service?: string }>;
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
