"use client";

import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import CenterModal from "@/components/common/CenterModal";

const STEPS = ["Professional", "Time", "Confirm"];

interface RescheduleLayoutProps {
  children: React.ReactNode;
}

export default function RescheduleLayout({ children }: RescheduleLayoutProps) {
  const router = useRouter();
  const params = useParams();
  const bookingId = params?.bookingId as string;
  const currentStep = parseInt(params?.step as string) || 1;
  const [showExitModal, setShowExitModal] = useState(false);

  const handleBack = () => {
    if (currentStep > 1) {
      const prevSteps = ["professional", "time", "confirm"];
      router.push(`/appointments/${bookingId}/reschedule/${prevSteps[currentStep - 2]}`);
    } else {
      router.push("/bookings");
    }
  };

  const handleExit = () => {
    router.push("/bookings");
  };

  return (
    <>
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
          <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-95"
            >
              <ArrowLeft size={20} />
            </button>

            <nav className="hidden md:flex items-center gap-2 text-sm font-bold">
              {STEPS.map((step, index) => {
                const stepNum = index + 1;
                const isActive = stepNum === currentStep;
                const isCompleted = stepNum < currentStep;

                return (
                  <div key={step} className="flex items-center">
                    <button
                      onClick={() => isCompleted && router.push(`/appointments/${bookingId}/reschedule/${["professional", "time", "confirm"][index]}`)}
                      disabled={!isCompleted}
                      className={cn(
                        "transition-all hover:opacity-80 active:scale-95 disabled:opacity-100 disabled:scale-100",
                        isActive
                          ? "text-slate-900"
                          : isCompleted
                            ? "text-slate-400 cursor-pointer"
                            : "text-slate-300 cursor-default",
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

        <main className="flex-1">
          {children}
        </main>
      </div>

      <CenterModal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        title="Cancel Reschedule?"
        description="Are you sure you want to cancel rescheduling this appointment?"
      >
        <div className="flex flex-col gap-3">
          <button
            onClick={handleExit}
            className="w-full h-14 rounded-full bg-rose-600 text-sm font-black text-white hover:bg-rose-700 transition-all active:scale-[0.98]"
          >
            Yes, cancel
          </button>
          <button
            onClick={() => setShowExitModal(false)}
            className="w-full h-14 rounded-full border border-slate-200 bg-white text-sm font-black text-slate-900 hover:bg-slate-50 transition-all active:scale-[0.98]"
          >
            Continue rescheduling
          </button>
        </div>
      </CenterModal>
    </>
  );
}
