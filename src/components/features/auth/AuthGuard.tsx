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
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(ROUTES.auth.login);
      return;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      // Wrong role, redirect to their home
      const redirectMap: Record<Role, string> = {
        client: ROUTES.client.dashboard,
        provider: ROUTES.provider.dashboard,
        admin: ROUTES.admin.dashboard,
      };
      router.push(redirectMap[user.role]);
      return;
    }

    setIsAuthorized(true);
  }, [isAuthenticated, user, allowedRoles, router]);

  if (!isAuthenticated || !isAuthorized) {
    return <FullPageLoader />;
  }

  return <>{children}</>;
}
