"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import FullPageLoader from "@/components/common/FullPageLoader";
import { ROUTES } from "@/constants/routes";

export default function GuestGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  const [hasHydrated, setHasHydrated] = useState<boolean>(() =>
    useAuthStore.persist.hasHydrated(),
  );

  useEffect(() => {
    if (hasHydrated) return;
    const unsub = useAuthStore.persist.onFinishHydration(() =>
      setHasHydrated(true),
    );
    return unsub;
  }, [hasHydrated]);

  useEffect(() => {
    if (!hasHydrated) return;

    if (isAuthenticated && user) {
      router.push(ROUTES.client.dashboard);
    }
  }, [hasHydrated, isAuthenticated, user, router]);

  const isAuthorized = hasHydrated && !isAuthenticated;

  if (!isAuthorized) {
    // Show a loader while checking authentication status or redirecting
    return <FullPageLoader />;
  }

  return <>{children}</>;
}
