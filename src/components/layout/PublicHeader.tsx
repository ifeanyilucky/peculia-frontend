"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { Menu, User, LogOut, Bookmark, Calendar } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";

import Image from "next/image";

export default function PublicHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, clearAuth } = useAuthStore();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
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

  if (pathname === "/explore" || pathname.startsWith("/explore/")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-secondary">
      <div className="mx-auto  max-w-7xl flex h-[72px] items-center justify-between px-6 lg:px-8">
        <Link href="/" className="relative h-8 w-32">
          <Image
            src="/logo/logo.png"
            alt="Glamyad"
            fill
            className="object-contain"
            priority
          />
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 rounded-full border border-secondary bg-white px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-secondary/50"
                >
                  <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center">
                    <User size={14} className="text-primary" />
                  </div>
                  <span className="hidden sm:block">{user?.firstName}</span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 origin-top-right rounded-2xl bg-white p-2 ring-1 ring-secondary/50 border border-secondary">
                    <div className="p-3 border-b border-secondary">
                      <p className="text-sm font-bold text-primary">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>

                    <div className="py-2">
                      <Link
                        href={ROUTES.client.bookings}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-secondary/50 rounded-xl transition-colors"
                      >
                        <Calendar size={16} />
                        My Bookings
                      </Link>
                      <Link
                        href={ROUTES.client.saved}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-secondary/50 rounded-xl transition-colors"
                      >
                        <Bookmark size={16} />
                        Saved Professionals
                      </Link>
                      <Link
                        href={ROUTES.client.profile}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-secondary/50 rounded-xl transition-colors"
                      >
                        <User size={16} />
                        Profile
                      </Link>
                    </div>

                    <div className="border-t border-secondary pt-2">
                      <button
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-3 px-3 py-2 text-sm text-primary hover:bg-secondary/50 rounded-xl transition-colors"
                      >
                        <LogOut size={16} />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href={ROUTES.auth.login}
                className="hidden sm:block text-sm font-semibold text-primary hover:text-accent transition-colors"
              >
                Log in
              </Link>
            </>
          )}

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 rounded-full border border-secondary bg-white pl-4 pr-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-secondary/50"
            >
              Menu
              <Menu className="h-5 w-5" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 origin-top-right rounded-2xl bg-white p-2 ring-1 ring-secondary/50 border border-secondary">
                {isAuthenticated ? (
                  <>
                    <Link
                      href={ROUTES.client.bookings}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-secondary/50 rounded-xl transition-colors"
                    >
                      <Calendar size={16} />
                      My Bookings
                    </Link>
                    <Link
                      href={ROUTES.client.saved}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-secondary/50 rounded-xl transition-colors"
                    >
                      <Bookmark size={16} />
                      Saved Professionals
                    </Link>
                    <div className="my-1 border-t border-secondary px-3"></div>
                  </>
                ) : (
                  <div className="p-3">
                    <h3 className="mb-3 text-sm font-bold text-primary">
                      For customers
                    </h3>
                    <div className="flex flex-col gap-3">
                      <Link
                        href={ROUTES.auth.login}
                        className="text-sm font-medium text-primary hover:text-accent transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Log in or sign up
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
