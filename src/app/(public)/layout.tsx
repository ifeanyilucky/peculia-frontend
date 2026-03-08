import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import PublicHeader from "@/components/layout/PublicHeader";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      {/* Background abstract elements */}
      <div className="absolute top-0 -left-20 h-[500px] w-[500px] rounded-full bg-secondary/50 blur-3xl opacity-70" />
      <div className="absolute top-20 -right-20 h-[500px] w-[500px] rounded-full bg-secondary/50 blur-3xl opacity-60" />

      <main className="flex-1">{children}</main>

      {/* Basic Footer */}
      <footer className="border-t border-slate-100 bg-white py-12 px-6 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-8 md:flex-row">
            <div>
              <Link href="/" className="relative h-8 w-32 block mb-4">
                <Image
                  src="/logo/logo.png"
                  alt="Glamyad"
                  fill
                  className="object-contain"
                />
              </Link>
              <p className="mt-4 max-w-xs text-sm text-slate-500">
                The premium platform for booking trusted beauty and wellness
                professionals. Experience beauty reinvented.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-12 sm:grid-cols-3">
              <div className="flex flex-col gap-4">
                <span className="font-bold text-slate-900">Explore</span>
                <Link
                  href={ROUTES.public.explore}
                  className="text-sm text-slate-500 hover:text-rose-600"
                >
                  Find Professionals
                </Link>
                <Link
                  href={ROUTES.public.explore}
                  className="text-sm text-slate-500 hover:text-rose-600"
                >
                  Services
                </Link>
              </div>
              <div className="flex flex-col gap-4">
                <span className="font-bold text-slate-900">Professionals</span>
                <Link
                  href={ROUTES.partnersPortal}
                  className="text-sm text-slate-500 hover:text-rose-600"
                >
                  Join Glamyad
                </Link>
                <Link
                  href={ROUTES.partnersPortal}
                  className="text-sm text-slate-500 hover:text-rose-600"
                >
                  Pro Portal
                </Link>
              </div>
              <div className="flex flex-col gap-4">
                <span className="font-bold text-slate-900">Legal</span>
                <Link
                  href="/terms-of-service"
                  className="text-sm text-slate-500 hover:text-rose-600"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/privacy-policy"
                  className="text-sm text-slate-500 hover:text-rose-600"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/cookie-policy"
                  className="text-sm text-slate-500 hover:text-rose-600"
                >
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-slate-50 pt-8 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} Glamyad Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
