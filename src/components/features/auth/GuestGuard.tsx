"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const redirect = searchParams?.get("redirect");

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

    if (isAuthenticated && user && !redirect) {
      if (user.role === "client") {
        router.push(ROUTES.client.dashboard);
      } else if (user.role === "provider") {
        router.push("/"); // TODO: Redirect to partners portal
      } else if (user.role === "admin") {
        router.push(ROUTES.admin.dashboard);
      }
    }
  }, [hasHydrated, isAuthenticated, user, router, redirect]);

  const isAuthorized = hasHydrated && !isAuthenticated;

  if (!isAuthorized) {
    // Show a loader while checking authentication status or redirecting
    return <FullPageLoader />;
  }

  return <>{children}</>;
}
