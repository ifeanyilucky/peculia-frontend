"use client";

import { useAuthStore } from "@/store/auth.store";
import StatCard from "@/components/features/dashboard/StatCard";
import UpcomingBookingsList from "@/components/features/bookings/UpcomingBookingsList";
import EarningsChart from "@/components/features/payments/EarningsChart";
import {
  CalendarCheck2,
  Banknote,
  Users,
  Star,
  ArrowRight,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ProviderDashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div className="space-y-2">
          <h1 className="font-outfit text-4xl font-black text-slate-900 tracking-tight">
            Professional Overview
          </h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">
            Welcome back, {user?.firstName}. Here is what is happening today.
          </p>
        </div>

        <Link
          href="/provider/availability"
          className="inline-flex items-center gap-2 rounded-2xl bg-white border border-slate-100 px-6 py-3.5 text-xs font-black uppercase tracking-widest text-slate-900 hover:border-slate-900 transition-all shadow-sm"
        >
          Manage Availability
          <ChevronRight size={14} />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Today's Bookings"
          value="8"
          icon={CalendarCheck2}
          trend={{ value: 12, isUp: true }}
          color="rose"
        />
        <StatCard
          label="This Month"
          value="₦245k"
          icon={Banknote}
          trend={{ value: 8, isUp: true }}
          color="green"
        />
        <StatCard
          label="Total Clients"
          value="152"
          icon={Users}
          trend={{ value: 5, isUp: true }}
          color="blue"
        />
        <StatCard
          label="Avg Rating"
          value="4.9"
          icon={Star}
          trend={{ value: 0.2, isUp: true }}
          color="amber"
        />
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Left Column: Agenda & Analytics */}
        <div className="lg:col-span-2 space-y-10">
          <UpcomingBookingsList />
          <EarningsChart />
        </div>

        {/* Right Column: Recent Reviews */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-outfit text-xl font-bold text-slate-900">
              Recent Reviews
            </h3>
            <MessageSquare size={20} className="text-slate-300" />
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm space-y-8">
            {[
              {
                id: "1",
                author: "Sarah J.",
                rating: 5,
                comment:
                  "Absolutely amazing service! My hair has never looked better. Highly recommend to everyone!",
                date: "2 hours ago",
                avatar: null,
              },
              {
                id: "2",
                author: "Michael K.",
                rating: 4,
                comment:
                  "Great experience overall. The attention to detail was impressive. Will definitely be back.",
                date: "Yesterday",
                avatar: null,
              },
            ].map((review) => (
              <div key={review.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 font-bold">
                      {review.author[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {review.author}
                      </p>
                      <p className="text-[10px] font-medium text-slate-400">
                        {review.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star size={12} fill="currentColor" />
                    <span className="text-xs font-black">
                      {review.rating}.0
                    </span>
                  </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed font-medium line-clamp-2 italic">
                  &quot;{review.comment}&quot;
                </p>
              </div>
            ))}

            <Link
              href="/provider/profile#reviews"
              className="group flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-slate-50 text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-slate-900 hover:text-white transition-all underline-offset-4"
            >
              See All Reviews
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
