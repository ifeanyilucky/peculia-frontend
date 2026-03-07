import { notFound } from "next/navigation";
import { providerService } from "@/services/provider.service";
import BookingHeader from "@/components/features/booking/BookingHeader";
import BookingServiceSelection from "@/components/features/booking/BookingServiceSelection";
import BookingSummarySidebar from "@/components/features/booking/BookingSummarySidebar";
import type { Metadata, ResolvingMetadata } from "next";

interface BookingServicesPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(
  { params }: BookingServicesPageProps,
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
      title: `Select Service - ${businessName || name} | Glamyad`,
      description: `Choose from a variety of services offered by ${businessName || name} and book your slot.`,
      openGraph: {
        title: `Book ${businessName || name} on Glamyad`,
        description: `Select a service and book your appointment with ${businessName || name}.`,
        url: `https://glamyad.com/book/${slug}/services`,
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

export default async function BookingServicesPage({
  params,
}: BookingServicesPageProps) {
  const { slug } = await params;

  try {
    const provider = await providerService.getProviderById(slug);
    const services = await providerService.getProviderServices(provider._id);

    if (!provider) {
      notFound();
    }

    return (
      <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
        <BookingHeader currentStep={1} />

        <div className="mx-auto w-full max-w-7xl flex-1 px-6 py-12 lg:px-8">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
            <BookingServiceSelection services={services} />
            <BookingSummarySidebar
              provider={provider}
              currentStep={1}
              slug={slug}
            />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading booking services:", error);
    notFound();
  }
}
