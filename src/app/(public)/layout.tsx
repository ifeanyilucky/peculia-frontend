import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Basic Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link
            href="/"
            className="font-outfit text-2xl font-bold tracking-tight text-rose-600"
          >
            PECULIA
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href={ROUTES.explore}
              className="text-sm font-semibold text-slate-600 hover:text-rose-600"
            >
              Find Professionals
            </Link>
            <Link
              href={ROUTES.auth.registerProvider}
              className="text-sm font-semibold text-slate-600 hover:text-rose-600"
            >
              Join as a Pro
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href={ROUTES.auth.login}
              className="text-sm font-bold text-slate-900 transition-colors hover:text-rose-600"
            >
              Login
            </Link>
            <Link
              href={ROUTES.auth.registerClient}
              className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-rose-600"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* Basic Footer */}
      <footer className="border-t border-slate-100 bg-white py-12 px-6 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-8 md:flex-row">
            <div>
              <Link
                href="/"
                className="font-outfit text-2xl font-bold tracking-tight text-rose-600"
              >
                PECULIA
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
                  href={ROUTES.explore}
                  className="text-sm text-slate-500 hover:text-rose-600"
                >
                  Find Pros
                </Link>
                <Link
                  href={ROUTES.explore}
                  className="text-sm text-slate-500 hover:text-rose-600"
                >
                  Services
                </Link>
              </div>
              <div className="flex flex-col gap-4">
                <span className="font-bold text-slate-900">Professionals</span>
                <Link
                  href={ROUTES.auth.registerProvider}
                  className="text-sm text-slate-500 hover:text-rose-600"
                >
                  Join Peculia
                </Link>
                <Link
                  href={ROUTES.auth.login}
                  className="text-sm text-slate-500 hover:text-rose-600"
                >
                  Pro Portal
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-slate-50 pt-8 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} Peculia Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
