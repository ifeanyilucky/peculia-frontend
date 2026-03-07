import ExploreHeader from "@/components/layout/ExploreHeader";

/**
 * Explore layout.
 * The header is sticky (z-50) so the main content sits directly beneath it.
 */
export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col bg-background">
      <ExploreHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
