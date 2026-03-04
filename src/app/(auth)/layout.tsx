import React from "react";
import GuestGuard from "@/components/features/auth/GuestGuard";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GuestGuard>
      <div className="flex min-h-screen w-full">
        {/* Brand Panel - Hidden on mobile */}
        <div className="relative hidden w-1/2 flex-col p-12 text-white lg:flex overflow-hidden">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10s] hover:scale-110"
            style={{ backgroundImage: "url('/images/salon-1.webp')" }}
          />
          {/* Soft overlay for readability and elegance */}
          <div className="absolute inset-0 bg-rose-950/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />

          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <h1 className="font-peculiar text-4xl font-black text-white">
                Glamyad.
              </h1>
            </div>

            <div className="max-w-md">
              <h2 className="font-peculiar text-5xl font-blacker text-white">
                Redefining Beauty <br /> & Wellness.
              </h2>
              <p className="mt-6 text-lg text-slate-200 font-medium">
                Join the premium platform for top-tier beauty professionals and
                clients. Seamless bookings, verified experts, and stunning
                results.
              </p>
            </div>

            <div className="text-sm font-semibold text-slate-300">
              © {new Date().getFullYear()} Glamyad. All rights reserved.
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="flex w-full flex-col items-center justify-center bg-background px-6 py-12 lg:w-1/2 lg:px-24">
          <div className="mb-8 w-full max-w-[400px] lg:hidden">
            <h1 className="font-peculiar text-2xl font-bold text-rose-600 text-center">
              GLAMYAD
            </h1>
          </div>
          <div className="w-full max-w-[400px]">{children}</div>
        </div>
      </div>
    </GuestGuard>
  );
}
