"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Sparkles,
  Scissors,
  Clock,
  Briefcase,
  BarChart3,
  UserCircle2,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import { ROUTES } from "@/constants/routes";

const NAV_ITEMS = [
  { label: "Overview", href: ROUTES.provider.dashboard, icon: LayoutDashboard },
  { label: "Bookings", href: ROUTES.provider.bookings, icon: CalendarDays },
  { label: "My Services", href: ROUTES.provider.services, icon: Scissors },
  { label: "Availability", href: ROUTES.provider.availability, icon: Clock },
  { label: "Portfolio", href: ROUTES.provider.portfolio, icon: Briefcase },
  { label: "Earnings", href: ROUTES.provider.earnings, icon: BarChart3 },
  { label: "Settings", href: ROUTES.provider.settings, icon: UserCircle2 },
];

export default function ProviderSidebar() {
  const pathname = usePathname();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return (
    <aside className="hidden lg:flex h-screen w-72 flex-col border-r border-slate-100 bg-white sticky top-0">
      <div className="flex items-center gap-2 px-8 py-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-200">
          <Sparkles size={24} />
        </div>
        <span className="font-peculiar text-2xl font-black text-slate-900">
          Peculia.
        </span>
      </div>

      <nav className="flex-1 space-y-1.5 px-4 mt-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all duration-300",
                isActive
                  ? "bg-slate-900 text-white shadow-xl shadow-slate-200"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
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
          onClick={() => clearAuth()}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-sm font-bold text-rose-500 transition-all hover:bg-rose-50 hover:text-rose-600"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
