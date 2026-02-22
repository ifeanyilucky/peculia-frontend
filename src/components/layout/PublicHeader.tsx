"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { Menu, Globe, ArrowRight } from "lucide-react";

export default function PublicHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full max-w-7xl mx-auto bg-white border-b border-slate-100">
      <div className="mx-auto flex h-[72px] items-center justify-between px-6 lg:px-8">
        {/* Left: Logo */}
        <Link
          href="/"
          className="font-peculiar text-2xl font-black tracking-tight text-slate-900"
        >
          peculia
        </Link>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <Link
            href={ROUTES.auth.login}
            className="hidden sm:block text-sm font-semibold text-slate-900 hover:text-slate-600 transition-colors"
          >
            Log in
          </Link>
          <Link
            href={ROUTES.auth.registerProvider}
            className="hidden sm:block rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50"
          >
            List your business
          </Link>

          {/* Menu Dropdown Container */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 rounded-full border border-slate-300 bg-white pl-4 pr-3 py-2 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50"
            >
              Menu
              <Menu className="h-5 w-5" />
            </button>

            {/* Dropdown Content */}
            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 origin-top-right rounded-2xl bg-white p-2 shadow-xl ring-1 ring-slate-200/50">
                <div className="p-3">
                  <h3 className="mb-3 text-sm font-bold text-slate-900">
                    For customers
                  </h3>
                  <div className="flex flex-col gap-3">
                    <Link
                      href={ROUTES.auth.login}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Log in or sign up
                    </Link>
                    <Link
                      href="#"
                      className="text-sm text-slate-700 hover:text-slate-900 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Download the app
                    </Link>
                    <Link
                      href="#"
                      className="text-sm text-slate-700 hover:text-slate-900 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Help and support
                    </Link>
                    <button className="flex w-full items-center gap-2 text-left text-sm text-slate-700 hover:text-slate-900 transition-colors">
                      <Globe className="h-4 w-4" />
                      English
                    </button>
                  </div>
                </div>

                <div className="my-1 border-t border-slate-100 px-3"></div>

                <Link
                  href={ROUTES.auth.registerProvider}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex w-full items-center justify-between p-3 text-sm font-bold text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  For businesses
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
