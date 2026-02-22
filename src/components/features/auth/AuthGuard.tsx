"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import FullPageLoader from "@/components/common/FullPageLoader";
import { ROUTES } from "@/constants/routes";

type Role = "client" | "provider" | "admin";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export default function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  // Initialize lazily — if Zustand has already hydrated by the time this
  // component mounts (the common case after login), skip the loader entirely.
  const [hasHydrated, setHasHydrated] = useState<boolean>(() =>
    useAuthStore.persist.hasHydrated(),
  );

  // Subscribe to Zustand hydration completion for the rare cold-start case
  useEffect(() => {
    if (hasHydrated) return;
    const unsub = useAuthStore.persist.onFinishHydration(() =>
      setHasHydrated(true),
    );
    return unsub;
  }, [hasHydrated]);

  // Auth / role check — only runs after hydration is confirmed
  useEffect(() => {
    if (!hasHydrated) return;

    if (!isAuthenticated) {
      router.push(ROUTES.auth.login);
      return;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      // Wrong role — redirect to their correct dashboard
      const redirectMap: Record<Role, string> = {
        client: ROUTES.client.dashboard,
        provider: "/", // TODO: Redirect to partners portal
        admin: ROUTES.admin.dashboard,
      };
      router.push(redirectMap[user.role]);
      return;
    }
  }, [hasHydrated, isAuthenticated, user, allowedRoles, router]);

  // Derive authorization inline — avoids a setState inside an effect body.
  const isAuthorized =
    hasHydrated &&
    isAuthenticated &&
    (!allowedRoles || !user || allowedRoles.includes(user.role));

  if (!isAuthorized) {
    return <FullPageLoader />;
  }

  return <>{children}</>;
}
