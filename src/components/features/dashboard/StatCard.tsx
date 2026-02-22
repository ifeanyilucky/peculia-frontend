"use client";

import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isUp: boolean;
  };
  color?: "rose" | "blue" | "green" | "amber";
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  color = "rose",
}: StatCardProps) {
  const colorMap = {
    rose: "bg-rose-50 text-rose-600",
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="group p-8 rounded-[2.5rem] bg-white border border-slate-100 hover:border-slate-900 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-slate-200/50">
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "p-4 rounded-2xl transition-transform group-hover:scale-110",
            colorMap[color],
          )}
        >
          <Icon size={24} />
        </div>
        {trend && (
          <div
            className={cn(
              "flex items-center gap-0.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
              trend.isUp
                ? "bg-green-50 text-green-600"
                : "bg-rose-50 text-rose-600",
            )}
          >
            {trend.isUp ? (
              <ArrowUpRight size={12} />
            ) : (
              <ArrowDownRight size={12} />
            )}
            {trend.value}%
          </div>
        )}
      </div>

      <div className="mt-6 space-y-1">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          {label}
        </p>
        <p className="font-peculiar text-4xl font-black text-slate-900">
          {value}
        </p>
      </div>
    </div>
  );
}
