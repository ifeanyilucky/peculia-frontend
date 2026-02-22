import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full">
      {/* Brand Panel - Hidden on mobile */}
      <div className="relative hidden w-1/2 flex-col bg-rose-600 p-12 text-white lg:flex">
        <div className="absolute inset-0 bg-[url('/images/auth-pattern.svg')] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/50 to-rose-700/80" />

        <div className="relative z-10 flex h-full flex-col justify-between">
          <div>
            <h1 className="font-peculiar text-3xl font-bold tracking-tight">
              PECULIA
            </h1>
          </div>

          <div className="max-w-md">
            <h2 className="font-peculiar text-5xl font-bold leading-tight tracking-tighter">
              Redefining Beauty <br /> & Wellness.
            </h2>
            <p className="mt-6 text-lg text-rose-100 opacity-90">
              Join the premium platform for top-tier beauty professionals and
              clients. Seamless bookings, verified experts, and stunning
              results.
            </p>
          </div>

          <div className="text-sm text-rose-200">
            © {new Date().getFullYear()} Peculia. All rights reserved.
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex w-full flex-col items-center justify-center bg-background px-6 py-12 lg:w-1/2 lg:px-24">
        <div className="mb-8 w-full max-w-[400px] lg:hidden">
          <h1 className="font-peculiar text-2xl font-bold tracking-tight text-rose-600 text-center">
            PECULIA
          </h1>
        </div>
        <div className="w-full max-w-[400px]">{children}</div>
      </div>
    </div>
  );
}
