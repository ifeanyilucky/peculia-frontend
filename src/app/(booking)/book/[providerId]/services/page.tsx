import { notFound } from "next/navigation";
import { providerService } from "@/services/provider.service";
import BookingHeader from "@/components/features/booking/BookingHeader";
import BookingServiceSelection from "@/components/features/booking/BookingServiceSelection";
import BookingSummarySidebar from "@/components/features/booking/BookingSummarySidebar";
import type { Metadata } from "next";

interface BookingServicesPageProps {
  params: Promise<{ providerId: string }>;
}

export async function generateMetadata({
  params,
}: BookingServicesPageProps): Promise<Metadata> {
  const { providerId } = await params;
  try {
    const provider = await providerService.getProviderById(providerId);
    return {
      title: `Book ${provider?.businessName || "Services"} | Peculia`,
    };
  } catch {
    return { title: "Book Services | Peculia" };
  }
}

export default async function BookingServicesPage({
  params,
}: BookingServicesPageProps) {
  const { providerId } = await params;

  try {
    const [provider, services] = await Promise.all([
      providerService.getProviderById(providerId),
      providerService.getProviderServices(providerId),
    ]);

    if (!provider) {
      notFound();
    }

    return (
      <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
        <BookingHeader currentStep={1} />

        <div className="mx-auto w-full max-w-7xl flex-1 px-6 py-12 lg:px-8">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
            <BookingServiceSelection services={services} />
            <BookingSummarySidebar provider={provider} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading booking services:", error);
    notFound();
  }
}
