"use client";

import { cn } from "@/lib/utils";
import { PaymentStatus, PaymentType } from "@/types/payment.types";
import { X, Calendar as CalendarIcon, Filter } from "lucide-react";

interface PaymentFiltersProps {
  filters: {
    status?: PaymentStatus | "";
    type?: PaymentType | "";
    startDate?: string;
    endDate?: string;
  };
  onFilterChange: (filters: {
    status?: PaymentStatus | "";
    type?: PaymentType | "";
    startDate?: string;
    endDate?: string;
  }) => void;
  onClear: () => void;
}

const STATUS_OPTIONS: { label: string; value: PaymentStatus | "" }[] = [
  { label: "All Statuses", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Success", value: "success" },
  { label: "Failed", value: "failed" },
  { label: "Refunded", value: "refunded" },
];

const TYPE_OPTIONS: { label: string; value: PaymentType | "" }[] = [
  { label: "All Types", value: "" },
  { label: "Deposit", value: "deposit" },
  { label: "Full Payment", value: "full_payment" },
  { label: "Refund", value: "refund" },
];

export default function PaymentFilters({
  filters,
  onFilterChange,
  onClear,
}: PaymentFiltersProps) {
  const hasActiveFilters = Object.values(filters).some(
    (v) => v !== "" && v !== undefined,
  );

  return (
    <div
      className={cn(
        "bg-white p-6 rounded-3xl border border-secondary space-y-6 shadow-sm",
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center text-white">
            <Filter size={16} />
          </div>
          <h3 className="text-sm font-black uppercase tracking-widest text-primary">
            Filter Payments
          </h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-xs font-black uppercase tracking-widest text-primary hover:text-rose-700 transition-colors"
          >
            <X size={14} />
            Clear
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Status Filter */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                status: e.target.value as PaymentStatus | "",
              })
            }
            className="w-full h-12 px-4 rounded-2xl bg-secondary/50 border border-transparent text-sm font-bold text-primary focus:bg-white focus:border-primary transition-all outline-none appearance-none cursor-pointer"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
            Payment Type
          </label>
          <select
            value={filters.type}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                type: e.target.value as PaymentType | "",
              })
            }
            className="w-full h-12 px-4 rounded-2xl bg-secondary/50 border border-transparent text-sm font-bold text-primary focus:bg-white focus:border-primary transition-all outline-none appearance-none cursor-pointer"
          >
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
            From Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                onFilterChange({ ...filters, startDate: e.target.value })
              }
              className="w-full h-12 pl-4 pr-10 rounded-2xl bg-secondary/50 border border-transparent text-sm font-bold text-primary focus:bg-white focus:border-primary transition-all outline-none cursor-pointer"
            />
            <CalendarIcon
              size={16}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
          </div>
        </div>

        {/* End Date */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
            To Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) =>
                onFilterChange({ ...filters, endDate: e.target.value })
              }
              className="w-full h-12 pl-4 pr-10 rounded-2xl bg-secondary/50 border border-transparent text-sm font-bold text-primary focus:bg-white focus:border-primary transition-all outline-none cursor-pointer"
            />
            <CalendarIcon
              size={16}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
