import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full">
      {/* Brand Panel - Hidden on mobile */}
      <div className="relative hidden w-1/2 flex-col p-12 text-white lg:flex overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/nail-tech.jpg')" }}
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-slate-900/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />

        <div className="relative z-10 flex h-full flex-col justify-between">
          <div>
            <h1 className="font-peculiar text-4xl font-black text-white drop-shadow-md">
              Peculia.
            </h1>
          </div>

          <div className="max-w-md">
            <h2 className="font-peculiar text-5xl font-blacker text-white drop-shadow-lg">
              Redefining Beauty <br /> & Wellness.
            </h2>
            <p className="mt-6 text-lg text-slate-200 font-medium drop-shadow-md">
              Join the premium platform for top-tier beauty professionals and
              clients. Seamless bookings, verified experts, and stunning
              results.
            </p>
          </div>

          <div className="text-sm font-semibold text-slate-300 drop-shadow-md">
            © {new Date().getFullYear()} Peculia. All rights reserved.
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex w-full flex-col items-center justify-center bg-background px-6 py-12 lg:w-1/2 lg:px-24">
        <div className="mb-8 w-full max-w-[400px] lg:hidden">
          <h1 className="font-peculiar text-2xl font-bold text-rose-600 text-center">
            PECULIA
          </h1>
        </div>
        <div className="w-full max-w-[400px]">{children}</div>
      </div>
    </div>
  );
}
