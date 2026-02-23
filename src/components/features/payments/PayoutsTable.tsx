"use client";

import { format, parseISO } from "date-fns";
import {
  ArrowDownToLine,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  MoreVertical,
  Banknote,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PayoutsTableProps {
  payouts: any[];
}

export default function PayoutsTable({ payouts }: PayoutsTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
      <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h3 className="font-peculiar text-xl font-bold text-slate-900">
            Transaction History
          </h3>
          <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-widest">
            Recent payments and withdrawals
          </p>
        </div>

        <div className="flex gap-3">
          <div className="relative group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-slate-900 transition-colors"
              size={16}
            />
            <input
              type="text"
              placeholder="Search..."
              className="h-12 w-48 bg-white border border-slate-100 rounded-2xl pl-11 pr-4 text-xs font-bold outline-none focus:border-slate-900 transition-all shadow-sm"
            />
          </div>
          <button className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-slate-900 transition-all shadow-sm">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-8 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">
                Date
              </th>
              <th className="px-8 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">
                Reference
              </th>
              <th className="px-8 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">
                Type
              </th>
              <th className="px-8 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">
                Status
              </th>
              <th className="px-8 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">
                Amount
              </th>
              <th className="px-8 py-4 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {payouts.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-20 text-center">
                  <div className="h-16 w-16 mx-auto rounded-full bg-slate-50 flex items-center justify-center text-slate-200 mb-4">
                    <Banknote size={32} />
                  </div>
                  <p className="text-sm font-medium text-slate-400">
                    No transactions found.
                  </p>
                </td>
              </tr>
            ) : (
              payouts.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="group hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-slate-900">
                      {format(parseISO(transaction.createdAt), "MMM d, yyyy")}
                    </p>
                    <p className="text-xs text-slate-400 font-medium">
                      {format(parseISO(transaction.createdAt), "hh:mm a")}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <code className="px-2 py-1 rounded bg-slate-100 text-[10px] font-black text-xs text-slate-500 uppercase">
                      {transaction.reference.substring(0, 10)}...
                    </code>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      {transaction.type === "withdrawal" ? (
                        <ArrowDownToLine size={14} className="text-rose-600" />
                      ) : (
                        <CheckCircle2 size={14} className="text-green-600" />
                      )}
                      <span className="text-xs font-black uppercase tracking-widest text-slate-900">
                        {transaction.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                        transaction.status === "completed" ||
                          transaction.status === "success"
                          ? "bg-green-50 text-green-600"
                          : transaction.status === "pending"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-rose-50 text-rose-600",
                      )}
                    >
                      {transaction.status === "pending" ? (
                        <Clock size={12} />
                      ) : transaction.status === "failed" ? (
                        <XCircle size={12} />
                      ) : (
                        <CheckCircle2 size={12} />
                      )}
                      {transaction.status}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <p
                      className={cn(
                        "text-sm font-black",
                        transaction.type === "withdrawal"
                          ? "text-rose-600"
                          : "text-slate-900",
                      )}
                    >
                      {transaction.type === "withdrawal" ? "-" : "+"}₦
                      {(transaction.amount / 100).toLocaleString()}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <button className="p-2 rounded-xl text-slate-300 hover:text-slate-900 hover:bg-white transition-all">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
