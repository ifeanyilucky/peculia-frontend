"use client";

import {
  Bell,
  Search,
  User,
  Settings,
  ChevronDown,
  Calendar,
  Heart,
  LogOut,
  Menu,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function DashboardHeader({
  onMenuClick,
}: {
  onMenuClick?: () => void;
}) {
  const { user, clearAuth } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      clearAuth();
      router.push("/auth/login");
    }
  };

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-secondary px-6 lg:px-10 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2.5 rounded-2xl bg-secondary/50 text-foreground hover:bg-secondary hover:text-primary transition-all"
        >
          <Menu size={20} />
        </button>
        <Link href="/" className="relative h-8 w-28 shrink-0 md:hidden">
          <Image
            src="/logo/logo.png"
            alt="Glamyad"
            fill
            className="object-contain"
            priority
          />
        </Link>
      </div>

      <div className="relative hidden md:block w-96">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Search size={18} />
        </div>
        <input
          type="text"
          placeholder="Search for services or professionals..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
          className="w-full h-11 bg-secondary/30 rounded-full pl-11 pr-4 text-sm font-medium border border-secondary focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/20 transition-all outline-none"
        />
      </div>

      <div className="flex items-center gap-4 ml-auto">
        {/* <button className="relative p-2.5 rounded-2xl bg-secondary/50 text-foreground hover:bg-secondary hover:text-primary transition-all">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-primary border-2 border-secondary" />
        </button> */}

        <div className="h-10 w-px bg-secondary mx-2" />

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 pl-2 py-1.5 rounded-2xl hover:bg-secondary/50 transition-all group"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-primary leading-none">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">
                Client Account
              </p>
            </div>
            <div className="h-10 w-10 rounded-2xl bg-primary overflow-hidden relative border-2 border-white shadow-sm transition-transform group-active:scale-95">
              {user?.avatar ? (
                <Image
                  src={user.avatar}
                  alt="Avatar"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-white font-bold">
                  {user?.firstName?.[0]}
                </div>
              )}
            </div>
            <ChevronDown
              size={14}
              className={cn(
                "text-muted-foreground transition-transform duration-300",
                isDropdownOpen && "rotate-180",
              )}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-white rounded-3xl border border-secondary shadow-xl shadow-primary/10 p-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="mb-4 px-2">
                <p className="text-lg font-bold text-primary truncate">
                  {user?.firstName} {user?.lastName}
                </p>
              </div>

              <div className="space-y-1">
                <Link
                  href="/profile"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 w-full p-2 rounded-full text-foreground hover:bg-secondary/50 transition-all text-[15px] font-medium"
                >
                  <User size={20} className="text-primary" />
                  <span>Profile</span>
                </Link>

                <Link
                  href="/bookings"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 w-full p-2 rounded-full text-foreground hover:bg-secondary/50 transition-all text-[15px] font-medium"
                >
                  <Calendar size={20} className="text-primary" />
                  <span>Appointments</span>
                </Link>

                <Link
                  href="/saved"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 w-full p-2 rounded-2xl text-foreground hover:bg-secondary/50 transition-all text-[15px] font-medium"
                >
                  <Heart size={20} className="text-primary" />
                  <span>Saved professionals</span>
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 w-full p-2 rounded-2xl text-foreground hover:bg-secondary/50 transition-all text-[15px] font-medium"
                >
                  <Settings size={20} className="text-primary" />
                  <span>Settings</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center w-full p-2 rounded-2xl text-foreground hover:bg-secondary/50 transition-all text-[15px] font-medium"
                >
                  <LogOut size={20} className="text-primary" />
                  <span className="ml-3">Log out</span>
                </button>
              </div>

              <div className="h-px bg-secondary my-4" />

              <div className="space-y-1">
                <Link
                  href="/support"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center w-full p-2 rounded-2xl text-foreground hover:bg-secondary/50 transition-all text-[15px] font-medium"
                >
                  <span className="ml-[32px]">Help and support</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
