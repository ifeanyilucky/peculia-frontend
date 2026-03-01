import { helpService } from "@/services/help.service";
import { CategoryGrid } from "@/components/help/CategoryGrid";
import { HelpSearch } from "@/components/help/HelpSearch";
import { Audience } from "@/types/help.types";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";

export default async function AudienceDashboardPage({
  params,
}: {
  params: Promise<{ audience: string }>;
}) {
  const { audience } = await params;

  if (!["customers", "professionals"].includes(audience)) {
    return notFound();
  }

  const categories = await helpService.getCategories(audience);

  const title =
    audience === "customers"
      ? "Customer Help Center"
      : "Professional Help Center";
  const subtitle =
    audience === "customers"
      ? "Find answers about booking, payments, and managing your client account."
      : "Everything you need to grow and manage your business on Peculia.";

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12">
        <Link
          href="/help"
          className="mb-8 inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Support
        </Link>

        <header className="mb-16">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight lg:text-5xl capitalize">
            {title}
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">{subtitle}</p>
        </header>

        <div className="mb-20">
          <HelpSearch audience={audience as Audience} />
        </div>

        <section>
          <h2 className="mb-8 text-2xl font-bold">Browse Categories</h2>
          <CategoryGrid categories={categories} audience={audience} />
        </section>

        {/* Getting Started Section for Professionals */}
        {audience === "professionals" && (
          <section className="mt-24 rounded-3xl bg-primary/5 p-12 lg:p-16">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="mb-6 text-3xl font-bold">New to Peculia?</h2>
                <p className="mb-8 text-lg text-muted-foreground">
                  Our getting started guide covers everything from setting up
                  your profile to taking your first booking.
                </p>
                <Link
                  href="/help/professionals/getting-started"
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-8 py-4 font-bold text-primary-foreground transition-transform hover:scale-105"
                >
                  Start Onboarding Guide
                </Link>
              </div>
              <div className="relative aspect-video overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800"
                  alt="Getting Started"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
