"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Bookmark,
  UserCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";

const NAV_ITEMS = [
  { label: "Home", href: ROUTES.client.dashboard, icon: LayoutDashboard },
  { label: "Bookings", href: ROUTES.client.bookings, icon: CalendarDays },
  { label: "Saved", href: "/saved", icon: Bookmark },
  { label: "Profile", href: "/profile", icon: UserCircle2 },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-white/90 backdrop-blur-xl border-t border-slate-100 px-6 flex items-center justify-between z-50 pb-safe">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1.5 transition-all duration-300 px-4",
              isActive ? "text-rose-600 scale-110" : "text-slate-400",
            )}
          >
            <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-black uppercase tracking-widest">
              {item.label}
            </span>
            {isActive && (
              <div className="absolute -top-2 h-1 w-6 rounded-full bg-rose-600 shadow-[0_0_12px_rgba(225,29,72,0.4)]" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
