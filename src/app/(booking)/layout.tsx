export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-white flex-col font-sans">
      <main className="flex-1">{children}</main>
    </div>
  );
}
