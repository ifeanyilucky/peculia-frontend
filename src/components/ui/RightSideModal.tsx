"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface RightSideModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function RightSideModal({
  isOpen,
  onClose,
  title,
  children,
  className,
}: RightSideModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Defers state update to resolve React warning about sync setState in effect
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-9998 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 m-0"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sliding Panel */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-9999 w-full md:w-[480px] bg-white transition-transform duration-500 ease-in-out flex flex-col border border-slate-200",
          isOpen ? "translate-x-0" : "translate-x-full",
          className,
        )}
      >
        {/* Header */}
        {(title || !!onClose) && (
          <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white">
            <h2 className="text-xl font-bold font-peculiar text-slate-900">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-50 transition-colors text-slate-400 hover:text-slate-900"
              aria-label="Close panel"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar">{children}</div>
      </div>
    </>
  );
}
