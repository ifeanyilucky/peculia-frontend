"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  ChevronDown,
  Calendar,
  Search as SearchIcon,
  Map as MapIcon,
  ArrowLeft,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  TreatmentDropdown,
  LocationDropdown,
  DateTimeDropdown,
} from "./ExploreFilterPopups";
import MobileSearchModal from "./MobileSearchModal";
import { ROUTES } from "@/constants/routes";
import { format } from "date-fns";

export default function ExploreHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Filter States
  const [activeSegment, setActiveSegment] = useState<
    "treatment" | "location" | "time" | null
  >(null);
  const [treatment, setTreatment] = useState(
    searchParams.get("specialty") || "",
  );
  const [location, setLocation] = useState(searchParams.get("city") || "");
  const [time, setTime] = useState("Any time");

  const headerRef = useRef<HTMLDivElement>(null);
  const treatmentInputRef = useRef<HTMLInputElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setActiveSegment(null);
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

  // Auto-focus logic
  useEffect(() => {
    if (activeSegment === "treatment") {
      treatmentInputRef.current?.focus();
    } else if (activeSegment === "location") {
      locationInputRef.current?.focus();
    }
  }, [activeSegment]);

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (treatment) params.set("specialty", treatment);
    else params.delete("specialty");

    if (location) params.set("city", location);
    else params.delete("city");

    if (time !== "Any time") {
      params.set("time", time);
    } else {
      params.delete("time");
    }

    setActiveSegment(null);
    router.push(`/explore?${params.toString()}`);
  };

  const handleSignOut = () => {
    clearAuth();
    setIsProfileOpen(false);
    router.push("/");
  };

  return (
    <>
      <AnimatePresence>
        {activeSegment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveSegment(null)}
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[2px]"
          />
        )}
      </AnimatePresence>

      <header
        className={cn(
          "sticky top-0 z-50 w-full bg-white border-b border-slate-100 py-3 px-6 lg:px-12 transition-all duration-500",
          activeSegment ? "py-6" : "py-3",
        )}
        ref={headerRef}
      >
        <div className="mx-auto max-w-[1440px] flex items-center justify-between gap-8">
          {/* Left: Logo */}
          <Link
            href="/"
            className={cn(
              "font-peculiar text-2xl font-black text-slate-900 tracking-tight shrink-0 transition-all",
              activeSegment ? "hidden sm:block" : "block",
            )}
          >
            glamyad
          </Link>

          {/* Center: Search Bar (Responsive) */}
          <div className="flex-1 flex justify-center max-w-4xl transition-all duration-500">
            {/* Mobile Search Bar (Compact) */}
            <div
              onClick={() => setIsMobileSearchOpen(true)}
              className="flex sm:hidden items-center justify-between w-full bg-white border border-slate-200 rounded-full px-4 py-2 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center">
                  <ArrowLeft size={16} className="text-slate-900" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black text-slate-900 line-clamp-1">
                    {treatment || "All treatments and venues"}
                  </span>
                  <span className="text-[10px] font-medium text-slate-500">
                    {time} • {location || "Current location"}
                  </span>
                </div>
              </div>
              <div className="h-8 w-8 rounded-full border border-slate-200 flex items-center justify-center">
                <MapIcon size={14} className="text-slate-900" />
              </div>
            </div>

            {/* Desktop Search Bar (Expanding) */}
            <div
              className={cn(
                "hidden sm:flex items-center bg-white border border-slate-200 rounded-full transition-all duration-500 shadow-sm hover:shadow-md w-full",
                activeSegment
                  ? "p-1.5 bg-slate-50 border-slate-300 ring-4 ring-slate-100/30 scale-100 lg:scale-105"
                  : "p-1.5",
              )}
            >
              {/* Treatment Segment */}
              <div
                onClick={() => setActiveSegment("treatment")}
                className={cn(
                  "group relative flex flex-col justify-center px-4 sm:px-6 py-2 rounded-full cursor-pointer transition-all duration-300",
                  activeSegment === "treatment"
                    ? "bg-white shadow-lg min-w-[140px] sm:min-w-[240px] flex-1"
                    : activeSegment
                      ? "hidden lg:flex lg:flex-1"
                      : "hover:bg-slate-100 flex-1",
                )}
              >
                <span className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors">
                  Treatments
                </span>
                <input
                  ref={treatmentInputRef}
                  type="text"
                  placeholder="All Treatments"
                  value={treatment}
                  onChange={(e) => setTreatment(e.target.value)}
                  className="w-full border-none bg-transparent p-0 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
                />
                <AnimatePresence>
                  {activeSegment === "treatment" && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-6 z-[110]"
                    >
                      <TreatmentDropdown
                        searchQuery={treatment}
                        onSelect={(id) => {
                          setTreatment(id);
                          setActiveSegment("location");
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div
                className={cn(
                  "h-8 w-px bg-slate-200",
                  activeSegment ? "hidden sm:block" : "block",
                )}
              />

              {/* Location Segment */}
              <div
                onClick={() => setActiveSegment("location")}
                className={cn(
                  "group relative flex flex-col justify-center px-4 lg:px-6 py-2 rounded-full cursor-pointer transition-all duration-300",
                  activeSegment === "location"
                    ? "bg-white shadow-lg min-w-[200px] lg:min-w-[240px] flex-1"
                    : activeSegment
                      ? "hidden lg:flex lg:flex-1"
                      : "hover:bg-slate-100 flex-1",
                )}
              >
                <span className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors">
                  Where
                </span>
                <input
                  ref={locationInputRef}
                  type="text"
                  placeholder="Map area"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full border-none bg-transparent p-0 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
                />
                <AnimatePresence>
                  {activeSegment === "location" && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-6 z-[110]"
                    >
                      <LocationDropdown
                        searchQuery={location}
                        onSelect={(city) => {
                          setLocation(city);
                          setActiveSegment("time");
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div
                className={cn(
                  "h-8 w-px bg-slate-200",
                  activeSegment ? "hidden sm:block" : "block",
                )}
              />

              {/* Time Segment */}
              <div
                onClick={() => setActiveSegment("time")}
                className={cn(
                  "group relative flex flex-col justify-center px-4 lg:px-6 py-2 rounded-full cursor-pointer transition-all duration-300",
                  activeSegment === "time"
                    ? "bg-white shadow-lg min-w-[140px] lg:min-w-[200px] flex-1"
                    : activeSegment
                      ? "hidden lg:flex lg:flex-1"
                      : "hover:bg-slate-100 flex-1",
                )}
              >
                <span className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors">
                  When
                </span>
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-slate-400" />
                  <span className="text-sm font-bold text-slate-900 truncate max-w-[80px] sm:max-w-[120px]">
                    {time}
                  </span>
                </div>
                <AnimatePresence>
                  {activeSegment === "time" && (
                    <motion.div
                      initial={{ opacity: 0, x: -200, y: 20 }}
                      animate={{ opacity: 1, x: -250, y: 0 }}
                      exit={{ opacity: 0, x: -200, y: 10 }}
                      className="absolute top-full left-0 mt-6 z-[110]"
                    >
                      <DateTimeDropdown
                        onSelect={(date, t) => {
                          setTime(`${format(date, "MMM d")}, ${t}`);
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-full bg-slate-900 text-white font-bold transition-all duration-500 active:scale-95",
                  activeSegment ? "px-8 py-3.5 ml-2" : "h-11 w-11 lg:ml-4",
                )}
              >
                <SearchIcon size={activeSegment ? 20 : 18} />
                {activeSegment && (
                  <span className="text-sm font-black">Search</span>
                )}
              </button>
            </div>
          </div>

          <div
            className={cn(
              "relative shrink-0 transition-all",
              activeSegment ? "hidden sm:block" : "block",
            )}
            ref={profileRef}
          >
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1.5 transition-shadow hover:shadow-sm"
            >
              <div className="h-8 w-8 rounded-full bg-rose-600 flex items-center justify-center text-white font-bold text-sm uppercase">
                {user?.firstName?.[0] || "I"}
              </div>
              <ChevronDown size={18} className="text-slate-500 mr-1" />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-4 w-56 origin-top-right rounded-2xl bg-white p-2 shadow-2xl ring-1 ring-slate-200/50 border border-slate-200 z-50"
                >
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
                          className="flex items-center gap-3 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl"
                        >
                          My Bookings
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="flex w-full items-center gap-3 px-3 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-xl"
                        >
                          Sign out
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="py-2">
                      <Link
                        href={ROUTES.auth.login}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl"
                      >
                        Log in
                      </Link>
                      <Link
                        href={ROUTES.auth.registerClient}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-rose-600 font-black hover:bg-rose-50 rounded-xl"
                      >
                        Sign up
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>
      <MobileSearchModal
        isOpen={isMobileSearchOpen}
        onClose={() => setIsMobileSearchOpen(false)}
        initialTreatment={treatment}
        initialLocation={location}
        initialTime={time}
        onApply={(data) => {
          setTreatment(data.treatment);
          setLocation(data.location);
          setTime(data.time);
          // Trigger search after modal apply
          const params = new URLSearchParams(searchParams.toString());
          if (data.treatment) params.set("specialty", data.treatment);
          else params.delete("specialty");
          if (data.location) params.set("city", data.location);
          else params.delete("city");
          if (data.time !== "Any time") params.set("time", data.time);
          else params.delete("time");
          router.push(`/explore?${params.toString()}`);
        }}
      />
    </>
  );
}
