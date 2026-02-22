"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingStepNavProps {
  steps: string[];
  currentStep: number;
}

export default function BookingStepNav({
  steps,
  currentStep,
}: BookingStepNavProps) {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <div className="flex items-center justify-between relative">
        {/* Background Line */}
        <div className="absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2 bg-slate-100" />

        {/* Progress Line */}
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-rose-600 transition-all duration-500 -translate-y-1/2"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        />

        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isActive = currentStep === stepNumber;

          return (
            <div key={label} className="relative flex flex-col items-center">
              <div
                className={cn(
                  "z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300",
                  isCompleted
                    ? "bg-rose-600 border-rose-600 text-white"
                    : isActive
                      ? "bg-white border-rose-600 text-rose-600 scale-110 shadow-lg shadow-rose-100"
                      : "bg-white border-slate-200 text-slate-400",
                )}
              >
                {isCompleted ? (
                  <Check size={20} strokeWidth={3} />
                ) : (
                  <span className="text-sm font-bold">{stepNumber}</span>
                )}
              </div>

              <span
                className={cn(
                  "absolute top-12 whitespace-nowrap text-xs font-bold uppercase tracking-widest transition-colors duration-300",
                  isActive
                    ? "text-rose-600"
                    : isCompleted
                      ? "text-slate-900"
                      : "text-slate-400",
                )}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
