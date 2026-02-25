"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { providerService } from "@/services/provider.service";
import { useAuthStore } from "@/store/auth.store";
import { sileo } from "sileo";
import { useRouter } from "next/navigation";

interface SaveButtonProps {
  providerId: string;
  initialIsSaved?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function SaveButton({
  providerId,
  initialIsSaved = false,
  size = "md",
}: SaveButtonProps) {
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    setIsLoading(true);
    try {
      if (isSaved) {
        await providerService.unsaveProvider(providerId);
        setIsSaved(false);
        sileo.show({
          title: "Removed from saved",
          description: "Provider removed from your saved list",
          button: {
            title: "Undo",
            onClick: () => {
              providerService.saveProvider(providerId);
              setIsSaved(true);
            },
          },
        });
      } else {
        await providerService.saveProvider(providerId);
        setIsSaved(true);
        sileo.show({
          title: "Saved!",
          description: "Provider added to your saved list",
          button: {
            title: "View Saved",
            onClick: () => router.push("/saved"),
          },
        });
      }
    } catch (error: any) {
      sileo.error({
        title: "Error",
        description: error?.response?.data?.message || "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={isLoading}
      className={`${sizeClasses[size]} flex items-center justify-center rounded-full border border-slate-200 bg-white transition-all hover:border-rose-200 hover:bg-rose-50 disabled:opacity-50 disabled:cursor-not-allowed`}
      aria-label={isSaved ? "Remove from saved" : "Save provider"}
    >
      <Heart
        size={iconSizes[size]}
        className={`transition-colors ${
          isSaved
            ? "fill-rose-500 text-rose-500"
            : "text-slate-400 hover:text-rose-500"
        }`}
      />
    </button>
  );
}
