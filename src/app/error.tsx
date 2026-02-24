"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Runtime Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 shadow-2xl shadow-rose-100 mb-8">
        <AlertCircle size={40} />
      </div>

      <h1 className="font-peculiar text-4xl font-black text-slate-900 mb-4">
        Something went wrong
      </h1>

      <div className="max-w-md space-y-4">
        <p className="text-slate-500 font-medium leading-relaxed">
          We encountered an unexpected error. Don't worry, our team has been
          notified. You can try refreshing the page or head back home.
        </p>
        {error.digest && (
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
            Error ID: {error.digest}
          </p>
        )}
      </div>

      <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={() => reset()}
          className="h-14 px-8 rounded-2xl bg-slate-900 text-xs font-black uppercase tracking-widest text-white hover:bg-rose-600 transition-all shadow-xl shadow-slate-200 flex items-center gap-2"
        >
          <RotateCcw size={18} />
          Try Again
        </button>
        <Link
          href="/"
          className="h-14 px-8 rounded-2xl bg-white border border-slate-200 text-xs font-black uppercase tracking-widest text-slate-900 hover:border-slate-900 transition-all flex items-center gap-2"
        >
          <Home size={18} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
