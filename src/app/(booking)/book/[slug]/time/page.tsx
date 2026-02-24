import { notFound } from "next/navigation";
import { providerService } from "@/services/provider.service";
import BookingHeader from "@/components/features/booking/BookingHeader";
import BookingSummarySidebar from "@/components/features/booking/BookingSummarySidebar";
import BookingTimeSelection from "@/components/features/booking/BookingTimeSelection";
import type { Metadata } from "next";

interface TimePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: TimePageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const provider = await providerService.getProviderById(slug);
    return {
      title: `Select Time — ${provider?.businessName || "Book"} | Peculia`,
    };
  } catch {
    return { title: "Select Time | Peculia" };
  }
}

export default async function TimeSelectionPage({ params }: TimePageProps) {
  const { slug } = await params;

  const provider = await providerService
    .getProviderById(slug)
    .catch(() => null);
  if (!provider) notFound();

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
      <BookingHeader currentStep={3} />

      <div className="mx-auto w-full max-w-7xl flex-1 px-6 py-12 lg:px-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
          <BookingTimeSelection providerId={provider._id} />
          <BookingSummarySidebar provider={provider} currentStep={3} slug={slug} />
        </div>
      </div>
    </div>
  );
}
