"use client";

import { useQuery } from "@tanstack/react-query";
import { paymentService } from "@/services/payment.service";
import EarningsStats from "@/components/features/payments/EarningsStats";
import PayoutsTable from "@/components/features/payments/PayoutsTable";
import {
  Loader2,
  Calendar,
  Download,
  AlertTriangle,
  CreditCard,
  Building2,
} from "lucide-react";

export default function ProviderEarningsPage() {
  const { data: earningsData, isLoading } = useQuery({
    queryKey: ["provider-earnings"],
    queryFn: () => paymentService.getProviderEarnings(),
  });

  const stats = earningsData?.stats || {
    availableBalance: 0,
    pendingBalance: 0,
    totalEarnings: 0,
    thisMonth: 0,
    growth: 0,
  };

  const payouts = earningsData?.transactions || [];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div className="space-y-2">
          <h1 className="font-peculiar text-4xl font-black text-slate-900 tracking-tight">
            Earnings
          </h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">
            Monitor your revenue and upcoming payouts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="h-14 px-6 rounded-2xl border border-slate-100 bg-white text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all flex items-center gap-2 shadow-sm">
            <Calendar size={18} />
            May 2024
          </button>
          <button className="h-14 px-8 rounded-2xl bg-slate-900 text-xs font-black uppercase tracking-widest text-white hover:bg-rose-600 transition-all flex items-center gap-2 shadow-xl shadow-slate-200">
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin text-rose-600" size={32} />
          <p className="text-sm font-black uppercase tracking-widest text-slate-400">
            Calculating accounts...
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          <EarningsStats data={stats} />

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <PayoutsTable payouts={payouts} />
            </div>

            <div className="space-y-6">
              {/* Account Details Widget */}
              <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-peculiar text-xl font-bold text-slate-900">
                    Payout Method
                  </h3>
                  <button className="text-[10px] font-black uppercase tracking-widest text-rose-600 hover:underline">
                    Edit
                  </button>
                </div>

                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-slate-400">
                      <Building2 size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Bank Account
                      </p>
                      <p className="text-sm font-bold text-slate-900">
                        Access Bank PLC
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-slate-400">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Account Number
                      </p>
                      <p className="text-sm font-bold text-slate-900">
                        0091234567
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-green-50/50 border border-green-100/50 flex items-start gap-4">
                  <CheckCircle2 className="text-green-500 shrink-0" size={18} />
                  <p className="text-xs font-medium text-green-700">
                    Your account is verified and ready for automatic payouts.
                  </p>
                </div>
              </div>

              {/* Tax Information Widget */}
              <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-rose-600">
                  <AlertTriangle size={20} />
                  <h3 className="font-peculiar text-lg font-bold">
                    Incomplete Tax Info
                  </h3>
                </div>
                <p className="text-xs font-medium text-slate-400 leading-relaxed">
                  To comply with local regulations, please provide your Tax
                  Identification Number (TIN).
                </p>
                <button className="w-full py-4 rounded-2xl bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all">
                  Complete Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Inline sub-component for consistency
function CheckCircle2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
