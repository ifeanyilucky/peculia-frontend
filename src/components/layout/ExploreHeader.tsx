"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  ChevronDown,
  Calendar,
  MapPin,
  Sparkles,
  User,
  LogOut,
  BookOpen,
  Menu,
  X,
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

type Segment = "treatment" | "location" | "time" | null;

/**
 * ExploreHeader — two-row sticky navigation for the Explore page.
 *
 * Row 1: Logo + nav links + profile menu
 * Row 2: Expanding smart search bar (Treatment | Location | When)
 *
 * Mobile (<md): Row 2 collapses to a compact pill that opens a full-screen
 * step-by-step modal.
 */
export default function ExploreHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user, clearAuth } = useAuthStore();

  // ── Search state ──────────────────────────────────────────────────────────
  const [activeSegment, setActiveSegment] = useState<Segment>(null);
  const [treatment, setTreatment] = useState(
    searchParams.get("specialty") || "",
  );
  const [location, setLocation] = useState(searchParams.get("city") || "");
  /**
   * selectedTime: backend-ready token — "Any time" | "Morning" | "Afternoon" | "Evening" | "HH:mm-HH:mm"
   * selectedDate: ISO date string (e.g. "2025-03-07") — separate from time
   */
  const [selectedTime, setSelectedTime] = useState(
    searchParams.get("time") || "Any time",
  );
  const [selectedDate, setSelectedDate] = useState(
    searchParams.get("date") || "",
  );

  /** Human-readable label shown in the When segment chip */
  const timeDisplayLabel = selectedDate
    ? `${selectedDate}${selectedTime !== "Any time" ? `, ${selectedTime}` : ""}`
    : selectedTime === "Any time"
      ? "Any time"
      : selectedTime;

  // ── UI state ──────────────────────────────────────────────────────────────
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // ── Refs ──────────────────────────────────────────────────────────────────
  const headerRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const treatmentInputRef = useRef<HTMLInputElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);

  // ── Click-outside handler ─────────────────────────────────────────────────
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setActiveSegment(null);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Auto-focus inputs when segment becomes active ─────────────────────────
  useEffect(() => {
    if (activeSegment === "treatment") treatmentInputRef.current?.focus();
    else if (activeSegment === "location") locationInputRef.current?.focus();
  }, [activeSegment]);

  // ── Search handler ────────────────────────────────────────────────────────
  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (treatment) params.set("specialty", treatment);
    else params.delete("specialty");
    if (location) params.set("city", location);
    else params.delete("city");
    // Send date and time as separate, backend-ready params
    if (selectedDate) params.set("date", selectedDate);
    else params.delete("date");
    if (selectedTime !== "Any time") params.set("time", selectedTime);
    else params.delete("time");
    setActiveSegment(null);
    router.push(`/explore?${params.toString()}`);
  };

  const handleSignOut = () => {
    clearAuth();
    setIsProfileOpen(false);
    router.push("/");
  };

  // ── Derived display values ────────────────────────────────────────────────
  const pillLabel = [
    treatment || "All treatments",
    location || "Anywhere",
    selectedTime,
  ]
    .filter(Boolean)
    .join(" · ");

  const userInitials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() ||
      "U"
    : null;

  // ── Nav links ─────────────────────────────────────────────────────────────
  const navLinks = [
    { href: ROUTES.public.explore, label: "Explore" },
    { href: ROUTES.public.forBusiness, label: "For Business" },
  ];

  return (
    <>
      {/* ── Backdrop overlay when a segment is active ── */}
      <AnimatePresence>
        {activeSegment && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setActiveSegment(null)}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
          />
        )}
      </AnimatePresence>

      {/* ── Mobile search modal ── */}
      <MobileSearchModal
        isOpen={isMobileSearchOpen}
        onClose={() => setIsMobileSearchOpen(false)}
        initialTreatment={treatment}
        initialLocation={location}
        initialTime={selectedTime}
        onApply={(data) => {
          setTreatment(data.treatment);
          setLocation(data.location);
          // data.time is either "Any time" | "Morning" | "Afternoon" | "Evening" | "HH:mm-HH:mm"
          // data.date is an ISO string OR empty
          setSelectedTime(data.time);
          if (data.date) setSelectedDate(data.date);
          const params = new URLSearchParams(searchParams.toString());
          if (data.treatment) params.set("specialty", data.treatment);
          else params.delete("specialty");
          if (data.location) params.set("city", data.location);
          else params.delete("city");
          if (data.date) params.set("date", data.date);
          else params.delete("date");
          if (data.time !== "Any time") params.set("time", data.time);
          else params.delete("time");
          router.push(`/explore?${params.toString()}`);
        }}
      />

      {/* ════════════════════════════════════════════════════════════════════════
          HEADER
      ═══════════════════════════════════════════════════════════════════════ */}
      <header
        ref={headerRef}
        className="sticky top-0 z-50 w-full bg-white border-b border-glam-blush shadow-sm"
      >
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
          {/* ── ROW 1: Logo + Nav + Profile ─────────────────────────────── */}
          <div className="flex h-14 items-center justify-between gap-4">
            {/* Logo */}
            <Link
              href="/"
              className="relative flex items-center gap-2.5 shrink-0"
            >
              <div className="relative h-8 w-8">
                <Image
                  src="/logo/logo-icon-transparent.png"
                  alt="Glamyad"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>

            {/* Desktop nav links (md+) */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-1.5 rounded-full text-sm font-bold text-glam-charcoal/60 hover:text-glam-plum hover:bg-glam-blush/40 transition-all"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right side: profile + mobile hamburger */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Profile button */}
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  aria-label="Profile menu"
                  className="flex items-center gap-2 rounded-full border border-glam-blush bg-white px-2 py-1.5 hover:shadow-md transition-all duration-200"
                >
                  <Menu size={16} className="text-glam-charcoal/60" />
                  <div className="h-7 w-7 rounded-full bg-glam-plum flex items-center justify-center text-white text-xs font-black">
                    {userInitials ?? <User size={14} />}
                  </div>
                </button>

                {/* Profile dropdown */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-3 w-60 origin-top-right rounded-2xl bg-white shadow-2xl ring-1 ring-glam-plum/10 border border-glam-blush p-1.5 z-50"
                    >
                      {isAuthenticated ? (
                        <>
                          {/* User info */}
                          <div className="px-3 py-3 mb-1 border-b border-glam-blush">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-glam-plum flex items-center justify-center text-white text-sm font-black shrink-0">
                                {userInitials}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-black text-glam-plum truncate">
                                  {user?.firstName} {user?.lastName}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {user?.email}
                                </p>
                              </div>
                            </div>
                          </div>
                          {/* Menu items */}
                          <div className="py-1">
                            <Link
                              href="/client/bookings"
                              onClick={() => setIsProfileOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-glam-charcoal hover:bg-glam-blush/40 rounded-xl transition-colors"
                            >
                              <BookOpen
                                size={16}
                                className="text-glam-charcoal/60"
                              />
                              My Bookings
                            </Link>
                            <button
                              onClick={handleSignOut}
                              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-glam-plum hover:bg-glam-blush/40 rounded-xl transition-colors"
                            >
                              <LogOut size={16} className="text-glam-plum/70" />
                              Sign out
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="py-1">
                          <Link
                            href={ROUTES.auth.login}
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-glam-charcoal hover:bg-glam-blush/40 rounded-xl transition-colors"
                          >
                            Log in
                          </Link>
                          <Link
                            href={ROUTES.auth.registerClient}
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm font-black text-glam-plum hover:bg-glam-blush/40 rounded-xl transition-colors"
                          >
                            <Sparkles size={14} className="text-glam-gold" />
                            Sign up free
                          </Link>
                          <div className="mt-1 pt-1 border-t border-glam-blush">
                            <Link
                              href={ROUTES.partnersPortal}
                              onClick={() => setIsProfileOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-glam-charcoal/40 hover:bg-glam-blush/40 rounded-xl transition-colors"
                            >
                              Partner portal ↗
                            </Link>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* ── ROW 2: Smart Search Bar ──────────────────────────────────── */}
          <div className="pb-3">
            {/* ─── Mobile pill (< md) ──────────────────────────────────── */}
            <button
              onClick={() => setIsMobileSearchOpen(true)}
              className="md:hidden w-full flex items-center gap-3 bg-white border border-glam-blush rounded-full px-4 py-2.5 shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
            >
              <div className="h-8 w-8 rounded-full bg-glam-plum/10 flex items-center justify-center shrink-0">
                <Search size={15} className="text-glam-plum" />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-xs font-black text-glam-plum truncate">
                  {treatment || "All treatments & venues"}
                </p>
                <p className="text-[10px] font-medium text-glam-charcoal/40 truncate">
                  {location || "Anywhere"} · {selectedTime}
                </p>
              </div>
              <div className="h-7 w-7 rounded-full border border-glam-blush flex items-center justify-center shrink-0">
                <MapPin size={12} className="text-glam-plum" />
              </div>
            </button>

            {/* ─── Desktop expanding search bar (md+) ─────────────────── */}
            <div
              className={cn(
                "hidden md:flex items-center bg-white border rounded-full transition-all duration-300 w-full",
                activeSegment
                  ? "border-glam-gold/30 shadow-xl ring-4 ring-glam-blush/30 bg-white"
                  : "border-glam-blush shadow-sm hover:shadow-md",
              )}
            >
              {/* ─ Treatment segment ─ */}
              <SearchSegment
                label="Treatment"
                icon={<Sparkles size={13} className="text-muted-foreground" />}
                isActive={activeSegment === "treatment"}
                onClick={() =>
                  setActiveSegment(
                    activeSegment === "treatment" ? null : "treatment",
                  )
                }
                className="flex-[1.4]"
                dropdown={
                  activeSegment === "treatment" && (
                    <TreatmentDropdown
                      searchQuery={treatment}
                      onSelect={(id) => {
                        setTreatment(id);
                        setActiveSegment("location");
                      }}
                    />
                  )
                }
              >
                <input
                  ref={treatmentInputRef}
                  type="text"
                  placeholder="All treatments"
                  value={treatment}
                  onChange={(e) => setTreatment(e.target.value)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveSegment("treatment");
                  }}
                  className="w-full border-none bg-transparent p-0 text-sm font-bold text-primary placeholder:text-muted-foreground/70 focus:outline-none focus:ring-0"
                />
              </SearchSegment>

              <Divider visible={true} />

              {/* ─ Location segment ─ */}
              <SearchSegment
                label="Location"
                icon={<MapPin size={13} className="text-muted-foreground" />}
                isActive={activeSegment === "location"}
                onClick={() =>
                  setActiveSegment(
                    activeSegment === "location" ? null : "location",
                  )
                }
                className="flex-[1.2]"
                dropdown={
                  activeSegment === "location" && (
                    <LocationDropdown
                      searchQuery={location}
                      onSelect={(city) => {
                        setLocation(city);
                        setActiveSegment("time");
                      }}
                    />
                  )
                }
              >
                <input
                  ref={locationInputRef}
                  type="text"
                  placeholder="Anywhere"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveSegment("location");
                  }}
                  className="w-full border-none bg-transparent p-0 text-sm font-bold text-primary placeholder:text-muted-foreground/70 focus:outline-none focus:ring-0"
                />
              </SearchSegment>

              <Divider visible={true} />

              {/* ─ Time segment ─ */}
              <SearchSegment
                label="When"
                icon={<Calendar size={13} className="text-muted-foreground" />}
                isActive={activeSegment === "time"}
                onClick={() =>
                  setActiveSegment(activeSegment === "time" ? null : "time")
                }
                className="flex-1"
                dropdownAlign="right"
                dropdown={
                  activeSegment === "time" && (
                    <DateTimeDropdown
                      onSelect={(date, t) => {
                        // Store ISO date and backend-ready time token separately
                        setSelectedDate(date.toISOString().split("T")[0]);
                        setSelectedTime(t);
                      }}
                    />
                  )
                }
              >
                <span
                  className={cn(
                    "text-sm font-bold truncate",
                    selectedTime === "Any time"
                      ? "text-muted-foreground/70"
                      : "text-primary",
                  )}
                >
                  {timeDisplayLabel}
                </span>
              </SearchSegment>

              {/* ─ Search button ─ */}
              <div className="p-1.5 pl-0 shrink-0">
                <button
                  onClick={handleSearch}
                  aria-label="Search"
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-full bg-glam-plum text-white font-black transition-all duration-300 active:scale-95",
                    activeSegment
                      ? "px-6 py-3 shadow-lg shadow-glam-plum/20"
                      : "h-10 w-10",
                  )}
                >
                  <Search size={activeSegment ? 18 : 16} />
                  <AnimatePresence>
                    {activeSegment && (
                      <motion.span
                        key="search-label"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="text-sm overflow-hidden whitespace-nowrap"
                      >
                        Search
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

interface SearchSegmentProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
  dropdown?: React.ReactNode;
  dropdownAlign?: "left" | "right";
  className?: string;
}

/**
 * A single pill segment of the search bar (Treatment / Location / When).
 * Renders a label + input area, and positions the dropdown panel.
 */
function SearchSegment({
  label,
  icon,
  isActive,
  onClick,
  children,
  dropdown,
  dropdownAlign = "left",
  className,
}: SearchSegmentProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative group flex flex-col justify-center px-5 py-2.5 rounded-full cursor-pointer transition-all duration-200 min-w-0",
        isActive ? "bg-white shadow-md" : "hover:bg-glam-blush/40",
        className,
      )}
    >
      {/* Label row */}
      <div className="flex items-center gap-1.5 mb-0.5">
        {icon}
        <span className="text-[10px] font-black uppercase tracking-widest text-glam-charcoal/40 group-hover:text-glam-plum/70 transition-colors">
          {label}
        </span>
      </div>

      {/* Input / value */}
      {children}

      {/* Dropdown panel */}
      <AnimatePresence>
        {dropdown && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className={cn(
              "absolute top-full z-110 mt-4",
              dropdownAlign === "right" ? "right-0" : "left-0",
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {dropdown}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Thin vertical divider between search segments */
function Divider({ visible }: { visible: boolean }) {
  return (
    <div
      className={cn(
        "h-7 w-px bg-glam-blush shrink-0 transition-opacity duration-200",
        visible ? "opacity-100" : "opacity-0",
      )}
    />
  );
}
