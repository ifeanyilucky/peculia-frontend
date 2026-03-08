"use client";

import { useEffect, useState, ReactNode } from "react";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/axios";
import FullPageLoader from "@/components/common/FullPageLoader";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { identifyUser, resetUser } from "@/lib/analytics";
import { useAuthStore as useAuthStoreOriginal } from "@/store/auth.store";

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
        const user = response.data.data;
        setAuth(user, accessToken, refreshToken!);

        // Identify user on mount if authenticated
        identifyUser(user.id, {
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
        });
      } catch {
        clearAuth();
        resetUser();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Listen for logout
  useEffect(() => {
    const unsub = useAuthStoreOriginal.subscribe(
      (state) => state.isAuthenticated,
      (isAuthenticated) => {
        if (!isAuthenticated) {
          trackEvent("user_logged_out");
          resetUser();
        }
      },
    );
    return () => unsub();
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
