"use client";

import { useEffect, useState, ReactNode } from "react";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/axios";
import FullPageLoader from "@/components/common/FullPageLoader";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const { accessToken, setAuth, clearAuth, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");
        const { user } = response.data.data;

        // We keep the existing tokens but update the user data
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
  }, []);

  if (isLoading) {
    return <FullPageLoader />;
  }

  return <>{children}</>;
}
