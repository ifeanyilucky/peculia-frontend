"use client";

import { useBookingStore } from "@/store/booking.store";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/store/auth.store";
import { ROUTES } from "@/constants/routes";

export function useBookingGuard(requiredStep: number) {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params?.slug as string;

  const { selectedServices, selectedDate, selectedSlot, _hasHydrated } =
    useBookingStore();
  
  const { isAuthenticated, _hasHydrated: authHydrated } = useAuthStore();

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!_hasHydrated || !authHydrated) return;

    const checkAuth = () => {
      if (!isAuthenticated) {
        const currentPath = `/book/${slug}`;
        const redirectUrl = `${currentPath}${window.location.search}`;
        router.replace(`${ROUTES.auth.login}?redirect=${encodeURIComponent(redirectUrl)}`);
        return false;
      }
      return true;
    };

    const checkState = () => {
      // Step 2 (Professional) requires Step 1 (Services)
      if (requiredStep >= 2 && selectedServices.length === 0) {
        router.replace(`/book/${slug}/services`);
        return false;
      }

      // Step 3 (Time) requires Step 1 (Services)
      if (requiredStep >= 3 && selectedServices.length === 0) {
        router.replace(`/book/${slug}/services`);
        return false;
      }

      // Step 4 (Confirm) requires Step 1, 2 (skipped if Any), 3
      if (requiredStep >= 4) {
        if (selectedServices.length === 0) {
          router.replace(`/book/${slug}/services`);
          return false;
        }
        if (!selectedDate || !selectedSlot) {
          router.replace(`/book/${slug}/time`);
          return false;
        }
      }

      return true;
    };

    if (!checkAuth()) return;
    if (checkState()) {
      setIsReady(true);
    }
  }, [
    _hasHydrated,
    authHydrated,
    isAuthenticated,
    requiredStep,
    selectedServices,
    selectedDate,
    selectedSlot,
    router,
    slug,
  ]);

  return { isReady, hasHydrated: _hasHydrated && authHydrated };
}
