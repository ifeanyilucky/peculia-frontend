"use client";

import { useEffect, useState, ReactNode } from "react";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/axios";
import FullPageLoader from "@/components/common/FullPageLoader";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Grab store actions directly so they don't become deps (Zustand refs are stable
    // when accessed via getState(), avoiding infinite re-render loops)
    const { setAuth, clearAuth } = useAuthStore.getState();

    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    const initAuth = async () => {
      try {
        const response = await api.get("/auth/me");
        // GET /auth/me returns the user object directly under data.data
        const user = response.data.data;
        const refreshToken = useAuthStore.getState().refreshToken!;
        setAuth(user, accessToken, refreshToken);
      } catch (error) {
        console.error("Auth initialization failed:", error);
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]); // Only re-run when the token actually changes

  if (isLoading) {
    return <FullPageLoader />;
  }

  return <>{children}</>;
}
