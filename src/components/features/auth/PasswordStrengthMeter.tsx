"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PasswordStrengthMeterProps {
  password?: string;
}

export const PasswordStrengthMeter = ({
  password = "",
}: PasswordStrengthMeterProps) => {
  const calculateStrength = (pass: string) => {
    let strength = 0;
    if (pass.length === 0) return 0;
    if (pass.length >= 8) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;
    return strength;
  };

  const strength = calculateStrength(password);

  const levels = [
    { label: "Too weak", color: "bg-slate-200" },
    { label: "Weak", color: "bg-red-500" },
    { label: "Fair", color: "bg-yellow-500" },
    { label: "Good", color: "bg-blue-500" },
    { label: "Strong", color: "bg-green-500" },
  ];

  return (
    <div className="mt-2 w-full">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors duration-300",
              level <= strength ? levels[strength].color : "bg-slate-200",
            )}
          />
        ))}
      </div>
      {password && (
        <p
          className={cn(
            "mt-1 text-xs font-medium",
            strength <= 1
              ? "text-red-500"
              : strength === 2
                ? "text-yellow-600"
                : strength === 3
                  ? "text-blue-600"
                  : "text-green-600",
          )}
        >
          {levels[strength].label}
        </p>
      )}
    </div>
  );
};
