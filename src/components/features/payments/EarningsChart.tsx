"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { TrendingUp, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const DATA = [
  { name: "Mon", total: 12500 },
  { name: "Tue", total: 18000 },
  { name: "Wed", total: 15400 },
  { name: "Thu", total: 22000 },
  { name: "Fri", total: 28500 },
  { name: "Sat", total: 32000 },
  { name: "Sun", total: 14000 },
];

export default function EarningsChart() {
  const [view, setView] = useState<"weekly" | "monthly">("weekly");

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-8 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="font-peculiar text-xl font-bold text-slate-900">
            Revenue Analytics
          </h3>
          <p className="text-xs font-medium text-slate-400 mt-1">
            Daily earnings performance for this week.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-50 rounded-xl">
          <button
            onClick={() => setView("weekly")}
            className={cn(
              "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
              view === "weekly"
                ? "bg-white text-slate-900 border border-slate-200"
                : "text-slate-400 hover:text-slate-600",
            )}
          >
            Weekly
          </button>
          <button
            onClick={() => setView("monthly")}
            className={cn(
              "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
              view === "monthly"
                ? "bg-white text-slate-900 border border-slate-200"
                : "text-slate-400 hover:text-slate-600",
            )}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={DATA}
            margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 900 }}
              dy={15}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 900 }}
              tickFormatter={(value) => `₦${value / 1000}k`}
            />
            <Tooltip
              cursor={{ fill: "#f8fafc" }}
              contentStyle={{
                borderRadius: "16px",
                border: "none",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                padding: "12px",
              }}
              labelStyle={{
                fontWeight: "black",
                marginBottom: "4px",
                fontSize: "12px",
              }}
              itemStyle={{
                fontWeight: "bold",
                color: "#e11d48",
                fontSize: "14px",
              }}
              formatter={(value: number | undefined) =>
                value !== undefined
                  ? [`₦${value.toLocaleString()}`, "Earnings"]
                  : ["₦0", "Earnings"]
              }
            />
            <Bar dataKey="total" radius={[10, 10, 10, 10]} barSize={32}>
              {DATA.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === DATA.length - 2 ? "#e11d48" : "#0f172a"}
                  className="transition-all duration-300 hover:opacity-80"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-rose-600" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Peak Day: Friday
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-green-600 font-bold text-xs">
          <TrendingUp size={14} />
          <span>+12.5% vs last week</span>
        </div>
      </div>
    </div>
  );
}
