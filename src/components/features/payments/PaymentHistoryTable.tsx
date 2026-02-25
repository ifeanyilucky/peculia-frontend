"use client";

import { Payment } from "@/types/payment.types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import DataTable, { ColumnDef } from "@/components/ui/DataTable";
import {
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";

interface PaymentHistoryTableProps {
  payments: Payment[];
}

const statusConfig = {
  success: {
    label: "Success",
    color: "text-green-600 bg-green-50",
    icon: CheckCircle2,
  },
  failed: {
    label: "Failed",
    color: "text-rose-600 bg-rose-50",
    icon: XCircle,
  },
  pending: {
    label: "Pending",
    color: "text-amber-600 bg-amber-50",
    icon: Clock,
  },
  refunded: {
    label: "Refunded",
    color: "text-blue-600 bg-blue-50",
    icon: ArrowDownLeft,
  },
};

export default function PaymentHistoryTable({
  payments,
}: PaymentHistoryTableProps) {
  const columns: ColumnDef<Payment>[] = [
    {
      header: "Date",
      className: "px-8",
      cell: (item) => (
        <div>
          <p className="font-bold text-slate-900 leading-tight">
            {format(new Date(item.createdAt), "MMM d, yyyy")}
          </p>
          <p className="text-[10px] font-bold text-slate-400 mt-1">
            {format(new Date(item.createdAt), "h:mm a")}
          </p>
        </div>
      ),
    },
    {
      header: "Transaction",
      className: "px-8",
      cell: (item) => (
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
              item.type === "refund"
                ? "bg-blue-50 text-blue-600"
                : "bg-slate-900 text-white",
            )}
          >
            {item.type === "refund" ? (
              <ArrowDownLeft size={18} />
            ) : (
              <ArrowUpRight size={18} />
            )}
          </div>
          <div>
            <p className="font-bold text-slate-900 capitalize leading-tight">
              {item.type.replace("_", " ")}
            </p>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
              Via {item.gateway}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Reference",
      className: "px-8",
      cell: (item) => (
        <span className="font-mono text-xs text-slate-400 border border-slate-100 px-3 py-1.5 rounded-lg bg-slate-50">
          {item.paymentRef}
        </span>
      ),
    },
    {
      header: "Amount",
      className: "px-8",
      cell: (item) => (
        <p
          className={cn(
            "font-peculiar text-lg font-black leading-tight",
            item.type === "refund"
              ? "text-blue-600"
              : "text-slate-900",
          )}
        >
          {item.type === "refund" ? "+" : "-"} ₦
          {(item.amount / 100).toLocaleString()}
        </p>
      ),
    },
    {
      header: "Status",
      className: "px-8 text-center",
      cell: (item) => {
        const config = statusConfig[item.status] || statusConfig.pending;
        const Icon = config.icon;
        return (
          <div className="flex justify-center">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                config.color,
              )}
            >
              <Icon size={12} strokeWidth={3} />
              {config.label}
            </span>
          </div>
        );
      },
    },
  ];

  return <DataTable columns={columns} data={payments} />;
}
