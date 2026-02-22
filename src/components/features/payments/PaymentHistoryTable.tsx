"use client";

import { Payment } from "@/types/payment.types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";

interface PaymentHistoryTableProps {
  payments: Payment[];
}

export default function PaymentHistoryTable({
  payments,
}: PaymentHistoryTableProps) {
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

  return (
    <div className="overflow-x-auto rounded-[2.5rem] bg-white border border-slate-100 shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-50 uppercase text-[10px] font-black tracking-widest text-slate-400">
            <th className="px-8 py-6">Date</th>
            <th className="px-8 py-6">Transaction</th>
            <th className="px-8 py-6">Reference</th>
            <th className="px-8 py-6">Amount</th>
            <th className="px-8 py-6 text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => {
            const config = statusConfig[payment.status] || statusConfig.pending;
            const Icon = config.icon;

            return (
              <tr
                key={payment.id}
                className="group hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
              >
                <td className="px-8 py-6">
                  <p className="font-bold text-slate-900 leading-tight">
                    {format(new Date(payment.createdAt), "MMM d, yyyy")}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 mt-1">
                    {format(new Date(payment.createdAt), "h:mm a")}
                  </p>
                </td>

                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                        payment.type === "refund"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-slate-900 text-white",
                      )}
                    >
                      {payment.type === "refund" ? (
                        <ArrowDownLeft size={18} />
                      ) : (
                        <ArrowUpRight size={18} />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 capitalize leading-tight">
                        {payment.type.replace("_", " ")}
                      </p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
                        Via {payment.gateway}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-8 py-6">
                  <span className="font-mono text-xs text-slate-400 border border-slate-100 px-3 py-1.5 rounded-lg bg-slate-50">
                    {payment.paymentRef}
                  </span>
                </td>

                <td className="px-8 py-6">
                  <p
                    className={cn(
                      "font-outfit text-lg font-black leading-tight",
                      payment.type === "refund"
                        ? "text-blue-600"
                        : "text-slate-900",
                    )}
                  >
                    {payment.type === "refund" ? "+" : "-"} ₦
                    {(payment.amount / 100).toLocaleString()}
                  </p>
                </td>

                <td className="px-8 py-6">
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
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
