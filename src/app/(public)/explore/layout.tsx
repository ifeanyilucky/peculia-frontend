import ExploreHeader from "@/components/layout/ExploreHeader";

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <ExploreHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
