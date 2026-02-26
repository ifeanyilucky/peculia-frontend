"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";

export default function ExploreHeader() {
  const router = useRouter();
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    clearAuth();
    setIsProfileOpen(false);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-100 py-3 px-6 lg:px-12">
      <div className="mx-auto max-w-[1440px] flex items-center justify-between">
        {/* Left: Logo */}
        <Link
          href="/"
          className="font-peculiar text-2xl font-black text-slate-900 tracking-tight"
        >
          peculia
        </Link>

        {/* Center: Search Bar */}
        <div className="hidden md:flex items-center bg-white border border-slate-200 rounded-full py-1.5 pl-6 pr-1.5 shadow-sm hover:shadow-md transition-shadow cursor-pointer min-w-[400px] lg:min-w-[500px]">
          <div className="flex-1 flex items-center">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-900">
                All Treatments
              </span>
            </div>
          </div>
          <div className="h-8 w-px bg-slate-200 mx-4" />
          <div className="flex-1 flex items-center">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-900">Map area</span>
            </div>
          </div>
          <div className="h-8 w-px bg-slate-200 mx-4" />
          <div className="flex-1 flex items-center">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-900">Any time</span>
            </div>
          </div>
          <button className="ml-4 h-11 w-11 rounded-full bg-slate-900 flex items-center justify-center text-white transition-transform active:scale-95">
            <Search size={20} />
          </button>
        </div>

        {/* Right: Profile Actions */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1.5 transition-shadow hover:shadow-sm"
          >
            <div className="h-8 w-8 rounded-full bg-rose-600 flex items-center justify-center text-white font-bold text-sm">
              {user?.firstName?.[0] || "I"}
            </div>
            <ChevronDown size={18} className="text-slate-500 mr-1" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 origin-top-right rounded-2xl bg-white p-2 shadow-xl ring-1 ring-slate-200/50 border border-slate-200">
              {isAuthenticated ? (
                <>
                  <div className="p-3 border-b border-slate-100">
                    <p className="text-sm font-bold text-slate-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                  </div>
                  <div className="py-2">
                    <Link
                      href="/client/bookings"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-xl"
                    >
                      My Bookings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-3 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-xl"
                    >
                      Sign out
                    </button>
                  </div>
                </>
              ) : (
                <div className="py-2">
                  <Link
                    href="/auth/login"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-xl"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-rose-600 font-bold hover:bg-rose-50 rounded-xl"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
