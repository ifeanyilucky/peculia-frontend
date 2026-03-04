"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface CenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  maxWidth?: string;
}

export default function CenterModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = "max-w-sm",
}: CenterModalProps) {
  // Prevent scroll when modal is open
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-glam-plum/40 backdrop-blur-sm animate-in fade-in duration-300 p-6">
      <div
        className={cn(
          "bg-white w-full rounded-[32px] animate-in zoom-in-95 duration-300 overflow-hidden relative focus:outline-none border border-glam-blush",
          maxWidth,
        )}
      >
        {/* Close Button Container - Ensures X is above and separate from title */}
        <div className="flex justify-end pt-6 pr-6">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 transition-all text-muted-foreground hover:text-glam-plum active:scale-95"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-10 pb-10 pt-2 text-center">
          {title && (
            <h3 className="font-peculiar text-2xl font-black text-glam-plum leading-tight mb-4">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm font-medium text-muted-foreground leading-relaxed mb-10">
              {description}
            </p>
          )}

          {children}
        </div>
      </div>
    </div>
  );
}
