"use client";

import { useBookingStore } from "@/store/booking.store";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export function useBookingGuard(requiredStep: number) {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const { selectedServices, selectedDate, selectedSlot, _hasHydrated } =
    useBookingStore();

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!_hasHydrated) return;

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

    if (checkState()) {
      setIsReady(true);
    }
  }, [
    _hasHydrated,
    requiredStep,
    selectedServices,
    selectedDate,
    selectedSlot,
    router,
    slug,
  ]);

  return { isReady, hasHydrated: _hasHydrated };
}
