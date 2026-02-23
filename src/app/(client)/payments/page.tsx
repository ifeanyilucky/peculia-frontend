"use client";

import { useQuery } from "@tanstack/react-query";
import { paymentService } from "@/services/payment.service";
import PaymentHistoryTable from "@/components/features/payments/PaymentHistoryTable";
import { Loader2, Receipt, Download, Filter } from "lucide-react";

export default function PaymentsPage() {
  const { data: payments, isLoading } = useQuery({
    queryKey: ["payments", "client"],
    queryFn: () => paymentService.getPaymentHistory({ limit: 20 }),
  });

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div className="space-y-2">
          <h1 className="font-peculiar text-4xl font-black text-slate-900">
            Payments
          </h1>
          <p className="text-lg text-slate-500 font-medium">
            Track your deposits, session payments, and refunds.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 h-12 px-6 rounded-2xl bg-white border border-slate-100 text-xs font-black uppercase tracking-widest text-slate-500 hover:border-slate-900 transition-all shadow-sm">
            <Download size={16} />
            Export CSV
          </button>
          <button className="flex items-center justify-center h-12 w-12 rounded-2xl bg-slate-900 text-white shadow-xl shadow-slate-200 hover:bg-rose-600 transition-all">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <Loader2 className="animate-spin text-rose-600" size={40} />
            <p className="text-sm font-black uppercase tracking-widest text-slate-400">
              Loading transactions...
            </p>
          </div>
        ) : payments?.results?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-100 italic text-slate-400">
            <Receipt size={48} className="mb-4 opacity-10" />
            <p className="text-lg font-medium">No payment history found.</p>
            <p className="text-sm mt-1">
              Transactions will appear once you make your first booking.
            </p>
          </div>
        ) : (
          <PaymentHistoryTable payments={payments?.results || []} />
        )}
      </div>
    </div>
  );
}
