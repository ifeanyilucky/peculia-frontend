"use client";

import { useEffect, useState, ReactNode } from "react";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/axios";
import FullPageLoader from "@/components/common/FullPageLoader";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Read everything from getState() to avoid:
    // 1. Stale closures
    // 2. Re-triggering this effect when setAuth updates accessToken in the store
    const { accessToken, setAuth, clearAuth, refreshToken } =
      useAuthStore.getState();

    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    const initAuth = async () => {
      try {
        const response = await api.get("/auth/me");
        // GET /auth/me returns the user object directly under data.data
        const user = response.data.data;
        setAuth(user, accessToken, refreshToken!);
      } catch {
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
    // Empty dep array — runs exactly once on mount.
    // All state is read from getState() so there are no stale closure issues.
  }, []);

  if (isLoading) {
    return <FullPageLoader />;
  }

  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
    >
      {children}
    </GoogleOAuthProvider>
  );
}
