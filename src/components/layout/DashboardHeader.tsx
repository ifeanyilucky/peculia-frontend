"use client";

import {
  Bell,
  Search,
  User,
  Settings,
  ChevronDown,
  Calendar,
  Wallet,
  Heart,
  Clipboard,
  Package,
  Globe,
  ArrowRight,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function DashboardHeader() {
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
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 lg:px-10 flex items-center justify-between sticky top-0 z-30">
      <div className="relative hidden md:block w-96">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          <Search size={18} />
        </div>
        <input
          type="text"
          placeholder="Search for services or professionals..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
          className="w-full h-11 bg-slate-50 rounded-2xl pl-11 pr-4 text-sm font-medium border-transparent focus:border-rose-500 focus:bg-white focus:ring-4 focus:ring-rose-50 transition-all outline-none"
        />
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <button className="relative p-2.5 rounded-2xl bg-slate-50 text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-all">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-rose-600 border-2 border-slate-50" />
        </button>

        <div className="h-10 w-px bg-slate-100 mx-2" />

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 pl-2 py-1.5 rounded-2xl hover:bg-slate-50 transition-all group"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-slate-900 leading-none">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
                {user?.role === "provider"
                  ? "Professional Account"
                  : "Client Account"}
              </p>
            </div>
            <div className="h-10 w-10 rounded-2xl bg-slate-900 overflow-hidden relative border-2 border-white shadow-sm transition-transform group-active:scale-95">
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
                "text-slate-400 transition-transform duration-300",
                isDropdownOpen && "rotate-180",
              )}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-white rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200/50 p-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="mb-4 px-2">
                <p className="text-lg font-bold text-slate-900 truncate">
                  {user?.firstName} {user?.lastName}
                </p>
              </div>

              <div className="space-y-1">
                <Link
                  href="/profile"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 w-full p-2 rounded-full text-slate-900 hover:bg-slate-50 transition-all text-[15px] font-medium"
                >
                  <User size={20} className="text-slate-900" />
                  <span>Profile</span>
                </Link>

                <Link
                  href="/bookings"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 w-full p-2 rounded-full text-slate-900 hover:bg-slate-50 transition-all text-[15px] font-medium"
                >
                  <Calendar size={20} className="text-slate-900" />
                  <span>Appointments</span>
                </Link>

                <Link
                  href="/saved"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 w-full p-2 rounded-2xl text-slate-900 hover:bg-slate-50 transition-all text-[15px] font-medium"
                >
                  <Heart size={20} className="text-slate-900" />
                  <span>Saved professionals</span>
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 w-full p-2 rounded-2xl text-slate-900 hover:bg-slate-50 transition-all text-[15px] font-medium"
                >
                  <Settings size={20} className="text-slate-900" />
                  <span>Settings</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center w-full p-2 rounded-2xl text-slate-900 hover:bg-slate-50 transition-all text-[15px] font-medium"
                >
                  <LogOut size={20} className="text-slate-900" />
                  <span className="ml-3">Log out</span>
                </button>
              </div>

              <div className="h-px bg-slate-200 my-4" />

              <div className="space-y-1">
                {/* <Link
                  href="/download"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center w-full p-2 rounded-2xl text-slate-900 hover:bg-slate-50 transition-all text-[15px] font-medium"
                >
                  <span className="ml-[32px]">Download the app</span>
                </Link> */}

                <Link
                  href="/support"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center w-full p-2 rounded-2xl text-slate-900 hover:bg-slate-50 transition-all text-[15px] font-medium"
                >
                  <span className="ml-[32px]">Help and support</span>
                </Link>
              </div>

              <div className="h-px bg-slate-200 my-4" />

              <Link
                href="/for-business"
                className="flex items-center justify-between w-full p-2 rounded-2xl text-slate-900 hover:bg-slate-50 transition-all text-[15px] font-bold"
              >
                <span className="ml-[32px]">For businesses</span>
                <ArrowRight size={20} className="text-slate-900" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
