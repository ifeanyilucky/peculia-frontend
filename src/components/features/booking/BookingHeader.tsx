"use client";

import { ArrowLeft, X } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { useBookingStore } from "@/store/booking.store";
import { cn } from "@/lib/utils";
import CenterModal from "@/components/common/CenterModal";

const STEPS = ["Services", "Professional", "Time", "Confirm"];

interface BookingHeaderProps {
  currentStep: number;
}

export default function BookingHeader({ currentStep }: BookingHeaderProps) {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;
  const { selectedProvider, selectedServices, resetBookingFlow } = useBookingStore();
  const [showExitModal, setShowExitModal] = useState(false);

  // Use slug from params or from selectedProvider
  const providerSlug = slug || selectedProvider?.slug;

  const getStepPath = (stepIndex: number) => {
    const paths = ["services", "professional", "time", "confirm"];
    return `/book/${providerSlug}/${paths[stepIndex]}`;
  };

  const handleExitAttempt = () => {
    if (currentStep === 1) {
      if (selectedServices.length > 0) {
        setShowExitModal(true);
      } else {
        router.push(`/providers/${providerSlug}`);
      }
    } else {
      router.push(getStepPath(currentStep - 2));
    }
  };

  const handleConfirmExit = () => {
    resetBookingFlow();
    router.push(`/providers/${providerSlug}`);
  };

  const handleStepClick = (stepIndex: number) => {
    const stepNum = stepIndex + 1;
    if (stepNum < currentStep || (stepNum === 1 && currentStep !== 1)) {
      router.push(getStepPath(stepIndex));
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={handleExitAttempt}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-95"
          >
            <ArrowLeft size={20} />
          </button>

          <nav className="hidden md:flex items-center gap-2 text-sm font-bold">
            {STEPS.map((step, index) => {
              const stepNum = index + 1;
              const isActive = stepNum === currentStep;
              const isCompleted = stepNum < currentStep;
              const isClickable = isCompleted || stepNum !== currentStep;

              return (
                <div key={step} className="flex items-center">
                  <button
                    onClick={() => handleStepClick(index)}
                    disabled={!isClickable && !isCompleted}
                    className={cn(
                      "transition-all hover:opacity-80 active:scale-95 disabled:opacity-100 disabled:scale-100",
                      isActive
                        ? "text-slate-900"
                        : isCompleted
                          ? "text-slate-400"
                          : "text-slate-300",
                      (isCompleted || isActive) && "cursor-pointer",
                      !isCompleted && !isActive && "cursor-default",
                    )}
                  >
                    {step}
                  </button>
                  {index < STEPS.length - 1 && (
                    <span className="mx-3 text-slate-300">›</span>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Close Button */}
          <button
            onClick={() => setShowExitModal(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-95"
          >
            <X size={20} />
          </button>
        </div>
      </header>

      <CenterModal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        title="Are you sure you want to exit?"
        description="Your booking isn't complete and any progress will be lost."
      >
        <div className="flex flex-col gap-3">
          <button
            onClick={handleConfirmExit}
            className="w-full h-14 rounded-full bg-slate-900 text-sm font-black text-white hover:bg-slate-800 transition-all active:scale-[0.98]"
          >
            Yes, exit
          </button>
          <button
            onClick={() => setShowExitModal(false)}
            className="w-full h-14 rounded-full border border-slate-200 bg-white text-sm font-black text-slate-900 hover:bg-slate-50 transition-all active:scale-[0.98]"
          >
            Close
          </button>
        </div>
      </CenterModal>
    </>
  );
}
