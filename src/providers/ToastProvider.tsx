"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sileo";

export function ToastProvider() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const options = isDark
    ? {
        fill: "#FFFFFF",
        styles: {
          title: "text-slate-900!",
          description: "text-slate-600!",
          badge: "bg-slate-100!",
          button: "bg-slate-100! hover:bg-slate-200!",
        },
      }
    : {
        fill: "#171717",
        styles: {
          title: "text-white!",
          description: "text-white/75!",
          badge: "bg-white/10!",
          button: "bg-white/10! hover:bg-white/15!",
        },
      };

  return <Toaster position="top-center" options={options} />;
}
