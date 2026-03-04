"use client";

import {
  Banknote,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EarningsStatsProps {
  data: {
    availableBalance: number;
    pendingBalance: number;
    totalEarnings: number;
    thisMonth: number;
    growth: number;
  };
}

export default function EarningsStats({ data }: EarningsStatsProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {/* Main Balance Card */}
      <div className="lg:col-span-1 p-8 rounded-2xl bg-glam-plum text-white border border-glam-blush">
        <div className="flex items-center justify-between mb-8">
          <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
            <Wallet className="text-white" size={24} />
          </div>
          <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-widest border border-green-500/20">
            Available
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
            Current Balance
          </p>
          <p className="font-peculiar text-5xl font-black">
            ₦{(data.availableBalance / 100).toLocaleString()}
          </p>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/30">
              Auto-payout
            </p>
            <p className="text-xs font-bold">Every Monday</p>
          </div>
          <button className="px-4 py-2 rounded-xl bg-white text-glam-plum text-[10px] font-black uppercase tracking-widest hover:bg-glam-plum hover:text-white transition-all">
            Withdraw
          </button>
        </div>
      </div>

      {/* Pending Earnings */}
      <div className="p-8 rounded-2xl bg-white border border-glam-blush flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center">
            <Clock className="text-amber-600" size={24} />
          </div>
          <div className="flex items-center gap-1.5 text-amber-600 text-[10px] font-black uppercase tracking-widest">
            Pending Clear
          </div>
        </div>

        <div className="mt-8 space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Escrow Balance
          </p>
          <p className="font-peculiar text-4xl font-black text-glam-plum">
            ₦{(data.pendingBalance / 100).toLocaleString()}
          </p>
          <p className="text-xs font-medium text-muted-foreground mt-2">
            Cleared within 48h of completion.
          </p>
        </div>
      </div>

      {/* Month Summary */}
      <div className="p-8 rounded-2xl bg-white border border-glam-blush flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="h-12 w-12 rounded-2xl bg-glam-blush flex items-center justify-center">
            <TrendingUp className="text-glam-plum" size={24} />
          </div>
          <div
            className={cn(
              "flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
              data.growth >= 0
                ? "bg-green-50 text-green-600"
                : "bg-glam-blush text-glam-plum",
            )}
          >
            {data.growth >= 0 ? (
              <ArrowUpRight size={12} />
            ) : (
              <ArrowDownRight size={12} />
            )}
            {Math.abs(data.growth)}%
          </div>
        </div>

        <div className="mt-8 space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Total This Month
          </p>
          <p className="font-peculiar text-4xl font-black text-glam-plum">
            ₦{(data.thisMonth / 100).toLocaleString()}
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-glam-plum">
            <CheckCircle2 size={12} className="text-green-500" />
            <span>Target: ₦500k</span>
          </div>
        </div>
      </div>
    </div>
  );
}
