"use client";

import Link from "next/link";
import { Sparkles, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-900 text-white mb-8 animate-bounce border border-slate-200">
        <Sparkles size={40} />
      </div>

      <h1 className="font-peculiar text-7xl font-black text-slate-900er mb-4">
        404
      </h1>

      <div className="max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Page not found</h2>
        <p className="text-slate-500 font-medium leading-relaxed">
          Oops! The professional you're looking for might have moved, or the
          link is broken. Let's get you back on track.
        </p>
      </div>

      <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
        <Link
          href="/"
          className="h-14 px-8 rounded-2xl bg-slate-900 text-xs font-black uppercase tracking-widest text-white hover:bg-rose-600 transition-all flex items-center gap-2 border border-slate-200"
        >
          <Home size={18} />
          Back to Home
        </Link>
        <button
          onClick={() => window.history.back()}
          className="h-14 px-8 rounded-2xl bg-white border border-slate-200 text-xs font-black uppercase tracking-widest text-slate-900 hover:border-slate-900 transition-all flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Go Back
        </button>
      </div>

      <div className="mt-20 pt-8 border-t border-slate-200/60 w-full max-w-xs">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Peculia Professional Booking
        </p>
      </div>
    </div>
  );
}
