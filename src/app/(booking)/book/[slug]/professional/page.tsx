import { notFound } from "next/navigation";
import { providerService } from "@/services/provider.service";
import BookingHeader from "@/components/features/booking/BookingHeader";
import BookingSummarySidebar from "@/components/features/booking/BookingSummarySidebar";
import BookingProfessionalSelection from "@/components/features/booking/BookingProfessionalSelection";
import type { Metadata } from "next";

interface ProfessionalPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProfessionalPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const provider = await providerService.getProviderById(slug);
    return {
      title: `Choose Professional — ${provider?.businessName || "Book"} | Peculia`,
    };
  } catch {
    return { title: "Choose Professional | Peculia" };
  }
}

export default async function ProfessionalSelectionPage({
  params,
}: ProfessionalPageProps) {
  const { slug } = await params;

  const provider = await providerService
    .getProviderById(slug)
    .catch(() => null);
  if (!provider) notFound();

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
      <BookingHeader currentStep={2} />

      <div className="mx-auto w-full max-w-7xl flex-1 px-6 py-12 lg:px-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
          <BookingProfessionalSelection providerId={provider._id} />
          <BookingSummarySidebar provider={provider} currentStep={2} slug={slug} />
        </div>
      </div>
    </div>
  );
}
