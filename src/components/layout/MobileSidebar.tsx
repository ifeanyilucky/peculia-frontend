"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Bookmark,
  UserCircle2,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import { ROUTES } from "@/constants/routes";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { label: "Dashboard", href: ROUTES.client.dashboard, icon: LayoutDashboard },
  {
    label: "My Appointments",
    href: ROUTES.client.bookings,
    icon: CalendarDays,
  },
  { label: "Saved Professionals", href: "/saved", icon: Bookmark },
  { label: "My Profile", href: "/profile", icon: UserCircle2 },
];

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-100 bg-primary/40 backdrop-blur-sm lg:hidden"
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-110 w-72 bg-white flex flex-col border-r border-secondary lg:hidden shadow-2xl"
          >
            <div className="flex items-center justify-between px-6 p-8">
              <Link href="/" className="relative h-10 w-32" onClick={onClose}>
                <Image
                  src="/logo/logo.png"
                  alt="Glamyad"
                  fill
                  className="object-contain"
                  priority
                />
              </Link>
              <button
                onClick={onClose}
                className="p-2 rounded-2xl bg-secondary/50 text-primary hover:bg-secondary transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 space-y-1.5 px-4 mt-4">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "group flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all duration-300",
                      isActive
                        ? "bg-primary text-white border border-primary"
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-primary",
                    )}
                  >
                    <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 mt-auto">
              <button
                onClick={() => {
                  clearAuth();
                  onClose();
                }}
                className="flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-sm font-bold text-primary transition-all hover:bg-secondary/50 hover:text-accent"
              >
                <LogOut size={20} />
                Sign Out
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
