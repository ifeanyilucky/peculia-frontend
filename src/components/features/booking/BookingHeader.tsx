"use client";

import { ArrowLeft, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const STEPS = ["Services", "Professional", "Time", "Confirm"];

interface BookingHeaderProps {
  currentStep: number;
}

export default function BookingHeader({ currentStep }: BookingHeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-95"
        >
          <ArrowLeft size={20} />
        </button>

        {/* Breadcrumb Navigation */}
        <nav className="hidden md:flex items-center gap-2 text-sm font-bold">
          {STEPS.map((step, index) => {
            const stepNum = index + 1;
            const isActive = stepNum === currentStep;
            const isCompleted = stepNum < currentStep;

            return (
              <div key={step} className="flex items-center">
                <span
                  className={cn(
                    "transition-colors",
                    isActive
                      ? "text-slate-900"
                      : isCompleted
                        ? "text-slate-400"
                        : "text-slate-300",
                  )}
                >
                  {step}
                </span>
                {index < STEPS.length - 1 && (
                  <span className="mx-3 text-slate-300">›</span>
                )}
              </div>
            );
          })}
        </nav>

        {/* Close Button */}
        <button
          onClick={() => router.push("/")}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-95"
        >
          <X size={20} />
        </button>
      </div>
    </header>
  );
}
